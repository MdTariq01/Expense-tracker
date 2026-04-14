import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Filler,
  Legend,
} from 'chart.js';
import { useAuth } from '../context/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Filler,
  Legend
);

const TrendChart = ({ data = [] }) => {
  const { user } = useAuth();
  const symbol = user?.currency === 'INR' ? '₹' : '$';

  // Process data to get last 7 days spend
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const dailySpend = last7Days.map(date => {
    return data
      .filter(e => e.date.startsWith(date))
      .reduce((acc, e) => acc + Math.abs(e.amount), 0);
  });

  const chartData = {
    labels: last7Days.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        fill: true,
        label: 'Daily Spend',
        data: dailySpend,
        borderColor: '#10b981',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
          return gradient;
        },
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#10b981',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#161d19',
        padding: 12,
        cornerRadius: 12,
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 14, weight: 'black' },
        displayColors: false,
        callbacks: {
          label: (context) => ` ${symbol}${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.02)',
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
            weight: 'bold',
          },
          color: '#94a3b8',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="w-full h-full min-h-[160px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TrendChart;
