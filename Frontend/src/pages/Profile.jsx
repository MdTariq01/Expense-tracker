import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
  const { user, setUser: updateLocalUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'settings'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  // Profile fields
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('avatar', file);

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.patch('/auth/profile', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updatedUser = res.data?.data || res.data;
      updateLocalUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile photo updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload photo' });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.patch('/auth/profile', formData);
      const updatedUser = res.data?.data || res.data;
      updateLocalUser(updatedUser);
      setMessage({ type: 'success', text: 'Account details updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update settings' });
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async () => {
    if (passwords.newPassword && passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }
    if (!passwords.currentPassword) {
      setMessage({ type: 'error', text: 'Current password is required to verify changes' });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...passwords,
        twoFactorEnabled: formData.twoFactorEnabled
      };
      const res = await api.patch('/auth/password', payload);
      const updatedUser = res.data?.data || res.data;
      updateLocalUser(updatedUser);
      setMessage({ type: 'success', text: 'Security settings updated successfully!' });
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update security' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto w-full fade-in pb-24">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-on-surface font-headline mb-2">Workspace Identification</h1>
          <p className="text-slate-500 text-sm font-medium">Manage your professional credentials and financial preferences.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile' ? 'bg-white text-on-surface shadow-sm' : 'text-slate-500 hover:text-on-surface'
            }`}
          >
            Profile Preview
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings' ? 'bg-white text-on-surface shadow-sm' : 'text-slate-500 hover:text-on-surface'
            }`}
          >
            System Settings
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`mb-8 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 slide-up ${
          message.type === 'success' ? 'bg-mint-light/40 text-primary border border-primary/10' : 'bg-red-50 text-error border border-error/10'
        }`}>
          <span className="material-symbols-outlined">{message.type === 'success' ? 'verified' : 'error'}</span>
          {message.text}
        </div>
      )}

      {activeTab === 'profile' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="card p-8 flex flex-col items-center text-center">
            <div className="relative mb-6 group cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-40 h-40 rounded-[2.5rem] bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-soft transition-transform group-hover:scale-[1.02]">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-black text-slate-300">{user?.name?.charAt(0)?.toUpperCase()}</span>
                )}
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[2.5rem]">
                  <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl border-4 border-white">
                <span className="material-symbols-outlined text-xl">edit</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
            
            <h2 className="text-2xl font-black text-on-surface font-headline">{user?.name}</h2>
            <p className="text-sm text-slate-500 font-medium mb-8">{user?.email}</p>

            <div className="w-full pt-8 border-t border-slate-100 flex items-center justify-around">
               <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <span className="px-3 py-1 bg-mint-light text-primary text-[10px] font-black uppercase rounded-full">
                    {user?.membershipStatus || 'Active'}
                  </span>
               </div>
               <div className="text-center border-l border-slate-100 pl-8">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Currency</p>
                  <p className="text-sm font-black text-on-surface">{user?.currency || 'USD'}</p>
               </div>
            </div>
          </div>

          {/* User Info Stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-8 bg-gradient-to-br from-white to-slate-50/50">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Financial Silhouette</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-white rounded-3xl border border-primary/5 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Monthly Allowance</p>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-black text-on-surface leading-none">
                        {user?.currency === 'INR' ? '₹' : '$'} {user?.monthlyIncome?.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-bold mb-1">/mo</span>
                    </div>
                  </div>
                  <div className="p-6 bg-white rounded-3xl border border-primary/5 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tax Foundation</p>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-black text-on-surface leading-none">{user?.taxRate || 0}</span>
                      <span className="text-xs text-slate-400 font-bold mb-1">%</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="card p-8 border-primary/10 bg-primary/5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary text-white rounded-2xl shadow-emerald">
                  <span className="material-symbols-outlined text-2xl">security</span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-on-surface mb-1">System Security</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                    Two-factor authentication is {user?.twoFactorEnabled ? 'enabled' : 'disabled'}. 
                    We recommend enabling it to protect your financial atelier from unauthorized access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Edit Profile Form */}
          <section className="card p-8">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Personal Identification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-base w-full bg-slate-50 border-transparent focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Email (Read-only)</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="input-base w-full bg-slate-100 border-transparent text-slate-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Monthly Income</label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  className="input-base w-full bg-slate-50 border-transparent focus:bg-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Preferred Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="input-base w-full bg-slate-50 border-transparent focus:bg-white appearance-none pr-10"
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>
            <div className="mt-10 flex justify-end">
              <button 
                onClick={saveSettings}
                disabled={loading}
                className="bg-primary text-white rounded-2xl px-10 py-3.5 font-bold text-sm hover:bg-primary/90 transition-all shadow-emerald active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Sync Changes'}
              </button>
            </div>
          </section>

          {/* Security Form */}
          <section className="card p-8">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">System Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  className="input-base w-full bg-slate-50 border-transparent focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">New System Key</label>
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
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${formData.twoFactorEnabled ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'}`}>
                  <span className="material-symbols-outlined text-base">verified_user</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Two-Factor Authentication</p>
                  <p className="text-[10px] text-slate-500 font-medium tracking-tight">Additional layer of biometric/system security</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="twoFactorEnabled"
                  checked={formData.twoFactorEnabled}
                  onChange={handleChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="mt-10 flex justify-end">
              <button 
                onClick={savePassword}
                disabled={loading}
                className="bg-on-surface text-white rounded-2xl px-10 py-3.5 font-bold text-sm hover:opacity-90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Update Security Key'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Profile;
