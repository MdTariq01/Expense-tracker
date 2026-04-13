/**
 * StatCard — hero stat card with large number, superscript cents, and trend badge
 * Props: label, value (string like "42,950"), cents (string like ".84"), trend, trendUp, isError
 */
const StatCard = ({
  label,
  value,
  cents,
  trend,
  trendUp = true,
  isError = false,
  icon = 'account_balance_wallet',
  className = '',
}) => {
  return (
    <div className={`card p-8 relative overflow-hidden group ${className}`}>
      {/* Background ghost icon */}
      <div className="absolute right-[-8%] bottom-[-20%] opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
        <span className="material-symbols-outlined" style={{ fontSize: '12rem' }}>{icon}</span>
      </div>

      <div className="relative z-10">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-primary/60 font-label mb-3 block">
          {label}
        </span>

        <div className={`font-headline font-extrabold tracking-tighter ${isError ? 'text-error' : 'text-on-surface'} ${cents ? 'text-5xl' : 'text-4xl'}`}>
          ${value}
          {cents && (
            <sup className="text-xl font-semibold align-top ml-1 text-slate-400">{cents}</sup>
          )}
        </div>

        {trend && (
          <div className="mt-5">
            {trendUp ? (
              <span className="px-3 py-1.5 bg-mint-light text-primary rounded-full text-xs font-bold inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  trending_up
                </span>
                {trend}
              </span>
            ) : (
              <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium mt-2 border-t border-slate-100 pt-4">
                <span className="material-symbols-outlined text-base text-error">trending_up</span>
                <span>{trend}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
