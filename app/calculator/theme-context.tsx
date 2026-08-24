"use client";
import { createContext, useContext, ReactNode } from "react";
import { useGlobalTheme } from "@/components/global-theme-context";

type Theme = "dark" | "light";

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "dark",
    toggleTheme: () => { },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const { isDark: globalIsDark, toggleTheme: globalToggle } = useGlobalTheme();
    const theme: Theme = globalIsDark ? "dark" : "light";

    const toggleTheme = () => {
        globalToggle();
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
