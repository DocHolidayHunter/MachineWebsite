import React, { useState } from 'react';
import axios from 'axios';

const Form = ({ onPrediction }) => {
  const [formData, setFormData] = useState({
    depTime: '',
    crsArrTime: '',
    TaxiIn: 0,
    TaxiOut: 0,
    CarrierDelay: 0,
    WeatherDelay: 0,
    NASDelay: 0,
    LateAircraftDelay: 0,
  });

  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState(null);

  // Convert time to minutes from midnight
  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const transformedData = {
        DepTimeMinutes: convertTimeToMinutes(formData.depTime),
        CRSArrTimeMinutes: convertTimeToMinutes(formData.crsArrTime),
        TaxiIn: parseFloat(formData.TaxiIn),
        TaxiOut: parseFloat(formData.TaxiOut),
        CarrierDelay: parseFloat(formData.CarrierDelay),
        WeatherDelay: parseFloat(formData.WeatherDelay),
        NASDelay: parseFloat(formData.NASDelay),
        LateAircraftDelay: parseFloat(formData.LateAircraftDelay),
      };

      const response = await axios.post('http://localhost:8000/predict', transformedData);
      setPrediction(response.data);
    } catch (err) {
      setError('Error processing prediction. Please try again.');
    }
  };

  return (
    <div>
      <h2>Flight Delay Prediction</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {prediction && (
        <div>
          <p><strong>Prediction:</strong> {prediction.prediction}</p>
          <p><strong>Probability of Delay:</strong> {prediction.probability_of_delay}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label>Departure Time</label>
        <input type="time" name="depTime" onChange={handleChange} required />

        <label>Scheduled Arrival Time</label>
        <input type="time" name="crsArrTime" onChange={handleChange} required />

        <label>Taxi In Time (Minutes)</label>
        <input type="number" name="TaxiIn" min="0" onChange={handleChange} />

        <label>Taxi Out Time (Minutes)</label>
        <input type="number" name="TaxiOut" min="0" onChange={handleChange} />

        <label>Carrier Delay (Minutes)</label>
        <input type="number" name="CarrierDelay" min="0" onChange={handleChange} />

        <label>Weather Delay (Minutes)</label>
        <input type="number" name="WeatherDelay" min="0" onChange={handleChange} />

        <label>NAS Delay (Minutes)</label>
        <input type="number" name="NASDelay" min="0" onChange={handleChange} />

        <label>Late Aircraft Delay (Minutes)</label>
        <input type="number" name="LateAircraftDelay" min="0" onChange={handleChange} />

        <button type="submit">Predict</button>
      </form>
    </div>
  );
};

export default Form;
