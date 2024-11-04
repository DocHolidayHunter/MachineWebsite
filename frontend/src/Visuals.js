import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

function Visuals() {
  const location = useLocation();
  const { result, formData } = location.state || {};

  // Data for Bar Chart (Delay types)
  const barData = {
    labels: ['Carrier Delay', 'Weather Delay', 'NAS Delay', 'Late Aircraft Delay'],
    datasets: [
      {
        label: 'Delay (minutes)',
        data: [formData.CarrierDelay, formData.WeatherDelay, formData.NASDelay, formData.LateAircraftDelay],
        backgroundColor: ['#007bff', '#ffc107', '#28a745', '#dc3545'],
        borderColor: '#333',
        borderWidth: 1,
      },
    ],
  };

  // Options for Bar Chart styling
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: '#333',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#333',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 5,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#333', font: { size: 12, weight: 'bold' } },
      },
      y: {
        grid: { color: '#ddd' },
        ticks: { color: '#333', font: { size: 12, weight: 'bold' } },
        beginAtZero: true,
      },
    },
  };

  // Data for Pie Chart (Probability of delay)
  const pieData = {
    labels: ['Delayed', 'On Time'],
    datasets: [
      {
        data: [result ? result.probability_of_delay * 100 : 0, result ? (1 - result.probability_of_delay) * 100 : 0],
        backgroundColor: ['#dc3545', '#28a745'],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  // Options for Pie Chart styling
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: '#333',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#333',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 5,
      },
    },
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Flight Delay Visualizations</h1>

      <div className="row justify-content-center mb-5">
        <div className="col-12 col-md-8 col-lg-6">
          <h3 className="text-center">Delay Types Distribution</h3>
          <div className="chart-container">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      <div className="row justify-content-center mb-5">
        <div className="col-12 col-md-8 col-lg-6">
          <h3 className="text-center">Probability of Delay</h3>
          <div className="chart-container">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>

      <Link to="/predictor">
        <button className="btn btn-primary w-100 mt-4">Back to Predictor</button>
      </Link>
    </div>
  );
}

export default Visuals;
