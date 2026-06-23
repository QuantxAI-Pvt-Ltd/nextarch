"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PieChart, Check, Zap, Shield, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useGlobalTheme } from "@/components/global-theme-context";

const PLANS = [
  {
    id: "monthly" as const,
    name: "MONTHLY",
    price: "₹250",
    period: "/month",
    subtext: null,
    badge: null,
    features: [
      "Full calculator access",
      "All 6 calculation modules",
      "Real-time computation",
      "Email support",
    ],
    cta: "Start Free Trial",
    accent: "#2563eb",
    glow: "rgba(37,99,235,0.15)",
  },
  {
    id: "quarterly" as const,
    name: "QUARTERLY",
    price: "₹500",
    period: "/3 months",
    subtext: "₹167/month — save 33%",
    badge: "BEST VALUE",
    features: [
      "Full calculator access",
      "All 6 calculation modules",
      "Real-time computation",
      "Priority support",
      "Save ₹250 vs monthly",
    ],
    cta: "Start Free Trial",
    accent: "#7c3aed",
    glow: "rgba(124,58,237,0.15)",
  },
];

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="checkout.razorpay.com"]')) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay failed to load"));
    document.body.appendChild(script);
  });
}

export default function SubscribePage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useGlobalTheme();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Auth guard: redirect to login only on definitive 401 ──────
  // Do NOT redirect on network errors or 5xx — those are transient
  // (e.g. cold-start DB delay on Vercel) and would kick logged-in users.
  useEffect(() => {
    fetch("/api/usage")
      .then((r) => {
        if (r.status === 401) router.replace("/login?from=/subscribe");
      })
      .catch(() => null); // silent on network failure
  }, [router]);

  const handleSubscribe = useCallback(
    async (planId: "monthly" | "quarterly") => {
      setError(null);
      setLoading(planId);

      try {
        await loadRazorpayScript();

        // 1. Create Razorpay Subscription on server
        const orderRes = await fetch("/api/subscribe/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: planId }),
        });

        if (!orderRes.ok) {
          // If unauthenticated, redirect to login then back here
          if (orderRes.status === 401) {
            router.push("/login?from=/subscribe");
            return;
          }
          // Safely parse error — body may be empty or HTML on a 500
          const text = await orderRes.text();
          let errMsg = "Could not create subscription";
          try {
            const data = JSON.parse(text);
            if (data?.error) errMsg = data.error;
          } catch { /* body was not JSON, keep default message */ }
          throw new Error(errMsg);
        }

        const { subscriptionId, label } = await orderRes.json();

        // 2. Open Razorpay Checkout with subscription_id
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: Record<string, unknown> = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          subscription_id: subscriptionId,   // ← subscription, not order
          name: "Ventwise Precision",
          description: label,
          theme: { color: planId === "monthly" ? "#2563eb" : "#7c3aed" },
          modal: {
            ondismiss: () => setLoading(null),
          },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_subscription_id: string;
            razorpay_signature: string;
          }) => {
            // 3. Verify subscription payment on server
            try {
              const verifyRes = await fetch("/api/subscribe/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...response, plan: planId }),
              });

              if (!verifyRes.ok) {
                const data = await verifyRes.json();
                throw new Error(data.error || "Verification failed");
              }

              router.push("/calculator?subscribed=1");
            } catch (err) {
              setError(
                err instanceof Error ? err.message : "Payment verification failed"
              );
              setLoading(null);
            }
          },
        };

        new window.Razorpay(options).open();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setLoading(null);
      }
    },
    [router]
  );

  return (
    <div className={`sub-root${isDark ? " dark" : ""}`}>
      {/* Grid background */}
      <div className="sub-grid" />
      {/* Radial glow */}
      <div className="sub-glow" />

      {/* Top bar */}
      <div className="sub-topbar">
        <Link href="/calculator" className="sub-back-link">
          <ArrowLeft size={16} />
          <span>Back to Calculator</span>
        </Link>

        <div className="sub-logo">
          <PieChart size={22} color="#3b82f6" strokeWidth={1.75} />
          <span>Ventwise</span>
        </div>

        <button
          className="sub-theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>

      {/* Hero */}
      <div className="sub-hero">
        <div className="sub-trial-badge">
          <Zap size={13} />
          <span>7-DAY FREE TRIAL · NO PAYMENT UNTIL TRIAL ENDS</span>
        </div>

        <h1 className="sub-heading">Choose Your Plan</h1>
        <p className="sub-subheading">
          Unlock unlimited access to Ventwise Precision calculators.
          <br />
          Try free for 7 days — cancel anytime.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="sub-error">{error}</div>
      )}

      {/* Plan cards */}
      <div className="sub-cards">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`sub-card${plan.badge ? " sub-card--featured" : ""}`}
            style={{ "--card-accent": plan.accent, "--card-glow": plan.glow } as React.CSSProperties}
          >
            {plan.badge && (
              <div className="sub-card-badge">{plan.badge}</div>
            )}

            {/* Plan name */}
            <p className="sub-plan-name">{plan.name}</p>

            {/* Price */}
            <div className="sub-price-block">
              <span className="sub-price">{plan.price}</span>
              <span className="sub-period">{plan.period}</span>
            </div>
            {plan.subtext && (
              <p className="sub-save-text">{plan.subtext}</p>
            )}

            {/* Divider */}
            <div className="sub-divider" />

            {/* Features */}
            <ul className="sub-features">
              {plan.features.map((f) => (
                <li key={f} className="sub-feature-item">
                  <Check size={14} className="sub-check" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {/* Trial note */}
            <div className="sub-trial-note">
              <Shield size={12} />
              <span>7-day free trial included</span>
            </div>

            {/* CTA */}
            <button
              className="sub-cta-btn"
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading !== null}
              style={{ background: plan.accent }}
            >
              {loading === plan.id ? (
                <span className="sub-spinner" />
              ) : (
                plan.cta
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Trust strip */}
      <div className="sub-trust">
        <div className="sub-trust-item">
          <Shield size={14} />
          <span>Secure payments via Razorpay</span>
        </div>
        <div className="sub-trust-sep" />
        <div className="sub-trust-item">
          <Star size={14} />
          <span>Cancel anytime</span>
        </div>
        <div className="sub-trust-sep" />
        <div className="sub-trust-item">
          <Zap size={14} />
          <span>Instant activation</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600;700&display=swap');

        /* ── Root ── */
        .sub-root {
          min-height: 100vh;
          background: #f0f4f8;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: background 0.3s;
        }
        .sub-root.dark { background: #080d18; }

        /* ── Grid ── */
        .sub-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .sub-root.dark .sub-grid {
          background-image:
            linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px);
        }

        /* ── Radial glow ── */
        .sub-glow {
          position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
          width: 900px; height: 600px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .sub-root.dark .sub-glow {
          background: radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%);
        }

        /* ── Top bar ── */
        .sub-topbar {
          width: 100%; max-width: 900px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px; position: relative; z-index: 10;
        }
        .sub-back-link {
          display: flex; align-items: center; gap: 7px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px; letter-spacing: 0.1em;
          color: #64748b; text-decoration: none;
          transition: color 0.2s;
        }
        .sub-back-link:hover { color: #3b82f6; }
        .sub-root.dark .sub-back-link { color: #475569; }
        .sub-root.dark .sub-back-link:hover { color: #60a5fa; }

        .sub-logo {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 17px; font-weight: 600;
          color: #1e293b; letter-spacing: 0.01em;
        }
        .sub-root.dark .sub-logo { color: #e2e8f0; }

        .sub-theme-btn {
          background: none; border: 1px solid #e2e8f0; border-radius: 8px;
          padding: 6px 10px; cursor: pointer; color: #64748b;
          display: flex; align-items: center; transition: all 0.2s;
        }
        .sub-theme-btn:hover { border-color: #3b82f6; color: #3b82f6; }
        .sub-root.dark .sub-theme-btn { border-color: #1e293b; color: #475569; }
        .sub-root.dark .sub-theme-btn:hover { border-color: #6366f1; color: #818cf8; }

        /* ── Hero ── */
        .sub-hero {
          z-index: 5; text-align: center;
          padding: 10px 24px 40px; max-width: 680px;
          display: flex; flex-direction: column; align-items: center; gap: 16px;
        }
        .sub-trial-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3);
          color: #16a34a; border-radius: 24px;
          padding: 6px 16px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; letter-spacing: 0.15em;
          animation: pulse-badge 2.5s ease-in-out infinite;
        }
        .sub-root.dark .sub-trial-badge { color: #4ade80; background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.25); }
        @keyframes pulse-badge {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.2); }
          50% { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
        }
        .sub-heading {
          font-size: clamp(28px, 5vw, 42px); font-weight: 700;
          color: #0f172a; letter-spacing: -0.02em; margin: 0;
          transition: color 0.3s;
        }
        .sub-root.dark .sub-heading { color: #f1f5f9; }
        .sub-subheading {
          font-size: 15px; color: #64748b; line-height: 1.6; margin: 0;
          transition: color 0.3s;
        }
        .sub-root.dark .sub-subheading { color: #475569; }

        /* ── Error ── */
        .sub-error {
          z-index: 10; background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.3); color: #dc2626;
          border-radius: 8px; padding: 10px 20px; font-size: 13px;
          margin-bottom: 16px; text-align: center;
          font-family: 'Share Tech Mono', monospace; letter-spacing: 0.05em;
        }

        /* ── Cards ── */
        .sub-cards {
          position: relative; z-index: 5;
          display: flex; gap: 24px; flex-wrap: wrap;
          justify-content: center; padding: 0 24px;
          width: 100%; max-width: 900px;
        }
        .sub-card {
          flex: 1; min-width: 280px; max-width: 380px;
          background: #ffffff; border: 1px solid #e2e8f0;
          border-radius: 20px; padding: 32px 28px;
          position: relative;
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .sub-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px var(--card-glow, rgba(37,99,235,0.12));
          border-color: var(--card-accent, #2563eb);
        }
        .sub-root.dark .sub-card {
          background: #0f172a; border-color: #1e293b;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .sub-root.dark .sub-card:hover {
          border-color: var(--card-accent, #2563eb);
          box-shadow: 0 16px 50px var(--card-glow, rgba(37,99,235,0.2));
        }

        /* Featured card */
        .sub-card--featured {
          background: linear-gradient(135deg, #0f172a 0%, #1a0a3d 100%);
          border-color: rgba(124,58,237,0.5);
          box-shadow: 0 8px 40px rgba(124,58,237,0.2);
        }
        .sub-card--featured:hover {
          box-shadow: 0 16px 60px rgba(124,58,237,0.3);
        }
        .sub-root:not(.dark) .sub-card--featured {
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
          border-color: rgba(124,58,237,0.4);
        }

        /* Badge */
        .sub-card-badge {
          position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
          background: linear-gradient(90deg, #7c3aed, #a855f7);
          color: #fff; font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; padding: 4px 16px; border-radius: 20px;
          font-family: 'Share Tech Mono', monospace;
          box-shadow: 0 4px 12px rgba(124,58,237,0.4);
        }

        /* Plan name */
        .sub-plan-name {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px; letter-spacing: 0.25em;
          color: #94a3b8; margin: 0 0 16px;
        }
        .sub-card--featured .sub-plan-name { color: #a78bfa; }

        /* Price */
        .sub-price-block {
          display: flex; align-items: baseline; gap: 4px; margin-bottom: 4px;
        }
        .sub-price {
          font-size: 42px; font-weight: 700; color: #0f172a;
          letter-spacing: -0.03em; line-height: 1;
          transition: color 0.3s;
        }
        .sub-root.dark .sub-price { color: #f1f5f9; }
        .sub-card--featured .sub-price { color: #f1f5f9; }
        .sub-root:not(.dark) .sub-card--featured .sub-price { color: #1e1b4b; }

        .sub-period {
          font-size: 15px; color: #94a3b8; font-weight: 500;
        }
        .sub-save-text {
          font-size: 12px; color: #a78bfa;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.06em; margin: 0 0 0;
        }

        /* Divider */
        .sub-divider {
          height: 1px; background: #e2e8f0; margin: 20px 0;
          transition: background 0.3s;
        }
        .sub-root.dark .sub-divider { background: #1e293b; }
        .sub-card--featured .sub-divider { background: rgba(124,58,237,0.2); }

        /* Features */
        .sub-features { list-style: none; padding: 0; margin: 0 0 20px; display: flex; flex-direction: column; gap: 10px; }
        .sub-feature-item {
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: #475569; transition: color 0.3s;
        }
        .sub-root.dark .sub-feature-item { color: #94a3b8; }
        .sub-card--featured .sub-feature-item { color: #c4b5fd; }
        .sub-root:not(.dark) .sub-card--featured .sub-feature-item { color: #4c1d95; }
        .sub-check { color: #22c55e; flex-shrink: 0; }
        .sub-card--featured .sub-check { color: #a78bfa; }

        /* Trial note */
        .sub-trial-note {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; color: #94a3b8;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.08em; margin-bottom: 20px;
        }

        /* CTA */
        .sub-cta-btn {
          width: 100%; height: 50px; border: none; border-radius: 10px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px; font-weight: 700; color: #fff;
          letter-spacing: 0.15em; cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          display: flex; align-items: center; justify-content: center;
        }
        .sub-cta-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .sub-cta-btn:active:not(:disabled) { transform: translateY(0); }
        .sub-cta-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Spinner */
        .sub-spinner {
          width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Trust strip */
        .sub-trust {
          position: relative; z-index: 5;
          display: flex; align-items: center; gap: 16px;
          flex-wrap: wrap; justify-content: center;
          margin-top: 40px; padding: 0 24px;
          font-size: 12px; color: #94a3b8;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.06em;
        }
        .sub-trust-item { display: flex; align-items: center; gap: 6px; }
        .sub-trust-sep { width: 4px; height: 4px; border-radius: 50%; background: #334155; }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .sub-cards { gap: 16px; }
          .sub-card { min-width: 100%; }
          .sub-topbar { padding: 16px; }
        }
      `}</style>
    </div>
  );
}
