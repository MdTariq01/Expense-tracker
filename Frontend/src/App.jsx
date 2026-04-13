import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import Membership from './pages/Membership';
import Landing from './pages/Landing';

// ── Protected layout wrapper (sidebar + navbar) ──────────────────────────────
const AppLayout = () => (
  <div className="flex min-h-screen bg-background">
    <Sidebar />
    <div className="flex-1 flex flex-col md:ml-56">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl flex items-center justify-around z-50 border-t border-slate-100 px-4">
        {[
          { to: '/dashboard', icon: 'dashboard', label: 'Home' },
          { to: '/expenses', icon: 'receipt_long', label: 'Exp' },
          { to: '/add-expense', icon: 'add', label: '', fab: true },
          { to: '/insights', icon: 'insights', label: 'Stats' },
        ].map((item) =>
          item.fab ? (
            <a
              key={item.to}
              href={item.to}
              className="bg-primary text-white p-3.5 rounded-2xl -mt-10 shadow-emerald"
            >
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            </a>
          ) : (
            <a
              key={item.to}
              href={item.to}
              className="flex flex-col items-center text-slate-400"
            >
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5">{item.label}</span>
            </a>
          )
        )}
      </nav>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
