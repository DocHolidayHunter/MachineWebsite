import React, { useState } from 'react';
import Form from './components/Form';
import Charts from './components/Charts';
import './App.css';

const App = () => {
  const [prediction, setPrediction] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-center text-4xl font-bold mb-6"></h1>
      <Form onPrediction={setPrediction} />
      {prediction && <Charts prediction={prediction} />}
    </div>
  );
};

export default App;
