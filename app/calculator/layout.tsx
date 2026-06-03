"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { ThemeProvider } from "./theme-context";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { ThemedShell } from "./themed-shell";
import { cn } from "@/lib/utils";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed, isMobileOpen } = useSidebar();

    return (
        <ThemedShell>
            <Sidebar />
            <Header />
            <main
                className={cn(
                    "transition-all duration-300 min-h-screen pt-16",
                    isCollapsed ? "md:pl-20" : "md:pl-64",
                    "pl-0"
                )}
            >
                <div className="container mx-auto p-3 sm:p-4 md:p-8 max-w-[1600px] pb-20 md:pb-8">
                    {children}
                </div>
            </main>

            {/* Footer / Status Bar - Hidden on mobile or pushed */}
            <div
                className={cn(
                    "fixed bottom-0 right-0 h-8 border-t border-white/5 md:flex hidden items-center justify-between px-6 z-20 text-[10px] uppercase tracking-wider font-mono transition-all duration-300",
                    isCollapsed ? "left-20" : "left-64"
                )}
                style={{
                    background: "inherit",
                    borderColor: "rgba(255,255,255,0.05)",
                }}
            >
                <div className="flex items-center gap-4" style={{ color: "#6b7280" }}>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]"></span>
                        CPU ENGINE: ACTIVE
                    </div>
                    <span>Lat: 12ms</span>
                </div>
                <div className="flex items-center gap-4" style={{ color: "#6b7280" }}>
                    <span>V1.4.2-STABLE</span>
                    <span>SUPPORT</span>
                    <span>DOCS</span>
                </div>
            </div>
        </ThemedShell>
    );
}

export default function CalculatorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <LayoutContent>{children}</LayoutContent>
            </SidebarProvider>
        </ThemeProvider>
    );
}
