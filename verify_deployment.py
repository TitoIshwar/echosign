"""
EchoSign End-to-End Verification Script
Run: backend\.venv\Scripts\python.exe verify_deployment.py
"""
import json
import base64
import urllib.request
import urllib.error
import time
import sys

API_BASE = "http://localhost:8000"
FRONTEND = "http://localhost:5173"

def check(label, fn):
    try:
        result = fn()
        print(f"  [PASS] {label}: {result}")
        return True
    except Exception as e:
        print(f"  [FAIL] {label}: {e}")
        return False

print("\n" + "="*55)
print("  EchoSign Deployment Verification")
print("="*55)

results = []

# 1. Frontend
print("\n[1] Frontend")
results.append(check("Frontend HTTP 200", lambda: 
    urllib.request.urlopen(f"{FRONTEND}/").getcode()))

# 2. Backend health
print("\n[2] Backend")
def backend_health():
    res = urllib.request.urlopen(f"{API_BASE}/health", timeout=5)
    data = json.loads(res.read().decode())
    assert data["status"] == "ok", f"unexpected status: {data}"
    return f"n_classes={data['n_classes']}, classifier={data['classifier']}"

results.append(check("Backend /health endpoint", backend_health))

# 3. CORS headers
print("\n[3] CORS")
def cors_check():
    req = urllib.request.Request(f"{API_BASE}/health")
    req.add_header("Origin", "http://localhost:5173")
    res = urllib.request.urlopen(req, timeout=5)
    cors = res.headers.get("Access-Control-Allow-Origin", "MISSING")
    assert cors != "MISSING", "CORS header not present"
    return f"Access-Control-Allow-Origin: {cors}"

results.append(check("CORS headers present", cors_check))

# 4. Predict endpoint with a blank (black) image
print("\n[4] /predict endpoint")
def predict_blank():
    # 1x1 black pixel JPEG base64
    black_pixel = (
        "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8U"
        "HRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA"
        "Ax4BAf/EABQAAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEB"
        "AAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8AAAAAAAAA"
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        "AAAAAAAAAAAAAAAAAAAAB//Z"
    )
    payload = json.dumps({"image": black_pixel}).encode()
    req = urllib.request.Request(
        f"{API_BASE}/predict",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    res = urllib.request.urlopen(req, timeout=10)
    data = json.loads(res.read().decode())
    assert "sign" in data, "missing 'sign' field"
    assert "confidence" in data, "missing 'confidence' field"
    assert "hand_detected" in data, "missing 'hand_detected' field"
    return f"sign='{data['sign']}', hand_detected={data['hand_detected']}, confidence={data['confidence']}"

results.append(check("/predict returns valid response", predict_blank))

# Summary
print("\n" + "="*55)
passed = sum(results)
total  = len(results)
status = "DEPLOYMENT VERIFIED" if passed == total else f"ISSUES FOUND ({total-passed} failures)"
print(f"  {status}  ({passed}/{total} checks passed)")
print("="*55 + "\n")

sys.exit(0 if passed == total else 1)
