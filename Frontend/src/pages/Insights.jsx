import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import InsightCard from '../components/InsightCard';

// ── Header UI ──────────────────────────────────────────────────────────

const Insights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ai/insights');
      // Extract data. AI returns { insights: "text..." }
      const rawData = res.data?.data || res.data;
      if (typeof rawData?.insights === 'string' && !rawData.narrative) {
        setInsights({ narrative: rawData.insights, items: [] });
      } else {
        setInsights(rawData || null);
      }
    } catch {
      // Clear data on error
      setInsights(null);
    } finally {
      setLoading(false);
      setGenerated(true);
    }
  };

  const data = insights;

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
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
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
          <div className="grid grid-cols-2 gap-4">
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
            {/* Main Narrative card */}
            <div className="lg:col-span-2 card p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      summarize
                    </span>
                    <h2 className="text-base font-bold text-on-surface font-headline">Current Financial Narrative</h2>
                  </div>
                  <p className="text-[10px] text-slate-400 font-label uppercase tracking-widest">Analysis of the last 30 days</p>
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
              <div className="card p-6 bg-sidebar text-white flex flex-col justify-between flex-1">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Projected Surplus</p>
                  <div className="text-4xl font-extrabold font-headline text-white mt-2">
                    {user?.currency === 'INR' ? '₹' : '$'}{(data.projectedSurplus || 0).toLocaleString()}
                    <span className="text-lg text-slate-500">.00</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-xs text-slate-500">End-of-month estimate based on current pacing</p>
                </div>
              </div>

              {/* Burn Rate */}
              <div className="card p-6 border-2 border-error/10 flex-1">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Burn Rate Risk</p>
                  <span className="px-2 py-0.5 bg-error/10 text-error rounded text-[9px] font-black uppercase tracking-widest">
                    Urgent
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-error text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    trending_down
                  </span>
                  <p className="text-2xl font-extrabold font-headline text-on-surface">
                    {data.burnRisk || 'N/A'}
                  </p>
                </div>
                <p className="text-xs text-slate-500 font-medium">{data.burnRiskDetail || 'No risk data available'}</p>
              </div>
            </div>
          </div>

          {/* Lifestyle Balance */}
          <div className="card p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-base font-bold text-on-surface font-headline mb-2">Lifestyle Balance</h2>
                <p className="text-sm text-slate-500 mb-6">
                  Your spending is currently skewed towards &ldquo;Experience&rdquo; rather than &ldquo;Foundation.&rdquo; Here&apos;s your equilibrium:
                </p>

                {[
                  { label: 'Essential', value: data.lifestyleBalance?.essential || 0, color: 'bg-primary' },
                  { label: 'Discretionary', value: data.lifestyleBalance?.discretionary || 0, color: 'bg-primary-light' },
                ].map((bar) => (
                  <div key={bar.label} className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{bar.label}</span>
                      <span className="text-xs font-bold text-on-surface">{bar.value}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${bar.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${bar.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center justify-center text-center border-l border-slate-100 pl-8">
                <div className="w-16 h-16 bg-mint-light rounded-2xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bar_chart_4_bars
                  </span>
                </div>
                <h3 className="text-base font-bold text-on-surface font-headline mb-2">
                  Visual spend breakdown by AI clusters
                </h3>
                <p className="text-sm text-slate-500">
                  Machine-learned categories based on merchant metadata
                </p>
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
