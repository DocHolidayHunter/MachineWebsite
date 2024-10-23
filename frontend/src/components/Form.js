import React, { useState } from 'react';
import axios from 'axios';

const Form = ({ onPrediction }) => {
  const [formData, setFormData] = useState({
    depTime: '',
    crsArrTime: '',
    flightDate: '', // New date field
    TaxiIn: 0,
    TaxiOut: 0,
    CarrierDelay: 0,
    WeatherDelay: 0,
    NASDelay: 0,
    LateAircraftDelay: 0,
  });
  const [error, setError] = useState('');

  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getDayOfWeek = (date) => {
    const day = new Date(date).getDay(); // 0 = Sunday, 6 = Saturday
    return day;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const transformedData = {
        DepTimeMinutes: convertTimeToMinutes(formData.depTime),
        CRSArrTimeMinutes: convertTimeToMinutes(formData.crsArrTime),
        FlightDayOfWeek: getDayOfWeek(formData.flightDate), // Send day of week
        TaxiIn: parseFloat(formData.TaxiIn),
        TaxiOut: parseFloat(formData.TaxiOut),
        CarrierDelay: parseFloat(formData.CarrierDelay),
        WeatherDelay: parseFloat(formData.WeatherDelay),
        NASDelay: parseFloat(formData.NASDelay),
        LateAircraftDelay: parseFloat(formData.LateAircraftDelay),
      };

      const response = await axios.post('http://localhost:8000/predict', transformedData);
      onPrediction(response.data); // Pass the prediction to the parent component
    } catch (err) {
      setError('Error processing prediction. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Flight Delay Prediction</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="input-row">
        <div className="input-group">
          <label>Departure Time:</label>
          <input
            type="time"
            name="depTime"
            onChange={(e) => setFormData({ ...formData, depTime: e.target.value })}
            required
          />
        </div>

        <div className="input-group">
          <label>Scheduled Arrival Time:</label>
          <input
            type="time"
            name="crsArrTime"
            onChange={(e) => setFormData({ ...formData, crsArrTime: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="input-group">
        <label>Flight Date:</label>
        <input
          type="date"
          name="flightDate"
          onChange={(e) => setFormData({ ...formData, flightDate: e.target.value })}
          required
        />
      </div>

      <div className="input-group">
        <label>Taxi In (Minutes):</label>
        <input
          type="number"
          name="TaxiIn"
          min="0"
          onChange={(e) => setFormData({ ...formData, TaxiIn: e.target.value })}
        />
      </div>

      <button type="submit" className="submit-button">
        Predict
      </button>
    </form>
  );
};

export default Form;