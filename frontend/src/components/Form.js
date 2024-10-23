import React, { useState } from 'react';
import axios from 'axios';

const Form = ({ onPrediction }) => {
  const [formData, setFormData] = useState({
    DepTimeMinutes: '',
    CRSArrTimeMinutes: '',
    TaxiIn: 0,
    TaxiOut: 0,
    CarrierDelay: 0,
    WeatherDelay: 0,
    NASDelay: 0,
    LateAircraftDelay: 0,
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/predict', formData);
      onPrediction(response.data);
    } catch (err) {
      setError('Error processing prediction. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Flight Delay Prediction</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input name="DepTimeMinutes" type="number" placeholder="Departure Time (Minutes)" onChange={handleChange} required />
      <input name="CRSArrTimeMinutes" type="number" placeholder="Scheduled Arrival Time (Minutes)" onChange={handleChange} required />
      <input name="TaxiIn" type="number" placeholder="Taxi In Time" onChange={handleChange} />
      <input name="TaxiOut" type="number" placeholder="Taxi Out Time" onChange={handleChange} />
      <input name="CarrierDelay" type="number" placeholder="Carrier Delay" onChange={handleChange} />
      <input name="WeatherDelay" type="number" placeholder="Weather Delay" onChange={handleChange} />
      <input name="NASDelay" type="number" placeholder="NAS Delay" onChange={handleChange} />
      <input name="LateAircraftDelay" type="number" placeholder="Late Aircraft Delay" onChange={handleChange} />
      <button type="submit">Predict</button>
    </form>
  );
};

export default Form;
