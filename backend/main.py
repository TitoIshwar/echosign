import base64
import os
import sys
import json
import urllib.request
import time
import threading
import traceback

# ─── Suppress MediaPipe / TFLite / GLOG telemetry spam ───────────────────────
os.environ.setdefault("GLOG_minloglevel",     "3")   # suppress INFO/WARNING/ERROR
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "3")   # suppress TF logs
os.environ.setdefault("MEDIAPIPE_DISABLE_GPU", "1")   # Windows: force CPU
os.environ.setdefault("PYTHONDONTWRITEBYTECODE", "1") # no .pyc files

import numpy as np
import cv2
import joblib
import pickle
import mediapipe as mp
import psutil
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ─── CUDA / GPU availability check ───────────────────────────────────────────
try:
    import torch
    CUDA_AVAILABLE = torch.cuda.is_available()
    CUDA_DEVICE    = torch.cuda.get_device_name(0) if CUDA_AVAILABLE else "N/A"
except ImportError:
    CUDA_AVAILABLE = False
    CUDA_DEVICE    = "N/A (torch not installed)"

# -----------------------------------------------------------------------------
CV2_CUDA = cv2.cuda.getCudaEnabledDeviceCount() > 0 if hasattr(cv2, 'cuda') else False

print("[INFO] " + "-" * 59)
print("[INFO]  EchoSign Backend - startup")
print("[INFO] " + "-" * 59)
process = psutil.Process(os.getpid())
print(f"[INFO] PID            : {os.getpid()}")
print(f"[INFO] Memory at start: {process.memory_info().rss / 1024 / 1024:.1f} MB")
print(f"[INFO] CUDA (torch)   : {'YES — ' + CUDA_DEVICE if CUDA_AVAILABLE else 'NO'}")
print(f"[INFO] CUDA (cv2)     : {'YES' if CV2_CUDA else 'NO'}")
print("[INFO] NOTE: RandomForestClassifier is CPU-only (scikit-learn limitation).")
print("[INFO]       MediaPipe uses XNNPACK CPU delegate by default on Windows.")

# ─── Load labels ──────────────────────────────────────────────────────────────
BACKEND_DIR  = os.path.dirname(os.path.abspath(__file__))
LABELS_PATH  = os.path.join(BACKEND_DIR, "labels.json")

try:
    with open(LABELS_PATH, "r", encoding="utf-8") as f:
        LABEL_MAP = json.load(f)
    print(f"[INFO] labels.json    : {len(LABEL_MAP)} entries loaded from {LABELS_PATH}")
except Exception as e:
    print(f"[ERROR] Failed to load labels.json: {e}")
    sys.exit(1)

# ─── Load ML model ────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(BACKEND_DIR, "echosign_model.pkl")
stat       = os.stat(MODEL_PATH)

print(f"[INFO] Model path     : {MODEL_PATH}")
print(f"[INFO] Model size     : {stat.st_size / 1e6:.1f} MB")
print(f"[INFO] Model mtime    : {time.ctime(stat.st_mtime)}")

t0 = time.perf_counter()
try:
    model = joblib.load(MODEL_PATH)
    loader = "joblib"
except Exception:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    loader = "pickle"
load_ms = (time.perf_counter() - t0) * 1000
print(f"[INFO] Model loaded   : {load_ms:.0f} ms via {loader}")
print(f"[INFO] Model type     : {type(model).__name__}")

# Expose inner classifier if Pipeline
clf = model
if hasattr(model, 'steps'):
    step_names = [(n, type(s).__name__) for n, s in model.steps]
    print(f"[INFO] Pipeline steps : {step_names}")
    clf = model.steps[-1][1]

# Optimise Random Forest: use all CPU cores for parallel tree evaluation.
# n_jobs=-1 enables multi-core parallelism across trees in predict_proba,
# which significantly reduces single-sample inference latency.
if hasattr(clf, 'n_jobs'):
    clf.n_jobs = -1
    print(f"[INFO] Set classifier n_jobs = -1 (all CPU cores) for parallel inference.")


n_features = getattr(clf, "n_features_in_", None)
classes    = getattr(clf, "classes_", None)
n_classes  = len(classes) if classes is not None else 0
print(f"[INFO] Classifier     : {type(clf).__name__}")
print(f"[INFO] Features       : {n_features}")
print(f"[INFO] Classes        : {n_classes} -> {list(classes) if classes is not None else '?'}")

