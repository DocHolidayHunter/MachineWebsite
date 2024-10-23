from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import joblib
import pandas as pd
import numpy as np

# Initialize the FastAPI app
app = FastAPI()

# Load the trained logistic regression model
try:
    model = joblib.load('model.joblib')
except Exception as e:
    raise RuntimeError(f"Error loading model: {str(e)}")

# Define the request body for prediction
class FlightData(BaseModel):
    DepTimeMinutes: int
    CRSArrTimeMinutes: int
    TaxiIn: Optional[float] = 0.0
    TaxiOut: Optional[float] = 0.0
    CarrierDelay: Optional[float] = 0.0
    WeatherDelay: Optional[float] = 0.0
    NASDelay: Optional[float] = 0.0
    LateAircraftDelay: Optional[float] = 0.0

# Health check endpoint
@app.get("/")
def root():
    return {"message": "Flight Delay Prediction API is running."}

# Prediction endpoint
@app.post("/predict")
def predict_delay(data: FlightData):
    try:
        # Convert input data into a DataFrame
        input_df = pd.DataFrame([data.dict()])
        
        # Make predictions using the loaded model
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1]

        # Return the prediction and probability
        result = {
            "prediction": "Delayed" if prediction == 1 else "On Time",
            "probability_of_delay": round(probability, 2)
        }
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")

# Update model endpoint (PUT) - Optional
@app.put("/update_model/")
def update_model(model_path: str):
    """Endpoint to reload the model from a new file path."""
    global model
    try:
        model = joblib.load(model_path)
        return {"message": "Model updated successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating model: {str(e)}")

