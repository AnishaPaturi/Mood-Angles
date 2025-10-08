import sys
import json
import joblib
import pandas as pd

def main():
    try:
        print("✅ predict.py started", file=sys.stderr)

        with open("ml/input.json", "r") as f:
            data = json.load(f)

        model = joblib.load("ml/angelR_model.pkl")
        X = pd.DataFrame([data])

        if hasattr(model, "feature_names_in_"):
            trained_features = list(model.feature_names_in_)
            for col in trained_features:
                if col not in X.columns:
                    X[col] = 0
            X = X[trained_features]

        print(f"✅ Using features: {list(X.columns)}", file=sys.stderr)

        # ---- Prediction ----
        prob = float(model.predict_proba(X)[0][1])
        label = bool(model.predict(X)[0])

        # ✅ Final JSON output (stdout)
        output = {"probability": prob, "label": label}
        print(json.dumps(output))

    except Exception as e:
        err_msg = f"❌ Python Error: {str(e)}"
        print(err_msg, file=sys.stderr)
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
