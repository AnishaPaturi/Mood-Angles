import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

# 1. Load dataset
df = pd.read_csv("DataSet.csv")

# 2. Define features (X) and target (y)
X = df.drop(columns=["final_diagnosis"])
y = df["final_diagnosis"]

# 3. Optional: convert categorical columns (e.g., gender, family_history)
X = pd.get_dummies(X, drop_first=True)

# 4. Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 5. Train model
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# 6. Evaluate
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# 7. Save model
joblib.dump(model, "ml/angelR_model.pkl")
print("✅ Model saved to ml/angelR_model.pkl")