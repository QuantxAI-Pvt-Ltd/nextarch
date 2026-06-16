"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
    const [theme, setTheme] = useState<Theme>("dark");

    // Sync local state from global on mount and whenever global changes
    useEffect(() => {
        setTheme(globalIsDark ? "dark" : "light");
    }, [globalIsDark]);

    const toggleTheme = () => {
        globalToggle(); // drives both global footer and local state (via useEffect above)
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
