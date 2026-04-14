import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#f0faf4] text-[#161d19] overflow-hidden selection:bg-primary/20">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-8 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-emerald/20 shadow-lg">
            <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
          </div>
          <span className="text-xl font-black tracking-tight font-headline">Atelier</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <Link to="/philosophy" className="hover:text-primary transition-colors">Philosophy</Link>
          <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
          <Link to="/register" className="bg-primary text-white px-6 py-2.5 rounded-full hover:shadow-emerald transition-all active:scale-95">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-primary/10 mb-8 slide-up">
            <span className="flex h-2 w-2 rounded-full bg-primary pulse-dot"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Intelligent Finance</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-headline tracking-tighter mb-8 leading-[0.9] fade-in">
            Master your <span className="text-primary">capital</span>,<br />
            elevate your life.
          </h1>
          
          <p className="max-w-xl mx-auto text-lg text-slate-500 font-medium mb-12 slide-up" style={{ animationDelay: '0.1s' }}>
            A minimalist atelier for your financial journey. Track expenses, gain AI-driven insights, and cultivate wealth with precision.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-full font-black text-sm uppercase tracking-widest hover:shadow-emerald shadow-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group">
              Start Your Journey
              <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 border border-slate-100 rounded-full font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
              Access Atelier
            </Link>
          </div>

          {/* Abstract Mockup Area */}
          <div className="mt-20 relative max-w-5xl mx-auto slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative rounded-[2rem] overflow-hidden border border-white shadow-2xl bg-white/40 backdrop-blur-xl p-4">
               <div className="rounded-2xl overflow-hidden bg-slate-900 aspect-video md:aspect-[21/9] flex items-center justify-center relative">
                  {/* Subtle Grid Pattern */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                  
                  <div className="relative text-center p-8">
                    <div className="flex justify-center gap-2 mb-6">
                       {[1,2,3].map(i => <div key={i} className="w-12 h-1 bg-white/20 rounded-full" />)}
                    </div>
                    <div className="text-white/40 text-sm font-mono tracking-widest uppercase">System Dashboard Visualizing Assets</div>
                  </div>
               </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-12 -left-12 hidden lg:block w-48 card p-6 rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-600 text-sm">trending_up</span>
                 </div>
                 <div className="text-[10px] font-black uppercase text-slate-400">Savings</div>
               </div>
               <div className="text-xl font-black">+24.8%</div>
            </div>

            <div className="absolute -bottom-8 -right-8 hidden lg:block w-56 card p-6 rotate-[6deg] hover:rotate-0 transition-transform duration-500">
               <div className="text-[10px] font-black uppercase text-slate-400 mb-2">Recent Expense</div>
               <div className="flex justify-between items-center">
                 <div className="text-sm font-bold">Studio Rental</div>
                 <div className="text-sm font-black text-primary">-$850</div>
               </div>
               <div className="w-full h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-primary w-[70%]" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tight mb-4 text-on-surface">Designed for clarity.</h2>
            <p className="text-slate-500 font-medium">Tools that don&apos;t just track, but help you understand.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="analytics" 
              title="Real-time Analytics" 
              desc="Visualize your cash flow with precision. Instant updates on every transaction."
            />
            <FeatureCard 
              icon="psychology" 
              title="AI Insights" 
              desc="Our intelligent core analyzes your spending patterns to suggest optimal savings."
            />
            <FeatureCard 
              icon="security" 
              title="Private & Secure" 
              desc="Your financial data belongs to you. We use enterprise-grade encryption for total privacy."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white/40 py-20 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg">account_balance_wallet</span>
              </div>
              <span className="text-white font-bold tracking-tight">Financial Atelier</span>
            </div>
            <p className="text-xs max-w-xs text-center md:text-left">Elevating personal finance through intentional tracking and intelligent design.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[10px] font-black uppercase tracking-[0.15em] overflow-hidden">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/upgrade" className="hover:text-white transition-colors">Membership</Link>
            <a 
              href="https://github.com/MdTariq01/Expense-tracker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              Github
              <span className="material-symbols-outlined text-[10px]">open_in_new</span>
            </a>
          </div>
          
          <p className="text-[10px] font-mono">&copy; 2024 FINANCIAL ATELIER SYSTEM // ALL RIGHTS RESERVED</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-10 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl hover:shadow-emerald/5 transition-all duration-500 group">
    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <h3 className="text-xl font-bold mb-4 text-on-surface">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