# ─── Cross-check labels.json vs model.classes_ ───────────────────────────────
print("[INFO] Cross-checking labels.json vs model.classes_...")
label_errors = 0
for i, cls in enumerate(classes):
    expected_key = str(i)           # label_map key is always "0".."34"
    mapped_value = LABEL_MAP.get(expected_key, "MISSING")
    # The model class IS the integer index; the human label is the value
    if mapped_value == "MISSING":
        print(f"[WARN] labels.json missing key '{expected_key}' for class {cls}")
        label_errors += 1
if label_errors == 0:
    print(f"[INFO] labels.json    : ALL {n_classes} keys present - OK")

# ─── Download/verify MediaPipe hand landmarker ───────────────────────────────
LANDMARKER_PATH = os.path.join(BACKEND_DIR, "hand_landmarker.task")
LANDMARKER_URL  = (
    "https://storage.googleapis.com/mediapipe-models/hand_landmarker/"
    "hand_landmarker/float16/1/hand_landmarker.task"
)
if not os.path.exists(LANDMARKER_PATH):
    print("[INFO] Downloading hand_landmarker.task (~8 MB)...")
    urllib.request.urlretrieve(LANDMARKER_URL, LANDMARKER_PATH)
    print(f"[INFO] Saved to {LANDMARKER_PATH}")
else:
    lm_size = os.path.getsize(LANDMARKER_PATH) / 1e6
    print(f"[INFO] hand_landmarker: {lm_size:.1f} MB at {LANDMARKER_PATH}")

# ─── Create MediaPipe HandLandmarker (VIDEO mode = temporal tracking) ─────────
print("[INFO] Initializing MediaPipe HandLandmarker in VIDEO mode...")
_base_opts = mp_python.BaseOptions(model_asset_path=LANDMARKER_PATH)
_lm_opts   = mp_vision.HandLandmarkerOptions(
    base_options=_base_opts,
    running_mode=mp_vision.RunningMode.VIDEO,   # enables temporal tracking
    num_hands=2,
    min_hand_detection_confidence=0.5,
    min_hand_presence_confidence=0.5,
    min_tracking_confidence=0.5,
)
landmarker = mp_vision.HandLandmarker.create_from_options(_lm_opts)
print("[INFO] MediaPipe HandLandmarker: ready")
print(f"[INFO] Memory after init: {process.memory_info().rss / 1024 / 1024:.1f} MB")
print("[INFO] " + "-" * 59)

# ─── FastAPI app ──────────────────────────────────────────────────────────────
app = FastAPI(title="EchoSign API", version="2.0.0")

# Allow all origins — works for both local dev (localhost:5173) and production.
# Restrict to specific domains in a secured production deployment if needed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# One request at a time — non-blocking so the caller gets HTTP 429 immediately
predict_lock      = threading.Lock()
_video_ts_ms: int = 0        # monotonically increasing timestamp for VIDEO mode


class PredictRequest(BaseModel):
    image: str  # base64 JPEG/PNG, with or without data-URL prefix


class PredictResponse(BaseModel):
    sign: str
    confidence: float
    hand_detected: bool
    landmarks: list
    handedness: list


# ─── /health ─────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status"    : "ok",
        "model"     : type(model).__name__,
        "classifier": type(clf).__name__,
        "n_classes" : n_classes,
        "n_features": n_features,
        "cuda"      : CUDA_AVAILABLE,
    }


