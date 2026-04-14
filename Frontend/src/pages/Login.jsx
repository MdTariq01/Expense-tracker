import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      {/* Watermark */}
      <div className="absolute bottom-8 left-8 select-none pointer-events-none">
        <p className="text-[4rem] sm:text-[7rem] font-black text-primary/5 leading-none font-headline tracking-tighter">
          THE ART<br />OF ASSETS
        </p>
        <p className="text-xs text-slate-300 mt-4 max-w-xs font-medium leading-relaxed">
          Fine-tune your wealth portfolio at your personal finance studio. Every transaction is a stitch in the canvas of your worth.
        </p>
      </div>

      {/* Decorative pills */}
      <div className="absolute top-12 right-16 hidden lg:flex flex-col gap-2 select-none pointer-events-none">
        <div className="bg-white rounded-full px-4 py-1.5 shadow-card text-xs font-bold text-slate-400 border border-primary/5">
          ⬤ Atelier Secure
        </div>
        <div className="bg-white rounded-full px-4 py-1.5 shadow-card text-xs font-bold text-slate-400 border border-primary/5">
          ⬤ Real-time Sync
        </div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-emerald">
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
          </div>
          <h1 className="text-xl font-black text-on-surface font-headline">Financial Atelier</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Curated personal finance management</p>
        </div>

        <div className="card p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-on-surface font-headline">Welcome Back</h2>
            <p className="text-sm text-slate-500 mt-1">Log in to your private workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 font-label">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-slate-300 text-base absolute left-3 top-1/2 -translate-y-1/2">
                  alternate_email
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@studio.com"
                  required
                  className="input-base pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">
                  Security Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset functionality is coming soon. Please contact support in the meantime.')}
                  className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors tracking-widest uppercase"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined text-slate-300 text-base absolute left-3 top-1/2 -translate-y-1/2">
                  lock
                </span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="input-base pl-10"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-error/20 rounded-lg px-4 py-3 flex items-start gap-2">
                <span className="material-symbols-outlined text-error text-base mt-0.5">error</span>
                <p className="text-xs text-error font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white rounded-full py-3.5 font-bold text-sm transition-all hover:bg-primary/90 hover:shadow-emerald active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  Access Workspace
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-xs text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Begin Enrollment
            </Link>
          </p>
        </div>

        {/* Bottom badges */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
            Atelier Secure
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-light pulse-dot" />
            Real-time Sync
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
