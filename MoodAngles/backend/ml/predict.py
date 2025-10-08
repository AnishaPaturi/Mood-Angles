import sys
import json
import joblib
import pandas as pd
import numpy as np
import os

# === Paths ===
MODEL_PATH = "ml/angelR_model.pkl"
FEATURE_FILE = "ml/angelR_model_features.txt"

# === 1. Load model ===
if not os.path.exists(MODEL_PATH):
    sys.stderr.write(f"Model not found at {MODEL_PATH}. Train it first using ml/train_model.py\n")
    sys.exit(1)

model = joblib.load(MODEL_PATH)

# === 2. Load feature list ===
if os.path.exists(FEATURE_FILE):
    with open(FEATURE_FILE, "r") as f:
        feature_names = [line.strip() for line in f if line.strip()]
else:
    feature_names = None

# === 3. Parse input JSON ===
if len(sys.argv) < 2:
    sys.stderr.write("No input data provided.\n")
    sys.exit(1)

try:
    scale_data = json.loads(sys.argv[1])
except Exception as e:
    sys.stderr.write(f"Invalid JSON input: {e}\n")
    sys.exit(1)

# === 4. Prepare dataframe ===
X = pd.DataFrame([scale_data])
X = X.select_dtypes(include=[np.number]).fillna(0)

if feature_names:
    for col in feature_names:
        if col not in X.columns:
            X[col] = 0
    X = X[feature_names]

# === 5. Predict ===
try:
    y_pred = model.predict(X)[0]
    if hasattr(model, "predict_proba"):
        try:
            prob = float(model.predict_proba(X)[0][1])
        except Exception:
            prob = None
    else:
        prob = None

    try:
        label_pred = int(y_pred)
    except (ValueError, TypeError):
        label_pred = 1 if str(y_pred).lower() in ["yes", "diagnosis", "positive", "true", "1"] else 0

    result = {
        "probability": float(prob) if prob is not None else None,
        "label": int(label_pred)
    }

    # ✅ Critical: write JSON once, flush, and exit
    sys.stdout.write(json.dumps(result))
    sys.stdout.flush()
    sys.exit(0)

except Exception as e:
    sys.stderr.write(f"Prediction error: {e}\n")
    sys.exit(1)
