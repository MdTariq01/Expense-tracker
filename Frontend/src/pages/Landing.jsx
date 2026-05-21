import { Link } from "react-router-dom";
import { useState } from "react";

const Landing = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#f0faf4] text-[#161d19] overflow-hidden selection:bg-primary/20">
      
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#f0faf4]/80 border-b border-black/5">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-transform duration-300 group-hover:scale-105">
                <span
                  className="material-symbols-outlined text-white text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_balance_wallet
                </span>
              </div>

              <h1 className="text-xl font-black tracking-tight">
                Atelier
              </h1>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
              >
                Features
              </a>

              <Link
                to="/philosophy"
                className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
              >
                Philosophy
              </Link>

              <Link
                to="/login"
                className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-6 py-3 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden w-11 h-11 rounded-xl border border-black/5 bg-white flex items-center justify-center shadow-sm"
            >
              <div className="space-y-1.5">
                <span
                  className={`block h-0.5 w-5 bg-black transition-all duration-300 ${
                    mobileMenu ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-black transition-all duration-300 ${
                    mobileMenu ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-black transition-all duration-300 ${
                    mobileMenu ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              mobileMenu ? "max-h-96 pb-6" : "max-h-0"
            }`}
          >
            <div className="bg-white/80 backdrop-blur-xl border border-black/5 rounded-3xl p-4 shadow-xl space-y-3">
              
              <a
                href="#features"
                className="block px-4 py-3 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Features
              </a>

              <Link
                to="/philosophy"
                className="block px-4 py-3 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Philosophy
              </Link>

              <Link
                to="/login"
                className="block px-4 py-3 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="block text-center px-4 py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-14 md:pt-20 pb-24 md:pb-32 overflow-hidden">
        
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-5 lg:px-8 relative z-10 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/70 backdrop-blur-md rounded-full border border-primary/10 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Intelligent Finance
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            Master your{" "}
            <span className="text-primary">capital</span>,
            <br />
            elevate your life.
          </h1>

          {/* Paragraph */}
          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-500 leading-relaxed px-2 mb-12">
            A minimalist atelier for your financial journey.
            Track expenses, gain AI-driven insights,
            and cultivate wealth with precision.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full max-w-xl mx-auto">
            
            <Link
              to="/register"
              className="flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              Start Your Journey

              <span className="material-symbols-outlined text-xl">
                arrow_forward
              </span>
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-700 rounded-full font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all duration-300"
            >
              Access Atelier
            </Link>
          </div>

          {/* ================= MOCKUP ================= */}
          <div className="mt-20 relative max-w-6xl mx-auto">
            
            {/* Main Card */}
            <div className="relative rounded-[2rem] overflow-hidden border border-white shadow-2xl bg-white/50 backdrop-blur-xl p-4">
              
              <div className="rounded-[1.5rem] overflow-hidden bg-slate-900 aspect-video md:aspect-[21/9] flex items-center justify-center relative">
                
                {/* Grid */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Fake Dashboard */}
                <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
                  
                  {/* Top Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md"
                      >
                        <div className="h-2 w-14 bg-white/10 rounded-full mb-3" />

                        <div className="h-6 w-24 bg-white/20 rounded-full" />
                      </div>
                    ))}
                  </div>

                  {/* Bottom Chart */}
                  <div className="mt-10">
                    <div className="h-40 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-transparent border border-white/10 flex items-end gap-3 p-6">
                      
                      {[40, 60, 30, 80, 65, 100, 75].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-emerald-400/70 rounded-t-2xl"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card 1 */}
            <div className="absolute -top-10 -left-10 hidden lg:block w-52 bg-white rounded-[2rem] p-6 shadow-2xl border border-slate-100 rotate-[-8deg] hover:rotate-0 transition-transform duration-500">
              
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600">
                    trending_up
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Savings
                  </div>

                  <div className="text-xs text-slate-500">
                    Monthly Growth
                  </div>
                </div>
              </div>

              <div className="text-4xl font-black">
                +24.8%
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="absolute -bottom-10 -right-10 hidden lg:block w-64 bg-white rounded-[2rem] p-6 shadow-2xl border border-slate-100 rotate-[8deg] hover:rotate-0 transition-transform duration-500">
              
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-3">
                Recent Expense
              </div>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="font-bold">
                    Studio Rental
                  </div>

                  <div className="text-xs text-slate-400">
                    Workspace
                  </div>
                </div>

                <div className="text-lg font-black text-primary">
                  -$850
                </div>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[70%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="py-24 md:py-32 bg-white"
      >
        <div className="container mx-auto px-5 lg:px-8">
          
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
              Designed for clarity.
            </h2>

            <p className="text-slate-500 text-lg">
              Tools that don&apos;t just track — they help you understand.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            <FeatureCard
              icon="analytics"
              title="Real-time Analytics"
              desc="Visualize your cash flow with precision and instant updates on every transaction."
            />

            <FeatureCard
              icon="psychology"
              title="AI Insights"
              desc="Understand spending habits and receive intelligent savings recommendations."
            />

            <FeatureCard
              icon="security"
              title="Private & Secure"
              desc="Enterprise-grade encryption keeps your financial data protected at all times."
            />
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 text-white/50 py-20">
        <div className="container mx-auto px-5 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-14">
            
            {/* Logo */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
                
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">
                    account_balance_wallet
                  </span>
                </div>

                <span className="text-white font-bold text-lg">
                  Financial Atelier
                </span>
              </div>

              <p className="max-w-sm text-sm leading-relaxed">
                Elevating personal finance through intentional
                tracking and intelligent design.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-8 text-xs uppercase tracking-[0.2em] font-bold">
              
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy
              </Link>

              <Link
                to="/terms"
                className="hover:text-white transition-colors"
              >
                Terms
              </Link>

              <Link
                to="/upgrade"
                className="hover:text-white transition-colors"
              >
                Membership
              </Link>

              <a
                href="https://github.com/MdTariq01/Expense-tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                Github

                <span className="material-symbols-outlined text-sm">
                  open_in_new
                </span>
              </a>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs font-mono">
            © 2026 FINANCIAL ATELIER SYSTEM // ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => {
  return (
    <div className="group relative p-10 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 overflow-hidden">
      
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icon */}
      <div className="relative z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
        
        <span className="material-symbols-outlined text-3xl">
          {icon}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-4">
          {title}
        </h3>

        <p className="text-slate-500 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default Landing;