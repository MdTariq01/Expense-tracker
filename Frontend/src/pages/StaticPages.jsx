import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#f8fbf9] text-[#161d19] font-body selection:bg-primary/20 pb-20">
      <nav className="p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 max-w-7xl mx-auto">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-emerald/10">
            <span className="material-symbols-outlined text-white text-lg">account_balance_wallet</span>
          </div>
          <span className="font-headline font-black text-sm tracking-tight">Financial Atelier</span>
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-20">
        <header className="mb-20 fade-in">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 block">Confidentiality Protocol</span>
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter mb-8 leading-none">Privacy Policy</h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Your financial data is private by design. We are committed to transparency in how we protect your information within the atelier.
          </p>
        </header>

        <section className="space-y-12 slide-up">
          <div className="space-y-4">
            <h3 className="text-xl font-black font-headline uppercase tracking-tight">1. Data Sovereignty</h3>
            <p className="text-sm text-slate-600 leading-relaxed">We believe you own your data. Financial Atelier only processes the data necessary to provide you with insights. We do not sell your personal or financial information to third parties.</p>
          </div>

          <div className="space-y-4 border-l-2 border-primary/20 pl-6">
            <h3 className="text-xl font-black font-headline uppercase tracking-tight">2. Information We Collect</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">To provide our bespoke services, we collect:</p>
            <ul className="text-xs space-y-3 font-bold text-slate-500 list-disc pl-4">
              <li>Account credentials (encrypted)</li>
              <li>Financial transaction metadata</li>
              <li>Subscription and billing details</li>
              <li>App interaction metrics for optimization</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-black font-headline uppercase tracking-tight">3. Intelligence Engine Processing</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Our AI models (powered by Gemini) process your transaction data to generate personalized insights. This processing happens in a secure, isolated environment. Your data is never used to train global, multi-user AI models.</p>
          </div>

          <div className="p-10 bg-slate-900 rounded-[2rem] text-white">
            <h3 className="text-lg font-black font-headline mb-4">Encryption Standards</h3>
            <p className="text-sm text-white/40 leading-relaxed mb-6">We use enterprise-grade AES-256 encryption for data at rest and TLS 1.3 for data in transit. Your security is our primary atelier craft.</p>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Certified Ledger Protection</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

/* --- Philosophy Component --- */

const Philosophy = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-body selection:bg-primary/20">
      <nav className="p-6 border-b border-white/5 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 max-w-7xl mx-auto">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-emerald/20">
            <span className="material-symbols-outlined text-white text-lg">account_balance_wallet</span>
          </div>
          <span className="font-headline font-bold text-sm tracking-tight">Financial Atelier</span>
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-40">
        <header className="mb-32 fade-in">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-12 bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Brand Vision // 001</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-headline tracking-tighter mb-12 leading-[0.9]">
            Finance is an <br />
            <span className="text-primary italic">Intentional Art.</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-white/60 leading-relaxed max-w-2xl">
            We believe that wealth is not just about accumulation, but about the intentional curation of your life&apos;s capital.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-20 items-start slide-up">
          <div className="space-y-12">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4">The Atelier Way</h3>
              <p className="text-sm text-white/50 leading-relaxed">Traditional spreadsheets are chores. The Atelier is an experience. We focus on the <span className="text-white">clarity</span> of your movements, allowing you to see the true shape of your financial decisions.</p>
            </div>
            
            <div className="p-8 border-l border-white/10 bg-white/5 rounded-2xl">
              <span className="material-symbols-outlined text-primary text-3xl mb-4">psychology</span>
              <h4 className="text-lg font-black font-headline mb-2">Augmented Intelligence</h4>
              <p className="text-xs text-white/40 leading-relaxed">We don&apos;t use AI to replace your judgment, but to augment it. By highlighting patterns you might miss, we empower you to act with more precision.</p>
            </div>
          </div>

          <div className="space-y-24">
            <div className="relative">
              <div className="absolute -left-8 top-0 text-[120px] font-black text-white/5 leading-none select-none">02</div>
              <h3 className="text-xl font-black font-headline mb-6 relative z-10">Minimalism as a Strategy</h3>
              <p className="text-sm text-white/60 leading-relaxed">By stripping away the noise of complex banking interfaces, we return your focus to what matters: <span className="text-white">Input, Output, and Insights.</span></p>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Join the movement</h3>
              <Link to="/register" className="inline-flex items-center gap-4 text-xl font-black font-headline group">
                Access the Studio
                <span className="material-symbols-outlined text-primary transition-transform group-hover:translate-x-2">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Crafted with intention by the Bespoke Studio</p>
      </footer>
    </div>
  );
};

export { Privacy, Philosophy };
