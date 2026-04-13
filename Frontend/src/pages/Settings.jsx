import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Settings = () => {
  const { user, setUser: updateLocalUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile fields
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    monthlyIncome: user?.monthlyIncome || 0,
    currency: user?.currency || 'USD',
    taxRate: user?.taxRate || 0,
    twoFactorEnabled: user?.twoFactorEnabled || false,
  });

  // Password fields
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.patch('/auth/profile', profile);
      // Backend returns ApiResponse(200, user, "...")
      const updatedUser = res.data?.data || res.data;
      
      // Update local context
      updateLocalUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async () => {
    if (!passwords.newPassword || passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }
    setLoading(true);
    try {
      await api.patch('/auth/password', passwords);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto w-full fade-in pb-24">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-on-surface font-headline mb-2">Account Settings</h1>
        <p className="text-slate-500 text-sm">Manage your personal atelier and financial preferences.</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-3 slide-up ${
          message.type === 'success' ? 'bg-mint-light text-primary' : 'bg-red-50 text-error'
        }`}>
          <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* ── Personal Info ────────────────────────────────────────────────── */}
        <section className="card p-8 group">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-slate-50">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="md:col-span-2 mb-2">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-label mb-1">Personal Information</h2>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="input-base w-full bg-slate-50 border-transparent focus:bg-white"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled
                  className="input-base w-full bg-slate-100 border-transparent cursor-not-allowed text-slate-400"
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Financial Parameters ─────────────────────────────────────────── */}
        <section className="card p-8">
          <div className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-label">Financial Parameters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Monthly Net Income</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={profile.monthlyIncome}
                  onChange={handleProfileChange}
                  className="input-base w-full pl-8 bg-slate-50 border-transparent focus:bg-white font-bold"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Base Currency</label>
              <div className="relative">
                <select
                  name="currency"
                  value={profile.currency}
                  onChange={handleProfileChange}
                  className="input-base w-full bg-slate-50 border-transparent focus:bg-white appearance-none pr-10"
                >
                  <option value="USD">USD - United States Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Estimated Tax Rate</label>
              <div className="relative">
                <input
                  type="number"
                  name="taxRate"
                  value={profile.taxRate}
                  onChange={handleProfileChange}
                  className="input-base w-full bg-slate-50 border-transparent focus:bg-white font-bold pr-10"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Security & Membership ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 card p-8 flex flex-col justify-between">
            <div className="mb-6">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-label">Security & Credentials</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  className="input-base w-full bg-slate-50 border-transparent focus:bg-white"
                  placeholder="••••••••••••"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="input-base w-full bg-slate-50 border-transparent focus:bg-white"
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-mint-light/30 rounded-2xl border border-primary/5">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 w-8 h-8 rounded-lg flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Two-Factor Authentication</p>
                  <p className="text-[10px] text-primary/60 font-medium">Recommended for premium accounts</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="twoFactorEnabled"
                  checked={profile.twoFactorEnabled}
                  onChange={handleProfileChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </section>

          <section className="card p-8 bg-mint-light/20 flex flex-col justify-between border-primary/10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Membership</p>
              <div className="mb-6">
                <span className="px-3 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">
                  {user?.membershipStatus || 'Premium Tier'}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Your next renewal is scheduled for <span className="font-bold text-on-surface">October 14, 2024</span>. You are currently saving 15% on the annual plan.
              </p>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-dark transition-colors flex items-center gap-2">
              View Billing History
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </section>
        </div>

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-6">
          <button className="text-[10px] font-black uppercase tracking-widest text-error hover:text-red-700 transition-colors">
            Deactivate Account
          </button>
          <div className="flex items-center gap-4">
            <button className="btn-secondary rounded-xl px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600">Discard</button>
            <button 
              onClick={passwords.newPassword ? savePassword : saveProfile}
              disabled={loading}
              className="btn-primary rounded-xl px-8 py-3 min-w-[160px]"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
