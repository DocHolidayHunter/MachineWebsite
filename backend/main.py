from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import joblib
import pandas as pd

# Initialize FastAPI app
app = FastAPI()

# Configure CORS to allow requests from the frontend (e.g., React app on localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for testing; restrict in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (POST, GET, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Load the logistic regression model
try:
    model = joblib.load('logistic_regression_model.joblib')
except Exception as e:
    raise RuntimeError(f"Error loading model: {str(e)}")

# Define the request body using Pydantic
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
        # Convert the input data into a DataFrame
        input_df = pd.DataFrame([data.dict()])
        print("Received Data:", input_df)  # Debugging

        # Make predictions using the model
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1]

        # Return the prediction and probability
        result = {
            "prediction": "Delayed" if prediction == 1 else "On Time",
            "probability_of_delay": round(probability, 2)
        }
        return result
    except Exception as e:
        print(f"Error: {str(e)}")  # Debugging
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")
