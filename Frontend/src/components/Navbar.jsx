import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/insights', label: 'Insights' },
];

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center w-full px-8 h-16 sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-primary/5">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-black text-on-surface tracking-tight font-headline">
          Financial Atelier
        </span>
      </div>

      {/* Center Nav */}
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
        <NavLink
          to="/add-expense"
          className="hidden sm:inline-flex items-center gap-2 bg-primary text-white rounded-full px-4 py-2 text-xs font-bold transition-all hover:bg-primary/90 hover:shadow-emerald"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Entry
        </NavLink>
        <button
          onClick={handleLogout}
          className="text-sm font-bold text-slate-500 hover:text-on-surface transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
