"use client"
import { useActionState, useState } from "react";
import { acceptTermsAction } from "@/app/actions/accept-terms";
import { PieChart, FileText, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";

interface AcceptTermsPageProps {
  searchParams: Promise<{ terms?: string; privacy?: string }>;
}

export default function AcceptTermsPage({ searchParams: _searchParams }: AcceptTermsPageProps) {
  const [state, formAction] = useActionState(acceptTermsAction, null);
  const [isDark, setIsDark] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  const canSubmit = termsChecked && privacyChecked;

  return (
    <div className={`accept-root${isDark ? " dark" : ""}`}>
      <div className="accept-grid" />

      {/* Theme toggle */}
      <button
        className="accept-theme-toggle"
        onClick={() => setIsDark(!isDark)}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
        <span className="accept-theme-label">{isDark ? "LIGHT" : "DARK"}</span>
      </button>

      <div className="accept-center">
        {/* Logo */}
        <div className="accept-logo-block">
          <PieChart size={26} color="#3b82f6" strokeWidth={1.75} />
          <span className="accept-logo-title">Ventwise</span>
        </div>

        {/* Card */}
        <div className="accept-card">

          {/* Icon + Title */}
          <div className="accept-header">
            <div className="accept-icon-wrap">
              <CheckCircle size={36} color="#3b82f6" strokeWidth={1.5} />
            </div>
            <h1 className="accept-title">LEGAL DOCUMENTS UPDATED</h1>
            <p className="accept-subtitle">
              Our Terms &amp; Privacy Policy have been updated since your last visit.
              Please review and accept both documents to continue.
            </p>
          </div>

          {/* Document previews */}
          <div className="accept-docs-row">
            <Link href="/terms" target="_blank" className="accept-doc-card">
              <div className="accept-doc-icon">
                <FileText size={24} color="#3b82f6" strokeWidth={1.5} />
              </div>
              <div className="accept-doc-info">
                <span className="accept-doc-title">Terms of Conditions</span>
                <span className="accept-doc-meta">Version 1.0 · June 2025</span>
              </div>
              <span className="accept-doc-arrow">↗</span>
            </Link>

            <Link href="/privacy-policy" target="_blank" className="accept-doc-card">
              <div className="accept-doc-icon">
                <Shield size={24} color="#3b82f6" strokeWidth={1.5} />
              </div>
              <div className="accept-doc-info">
                <span className="accept-doc-title">Privacy Policy</span>
                <span className="accept-doc-meta">Version 1.0 · June 2025</span>
              </div>
              <span className="accept-doc-arrow">↗</span>
            </Link>
          </div>

          {/* Acceptance form */}
          <form action={formAction} className="accept-form">
            {/* Terms checkbox */}
            <label className={`accept-checkbox-label${termsChecked ? " checked" : ""}`} htmlFor="terms_accept_cb">
              <div className="accept-checkbox-wrap">
                <input
                  type="checkbox"
                  id="terms_accept_cb"
                  name="terms_accepted"
                  checked={termsChecked}
                  onChange={(e) => setTermsChecked(e.target.checked)}
                  className="accept-checkbox-input"
                />
                <div className="accept-custom-checkbox">
                  {termsChecked && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="accept-checkbox-text">
                I have read and agree to the{" "}
                <Link href="/terms" target="_blank" className="accept-inline-link">Terms of Conditions</Link>
              </span>
            </label>

            {/* Privacy checkbox */}
            <label className={`accept-checkbox-label${privacyChecked ? " checked" : ""}`} htmlFor="privacy_accept_cb">
              <div className="accept-checkbox-wrap">
                <input
                  type="checkbox"
                  id="privacy_accept_cb"
                  name="privacy_accepted"
                  checked={privacyChecked}
                  onChange={(e) => setPrivacyChecked(e.target.checked)}
                  className="accept-checkbox-input"
                />
                <div className="accept-custom-checkbox">
                  {privacyChecked && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="accept-checkbox-text">
                I have read and agree to the{" "}
                <Link href="/privacy-policy" target="_blank" className="accept-inline-link">Privacy Policy</Link>
              </span>
            </label>

            {/* Error */}
            {state?.error && (
              <div className="accept-error">{state.error}</div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`accept-submit-btn${canSubmit ? "" : " disabled"}`}
            >
              ACCEPT & CONTINUE TO PLATFORM
            </button>

            <p className="accept-note">
              You must accept both documents to access Ventwise.
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600&display=swap');

        .accept-root {
          min-height: 100vh; min-width: 100vw;
          background: #f0f4f8; position: relative;
          overflow: hidden; display: flex;
          align-items: center; justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          transition: background 0.3s;
        }
        .accept-grid {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none; z-index: 0;
        }
        .accept-theme-toggle {
          position: fixed; top: 20px; right: 20px; z-index: 20;
          display: flex; align-items: center; gap: 7px;
          background: #ffffff; border: 1px solid #cbd5e1;
          border-radius: 20px; padding: 6px 14px 6px 10px;
          cursor: pointer; font-family: 'Share Tech Mono', monospace;
          font-size: 11px; color: #475569; letter-spacing: 0.12em;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          transition: background 0.3s, border-color 0.3s, color 0.3s;
        }
        .accept-theme-toggle:hover { border-color: #3b82f6; color: #2563eb; }
        .accept-theme-label { font-size: 10px; letter-spacing: 0.15em; }
        .accept-center {
          position: relative; z-index: 5;
          display: flex; flex-direction: column;
          align-items: center; gap: 12px;
          width: 100%; max-width: 540px; padding: 24px 16px;
        }
        .accept-logo-block {
          display: flex; align-items: center; gap: 10px;
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 10px; padding: 8px 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: background 0.3s, border-color 0.3s;
        }
        .accept-logo-title {
          font-family: 'Inter', sans-serif;
          font-size: 18px; font-weight: 600; color: #1e293b;
          transition: color 0.3s;
        }
        .accept-card {
          width: 100%;
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 14px; padding: 32px 32px 28px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .accept-header {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; margin-bottom: 24px; gap: 10px;
        }
        .accept-icon-wrap {
          width: 68px; height: 68px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #bfdbfe; border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(59,130,246,0.15);
          margin-bottom: 4px;
        }
        .accept-title {
          font-size: 13px; font-weight: 700; color: #1e293b;
          letter-spacing: 0.22em; margin: 0;
          transition: color 0.3s;
        }
        .accept-subtitle {
          font-size: 11px; color: #64748b; letter-spacing: 0.05em;
          line-height: 1.7; margin: 0; max-width: 380px;
          transition: color 0.3s;
        }
        .accept-docs-row {
          display: flex; flex-direction: column; gap: 10px;
          margin-bottom: 24px;
        }
        .accept-doc-card {
          display: flex; align-items: center; gap: 14px;
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 10px; padding: 14px 16px;
          text-decoration: none; cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .accept-doc-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 2px 12px rgba(59,130,246,0.12);
          background: #eff6ff;
        }
        .accept-doc-icon {
          width: 40px; height: 40px;
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 9px; display: flex;
          align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.2s;
        }
        .accept-doc-info {
          flex: 1; display: flex; flex-direction: column; gap: 3px;
        }
        .accept-doc-title {
          font-size: 12px; font-weight: 700; color: #1e293b;
          letter-spacing: 0.1em; transition: color 0.3s;
        }
        .accept-doc-meta {
          font-size: 10px; color: #94a3b8; letter-spacing: 0.08em;
        }
        .accept-doc-arrow {
          font-size: 14px; color: #3b82f6; flex-shrink: 0;
        }
        .accept-form {
          display: flex; flex-direction: column; gap: 14px;
        }
        .accept-checkbox-label {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 16px;
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 10px; cursor: pointer;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          user-select: none;
        }
        .accept-checkbox-label:hover {
          border-color: #93c5fd; background: #eff6ff;
        }
        .accept-checkbox-label.checked {
          border-color: #3b82f6; background: #eff6ff;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.1);
        }
        .accept-checkbox-wrap { flex-shrink: 0; margin-top: 1px; }
        .accept-checkbox-input {
          position: absolute; opacity: 0; width: 0; height: 0;
        }
        .accept-custom-checkbox {
          width: 20px; height: 20px;
          border: 2px solid #cbd5e1;
          border-radius: 5px; background: #fff;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s, background 0.2s;
          flex-shrink: 0;
        }
        .accept-checkbox-label.checked .accept-custom-checkbox {
          background: #2563eb; border-color: #2563eb;
        }
        .accept-checkbox-text {
          font-size: 12px; color: #475569;
          letter-spacing: 0.05em; line-height: 1.6;
          transition: color 0.3s;
        }
        .accept-inline-link {
          color: #2563eb; font-weight: 700; text-decoration: none;
          transition: color 0.2s;
        }
        .accept-inline-link:hover { text-decoration: underline; }
        .accept-error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.3);
          color: #dc2626; font-size: 12px;
          letter-spacing: 0.08em; border-radius: 7px;
          padding: 9px 13px; text-align: center;
        }
        .accept-submit-btn {
          width: 100%; height: 50px;
          background: #2563eb; border: none; border-radius: 9px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px; font-weight: 700; color: #fff;
          letter-spacing: 0.15em; cursor: pointer;
          transition: background 0.2s, transform 0.1s, opacity 0.2s;
        }
        .accept-submit-btn:hover:not(.disabled) { background: #1d4ed8; transform: translateY(-1px); }
        .accept-submit-btn:active:not(.disabled) { transform: translateY(0); }
        .accept-submit-btn.disabled {
          background: #cbd5e1; color: #94a3b8; cursor: not-allowed;
          opacity: 0.7;
        }
        .accept-note {
          font-size: 10px; color: #94a3b8;
          text-align: center; letter-spacing: 0.08em; margin: 0;
          line-height: 1.6;
        }

        /* ═════ DARK THEME ═════ */
        .accept-root.dark { background: #0f172a; }
        .accept-root.dark .accept-grid {
          background-image:
            linear-gradient(rgba(0,180,216,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,180,216,0.07) 1px, transparent 1px);
        }
        .accept-root.dark .accept-theme-toggle { background: #1e293b; border-color: #334155; color: #94a3b8; }
        .accept-root.dark .accept-theme-toggle:hover { border-color: #00b4d8; color: #00b4d8; }
        .accept-root.dark .accept-logo-block { background: #1e293b; border-color: #334155; }
        .accept-root.dark .accept-logo-title { color: #e2e8f0; }
        .accept-root.dark .accept-card { background: #1e293b; border-color: #334155; box-shadow: 0 4px 24px rgba(0,0,0,0.4); }
        .accept-root.dark .accept-icon-wrap { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-color: #334155; }
        .accept-root.dark .accept-title { color: #e2e8f0; }
        .accept-root.dark .accept-subtitle { color: #64748b; }
        .accept-root.dark .accept-doc-card { background: #0f172a; border-color: #334155; }
        .accept-root.dark .accept-doc-card:hover { border-color: #0284c7; background: #0f1f35; box-shadow: 0 2px 12px rgba(0,180,216,0.12); }
        .accept-root.dark .accept-doc-icon { background: #1e293b; border-color: #334155; }
        .accept-root.dark .accept-doc-title { color: #e2e8f0; }
        .accept-root.dark .accept-checkbox-label { background: #0f172a; border-color: #334155; }
        .accept-root.dark .accept-checkbox-label:hover { border-color: #0284c7; background: #0f1f35; }
        .accept-root.dark .accept-checkbox-label.checked { border-color: #0284c7; background: #0f1f35; box-shadow: 0 0 0 2px rgba(0,180,216,0.1); }
        .accept-root.dark .accept-custom-checkbox { border-color: #475569; background: #1e293b; }
        .accept-root.dark .accept-checkbox-label.checked .accept-custom-checkbox { background: #0284c7; border-color: #0284c7; }
        .accept-root.dark .accept-checkbox-text { color: #94a3b8; }
        .accept-root.dark .accept-inline-link { color: #38bdf8; }
        .accept-root.dark .accept-submit-btn { background: #0284c7; }
        .accept-root.dark .accept-submit-btn:hover:not(.disabled) { background: #0369a1; }
        .accept-root.dark .accept-submit-btn.disabled { background: #334155; color: #475569; }
        .accept-root.dark .accept-error { color: #f87171; background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.35); }

        @media (max-width: 600px) {
          .accept-card { padding: 24px 18px; }
        }
      `}</style>
    </div>
  );
}
