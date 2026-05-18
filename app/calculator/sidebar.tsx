"use client";

import {
    LayoutGrid,
    Wind,
    Thermometer,
    Volume2,
    TableProperties,
    Sun,
    Activity,
    ChevronLeft,
    ChevronRight,
    X
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-context";
import { useSidebar } from "./sidebar-context";

const sidebarItems = [
    { icon: Wind, label: "Volume of Air (Heat Gain)", mode: "volume-heat-gain" },
    { icon: LayoutGrid, label: "Window Calculations", mode: "window-calculations" },
    { icon: Activity, label: "Volume of Air (Qw + Qt Forces)", mode: "volume-forces" },
    { icon: TableProperties, label: "Q from ACH", mode: "q-from-ach" },
    { icon: Volume2, label: "By Element", mode: "by-element" },
    { icon: Sun, label: "Equivalent Solar Heat Gain", mode: "solar-heat-gain" },
];

export function Sidebar() {
    const searchParams = useSearchParams();
    const currentMode = searchParams.get("mode") || "window-calculations";
    const { theme } = useTheme();
    const { isCollapsed, toggleSidebar, isMobileOpen, setIsMobileOpen } = useSidebar();
    const isDark = theme === "dark";

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                className={cn(
                    "flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-20" : "w-64",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
                style={{
                    background: isDark ? "#0B1221" : "#ffffff",
                    borderRight: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0",
                }}
            >
                {/* Collapse Toggle - Desktop Only */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-20 bg-[#1A73E8] text-white rounded-full p-1 shadow-lg z-50 md:flex hidden hover:scale-110 transition-transform"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="absolute right-4 top-4 md:hidden text-gray-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                {/* Logo / Header Area */}
                <div className={cn("py-8 flex items-center transition-all duration-300", isCollapsed ? "justify-center" : "px-6")}>
                    <div className="w-8 h-8 bg-[#1A73E8] rounded-lg flex items-center justify-center text-white font-bold shrink-0">
                        N
                    </div>
                    {!isCollapsed && (
                        <span className="ml-3 font-bold text-lg tracking-tight" style={{ color: isDark ? "#ffffff" : "#1e293b" }}>
                            Ventwise
                        </span>
                    )}
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto py-2 px-4 scrollbar-hide">
                    <div className="mb-8">
                        {!isCollapsed && (
                            <h2
                                className="text-xs font-bold uppercase tracking-wider mb-4 px-2"
                                style={{ color: isDark ? "#6b7280" : "#94a3b8" }}
                            >
                                Calculation Module
                            </h2>
                        )}
                        <nav className="space-y-1">
                            {sidebarItems.map((item) => {
                                const isActive = currentMode === item.mode;
                                return (
                                    <Link
                                        key={item.mode}
                                        href={`/calculator?mode=${item.mode}`}
                                        title={isCollapsed ? item.label : ""}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group",
                                            isCollapsed && "justify-center"
                                        )}
                                        style={{
                                            background: isActive
                                                ? "#1A73E8"
                                                : "transparent",
                                            color: isActive
                                                ? "#ffffff"
                                                : isDark ? "#9ca3af" : "#64748b",
                                        }}
                                        onClick={() => window.innerWidth < 768 && setIsMobileOpen(false)}
                                    >
                                        <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", isActive && "scale-110")} />
                                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                                        {isActive && !isCollapsed && (
                                            <div className="ml-auto bg-white/20 rounded-full p-0.5 min-w-4 min-h-4 flex items-center justify-center">
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Engine Status - Hidden when collapsed */}
                    {!isCollapsed && (
                        <div
                            className="mt-8 mx-2 p-4 rounded-xl border transition-opacity duration-300"
                            style={{
                                borderColor: "rgba(59,130,246,0.2)",
                                background: "rgba(59,130,246,0.05)",
                            }}
                        >
                            <h3 className="text-blue-400 font-semibold text-sm mb-2">Engine Status</h3>
                            <p
                                className="text-xs leading-relaxed mb-4"
                                style={{ color: isDark ? "#9ca3af" : "#64748b" }}
                            >
                                Real-time calculations active.
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-green-400 uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Live View
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
