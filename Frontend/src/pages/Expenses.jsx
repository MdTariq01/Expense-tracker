import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';



const PAGE_SIZE = 10;

const DATE_RANGES = [
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'All Time', days: null },
];

const formatDate = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const Expenses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRange, setSelectedRange] = useState(3); // index into DATE_RANGES (All Time)
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const range = DATE_RANGES[selectedRange];
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (range.days) {
        // Start of the day X days ago
        const date = new Date();
        date.setDate(date.getDate() - range.days);
        date.setHours(0, 0, 0, 0);
        params.append('startDate', date.toISOString());
      }
      const res = await api.get(`/expenses?${params.toString()}`);
      const rawData = res.data?.data || res.data || [];
      const expensesArray = Array.isArray(rawData) ? rawData : (Array.isArray(rawData?.expenses) ? rawData.expenses : []);
      
      // Safety sort newest first
      expensesArray.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setAllExpenses(expensesArray);
    } catch {
      setAllExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedRange]);

  useEffect(() => {
    fetchExpenses();
    setPage(1);
  }, [fetchExpenses]);

  // ── Client-side search ─────────────────────────────────────────────────────
  const filtered = allExpenses.filter((e) =>
    !searchQuery || e.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setAllExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch {
      // optimistic removal failed — refetch
      fetchExpenses();
    } finally {
      setDeleteConfirm(null);
    }
  };

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExport = () => {
    const csv = [
      ['Title', 'Category', 'Amount', 'Date', 'Status'],
      ...filtered.map((e) => [
        e.title,
        e.category,
        e.amount,
        formatDate(e.date),
        e.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full fade-in">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-label mb-1">
            Ledger Archive
          </p>
          <h1 className="text-3xl font-black text-on-surface font-headline">Expenses</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/20 text-primary text-xs font-bold hover:bg-mint-light transition-colors"
          >
            <span className="material-symbols-outlined text-sm">upload</span>
            Export
          </button>
          <Link
            to="/add-expense"
            className="flex items-center gap-2 bg-primary text-white rounded-xl px-4 py-2.5 text-xs font-bold hover:bg-primary/90 transition-all hover:shadow-emerald"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Entry
          </Link>
        </div>
      </div>

      {/* ── Filter Bar ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined text-slate-400 text-base absolute left-3 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search by merchant or category…"
            className="input-base pl-10 py-2.5"
          />
        </div>

        {/* Date Range */}
        <div className="relative">
          <span className="material-symbols-outlined text-slate-400 text-sm absolute left-3 top-1/2 -translate-y-1/2">
            calendar_month
          </span>
          <select
            value={selectedRange}
            onChange={(e) => { setSelectedRange(Number(e.target.value)); setPage(1); }}
            className="input-base pl-9 py-2.5 pr-8 cursor-pointer appearance-none w-auto"
          >
            {DATE_RANGES.map((r, i) => (
              <option key={i} value={i}>{r.label}</option>
            ))}
          </select>
          <span className="material-symbols-outlined text-slate-400 text-sm absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            expand_more
          </span>
        </div>

        {/* Category */}
        <div className="relative">
          <span className="material-symbols-outlined text-slate-400 text-sm absolute left-3 top-1/2 -translate-y-1/2">
            filter_list
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            className="input-base pl-9 py-2.5 pr-8 cursor-pointer appearance-none w-auto"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <span className="material-symbols-outlined text-slate-400 text-sm absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="card overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50/50">
          {['Details', 'Category', 'Receipt', 'Date', 'Amount', 'Actions'].map((h) => (
            <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div className="space-y-0">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-6 py-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
                    <div className="h-2 w-20 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse self-center" />
                <div className="h-10 w-10 bg-slate-100 rounded-lg animate-pulse self-center" />
                <div className="h-3 w-20 bg-slate-100 rounded animate-pulse self-center" />
                <div className="h-4 w-16 bg-slate-100 rounded animate-pulse self-center" />
                <div className="h-4 w-12 bg-slate-100 rounded animate-pulse self-center" />
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-3 block">receipt_long</span>
            <p className="font-semibold">No transactions found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          paginated.map((expense) => {
            const icon = CATEGORY_ICONS[expense.category] || 'category';
            const colors = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS['Other'];
            const symbol = user?.currency === 'INR' ? '₹' : '$';
            return (
              <div
                key={expense._id}
                className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 items-center px-6 py-4 border-b border-slate-50 hover:bg-mint-light/20 transition-colors group"
              >
                {/* Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-mint-light flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-base">{icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">{expense.title}</p>
                    <p className="text-[10px] text-slate-400 font-label uppercase tracking-wider truncate">
                      {expense.notes || expense.category}
                    </p>
                  </div>
                </div>

                {/* Category Pill */}
                <span
                  className="category-pill text-[10px] whitespace-nowrap"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {expense.category}
                </span>

                {/* Receipt */}
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                  {expense.receiptUrl ? (
                    <img src={expense.receiptUrl} alt="Receipt" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="material-symbols-outlined text-base">receipt</span>
                  )}
                </div>

                {/* Date */}
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                  {formatDate(expense.date)}
                </span>

                {/* Amount */}
                <span className={`text-sm font-extrabold whitespace-nowrap ${isIncome ? 'text-primary' : 'text-error'}`}>
                  {isIncome ? '+' : '-'}${Math.abs(expense.amount).toFixed(2)}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => navigate(`/add-expense?edit=${expense._id}`)}
                    className="w-8 h-8 rounded-lg hover:bg-mint-light flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(expense._id)}
                    className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-error transition-colors"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Footer / Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50">
            <p className="text-xs text-slate-500 font-medium">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
              <span className="font-bold text-on-surface">{filtered.length}</span> transactions
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <span key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="text-slate-400 text-xs px-1">…</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                        page === p
                          ? 'bg-primary text-white shadow-emerald'
                          : 'text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="card p-8 w-full max-w-sm slide-up text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-error text-2xl">delete_forever</span>
            </div>
            <h3 className="text-lg font-black font-headline text-on-surface mb-2">Delete Entry?</h3>
            <p className="text-sm text-slate-500 mb-6">This transaction will be permanently removed from your ledger.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 rounded-xl bg-error text-white text-sm font-bold hover:bg-error/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
