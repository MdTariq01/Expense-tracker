import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { DONUT_COLORS } from '../constants';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

/**
 * CategoryDonut — Chart.js Doughnut chart with bespoke styling
 * Props: data = [{ name, value }], topCategory (string)
 */
const CategoryDonut = ({ data = [], topCategory = '' }) => {
  const { user } = useAuth();
  const symbol = user?.currency === 'INR' ? '₹' : '$';

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const topPct = total > 0 && data.length > 0
    ? Math.round((data[0]?.value / total) * 100)
    : 0;

  if (data.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 min-h-[300px]">
        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">donut_large</span>
        <p className="text-sm font-bold text-slate-400">No category data</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Add expenses to see breakdown</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        data: data.map(d => d.value),
        backgroundColor: DONUT_COLORS,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2,
        hoverOffset: 12,
        borderRadius: 6,
        spacing: 2,
      },
    ],
  };

  const options = {
    cutout: '75%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#ffffff',
        titleColor: '#161d19',
        bodyColor: '#64748b',
        bodyFont: {
          weight: 'bold',
        },
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        borderColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return ` ${symbol}${value.toLocaleString()}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chart Section */}
      <div className="relative flex-1 flex items-center justify-center min-h-[240px]">
        <div className="w-full h-[200px]">
          <Doughnut data={chartData} options={options} />
        </div>
        
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none fade-in" style={{ animationDelay: '500ms' }}>
          <span className="text-base font-black text-on-surface font-headline leading-tight text-center px-4 max-w-[120px] truncate">
            {topCategory || data[0]?.name || 'N/A'}
          </span>
          <span className="text-[10px] text-slate-400 font-label font-bold uppercase tracking-widest mt-0.5">
            {topPct}% of total
          </span>
        </div>
      </div>

      {/* Modern Legend Section */}
      <div className="grid grid-cols-1 gap-2.5 mt-6 px-1">
        {data.slice(0, 4).map((entry, index) => (
          <div key={entry.name} className="flex items-center justify-between group cursor-default">
            <div className="flex items-center gap-3">
              <div 
                className="w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm"
                style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }}
              />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-on-surface transition-colors">
                {entry.name}
              </span>
            </div>
            <span className="text-xs font-black text-on-surface font-headline">
              {symbol}{entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDonut;
