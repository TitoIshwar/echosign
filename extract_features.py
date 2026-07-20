"""
extract_features.py
===================
Extracts 126 hand-landmark features from every image in the dataset using
the MediaPipe Tasks API (HandLandmarker) and writes the result to a CSV.

MediaPipe API: mediapipe.tasks.python.vision.HandLandmarker (IMAGE mode)
This matches the exact API used by the FastAPI backend.

Feature schema (identical to the FastAPI backend — DO NOT CHANGE):
  Indices  0 –  62 : raw x, y, z  for landmarks 0–20   (63 values)
  Indices 63 – 125 : wrist-normalised x, y, z for landmarks 0–20 (63 values)
  Total             : 126 features per sample

Optimisations:
  • Multiprocessing: each worker owns its own HandLandmarker instance.
  • Fault-tolerant: corrupted images are caught per-image and logged.
  • tqdm progress bar with live ok / no_hand / corrupt counters.
  • Labels auto-discovered from dataset sub-folder names.

Usage:
    python extract_features.py
    python extract_features.py --dataset "C:/my projects/dataset/Indian" --output features.csv
    python extract_features.py --task-model hand_landmarker.task --workers 4
"""

import argparse
import csv
import logging
import multiprocessing as mp
import os
import sys
import time
import traceback
from pathlib import Path
from typing import Optional

import cv2
import mediapipe as mp_lib
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision
import numpy as np
from tqdm import tqdm

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ── Constants (must match backend) ───────────────────────────────────────────
NUM_LANDMARKS = 21
NUM_FEATURES  = NUM_LANDMARKS * 3 * 2   # 126
IMAGE_EXTS    = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

# Minimum MediaPipe confidence — lowered for studio/cropped dataset images
MIN_DETECTION_CONF = 0.3


# ── Feature extraction (pure function — safe to call from any process) ────────

def _landmarks_to_features(hand_landmarks: list) -> list[float]:
    """
    Convert a MediaPipe Tasks landmark list to the 126-element feature vector.

    With the Tasks API, hand_landmarks[0] is already a plain Python list of
    NormalizedLandmark objects (each has .x, .y, .z).  This differs from the
    legacy API where the landmarks were accessed via .landmark.

    Layout (unchanged — matches FastAPI backend exactly):
        raw_x0, raw_y0, raw_z0, ..., raw_x20, raw_y20, raw_z20   (indices  0-62)
        nor_x0, nor_y0, nor_z0, ..., nor_x20, nor_y20, nor_z20   (indices 63-125)

    The normalised block translates every point so that landmark 0 (wrist)
    sits at the origin — identical to the transform in the FastAPI backend.
    """
    # Raw block — iterate directly (Tasks API: already a list)
    raw: list[float] = []
    for lm in hand_landmarks:
        raw.extend((lm.x, lm.y, lm.z))

    # Wrist-normalised block (landmark index 0 = wrist)
    wx, wy, wz = hand_landmarks[0].x, hand_landmarks[0].y, hand_landmarks[0].z
    norm: list[float] = []
    for lm in hand_landmarks:
        norm.extend((lm.x - wx, lm.y - wy, lm.z - wz))

    assert len(raw) == 63 and len(norm) == 63, (
        f"Expected 63 values per block, got raw={len(raw)} norm={len(norm)}"
    )
    return raw + norm


# ── Worker initialiser and task function (multiprocessing) ────────────────────

# Each worker process stores its own HandLandmarker instance here.
# Populated by _worker_init(); never shared across processes.
_worker_detector: Optional[mp_vision.HandLandmarker] = None


def _worker_init(task_model_path: str) -> None:
    """
    Called once per worker process at startup.

    Creates a HandLandmarker (IMAGE / static mode) using the MediaPipe Tasks
    API.  Each worker owns its own detector to avoid cross-process sharing.

    Args:
        task_model_path: Absolute path to hand_landmarker.task.
    """
    global _worker_detector
    base_opts = mp_python.BaseOptions(model_asset_path=task_model_path)
    opts = mp_vision.HandLandmarkerOptions(
        base_options=base_opts,
        running_mode=mp_vision.RunningMode.IMAGE,   # static image mode
        num_hands=1,                                # one hand only (matches backend)
        min_hand_detection_confidence=MIN_DETECTION_CONF,
        min_hand_presence_confidence=MIN_DETECTION_CONF,
        min_tracking_confidence=MIN_DETECTION_CONF,
    )
    _worker_detector = mp_vision.HandLandmarker.create_from_options(opts)


