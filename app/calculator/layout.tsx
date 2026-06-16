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
