import { BrowserRouter, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import Income from './pages/Income';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import Membership from './pages/Membership';
import Terms from './pages/Terms';
import { Privacy, Philosophy } from './pages/StaticPages';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// ── Protected layout wrapper (sidebar + navbar) ──────────────────────────────
const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-56">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-200 z-50">
          
          <div className="grid grid-cols-5 items-center h-full max-w-md mx-auto">

            {/* Dashboard */}
            <Link
              to="/dashboard"
              className="flex flex-col items-center justify-center text-slate-400"
            >
              <span className="material-symbols-outlined text-2xl">
                dashboard
              </span>

              <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
                Home
              </span>
            </Link>

            {/* Expenses */}
            <Link
              to="/expenses"
              className="flex flex-col items-center justify-center text-slate-400"
            >
              <span className="material-symbols-outlined text-2xl">
                receipt_long
              </span>

              <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
                Exp
              </span>
            </Link>

            {/* Add Button */}
            <Link
              to="/add-expense"
              className="flex items-center justify-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg">
                
                <span className="material-symbols-outlined text-[28px]">
                  add
                </span>

              </div>
            </Link>

            {/* Income */}
            <Link
              to="/income"
              className="flex flex-col items-center justify-center text-slate-400"
            >
              <span className="material-symbols-outlined text-2xl">
                payments
              </span>

              <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
                Inc
              </span>
            </Link>

            {/* Insights */}
            <Link
              to="/insights"
              className="flex flex-col items-center justify-center text-slate-400"
            >
              <span className="material-symbols-outlined text-2xl">
                query_stats
              </span>

              <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
                Stats
              </span>
            </Link>

          </div>
        </nav>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/philosophy" element={<Philosophy />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected routes — all wrapped in AppLayout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/income" element={<Income />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/upgrade" element={<Membership />} />
            <Route path="/settings" element={<Profile />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
