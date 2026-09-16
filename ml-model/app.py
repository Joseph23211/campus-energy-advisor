"""
Small Flask API that serves energy predictions from the trained model.

Run with: python app.py
Then POST to http://localhost:8000/predict with JSON like:
{"temperature": 28, "occupancy": 0.6, "hour_of_day": 14}
"""

from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)
model = joblib.load("model.joblib")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)

    required_fields = ["temperature", "occupancy", "hour_of_day"]
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    features = np.array([[
        data["temperature"],
        data["occupancy"],
        data["hour_of_day"],
    ]])

    prediction = model.predict(features)[0]

    return jsonify({"predicted_energy_kwh": round(float(prediction), 2)})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
