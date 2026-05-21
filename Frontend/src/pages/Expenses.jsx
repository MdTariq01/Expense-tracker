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

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const Expenses = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('');

  const [selectedRange, setSelectedRange] = useState(3);

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);

    try {
      const range = DATE_RANGES[selectedRange];

      const params = new URLSearchParams();

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      if (range.days) {
        const date = new Date();

        date.setDate(date.getDate() - range.days);

        date.setHours(0, 0, 0, 0);

        params.append('startDate', date.toISOString());
      }

      const res = await api.get(`/expenses?${params.toString()}`);

      const rawData = res.data?.data || res.data || [];

      const expensesArray = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.expenses)
        ? rawData.expenses
        : [];

      expensesArray.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

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

  const filtered = allExpenses.filter((e) =>
    !searchQuery
      ? true
      : e.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);

      setAllExpenses((prev) =>
        prev.filter((e) => e._id !== id)
      );
    } catch {
      fetchExpenses();
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Title', 'Category', 'Amount', 'Date'],
      ...filtered.map((e) => [
        e.title,
        e.category,
        e.amount,
        formatDate(e.date),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;

    a.download = 'expenses.csv';

    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-28 fade-in">

      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
            Ledger Archive
          </p>

          <h1 className="text-4xl md:text-3xl font-black text-on-surface">
            Expenses
          </h1>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-primary/20 text-primary text-sm font-bold hover:bg-mint-light transition-colors"
          >
            <span className="material-symbols-outlined text-sm">
              upload
            </span>

            Export
          </button>

          <Link
            to="/add-expense"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-white rounded-2xl px-4 py-3 text-sm font-bold hover:bg-primary/90 transition-all"
          >
            <span className="material-symbols-outlined text-sm">
              add
            </span>

            New Entry
          </Link>

        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-6">

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
            placeholder="Search expenses..."
            className="input-base w-full pl-10 py-3"
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 gap-3">

          {/* Date */}
          <div className="relative">

            <span className="material-symbols-outlined text-slate-400 text-sm absolute left-3 top-1/2 -translate-y-1/2">
              calendar_month
            </span>

            <select
              value={selectedRange}
              onChange={(e) => {
                setSelectedRange(Number(e.target.value));

                setPage(1);
              }}
              className="input-base pl-9 py-3 pr-8 cursor-pointer appearance-none w-full"
            >
              {DATE_RANGES.map((r, i) => (
                <option key={i} value={i}>
                  {r.label}
                </option>
              ))}
            </select>

          </div>

          {/* Category */}
          <div className="relative">

            <span className="material-symbols-outlined text-slate-400 text-sm absolute left-3 top-1/2 -translate-y-1/2">
              filter_list
            </span>

            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);

                setPage(1);
              }}
              className="input-base pl-9 py-3 pr-8 cursor-pointer appearance-none w-full"
            >
              <option value="">
                All Categories
              </option>

              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

          </div>
        </div>
      </div>

      {/* Expense Cards */}
      <div className="space-y-4">

        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="card p-5 animate-pulse h-32"
            />
          ))
        ) : paginated.length === 0 ? (
          <div className="card p-10 text-center text-slate-400">

            <span className="material-symbols-outlined text-5xl mb-3 block">
              receipt_long
            </span>

            <p className="font-semibold">
              No transactions found
            </p>

            <p className="text-sm mt-1">
              Try adjusting your filters
            </p>

          </div>
        ) : (
          paginated.map((expense) => {
            const icon =
              CATEGORY_ICONS[expense.category] || 'category';

            const colors =
              CATEGORY_COLORS[expense.category] ||
              CATEGORY_COLORS['Other'];

            const symbol =
              user?.currency === 'INR' ? '₹' : '$';

            return (
              <div
                key={expense._id}
                className="card p-5 rounded-3xl border border-slate-100 bg-white shadow-sm"
              >

                {/* Top */}
                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-center gap-3 min-w-0">

                    <div className="w-12 h-12 rounded-2xl bg-mint-light flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined">
                        {icon}
                      </span>
                    </div>

                    <div className="min-w-0">

                      <p className="text-sm font-black text-on-surface truncate">
                        {expense.title}
                      </p>

                      <p className="text-xs text-slate-400 truncate mt-1">
                        {formatDate(expense.date)}
                      </p>

                    </div>
                  </div>

                  <div className="text-right">

                    <p className="text-lg font-black text-error">
                      -{symbol}
                      {Math.abs(expense.amount).toFixed(2)}
                    </p>

                  </div>
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between mt-5">

                  <span
                    className="category-pill text-[10px]"
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                    }}
                  >
                    {expense.category}
                  </span>

                  <div className="flex items-center gap-2">

                    <button
                      onClick={() =>
                        navigate(
                          `/add-expense?edit=${expense._id}`
                        )
                      }
                      className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600"
                    >
                      <span className="material-symbols-outlined text-base">
                        edit
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        setDeleteConfirm(expense._id)
                      }
                      className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500"
                    >
                      <span className="material-symbols-outlined text-base">
                        delete
                      </span>
                    </button>

                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-8">

          <button
            onClick={() =>
              setPage((p) => Math.max(p - 1, 1))
            }
            disabled={page === 1}
            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center disabled:opacity-40"
          >
            <span className="material-symbols-outlined">
              chevron_left
            </span>
          </button>

          <div className="px-4 text-sm font-bold text-slate-500">
            {page} / {totalPages}
          </div>

          <button
            onClick={() =>
              setPage((p) =>
                Math.min(p + 1, totalPages)
              )
            }
            disabled={page === totalPages}
            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center disabled:opacity-40"
          >
            <span className="material-symbols-outlined">
              chevron_right
            </span>
          </button>

        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">

          <div className="card p-6 w-full max-w-sm text-center">

            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-500 text-2xl">
                delete_forever
              </span>
            </div>

            <h3 className="text-lg font-black mb-2">
              Delete Entry?
            </h3>

            <p className="text-sm text-slate-500 mb-6">
              This transaction will be permanently removed.
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  handleDelete(deleteConfirm)
                }
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold"
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