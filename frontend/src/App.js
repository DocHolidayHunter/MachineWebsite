import React, { useState } from 'react';
import Form from './components/Form';
import { BarChart, PieChart } from './components/Chart';

const App = () => {
  const [prediction, setPrediction] = useState(null);

  const handlePrediction = (data) => {
    setPrediction(data);
  };

  return (
    <div className="App">
      <Form onPrediction={handlePrediction} />
      {prediction && (
        <>
          <h3>Prediction Result</h3>
          <BarChart prediction={prediction} />
          <PieChart prediction={prediction} />
        </>
      )}
    </div>
  );
};

export default App;
