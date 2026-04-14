import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import CategoryDonut from '../components/CategoryDonut';
import ExpenseRow from '../components/ExpenseRow';
import TrendChart from '../components/TrendChart';



const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSpend, setTotalSpend] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, expensesRes] = await Promise.all([
          api.get('/expenses/summary'),
          api.get('/expenses?limit=5'),
        ]);
        
        // Extract summary array: { data: { summary: [...], totalSpend: ... } }
        const summaryData = summaryRes.data?.data?.summary || summaryRes.data?.summary;
        const total = summaryRes.data?.data?.totalSpend || summaryRes.data?.totalSpend || 0;
        setSummary(Array.isArray(summaryData) ? summaryData : []);
        setTotalSpend(total);

        // Extract expenses array: { data: [...] }
        const expData = expensesRes.data?.data || expensesRes.data || [];
        setExpenses(Array.isArray(expData) ? expData.slice(0, 5) : (Array.isArray(expData?.expenses) ? expData.expenses.slice(0, 5) : []));
      } catch {
        // Clear data on error (no more mock data)
        setSummary([]);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────
  const totalBalance = totalSpend;
  const spentThisMonth = expenses
    .filter((e) => {
      const d = new Date(e.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((acc, e) => acc + e.amount, 0);

  const remainingBudget = (user?.monthlyIncome || 0) - spentThisMonth;
  const budgetParts = remainingBudget.toFixed(2).split('.');

  const donutData = Array.isArray(summary) 
    ? summary.map((s) => ({
        name: s.category || s._id,
        value: s.total || s.totalAmount || 0,
      }))
    : [];
  const topCategory = donutData[0]?.name || 'Lifestyle';

  const balanceParts = totalBalance.toFixed(2).split('.');

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-black text-on-surface font-headline">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
          {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">Here&apos;s your financial overview for today.</p>
      </div>

      {/* ── Hero Stat Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="md:col-span-2 card p-8 relative overflow-hidden group bg-white/40 backdrop-blur-xl border-white/20 shadow-emerald-sm">
          <div className="absolute right-[-8%] bottom-[-20%] opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <span className="material-symbols-outlined" style={{ fontSize: '12rem' }}>account_balance_wallet</span>
          </div>
          <div className="relative z-10">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-primary/60 font-label mb-3 block">
              Remaining Budget (Monthly)
            </span>
            <div className={`text-5xl md:text-6xl font-extrabold tracking-tighter font-headline ${remainingBudget < 0 ? 'text-error' : 'text-on-surface'}`}>
              {user?.currency === 'INR' ? '₹' : '$'}{budgetParts[0]}
              <sup className="text-2xl font-semibold align-top ml-1 text-slate-400">.{budgetParts[1]}</sup>
            </div>
            <div className="mt-6">
              {totalBalance > 0 && (
                <span className="px-3 py-1.5 bg-mint-light text-primary rounded-full text-xs font-bold inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                  Active Ledger
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Spent This Month */}
        <div className="card p-8 flex flex-col justify-between bg-white/40 backdrop-blur-xl border-white/20 shadow-emerald-sm">
          <div>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-slate-400 font-label mb-3 block">
              Spent This Month
            </span>
            <div className="text-4xl font-extrabold text-error font-headline">
              {user?.currency === 'INR' ? '₹' : '$'}{loading ? '—' : spentThisMonth.toFixed(2)}
            </div>
          </div>
          <div className="mt-4 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-base text-primary">analytics</span>
              <span>Based on your activity</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Insights Grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <div className="lg:col-span-1 card p-8 flex flex-col bg-white/40 backdrop-blur-xl border-white/20 shadow-emerald-sm">
          <h2 className="text-base font-bold mb-6 text-on-surface font-headline">Top Category</h2>
          {loading ? (
            <div className="flex-1 flex items-center justify-center min-h-[200px]">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <CategoryDonut data={donutData} topCategory={topCategory} />
          )}
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 card p-8 bg-white/40 backdrop-blur-xl border-white/20 shadow-emerald-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-on-surface font-headline">Recent Transactions</h2>
            <Link
              to="/expenses"
              className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-2/3" />
                    <div className="h-2 bg-slate-100 rounded animate-pulse w-1/3" />
                  </div>
                  <div className="h-4 bg-slate-100 rounded animate-pulse w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {expenses.map((expense) => (
                <ExpenseRow key={expense._id} expense={expense} />
              ))}
              {expenses.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2 block">receipt_long</span>
                  <p className="text-sm">No transactions yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-1 pb-16">
        {/* Workspace Analytics - Glass Chart with Trend */}
        <div className="md:col-span-3 card p-8 border border-white/40 shadow-emerald-sm relative group overflow-hidden bg-white/40 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-xl">
                <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  monitoring
                </span>
              </div>
              <div>
                <h3 className="text-sm font-black text-on-surface font-headline uppercase tracking-widest leading-none">Spending Velocity</h3>
                <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 uppercase">Analysis of last 7 intervals</p>
              </div>
            </div>
            <Link
              to="/insights"
              className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-dark transition-colors flex items-center gap-1.5"
            >
              Intelligence Engine
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          
          <div className="h-48 w-full mt-2">
            <TrendChart data={expenses} />
          </div>
        </div>

        {/* Weekly Tip - green card */}
        <div className="bg-primary p-8 rounded-2xl flex flex-col justify-between text-white shadow-emerald relative overflow-hidden">
          <span
            className="material-symbols-outlined text-4xl opacity-90 relative z-10"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
          <div className="relative z-10 mt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-2">Platform Status</p>
            <p className="font-bold text-base leading-snug">
              Your financial atelier is secure and synced across all devices.
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute right-4 top-4 w-16 h-16 bg-white/5 rounded-full blur-xl" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
