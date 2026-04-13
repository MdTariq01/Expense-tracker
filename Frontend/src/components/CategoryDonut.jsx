import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { DONUT_COLORS } from '../constants';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-card-hover px-3 py-2 border border-primary/5">
        <p className="text-xs font-bold text-on-surface">{payload[0].name}</p>
        <p className="text-sm font-extrabold text-primary">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

/**
 * CategoryDonut — Recharts PieChart donut with center label and legend
 * Props: data = [{ name, value }], topCategory (string)
 */
const CategoryDonut = ({ data = [], topCategory = '' }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const topPct = total > 0 && data.length > 0
    ? Math.round((data[0]?.value / total) * 100)
    : 0;

  const displayData = data;

  if (data.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">donut_large</span>
        <p className="text-sm font-bold text-slate-400">No category data</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Add expenses to see breakdown</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Donut */}
      <div className="relative flex-1 flex items-center justify-center min-h-[200px]">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={88}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              startAngle={90}
              endAngle={-270}
            >
              {displayData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg font-extrabold text-on-surface font-headline leading-tight text-center px-2">
            {topCategory || displayData[0]?.name || 'N/A'}
          </span>
          <span className="text-[10px] text-slate-400 font-label font-medium uppercase tracking-wider">
            {topPct || 42}% of total
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3 mt-4">
        {displayData.slice(0, 4).map((entry, index) => (
          <div key={entry.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }}
              />
              <span className="text-sm font-semibold text-slate-700">{entry.name}</span>
            </div>
            <span className="text-sm font-bold text-on-surface">
              ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDonut;
