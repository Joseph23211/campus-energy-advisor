"""
Trains a simple linear regression model to predict campus energy
consumption (in kWh) based on temperature, occupancy, and hour of day.

Run this once to generate model.joblib, which app.py then loads.
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import joblib

# Sample training data (synthetic, for demonstration).
# Replace with real historical readings from the backend's database
# for a production-ready model.
np.random.seed(42)
n_samples = 500

temperature = np.random.uniform(18, 38, n_samples)   # degrees C
occupancy = np.random.uniform(0, 1, n_samples)         # fraction of building occupied
hour_of_day = np.random.randint(0, 24, n_samples)

energy_kwh = (
    50
    + temperature * 2.1
    + occupancy * 80
    + np.sin((hour_of_day - 6) / 24 * 2 * np.pi) * 15
    + np.random.normal(0, 5, n_samples)
)

df = pd.DataFrame({
    "temperature": temperature,
    "occupancy": occupancy,
    "hour_of_day": hour_of_day,
    "energy_kwh": energy_kwh,
})

X = df[["temperature", "occupancy", "hour_of_day"]]
y = df["energy_kwh"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

score = model.score(X_test, y_test)
print(f"Model R^2 score on test data: {score:.3f}")

joblib.dump(model, "model.joblib")
print("Saved trained model to model.joblib")
