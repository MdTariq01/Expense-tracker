import { CATEGORY_COLORS, CATEGORY_ICONS } from '../constants';
import { useAuth } from '../context/AuthContext';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const today = new Date();
  const diff = Math.floor((today - d) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * ExpenseRow — single expense table row / list item
 * Props: expense { _id, title, amount, category, date, status, notes }
 */
const ExpenseRow = ({ expense, onEdit, onDelete, showActions = false }) => {
  const { user } = useAuth();
  const {
    _id,
    title = 'Untitled',
    amount = 0,
    category = 'Other',
    date,
    status = 'completed',
  } = expense;

  const symbol = user?.currency === 'INR' ? '₹' : '$';
  const icon = CATEGORY_ICONS[category] || 'category';
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'];
  const displayDate = formatDate(date);

  return (
    <div className="group flex items-center gap-4 py-4 hover:bg-slate-50/60 transition-colors rounded-xl px-2 -mx-2">
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-mint-light flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-on-surface truncate">{title}</p>
        <p className="text-[10px] text-slate-400 font-label font-bold uppercase tracking-widest mt-0.5">
          {category} • {displayDate}
        </p>
      </div>

      {/* Amount + Badge */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-extrabold text-error">
          -{symbol}{Math.abs(amount).toFixed(2)}
        </p>
        <span className={status === 'completed' ? 'badge-completed' : 'badge-pending'}>
          {status}
        </span>
      </div>

      {/* Actions (optional) */}
      {showActions && (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit?.(_id)}
            className="w-8 h-8 rounded-lg hover:bg-mint-light flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-base">edit</span>
          </button>
          <button
            onClick={() => onDelete?.(_id)}
            className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-error transition-colors"
            title="Delete"
          >
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseRow;
