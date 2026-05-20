"use client"
import { PieChart } from "lucide-react"
import Link from "next/link"

export default function Description() {

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0a0f1e", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* NAV */
        .dp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; height: 60px;
          background: rgba(8,14,32,0.95);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
        }
        .dp-logo { display: flex; align-items: center; gap: 10px; }
        .dp-logo-name { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: 0.01em; }
        .dp-nav-links { display: flex; align-items: center; gap: 36px; }
        .dp-nav-link {
          font-size: 13.5px; color: #94a3b8; background: none; border: none;
          cursor: pointer; letter-spacing: 0.01em; transition: color 0.2s;
        }
        .dp-nav-link:hover { color: #fff; }
        .dp-nav-cta {
          background: #2563eb; color: #fff; border: none;
          font-size: 13.5px; font-weight: 600; padding: 8px 20px;
          border-radius: 6px; cursor: pointer; transition: background 0.2s;
        }
        .dp-nav-cta:hover { background: #1d4ed8; }
        .dp-nav-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, #c4a882 0%, #a0845c 100%);
          border: 2px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
        }
        .dp-nav-right { display: flex; align-items: center; gap: 14px; }

        /* HERO */
        .dp-hero {
          flex: 1; position: relative; min-height: 100vh;
          display: flex; align-items: center;
          overflow: hidden; padding-top: 60px;
        }
        .dp-hero-bg {
          position: absolute; inset: 0;
          background:
            linear-gradient(to right, rgba(6,12,28,0.92) 45%, rgba(6,12,28,0.55) 100%),
            url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80&auto=format&fit=crop') center/cover no-repeat;
        }
        .dp-hero-content {
          position: relative; z-index: 2;
          display: flex; align-items: flex-start; justify-content: space-between;
          width: 100%; max-width: 1200px; margin: 0 auto;
          padding: 60px 40px; gap: 48px;
        }
        .dp-hero-left { flex: 1; max-width: 560px; }
        .dp-badge {
          display: inline-flex; align-items: center; gap: 7px;
          border: 1px solid rgba(59,130,246,0.5);
          border-radius: 4px; padding: 5px 12px; margin-bottom: 24px;
        }
        .dp-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #3b82f6; }
        .dp-badge-text { font-size: 11px; font-weight: 600; color: #60a5fa; letter-spacing: 0.15em; }
        .dp-heading {
          font-size: 52px; font-weight: 900; line-height: 1.05;
          color: #fff; margin-bottom: 20px; letter-spacing: -0.01em;
        }
        .dp-heading-blue { color: #3b82f6; }
        .dp-desc {
          font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.65);
          margin-bottom: 36px; max-width: 520px;
        }
        .dp-cta-row { display: flex; gap: 14px; align-items: center; }
        .dp-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #2563eb; color: #fff; border: none;
          font-size: 15px; font-weight: 700; padding: 14px 28px;
          border-radius: 8px; cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .dp-btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); }
        .dp-btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.08); color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
          font-size: 15px; font-weight: 600; padding: 13px 24px;
          border-radius: 8px; cursor: pointer; transition: background 0.2s;
        }
        .dp-btn-secondary:hover { background: rgba(255,255,255,0.14); }

        /* STANDARDS CARD */
        .dp-card {
          width: 360px; flex-shrink: 0;
          background: rgba(12,20,44,0.88);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; overflow: hidden;
          backdrop-filter: blur(20px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
        }
        .dp-card-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .dp-card-title-row { display: flex; align-items: center; gap: 10px; }
        .dp-card-icon {
          width: 28px; height: 28px;
          background: rgba(59,130,246,0.15); border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
        }
        .dp-card-title { font-size: 14px; font-weight: 600; color: #fff; }
        .dp-card-db { font-size: 10px; color: rgba(255,255,255,0.35); letter-spacing: 0.12em; font-weight: 500; }
        .dp-std-list { padding: 8px 0; }
        .dp-std-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }
        .dp-std-item:last-child { border-bottom: none; }
        .dp-std-item:hover { background: rgba(255,255,255,0.03); }
        .dp-std-icon {
          width: 28px; height: 28px; flex-shrink: 0;
          background: rgba(255,255,255,0.06); border-radius: 6px;
          display: flex; align-items: center; justify-content: center; margin-top: 1px;
        }
        .dp-std-name { font-size: 13px; font-weight: 600; color: #e2e8f0; margin-bottom: 3px; }
        .dp-std-desc { font-size: 11.5px; color: rgba(255,255,255,0.4); line-height: 1.5; }
        .dp-card-footer {
          padding: 12px 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
          text-align: center;
        }
        .dp-card-footer-text { font-size: 10px; color: rgba(255,255,255,0.25); letter-spacing: 0.12em; }

        /* FOOTER BAR */
        .dp-footer {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; height: 48px;
          background: rgba(6,10,22,0.97);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .dp-footer-stats { display: flex; align-items: center; gap: 40px; }
        .dp-footer-stat { display: flex; flex-direction: column; }
        .dp-footer-stat-label { font-size: 8px; color: rgba(255,255,255,0.3); letter-spacing: 0.15em; font-weight: 600; }
        .dp-footer-stat-value { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.7); letter-spacing: 0.03em; }
        .dp-footer-copy { font-size: 11px; color: rgba(255,255,255,0.25); }
        .dp-footer-icons { display: flex; align-items: center; gap: 16px; }
        .dp-footer-icon { color: rgba(255,255,255,0.3); cursor: pointer; transition: color 0.2s; background: none; border: none; }
        .dp-footer-icon:hover { color: rgba(255,255,255,0.7); }
      `}</style>

      {/* NAV */}
      <nav className="dp-nav">
        <div className="dp-logo">
          <PieChart size={26} color="#3b82f6" strokeWidth={1.75} style={{ flexShrink: 0 }} />
          <span className="dp-logo-name">Ventwise</span>
        </div>
        <div className="dp-nav-right">
          <Link href="/login" className="dp-nav-cta" style={{ textDecoration: 'none' }}>
            Go to Calculator
          </Link>
          <div className="dp-nav-avatar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="dp-hero">
        <div className="dp-hero-bg" />
        <div className="dp-hero-content">

          {/* Left */}
          <div className="dp-hero-left">

            <h1 className="dp-heading">
              Optimised Window Opening &amp; <span className="dp-heading-blue">Combined Ventilation</span> Flow Calculator
            </h1>
            <p className="dp-desc">
              This interactive tool is designed to assist architects, engineers, and building professionals in optimizing window openings and calculating combined ventilation flows. It helps ensure efficient natural ventilation, improved indoor air quality, and enhanced thermal comfort while adhering to established standards for sustainable building design.
            </p>
            <div className="dp-cta-row">
              <Link href="/login" className="dp-btn-primary" style={{ textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Go to Calculator
              </Link>

            </div>
          </div>

          {/* Standards Card */}
          <div className="dp-card">
            <div className="dp-card-header">
              <div className="dp-card-title-row">
                <div className="dp-card-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span className="dp-card-title">Standards &amp; References</span>
              </div>
              <span className="dp-card-db">DATABASE V2.4</span>
            </div>

            <div className="dp-std-list">
              {[
                {
                  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>,
                  code: "SP 41",
                  desc: "Handbook on Functional Requirements of Buildings (Other than Industrial Buildings)"
                },
                {
                  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
                  code: "IS 7668:1989",
                  desc: "Recommendations for design and construction of natural ventilation systems in buildings."
                },
                {
                  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
                  code: "IS 8837:1977",
                  desc: "Code of practice for design of cooling (evaporative) towers, relevant for integrated ventilation-heat load assessments."
                },
                {
                  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>,
                  code: "IS 10444:1983",
                  desc: "Code of practice for solar heating and cooling systems for buildings."
                },
              ].map((s, i) => (
                <div key={i} className="dp-std-item">
                  <div className="dp-std-icon">{s.icon}</div>
                  <div>
                    <div className="dp-std-name">{s.code}</div>
                    <div className="dp-std-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>



          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="dp-footer">
        <span className="dp-footer-copy">© 2024 Ventilation Flow Systems Inc. All Rights Reserved.</span>
      </div>
    </div>
  )
}