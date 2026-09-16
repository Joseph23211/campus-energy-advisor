# Energy prediction model

A simple machine learning model that predicts campus energy consumption
(in kWh) based on temperature, building occupancy, and hour of day.

## Setup
pip install -r requirements.txt

## Train the model
python train_model.py
This creates model.joblib.

## Run the prediction API
python app.py
Then send a POST request to http://localhost:8000/predict, e.g.:
{
  "temperature": 28,
  "occupancy": 0.6,
  "hour_of_day": 14
}

## Note
The training data here is synthetic (randomly generated) for demonstration.
Replace it with real historical readings from the backend's database for
a production-ready model.
