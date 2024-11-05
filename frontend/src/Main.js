import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './App.css';

function Main() {
  return (
    <div className="form-container">
      <h1 className="form-title">Welcome to the Flight Delay Predictor</h1>
      <p>Click below to start predicting flight delays based on input data.</p>
      <Link to="/predictor">
        <button className="submit-button">Go to Predictor</button>
      </Link>
      <br />
      <Link to="/About">
        <button className="submit-button">About Us</button>
      </Link>
    </div>
  );
}

export default Main;
