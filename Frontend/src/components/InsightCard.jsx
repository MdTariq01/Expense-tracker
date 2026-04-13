/**
 * InsightCard — displays a single AI insight item
 * Props: icon (Material Symbol), title, description, urgency ('info' | 'warning' | 'success')
 */
const InsightCard = ({ icon = 'lightbulb', title, description, urgency = 'info', index = 0 }) => {
  const urgencyConfig = {
    info: {
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      dot: 'bg-blue-500',
    },
    warning: {
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      dot: 'bg-amber-500',
    },
    success: {
      iconBg: 'bg-mint-light',
      iconColor: 'text-primary',
      dot: 'bg-primary',
    },
    urgent: {
      iconBg: 'bg-red-50',
      iconColor: 'text-error',
      dot: 'bg-error',
    },
  };

  const config = urgencyConfig[urgency] || urgencyConfig.info;

  return (
    <div
      className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
        <span className={`material-symbols-outlined text-lg ${config.iconColor}`}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-bold text-on-surface">{title}</p>
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot} flex-shrink-0`} />
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default InsightCard;
