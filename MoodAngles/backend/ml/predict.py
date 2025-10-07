import sys, json, joblib, pandas as pd

model = joblib.load("ml/angelR_model.pkl")
data = json.loads(sys.argv[1])
X = pd.DataFrame([data])

prob = model.predict_proba(X)[0][1]
label = bool(model.predict(X)[0])

print(json.dumps({"probability": float(prob), "label": label}))