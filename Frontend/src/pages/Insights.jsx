import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import InsightCard from '../components/InsightCard';
import RadarChart from '../components/RadarChart';

const Insights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ai/insights');
      const rawData = res.data?.data || res.data;
      if (typeof rawData?.insights === 'string' && !rawData.narrative) {
        setInsights({ narrative: rawData.insights, items: [] });
      } else {
        setInsights(rawData || null);
      }
    } catch {
      setInsights(null);
    } finally {
      setLoading(false);
      setGenerated(true);
    }
  };

  const data = insights;
  const isPro = user?.membershipStatus === 'Pro';

  if (!isPro) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto w-full fade-in flex flex-col items-center justify-center min-h-[70vh]">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              lock
            </span>
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center border-4 border-slate-50 shadow-sm animate-bounce">
            <span className="material-symbols-outlined text-xs text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
        </div>

        <div className="text-center max-w-lg">
          <span className="font-label text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-2 block">
            Premium Feature
          </span>
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface mb-4 leading-tight">
            Unlock AI Spend <span className="text-primary">Insights</span>
          </h1>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
            Gain executive financial perspective. Our proprietary intelligence engine scans 90 days of cashflows, detects savings rate metrics, and offers bespoke advice dynamically.
          </p>

          <Link
            to="/upgrade"
            className="btn-primary rounded-2xl px-8 py-4 font-black text-xs uppercase tracking-widest inline-flex items-center gap-2 shadow-emerald active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>
            Upgrade to Pro Atelier
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full fade-in">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-label mb-1">
            Intelligence Engine
          </p>
          <h1 className="text-3xl font-black text-on-surface font-headline">
            AI Spend{' '}
            <span className="text-primary">Insights</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Machine-learned analysis of your spending patterns, powered by Gemini.
          </p>
        </div>
        <button
          onClick={generateInsights}
          disabled={loading}
          className="btn-primary flex-shrink-0 rounded-xl px-5 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5 inline-block vertical-middle" />
              Analyzing…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base mr-1.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              Generate Insights
            </>
          )}
        </button>
      </div>

      {/* ── Pre-generation state ──────────────────────────────────────────── */}
      {!generated && !loading && (
        <div className="card p-12 text-center mb-6">
          <div className="w-20 h-20 bg-mint-light rounded-3xl flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              psychology
            </span>
          </div>
          <h2 className="text-xl font-black font-headline text-on-surface mb-2">Ready to Analyze</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Click &ldquo;Generate Insights&rdquo; above to get a personalized AI analysis of your spending patterns, subscription optimization tips, and projected surplus.
          </p>
        </div>
      )}

      {/* ── Loading skeleton ─────────────────────────────────────────────── */}
      {loading && (
        <div className="space-y-4">
          <div className="card p-6">
            <div className="space-y-3">
              <div className="h-3 bg-slate-100 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-slate-100 rounded animate-pulse w-full" />
              <div className="h-3 bg-slate-100 rounded animate-pulse w-5/6" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-6 h-32 animate-pulse bg-slate-100" />
            <div className="card p-6 h-32 animate-pulse bg-slate-100" />
            <div className="card p-6 h-32 animate-pulse bg-slate-100" />
          </div>
        </div>
      )}

      {/* ── Insights Content ─────────────────────────────────────────────── */}
      {generated && !loading && (data ? (
        <div className="space-y-6 slide-up">
          {/* Top Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Narrative card - Glassmorphism */}
            <div className="lg:col-span-2 card p-8 bg-white/40 backdrop-blur-xl border-white/20 shadow-emerald-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      summarize
                    </span>
                    <h2 className="text-base font-bold text-on-surface font-headline">Current Financial Narrative</h2>
                  </div>
                  <p className="text-[10px] text-slate-400 font-label uppercase tracking-widest">Analysis of the last 90 days</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-lg">settings</span>
                </div>
              </div>

              {/* Quote narrative */}
              <blockquote className="border-l-4 border-primary pl-5 py-2 my-5">
                <p className="text-sm text-slate-600 italic leading-relaxed font-medium">
                  &ldquo;{data.narrative}&rdquo;
                </p>
              </blockquote>

              {/* Insight items */}
              <div className="divide-y divide-slate-50">
                {(data.items || []).map((item, i) => (
                  <InsightCard
                    key={i}
                    index={i}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    urgency={item.urgency}
                  />
                ))}
              </div>
            </div>

            {/* Right column: metric cards */}
            <div className="flex flex-col gap-4">
              {/* Projected Surplus */}
              <div className="card p-5 bg-sidebar text-white flex flex-col justify-between flex-1">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Projected Surplus</p>
                  <div className="text-3xl font-extrabold font-headline text-white mt-1">
                    {user?.currency === 'INR' ? '₹' : '$'}{(data.projectedSurplus || 0).toLocaleString()}
                    <span className="text-sm text-slate-500">.00</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-[10px] text-slate-400">Monthly surplus pacing estimate</p>
                </div>
              </div>

              {/* Savings Rate Card */}
              <div className="card p-5 bg-white/60 border border-slate-100 flex flex-col justify-between flex-1">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">AI Savings Rate</p>
                  <div className="text-3xl font-extrabold font-headline text-primary mt-1">
                    {data.savingsRate !== undefined ? `${data.savingsRate}%` : '0%'}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-50">
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${data.savingsRate >= 20 ? 'bg-primary' : 'bg-amber-400'}`} 
                      style={{ width: `${Math.min(100, Math.max(0, data.savingsRate || 0))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Burn Rate */}
              <div className={`card p-5 border-2 flex flex-col justify-between flex-1 ${
                data.burnRisk === 'Urgent' ? 'border-red-100 bg-red-50/20' : 
                data.burnRisk === 'Moderate' ? 'border-amber-100 bg-amber-50/20' : 'border-emerald-100 bg-emerald-50/20'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Burn Risk Level</p>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                      data.burnRisk === 'Urgent' ? 'bg-error/10 text-error' : 
                      data.burnRisk === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-primary/10 text-primary'
                    }`}>
                      {data.burnRisk || 'Low'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`material-symbols-outlined text-lg ${
                      data.burnRisk === 'Urgent' ? 'text-error' : 
                      data.burnRisk === 'Moderate' ? 'text-amber-600' : 'text-primary'
                    }`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {data.burnRisk === 'Urgent' ? 'trending_down' : 
                       data.burnRisk === 'Moderate' ? 'warning' : 'check_circle'}
                    </span>
                    <p className="text-xl font-extrabold font-headline text-on-surface">
                      {data.burnRisk || 'N/A'}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-3 border-t border-slate-100/50 pt-2">{data.burnRiskDetail || 'No risk data available'}</p>
              </div>
            </div>
          </div>

          {/* Lifestyle Equilibrium - Radar Chart */}
          <div className="card p-8 bg-white/40 backdrop-blur-xl border-white/20 shadow-emerald-sm slide-up" style={{ animationDelay: '200ms' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      balance
                    </span>
                  </div>
                  <h2 className="text-base font-black text-on-surface font-headline uppercase tracking-widest leading-none">Lifestyle Equilibrium</h2>
                </div>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
                  Your capital distribution across machine-learned clusters (Essential Foundation vs Discretionary Experience).
                </p>

                <div className="space-y-5">
                  {[
                    { label: 'Essential Base', value: data.lifestyleBalance?.essential || 0, color: '#006c49' },
                    { label: 'Discretionary Flux', value: data.lifestyleBalance?.discretionary || 0, color: '#4edea3' },
                  ].map((item) => (
                    <div key={item.label} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-on-surface transition-colors">{item.label}</span>
                        <span className="text-xs font-black text-on-surface">{item.value}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${item.value}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-[300px] flex items-center justify-center relative">
                <RadarChart data={data.lifestyleBalance} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center border-2 border-red-50">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-5 text-error">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
          </div>
          <h2 className="text-xl font-black font-headline text-on-surface mb-2">Analysis Interrupted</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            The intelligence engine encountered an issue while processing your transactions. This is often temporary—please try again.
          </p>
          <button 
            onClick={generateInsights}
            className="btn-secondary px-8 py-3 rounded-xl border-red-100 text-red-600 hover:bg-red-50"
          >
            Retry Analysis
          </button>
        </div>
      ))}
    </div>
  );
};

export default Insights;
