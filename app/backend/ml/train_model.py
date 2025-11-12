# ml/train_model.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score
import joblib
import os
import numpy as np

# === File paths ===
DATA_PATH = "DataSet.csv"              # Path to your uploaded dataset
OUT_MODEL = "ml/angelR_model.pkl"      # Output model file

if __name__ == "__main__":
    # === 1. Load dataset ===
    if not os.path.exists(DATA_PATH):
        raise SystemExit(f"❌ Dataset not found at {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)
    print(f"✅ Loaded dataset with shape: {df.shape}")
    print(f"Columns: {list(df.columns)}\n")

    # === 2. Automatically detect label/target column ===
    # Common label indicators: *_label, *_diagnosis, final_diagnosis, etc.
    label_cols = [c for c in df.columns if "label" in c.lower() or "diagnosis" in c.lower()]
    if not label_cols:
        raise SystemExit("❌ No label column found. Expected something like 'final_diagnosis' or 'phq9_label'.")

    # Pick the last relevant label column (most datasets have final_diagnosis at the end)
    target_col = label_cols[-1]
    print(f"🎯 Using '{target_col}' as target column\n")

    # === 3. Prepare features (X) and target (y) ===
    y = df[target_col]
    X = df.drop(columns=[target_col])

    # Drop text-based or irrelevant columns (e.g., narrative, history, etc.)
    text_cols = X.select_dtypes(include=["object"]).columns.tolist()
    if text_cols:
        print(f"🧹 Dropping text columns: {text_cols}")
        X = X.drop(columns=text_cols)

    # Keep only numeric data
    X = X.select_dtypes(include=[np.number]).fillna(0)

    # === 4. Split train/test ===
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y if len(y.unique()) <= 2 else None
    )

    # === 5. Train model ===
    print("🚀 Training RandomForest model...")
    model = RandomForestClassifier(
        n_estimators=300,
        random_state=42,
        class_weight="balanced",
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    # === 6. Evaluate ===
    preds = model.predict(X_test)
    probs = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else preds
    print("\n📊 Classification Report:")
    print(classification_report(y_test, preds))
    try:
        auc = roc_auc_score(y_test, probs)
        print(f"ROC AUC: {auc:.4f}")
    except Exception as e:
        print(f"(ROC AUC skipped: {e})")

    # === 7. Save model and feature list ===
    os.makedirs("ml", exist_ok=True)
    joblib.dump(model, OUT_MODEL)
    feature_file = OUT_MODEL.replace(".pkl", "_features.txt")
    with open(feature_file, "w") as f:
        f.write("\n".join(X.columns))
    print(f"\n✅ Model saved to: {OUT_MODEL}")
    print(f"🧾 Feature list saved to: {feature_file}")
