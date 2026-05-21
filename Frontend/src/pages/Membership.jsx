import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Membership = () => {
  const { user, setUser: updateLocalUser } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [statusMessage, setStatusMessage] =
    useState('');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);

        return;
      }

      const script = document.createElement(
        'script'
      );

      script.src =
        'https://checkout.razorpay.com/v1/checkout.js';

      script.async = true;

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const simulateUpgrade = async () => {
    setLoading(true);

    setStatusMessage(
      'Sandbox: Finalizing curator credentials...'
    );

    try {
      const res = await api.patch(
        '/auth/profile',
        {
          membershipStatus: 'Pro',
        }
      );

      const updatedUser =
        res.data?.data || res.data;

      updateLocalUser(updatedUser);

      setStatusMessage(
        'Welcome to the Pro Atelier!'
      );

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error(err);

      setStatusMessage(
        'Sandbox upgrade failed.'
      );

      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);

    setStatusMessage(
      'Initiating secure checkout...'
    );

    const isLoaded =
      await loadRazorpayScript();

    if (!isLoaded) {
      setStatusMessage(
        'Failed to load payment gateway. Using sandbox simulation...'
      );

      simulateUpgrade();

      return;
    }

    try {
      const response = await api.post(
        '/payment/create-order'
      );

      const orderData =
        response.data?.data || response.data;

      const options = {
        key: orderData.keyId,

        amount: orderData.amount,

        currency: orderData.currency,

        name: 'Financial Atelier',

        description:
          'Atelier Pro Subscription',

        order_id: orderData.orderId,

        handler: async (
          paymentResponse
        ) => {
          setLoading(true);

          setStatusMessage(
            'Verifying transaction security...'
          );

          try {
            const verifyRes =
              await api.post(
                '/payment/verify',
                {
                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,
                }
              );

            const updatedUser =
              verifyRes.data?.data ||
              verifyRes.data;

            updateLocalUser(updatedUser);

            setStatusMessage(
              'Welcome to the Pro Atelier!'
            );

            setTimeout(() => {
              navigate('/dashboard');
            }, 1500);
          } catch (err) {
            console.error(err);

            simulateUpgrade();
          }
        },

        prefill: {
          name: user?.fullName || '',

          email: user?.email || '',
        },

        theme: {
          color: '#006c49',
        },

        modal: {
          ondismiss: () => {
            setStatusMessage(
              'Checkout cancelled.'
            );

            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(
        options
      );

      rzp.on(
        'payment.failed',
        function () {
          simulateUpgrade();
        }
      );

      rzp.open();
    } catch (error) {
      console.error(error);

      simulateUpgrade();
    }
  };

  const isPro =
    user?.membershipStatus === 'Pro';

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8 pb-28 fade-in">

      {/* Hero */}
      <header className="text-center mb-12 md:mb-20 max-w-4xl mx-auto">

        <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-4 block">
          Membership Atelier
        </span>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-on-surface mb-6 leading-tight">

          Elevate Your{' '}

          <span className="text-primary bg-primary/5 px-3 md:px-4 py-1 rounded-2xl inline-block">
            Art of Finance
          </span>

        </h1>

        <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
          Step away from generic spreadsheets.
          Experience financial clarity through
          a bespoke premium finance system.
        </p>
      </header>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">

        {/* Free Plan */}
        <div className="card p-6 md:p-10 flex flex-col rounded-[2rem] border border-slate-100 bg-white">

          <div className="mb-8">

            <h3 className="text-3xl md:text-4xl font-black text-on-surface mb-3">
              Curator (Free)
            </h3>

            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Essential tools for aspiring
              financial curators.
            </p>

          </div>

          <div className="flex items-end gap-2 mb-10">

            <span className="text-5xl md:text-6xl font-black text-on-surface">
              $0
            </span>

            <span className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest mb-2">
              / Forever
            </span>

          </div>

          <ul className="space-y-5 flex-grow">

            {[
              {
                icon: 'check_circle',
                text: 'Manual Expense Tracking',
              },

              {
                icon: 'check_circle',
                text: 'Basic Monthly Summaries',
              },

              {
                icon: 'block',
                text: 'AI Receipt Scanning',
                disabled: true,
              },

              {
                icon: 'block',
                text: 'Advanced Insights',
                disabled: true,
              },
            ].map((item, i) => (
              <li
                key={i}
                className={`flex items-start gap-3 ${
                  item.disabled
                    ? 'opacity-30'
                    : ''
                }`}
              >

                <span
                  className={`material-symbols-outlined text-xl mt-0.5 ${
                    item.disabled
                      ? 'text-slate-400'
                      : 'text-primary'
                  }`}
                >
                  {item.icon}
                </span>

                <span className="text-sm md:text-base font-semibold text-slate-700 leading-relaxed">
                  {item.text}
                </span>

              </li>
            ))}
          </ul>

          <button
            disabled
            className="mt-10 w-full py-4 rounded-2xl border border-slate-200 text-slate-400 font-black text-xs uppercase tracking-widest"
          >
            {isPro
              ? 'Legacy Active'
              : 'Current Selection'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="relative card p-6 md:p-10 flex flex-col rounded-[2rem] border-2 border-primary bg-white shadow-emerald overflow-hidden">

          {/* Badge */}
          <div className="absolute top-0 right-0 bg-primary px-5 py-2 rounded-bl-3xl">

            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
              Bespoke Choice
            </span>

          </div>

          <div className="mb-8">

            <h3 className="text-3xl md:text-4xl font-black text-on-surface mb-3">
              Atelier Pro
            </h3>

            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              The complete bespoke studio
              experience.
            </p>

          </div>

          <div className="flex items-end gap-2 mb-10 flex-wrap">

            <span className="text-5xl md:text-6xl font-black text-on-surface">
              $9.99
            </span>

            <span className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest mb-2">
              / Per Month
            </span>

          </div>

          <ul className="space-y-5 flex-grow">

            {[
              {
                icon: 'auto_awesome',
                text: 'Unlimited AI Receipt Scanning',
              },

              {
                icon: 'insights',
                text: 'Advanced Predictive Insights',
              },

              {
                icon: 'verified',
                text: 'Priority Artisan Support',
              },

              {
                icon: 'file_export',
                text: 'Custom Export Formats',
              },
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3"
              >

                <span
                  className="material-symbols-outlined text-xl text-primary mt-0.5"
                  style={{
                    fontVariationSettings:
                      "'FILL' 1",
                  }}
                >
                  {item.icon}
                </span>

                <span className="text-sm md:text-base font-semibold text-on-surface leading-relaxed">
                  {item.text}
                </span>

              </li>
            ))}
          </ul>

          <button
            onClick={handleUpgrade}
            disabled={loading || isPro}
            className={`mt-10 w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${
              isPro
                ? 'bg-slate-100 text-slate-400'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {loading
              ? 'Processing...'
              : isPro
              ? 'Already Pro'
              : 'Unlock Pro Access'}
          </button>

          {statusMessage && (
            <p className="text-center mt-4 text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">
              {statusMessage}
            </p>
          )}
        </div>
      </div>

      {/* Benefits */}
      <section className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-slate-100 pt-16 text-center">

        {[
          {
            icon: 'lock',

            title: 'Bank-Grade Security',

            desc: 'Your financial data is protected with enterprise-grade encryption.',
          },

          {
            icon: 'update',

            title: 'Cancel Anytime',

            desc: 'No lock-in contracts. Upgrade or cancel whenever you want.',
          },

          {
            icon: 'cloud_done',

            title: 'Cross-Device Sync',

            desc: 'Access your finance atelier seamlessly across all devices.',
          },
        ].map((item, i) => (
          <div key={i}>

            <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">

              <span className="material-symbols-outlined text-primary text-2xl">
                {item.icon}
              </span>

            </div>

            <h4 className="font-black text-lg text-on-surface mb-3">
              {item.title}
            </h4>

            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
              {item.desc}
            </p>

          </div>
        ))}
      </section>
    </main>
  );
};

export default Membership;