"use client"
import { loginaction } from "../actions/login";
import { useActionState } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { PieChart } from "lucide-react";

function LoginInner() {
  const [state, formAction] = useActionState(loginaction, null);
  const [isDark, setIsDark] = useState(false);
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";

  return (
    <div className={`login-root${isDark ? " dark" : ""}`}>
      {/* Grid background */}
      <div className="login-grid" />

      {/* Corner decoratives */}

      {/* Theme toggle button — top right, below corner text */}
      <button
        className="login-theme-toggle"
        onClick={() => setIsDark(!isDark)}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label="Toggle theme"
      >
        {isDark ? (
          /* Sun icon */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          /* Moon icon */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
        <span className="login-theme-label">{isDark ? "LIGHT" : "DARK"}</span>
      </button>

      {/* Watermark */}


      {/* Main centered content */}
      <div className="login-center">

        {/* Logo / Title */}
        <div className="login-logo-block">
          <div className="login-logo-icon">
            <PieChart size={30} color="#3b82f6" strokeWidth={1.75} />
          </div>
          <span className="login-logo-title">Ventwise</span>
        </div>


        {/* Card */}
        <div className="login-card">
          <form action={formAction}>
            {/* Operator Identity */}
            <div className="login-field-group">
              <label className="login-label">OPERATOR IDENTITY</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="login_email"
                  className="login-input"
                  placeholder="example@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Access Key */}
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
                  name="login_pass"
                  className="login-input"
                  placeholder="••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Success banner */}
            {registered && (
              <div className="login-success">Account created! You can now sign in.</div>
            )}

            {/* Error message */}
            {state?.error && (
              <div className="login-error">{state.error}</div>
            )}

            {/* Remember + Forgot row */}
            <div className="login-row-between">
              <label className="login-checkbox-label">
                <input type="checkbox" className="login-checkbox" />
                <span>Remember me</span>
              </label>
              <button type="button" className="login-link-btn">Reset password</button>
            </div>

            {/* Submit */}
            <button type="submit" className="login-submit-btn">
              LOGIN
            </button>
            <Link href="/register" className="reg-submit-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              REGISTER
            </Link>
          </form>
        </div>

        {/* Footer */}

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600&display=swap');

        /* ═══════════════════════════════════
           BASE (LIGHT THEME)
        ═══════════════════════════════════ */
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

        /* Grid */
        .login-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
          transition: background-image 0.3s;
        }

        /* Corner readouts */
        .login-corner-tl {
          position: fixed;
          top: 18px;
          left: 18px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          z-index: 10;
        }
        .login-corner-tr {
          position: fixed;
          top: 18px;
          right: 18px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          z-index: 10;
        }
        .login-corner-bl {
          position: fixed;
          bottom: 18px;
          left: 18px;
          z-index: 10;
        }
        .login-coord, .login-coord-right {
          font-size: 11px;
          color: #2563eb;
          letter-spacing: 0.05em;
          transition: color 0.3s;
        }

        /* ─── Theme Toggle Button ─── */
        .login-theme-toggle {
          position: fixed;
          top: 64px;
          right: 18px;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 7px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 20px;
          padding: 6px 14px 6px 10px;
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #475569;
          letter-spacing: 0.12em;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          transition: background 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.2s;
        }
        .login-theme-toggle:hover {
          border-color: #3b82f6;
          color: #2563eb;
          box-shadow: 0 4px 14px rgba(59,130,246,0.18);
        }
        .login-theme-label {
          font-size: 10px;
          letter-spacing: 0.15em;
        }

        /* Watermark */
        .login-watermark {
          position: fixed;
          right: -40px;
          top: 50%;
          transform: translateY(-50%) rotate(90deg);
          font-size: 90px;
          font-weight: 900;
          color: rgba(99,102,241,0.08);
          letter-spacing: 0.15em;
          pointer-events: none;
          z-index: 0;
          user-select: none;
          transition: color 0.3s;
        }

        /* Center layout */
        .login-center {
          position: relative; z-index: 5;
          display: flex; flex-direction: column;
          align-items: center; gap: 10px;
          width: 100%; max-width: 440px;
          padding: 20px 16px;
        }

        /* Logo */
        .login-logo-block {
          display: flex; align-items: center; gap: 10px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 10px 22px;
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
        .login-subtitle {
          font-size: 11px; color: #64748b;
          letter-spacing: 0.25em; margin-bottom: 4px;
          transition: color 0.3s;
        }

        /* Card */
        .login-card {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 28px 28px 24px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
        }

        /* Fields */
        .login-field-group { margin-bottom: 18px; }
        .login-label {
          display: block; font-size: 11px; color: #64748b;
          letter-spacing: 0.2em; margin-bottom: 8px;
          transition: color 0.3s;
        }
        .login-input-wrapper {
          display: flex; align-items: center;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px; padding: 0 14px; height: 46px;
          transition: border-color 0.2s, background 0.3s;
        }
        .login-input-wrapper:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.12);
        }
        .login-input-icon {
          margin-right: 10px; display: flex; align-items: center;
          opacity: 0.5; color: #475569;
          transition: color 0.3s;
        }
        .login-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px; color: #1e293b; letter-spacing: 0.1em;
          transition: color 0.3s;
        }
        .login-input::placeholder { color: #94a3b8; }

        /* Row */
        .login-row-between {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 20px;
        }
        .login-checkbox-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: #64748b;
          cursor: pointer; user-select: none;
          transition: color 0.3s;
        }
        .login-checkbox { accent-color: #3b82f6; width: 14px; height: 14px; }
        .login-link-btn {
          background: none; border: none;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px; color: #7c3aed; cursor: pointer;
          letter-spacing: 0.05em; padding: 0;
          transition: color 0.3s;
        }
        .login-link-btn:hover { text-decoration: underline; }

        /* Submit */
        .login-submit-btn {
          width: 100%; height: 48px;
          background: #2563eb; border: none; border-radius: 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px; font-weight: 700; color: #fff;
          letter-spacing: 0.18em; cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-bottom: 10px;
        }
        .reg-submit-btn {
          width: 100%; height: 48px;
          background: #000000; border: none; border-radius: 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px; font-weight: 700; color: #ffffff;
          letter-spacing: 0.18em; cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-bottom: 10px;
        }
        .login-submit-btn:hover { background: #1d4ed8; transform: translateY(-1px); }
        .login-submit-btn:active { transform: translateY(0); }

        /* Divider */
        .login-divider-label {
          text-align: center; font-size: 10px; color: #94a3b8;
          letter-spacing: 0.25em; margin-bottom: 14px; position: relative;
          transition: color 0.3s;
        }
        .login-divider-label::before,
        .login-divider-label::after {
          content: ''; position: absolute; top: 50%;
          width: 28%; height: 1px; background: #e2e8f0;
          transition: background 0.3s;
        }
        .login-divider-label::before { left: 0; }
        .login-divider-label::after { right: 0; }

        /* Social */
        .login-social-row { display: flex; gap: 12px; justify-content: center; }
        .login-social-btn {
          flex: 1; height: 46px;
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 8px; display: flex; align-items: center;
          justify-content: center; cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .login-social-btn:hover { border-color: #3b82f6; background: #eff6ff; }
        .login-github-icon { color: #1e293b; transition: color 0.3s; }

        /* Footer */
        .login-footer {
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; color: #94a3b8;
          letter-spacing: 0.2em; margin-top: 4px;
          transition: color 0.3s;
        }
        .login-footer-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22c55e; display: inline-block;
        }
        .login-footer-links {
          display: flex; align-items: center; gap: 8px;
          font-size: 10px; color: #94a3b8; letter-spacing: 0.15em;
        }
        .login-footer-link { color: #94a3b8; text-decoration: none; transition: color 0.3s; }
        .login-footer-link:hover { color: #3b82f6; }
        .login-footer-sep { color: #cbd5e1; }

        /* Error */
        .login-error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.3);
          color: #dc2626; font-size: 12px;
          letter-spacing: 0.1em; border-radius: 6px;
          padding: 8px 12px; margin-bottom: 14px; text-align: center;
        }
        /* Success */
        .login-success {
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.35);
          color: #16a34a; font-size: 12px;
          letter-spacing: 0.1em; border-radius: 6px;
          padding: 8px 12px; margin-bottom: 14px; text-align: center;
        }
        .login-root.dark .login-success {
          color: #4ade80;
          background: rgba(34,197,94,0.1);
          border-color: rgba(34,197,94,0.3);
        }

        /* ═══════════════════════════════════
           DARK THEME OVERRIDES
        ═══════════════════════════════════ */
        .login-root.dark {
          background: #0f172a;
        }
        .login-root.dark .login-grid {
          background-image:
            linear-gradient(rgba(0,180,216,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,180,216,0.07) 1px, transparent 1px);
        }
        .login-root.dark .login-coord,
        .login-root.dark .login-coord-right {
          color: #00b4d8;
        }
        .login-root.dark .login-watermark {
          color: rgba(99,102,241,0.06);
        }
        .login-root.dark .login-theme-toggle {
          background: #1e293b;
          border-color: #334155;
          color: #94a3b8;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .login-root.dark .login-theme-toggle:hover {
          border-color: #00b4d8;
          color: #00b4d8;
          box-shadow: 0 4px 14px rgba(0,180,216,0.25);
        }
        .login-root.dark .login-logo-block {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .login-root.dark .login-logo-title {
          color: #e2e8f0;
        }
        .login-root.dark .login-subtitle {
          color: #64748b;
        }
        .login-root.dark .login-card {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }
        .login-root.dark .login-label {
          color: #64748b;
        }
        .login-root.dark .login-input-wrapper {
          background: #0f172a;
          border-color: #334155;
        }
        .login-root.dark .login-input-wrapper:focus-within {
          border-color: #00b4d8;
          box-shadow: 0 0 0 2px rgba(0,180,216,0.15);
        }
        .login-root.dark .login-input-icon {
          color: #94a3b8;
        }
        .login-root.dark .login-input {
          color: #e2e8f0;
        }
        .login-root.dark .login-input::placeholder {
          color: #475569;
        }
        .login-root.dark .login-checkbox-label {
          color: #64748b;
        }
        .login-root.dark .login-link-btn {
          color: #818cf8;
        }
        .login-root.dark .login-submit-btn {
          background: #0284c7;
        }
        .login-root.dark .login-submit-btn:hover {
          background: #0369a1;
        }
        .login-root.dark .login-divider-label {
          color: #334155;
        }
        .login-root.dark .login-divider-label::before,
        .login-root.dark .login-divider-label::after {
          background: #334155;
        }
        .login-root.dark .login-social-btn {
          background: #0f172a;
          border-color: #334155;
        }
        .login-root.dark .login-social-btn:hover {
          border-color: #00b4d8;
          background: rgba(0,180,216,0.08);
        }
        .login-root.dark .login-github-icon {
          color: #94a3b8;
        }
        .login-root.dark .login-footer {
          color: #475569;
        }
        .login-root.dark .login-footer-link {
          color: #475569;
        }
        .login-root.dark .login-footer-link:hover {
          color: #00b4d8;
        }
        .login-root.dark .login-footer-sep {
          color: #1e293b;
        }
        .login-root.dark .login-error {
          color: #f87171;
          background: rgba(239,68,68,0.12);
          border-color: rgba(239,68,68,0.35);
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
