"use client";

import { useRouter } from "next/navigation";
import { Lock, Zap, ArrowRight, X } from "lucide-react";

interface PaywallPopupProps {
  trialDaysLeft: number;
  plan: string | null;
  onDismiss?: () => void; // only for warning banner, not for hard block
}

export function PaywallPopup({ trialDaysLeft, plan, onDismiss }: PaywallPopupProps) {
  const router = useRouter();
  const isBlocked = !plan && trialDaysLeft === 0;
  const isWarning = !plan && trialDaysLeft > 0 && trialDaysLeft <= 2;

  // ── Soft warning banner (1–2 days left) ─────────────────────
  if (isWarning) {
    return (
      <div className="pw-banner">
        <Zap size={15} className="pw-banner-icon" />
        <span>
          <strong>{trialDaysLeft} day{trialDaysLeft === 1 ? "" : "s"} left</strong> in your free trial.
        </span>
        <button
          className="pw-banner-upgrade"
          onClick={() => router.push("/subscribe")}
        >
          Upgrade now <ArrowRight size={12} />
        </button>
        {onDismiss && (
          <button className="pw-banner-close" onClick={onDismiss} aria-label="Dismiss">
            <X size={14} />
          </button>
        )}

        <style>{`
          .pw-banner {
            display: flex; align-items: center; gap: 10px;
            background: rgba(234,179,8,0.08); border: 1px solid rgba(234,179,8,0.3);
            border-radius: 10px; padding: 10px 16px; margin-bottom: 16px;
            font-size: 13px; color: #854d0e;
            font-family: 'Share Tech Mono', monospace; letter-spacing: 0.04em;
            animation: fadeIn 0.3s ease;
          }
          .pw-banner-icon { color: #eab308; flex-shrink: 0; }
          .pw-banner-upgrade {
            margin-left: auto; display: flex; align-items: center; gap: 5px;
            background: #eab308; border: none; border-radius: 6px;
            padding: 5px 12px; font-size: 11px; font-weight: 700;
            color: #fff; cursor: pointer; letter-spacing: 0.1em;
            font-family: 'Share Tech Mono', monospace;
            transition: opacity 0.2s;
          }
          .pw-banner-upgrade:hover { opacity: 0.85; }
          .pw-banner-close {
            background: none; border: none; cursor: pointer;
            color: #854d0e; padding: 2px; display: flex; align-items: center;
            opacity: 0.6; transition: opacity 0.2s;
          }
          .pw-banner-close:hover { opacity: 1; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    );
  }

  // ── Hard paywall block ────────────────────────────────────────
  if (!isBlocked) return null;

  return (
    <div className="pw-overlay">
      <div className="pw-card">
        {/* Lock icon */}
        <div className="pw-lock-ring">
          <div className="pw-lock-inner">
            <Lock size={28} />
          </div>
        </div>

        <h2 className="pw-title">Free Trial Ended</h2>
        <p className="pw-subtitle">
          Your 7-day free trial has expired. Subscribe to continue using<br />
          NextArch Precision Calculator.
        </p>

        {/* Mini plan cards */}
        <div className="pw-plans">
          <div className="pw-plan">
            <div className="pw-plan-label">MONTHLY</div>
            <div className="pw-plan-price">₹500<span>/mo</span></div>
          </div>
          <div className="pw-plan pw-plan--featured">
            <div className="pw-plan-best">BEST VALUE</div>
            <div className="pw-plan-label">QUARTERLY</div>
            <div className="pw-plan-price">₹1,000<span>/3mo</span></div>
            <div className="pw-plan-save">Save 33%</div>
          </div>
        </div>

        <button
          className="pw-cta"
          onClick={() => router.push("/subscribe")}
        >
          <Zap size={15} />
          View Plans &amp; Subscribe
        </button>

        <p className="pw-note">Cancel anytime · Instant activation</p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600;700&display=swap');

        .pw-overlay {
          position: fixed; inset: 0; z-index: 100;
          display: flex; align-items: center; justify-content: center;
          background: rgba(8, 13, 24, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          animation: pw-fade 0.35s ease;
        }
        @keyframes pw-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .pw-card {
          background: #0f172a;
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 24px;
          padding: 44px 40px 36px;
          max-width: 440px;
          width: calc(100% - 40px);
          text-align: center;
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.1),
            0 30px 80px rgba(0,0,0,0.6),
            0 0 60px rgba(99,102,241,0.08);
          animation: pw-slide 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes pw-slide {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .pw-lock-ring {
          width: 72px; height: 72px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
          border: 1px solid rgba(99,102,241,0.3);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          animation: pw-pulse 2s ease-in-out infinite;
        }
        @keyframes pw-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.3); }
          50% { box-shadow: 0 0 0 10px rgba(99,102,241,0); }
        }
        .pw-lock-inner { color: #818cf8; }

        .pw-title {
          font-family: 'Inter', sans-serif;
          font-size: 22px; font-weight: 700;
          color: #f1f5f9; margin: 0 0 10px;
          letter-spacing: -0.01em;
        }
        .pw-subtitle {
          font-size: 13px; color: #64748b; line-height: 1.65;
          margin: 0 0 28px;
        }

        /* Mini plans */
        .pw-plans {
          display: flex; gap: 12px; margin-bottom: 28px;
        }
        .pw-plan {
          flex: 1; background: #1e293b; border: 1px solid #334155;
          border-radius: 12px; padding: 14px 12px;
          text-align: center; position: relative;
        }
        .pw-plan--featured {
          background: linear-gradient(135deg, #1a0a3d, #0f172a);
          border-color: rgba(124,58,237,0.4);
          box-shadow: 0 4px 20px rgba(124,58,237,0.15);
        }
        .pw-plan-best {
          position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
          background: linear-gradient(90deg, #7c3aed, #a855f7);
          color: #fff; font-size: 9px; font-weight: 700;
          letter-spacing: 0.18em; padding: 3px 10px; border-radius: 12px;
          font-family: 'Share Tech Mono', monospace;
        }
        .pw-plan-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; letter-spacing: 0.2em; color: #64748b;
          margin-bottom: 6px;
        }
        .pw-plan--featured .pw-plan-label { color: #a78bfa; }
        .pw-plan-price {
          font-size: 22px; font-weight: 700; color: #e2e8f0;
          letter-spacing: -0.02em; font-family: 'Inter', sans-serif;
        }
        .pw-plan-price span { font-size: 12px; color: #64748b; font-weight: 400; }
        .pw-plan--featured .pw-plan-price span { color: #7c3aed; }
        .pw-plan-save {
          font-size: 11px; color: #a78bfa; margin-top: 4px;
          font-family: 'Share Tech Mono', monospace; letter-spacing: 0.08em;
        }

        /* CTA */
        .pw-cta {
          width: 100%; height: 52px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border: none; border-radius: 12px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px; font-weight: 700; color: #fff;
          letter-spacing: 0.15em; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 16px rgba(37,99,235,0.3);
          margin-bottom: 14px;
        }
        .pw-cta:hover { opacity: 0.9; transform: translateY(-1px); }
        .pw-cta:active { transform: translateY(0); }

        .pw-note {
          font-size: 11px; color: #475569;
          font-family: 'Share Tech Mono', monospace; letter-spacing: 0.08em;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
