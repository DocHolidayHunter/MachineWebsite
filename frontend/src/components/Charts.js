import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Charts = ({ prediction }) => {
  const barData = {
    labels: ['Probability of Delay'],
    datasets: [
      {
        label: 'Probability (%)',
        data: [prediction ? prediction.probability_of_delay * 100 : 0],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: ['On Time', 'Delayed'],
    datasets: [
      {
        data: prediction?.prediction === 'Delayed' ? [0, 100] : [100, 0],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const lineData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
    datasets: [
      {
        label: 'Delay Probability (%)',
        data: [10, 30, 50, 70, 90],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  return (
    <div className="charts-container">
      <div className="chart-item">
        <Bar data={barData} options={{ responsive: true }} />
      </div>
      <div className="chart-item">
        <Pie data={pieData} options={{ responsive: true }} />
      </div>
      <div className="chart-item">
        <Line data={lineData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default Charts;
