import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      {/* Watermark */}
      <div className="absolute bottom-8 left-8 select-none pointer-events-none">
        <p className="text-[4rem] sm:text-[7rem] font-black text-primary/5 leading-none font-headline tracking-tighter">
          BEGIN<br />ENROLLMENT
        </p>
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
          <p className="text-xs text-slate-500 mt-1 font-medium">Create your private workspace</p>
        </div>

        <div className="card p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-on-surface font-headline">Create Account</h2>
            <p className="text-sm text-slate-500 mt-1">Join the atelier — it&apos;s free to start</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 font-label">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-slate-300 text-base absolute left-3 top-1/2 -translate-y-1/2">
                  person
                </span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Julian Vane"
                  required
                  className="input-base pl-10"
                />
              </div>
            </div>

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
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 font-label">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-slate-300 text-base absolute left-3 top-1/2 -translate-y-1/2">
                  lock
                </span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
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
                  Creating workspace…
                </>
              ) : (
                <>
                  Create Workspace
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Access Workspace
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
