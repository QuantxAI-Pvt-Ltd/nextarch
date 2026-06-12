"use client"
import { useState } from "react";
import { PieChart, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
              <FileText size={32} color="#3b82f6" strokeWidth={1.5} />
            </div>
            <h1 className="legal-page-title">TERMS OF CONDITIONS</h1>
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
              These Terms of Conditions (&quot;Terms&quot;) form a binding legal agreement between you
              (&quot;User&quot;, &quot;you&quot;) and Ventwise (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), governing your access to and use
              of the Ventwise platform — a professional natural ventilation and thermal calculation
              tool for architects, engineers, and building professionals. By registering for an account,
              you confirm that you have read, understood, and agreed to these Terms in full.
              If you do not agree, you must not use the Service.
            </p>
          </div>

          {/* 1 */}
          <div className="legal-section">
            <h2 className="legal-section-title">1. Definitions</h2>
            <div className="legal-section-body">
              <p>In these Terms, the following definitions apply:</p>
              <ul className="legal-list">
                <li><span className="legal-highlight">&quot;Service&quot;</span> — The Ventwise web platform accessible at ventwise.app, including all calculation modules, dashboards, and associated APIs.</li>
                <li><span className="legal-highlight">&quot;Calculation Modules&quot;</span> — The six built-in engineering tools: Volume of Air (Heat Gain), Window Calculations, Volume of Air (Qw + Qt Forces), Q from ACH, Heat Flow by Element, and Equivalent Solar Heat Gain.</li>
                <li><span className="legal-highlight">&quot;Subscription&quot;</span> — A paid recurring plan (Monthly or Quarterly) that grants unlimited access to the Service beyond the free trial period.</li>
                <li><span className="legal-highlight">&quot;Free Trial&quot;</span> — A 7-calendar-day period beginning at account registration during which all features are available at no charge.</li>
                <li><span className="legal-highlight">&quot;Content&quot;</span> — All text, formulas, calculation logic, algorithms, data, software, and visual design elements constituting the Service.</li>
                <li><span className="legal-highlight">&quot;Indian Standards&quot;</span> — The BIS / NBC standards implemented in the Service, including SP 41, IS 7668:1989, IS 8837:1977, and IS 10444:1983.</li>
              </ul>
            </div>
          </div>

          {/* 2 */}
          <div className="legal-section">
            <h2 className="legal-section-title">2. Eligibility and Account Registration</h2>
            <div className="legal-section-body">
              <p>
                To use the Service, you must be at least 18 years of age and have the legal capacity
                to enter into binding contracts under applicable law. By registering, you represent and
                warrant that all information you provide — including your full name, email address, and
                password — is accurate, current, and belongs to you.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your login credentials.
                You agree not to share your account with any other person. All activities that occur
                under your account are your sole responsibility. If you believe your account has been
                accessed without authorisation, you must notify us immediately at{" "}
                <a href="mailto:quantxai@quantxai.com" className="legal-link">quantxai@quantxai.com</a>.
              </p>
              <p>
                Ventwise reserves the right to suspend or terminate any account that we reasonably
                believe has been registered with false information or is being misused.
              </p>
            </div>
          </div>

          {/* 3 */}
          <div className="legal-section">
            <h2 className="legal-section-title">3. Free Trial</h2>
            <div className="legal-section-body">
              <p>
                Every new account receives a <strong>7-calendar-day free trial</strong> beginning at
                the moment of registration. During the trial, all six Calculation Modules and all
                platform features are available without charge.
              </p>
              <ul className="legal-list">
                <li>The trial begins at the exact timestamp your account was created and ends exactly 7 × 24 hours later.</li>
                <li>No payment method is required to start a trial.</li>
                <li>When the trial expires, access to the Calculation Modules is suspended until you subscribe to a paid plan.</li>
                <li>You may subscribe at any point during or after your trial.</li>
                <li>Trial periods are non-renewable — each email address is entitled to one 7-day trial only.</li>
              </ul>
            </div>
          </div>

          {/* 4 */}
          <div className="legal-section">
            <h2 className="legal-section-title">4. Subscriptions and Payments</h2>
            <div className="legal-section-body">

              <p><span className="legal-highlight">4.1 Available Plans</span></p>
              <div className="legal-table-wrap">
                <table className="legal-table">
                  <thead>
                    <tr><th>Plan</th><th>Price</th><th>Effective Rate</th><th>Access</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Monthly</td>
                      <td>₹250 / month</td>
                      <td>₹250 / month</td>
                      <td>Full access to all 6 Calculation Modules + Export</td>
                    </tr>
                    <tr>
                      <td>Quarterly</td>
                      <td>₹500 / 3 months</td>
                      <td>≈ ₹167 / month (save 33%)</td>
                      <td>Full access to all 6 Calculation Modules + Export + Priority Support</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p><span className="legal-highlight">4.2 Payment Processing</span></p>
              <p>
                All payments are processed by <strong>Razorpay</strong>, a PCI-DSS compliant payment
                gateway regulated in India. By initiating a subscription, you agree to Razorpay&apos;s{" "}
                <a href="https://razorpay.com/terms/" target="_blank" rel="noopener noreferrer" className="legal-link">Terms of Service</a>{" "}
                and authorise Razorpay to charge your selected payment method. Ventwise does not store
                your card number, CVV, UPI PIN, or any sensitive payment credential.
              </p>

              <p><span className="legal-highlight">4.3 Recurring Billing</span></p>
              <p>
                Subscriptions are billed on a recurring basis (monthly or quarterly). By subscribing,
                you authorise Razorpay to automatically charge the applicable fee at the start of each
                billing cycle. You may cancel at any time to prevent future charges (see Section 5).
              </p>

              <p><span className="legal-highlight">4.4 Price Changes</span></p>
              <p>
                We may revise subscription prices at any time. We will provide at least <strong>30 days&apos;
                  advance notice</strong> via email and an in-platform notice before any price change
                takes effect on your account. If you do not cancel before the effective date, your
                continued subscription constitutes acceptance of the new price.
              </p>

              <p><span className="legal-highlight">4.5 Failed Payments</span></p>
              <p>
                If a recurring payment fails, Razorpay may retry the charge. If payment cannot be
                collected, your subscription access will be suspended until payment is resolved.
              </p>
            </div>
          </div>

          {/* 5 */}
          <div className="legal-section">
            <h2 className="legal-section-title">5. Cancellation and Refunds</h2>
            <div className="legal-section-body">
              <p><span className="legal-highlight">5.1 Cancellation</span></p>
              <p>
                You may cancel your subscription at any time by contacting us at{" "}
                <a href="mailto:quantxai@quantxai.com" className="legal-link">quantxai@quantxai.com</a>.
                Upon cancellation, your access will continue until the end of the current paid billing
                cycle. No further charges will be made after that.
              </p>

              <p><span className="legal-highlight">5.2 Refund Policy</span></p>
              <p>
                Subscription fees are <strong>non-refundable</strong> once a billing cycle has commenced,
                except in the following circumstances:
              </p>
              <ul className="legal-list">
                <li>A technical error caused by Ventwise that prevented access to the Service for more than 48 consecutive hours during your paid period.</li>
                <li>A duplicate charge caused by a payment processing error.</li>
                <li>You are legally entitled to a refund under applicable Indian consumer protection law.</li>
              </ul>
              <p>
                Refund requests must be submitted within <strong>7 days</strong> of the charge by
                emailing <a href="mailto:quantxai@quantxai.com" className="legal-link">quantxai@quantxai.com</a>{" "}
                from your registered address with your payment reference ID. We will process
                approved refunds within 7–10 business days.
              </p>
            </div>
          </div>

          {/* 6 */}
          <div className="legal-section">
            <h2 className="legal-section-title">6. Acceptable Use</h2>
            <div className="legal-section-body">
              <p>
                Ventwise is a professional engineering assistance tool. You agree to use the
                Service only for lawful, legitimate architectural and building design purposes.
                You expressly agree <strong>not</strong> to:
              </p>
              <ul className="legal-list">
                <li>Access the Service using credentials that are not your own</li>
                <li>Reverse-engineer, decompile, disassemble, or attempt to extract the source code or proprietary algorithms underlying the Calculation Modules</li>
                <li>Systematically scrape, crawl, or mirror the platform or its outputs without written authorisation</li>
                <li>Use automated bots, scripts, or tools to interact with the calculation APIs beyond normal interactive use</li>
                <li>Attempt to probe, scan, or test the vulnerability of any Ventwise system or network</li>
                <li>Transmit any virus, malware, ransomware, or other malicious code to or through the Service</li>
                <li>Resell, sublicense, or otherwise commercialise access to the Service or its outputs without our prior written consent</li>
                <li>Use the Service to produce calculation results that are knowingly falsified or manipulated for fraudulent construction approvals or regulatory submissions</li>
                <li>Use the Service in any way that violates applicable Indian laws, including the Information Technology Act 2000 and associated rules</li>
              </ul>
            </div>
          </div>

          {/* 7 */}
          <div className="legal-section">
            <h2 className="legal-section-title">7. Nature of the Service and Professional Responsibility</h2>
            <div className="legal-section-body">
              <p>
                The Ventwise Calculation Modules are <strong>engineering assistance tools</strong>.
                They implement standard formulas from SP 41, IS 7668:1989, IS 8837:1977, and
                IS 10444:1983 to assist qualified professionals in their design work.
              </p>
              <p>
                <strong>Important:</strong> Outputs generated by Ventwise are not a substitute for the
                independent professional judgment of a licensed architect or structural/MEP engineer.
                All calculation results must be reviewed, validated, and signed off by a suitably
                qualified professional before being relied upon for construction, regulatory submissions,
                or building approvals.
              </p>
              <p>
                Ventwise does not represent or warrant that its outputs comply with every applicable
                local building by-law, municipal regulation, or site-specific condition. You are
                solely responsible for verifying that the inputs you provide are accurate and that
                the results are appropriate for your specific project context.
              </p>
            </div>
          </div>

          {/* 8 */}
          <div className="legal-section">
            <h2 className="legal-section-title">8. Intellectual Property</h2>
            <div className="legal-section-body">
              <p>
                All content within the Service — including but not limited to the platform design,
                user interface, underlying calculation algorithms, formula implementations, data
                models, documentation, branding, and software — is the exclusive intellectual
                property of Ventwise and is protected under applicable copyright, trademark, and
                intellectual property laws of India.
              </p>
              <p>
                Your subscription grants you a limited, non-exclusive, non-transferable, revocable
                licence to access and use the Service for your own professional work during the
                term of your active subscription or trial. This licence does not convey ownership
                of any part of the Service. You may not reproduce, distribute, publish, or create
                derivative works from any part of the Service without our prior written consent.
              </p>
              <p>
                The Indian Standards referenced (SP 41, IS 7668, IS 8837, IS 10444) are published
                by the Bureau of Indian Standards (BIS) and are reproduced in implementation form only.
                Ventwise does not claim ownership of those standards.
              </p>
            </div>
          </div>

          {/* 9 */}
          <div className="legal-section">
            <h2 className="legal-section-title">9. Disclaimer of Warranties</h2>
            <div className="legal-section-body">
              <p>
                To the fullest extent permitted by applicable law, the Service is provided on an
                <strong> &quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong> basis.
                Ventwise expressly disclaims all warranties, whether express, implied, statutory,
                or otherwise, including without limitation:
              </p>
              <ul className="legal-list">
                <li>Implied warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
                <li>Warranties that the Service will be uninterrupted, error-free, or free of bugs or viruses</li>
                <li>Warranties that calculation results are complete, accurate, or suitable for any specific project or regulatory jurisdiction</li>
                <li>Warranties regarding the accuracy or completeness of any third-party data or standards referenced in the Service</li>
              </ul>
            </div>
          </div>

          {/* 10 */}
          <div className="legal-section">
            <h2 className="legal-section-title">10. Limitation of Liability</h2>
            <div className="legal-section-body">
              <p>
                To the maximum extent permitted by applicable Indian law, Ventwise and its directors,
                employees, contractors, and agents shall not be liable to you or any third party for:
              </p>
              <ul className="legal-list">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, business opportunity, or goodwill</li>
                <li>Damages arising from reliance on calculation results for construction, regulatory, or procurement decisions</li>
                <li>Service interruptions, data loss, or system failures</li>
              </ul>
              <p>
                Regardless of the theory of liability (contract, tort, negligence, or otherwise),
                Ventwise&apos;s total cumulative liability to you for any claim arising out of or relating
                to these Terms or the Service shall not exceed the <strong>total subscription fees
                  you paid to Ventwise in the 3 months immediately preceding the event giving rise
                  to the claim</strong>.
              </p>
              <p>
                These limitations apply even if Ventwise has been advised of the possibility of
                such damages and even if any limited remedy fails of its essential purpose.
              </p>
            </div>
          </div>

          {/* 11 */}
          <div className="legal-section">
            <h2 className="legal-section-title">11. Indemnification</h2>
            <div className="legal-section-body">
              <p>
                You agree to defend, indemnify, and hold harmless Ventwise and its officers,
                directors, employees, and agents from and against any claims, liabilities, damages,
                judgments, awards, losses, costs, and expenses (including reasonable legal fees)
                arising out of or relating to:
              </p>
              <ul className="legal-list">
                <li>Your use of the Service in violation of these Terms or applicable law</li>
                <li>Any calculation results you rely upon for professional, regulatory, or construction purposes</li>
                <li>Any data you input into the Service</li>
                <li>Your infringement of any intellectual property or other rights of any person or entity</li>
              </ul>
            </div>
          </div>

          {/* 12 */}
          <div className="legal-section">
            <h2 className="legal-section-title">12. Service Availability and Maintenance</h2>
            <div className="legal-section-body">
              <p>
                We strive to maintain high availability of the Service but do not guarantee
                uninterrupted access. Planned maintenance windows will be communicated in advance
                where feasible. Unplanned outages may occur due to infrastructure, third-party
                service failures (MongoDB Atlas, Vercel, Razorpay), or force majeure events.
              </p>
              <p>
                Ventwise reserves the right to modify, update, suspend, or discontinue any part of
                the Service at any time. Where a significant feature is permanently discontinued,
                we will provide at least 30 days&apos; notice via email.
              </p>
            </div>
          </div>

          {/* 13 */}
          <div className="legal-section">
            <h2 className="legal-section-title">13. Account Termination</h2>
            <div className="legal-section-body">
              <p><span className="legal-highlight">13.1 Termination by You</span></p>
              <p>
                You may request deletion of your account at any time by emailing{" "}
                <a href="mailto:quantxai@quantxai.com" className="legal-link">quantxai@quantxai.com</a>.
                Active subscriptions should be cancelled separately (Section 5) before requesting
                deletion. Upon account deletion, your personal data will be erased within 30 days,
                subject to retention obligations for financial records.
              </p>

              <p><span className="legal-highlight">13.2 Termination by Us</span></p>
              <p>
                We may suspend or permanently terminate your account and access to the Service,
                with or without notice, if we determine that:
              </p>
              <ul className="legal-list">
                <li>You have materially breached these Terms</li>
                <li>Your use of the Service poses a security or legal risk to Ventwise or other users</li>
                <li>We are required to do so by applicable law or a court order</li>
              </ul>
              <p>
                In cases of termination for cause, you will not be entitled to a refund of any
                prepaid subscription fees.
              </p>

              <p><span className="legal-highlight">13.3 Effect of Termination</span></p>
              <p>
                Upon termination, your licence to use the Service ends immediately. Sections 8
                (Intellectual Property), 9 (Disclaimer), 10 (Limitation of Liability), 11
                (Indemnification), and 15 (Governing Law) shall survive termination.
              </p>
            </div>
          </div>

          {/* 14 */}
          <div className="legal-section">
            <h2 className="legal-section-title">14. Updates to These Terms</h2>
            <div className="legal-section-body">
              <p>
                We may revise these Terms at any time. When we make a material change:
              </p>
              <ul className="legal-list">
                <li>The version number and effective date at the top of this page will be updated.</li>
                <li>On your next login after the update, you will be redirected to an acceptance page where you must review and accept the new Terms before regaining access to the Calculation Modules.</li>
                <li>A summary of key changes will be highlighted in the acceptance notice.</li>
              </ul>
              <p>
                If you do not accept the revised Terms, you may cancel your account (Section 13.1).
                Continued use of the Service after acceptance constitutes your agreement to the
                revised Terms.
              </p>
            </div>
          </div>

          {/* 15 */}
          <div className="legal-section">
            <h2 className="legal-section-title">15. Governing Law and Dispute Resolution</h2>
            <div className="legal-section-body">
              <p>
                These Terms are governed by and construed in accordance with the laws of India,
                without regard to its conflict-of-law provisions. The Indian Standards Act 1986
                and the Information Technology Act 2000 (as amended) apply to the extent relevant.
              </p>
              <p>
                Any dispute, claim, or controversy arising out of or in connection with these Terms
                or the Service shall first be attempted to be resolved through good-faith negotiation.
                If not resolved within 30 days, disputes shall be subject to the exclusive jurisdiction
                of the competent courts located in India.
              </p>
              <p>
                Nothing in this clause prevents either party from seeking urgent injunctive or other
                equitable relief from a court of competent jurisdiction.
              </p>
            </div>
          </div>

          {/* 16 */}
          <div className="legal-section">
            <h2 className="legal-section-title">16. Contact Us</h2>
            <div className="legal-section-body">
              <p>For any questions or concerns about these Terms:</p>
              <div className="legal-contact-block">
                <p><strong>Ventwise — Legal</strong></p>
                <p>Email: <a href="mailto:quantxai@quantxai.com" className="legal-link">quantxai@quantxai.com</a></p>
                <p>Billing queries: <a href="mailto:quantxai@quantxai.com" className="legal-link">quantxai@quantxai.com</a></p>
                <p>Response time: within 5–7 working days</p>
              </div>
            </div>
          </div>

          <div className="legal-footer-note">
            <p>Last updated: <strong>1 June 2025</strong> &nbsp;·&nbsp; Version <strong>1.0</strong></p>
            <div className="legal-action-links">
              <Link href="/register" className="legal-cta">← Back to Register</Link>
              <Link href="/privacy-policy" className="legal-cta-secondary">Read Privacy Policy →</Link>
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
          font-size: 13px; color: #475569; line-height: 1.8; letter-spacing: 0.03em;
        }
        .legal-section {
          margin-bottom: 32px; padding-bottom: 32px;
          border-bottom: 1px solid #f1f5f9;
        }
        .legal-section:last-of-type { border-bottom: none; }
        .legal-section-title {
          font-size: 12px; font-weight: 700; color: #2563eb;
          letter-spacing: 0.25em; margin: 0 0 14px; text-transform: uppercase;
        }
        .legal-section-body {
          font-size: 13px; color: #475569;
          line-height: 1.85; letter-spacing: 0.03em;
          display: flex; flex-direction: column; gap: 10px;
        }
        .legal-section-body p { margin: 0; }
        .legal-highlight { color: #1e293b; font-weight: 600; }
        .legal-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 8px;
        }
        .legal-list li { display: flex; align-items: flex-start; gap: 10px; }
        .legal-list li::before { content: '▸'; color: #3b82f6; flex-shrink: 0; margin-top: 1px; }
        .legal-table-wrap { overflow-x: auto; margin: 8px 0; }
        .legal-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .legal-table th {
          background: #f8fafc; border: 1px solid #e2e8f0;
          padding: 8px 14px; text-align: left;
          color: #64748b; letter-spacing: 0.15em;
          font-size: 10px; text-transform: uppercase;
        }
        .legal-table td { border: 1px solid #f1f5f9; padding: 9px 14px; color: #475569; vertical-align: top; }
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
        .legal-root.dark .legal-highlight { color: #e2e8f0; }
        .legal-root.dark .legal-list li::before { color: #0284c7; }
        .legal-root.dark .legal-table th { background: #0f172a; border-color: #334155; color: #475569; }
        .legal-root.dark .legal-table td { border-color: #1e293b; color: #94a3b8; }
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
