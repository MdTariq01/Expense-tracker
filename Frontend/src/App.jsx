import { BrowserRouter, Routes, Route, Navigate, Outlet, Link, NavLink } from 'react-router-dom';
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

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-xl flex items-center justify-around z-50 border-t border-slate-100 px-2 shadow-[0_-5px_30px_rgba(0,0,0,0.04)]">

          {[
            {
              to: '/dashboard',
              icon: 'dashboard',
              label: 'Home',
            },

            {
              to: '/expenses',
              icon: 'receipt_long',
              label: 'Exp',
            },

            {
              to: '/add-expense',
              icon: 'add',
              label: '',
              fab: true,
            },

            {
              to: '/income',
              icon: 'payments',
              label: 'Inc',
            },

            {
              to: '/insights',
              icon: 'insights',
              label: 'Stats',
            },
          ].map((item) =>
            item.fab ? (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex items-center justify-center w-16 h-16 rounded-3xl transition-all duration-300 ${
                    isActive
                      ? 'bg-primary scale-110 shadow-emerald'
                      : 'bg-primary'
                  }`
                }
              >
                <span className="material-symbols-outlined text-white text-3xl">
                  {item.icon}
                </span>
              </NavLink>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 transition-all duration-300 min-w-[60px] ${
                    isActive
                      ? 'text-primary'
                      : 'text-slate-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-primary/10'
                          : 'bg-transparent'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[24px] ${
                          isActive
                            ? 'text-primary'
                            : 'text-slate-400'
                        }`}
                        style={{
                          fontVariationSettings: isActive
                            ? "'FILL' 1"
                            : "'FILL' 0",
                        }}
                      >
                        {item.icon}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase tracking-[0.18em] ${
                        isActive
                          ? 'text-primary'
                          : 'text-slate-400'
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          )}
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
