from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import pandas as pd
import joblib

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained logistic regression model
try:
    model = joblib.load('logistic_regression_model.joblib')
except Exception as e:
    raise RuntimeError(f"Error loading model: {str(e)}")

# Define request body for prediction
class FlightData(BaseModel):
    DepTimeMinutes: int
    CRSArrTimeMinutes: int
    TaxiIn: Optional[float] = 0.0
    TaxiOut: Optional[float] = 0.0
    CarrierDelay: Optional[float] = 0.0
    WeatherDelay: Optional[float] = 0.0
    NASDelay: Optional[float] = 0.0
    LateAircraftDelay: Optional[float] = 0.0

# Store active websocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    async def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

# Prediction Endpoint (POST)
@app.post("/predict")
async def predict_delay(data: FlightData):
    try:
        input_df = pd.DataFrame([data.dict()])
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1]

        result = {
            "prediction": "Delayed" if prediction == 1 else "On Time",
            "probability_of_delay": round(probability, 2),
        }

        # Broadcast prediction to all connected websockets
        await manager.broadcast(result)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")

# WebSocket Endpoint for Real-Time Updates
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()  # Keep the connection alive
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
