import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Predictor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    DepDate: '',
    DepHour: '00',
    DepMinute: '00',
    ArrHour: '00',
    ArrMinute: '00',
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
      [name]: name.includes('Delay') || name.includes('Taxi') ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      Date: formData.DepDate,
      DepHour: parseInt(formData.DepHour),
      DepMinute: parseInt(formData.DepMinute),
      ArrHour: parseInt(formData.ArrHour),
      ArrMinute: parseInt(formData.ArrMinute),
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

  const generateTimeOptions = (limit) => Array.from({ length: limit }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="text-center mb-4">Flight Delay Prediction</h1>
          <form onSubmit={handleSubmit}>
            {/* Departure Date */}
            <div className="mb-3">
              <label className="form-label">Departure Date</label>
              <input
                type="date"
                className="form-control"
                name="DepDate"
                value={formData.DepDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Departure Time */}
            <div className="mb-3">
              <label className="form-label">Departure Time</label>
              <div className="row">
                <div className="col">
                  <select
                    className="form-select"
                    name="DepHour"
                    value={formData.DepHour}
                    onChange={handleChange}
                    required
                  >
                    {generateTimeOptions(24).map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <select
                    className="form-select"
                    name="DepMinute"
                    value={formData.DepMinute}
                    onChange={handleChange}
                    required
                  >
                    {generateTimeOptions(60).map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Scheduled Arrival Time */}
            <div className="mb-3">
              <label className="form-label">Scheduled Arrival Time</label>
              <div className="row">
                <div className="col">
                  <select
                    className="form-select"
                    name="ArrHour"
                    value={formData.ArrHour}
                    onChange={handleChange}
                    required
                  >
                    {generateTimeOptions(24).map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <select
                    className="form-select"
                    name="ArrMinute"
                    value={formData.ArrMinute}
                    onChange={handleChange}
                    required
                  >
                    {generateTimeOptions(60).map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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
 {/* Advanced Options Fields */}
 {showAdvanced && (
              <div className="advanced-options">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Taxi In (In minutes) </label>
                    <input type="number" className="form-control" name="TaxiIn" value={formData.TaxiIn} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Taxi Out (In minutes) </label>
                    <input type="number" className="form-control" name="TaxiOut" value={formData.TaxiOut} onChange={handleChange} />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Carrier Delay (In minutes)</label>
                    <input type="number" className="form-control" name="CarrierDelay" value={formData.CarrierDelay} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Weather Delay (In minutes)</label>
                    <input type="number" className="form-control" name="WeatherDelay" value={formData.WeatherDelay} onChange={handleChange} />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label">NAS Delay (In minutes) </label>
                    <input type="number" className="form-control" name="NASDelay" value={formData.NASDelay} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Late Aircraft Delay (In minutes) </label>
                    <input type="number" className="form-control" name="LateAircraftDelay" value={formData.LateAircraftDelay} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}
              </div>
            )}

            <button className="btn btn-primary w-100 mb-3" type="submit">Predict Delay</button>

            <button onClick={() => navigate('/')} className="btn btn-primary w-100 mb-3">
              Go Back to Home
            </button>
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
