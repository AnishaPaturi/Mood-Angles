# ==========================================
# 🧠 MoodAngels - Angel.R Model Trainer (Final Fixed)
# ==========================================
# - Handles 'final_diagnosis' instead of 'label'
# - Converts text columns (like gender, family_history) to numeric
# - Trains and saves RandomForest model
# ==========================================

import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.preprocessing import LabelEncoder
import joblib

# ------------------------------------------
# 🔍 Locate dataset safely
# ------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "../DataSet.csv")

if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"❌ DataSet.csv not found at: {DATA_PATH}")

print(f"📂 Loading dataset from: {DATA_PATH}")
df = pd.read_csv(DATA_PATH)
print(f"✅ Dataset loaded successfully with {df.shape[0]} rows and {df.shape[1]} columns.\n")

# ------------------------------------------
# 🧾 Inspect columns
# ------------------------------------------
print("🧾 Columns available in dataset:")
print(df.columns.tolist(), "\n")

# ------------------------------------------
# 🧮 Prepare labels
# ------------------------------------------
if "final_diagnosis" not in df.columns:
    raise KeyError("❌ 'final_diagnosis' column not found. Please check your CSV headers.")

# Define which diagnoses count as mood disorders
mood_disorders = ["MDD", "GAD", "Mixed Features", "Depression", "Mood Disorder"]

df["label"] = df["final_diagnosis"].apply(
    lambda x: 1 if str(x).strip() in mood_disorders else 0
)

# ------------------------------------------
# 🧹 Drop irrelevant / text-heavy columns
# ------------------------------------------
drop_cols = [
    "final_diagnosis",
    "phq9_label", "phq9_symptoms", "phq9_named_scores",
    "gad7_label", "gad7_symptoms", "gad7_named_scores",
    "narrative"
]
df = df.drop(columns=[c for c in drop_cols if c in df.columns])

# ------------------------------------------
# 🔢 Encode categorical columns
# ------------------------------------------
categorical_cols = df.select_dtypes(include=["object"]).columns.tolist()
if categorical_cols:
    print(f"🧩 Encoding categorical columns: {categorical_cols}")
    le = LabelEncoder()
    for col in categorical_cols:
        df[col] = le.fit_transform(df[col].astype(str))

# ------------------------------------------
# 🧠 Split features and target
# ------------------------------------------
X = df.drop(columns=["label"])
y = df["label"]

# ------------------------------------------
# ✂️ Train/Test Split
# ------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"📊 Training samples: {X_train.shape[0]} | Testing samples: {X_test.shape[0]}")

# ------------------------------------------
# 🌲 Train RandomForest Model
# ------------------------------------------
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)
model.fit(X_train, y_train)

# ------------------------------------------
# 📈 Evaluate Model
# ------------------------------------------
y_pred = model.predict(X_test)
report = classification_report(y_test, y_pred)
print("\n🧩 Model Performance Report:")
print(report)

# ------------------------------------------
# 💾 Save Model
# ------------------------------------------
MODEL_PATH = os.path.join(BASE_DIR, "angelR_model.pkl")
joblib.dump(model, MODEL_PATH)
print(f"✅ Model saved successfully at: {MODEL_PATH}")
