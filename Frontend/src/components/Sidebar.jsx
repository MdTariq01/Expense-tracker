import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/expenses', icon: 'receipt_long', label: 'Expenses' },
  { to: '/income', icon: 'payments', label: 'Income' },
  { to: '/add-expense', icon: 'add_circle', label: 'Add Expense' },
  { to: '/insights', icon: 'insights', label: 'Insights' },
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col h-screen w-56 py-8 px-6 fixed top-0 left-0 bg-sidebar text-white z-50">
      {/* Logo */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-base">account_balance_wallet</span>
          </div>
          <span className="text-base font-black text-primary-light font-headline leading-tight">
            Financial<br />Atelier
          </span>
        </div>
        <p className="text-[9px] text-slate-500 font-label uppercase tracking-[0.2em] mt-1 pl-9">
          Personal Finance
        </p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 flex flex-col gap-1">
        {navLinks.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/20 text-primary-light border-l-2 border-primary-light -ml-px'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`material-symbols-outlined text-xl transition-all ${
                    isActive ? 'text-primary-light' : 'text-slate-500 group-hover:text-white'
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {icon}
                </span>
                <span className="font-body">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto space-y-5">
        {/* Upgrade CTA */}
        <div className="bg-gradient-to-br from-primary/30 to-primary-light/10 rounded-xl p-4 border border-primary-light/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary-light text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Premium Access</p>
          </div>
          <Link to="/upgrade" className="block">
            <button className="w-full py-2 px-3 bg-primary hover:bg-primary/80 text-white rounded-lg font-semibold text-xs transition-colors shadow-lg">
              Upgrade to Pro
            </button>
          </Link>
        </div>

        {/* User Avatar */}
        <Link to="/profile" className="flex items-center gap-3 pt-4 border-t border-white/5 hover:bg-white/5 p-2 rounded-xl transition-colors group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || 'U'
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold truncate group-hover:text-primary-light transition-colors">{user?.name || 'Workspace User'}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email || 'Premium Member'}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
