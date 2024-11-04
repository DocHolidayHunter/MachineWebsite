import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Predictor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    DepDateTime: '',
    ArrDateTime: '',
    TaxiIn: 0.0,
    TaxiOut: 0.0,
    CarrierDelay: 0.0,
    WeatherDelay: 0.0,
    NASDelay: 0.0,
    LateAircraftDelay: 0.0,
  });

  const [result, setResult] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'DepDateTime' || name === 'ArrDateTime' ? value : parseFloat(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Split date and time inputs into separate fields for backend
    const depDateTime = new Date(formData.DepDateTime);
    const arrDateTime = new Date(formData.ArrDateTime);

    const submissionData = {
      Date: depDateTime.toISOString().split('T')[0],  // Departure date in YYYY-MM-DD format
      DepHour: depDateTime.getHours(),
      DepMinute: depDateTime.getMinutes(),
      ArrHour: arrDateTime.getHours(),
      ArrMinute: arrDateTime.getMinutes(),
      TaxiIn: formData.TaxiIn,
      TaxiOut: formData.TaxiOut,
      CarrierDelay: formData.CarrierDelay,
      WeatherDelay: formData.WeatherDelay,
      NASDelay: formData.NASDelay,
      LateAircraftDelay: formData.LateAircraftDelay,
    };

    try {
      const response = await axios.post('http://localhost:8000/predict', submissionData);
      setResult(response.data);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="text-center mb-4">Flight Delay Prediction</h1>
          <button onClick={() => navigate('/')} className="btn btn-primary w-100 mb-3">
            Go Back to Home
          </button>
          <form onSubmit={handleSubmit}>
            {/* Departure Date and Time */}
            <div className="mb-3">
              <label className="form-label">Departure Date and Time</label>
              <input
                type="datetime-local"
                className="form-control"
                name="DepDateTime"
                value={formData.DepDateTime}
                onChange={handleChange}
                required
              />
            </div>

            {/* Scheduled Arrival Date and Time */}
            <div className="mb-3">
              <label className="form-label">Scheduled Arrival Date and Time</label>
              <input
                type="datetime-local"
                className="form-control"
                name="ArrDateTime"
                value={formData.ArrDateTime}
                onChange={handleChange}
                required
              />
            </div>

            {/* Advanced Options Toggle */}
            <div className="form-check form-switch my-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="advancedOptions"
                onChange={() => setShowAdvanced(!showAdvanced)}
              />
              <label className="form-check-label" htmlFor="advancedOptions">Show Advanced Options</label>
            </div>

            {/* Advanced Options Fields */}
            {showAdvanced && (
              <div className="advanced-options">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Taxi In</label>
                    <input type="number" className="form-control" name="TaxiIn" value={formData.TaxiIn} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Taxi Out</label>
                    <input type="number" className="form-control" name="TaxiOut" value={formData.TaxiOut} onChange={handleChange} />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Carrier Delay</label>
                    <input type="number" className="form-control" name="CarrierDelay" value={formData.CarrierDelay} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Weather Delay</label>
                    <input type="number" className="form-control" name="WeatherDelay" value={formData.WeatherDelay} onChange={handleChange} />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label">NAS Delay</label>
                    <input type="number" className="form-control" name="NASDelay" value={formData.NASDelay} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Late Aircraft Delay</label>
                    <input type="number" className="form-control" name="LateAircraftDelay" value={formData.LateAircraftDelay} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            <button className="btn btn-primary w-100 mb-3" type="submit">Predict Delay</button>
          </form>

          {result && (
            <div className="mt-4">
              <h3 className="text-center">Prediction Result</h3>
              <p className="text-center">Prediction: {result.prediction}</p>
              <p className="text-center">Probability of Delay: {result.probability_of_delay}</p>
              <Link to="/visuals" state={{ result, formData }}>
                <button className="btn btn-secondary w-100 mt-3">Show Visuals</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Predictor;
