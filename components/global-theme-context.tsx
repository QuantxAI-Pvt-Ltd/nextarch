"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface GlobalThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

const GlobalThemeContext = createContext<GlobalThemeContextValue>({
  isDark: false,
  toggleTheme: () => {},
});

export function GlobalThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ventwise-theme") === "dark";
    }
    return false;
  });

  // Apply dark class to document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("ventwise-theme", next ? "dark" : "light");
      }
      return next;
    });
  };

  return (
    <GlobalThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </GlobalThemeContext.Provider>
  );
}

export function useGlobalTheme() {
  return useContext(GlobalThemeContext);
}