# ─── /predict ────────────────────────────────────────────────────────────────
@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    global _video_ts_ms

    t_req = time.perf_counter()

    # ── Gate: drop concurrent requests cleanly ────────────────────────────────
    if not predict_lock.acquire(blocking=False):
        raise HTTPException(status_code=429, detail="busy")

    try:
        # ── Stage 1 — Base64 decode ───────────────────────────────────────────
        t0 = time.perf_counter()
        try:
            img_data = req.image
            if "," in img_data:                        # strip data-URL header
                img_data = img_data.split(",", 1)[1]
            img_bytes = base64.b64decode(img_data)
            img_arr   = np.frombuffer(img_bytes, dtype=np.uint8)
            frame_bgr = cv2.imdecode(img_arr, cv2.IMREAD_COLOR)
            if frame_bgr is None:
                raise ValueError("cv2.imdecode returned None")
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Image decode failed: {exc}")
        t_decode = (time.perf_counter() - t0) * 1000

        # ── Stage 2 — MediaPipe landmark detection (VIDEO mode) ───────────────
        t0 = time.perf_counter()
        # React's Webcam sends a horizontally mirrored screenshot. Un-flip it.
        frame_bgr = cv2.flip(frame_bgr, 1)

        # Center-crop the frame to a square aspect ratio (1:1) to match training data
        h, w = frame_bgr.shape[:2]
        if h != w:
            min_dim = min(h, w)
            start_x = (w - min_dim) // 2
            start_y = (h - min_dim) // 2
            frame_bgr = frame_bgr[start_y:start_y+min_dim, start_x:start_x+min_dim]

        frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        mp_img    = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)

        # Monotonically increasing ms timestamp required by VIDEO mode
        now_ms = int(time.time() * 1000)
        if now_ms <= _video_ts_ms:
            now_ms = _video_ts_ms + 1
        _video_ts_ms = now_ms

        result   = landmarker.detect_for_video(mp_img, now_ms)
        t_mp     = (time.perf_counter() - t0) * 1000

        if not result.hand_landmarks:
            return PredictResponse(
                sign="No hand detected", confidence=0.0,
                hand_detected=False, landmarks=[], handedness=[]
            )

        # Collect landmarks and handedness for all detected hands
        all_landmarks = []
        all_handedness = []
        for i, lm in enumerate(result.hand_landmarks):
            h_cat = result.handedness[i][0].category_name
            all_landmarks.append([{"x": float(p.x), "y": float(p.y), "z": float(p.z)} for p in lm])
            all_handedness.append(h_cat)

        # ── Stage 3 — Multi-Hand Prediction with Confidence Selection ──────────
        t0 = time.perf_counter()
        
        best_sign = None
        best_conf = -1.0
        best_lm = None
        hand_info_str = []
        
        for idx, lm in enumerate(result.hand_landmarks):
            # Extract standard raw features (NO scale/translation normalization)
            wx, wy, wz = lm[0].x, lm[0].y, lm[0].z
            raw_block = []
            norm_block = []
            for pt in lm:
                raw_block.extend((pt.x, pt.y, pt.z))
                norm_block.extend((pt.x - wx, pt.y - wy, pt.z - wz))
            
            features = np.array(raw_block + norm_block, dtype=np.float32).reshape(1, -1)
            
            # Safety pad/trim if model was trained on a slightly different count
            if n_features is not None and features.shape[1] != n_features:
                if features.shape[1] > n_features:
                    features = features[:, :n_features]
                else:
                    features = np.pad(features, ((0, 0), (0, n_features - features.shape[1])))
            
            # Run Random Forest prediction on this hand
            raw_pred = model.predict(features)[0]
            probs = model.predict_proba(features)[0]
            conf = float(np.max(probs)) * 100
            sign = LABEL_MAP.get(str(int(raw_pred)), f"Unknown({raw_pred})")
            
            h_cat = all_handedness[idx]
            hand_info_str.append(f"Hand {idx+1}({h_cat}): {sign} ({conf:.1f}%)")
            
            if conf > best_conf:
                best_conf = conf
                best_sign = sign
                best_lm = lm
                
        t_inference = (time.perf_counter() - t0) * 1000

        # ── Stage 4 — Respond & log ───────────────────────────────────────────
        t_total = (time.perf_counter() - t_req) * 1000
        mem_mb  = process.memory_info().rss / 1024 / 1024

        print(
            f"[PERF] {t_total:6.1f}ms total  "
            f"(decode {t_decode:.1f}ms | mp {t_mp:.1f}ms | inference {t_inference:.1f}ms)  "
            f"hands_detected={len(result.hand_landmarks)}  handedness={all_handedness}  "
            f"details=[{', '.join(hand_info_str)}]  "
            f"best_sign='{best_sign}'  conf={best_conf:.1f}%"
        )

        return PredictResponse(
            sign=best_sign,
            confidence=round(best_conf, 1),
            hand_detected=True,
            landmarks=all_landmarks,
            handedness=all_handedness,
        )

    except HTTPException:
        raise                                          # re-raise clean HTTP errors

    except Exception as exc:
        print(f"[ERROR] Unhandled exception in /predict: {exc}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Inference error: {exc}")

    finally:
        predict_lock.release()


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"[INFO] Starting Uvicorn on {host}:{port}")
    uvicorn.run(
        app,
        host=host,
        port=port,
        reload=False,
        log_level="warning",   # reduce noisy INFO logs from uvicorn itself
        access_log=True,
    )
