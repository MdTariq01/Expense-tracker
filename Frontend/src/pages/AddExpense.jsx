import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { CATEGORIES } from '../constants';

const today = new Date().toISOString().split('T')[0];

const EMPTY_FORM = {
  title: '',
  amount: '',
  category: 'Food',
  date: today,
  notes: '',
};

const AddExpense = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEdit = Boolean(editId);

  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'ai'
  const [form, setForm] = useState(EMPTY_FORM);
  const [aiText, setAiText] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [expenseCount, setExpenseCount] = useState(0);
  const fileRef = useRef(null);

  // ── Fetch total expenses to enforce free tier limit ──────────────────────
  useEffect(() => {
    if (isEdit) return;
    api.get('/expenses')
      .then((res) => {
        const rawData = res.data?.data || res.data || [];
        const expensesArray = Array.isArray(rawData) ? rawData : (Array.isArray(rawData?.expenses) ? rawData.expenses : []);
        setExpenseCount(expensesArray.length);
      })
      .catch(() => {});
  }, [isEdit]);

  // ── Load existing expense for edit mode ───────────────────────────────────
  useEffect(() => {
    if (!isEdit) return;
    setFetchLoading(true);
    api.get(`/expenses/${editId}`)
      .then((res) => {
        const e = res.data?.data || res.data;
        setForm({
          title: e.title || '',
          amount: Math.abs(e.amount) || '',
          category: e.category || 'Food',
          date: e.date ? e.date.split('T')[0] : today,
          notes: e.notes || '',
        });
        if (e.receiptUrl) setReceiptPreview(e.receiptUrl);
      })
      .catch(() => {
        setError('Could not load expense. It may have been deleted.');
      })
      .finally(() => setFetchLoading(false));
  }, [editId, isEdit]);

  // ── Form change ───────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  // ── Receipt file ──────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setReceiptPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  // ── AI Extract ────────────────────────────────────────────────────────────
  const handleExtract = async () => {
    if (!aiText.trim()) return;
    setAiLoading(true);
    setError('');
    try {
      const res = await api.post('/ai/parse-expense', { text: aiText });
      const parsed = res.data?.data || res.data;
      setForm({
        title: parsed.title || '',
        amount: parsed.amount ? String(Math.abs(parsed.amount)) : '',
        category: parsed.category || 'Food',
        date: parsed.date ? parsed.date.split('T')[0] : today,
        notes: parsed.notes || '',
      });
      // Switch to manual to show filled fields
      setActiveTab('manual');
    } catch {
      // Simulate extraction for demo
      const demoAmountMatch = aiText.match(/\$?\d+(\.\d+)?/);
      const demoAmount = demoAmountMatch ? demoAmountMatch[0].replace('$', '') : '0';
      setForm((prev) => ({
        ...prev,
        title: aiText.split(' ').slice(0, 4).join(' '),
        amount: demoAmount,
        date: today,
        notes: aiText,
      }));
      setActiveTab('manual');
    } finally {
      setAiLoading(false);
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount) {
      setError('Title and amount are required.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      let body;
      let headers = {};

      if (receiptFile) {
        body = new FormData();
        Object.entries(form).forEach(([k, v]) => body.append(k, v));
        body.append('receipt', receiptFile);
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        body = { ...form, amount: parseFloat(form.amount) };
      }

      if (isEdit) {
        await api.patch(`/expenses/${editId}`, body, { headers });
      } else {
        await api.post('/expenses', body, { headers });
      }

      navigate('/expenses');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isPro = user?.membershipStatus === 'Pro';
  const isCapped = !isEdit && !isPro && expenseCount >= 50;

  if (isCapped) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto w-full fade-in flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center animate-bounce">
            <span className="material-symbols-outlined text-4xl text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>
          </div>
        </div>

        <div className="text-center max-w-md">
          <span className="font-label text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-2 block">
            Limit Reached
          </span>
          <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-3">
            Atelier Capacity Exceeded
          </h1>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
            You have successfully curated 50 transactions on the free plan. Unlock unlimited workspace entries, AI receipt transcription, and predictive strategist insights with Pro Atelier.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/membership"
              className="btn-primary rounded-xl px-6 py-3.5 font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 shadow-emerald active:scale-95 transition-transform w-full sm:w-auto text-center justify-center"
            >
              Unlock Pro Access
            </Link>
            <Link
              to="/expenses"
              className="btn-secondary rounded-xl px-6 py-3.5 font-bold text-xs uppercase tracking-widest inline-flex items-center justify-center text-slate-500 hover:text-on-surface w-full sm:w-auto"
            >
              Back to Ledger
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto w-full fade-in">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-label mb-1">
          {isEdit ? 'Edit Entry' : 'New Entry'}
        </p>
        <h1 className="text-3xl font-black text-on-surface font-headline">
          {isEdit ? 'Update Transaction' : 'Record Transaction'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Every detail matters. Capture your spending with the precision of a bespoke atelier,
          or let our AI handle the transcription for you.
        </p>
      </div>

      {/* ── Tab Toggle ────────────────────────────────────────────────────── */}
      <div className="inline-flex bg-slate-100 rounded-xl p-1 mb-8">
        {[
          { key: 'manual', label: 'Manual Entry', icon: 'edit_note' },
          { key: 'ai', label: 'Use AI Entry', icon: 'auto_awesome' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-white text-on-surface shadow-card'
                : 'text-slate-500 hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base"
              style={activeTab === tab.key ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── AI Entry Tab ─────────────────────────────────────────────────── */}
      {activeTab === 'ai' && (
        <div className="card p-6 mb-6 slide-up">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">AI Transcription</span>
          </div>
          <textarea
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            placeholder={`e.g., Dinner at Joe's for ${user?.currency === 'INR' ? '₹' : '$'}45 last night for the team celebration`}
            rows={4}
            className="input-base resize-none mb-4 leading-relaxed"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleExtract}
              disabled={aiLoading || !aiText.trim()}
              className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {aiLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Extracting…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    auto_awesome
                  </span>
                  Extract Details
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Manual Form ──────────────────────────────────────────────────── */}
      {activeTab === 'manual' && (
        <form onSubmit={handleSubmit} className="slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: form fields */}
            <div className="lg:col-span-2 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 font-label">
                  Expense Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Coffee with Client"
                  required
                  className="input-base"
                />
              </div>

              {/* Amount + Category row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 font-label">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      {user?.currency === 'INR' ? '₹' : '$'}
                    </span>
                    <input
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                      className="input-base pl-7"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 font-label">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="input-base appearance-none pr-8 cursor-pointer"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined text-slate-400 text-sm absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 font-label">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="input-base"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 font-label">
                  Notes <span className="normal-case tracking-normal font-normal text-slate-300">(optional)</span>
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Brief description of the expenditure purpose…"
                  rows={3}
                  className="input-base resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-error/20 rounded-lg px-4 py-3 flex items-start gap-2">
                  <span className="material-symbols-outlined text-error text-base mt-0.5">error</span>
                  <p className="text-xs text-error font-medium">{error}</p>
                </div>
              )}

              {/* Submit */}
              <div className="pt-2 flex flex-col items-start gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-8 py-3.5 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isEdit ? 'Updating…' : 'Saving…'}
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {isEdit ? 'save' : 'add_circle'}
                      </span>
                      {isEdit ? 'Update Transaction' : 'Save Transaction'}
                    </>
                  )}
                </button>
                <Link
                  to="/expenses"
                  className="text-sm text-slate-400 hover:text-slate-600 transition-colors font-medium"
                >
                  Cancel Entry
                </Link>
              </div>
            </div>

            {/* Right: receipt upload */}
            <div className="lg:col-span-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 font-label">
                Receipt Attachment
              </label>

              {!isPro ? (
                <div
                  onClick={() => navigate('/membership')}
                  className="relative border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden cursor-pointer bg-slate-50 hover:bg-slate-100/80 transition-all p-6 text-center flex flex-col items-center justify-center gap-3"
                  style={{ minHeight: '240px' }}
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-card flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                      lock
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-700">Receipt Attachment</p>
                  <p className="text-[10px] text-slate-400 leading-normal max-w-[150px] mx-auto uppercase tracking-wider font-semibold">
                    Upgrade to Pro to attach files &amp; receipts
                  </p>
                </div>
              ) : (
                <>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-all ${
                      receiptPreview
                        ? 'border-primary/40 bg-mint-light'
                        : 'border-slate-200 bg-slate-50 hover:border-primary/30 hover:bg-mint-light/30'
                    }`}
                    style={{ minHeight: '240px' }}
                  >
                    {receiptPreview ? (
                      <img
                        src={receiptPreview}
                        alt="Receipt preview"
                        className="w-full h-60 object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-card flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl text-slate-400">cloud_upload</span>
                        </div>
                        <p className="text-sm font-bold text-slate-500">Tap to upload receipt</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">JPG, PNG, PDF up to 5MB</p>
                      </div>
                    )}

                    {/* Change button */}
                    {receiptPreview && (
                      <div className="absolute bottom-3 right-3">
                        <span className="bg-white/90 backdrop-blur rounded-lg px-3 py-1 text-xs font-bold text-slate-600 shadow-card">
                          Change
                        </span>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {receiptFile && (
                    <p className="text-xs text-slate-500 mt-2 truncate">
                      📎 {receiptFile.name}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </form>
      )}

      {/* ── AI tab: also show form below after extraction ─────────────────── */}
      {activeTab === 'ai' && (form.title || form.amount) && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Fields Auto-filled — Review &amp; Save</p>
          </div>
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Title</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} className="input-base" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    {user?.currency === 'INR' ? '₹' : '$'}
                  </span>
                  <input type="number" name="amount" value={form.amount} onChange={handleChange} className="input-base pl-7" step="0.01" min="0" required />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="input-base appearance-none">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} className="input-base" required />
              </div>
            </div>
            <input type="text" name="notes" value={form.notes} onChange={handleChange} placeholder="Notes…" className="input-base" />
            {error && <p className="text-xs text-error font-medium">{error}</p>}
            <div className="flex items-center gap-4 pt-2">
              <button type="submit" disabled={loading} className="btn-primary px-6 py-3 rounded-xl disabled:opacity-60">
                {loading ? 'Saving…' : 'Save Transaction'}
              </button>
              <Link to="/expenses" className="text-sm text-slate-400 hover:text-slate-600 font-medium">Cancel Entry</Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddExpense;