def _process_one_image(task: tuple[str, str]) -> dict:
    """
    Worker task: load one image, run HandLandmarker, return a result dict.

    Args:
        task: (image_path_str, class_label)

    Returns a dict with keys:
        status  : "ok" | "no_hand" | "corrupt"
        features: list[float] | None
        label   : str
        path    : str
        error   : str | None   (only when status == "corrupt")
    """
    img_path_str, label = task
    result = {
        "status": None, "features": None,
        "label": label, "path": img_path_str, "error": None,
    }

    try:
        img_bgr = cv2.imread(img_path_str)
        if img_bgr is None:
            result["status"] = "corrupt"
            result["error"]  = "cv2.imread returned None (unreadable / corrupt file)"
            return result

        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

        # Wrap in mediapipe.Image (Tasks API requirement)
        mp_image = mp_lib.Image(
            image_format=mp_lib.ImageFormat.SRGB,
            data=img_rgb,
        )
        detection = _worker_detector.detect(mp_image)

        # Tasks API: detection.hand_landmarks is a list of lists.
        # Each inner list holds 21 NormalizedLandmark objects for one hand.
        if not detection.hand_landmarks:
            result["status"] = "no_hand"
            return result

        # Use the first detected hand only (matches backend behaviour)
        features = _landmarks_to_features(detection.hand_landmarks[0])
        result["status"]   = "ok"
        result["features"] = features

    except Exception:  # noqa: BLE001 — keep processing other images
        result["status"] = "corrupt"
        result["error"]  = traceback.format_exc()

    return result


# ── Column name builder ───────────────────────────────────────────────────────

def _build_column_names() -> list[str]:
    """Return the 126 feature column names followed by 'label'."""
    axes = ("x", "y", "z")
    cols: list[str] = []
    for prefix in ("raw", "nor"):
        for i in range(NUM_LANDMARKS):
            for ax in axes:
                cols.append(f"{prefix}_lm{i:02d}_{ax}")
    return cols  # length == 126


# ── Main extraction routine ───────────────────────────────────────────────────

def extract_dataset(
    dataset_dir: Path,
    output_csv: Path,
    num_workers: int,
    task_model_path: str,
) -> None:
    """
    Walk *dataset_dir*, discover class folders automatically, extract features
    for every valid image, and write to *output_csv*.

    Expected layout:
        dataset_dir/
            <ClassName>/
                image1.jpg
                ...

    Fault tolerance:
        - Corrupt / unreadable images → logged as ERROR, skipped.
        - Images with no hand detected → logged as WARNING per class summary.
        - Processing continues for all remaining images regardless.
    """
    if not dataset_dir.is_dir():
        log.error("Dataset directory not found: %s", dataset_dir)
        sys.exit(1)

    # ── Auto-discover class labels from folder names ──────────────────────────
    classes: list[str] = sorted(
        d.name for d in dataset_dir.iterdir() if d.is_dir()
    )
    if not classes:
        log.error("No class sub-directories found in %s", dataset_dir)
        sys.exit(1)

    log.info("Auto-discovered %d classes: %s", len(classes), classes)

    # Build the full task list: (image_path_str, label)
    all_tasks: list[tuple[str, str]] = []
    for cls in classes:
        cls_dir = dataset_dir / cls
        imgs = [
            (str(p), cls)
            for p in cls_dir.iterdir()
            if p.suffix.lower() in IMAGE_EXTS
        ]
        all_tasks.extend(imgs)

    total_images = len(all_tasks)
    log.info("Total images to process: %d", total_images)
    log.info("Launching %d worker process(es) …", num_workers)

    # ── Global counters ───────────────────────────────────────────────────────
    n_extracted = 0   # hand detected → feature written to CSV
    n_no_hand   = 0   # image loaded OK but MediaPipe found no hand
    n_corrupt   = 0   # unreadable file or runtime error
    # Per-class stats for summary table
    per_class: dict[str, dict[str, int]] = {
        cls: {"total": 0, "ok": 0, "no_hand": 0, "corrupt": 0}
        for cls in classes
    }

    t_start = time.perf_counter()
    column_names = _build_column_names() + ["label"]

    with open(output_csv, "w", newline="", encoding="utf-8") as f_out:
        writer = csv.writer(f_out)
        writer.writerow(column_names)

        with mp.Pool(
            processes=num_workers,
            initializer=_worker_init,
            initargs=(task_model_path,),   # pass model path to each worker
        ) as pool:
            # tqdm wraps imap_unordered so a live progress bar is shown in the
            # terminal.  Results arrive as soon as any worker finishes an image.
            imap_iter = pool.imap_unordered(
                _process_one_image, all_tasks, chunksize=32
            )
            pbar = tqdm(
                imap_iter,
                total=total_images,
                desc="Extracting",
                unit="img",
                dynamic_ncols=True,
                bar_format=(
                    "{l_bar}{bar}| {n_fmt}/{total_fmt} "
                    "[{elapsed}<{remaining}, {rate_fmt}]"
                ),
            )
            for res in pbar:
                label = res["label"]
                per_class[label]["total"] += 1

                if res["status"] == "ok":
                    writer.writerow(res["features"] + [label])
                    n_extracted += 1
                    per_class[label]["ok"] += 1

                elif res["status"] == "no_hand":
                    n_no_hand += 1
                    per_class[label]["no_hand"] += 1
                    # Write to tqdm so it doesn't break the bar
                    tqdm.write(
                        f"[NO_HAND]  {res['path']}"
                    )

                else:  # corrupt
                    n_corrupt += 1
                    per_class[label]["corrupt"] += 1
                    err_msg = (
                        res["error"].splitlines()[-1]
                        if res["error"] else "unknown error"
                    )
                    tqdm.write(
                        f"[CORRUPT]  {res['path']}  →  {err_msg}"
                    )

                # Keep the postfix stats live on the bar
                pbar.set_postfix(
                    ok=n_extracted, no_hand=n_no_hand, corrupt=n_corrupt,
                    refresh=False,
                )

    elapsed = time.perf_counter() - t_start

    # ── Per-class summary ─────────────────────────────────────────────────────
    log.info("")
    log.info("─" * 70)
    log.info("  %-6s | %6s | %6s | %8s | %7s", "Class", "Total", "OK", "No-Hand", "Corrupt")
    log.info("─" * 70)
    for cls in classes:
        s = per_class[cls]
        log.info(
            "  %-6s | %6d | %6d | %8d | %7d",
            cls, s["total"], s["ok"], s["no_hand"], s["corrupt"],
        )

    detect_rate = (n_extracted / total_images * 100) if total_images else 0.0

    log.info("─" * 70)
    log.info("  TOTALS:")
    log.info("    Images processed (total)  : %d", total_images)
    log.info("    Features extracted (ok)   : %d  (%.1f%% detection rate)", n_extracted, detect_rate)
    log.info("    Skipped — no hand found   : %d", n_no_hand)
    log.info("    Skipped — corrupt / error : %d", n_corrupt)
    log.info("    Output CSV                : %s", output_csv)
    log.info("    Elapsed                   : %.1f seconds", elapsed)
    log.info("─" * 70)


