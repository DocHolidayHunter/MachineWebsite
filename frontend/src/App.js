import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Main from './Main';
import Predictor from './Predictor';
import Visuals from './Visuals';
import About from './About';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Main />} />          {/* Main landing page */}
          <Route path="/predictor" element={<Predictor />} />  {/* Predictor page */}
          <Route path="/visuals" element={<Visuals />} />  {/* Visuals page */}
          <Route path="/About" element={<About />} />  {/* Visuals page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
