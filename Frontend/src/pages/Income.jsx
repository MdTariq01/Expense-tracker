import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { INCOME_CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';

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

const Income = () => {
  const { user } = useAuth();
  const [allIncomes, setAllIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRange, setSelectedRange] = useState(3); // index into DATE_RANGES (All Time)
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Summary Metrics
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  // Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState('Salary');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDescription, setFormDescription] = useState('');
  const [formIsRecurring, setFormIsRecurring] = useState(false);
  const [formFrequency, setFormFrequency] = useState('monthly');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch Income and Expenses for Summary ──────────────────────────────────
  const fetchSummaryMetrics = useCallback(async () => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const [expRes, incSumRes] = await Promise.all([
        api.get(`/expenses?startDate=${startOfMonth}&endDate=${endOfMonth}`),
        api.get('/income/summary'),
      ]);

      const expenses = expRes.data?.data || expRes.data || [];
      const monthlyExpTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
      setMonthlyExpense(monthlyExpTotal);

      const incomeSummary = incSumRes.data?.data || incSumRes.data || {};
      setMonthlyIncome(incomeSummary.totalIncomeThisMonth || 0);
    } catch (err) {
      console.error('Error fetching summary metrics:', err);
    }
  }, []);

  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    try {
      const range = DATE_RANGES[selectedRange];
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (range.days) {
        const date = new Date();
        date.setDate(date.getDate() - range.days);
        date.setHours(0, 0, 0, 0);
        params.append('startDate', date.toISOString());
      }
      const res = await api.get(`/income?${params.toString()}`);
      const rawData = res.data?.data || res.data || [];
      const incomesArray = Array.isArray(rawData) ? rawData : [];

      incomesArray.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAllIncomes(incomesArray);
    } catch {
      setAllIncomes([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedRange]);

  useEffect(() => {
    fetchIncomes();
    fetchSummaryMetrics();
    setPage(1);
  }, [fetchIncomes, fetchSummaryMetrics]);

  // ── Client-side search ─────────────────────────────────────────────────────
  const filtered = allIncomes.filter((i) =>
    !searchQuery || i.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Create or Update ───────────────────────────────────────────────────────
  const handleOpenAddModal = () => {
    setEditId(null);
    setFormTitle('');
    setFormAmount('');
    setFormCategory('Salary');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDescription('');
    setFormIsRecurring(false);
    setFormFrequency('monthly');
    setFormError('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (income) => {
    setEditId(income._id);
    setFormTitle(income.title);
    setFormAmount(income.amount.toString());
    setFormCategory(income.category);
    setFormDate(new Date(income.date).toISOString().split('T')[0]);
    setFormDescription(income.description || '');
    setFormIsRecurring(income.isRecurring || false);
    setFormFrequency(income.recurringFrequency || 'monthly');
    setFormError('');
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle || !formAmount) {
      setFormError('Title and amount are required');
      return;
    }
    if (isNaN(formAmount) || Number(formAmount) <= 0) {
      setFormError('Amount must be a positive number');
      return;
    }

    setSubmitting(true);
    setFormError('');

    const payload = {
      title: formTitle,
      amount: Number(formAmount),
      category: formCategory,
      date: new Date(formDate),
      description: formDescription,
      isRecurring: formIsRecurring,
      recurringFrequency: formIsRecurring ? formFrequency : null,
    };

    try {
      if (editId) {
        await api.patch(`/income/${editId}`, payload);
      } else {
        await api.post('/income', payload);
      }
      setShowAddModal(false);
      fetchIncomes();
      fetchSummaryMetrics();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await api.delete(`/income/${id}`);
      setAllIncomes((prev) => prev.filter((i) => i._id !== id));
      fetchSummaryMetrics();
    } catch {
      fetchIncomes();
    } finally {
      setDeleteConfirm(null);
    }
  };

  // ── Summary Cards Calculations ─────────────────────────────────────────────
  const netSavings = monthlyIncome - monthlyExpense;
  const savingsRate = monthlyIncome > 0 ? (netSavings / monthlyIncome) * 100 : 0;
  const symbol = user?.currency === 'INR' ? '₹' : '$';

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 fade-in">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-label mb-1">
            Cashflow Ledger
          </p>
          <h1 className="text-3xl font-black text-on-surface font-headline">Income Streams</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and audit your cash inflows and recurring streams.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-primary text-white rounded-xl px-5 py-3 text-xs font-bold hover:bg-primary/90 transition-all hover:shadow-emerald"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Income
        </button>
      </div>

      {/* ── Monthly Summary Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Monthly Income */}
        <div className="card p-6 bg-white/40 backdrop-blur-xl border-white/20 shadow-emerald-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Monthly Inflow</span>
            <div className="text-3xl font-black text-primary font-headline mt-2">
              {symbol}{monthlyIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-3 border-t border-slate-50 pt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">calendar_month</span> Current month total
          </p>
        </div>

        {/* Total Monthly Expense */}
        <div className="card p-6 bg-white/40 backdrop-blur-xl border-white/20 shadow-emerald-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Monthly Outflow</span>
            <div className="text-3xl font-black text-error font-headline mt-2">
              {symbol}{monthlyExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-3 border-t border-slate-50 pt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">trending_down</span> Current month expenses
          </p>
        </div>

        {/* Net Savings */}
        <div className="card p-6 bg-white/40 backdrop-blur-xl border-white/20 shadow-emerald-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Net Savings</span>
            <div className={`text-3xl font-black font-headline mt-2 ${netSavings >= 0 ? 'text-primary' : 'text-error'}`}>
              {netSavings < 0 ? '-' : ''}{symbol}{Math.abs(netSavings).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-3 border-t border-slate-50 pt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">balance</span> Remaining liquid capital
          </p>
        </div>

        {/* Savings Rate % */}
        <div className="card p-6 bg-white/40 backdrop-blur-xl border-white/20 shadow-emerald-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Savings Rate</span>
            <div className="text-3xl font-black text-on-surface font-headline mt-2">
              {savingsRate.toFixed(1)}%
            </div>
          </div>
          <div className="mt-3 border-t border-slate-50 pt-2 flex items-center justify-between">
            <div className="h-1.5 bg-slate-100 rounded-full flex-1 mr-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${savingsRate >= 20 ? 'bg-primary' : 'bg-amber-400'}`} 
                style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
              />
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              {savingsRate >= 20 ? 'Healthy' : 'Raise Rate'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined text-slate-400 text-base absolute left-3 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search by source or category…"
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
            {INCOME_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <span className="material-symbols-outlined text-slate-400 text-sm absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="card overflow-hidden bg-white/40 backdrop-blur-xl border-white/20">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50/50">
          {['Source / Merchant', 'Category', 'Date', 'Amount', 'Actions'].map((h) => (
            <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {h}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="space-y-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse" />
                  <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse self-center" />
                <div className="h-3 w-20 bg-slate-100 rounded animate-pulse self-center" />
                <div className="h-4 w-16 bg-slate-100 rounded animate-pulse self-center" />
                <div className="h-4 w-12 bg-slate-100 rounded animate-pulse self-center" />
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-3 block text-slate-300">payments</span>
            <p className="font-semibold text-on-surface">No income items logged</p>
            <p className="text-xs mt-1">Click &ldquo;Add Income&rdquo; above to record your first stream.</p>
          </div>
        ) : (
          paginated.map((income) => {
            const icon = CATEGORY_ICONS[income.category] || 'payments';
            const colors = CATEGORY_COLORS[income.category] || { bg: '#f1f5f9', text: '#475569' };
            return (
              <div
                key={income._id}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-4 border-b border-slate-50 hover:bg-mint-light/20 transition-colors group"
              >
                {/* Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-mint-light flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-base">{icon}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-on-surface truncate">{income.title}</p>
                      {income.isRecurring && (
                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded-md uppercase tracking-wider whitespace-nowrap">
                          {income.recurringFrequency}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      {income.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                {/* Category Pill */}
                <span
                  className="category-pill text-[10px] whitespace-nowrap"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {income.category}
                </span>

                {/* Date */}
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                  {formatDate(income.date)}
                </span>

                {/* Amount */}
                <span className="text-sm font-extrabold whitespace-nowrap text-primary">
                  +{symbol}{income.amount.toFixed(2)}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(income)}
                    className="w-8 h-8 rounded-lg hover:bg-mint-light flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(income._id)}
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

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50">
            <p className="text-xs text-slate-500 font-medium">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
              <span className="font-bold text-on-surface">{filtered.length}</span> income items
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                    page === p ? 'bg-primary text-white shadow-emerald' : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
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

      {/* ── Add / Edit Modal ──────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="card p-8 w-full max-w-md slide-up bg-white relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="text-xl font-black font-headline text-on-surface mb-6">
              {editId ? 'Modify Income Stream' : 'Record Income Stream'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <p className="text-xs font-bold text-error bg-error/10 p-3 rounded-lg flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">error</span>
                  {formError}
                </p>
              )}

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">Source Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Acme Corp Contract, Stock Dividend"
                  className="input-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">Amount ({symbol})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="2500.00"
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="input-base cursor-pointer"
                  >
                    {INCOME_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">Received Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="input-base cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">Description (Optional)</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows="2"
                  placeholder="Add extra context or details…"
                  className="input-base"
                />
              </div>

              {/* Recurring Switch */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-on-surface">Recurring Income Stream</label>
                  <p className="text-[10px] text-slate-400">Mark to log or project automatically in the future</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formIsRecurring}
                    onChange={(e) => setFormIsRecurring(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {formIsRecurring && (
                <div className="slide-up">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">Frequency</label>
                  <select
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value)}
                    className="input-base cursor-pointer"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-emerald flex items-center justify-center gap-1.5"
                >
                  {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {editId ? 'Update' : 'Log Stream'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="card p-8 w-full max-w-sm slide-up text-center bg-white">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-error text-2xl">delete_forever</span>
            </div>
            <h3 className="text-lg font-black font-headline text-on-surface mb-2">Delete Income Stream?</h3>
            <p className="text-sm text-slate-500 mb-6">This item will be permanently removed from your income ledger.</p>
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

export default Income;
