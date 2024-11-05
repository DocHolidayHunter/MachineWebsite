import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function AboutUs() {
  return (
    <div className="about-us my-5 p-4 border rounded">
      <h2>About Us</h2>
      <p>
        Welcome to the Flight Delay Prediction application! Our mission is to help travelers
        anticipate potential delays and make more informed travel plans. Our team combines
        expertise in data science, software development, and aviation to deliver reliable predictions.
      </p>
      <p>
        This application uses machine learning to analyze various factors that can affect
        flight punctuality, including weather conditions, operational delays, and historical
        flight data. By leveraging these insights, we strive to provide valuable information
        for a smoother travel experience.
      </p>
      <h4>Our Team</h4>
      <ul>
        <li>Nick Agiazis - Developer</li>
        <li>Atiya Amiri - Developer</li>
        <li>Alan Cherian - Developer</li>
      </ul>
      <Link to="/">
        <button className="submit-button">Back to Home</button>
      </Link>
    </div>
  );
}

export default AboutUs;
