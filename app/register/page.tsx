"use client"
import { registeraction } from "../actions/register";
import { useActionState } from "react";
import { useState } from "react";
import { PieChart } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [state, formAction] = useActionState(registeraction, null);
  const [isDark, setIsDark] = useState(false);
  const [termsChecked, setTermsChecked]     = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  const canSubmit = termsChecked && privacyChecked;

  return (
    <div className={`login-root${isDark ? " dark" : ""}`}>
      {/* Grid background */}
      <div className="login-grid" />

      {/* Theme toggle */}
      <button
        className="login-theme-toggle"
        onClick={() => setIsDark(!isDark)}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
        <span className="login-theme-label">{isDark ? "LIGHT" : "DARK"}</span>
      </button>

      {/* Main centered content */}
      <div className="login-center" style={{ maxWidth: 480 }}>

        {/* Logo */}
        <div className="login-logo-block">
          <div className="login-logo-icon">
            <PieChart size={30} color="#3b82f6" strokeWidth={1.75} />
          </div>
          <span className="login-logo-title">Ventwise</span>
        </div>

        {/* Success banner */}
        {/* Card */}
        <div className="login-card">

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <p className="reg-heading">CREATE ACCOUNT</p>
            <p className="reg-subheading">Register to access the platform</p>
          </div>

          <form action={formAction}>

            {/* Full Name */}
            <div className="login-field-group">
              <label className="login-label">FULL NAME</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="reg_name"
                  className="login-input"
                  placeholder="John Doe"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="login-field-group">
              <label className="login-label">OPERATOR IDENTITY</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="reg_email"
                  className="login-input"
                  placeholder="example@email.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field-group">
              <label className="login-label">ACCESS KEY</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  name="reg_pass"
                  className="login-input"
                  placeholder="••••••"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="login-field-group">
              <label className="login-label">CONFIRM ACCESS KEY</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                <input
                  type="password"
                  name="reg_confirm"
                  className="login-input"
                  placeholder="••••••"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Error */}
            {state?.error && (
              <div className="login-error">{state.error}</div>
            )}

            {/* ── Legal Acceptance Checkboxes ───────────────────────── */}
            <div className="reg-legal-section">
              <p className="reg-legal-heading">LEGAL AGREEMENTS</p>

              {/* Terms of Conditions */}
              <label
                className={`reg-legal-label${termsChecked ? " checked" : ""}`}
                htmlFor="reg_terms_cb"
              >
                <div className="reg-cb-wrap">
                  <input
                    type="checkbox"
                    id="reg_terms_cb"
                    name="terms_accepted"
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                    className="reg-cb-input"
                  />
                  <div className="reg-custom-cb">
                    {termsChecked && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="reg-cb-text">
                  I have read and agree to the{" "}
                  <Link href="/terms" target="_blank" className="reg-legal-link">Terms of Conditions</Link>
                </span>
              </label>

              {/* Privacy Policy */}
              <label
                className={`reg-legal-label${privacyChecked ? " checked" : ""}`}
                htmlFor="reg_privacy_cb"
              >
                <div className="reg-cb-wrap">
                  <input
                    type="checkbox"
                    id="reg_privacy_cb"
                    name="privacy_accepted"
                    checked={privacyChecked}
                    onChange={(e) => setPrivacyChecked(e.target.checked)}
                    className="reg-cb-input"
                  />
                  <div className="reg-custom-cb">
                    {privacyChecked && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="reg-cb-text">
                  I have read and agree to the{" "}
                  <Link href="/privacy-policy" target="_blank" className="reg-legal-link">Privacy Policy</Link>
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`login-submit-btn${canSubmit ? "" : " disabled"}`}
              style={{ marginBottom: 12 }}
            >
              CREATE ACCOUNT
            </button>

            {/* Back to login */}
            <div style={{ textAlign: "center" }}>
              <span className="reg-back-text">Already have an account? </span>
              <Link href="/login" className="reg-back-link">Sign In</Link>
            </div>

          </form>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600&display=swap');

        /* ═════════════════════════════════════
           BASE (inherits login-root styles)
        ═════════════════════════════════════ */
        .login-root {
          min-height: 100vh;
          min-width: 100vw;
          background: #f0f4f8;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          transition: background 0.3s;
        }
        .login-grid {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none; z-index: 0;
        }
        .login-theme-toggle {
          position: fixed; top: 64px; right: 18px; z-index: 20;
          display: flex; align-items: center; gap: 7px;
          background: #ffffff; border: 1px solid #cbd5e1;
          border-radius: 20px; padding: 6px 14px 6px 10px;
          cursor: pointer; font-family: 'Share Tech Mono', monospace;
          font-size: 11px; color: #475569; letter-spacing: 0.12em;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          transition: background 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.2s;
        }
        .login-theme-toggle:hover { border-color: #3b82f6; color: #2563eb; box-shadow: 0 4px 14px rgba(59,130,246,0.18); }
        .login-theme-label { font-size: 10px; letter-spacing: 0.15em; }
        .login-center {
          position: relative; z-index: 5;
          display: flex; flex-direction: column;
          align-items: center; gap: 10px;
          width: 100%; padding: 20px 16px;
        }
        .login-logo-block {
          display: flex; align-items: center; gap: 10px;
          background: #ffffff; border: 1px solid #cbd5e1;
          border-radius: 10px; padding: 10px 22px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: background 0.3s, border-color 0.3s;
        }
        .login-logo-icon { display: flex; align-items: center; }
        .login-logo-title {
          font-family: 'Inter', sans-serif;
          font-size: 20px; font-weight: 600;
          color: #1e293b; letter-spacing: 0.01em;
          transition: color 0.3s;
        }
        .login-card {
          width: 100%;
          background: #ffffff; border: 1px solid #e2e8f0;
          border-radius: 12px; padding: 28px 28px 24px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .reg-heading {
          font-size: 13px; font-weight: 700; color: #1e293b;
          letter-spacing: 0.25em; margin: 0 0 4px;
          transition: color 0.3s;
        }
        .reg-subheading {
          font-size: 11px; color: #64748b;
          letter-spacing: 0.1em; margin: 0;
          transition: color 0.3s;
        }
        .login-field-group { margin-bottom: 18px; }
        .login-label {
          display: block; font-size: 11px; color: #64748b;
          letter-spacing: 0.2em; margin-bottom: 8px;
          transition: color 0.3s;
        }
        .login-input-wrapper {
          display: flex; align-items: center;
          background: #f8fafc; border: 1px solid #cbd5e1;
          border-radius: 8px; padding: 0 14px; height: 46px;
          transition: border-color 0.2s, background 0.3s;
        }
        .login-input-wrapper:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.12);
        }
        .login-input-icon {
          margin-right: 10px; display: flex; align-items: center;
          opacity: 0.5; color: #475569; transition: color 0.3s;
        }
        .login-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px; color: #1e293b; letter-spacing: 0.1em;
          transition: color 0.3s;
        }
        .login-input::placeholder { color: #94a3b8; }
        .login-submit-btn {
          width: 100%; height: 48px;
          background: #2563eb; border: none; border-radius: 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px; font-weight: 700; color: #fff;
          letter-spacing: 0.18em; cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .login-submit-btn:hover { background: #1d4ed8; transform: translateY(-1px); }
        .login-submit-btn:active { transform: translateY(0); }
        .login-error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.3);
          color: #dc2626; font-size: 12px;
          letter-spacing: 0.1em; border-radius: 6px;
          padding: 8px 12px; margin-bottom: 14px; text-align: center;
        }
        .reg-back-text { font-size: 12px; color: #64748b; letter-spacing: 0.05em; }
        .reg-back-link {
          font-size: 12px; color: #7c3aed; letter-spacing: 0.05em;
          text-decoration: none; font-family: 'Share Tech Mono', monospace;
          transition: color 0.2s;
        }
        .reg-back-link:hover { text-decoration: underline; }

        /* ═════ LEGAL CHECKBOXES ═════ */
        .reg-legal-section {
          margin-bottom: 16px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .reg-legal-heading {
          font-size: 10px; color: #94a3b8;
          letter-spacing: 0.25em; margin: 0 0 4px;
          transition: color 0.3s;
        }
        .reg-legal-label {
          display: flex; align-items: flex-start; gap: 11px;
          padding: 11px 14px;
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 9px; cursor: pointer;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          user-select: none;
        }
        .reg-legal-label:hover { border-color: #93c5fd; background: #eff6ff; }
        .reg-legal-label.checked {
          border-color: #3b82f6; background: #eff6ff;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.1);
        }
        .reg-cb-wrap { flex-shrink: 0; margin-top: 1px; }
        .reg-cb-input {
          position: absolute; opacity: 0; width: 0; height: 0;
        }
        .reg-custom-cb {
          width: 18px; height: 18px;
          border: 2px solid #cbd5e1; border-radius: 4px;
          background: #fff; display: flex;
          align-items: center; justify-content: center;
          transition: border-color 0.2s, background 0.2s;
          flex-shrink: 0;
        }
        .reg-legal-label.checked .reg-custom-cb {
          background: #2563eb; border-color: #2563eb;
        }
        .reg-cb-text {
          font-size: 11px; color: #475569;
          letter-spacing: 0.04em; line-height: 1.6;
          transition: color 0.3s;
        }
        .reg-legal-link {
          color: #2563eb; font-weight: 700; text-decoration: none;
          transition: color 0.2s;
        }
        .reg-legal-link:hover { text-decoration: underline; }
        .login-submit-btn.disabled {
          background: #cbd5e1 !important; color: #94a3b8 !important;
          cursor: not-allowed; opacity: 0.75;
          transform: none !important;
        }

        /* ═════ DARK THEME ═════ */
        .login-root.dark { background: #0f172a; }
        .login-root.dark .login-grid {
          background-image:
            linear-gradient(rgba(0,180,216,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,180,216,0.07) 1px, transparent 1px);
        }
        .login-root.dark .login-theme-toggle {
          background: #1e293b; border-color: #334155;
          color: #94a3b8; box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .login-root.dark .login-theme-toggle:hover {
          border-color: #00b4d8; color: #00b4d8;
          box-shadow: 0 4px 14px rgba(0,180,216,0.25);
        }
        .login-root.dark .login-logo-block {
          background: #1e293b; border-color: #334155;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .login-root.dark .login-logo-title { color: #e2e8f0; }
        .login-root.dark .login-card {
          background: #1e293b; border-color: #334155;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }
        .login-root.dark .reg-heading { color: #e2e8f0; }
        .login-root.dark .reg-subheading { color: #64748b; }
        .login-root.dark .login-label { color: #64748b; }
        .login-root.dark .login-input-wrapper {
          background: #0f172a; border-color: #334155;
        }
        .login-root.dark .login-input-wrapper:focus-within {
          border-color: #00b4d8;
          box-shadow: 0 0 0 2px rgba(0,180,216,0.15);
        }
        .login-root.dark .login-input-icon { color: #94a3b8; }
        .login-root.dark .login-input { color: #e2e8f0; }
        .login-root.dark .login-input::placeholder { color: #475569; }
        .login-root.dark .login-submit-btn { background: #0284c7; }
        .login-root.dark .login-submit-btn:hover:not(.disabled) { background: #0369a1; }
        .login-root.dark .login-error {
          color: #f87171; background: rgba(239,68,68,0.12);
          border-color: rgba(239,68,68,0.35);
        }
        .login-root.dark .reg-back-text { color: #475569; }
        .login-root.dark .reg-back-link { color: #818cf8; }
        .login-root.dark .reg-legal-heading { color: #475569; }
        .login-root.dark .reg-legal-label { background: #0f172a; border-color: #334155; }
        .login-root.dark .reg-legal-label:hover { border-color: #0284c7; background: #0f1f35; }
        .login-root.dark .reg-legal-label.checked { border-color: #0284c7; background: #0f1f35; box-shadow: 0 0 0 2px rgba(0,180,216,0.1); }
        .login-root.dark .reg-custom-cb { border-color: #475569; background: #1e293b; }
        .login-root.dark .reg-legal-label.checked .reg-custom-cb { background: #0284c7; border-color: #0284c7; }
        .login-root.dark .reg-cb-text { color: #94a3b8; }
        .login-root.dark .reg-legal-link { color: #38bdf8; }
        .login-root.dark .login-submit-btn.disabled { background: #334155 !important; color: #475569 !important; }
      `}</style>
    </div>
  );
}
