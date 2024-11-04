import React, { useState } from 'react';
import Form from './components/Form';
import Charts from './components/Charts';
import './App.css';

const App = () => {
  const [prediction, setPrediction] = useState(null);
  const [name, setName] = useState(''); // New state for user name

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-center text-4xl font-bold mb-6">Welcome to the Prediction App!</h1> {/* Custom message */}
      
      <Form onPrediction={setPrediction} />

      {/* Input field for user's name */}
      <div className="text-center mb-4">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        {name && <p className="mt-2">Hello, {name}!</p>} {/* Greeting message */}
      </div>

      {prediction && <Charts prediction={prediction} />}
    </div>
  );
};

export default App;
