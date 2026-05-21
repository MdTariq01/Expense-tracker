import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  INCOME_CATEGORIES,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
} from '../constants';

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

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const Income = () => {
  const { user } = useAuth();

  const [allIncomes, setAllIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('');

  const [selectedRange, setSelectedRange] = useState(3);

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Summary
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  // Form
  const [showAddModal, setShowAddModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [formTitle, setFormTitle] = useState('');

  const [formAmount, setFormAmount] = useState('');

  const [formCategory, setFormCategory] = useState('Salary');

  const [formDate, setFormDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [formDescription, setFormDescription] =
    useState('');

  const [formIsRecurring, setFormIsRecurring] =
    useState(false);

  const [formFrequency, setFormFrequency] =
    useState('monthly');

  const [formError, setFormError] = useState('');

  const [submitting, setSubmitting] =
    useState(false);

  const symbol =
    user?.currency === 'INR' ? '₹' : '$';

  // Fetch Summary
  const fetchSummaryMetrics = useCallback(
    async () => {
      try {
        const now = new Date();

        const startOfMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        ).toISOString();

        const endOfMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        ).toISOString();

        const [expRes, incSumRes] =
          await Promise.all([
            api.get(
              `/expenses?startDate=${startOfMonth}&endDate=${endOfMonth}`
            ),

            api.get('/income/summary'),
          ]);

        const expenses =
          expRes.data?.data || expRes.data || [];

        const monthlyExpTotal = expenses.reduce(
          (sum, e) => sum + e.amount,
          0
        );

        setMonthlyExpense(monthlyExpTotal);

        const incomeSummary =
          incSumRes.data?.data ||
          incSumRes.data ||
          {};

        setMonthlyIncome(
          incomeSummary.totalIncomeThisMonth || 0
        );
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  // Fetch Incomes
  const fetchIncomes = useCallback(async () => {
    setLoading(true);

    try {
      const range = DATE_RANGES[selectedRange];

      const params = new URLSearchParams();

      if (selectedCategory) {
        params.append(
          'category',
          selectedCategory
        );
      }

      if (range.days) {
        const date = new Date();

        date.setDate(
          date.getDate() - range.days
        );

        date.setHours(0, 0, 0, 0);

        params.append(
          'startDate',
          date.toISOString()
        );
      }

      const res = await api.get(
        `/income?${params.toString()}`
      );

      const rawData =
        res.data?.data || res.data || [];

      const incomesArray = Array.isArray(rawData)
        ? rawData
        : [];

      incomesArray.sort(
        (a, b) =>
          new Date(b.date) - new Date(a.date)
      );

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

  // Filter
  const filtered = allIncomes.filter((i) =>
    !searchQuery
      ? true
      : i.title
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(
    filtered.length / PAGE_SIZE
  );

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Open Add
  const handleOpenAddModal = () => {
    setEditId(null);

    setFormTitle('');

    setFormAmount('');

    setFormCategory('Salary');

    setFormDate(
      new Date().toISOString().split('T')[0]
    );

    setFormDescription('');

    setFormIsRecurring(false);

    setFormFrequency('monthly');

    setFormError('');

    setShowAddModal(true);
  };

  // Edit
  const handleOpenEditModal = (income) => {
    setEditId(income._id);

    setFormTitle(income.title);

    setFormAmount(income.amount.toString());

    setFormCategory(income.category);

    setFormDate(
      new Date(income.date)
        .toISOString()
        .split('T')[0]
    );

    setFormDescription(
      income.description || ''
    );

    setFormIsRecurring(
      income.isRecurring || false
    );

    setFormFrequency(
      income.recurringFrequency ||
        'monthly'
    );

    setShowAddModal(true);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formTitle || !formAmount) {
      setFormError(
        'Title and amount are required'
      );

      return;
    }

    setSubmitting(true);

    const payload = {
      title: formTitle,
      amount: Number(formAmount),
      category: formCategory,
      date: new Date(formDate),
      description: formDescription,
      isRecurring: formIsRecurring,
      recurringFrequency: formIsRecurring
        ? formFrequency
        : null,
    };

    try {
      if (editId) {
        await api.patch(
          `/income/${editId}`,
          payload
        );
      } else {
        await api.post('/income', payload);
      }

      setShowAddModal(false);

      fetchIncomes();

      fetchSummaryMetrics();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          'Something went wrong'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/income/${id}`);

      setAllIncomes((prev) =>
        prev.filter((i) => i._id !== id)
      );

      fetchSummaryMetrics();
    } catch {
      fetchIncomes();
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Calculations
  const netSavings =
    monthlyIncome - monthlyExpense;

  const savingsRate =
    monthlyIncome > 0
      ? (netSavings / monthlyIncome) * 100
      : 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-28 space-y-6 fade-in">

      {/* Header */}
      <div className="flex flex-col gap-4">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
            Cashflow Ledger
          </p>

          <h1 className="text-4xl md:text-3xl font-black text-on-surface">
            Income Streams
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage and audit your cash inflows.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 bg-primary text-white rounded-2xl px-4 py-3 text-sm font-bold"
        >
          <span className="material-symbols-outlined text-sm">
            add
          </span>

          Add Income
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">

        {/* Monthly Income */}
        <div className="card p-4 md:p-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Monthly Inflow
          </span>

          <div className="text-xl md:text-3xl font-black text-primary mt-2">
            {symbol}
            {monthlyIncome.toLocaleString()}
          </div>
        </div>

        {/* Expense */}
        <div className="card p-4 md:p-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Monthly Outflow
          </span>

          <div className="text-xl md:text-3xl font-black text-error mt-2">
            {symbol}
            {monthlyExpense.toLocaleString()}
          </div>
        </div>

        {/* Savings */}
        <div className="card p-4 md:p-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Net Savings
          </span>

          <div
            className={`text-xl md:text-3xl font-black mt-2 ${
              netSavings >= 0
                ? 'text-primary'
                : 'text-error'
            }`}
          >
            {symbol}
            {Math.abs(netSavings).toLocaleString()}
          </div>
        </div>

        {/* Savings Rate */}
        <div className="card p-4 md:p-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Savings Rate
          </span>

          <div className="text-xl md:text-3xl font-black mt-2">
            {savingsRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">

        {/* Search */}
        <div className="relative">

          <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">
            search
          </span>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);

              setPage(1);
            }}
            placeholder="Search income..."
            className="input-base pl-10 py-3 w-full"
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-2 gap-3">

          {/* Date */}
          <select
            value={selectedRange}
            onChange={(e) =>
              setSelectedRange(
                Number(e.target.value)
              )
            }
            className="input-base py-3"
          >
            {DATE_RANGES.map((r, i) => (
              <option key={i} value={i}>
                {r.label}
              </option>
            ))}
          </select>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value
              )
            }
            className="input-base py-3"
          >
            <option value="">
              All Categories
            </option>

            {INCOME_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block card overflow-hidden">

        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50/50">
          {[
            'Source',
            'Category',
            'Date',
            'Amount',
            'Actions',
          ].map((h) => (
            <span
              key={h}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
            >
              {h}
            </span>
          ))}
        </div>

        {paginated.map((income) => {
          const icon =
            CATEGORY_ICONS[income.category] ||
            'payments';

          const colors =
            CATEGORY_COLORS[income.category] || {
              bg: '#f1f5f9',
              text: '#475569',
            };

          return (
            <div
              key={income._id}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-4 border-b border-slate-50"
            >

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-mint-light flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">
                    {icon}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-bold">
                    {income.title}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    {income.description ||
                      'No description'}
                  </p>
                </div>
              </div>

              <span
                className="category-pill text-[10px]"
                style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                }}
              >
                {income.category}
              </span>

              <span className="text-xs text-slate-500">
                {formatDate(income.date)}
              </span>

              <span className="text-sm font-black text-primary">
                +{symbol}
                {income.amount.toFixed(2)}
              </span>

              <div className="flex items-center gap-2">

                <button
                  onClick={() =>
                    handleOpenEditModal(income)
                  }
                  className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-sm">
                    edit
                  </span>
                </button>

                <button
                  onClick={() =>
                    setDeleteConfirm(
                      income._id
                    )
                  }
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-sm">
                    delete
                  </span>
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-2 gap-3 lg:hidden">

        {paginated.map((income) => {
          const icon =
            CATEGORY_ICONS[income.category] ||
            'payments';

          const colors =
            CATEGORY_COLORS[income.category] || {
              bg: '#f1f5f9',
              text: '#475569',
            };

          return (
            <div
              key={income._id}
              className="card p-4 rounded-3xl border border-slate-100 bg-white"
            >

              <div className="flex items-start justify-between mb-4">

                <div className="w-11 h-11 rounded-2xl bg-mint-light flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">
                    {icon}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setDeleteConfirm(
                      income._id
                    )
                  }
                  className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-sm">
                    delete
                  </span>
                </button>

              </div>

              <p className="text-sm font-black line-clamp-1">
                {income.title}
              </p>

              <p className="text-[11px] text-slate-400 mt-1">
                {formatDate(income.date)}
              </p>

              <div className="mt-4">

                <span
                  className="category-pill text-[9px]"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                  }}
                >
                  {income.category}
                </span>

              </div>

              <div className="mt-5 flex items-center justify-between">

                <p className="text-lg font-black text-primary">
                  +{symbol}
                  {income.amount.toFixed(0)}
                </p>

                <button
                  onClick={() =>
                    handleOpenEditModal(income)
                  }
                  className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-sm">
                    edit
                  </span>
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showAddModal && (
  <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end lg:items-center justify-center">

    {/* Modal */}
    <div className="relative w-full lg:max-w-lg bg-white rounded-t-[2rem] lg:rounded-[2rem] shadow-2xl animate-in slide-in-from-bottom-5 max-h-[92vh] flex flex-col overflow-hidden">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between">

        <div>
          <h2 className="text-lg font-black text-on-surface">
            {editId ? 'Edit Income' : 'Add Income'}
          </h2>

          <p className="text-xs text-slate-400 mt-0.5">
            Manage your income stream
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(false)}
          className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-slate-700">
            close
          </span>
        </button>
      </div>

      {/* Scroll Area */}
      <div className="flex-1 overflow-y-auto px-5 py-5 pb-40">

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Error */}
          {formError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">
              {formError}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
              Income Title
            </label>

            <input
              type="text"
              value={formTitle}
              onChange={(e) => {
                setFormTitle(e.target.value);
                setFormError('');
              }}
              placeholder="Salary, Bonus, Freelance..."
              className="input-base w-full py-3.5 rounded-2xl"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
              Amount
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                $
              </span>

              <input
                type="number"
                step="0.01"
                value={formAmount}
                onChange={(e) => {
                  setFormAmount(e.target.value);
                  setFormError('');
                }}
                placeholder="0.00"
                className="input-base w-full py-3.5 pl-8 rounded-2xl"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
              Category
            </label>

            <select
              value={formCategory}
              onChange={(e) =>
                setFormCategory(e.target.value)
              }
              className="input-base w-full py-3.5 rounded-2xl"
            >
              {INCOME_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
              Date
            </label>

            <input
              type="date"
              value={formDate}
              onChange={(e) =>
                setFormDate(e.target.value)
              }
              className="input-base w-full py-3.5 rounded-2xl"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
              Notes
            </label>

            <textarea
              value={formDescription}
              onChange={(e) =>
                setFormDescription(
                  e.target.value
                )
              }
              placeholder="Optional details..."
              rows={4}
              className="input-base w-full resize-none rounded-2xl"
            />
          </div>

          {/* Recurring */}
          <div className="bg-slate-50 rounded-2xl p-4">

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={formIsRecurring}
                onChange={(e) =>
                  setFormIsRecurring(
                    e.target.checked
                  )
                }
                className="w-5 h-5 rounded border border-slate-300"
              />

              <div>
                <p className="text-sm font-bold text-on-surface">
                  Recurring Income
                </p>

                <p className="text-xs text-slate-400">
                  Automatically track repeating payments
                </p>
              </div>

            </label>

            {formIsRecurring && (
              <select
                value={formFrequency}
                onChange={(e) =>
                  setFormFrequency(
                    e.target.value
                  )
                }
                className="input-base w-full mt-4 py-3 rounded-2xl"
              >
                <option value="weekly">
                  Weekly
                </option>

                <option value="biweekly">
                  Bi-weekly
                </option>

                <option value="monthly">
                  Monthly
                </option>

                <option value="quarterly">
                  Quarterly
                </option>

                <option value="yearly">
                  Yearly
                </option>
              </select>
            )}
          </div>

        </form>
      </div>

      {/* Sticky Bottom Buttons */}
      <div className="sticky bottom-0 bg-white border-t border-slate-100 p-5 pb-8">

        <div className="flex gap-3">

          <button
            type="button"
            onClick={() =>
              setShowAddModal(false)
            }
            className="flex-1 h-14 rounded-2xl border border-slate-200 text-sm font-black text-slate-600"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 h-14 rounded-2xl bg-primary text-white text-sm font-black disabled:opacity-60 shadow-emerald"
          >
            {submitting
              ? 'Saving...'
              : editId
              ? 'Update Income'
              : 'Add Income'}
          </button>

        </div>
      </div>
    </div>
  </div>
      )}
    </div>
  );
};

export default Income;