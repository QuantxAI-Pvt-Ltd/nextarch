"use client";

import { cn } from "@/lib/utils";
import { ChangeEvent } from "react";
import { useTheme } from "./theme-context";
import { AlertCircle, X } from "lucide-react";

interface MetricCardProps {
    label: string;
    value: string | number;
    unit?: string;
    subLabel?: string;
    className?: string;
    name?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    min?: number;
    max?: number;
    step?: number;
    error?: boolean;
    errorMessage?: string;
}

export function MetricCard({
    label,
    value,
    unit,
    subLabel,
    className,
    name,
    onChange,
    min,
    max,
    step,
    error,
    errorMessage,
}: MetricCardProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const borderColor = error
        ? "#ef4444"
        : isDark
        ? "rgba(255,255,255,0.05)"
        : "#e2e8f0";

    const boxShadow = error
        ? isDark
            ? "0 0 0 1px rgba(239,68,68,0.5), 0 2px 10px rgba(239,68,68,0.15)"
            : "0 0 0 1px #ef4444, 0 2px 8px rgba(239,68,68,0.12)"
        : isDark
        ? "none"
        : "0 2px 8px rgba(0,0,0,0.06)";

    return (
        <div
            className={cn("p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group transition-all", className)}
            style={{
                background: isDark ? "#131B2C" : "#ffffff",
                border: `1px solid ${borderColor}`,
                boxShadow,
            }}
        >
            <div className="flex justify-between items-start z-10">
                <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: error ? "#ef4444" : isDark ? "#6b7280" : "#94a3b8" }}
                >
                    {label}
                </span>
                <div className="flex items-center gap-1.5">
                    {error && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-red-500/10 text-red-500 font-semibold flex items-center gap-0.5">
                            <AlertCircle className="w-2.5 h-2.5" /> Required
                        </span>
                    )}
                    {unit && (
                        <span
                            className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                            style={{
                                background: error
                                    ? "rgba(239,68,68,0.1)"
                                    : isDark
                                    ? "rgba(255,255,255,0.05)"
                                    : "#f1f5f9",
                                color: error ? "#ef4444" : isDark ? "#9ca3af" : "#64748b",
                            }}
                        >
                            {unit}
                        </span>
                    )}
                </div>
            </div>
            <div className="z-10 relative">
                {onChange ? (
                    <input
                        type="number"
                        name={name}
                        value={value}
                        onChange={onChange}
                        min={min ?? 0}
                        max={max}
                        step={step}
                        onFocus={(e) => e.target.select()}
                        onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                        className={cn(
                            "text-3xl font-bold tracking-tight bg-transparent border-none focus:outline-none w-full transition-colors",
                            error ? "text-red-500" : "text-[#1A73E8]"
                        )}
                    />
                ) : (
                    <div className={cn(
                        "text-3xl font-bold tracking-tight",
                        error ? "text-red-500" : "text-[#1A73E8]"
                    )}>
                        {value}
                    </div>
                )}
                {errorMessage ? (
                    <div className="text-xs mt-1 text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span className="truncate">{errorMessage}</span>
                    </div>
                ) : subLabel ? (
                    <div
                        className="text-xs mt-1"
                        style={{ color: isDark ? "#6b7280" : "#94a3b8" }}
                    >
                        {subLabel}
                    </div>
                ) : null}
            </div>
            <div
                className={cn(
                    "absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl transition-colors pointer-events-none",
                    error ? "bg-red-500/10 group-hover:bg-red-500/15" : "bg-[#1A73E8]/5 group-hover:bg-[#1A73E8]/10"
                )}
            />
        </div>
    );
}

export function ResultCard({
    value,
    unit,
    label,
}: {
    value: string | number;
    unit: string;
    label: string;
}) {
    return (
        <div className="bg-[#1A73E8] rounded-3xl p-5 md:p-8 relative overflow-hidden min-h-[100px] md:min-h-[160px] md:h-64 flex flex-col justify-center md:justify-between text-white shadow-lg shadow-blue-900/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
            <div className="relative z-10 w-full flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex justify-center md:justify-between items-start opacity-80 mb-1 md:mb-2">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{label}</span>
                </div>
                <div className="flex items-baseline justify-center md:justify-start gap-2 flex-wrap">
                    <span className="text-3xl md:text-6xl font-bold tracking-tighter">{value}</span>
                    <span className="text-lg md:text-2xl font-medium opacity-80">{unit}</span>
                </div>
            </div>
        </div>
    );
}

export function ValidationAlert({
    errors,
    onDismiss,
}: {
    errors: string[];
    onDismiss?: () => void;
}) {
    if (!errors || errors.length === 0) return null;
    return (
        <div className="rounded-2xl p-4 flex items-start justify-between gap-3 border border-red-500/30 bg-red-500/10 text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3 min-w-0">
                <div className="bg-red-500/20 p-2 rounded-xl text-red-500 shrink-0">
                    <AlertCircle className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-red-500">
                        {errors.length === 1 ? "Required Field Missing" : "Required Fields Missing"}
                    </p>
                    <p className="text-xs text-red-400/90 mt-0.5 leading-relaxed">
                        Please provide valid values (&gt; 0) for: <strong className="text-red-300 font-medium">{errors.join(", ")}</strong>
                    </p>
                </div>
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="p-1 rounded-lg text-red-400 hover:text-red-200 hover:bg-red-500/20 transition-colors shrink-0"
                    aria-label="Dismiss error"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

