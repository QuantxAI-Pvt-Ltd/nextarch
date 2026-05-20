"use client";

import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Check, Menu, Zap, Crown, Clock, LogOut, ChevronRight, CreditCard, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-context";
import { useSidebar } from "./sidebar-context";
import Link from "next/link";

interface UsageData {
    email: string;
    name: string;
    trialActive: boolean;
    trialDaysLeft: number;
    plan: string | null;
    planActive: boolean;
    hasAccess: boolean;
    planExpiresAt?: string | null;
}

export function Header() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { isCollapsed, toggleMobileMenu } = useSidebar();
    const isDark = theme === "dark";
    const settingsRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const [usage, setUsage] = useState<UsageData | null>(null);

    // Fetch subscription / trial status
    useEffect(() => {
        fetch("/api/usage")
            .then((r) => r.ok ? r.json() : null)
            .then((data) => data && setUsage(data))
            .catch(() => null);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
                setSettingsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Derive plan info
    const planLabel =
        usage?.plan === "monthly" ? "Monthly Plan" :
            usage?.plan === "quarterly" ? "Quarterly Plan" :
                null;

    const expiryDate = usage?.planExpiresAt
        ? new Date(usage.planExpiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
        : null;

    // Initials from name
    const initials = usage?.name
        ? usage.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
        : "?";

    const subStatusColor = usage?.planActive ? "#a78bfa" : usage?.trialActive ? "#22c55e" : "#f87171";
    const subStatusLabel = usage?.planActive && planLabel
        ? planLabel
        : usage?.trialActive
            ? `Trial · ${usage.trialDaysLeft}d left`
            : "Trial expired";

    return (
        <header
            className={cn(
                "h-16 border-b flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 z-30 transition-all duration-300",
                isCollapsed ? "md:left-20" : "md:left-64",
                "left-0"
            )}
            style={{
                background: isDark ? "#0B1221" : "#ffffff",
                borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)",
            }}
        >
            {/* Brand */}
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 -ml-2 md:hidden text-gray-500 hover:text-blue-500 transition-colors"
                >
                    <Menu size={24} />
                </button>
                <div className="text-blue-500 hidden sm:block">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                        <path d="M22 12A10 10 0 0 0 12 2v10z" />
                    </svg>
                </div>
                <span className="text-lg md:text-xl font-bold truncate"
                    style={{ color: isDark ? "#ffffff" : "#1e293b", transition: "color 0.3s" }}>
                    Ventwise
                </span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3">

                {/* ── Trial / Plan badge (desktop) ── */}
                {usage && (
                    usage.planActive && planLabel ? (
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider"
                            style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa" }}
                            title={expiryDate ? `Expires ${expiryDate}` : undefined}>
                            <Crown size={12} />
                            {planLabel}
                        </div>
                    ) : usage.trialActive ? (
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono tracking-wider"
                                style={{
                                    background: usage.trialDaysLeft <= 2 ? "rgba(234,179,8,0.1)" : "rgba(34,197,94,0.08)",
                                    border: `1px solid ${usage.trialDaysLeft <= 2 ? "rgba(234,179,8,0.3)" : "rgba(34,197,94,0.25)"}`,
                                    color: usage.trialDaysLeft <= 2 ? "#eab308" : "#22c55e",
                                }}>
                                <Clock size={11} />
                                Trial: {usage.trialDaysLeft}d left
                            </div>
                            <Link href="/subscribe"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-opacity hover:opacity-80"
                                style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff" }}>
                                <Zap size={11} />Upgrade
                            </Link>
                        </div>
                    ) : (
                        <Link href="/subscribe"
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-opacity hover:opacity-80"
                            style={{ background: "linear-gradient(135deg,#dc2626,#7c3aed)", color: "#fff" }}>
                            <Zap size={11} />Subscribe Now
                        </Link>
                    )
                )}

                {/* ── Theme toggle ── */}
                <div className="relative" ref={settingsRef}>
                    <button onClick={() => { setSettingsOpen(v => !v); setProfileOpen(false); }}
                        className="p-2 rounded-full transition-colors"
                        style={{
                            color: settingsOpen ? "#3b82f6" : (isDark ? "#9ca3af" : "#64748b"),
                            background: settingsOpen ? (isDark ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.08)") : "transparent",
                        }}
                        title="Theme" aria-label="Toggle theme">
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {settingsOpen && (
                        <div className="absolute right-0 top-12 w-64 rounded-xl shadow-2xl border overflow-hidden z-50"
                            style={{
                                background: isDark ? "#1e293b" : "#ffffff",
                                borderColor: isDark ? "#334155" : "#e2e8f0",
                                boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.5)" : "0 20px 40px rgba(0,0,0,0.12)",
                            }}>
                            <div className="px-4 py-3 border-b"
                                style={{ borderColor: isDark ? "#334155" : "#e2e8f0", background: isDark ? "#0f172a" : "#f8fafc" }}>
                                <p className="text-xs font-mono uppercase tracking-wider" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>
                                    Appearance
                                </p>
                            </div>
                            <div className="p-3">
                                <button onClick={() => { if (isDark) toggleTheme(); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mb-1"
                                    style={{ background: !isDark ? "rgba(59,130,246,0.1)" : "transparent", color: isDark ? "#94a3b8" : "#2563eb" }}>
                                    <Sun className="w-4 h-4" />
                                    <span className="text-sm font-medium flex-1 text-left">Light Mode</span>
                                    {!isDark && <Check className="w-4 h-4" />}
                                </button>
                                <button onClick={() => { if (!isDark) toggleTheme(); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                                    style={{ background: isDark ? "rgba(59,130,246,0.12)" : "transparent", color: !isDark ? "#64748b" : "#60a5fa" }}>
                                    <Moon className="w-4 h-4" />
                                    <span className="text-sm font-medium flex-1 text-left">Dark Mode</span>
                                    {isDark && <Check className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="mx-3 border-t" style={{ borderColor: isDark ? "#334155" : "#e2e8f0" }} />
                            <div className="px-4 py-2.5">
                                <p className="text-[10px] font-mono" style={{ color: isDark ? "#475569" : "#94a3b8" }}>
                                    Ventwise v1.4.2-stable
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Profile icon + dropdown ── */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => { setProfileOpen(v => !v); setSettingsOpen(false); }}
                        className="flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm transition-all hover:ring-2 hover:ring-offset-1"
                        style={{
                            background: usage?.planActive
                                ? "linear-gradient(135deg,#7c3aed,#a855f7)"
                                : usage?.trialActive
                                    ? "linear-gradient(135deg,#1A73E8,#2563eb)"
                                    : "linear-gradient(135deg,#dc2626,#9333ea)",
                            color: "#fff",
                            "--tw-ring-color": isDark ? "#334155" : "#e2e8f0",
                            "--tw-ring-offset-color": isDark ? "#0B1221" : "#ffffff",
                        } as React.CSSProperties}
                        title={usage?.name ?? "Profile"}
                        aria-label="Profile"
                    >
                        {initials}
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl border overflow-hidden z-50"
                            style={{
                                background: isDark ? "#0f172a" : "#ffffff",
                                borderColor: isDark ? "#1e293b" : "#e2e8f0",
                                boxShadow: isDark ? "0 24px 60px rgba(0,0,0,0.6)" : "0 24px 60px rgba(0,0,0,0.14)",
                            }}>

                            {/* ── User identity card ── */}
                            <div className="px-5 py-4" style={{ background: isDark ? "#131b2c" : "#f8fafc" }}>
                                <div className="flex items-center gap-3">
                                    {/* Large avatar */}
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
                                        style={{
                                            background: usage?.planActive
                                                ? "linear-gradient(135deg,#7c3aed,#a855f7)"
                                                : "linear-gradient(135deg,#1A73E8,#2563eb)",
                                            color: "#fff",
                                        }}>
                                        {initials}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm truncate"
                                            style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
                                            {usage?.name ?? "—"}
                                        </p>
                                        <p className="text-xs truncate mt-0.5" style={{ color: isDark ? "#475569" : "#94a3b8" }}>
                                            {usage?.email ?? "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px" style={{ background: isDark ? "#1e293b" : "#e2e8f0" }} />

                            {/* ── Subscription card ── */}
                            <div className="px-5 py-4">
                                <p className="text-[10px] font-mono uppercase tracking-widest mb-3"
                                    style={{ color: isDark ? "#334155" : "#94a3b8" }}>
                                    Subscription
                                </p>

                                {/* Status row */}
                                <div className="flex items-center justify-between mb-3 p-3 rounded-xl"
                                    style={{
                                        background: usage?.planActive
                                            ? "rgba(124,58,237,0.08)"
                                            : usage?.trialActive
                                                ? "rgba(34,197,94,0.07)"
                                                : "rgba(239,68,68,0.07)",
                                        border: `1px solid ${usage?.planActive ? "rgba(124,58,237,0.25)" : usage?.trialActive ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                                    }}>
                                    <div className="flex items-center gap-2">
                                        {usage?.planActive
                                            ? <Crown size={15} color="#a78bfa" />
                                            : usage?.trialActive
                                                ? <Clock size={15} color="#22c55e" />
                                                : <Zap size={15} color="#f87171" />
                                        }
                                        <span className="text-sm font-semibold" style={{ color: subStatusColor }}>
                                            {subStatusLabel}
                                        </span>
                                    </div>
                                    {usage?.planActive && expiryDate && (
                                        <span className="text-[10px] font-mono" style={{ color: isDark ? "#475569" : "#94a3b8" }}>
                                            until {expiryDate}
                                        </span>
                                    )}
                                </div>

                                {/* Plan details rows */}
                                {usage?.planActive ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs"
                                            style={{ color: isDark ? "#64748b" : "#94a3b8" }}>
                                            <span>Plan</span>
                                            <span className="font-mono" style={{ color: isDark ? "#c4b5fd" : "#7c3aed" }}>
                                                {usage.plan === "monthly" ? "₹500 / month" : "₹1,000 / 3 months"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs"
                                            style={{ color: isDark ? "#64748b" : "#94a3b8" }}>
                                            <span>Access</span>
                                            <span className="font-mono text-green-400">Unlimited</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs"
                                            style={{ color: isDark ? "#64748b" : "#94a3b8" }}>
                                            <span>Expires</span>
                                            <span className="font-mono" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                                                {expiryDate ?? "—"}
                                            </span>
                                        </div>
                                    </div>
                                ) : usage?.trialActive ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs"
                                            style={{ color: isDark ? "#64748b" : "#94a3b8" }}>
                                            <span>Plan</span>
                                            <span className="font-mono" style={{ color: "#22c55e" }}>Free Trial</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs"
                                            style={{ color: isDark ? "#64748b" : "#94a3b8" }}>
                                            <span>Days remaining</span>
                                            <span className="font-mono" style={{ color: usage.trialDaysLeft <= 2 ? "#eab308" : "#22c55e" }}>
                                                {usage.trialDaysLeft} day{usage.trialDaysLeft === 1 ? "" : "s"}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs" style={{ color: "#f87171" }}>
                                        Your trial has expired. Subscribe to continue.
                                    </p>
                                )}
                            </div>

                            <div className="h-px" style={{ background: isDark ? "#1e293b" : "#e2e8f0" }} />

                            {/* ── Actions ── */}
                            <div className="p-2">
                                {!usage?.planActive && (
                                    <Link
                                        href="/subscribe"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 mb-1"
                                        style={{
                                            background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                                            color: "#fff",
                                        }}>
                                        <CreditCard size={15} />
                                        {usage?.trialActive ? "Upgrade Plan" : "Subscribe Now"}
                                        <ChevronRight size={14} className="ml-auto" />
                                    </Link>
                                )}

                                <Link
                                    href="/api/signout"
                                    onClick={() => setProfileOpen(false)}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-colors"
                                    style={{ color: isDark ? "#64748b" : "#94a3b8" }}
                                    onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                                    onMouseLeave={e => (e.currentTarget.style.color = isDark ? "#64748b" : "#94a3b8")}
                                >
                                    <LogOut size={15} />
                                    Sign out
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile: Zap icon for upgrade */}
                {usage && !usage.planActive && (
                    <Link href="/subscribe"
                        className="sm:hidden p-1.5 rounded-full"
                        style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff" }}
                        title="Upgrade">
                        <Zap size={14} />
                    </Link>
                )}
            </div>
        </header>
    );
}
