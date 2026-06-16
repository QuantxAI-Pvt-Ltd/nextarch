"use client"
import Link from "next/link";
import { useGlobalTheme } from "./global-theme-context";

export default function Footer() {
  const { isDark } = useGlobalTheme();

  return (
    <footer style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: "20px", padding: "12px 20px",
      background: isDark ? "#0f172a" : "#f0f4f8",
      borderTop: `1px solid ${isDark ? "rgba(51,65,85,0.6)" : "rgba(203,213,225,0.5)"}`,
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: "10px", letterSpacing: "0.12em",
      transition: "background 0.3s, border-color 0.3s",
    }}>
      <Link
        href="/privacy-policy"
        style={{
          color: isDark ? "#475569" : "#64748b",
          textDecoration: "none",
          transition: "color 0.2s",
        }}
        className="footer-legal-link"
      >
        PRIVACY POLICY
      </Link>
      <span style={{ color: isDark ? "#334155" : "#cbd5e1" }}>|</span>
      <Link
        href="/terms"
        style={{
          color: isDark ? "#475569" : "#64748b",
          textDecoration: "none",
          transition: "color 0.2s",
        }}
        className="footer-legal-link"
      >
        TERMS OF CONDITIONS
      </Link>
      <span style={{ color: isDark ? "#334155" : "#cbd5e1" }}>|</span>
      <span style={{ color: isDark ? "#334155" : "#94a3b8" }}>© 2025 VENTWISE</span>
      <style>{`
        .footer-legal-link:hover { color: ${isDark ? "#60a5fa" : "#2563eb"} !important; }
      `}</style>
    </footer>
  );
}
