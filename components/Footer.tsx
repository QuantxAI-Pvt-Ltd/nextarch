"use client"
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: "20px", padding: "8px 20px",
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(8px)",
      borderTop: "1px solid rgba(203,213,225,0.6)",
      zIndex: 50, fontFamily: "'Share Tech Mono', monospace",
      fontSize: "10px", letterSpacing: "0.12em",
    }}>
      <Link href="/privacy-policy" className="footer-legal-link">PRIVACY POLICY</Link>
      <span style={{ color: "#cbd5e1" }}>|</span>
      <Link href="/terms" className="footer-legal-link">TERMS OF CONDITIONS</Link>
      <span style={{ color: "#cbd5e1" }}>|</span>
      <span style={{ color: "#94a3b8" }}>© 2025 VENTWISE</span>
      <style>{`
        .footer-legal-link {
          color: #64748b; text-decoration: none;
          transition: color 0.2s;
        }
        .footer-legal-link:hover { color: #2563eb; }
      `}</style>
    </footer>
  );
}
