from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import joblib
import pandas as pd
from datetime import datetime
import numpy as np

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware (configure origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origin(s) in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the logistic regression model
try:
    model = joblib.load("logistic_regression_model.joblib")
except Exception as e:
    raise RuntimeError(f"Error loading model: {str(e)}")

# Mock in-memory database for storing predictions
predictions_db = []

# Define data models for request and response
class FlightData(BaseModel):
    DepHour: int
    DepMinute: int
    ArrHour: int
    ArrMinute: int
    Date: datetime
    TaxiIn: Optional[float] = 0.0
    TaxiOut: Optional[float] = 0.0
    CarrierDelay: Optional[float] = 0.0
    WeatherDelay: Optional[float] = 0.0
    NASDelay: Optional[float] = 0.0
    LateAircraftDelay: Optional[float] = 0.0

class PredictionResponse(BaseModel):
    prediction: str
    probability_of_delay: float
    details: FlightData

# Data preprocessing function
def preprocess_data(data: FlightData) -> pd.DataFrame:
    # Convert hours and minutes into total minutes from midnight
    dep_time_minutes = data.DepHour * 60 + data.DepMinute
    arr_time_minutes = data.ArrHour * 60 + data.ArrMinute

    # Prepare data as DataFrame for model input
    input_data = {
        "DepTimeMinutes": dep_time_minutes,
        "CRSArrTimeMinutes": arr_time_minutes,
        "TaxiIn": data.TaxiIn,
        "TaxiOut": data.TaxiOut,
        "CarrierDelay": data.CarrierDelay,
        "WeatherDelay": data.WeatherDelay,
        "NASDelay": data.NASDelay,
        "LateAircraftDelay": data.LateAircraftDelay,
    }
    
    return pd.DataFrame([input_data])

# Data postprocessing function
def postprocess_prediction(prediction: int, probability: float) -> dict:
    # Interpret prediction result
    prediction_text = "Delayed" if prediction == 1 else "On Time"
    
    # Prepare formatted response
    return {
        "prediction": prediction_text,
        "probability_of_delay": round(probability * 100, 2)  # Convert to percentage
    }

# Prediction endpoint (POST)
@app.post("/predict", response_model=PredictionResponse)
async def predict_delay(data: FlightData):
    try:
        # Preprocess input data
        input_df = preprocess_data(data)
        
        # Predict using the model
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1]

        # Postprocess model output
        result = postprocess_prediction(prediction, probability)

        # Construct response and save to mock database
        prediction_result = PredictionResponse(
            prediction=result["prediction"],
            probability_of_delay=result["probability_of_delay"],
            details=data
        )
        predictions_db.append(prediction_result.dict())

        return prediction_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")

# Retrieve past predictions (GET)
@app.get("/predictions", response_model=List[PredictionResponse])
async def get_past_predictions():
    return predictions_db
