import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const BarChart = ({ prediction }) => {
  const data = {
    labels: ['On Time', 'Delayed'],
    datasets: [
      {
        label: 'Prediction Probability',
        data: [1 - prediction.probability_of_delay, prediction.probability_of_delay],
        backgroundColor: ['#4CAF50', '#F44336'],
      },
    ],
  };

  return <Bar data={data} />;
};

const PieChart = ({ prediction }) => {
  const data = {
    labels: ['On Time', 'Delayed'],
    datasets: [
      {
        label: 'Prediction Probability',
        data: [1 - prediction.probability_of_delay, prediction.probability_of_delay],
        backgroundColor: ['#4CAF50', '#F44336'],
      },
    ],
  };

  return <Pie data={data} />;
};

export { BarChart, PieChart };
