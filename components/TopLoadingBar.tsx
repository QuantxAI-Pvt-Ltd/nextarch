"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function TopLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finishTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback(() => {
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    setVisible(true);
    setProgress(15);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 85;
        }
        const diff = (90 - prev) * 0.12;
        return prev + diff;
      });
    }, 120);
  }, []);

  const finishLoading = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);

    finishTimerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setProgress(0), 200);
    }, 250);
  }, []);

  // Trigger completion when pathname or searchParams change
  useEffect(() => {
    finishLoading();
  }, [pathname, searchParams, finishLoading]);

  // Intercept internal link clicks to start progress bar
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey
      ) {
        return;
      }

      const currentUrl = window.location.pathname + window.location.search;
      if (href !== currentUrl) {
        startLoading();
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [startLoading]);

  // Intercept form submissions to start progress bar
  useEffect(() => {
    const handleFormSubmit = () => {
      startLoading();
    };

    document.addEventListener("submit", handleFormSubmit);
    return () => {
      document.removeEventListener("submit", handleFormSubmit);
    };
  }, [startLoading]);

  if (!visible && progress === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 99999,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease-in-out",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #a855f7 100%)",
          boxShadow: "0 0 10px rgba(124, 58, 237, 0.7), 0 0 5px rgba(37, 99, 235, 0.7)",
          transition: "width 0.2s ease-out",
        }}
      />
    </div>
  );
}

export default TopLoadingBar;
