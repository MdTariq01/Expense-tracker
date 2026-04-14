import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#f8fbf9] text-[#161d19] font-body selection:bg-primary/20 pb-20">
      {/* Mini Nav */}
      <nav className="p-6 flex justify-between items-center border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-emerald/10">
            <span className="material-symbols-outlined text-white text-lg">account_balance_wallet</span>
          </div>
          <span className="font-headline font-black text-sm tracking-tight text-on-surface">Financial Atelier</span>
        </Link>
        <Link to="/login" className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary-dark transition-colors">
          Access Studio
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-20">
        {/* Header */}
        <header className="text-center mb-20 fade-in">
          <span className="px-4 py-1.5 bg-mint-light text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6 inline-block">
            Legal Framework
          </span>
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter mb-6 leading-none">
            Terms of Service
          </h1>
          <p className="max-w-xl mx-auto text-slate-500 font-medium leading-relaxed">
            Welcome to the Financial Atelier. These terms govern your use of our bespoke financial studio. By accessing our platform, you agree to these refined standards of service.
          </p>
          <div className="mt-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Last Updated: October 24, 2023
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Sidebar Nav */}
          <aside className="hidden md:block">
            <nav className="sticky top-32 space-y-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Navigating Terms</p>
              <div className="flex flex-col gap-4 text-xs font-bold text-slate-500">
                <a href="#user-agreement" className="hover:text-primary transition-colors flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-primary/20 rounded-full" /> User Agreement
                </a>
                <a href="#service-limitations" className="hover:text-primary transition-colors flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-primary/20 rounded-full" /> Service Limitations
                </a>
                <a href="#ai-terms" className="hover:text-primary transition-colors flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-primary/20 rounded-full" /> AI Subscriptions
                </a>
                <a href="#billing" className="hover:text-primary transition-colors flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-primary/20 rounded-full" /> Billing Details
                </a>
              </div>
            </nav>
          </aside>

          {/* Main Legal Text */}
          <div className="md:col-span-3 space-y-10 slide-up">
            {/* 1. User Agreement */}
            <section id="user-agreement" className="card p-10 border-slate-100 hover:border-primary/20 transition-all">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-mint-light rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">person_check</span>
                </div>
                <div>
                  <h3 className="text-xl font-black font-headline text-on-surface">1. User Agreement</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Foundational principles</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6">
                By creating an account with <span className="text-on-surface font-black">Financial Atelier</span>, you certify that you are at least 18 years of age and that all financial information provided is accurate to the best of your knowledge.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <div className="text-sm">
                    <span className="font-black text-on-surface">Account Security:</span> You are responsible for safeguarding your password and any activities or actions under your account.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <div className="text-sm">
                    <span className="font-black text-on-surface">Lawful Use:</span> You agree not to use the service for any illegal purposes or for the transmission of material that is unlawful or defamatory.
                  </div>
                </li>
              </ul>
            </section>

            {/* 2. Service Limitations */}
            <section id="service-limitations" className="card p-10 border-l-4 border-primary border-slate-100 bg-white">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">verified_user</span>
                </div>
                <div>
                  <h3 className="text-xl font-black font-headline text-on-surface">2. Service Limitations</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Defining our scope</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed font-black mb-6">
                Important: Financial Atelier is a technology platform, not a registered investment advisor.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                The insights and projections provided are for informational purposes only. We do not provide legal, tax, or professional investment advice. While we strive for 99.9% uptime, we do not guarantee uninterrupted service.
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl">
                 <p className="text-[10px] font-black uppercase tracking-widest text-on-surface mb-2">Data Accuracy</p>
                 <p className="text-xs text-slate-500 leading-relaxed">We aggregate data from your manual entries and AI scanning. We are not responsible for inaccuracies caused by manual entry errors.</p>
              </div>
            </section>

            {/* 3. AI Subscription Terms */}
            <section id="ai-terms" className="card p-10 border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-emerald/10">
                  <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                </div>
                <div>
                  <h3 className="text-xl font-black font-headline text-on-surface">3. AI Subscription Terms</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Intelligent layer standards</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium mb-8">
                Subscribers to the &ldquo;<span className="font-bold text-primary">Atelier Intelligence</span>&rdquo; tier gain access to generative AI-driven financial planning. This feature uses anonymized patterns to suggest optimizations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-mint-light/30 p-5 rounded-2xl border border-primary/5">
                    <p className="text-[10px] font-black text-on-surface uppercase mb-1">Model Limitations</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">AI suggestions may occasionally produce hallucinated figures. Always verify critical data.</p>
                 </div>
                 <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-on-surface uppercase mb-1">Privacy Guarantee</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Your specific financial transactions are never used to train global AI models.</p>
                 </div>
              </div>
            </section>

            {/* 4. Billing Details */}
            <section id="billing" className="card p-10 border-slate-100">
               <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-2xl">receipt_long</span>
                </div>
                <div>
                  <h3 className="text-xl font-black font-headline text-on-surface">4. Billing Details</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Transactional transparency</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium mb-8">
                Subscriptions are billed in advance on a monthly or annual basis and are non-refundable. You may cancel at any time through your dashboard; access will continue until the end of the current cycle.
              </p>
              
              <div className="space-y-4 border-t border-slate-50 pt-8">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-widest">Automatic Renewal</span>
                  <span className="font-black text-on-surface">STANDARD POLICY</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-widest">Grace Period</span>
                  <span className="font-black text-on-surface">7 BUSINESS DAYS</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-widest">Refund Policy</span>
                  <span className="font-black text-error">LIMITED ELIGIBILITY</span>
                </div>
              </div>
            </section>

            {/* Support CTA */}
            <div className="bg-slate-900 rounded-[2rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
               <div>
                 <h4 className="text-xl font-black font-headline mb-2">Questions regarding our terms?</h4>
                 <p className="text-sm text-white/40 font-medium">Our legal atelier is here to clarify any points of interest.</p>
               </div>
               <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary-dark transition-colors">
                 <span className="material-symbols-outlined text-lg">mail</span>
                 Contact Legal
               </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Meta */}
      <footer className="mt-40 border-t border-slate-100 pt-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-primary/20 rounded flex items-center justify-center">
               <span className="material-symbols-outlined text-primary text-[10px]">account_balance_wallet</span>
            </div>
            <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">Financial Atelier Studio</span>
          </div>
          <div className="flex items-center gap-8 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <span className="px-1 opacity-20 hover:opacity-100 cursor-default">Cookie Settings</span>
            <span className="px-1 opacity-20 hover:opacity-100 cursor-default">Security Statement</span>
          </div>
          <p className="text-[9px] font-mono text-slate-300">© 2024 THE FIN-ATELIER. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
