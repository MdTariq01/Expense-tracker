import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Membership = () => {
  const { user, setUser: updateLocalUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleUpgrade = async () => {
    setLoading(true);
    setStatusMessage('Initiating secure checkout...');
    
    // Simulate payment processing delay (Stripe-ready room)
    setTimeout(async () => {
      try {
        setStatusMessage('Finalizing your curator credentials...');
        const res = await api.patch('/auth/profile', { membershipStatus: 'Pro' });
        const updatedUser = res.data?.data || res.data;
        updateLocalUser(updatedUser);
        
        setStatusMessage('Welcome to the Pro Atelier!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (err) {
        console.error(err);
        setStatusMessage('Checkout failed. Please try again.');
        setLoading(false);
      }
    }, 2000);
  };

  const isPro = user?.membershipStatus === 'Pro';

  return (
    <main className="pt-24 pb-24 px-6 max-w-7xl mx-auto fade-in">
      {/* Hero Section */}
      <header className="text-center mb-16 max-w-3xl mx-auto">
        <span className="font-label text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-4 block">Membership Atelier</span>
        <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight text-on-surface mb-6 leading-[1.1]">
          Elevate Your <span className="text-primary bg-primary/5 px-4 py-1 rounded-2xl">Art of Finance</span>
        </h1>
        <p className="text-lg text-slate-500 font-light leading-relaxed">
          Step away from generic spreadsheets. Experience financial clarity through a bespoke lens with our premium studio features.
        </p>
      </header>

      {/* Pricing Grid */}
      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto items-stretch px-4">
        {/* Free Plan */}
        <div className="card p-10 flex flex-col border border-slate-100 bg-white/50">
          <div className="mb-8">
            <h3 className="font-headline text-2xl font-black mb-2 text-on-surface">Curator (Free)</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Essential tools for the aspiring financial curator.</p>
          </div>
          <div className="flex items-baseline gap-1 mb-10">
            <span className="text-4xl font-black font-headline text-on-surface">$0</span>
            <span className="text-slate-400 font-label text-xs font-bold uppercase tracking-widest">/ Forever</span>
          </div>
          <ul className="space-y-5 mb-12 flex-grow">
            {[
              { icon: 'check_circle', text: 'Manual Expense Tracking' },
              { icon: 'check_circle', text: 'Basic Monthly Summaries' },
              { icon: 'block', text: 'AI Receipt Scanning', disabled: true },
              { icon: 'block', text: 'Advanced Insights', disabled: true },
            ].map((item, i) => (
              <li key={i} className={`flex items-center gap-3 ${item.disabled ? 'opacity-30' : ''}`}>
                <span className={`material-symbols-outlined text-xl ${item.disabled ? 'text-slate-400' : 'text-primary'}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-bold text-slate-600">{item.text}</span>
              </li>
            ))}
          </ul>
          <button 
            disabled 
            className="w-full py-4 px-6 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest cursor-not-allowed"
          >
            {isPro ? 'Legacy Active' : 'Current Selection'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="relative card p-10 flex flex-col border-2 border-primary bg-white shadow-emerald scale-[1.03] z-10 overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary px-6 py-2 rounded-bl-3xl">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Bespoke Choice</span>
          </div>
          <div className="mb-8">
            <h3 className="font-headline text-2xl font-black mb-2 text-on-surface">Atelier Pro</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">The complete bespoke studio experience.</p>
          </div>
          <div className="flex items-baseline gap-1 mb-10">
            <span className="text-4xl font-black font-headline text-on-surface">$9.99</span>
            <span className="text-slate-400 font-label text-xs font-bold uppercase tracking-widest">/ Per Month</span>
          </div>
          <ul className="space-y-5 mb-12 flex-grow">
            {[
              { icon: 'auto_awesome', text: 'Unlimited AI Receipt Scanning' },
              { icon: 'insights', text: 'Advanced Predictive Insights' },
              { icon: 'verified', text: 'Priority Artisan Support' },
              { icon: 'file_export', text: 'Custom Export Formats' },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {item.icon}
                </span>
                <span className="text-sm font-bold text-on-surface">{item.text}</span>
              </li>
            ))}
          </ul>
          
          <button 
            onClick={handleUpgrade}
            disabled={loading || isPro}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-emerald active:scale-95 ${
              isPro 
                ? 'bg-slate-100 text-slate-400 cursor-default' 
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {loading ? 'Processing...' : isPro ? 'Already Pro' : 'Unlock Pro Access'}
          </button>
          
          {statusMessage && (
            <p className="text-center mt-4 text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">
              {statusMessage}
            </p>
          )}
        </div>
      </div>

      {/* Guarantee Section */}
      <section className="mt-24 grid md:grid-cols-3 gap-12 text-center border-t border-slate-100 pt-24 pb-12">
        {[
          { icon: 'lock', title: 'Bank-Grade Security', desc: 'Your financial data is encrypted and protected by the highest industry standards.' },
          { icon: 'update', title: 'Cancel Anytime', desc: 'No lock-in contracts. Manage your subscription with a single click at any time.' },
          { icon: 'cloud_done', title: 'Cross-Device Sync', desc: 'Access your atelier from your phone, tablet, or desktop with real-time syncing.' },
        ].map((item, i) => (
          <div key={i} className="group">
            <div className="w-14 h-14 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/5 transition-colors">
              <span className="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
            </div>
            <h4 className="font-headline font-black text-on-surface mb-3">{item.title}</h4>
            <p className="text-slate-500 text-xs px-6 leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Membership;
