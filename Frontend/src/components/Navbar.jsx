import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/insights', label: 'Insights' },
];

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <header className="flex justify-between items-center w-full px-4 md:px-8 h-16 sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-primary/5">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-xl md:text-lg font-black text-on-surface tracking-tight font-headline">
            Financial Atelier
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors relative pb-0.5 ${
                  isActive
                    ? 'text-on-surface font-semibold after:absolute after:bottom-[-20px] after:left-0 after:w-full after:h-0.5 after:bg-primary'
                    : 'text-slate-500 hover:text-on-surface'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">

          {/* Desktop Add Button */}
          <NavLink
            to="/add-expense"
            className="hidden sm:inline-flex items-center gap-2 bg-primary text-white rounded-full px-4 py-2 text-xs font-bold transition-all hover:bg-primary/90 hover:shadow-emerald"
          >
            <span className="material-symbols-outlined text-sm">
              add
            </span>

            New Entry
          </NavLink>

          {/* Desktop Logout */}
          <button
            onClick={handleLogout}
            className="hidden md:block text-sm font-bold text-slate-500 hover:text-on-surface transition-colors"
          >
            Logout
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden"
          >
            <span className="material-symbols-outlined text-3xl text-slate-700">
              menu
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-[280px] bg-white z-50 p-6 shadow-2xl md:hidden">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-on-surface">
                Menu
              </h2>

              <button onClick={() => setMenuOpen(false)}>
                <span className="material-symbols-outlined text-slate-700">
                  close
                </span>
              </button>
            </div>

            {/* User */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50">
              <p className="text-sm font-bold text-on-surface">
                {user?.name || 'User'}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                {user?.email}
              </p>
            </div>

            {/* Links */}
            <div className="space-y-3">

              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined">
                  person
                </span>

                Profile
              </Link>

              {/* Upgrade */}
              {user?.membershipStatus !== 'Pro' && (
                <Link
                  to="/upgrade"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-primary text-white"
                >
                  <span className="material-symbols-outlined">
                    workspace_premium
                  </span>

                  Upgrade to Pro
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <span className="material-symbols-outlined">
                  logout
                </span>

                Logout
              </button>

            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;