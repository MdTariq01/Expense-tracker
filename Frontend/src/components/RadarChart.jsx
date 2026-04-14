import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({ data = {} }) => {
  const chartData = {
    labels: ['Essential', 'Discretionary', 'Savings', 'Buffer', 'Investment'],
    datasets: [
      {
        label: 'Allocations',
        data: [
          data.essential || 0,
          data.discretionary || 0,
          data.savings || 15,
          data.buffer || 10,
          data.investment || 5,
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        borderWidth: 2,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#10b981',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          display: false,
          stepSize: 20,
        },
        pointLabels: {
          font: {
            size: 10,
            weight: 'bold',
            family: 'Inter',
          },
          color: '#64748b',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#161d19',
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => ` ${context.raw}%`,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-full min-h-[250px] flex items-center justify-center">
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default RadarChart;
