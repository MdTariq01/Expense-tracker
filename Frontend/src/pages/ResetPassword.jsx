import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
      }

      setLoading(true);
      setError('');
      setMsg('');
      try {
          const res = await api.post(`/auth/reset-password/${token}`, { password });
          setMsg(res.data.message || "Password reset successful.");
          setTimeout(() => {
              navigate("/login");
          }, 3000);
      } catch (err) {
          setError(err.response?.data?.message || 'Token is invalid or expired. Try again.');
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
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-emerald">
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              vpn_key
            </span>
          </div>
          <h1 className="text-xl font-black text-on-surface font-headline">Financial Atelier</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Account Recovery</p>
        </div>

        <div className="card p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-on-surface font-headline">Reset Password</h2>
            <p className="text-sm text-slate-500 mt-1">Please enter your new security password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 font-label">
                New Security Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-slate-300 text-base absolute left-3 top-1/2 -translate-y-1/2">
                  lock
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-base pl-10"
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 font-label">
                Confirm Security Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-slate-300 text-base absolute left-3 top-1/2 -translate-y-1/2">
                  lock
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-base pl-10"
                />
              </div>
            </div>

            {/* Error or Success message */}
            {error && (
              <div className="bg-red-50 border border-error/20 rounded-lg px-4 py-3 flex items-start gap-2">
                <span className="material-symbols-outlined text-error text-base mt-0.5">error</span>
                <p className="text-xs text-error font-medium">{error}</p>
              </div>
            )}

            {msg && (
              <div className="bg-emerald-50 border border-emerald-500/20 rounded-lg px-4 py-3 flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-500 text-base mt-0.5">check_circle</span>
                <p className="text-xs text-emerald-700 font-medium">{msg} Redirecting to login...</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !!msg}
              className="w-full bg-primary text-white rounded-full py-3.5 font-bold text-sm transition-all hover:bg-primary/90 hover:shadow-emerald active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating…
                </>
              ) : (
                <>
                  Reset Password
                  <span className="material-symbols-outlined text-base">check</span>
                </>
              )}
            </button>
          </form>

          {/* Back to login link */}
          <p className="text-center text-xs text-slate-500 mt-6">
            <Link to="/login" className="font-bold text-primary hover:underline">
              Cancel and Return
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