# ── CLI ───────────────────────────────────────────────────────────────────────

def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Extract 126 MediaPipe hand-landmark features from an ISL dataset "
            "using the Tasks API HandLandmarker and multiprocessing."
        )
    )
    parser.add_argument(
        "--dataset",
        type=Path,
        default=Path(r"C:\my projects\dataset\Indian"),
        help="Root directory of the dataset (one sub-folder per class).",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("features.csv"),
        help="Output CSV file path.",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=max(1, os.cpu_count() // 2),
        help="Number of parallel worker processes (default: cpu_count // 2).",
    )
    parser.add_argument(
        "--task-model",
        type=str,
        default="hand_landmarker.task",
        help=(
            "Path to the MediaPipe hand_landmarker.task model file. "
            "Must be the same file used by your FastAPI backend. "
            "Default: hand_landmarker.task (in the current directory)."
        ),
    )
    return parser.parse_args()


if __name__ == "__main__":
    # Required on Windows — multiprocessing must be guarded under __main__
    mp.freeze_support()

    args = _parse_args()

    # Resolve and validate the .task model file before spawning workers
    task_model_resolved = str(Path(args.task_model).resolve())
    if not Path(task_model_resolved).is_file():
        log.error(
            "hand_landmarker.task not found: %s\n"
            "  Download it from:\n"
            "  https://storage.googleapis.com/mediapipe-models/hand_landmarker/"
            "hand_landmarker/float16/latest/hand_landmarker.task\n"
            "  or copy it from your FastAPI backend folder, then pass it with:\n"
            "  --task-model \"path/to/hand_landmarker.task\"",
            task_model_resolved,
        )
        sys.exit(1)

    log.info("Dataset    : %s", args.dataset)
    log.info("Output     : %s", args.output)
    log.info("Workers    : %d", args.workers)
    log.info("Task model : %s", task_model_resolved)

    extract_dataset(
        dataset_dir=args.dataset,
        output_csv=args.output,
        num_workers=args.workers,
        task_model_path=task_model_resolved,
    )
