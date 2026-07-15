"use client"
import { useState } from "react"
import { PieChart, Home, Shield, X, LayoutGrid, Wind, Thermometer, Activity, Sun, Cpu, FileText, ChevronRight } from "lucide-react"
import Link from "next/link"

export function MobileDescription() {
  const [isStandardsOpen, setIsStandardsOpen] = useState(false);

  const modules = [
    {
      icon: <Wind size={20} color="#60a5fa" />,
      title: "Wind Calculations",
      desc: "Opening area derived from Room Volume & Air Changes.",
      tag: "IS 7668"
    },
    {
      icon: <Thermometer size={20} color="#f87171" />,
      title: "Heat Gain Ventilation",
      desc: "Heat-load based ventilation rates for thermal comfort.",
      tag: "SP 41"
    },
    {
      icon: <Activity size={20} color="#34d399" />,
      title: "Qw + Qt Forces",
      desc: "Wind & stack pressure combined forces computation.",
      tag: "IS 7668"
    },
    {
      icon: <Cpu size={20} color="#fbbf24" />,
      title: "Q from ACH",
      desc: "Simple conversion calculations between flow rate & ACH.",
      tag: "SP 41"
    },
    {
      icon: <FileText size={20} color="#a78bfa" />,
      title: "By Element Analysis",
      desc: "Flow calculations calculated per window or door element.",
      tag: "IS 7668"
    },
    {
      icon: <Sun size={20} color="#f472b6" />,
      title: "Solar Heat Gain",
      desc: "Integrated solar heating & evaporative cooling assessments.",
      tag: "IS 10444"
    }
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#060a16", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* NAV */
        .dp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 16px; height: 56px;
          background: rgba(6, 10, 22, 0.75);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        }
        .dp-logo { display: flex; align-items: center; gap: 8px; }
        .dp-logo-name { font-size: 16px; font-weight: 800; color: #fff; letter-spacing: -0.01em; }
        
        .dp-nav-right { display: flex; align-items: center; gap: 10px; }
        
        .dp-nav-cta-mobile {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff; border: none;
          width: 40px; height: 40px;
          border-radius: 10px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.2s, background 0.2s;
          box-shadow: 0 0 12px rgba(37, 99, 235, 0.3);
        }
        .dp-nav-cta-mobile:active { transform: scale(0.95); }

        .dp-nav-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #c4a882 0%, #a0845c 100%);
          border: 2px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
        }

        /* HERO */
        .dp-hero {
          position: relative;
          padding-top: 56px;
          overflow: hidden;
        }
        .dp-hero-bg {
          position: absolute; inset: 0;
          background:
            linear-gradient(to bottom, rgba(6,10,22,0.8) 0%, rgba(6,10,22,1) 100%),
            url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80&auto=format&fit=crop') center/cover no-repeat;
          z-index: 1;
        }
        .dp-hero-content {
          position: relative; z-index: 2;
          display: flex; flex-direction: column;
          width: 100%; max-width: 480px; margin: 0 auto;
          padding: 40px 16px 24px; gap: 20px;
        }
        
        /* BADGE */
        .dp-badge-container {
          display: flex; justify-content: center; margin-bottom: 8px;
        }
        .dp-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.25);
          border-radius: 20px; padding: 6px 14px;
        }
        .dp-badge-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #3b82f6;
          box-shadow: 0 0 8px #3b82f6;
          animation: pulse 2s infinite;
        }
        .dp-badge-text { font-size: 10.5px; font-weight: 600; color: #60a5fa; letter-spacing: 0.05em; text-transform: uppercase; }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }

        .dp-hero-left { width: 100%; text-align: center; }
        .dp-heading {
          font-size: 32px; font-weight: 900; line-height: 1.15;
          color: #fff; margin-bottom: 16px; letter-spacing: -0.02em;
        }
        .dp-heading-gradient {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .dp-desc {
          font-size: 14px; line-height: 1.6; color: #94a3b8;
          margin-bottom: 24px; text-align: center;
        }
        
        .dp-btn-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, #2563eb, #7c3aed); color: #fff; border: none;
          font-size: 14.5px; font-weight: 700; width: 100%; height: 50px;
          border-radius: 12px; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.35);
        }
        .dp-btn-primary:active { transform: scale(0.98); }

        /* FEATURE SECTION */
        .dp-features-section {
          position: relative; z-index: 2;
          width: 100%; max-width: 480px; margin: 0 auto;
          padding: 0 16px 40px;
        }
        .dp-section-header {
          margin-bottom: 20px; text-align: center;
        }
        .dp-section-title {
          font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.01em; margin-bottom: 6px;
        }
        .dp-section-desc {
          font-size: 12.5px; color: #64748b;
        }
        .dp-grid {
          display: grid; grid-template-cols: 1fr; gap: 14px;
        }
        
        /* Glassmorphic card */
        .dp-feature-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px; padding: 18px;
          display: flex; gap: 16px; align-items: flex-start;
          transition: transform 0.2s, border-color 0.2s;
        }
        .dp-feature-card:active {
          transform: scale(0.98);
          border-color: rgba(59, 130, 246, 0.2);
          background: rgba(255, 255, 255, 0.04);
        }
        .dp-card-icon-wrapper {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px; width: 42px; height: 42px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .dp-card-content { flex: 1; min-width: 0; }
        .dp-card-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        .dp-card-title { font-size: 14.5px; font-weight: 700; color: #fff; }
        .dp-card-tag {
          font-size: 9.5px; font-weight: 700; color: rgba(255, 255, 255, 0.4);
          background: rgba(255,255,255,0.06); padding: 2px 8px; border-radius: 20px;
          font-family: 'Share Tech Mono', monospace;
        }
        .dp-card-desc { font-size: 12.5px; color: #64748b; line-height: 1.5; }

        /* FOOTER BAR */
        .dp-footer {
          position: relative; bottom: auto; left: auto; right: auto; z-index: 10;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 32px 16px 110px; background: #03060e;
          border-top: 1px solid rgba(255,255,255,0.04); gap: 12px; text-align: center;
        }
        .dp-footer-copy { font-size: 11px; color: #475569; text-align: center; line-height: 1.6; }

        /* Bottom Navigation Bar */
        .mobile-bottom-nav {
          position: fixed;
          bottom: 12px;
          left: 12px;
          right: 12px;
          height: 64px;
          background: rgba(10, 16, 32, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          backdrop-filter: blur(24px);
          display: flex;
          align-items: center;
          justify-content: space-around;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          z-index: 99;
          padding: 0 8px;
        }
        .mobile-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #64748b;
          font-size: 10px;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          gap: 5px;
          width: 72px;
          height: 52px;
          border-radius: 14px;
          transition: color 0.2s, background-color 0.2s;
        }
        .mobile-nav-btn.active, .mobile-nav-btn:active {
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.08);
        }

        /* Mobile Drawer / Bottom Sheet */
        .mobile-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(3, 5, 10, 0.8);
          backdrop-filter: blur(8px);
          z-index: 1000;
          animation: fadeIn 0.25s ease-out;
        }
        .mobile-drawer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          max-height: 80vh;
          background: #080c16;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px 24px 0 0;
          z-index: 1001;
          padding: 24px 16px 40px;
          overflow-y: auto;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.6);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .drawer-title {
          font-size: 16px;
          font-weight: 800;
          color: #fff;
        }
        .drawer-close-btn {
          background: rgba(255, 255, 255, 0.06);
          border: none;
          color: #94a3b8;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .drawer-close-btn:active {
          background: rgba(255, 255, 255, 0.12);
        }

        .mobile-drawer .dp-std-item {
          padding: 16px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .mobile-drawer .dp-std-item:last-child {
          border-bottom: none;
        }
      `}</style>

      {/* NAV */}
      <nav className="dp-nav">
        <div className="dp-logo">
          <PieChart size={22} color="#3b82f6" strokeWidth={2.2} style={{ flexShrink: 0 }} />
          <span className="dp-logo-name">Ventwise</span>
        </div>
        <div className="dp-nav-right">
          <Link href="/login" className="dp-nav-cta-mobile" aria-label="Go to Calculator" style={{ textDecoration: 'none' }}>
            <LayoutGrid size={18} strokeWidth={2.2} />
          </Link>
          <div className="dp-nav-avatar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.2">
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
          
          <div className="dp-badge-container">
            <div className="dp-badge">
              <div className="dp-badge-dot" />
              <span className="dp-badge-text">Ventilation Flow Engine</span>
            </div>
          </div>

          <div className="dp-hero-left">
            <h1 className="dp-heading">
              Optimised Window Opening &amp; <span className="dp-heading-gradient">Combined Ventilation</span> Flow Calculator
            </h1>
            <p className="dp-desc">
              Assist architects, engineers, and building professionals in calculating combined ventilation flows and optimizing openings for sustainable designs.
            </p>
            <Link href="/login" className="dp-btn-primary" style={{ textDecoration: 'none' }}>
              <LayoutGrid size={18} style={{ flexShrink: 0 }} strokeWidth={2.2} />
              Open Calculator
            </Link>
          </div>

        </div>
      </div>

      {/* MODULES / CAPABILITIES SECTION */}
      <div className="dp-features-section">
        <div className="dp-section-header">
          <h2 className="dp-section-title">Calculation Modules</h2>
          <p className="dp-section-desc">Interactive building analysis tools</p>
        </div>

        <div className="dp-grid">
          {modules.map((m, i) => (
            <Link key={i} href="/login" className="dp-feature-card" style={{ textDecoration: 'none' }}>
              <div className="dp-card-icon-wrapper">
                {m.icon}
              </div>
              <div className="dp-card-content">
                <div className="dp-card-title-row">
                  <h3 className="dp-card-title">{m.title}</h3>
                  <span className="dp-card-tag">{m.tag}</span>
                </div>
                <p className="dp-card-desc">{m.desc}</p>
              </div>
              <ChevronRight size={16} color="#475569" style={{ alignSelf: 'center', flexShrink: 0 }} />
            </Link>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="dp-footer">
        <span className="dp-footer-copy">© 2024 Ventilation Flow Systems Inc.<br />All Rights Reserved.</span>
      </div>

      {/* Bottom Nav Bar - Mobile Only */}
      <div className="mobile-bottom-nav">
        <button className="mobile-nav-btn active" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Home size={20} />
          <span>Home</span>
        </button>
        <button className="mobile-nav-btn" onClick={() => setIsStandardsOpen(true)}>
          <Shield size={20} />
          <span>Standards</span>
        </button>
        <Link href="/login" className="mobile-nav-btn" style={{ textDecoration: 'none' }}>
          <LayoutGrid size={20} style={{ display: 'block', margin: 'auto' }} />
          <span>Calculator</span>
        </Link>
      </div>

      {/* Standards Drawer - Mobile Only */}
      {isStandardsOpen && (
        <>
          <div className="mobile-drawer-overlay" onClick={() => setIsStandardsOpen(false)} />
          <div className="mobile-drawer">
            <div className="drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} color="#3b82f6" />
                <span className="drawer-title">Standards &amp; References</span>
              </div>
              <button className="drawer-close-btn" onClick={() => setIsStandardsOpen(false)} aria-label="Close modal" style={{ minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>
            <div className="dp-std-list">
              {[
                {
                  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>,
                  code: "SP 41",
                  desc: "Handbook on functional requirements for all building typologies (except industrial buildings)"
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
                  <div className="dp-std-icon" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{s.icon}</div>
                  <div>
                    <div className="dp-std-name" style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0', marginBottom: '3px' }}>{s.code}</div>
                    <div className="dp-std-desc" style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
