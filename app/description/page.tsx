"use client"
import { useEffect, useState } from "react"
import { DesktopDescription } from "./desktop-description"
import { MobileDescription } from "./mobile-description"

export default function Description() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile === null) {
    return <div style={{ minHeight: "100vh", background: "#0a0f1e" }} />;
  }

  return isMobile ? <MobileDescription /> : <DesktopDescription />;
}