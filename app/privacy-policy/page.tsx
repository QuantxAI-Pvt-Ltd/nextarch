"use client"
import { useState } from "react";
import { PieChart, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`legal-root${isDark ? " dark" : ""}`}>
      <div className="legal-grid" />

      {/* Theme toggle */}
      <button
        className="legal-theme-toggle"
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
        <span className="legal-theme-label">{isDark ? "LIGHT" : "DARK"}</span>
      </button>

      <div className="legal-container">
        {/* Header */}
        <div className="legal-header">
          <div className="legal-logo-block">
            <PieChart size={26} color="#3b82f6" strokeWidth={1.75} />
            <span className="legal-logo-title">Ventwise</span>
          </div>
          <div className="legal-title-block">
            <div className="legal-icon-wrap">
              <Shield size={32} color="#3b82f6" strokeWidth={1.5} />
            </div>
            <h1 className="legal-page-title">PRIVACY POLICY</h1>
            <p className="legal-page-subtitle">Effective Date: 1 June 2025 &nbsp;·&nbsp; Version 1.0</p>
          </div>
          <Link href="/register" className="legal-back-link">
            <ArrowLeft size={14} />
            Back to Register
          </Link>
        </div>

        {/* Content card */}
        <div className="legal-card">

          <div className="legal-intro">
            <p>
              Ventwise (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates a professional-grade natural ventilation and thermal
              calculation platform designed for architects, structural engineers, and building professionals in India.
              This Privacy Policy explains what personal data we collect when you use Ventwise, why we collect it,
              how we use and protect it, and what rights you have over it.
              By creating an account or using the Service, you consent to the practices described in this document.
            </p>
          </div>

          {/* 1 */}
          <div className="legal-section">
            <h2 className="legal-section-title">1. Who We Are</h2>
            <div className="legal-section-body">
              <p>
                Ventwise is a software-as-a-service platform providing building ventilation calculation tools
                based on Indian standards (SP 41, IS 7668:1989, IS 8837:1977, IS 10444:1983). The platform
                is operated from India and primarily serves users in India. All data processing described in
                this policy is carried out by Ventwise or its authorised sub-processors listed in Section 5.
              </p>
              <p>
                For privacy-related matters, contact us at:{" "}
                <a href="mailto:quantxai@quantxai.com" className="legal-link">quantxai@quantxai.com</a>
              </p>
            </div>
          </div>

          {/* 2 */}
          <div className="legal-section">
            <h2 className="legal-section-title">2. Data We Collect and Why</h2>
            <div className="legal-section-body">

              <p><span className="legal-highlight">2.1 Account Registration Data</span></p>
              <p>
                When you register, we collect your <strong>full name</strong>, <strong>email address</strong>,
                and <strong>password</strong>. Your password is immediately secured using one-way
                cryptographic hashing before being written to our database. We never store or log
                your plain-text password. This data is necessary to create and manage your account.
              </p>

              <p><span className="legal-highlight">2.2 Subscription and Payment Data</span></p>
              <p>
                When you subscribe to a paid plan (Monthly at ₹250/month or Quarterly at ₹500/3 months),
                all payment processing is handled exclusively by <strong>Razorpay</strong>. We receive only
                the outcome of the transaction: your Razorpay subscription ID, payment ID, payment status,
                the plan tier selected, and the plan expiry date. We do not receive, store, or have access to
                your credit/debit card numbers, bank account details, CVV, UPI PIN, or any sensitive payment
                credentials. Razorpay&apos;s own privacy policy governs the data they collect during checkout.
              </p>

              <p><span className="legal-highlight">2.3 Trial and Access Status</span></p>
              <p>
                We record your account creation timestamp to calculate your 7-day free trial window.
                We store your selected plan tier (Monthly or Quarterly), your plan expiry date,
                and whether you currently have active platform access. These fields determine
                your ability to use the calculation modules.
              </p>

              <p><span className="legal-highlight">2.4 Legal Acceptance Records</span></p>
              <p>
                We maintain an auditable record of your acceptance of this Privacy Policy and our
                Terms of Conditions. For each document we store:
              </p>
              <ul className="legal-list">
                <li>Whether you accepted each document (Terms of Conditions and Privacy Policy)</li>
                <li>The exact date and time of your acceptance for each document</li>
                <li>The version number of the document you accepted</li>
              </ul>
              <p>
                These records allow us to demonstrate compliance and to notify you when a new version
                requires re-acceptance.
              </p>

              <p><span className="legal-highlight">2.5 Calculation Inputs</span></p>
              <p>
                All ventilation calculations (heat flow by element, window area calculations, solar heat gain,
                airflow volumes, ACH-derived flow rates) are performed in real time in your browser or via
                our computation backend. <strong>We do not persistently store individual calculation inputs
                  or results in our database</strong> — they exist only for the duration of your session.
              </p>

              <p><span className="legal-highlight">2.6 Session Cookies</span></p>
              <p>
                We use the following HTTP-only cookies to manage your authenticated session:
              </p>
              <div className="legal-table-wrap">
                <table className="legal-table">
                  <thead>
                    <tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Authentication Cookie</td>
                      <td>Stores your email to identify your authenticated session. HTTP-only, cannot be read by JavaScript.</td>
                      <td>30 days</td>
                    </tr>
                    <tr>
                      <td>Legal Acceptance Cookie</td>
                      <td>Temporary flag set when you are authenticated but have not yet accepted an updated legal document. Redirects you to the acceptance page before granting calculator access.</td>
                      <td>15 minutes</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p><span className="legal-highlight">2.7 Analytics and Performance Data</span></p>
              <p>
                We use <strong>Google Analytics 4 (GA4)</strong> and <strong>Vercel Analytics</strong> to
                understand how users interact with Ventwise. These tools collect anonymised data including:
                pages visited, time spent on each page, features used, approximate geographic location
                (country/region level), device type, browser type, and screen resolution.
                IP addresses collected by GA4 are anonymised before storage. Vercel Analytics does not
                use cookies and is privacy-friendly by design.
              </p>
              <p>
                We also use <strong>Vercel Speed Insights</strong> to monitor page load performance and
                Core Web Vitals to ensure a fast experience.
              </p>
            </div>
          </div>

          {/* 3 */}
          <div className="legal-section">
            <h2 className="legal-section-title">3. Legal Basis for Processing</h2>
            <div className="legal-section-body">
              <p>We process your personal data on the following grounds under applicable data protection law:</p>
              <div className="legal-table-wrap">
                <table className="legal-table">
                  <thead>
                    <tr><th>Processing Activity</th><th>Legal Basis</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Creating and authenticating your account</td><td>Contractual necessity</td></tr>
                    <tr><td>Managing your subscription and trial</td><td>Contractual necessity</td></tr>
                    <tr><td>Processing payments via Razorpay</td><td>Contractual necessity</td></tr>
                    <tr><td>Storing legal acceptance records</td><td>Legal obligation / legitimate interests</td></tr>
                    <tr><td>Analytics and performance monitoring</td><td>Legitimate interests (improving the Service)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 4 */}
          <div className="legal-section">
            <h2 className="legal-section-title">4. How We Use Your Data</h2>
            <div className="legal-section-body">
              <ul className="legal-list">
                <li>To create, verify, and maintain your Ventwise account</li>
                <li>To authenticate you on each visit using your session cookie</li>
                <li>To determine whether you have active access (trial or paid subscription) and gate platform features accordingly</li>
                <li>To create and verify Razorpay subscription orders and webhooks</li>
                <li>To send transactional communications (e.g., subscription confirmation, trial expiry reminders) to your registered email address</li>
                <li>To maintain auditable records of your legal document acceptance</li>
                <li>To detect unauthorised access attempts or account abuse</li>
                <li>To analyse aggregate, anonymised usage patterns to improve the platform</li>
              </ul>
              <p>
                We do <strong>not</strong> use your data for marketing profiling, sell your data to third
                parties, or use your calculation inputs for training machine learning models.
              </p>
            </div>
          </div>

          {/* 5 */}
          <div className="legal-section">
            <h2 className="legal-section-title">5. Sub-Processors and Third-Party Services</h2>
            <div className="legal-section-body">
              <p>
                We share data with the following sub-processors, each bound by their own data protection
                commitments, solely to provide the Service:
              </p>
              <div className="legal-table-wrap">
                <table className="legal-table">
                  <thead>
                    <tr><th>Service</th><th>Role</th><th>Data Shared</th><th>Location</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>MongoDB Atlas</strong> (MongoDB, Inc.)</td>
                      <td>Database hosting for all user account, subscription, and legal acceptance data</td>
                      <td>Name, email, hashed password, plan data, legal records</td>
                      <td>India region (Mumbai)</td>
                    </tr>
                    <tr>
                      <td><strong>Razorpay</strong></td>
                      <td>Payment gateway for subscription billing</td>
                      <td>Name, email, subscription plan, amount</td>
                      <td>India</td>
                    </tr>
                    <tr>
                      <td><strong>Vercel</strong></td>
                      <td>Platform hosting, edge delivery, and analytics</td>
                      <td>Page views, performance metrics, server logs</td>
                      <td>Global CDN</td>
                    </tr>
                    <tr>
                      <td><strong>Google Analytics 4</strong> (Google LLC)</td>
                      <td>Usage analytics</td>
                      <td>Anonymised usage events, device/browser type</td>
                      <td>USA (anonymised before transfer)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                We do not engage any other sub-processors without updating this policy. We do not share
                your data with any advertising networks or data brokers.
              </p>
            </div>
          </div>

          {/* 6 */}
          <div className="legal-section">
            <h2 className="legal-section-title">6. Data Security</h2>
            <div className="legal-section-body">
              <ul className="legal-list">
                <li><span className="legal-highlight">Password security:</span> All passwords are secured with one-way cryptographic hashing before storage. Plain-text passwords are never written to disk or logs.</li>
                <li><span className="legal-highlight">HTTP-only cookies:</span> Session cookies are HTTP-only and inaccessible to client-side JavaScript, reducing XSS risk.</li>
                <li><span className="legal-highlight">HTTPS everywhere:</span> All data in transit is encrypted via TLS 1.2 or higher. We enforce HTTPS-only access.</li>
                <li><span className="legal-highlight">Database encryption:</span> MongoDB Atlas encrypts all data at rest using AES-256.</li>
                <li><span className="legal-highlight">Minimal data:</span> We do not store calculation inputs, card numbers, or UPI credentials.</li>
              </ul>
              <p>
                Despite these measures, no internet-based system can guarantee absolute security. If you
                believe your account has been compromised, please contact us immediately at{" "}
                <a href="mailto:quantxai@quantxai.com" className="legal-link">quantxai@quantxai.com</a>.
              </p>
            </div>
          </div>

          {/* 7 */}
          <div className="legal-section">
            <h2 className="legal-section-title">7. Data Retention</h2>
            <div className="legal-section-body">
              <div className="legal-table-wrap">
                <table className="legal-table">
                  <thead>
                    <tr><th>Data Type</th><th>Retention Period</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Account data (name, email, hashed password)</td><td>Until account deletion + 30 days</td></tr>
                    <tr><td>Subscription and payment records</td><td>7 years (financial record compliance under Indian law)</td></tr>
                    <tr><td>Legal acceptance records</td><td>7 years from date of acceptance</td></tr>
                    <tr><td>Session cookies</td><td>30 days (or until sign-out)</td></tr>
                    <tr><td>Anonymised analytics data</td><td>26 months (Google Analytics default)</td></tr>
                    <tr><td>Calculation inputs</td><td>Not stored — exist only in-session</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 8 */}
          <div className="legal-section">
            <h2 className="legal-section-title">8. Your Rights</h2>
            <div className="legal-section-body">
              <p>You have the following rights regarding your personal data:</p>
              <ul className="legal-list">
                <li><span className="legal-highlight">Right of access:</span> Request a copy of all personal data we hold about you.</li>
                <li><span className="legal-highlight">Right to correction:</span> Request correction of inaccurate or incomplete data (e.g., your registered name).</li>
                <li><span className="legal-highlight">Right to erasure:</span> Request deletion of your account and all associated personal data. Note that financial records required by law will be retained per Section 7.</li>
                <li><span className="legal-highlight">Right to data portability:</span> Request your account data in a machine-readable format (JSON).</li>
                <li><span className="legal-highlight">Right to object:</span> Object to processing of your data for analytics purposes. You may opt out of Google Analytics by installing the{" "}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="legal-link">Google Analytics Opt-out Browser Add-on</a>.</li>
              </ul>
              <p>
                To exercise any of these rights, email{" "}
                <a href="mailto:quantxai@quantxai.com" className="legal-link">quantxai@quantxai.com</a>{" "}
                from your registered email address. We will respond within 30 days.
              </p>
            </div>
          </div>

          {/* 9 */}
          <div className="legal-section">
            <h2 className="legal-section-title">9. Cookies and Tracking</h2>
            <div className="legal-section-body">
              <p>
                Ventwise uses a minimal cookie footprint. We do not use advertising cookies or
                cross-site tracking pixels.
              </p>
              <div className="legal-table-wrap">
                <table className="legal-table">
                  <thead>
                    <tr><th>Cookie / Technology</th><th>Type</th><th>Purpose</th><th>Opt-out</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Authentication Cookie</td>
                      <td>Strictly necessary</td>
                      <td>Authentication session</td>
                      <td>Cannot opt out — required for login</td>
                    </tr>
                    <tr>
                      <td>Legal Acceptance Cookie</td>
                      <td>Strictly necessary</td>
                      <td>Legal acceptance gating</td>
                      <td>Cannot opt out — required for compliance</td>
                    </tr>
                    <tr>
                      <td>Google Analytics Cookies</td>
                      <td>Analytics</td>
                      <td>Usage tracking (anonymised)</td>
                      <td>GA Opt-out Add-on or browser cookie settings</td>
                    </tr>
                    <tr>
                      <td>Vercel Analytics</td>
                      <td>Analytics</td>
                      <td>Page views &amp; performance (cookieless)</td>
                      <td>No cookie — not applicable</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 10 */}
          <div className="legal-section">
            <h2 className="legal-section-title">10. Children&apos;s Privacy</h2>
            <div className="legal-section-body">
              <p>
                Ventwise is a professional tool intended for adults aged 18 and above, specifically
                architects, engineers, and building professionals. We do not knowingly collect data
                from persons under 18. If you believe a minor has registered without parental consent,
                contact us at <a href="mailto:quantxai@quantxai.com" className="legal-link">quantxai@quantxai.com</a>{" "}
                and we will delete the account promptly.
              </p>
            </div>
          </div>

          {/* 11 */}
          <div className="legal-section">
            <h2 className="legal-section-title">11. Changes to This Policy</h2>
            <div className="legal-section-body">
              <p>
                We may update this Privacy Policy to reflect changes in the platform, applicable law,
                or our data practices. When we do:
              </p>
              <ul className="legal-list">
                <li>We increment the version number displayed at the top of this page.</li>
                <li>On your next login, you will be redirected to an acceptance page and prompted to review and accept the updated policy before regaining calculator access.</li>
                <li>Material changes will be highlighted in the acceptance notice.</li>
              </ul>
              <p>
                Your continued use of Ventwise after accepting an updated Privacy Policy constitutes
                your agreement to the revised terms.
              </p>
            </div>
          </div>

          {/* 12 */}
          <div className="legal-section">
            <h2 className="legal-section-title">12. Contact &amp; Grievance Officer</h2>
            <div className="legal-section-body">
              <p>
                For privacy queries, data requests, or complaints, please contact:
              </p>
              <div className="legal-contact-block">
                <p><strong>Ventwise — Privacy Officer</strong></p>
                <p>Email: <a href="mailto:quantxai@quantxai.com" className="legal-link">quantxai@quantxai.com</a></p>
                <p>Response time: within 30 working days</p>
              </div>
              <p style={{ marginTop: 12 }}>
                If you are dissatisfied with our response, you may escalate your complaint to the relevant
                data protection authority in your jurisdiction.
              </p>
            </div>
          </div>

          <div className="legal-footer-note">
            <p>Last updated: <strong>1 June 2025</strong> &nbsp;·&nbsp; Version <strong>1.0</strong></p>
            <div className="legal-action-links">
              <Link href="/register" className="legal-cta">← Back to Register</Link>
              <Link href="/terms" className="legal-cta-secondary">Read Terms of Conditions →</Link>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600;700&display=swap');

        .legal-root {
          min-height: 100vh;
          background: #f0f4f8;
          position: relative;
          font-family: 'Share Tech Mono', monospace;
          transition: background 0.3s;
          padding-bottom: 60px;
        }
        .legal-grid {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none; z-index: 0;
        }
        .legal-theme-toggle {
          position: fixed; top: 20px; right: 20px; z-index: 20;
          display: flex; align-items: center; gap: 7px;
          background: #ffffff; border: 1px solid #cbd5e1;
          border-radius: 20px; padding: 6px 14px 6px 10px;
          cursor: pointer; font-family: 'Share Tech Mono', monospace;
          font-size: 11px; color: #475569; letter-spacing: 0.12em;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          transition: background 0.3s, border-color 0.3s, color 0.3s;
        }
        .legal-theme-toggle:hover { border-color: #3b82f6; color: #2563eb; }
        .legal-theme-label { font-size: 10px; letter-spacing: 0.15em; }
        .legal-container {
          position: relative; z-index: 5;
          max-width: 820px; margin: 0 auto;
          padding: 40px 20px;
        }
        .legal-header {
          display: flex; flex-direction: column; align-items: center;
          gap: 12px; margin-bottom: 32px;
        }
        .legal-logo-block {
          display: flex; align-items: center; gap: 10px;
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 10px; padding: 8px 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .legal-logo-title {
          font-family: 'Inter', sans-serif;
          font-size: 18px; font-weight: 600; color: #1e293b;
        }
        .legal-title-block {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          margin-top: 8px;
        }
        .legal-icon-wrap {
          width: 60px; height: 60px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #bfdbfe; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(59,130,246,0.15);
        }
        .legal-page-title {
          font-size: 22px; font-weight: 700; color: #1e293b;
          letter-spacing: 0.25em; margin: 4px 0 0;
        }
        .legal-page-subtitle {
          font-size: 11px; color: #64748b; letter-spacing: 0.1em; margin: 0;
        }
        .legal-back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; color: #3b82f6; text-decoration: none;
          letter-spacing: 0.1em; transition: color 0.2s;
        }
        .legal-back-link:hover { color: #1d4ed8; }
        .legal-card {
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 14px; padding: 40px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          transition: background 0.3s, border-color 0.3s;
        }
        .legal-intro {
          border-left: 3px solid #3b82f6;
          padding: 16px 20px; margin-bottom: 32px;
          background: #f8fafc; border-radius: 0 8px 8px 0;
          font-size: 13px; color: #475569; line-height: 1.8;
          letter-spacing: 0.03em;
        }
        .legal-section {
          margin-bottom: 32px; padding-bottom: 32px;
          border-bottom: 1px solid #f1f5f9;
        }
        .legal-section:last-of-type { border-bottom: none; }
        .legal-section-title {
          font-size: 12px; font-weight: 700; color: #2563eb;
          letter-spacing: 0.25em; margin: 0 0 14px;
          text-transform: uppercase;
        }
        .legal-section-body {
          font-size: 13px; color: #475569;
          line-height: 1.85; letter-spacing: 0.03em;
          display: flex; flex-direction: column; gap: 10px;
        }
        .legal-section-body p { margin: 0; }
        .legal-section-body code {
          background: #f1f5f9; border: 1px solid #e2e8f0;
          border-radius: 4px; padding: 1px 6px;
          font-size: 12px; color: #1e293b;
        }
        .legal-highlight { color: #1e293b; font-weight: 600; }
        .legal-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 8px;
        }
        .legal-list li { display: flex; align-items: flex-start; gap: 10px; }
        .legal-list li::before { content: '▸'; color: #3b82f6; flex-shrink: 0; margin-top: 1px; }
        .legal-table-wrap { overflow-x: auto; margin: 8px 0; }
        .legal-table {
          width: 100%; border-collapse: collapse; font-size: 12px;
        }
        .legal-table th {
          background: #f8fafc; border: 1px solid #e2e8f0;
          padding: 8px 14px; text-align: left;
          color: #64748b; letter-spacing: 0.15em;
          font-size: 10px; text-transform: uppercase;
        }
        .legal-table td {
          border: 1px solid #f1f5f9; padding: 9px 14px;
          color: #475569; vertical-align: top;
        }
        .legal-table td code {
          background: #f1f5f9; border: 1px solid #e2e8f0;
          border-radius: 4px; padding: 1px 5px; font-size: 11px;
        }
        .legal-table tr:hover td { background: #f8fafc; }
        .legal-contact-block {
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 8px; padding: 14px 18px;
          font-size: 13px; color: #475569;
        }
        .legal-contact-block p { margin: 2px 0; }
        .legal-link { color: #3b82f6; text-decoration: none; }
        .legal-link:hover { text-decoration: underline; }
        .legal-footer-note {
          margin-top: 32px; padding-top: 24px;
          border-top: 1px solid #e2e8f0; text-align: center;
        }
        .legal-footer-note p { font-size: 12px; color: #94a3b8; margin-bottom: 16px; letter-spacing: 0.05em; }
        .legal-action-links { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
        .legal-cta {
          display: inline-block; padding: 10px 22px;
          background: #2563eb; color: #fff; border-radius: 8px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.15em;
          text-decoration: none; transition: background 0.2s, transform 0.1s;
        }
        .legal-cta:hover { background: #1d4ed8; transform: translateY(-1px); }
        .legal-cta-secondary {
          display: inline-block; padding: 10px 22px;
          background: transparent; color: #2563eb;
          border: 1px solid #bfdbfe; border-radius: 8px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.15em;
          text-decoration: none; transition: all 0.2s;
        }
        .legal-cta-secondary:hover { background: #eff6ff; border-color: #3b82f6; transform: translateY(-1px); }

        /* ═════ DARK THEME ═════ */
        .legal-root.dark { background: #0f172a; }
        .legal-root.dark .legal-grid {
          background-image:
            linear-gradient(rgba(0,180,216,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,180,216,0.06) 1px, transparent 1px);
        }
        .legal-root.dark .legal-theme-toggle { background: #1e293b; border-color: #334155; color: #94a3b8; }
        .legal-root.dark .legal-theme-toggle:hover { border-color: #00b4d8; color: #00b4d8; }
        .legal-root.dark .legal-logo-block { background: #1e293b; border-color: #334155; }
        .legal-root.dark .legal-logo-title { color: #e2e8f0; }
        .legal-root.dark .legal-icon-wrap { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-color: #334155; }
        .legal-root.dark .legal-page-title { color: #e2e8f0; }
        .legal-root.dark .legal-page-subtitle { color: #64748b; }
        .legal-root.dark .legal-card { background: #1e293b; border-color: #334155; box-shadow: 0 4px 24px rgba(0,0,0,0.4); }
        .legal-root.dark .legal-intro { background: #0f172a; color: #94a3b8; border-color: #0284c7; }
        .legal-root.dark .legal-section { border-color: #1e293b; }
        .legal-root.dark .legal-section-title { color: #38bdf8; }
        .legal-root.dark .legal-section-body { color: #94a3b8; }
        .legal-root.dark .legal-section-body code { background: #0f172a; border-color: #334155; color: #e2e8f0; }
        .legal-root.dark .legal-highlight { color: #e2e8f0; }
        .legal-root.dark .legal-list li::before { color: #0284c7; }
        .legal-root.dark .legal-table th { background: #0f172a; border-color: #334155; color: #475569; }
        .legal-root.dark .legal-table td { border-color: #1e293b; color: #94a3b8; }
        .legal-root.dark .legal-table td code { background: #0f172a; border-color: #334155; color: #e2e8f0; }
        .legal-root.dark .legal-table tr:hover td { background: #0f172a; }
        .legal-root.dark .legal-contact-block { background: #0f172a; border-color: #334155; color: #94a3b8; }
        .legal-root.dark .legal-footer-note { border-color: #334155; }
        .legal-root.dark .legal-footer-note p { color: #475569; }
        .legal-root.dark .legal-cta { background: #0284c7; }
        .legal-root.dark .legal-cta:hover { background: #0369a1; }
        .legal-root.dark .legal-cta-secondary { color: #38bdf8; border-color: #334155; }
        .legal-root.dark .legal-cta-secondary:hover { background: #1e293b; border-color: #0284c7; }

        @media (max-width: 600px) {
          .legal-card { padding: 24px 18px; }
          .legal-container { padding: 24px 12px; }
          .legal-action-links { flex-direction: column; align-items: center; }
        }
      `}</style>
    </div>
  );
}
