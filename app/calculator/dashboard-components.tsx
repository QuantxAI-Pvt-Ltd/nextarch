"use client";

import { cn } from "@/lib/utils";
import { ChangeEvent } from "react";
import { useTheme } from "./theme-context";

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
}: MetricCardProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            className={cn("p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group transition-colors", className)}
            style={{
                background: isDark ? "#131B2C" : "#ffffff",
                border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0",
                boxShadow: isDark ? "none" : "0 2px 8px rgba(0,0,0,0.06)",
            }}
        >
            <div className="flex justify-between items-start z-10">
                <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: isDark ? "#6b7280" : "#94a3b8" }}
                >
                    {label}
                </span>
                {unit && (
                    <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                        style={{
                            background: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                            color: isDark ? "#9ca3af" : "#64748b",
                        }}
                    >
                        {unit}
                    </span>
                )}
            </div>
            <div className="z-10 relative">
                {onChange ? (
                    <input
                        type="number"
                        name={name}
                        value={value}
                        onChange={onChange}
                        min={min}
                        max={max}
                        step={step}
                        className="text-3xl font-bold text-[#1A73E8] tracking-tight bg-transparent border-none focus:outline-none w-full"
                    />
                ) : (
                    <div className="text-3xl font-bold text-[#1A73E8] tracking-tight">
                        {value}
                    </div>
                )}
                {subLabel && (
                    <div
                        className="text-xs mt-1"
                        style={{ color: isDark ? "#6b7280" : "#94a3b8" }}
                    >
                        {subLabel}
                    </div>
                )}
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#1A73E8]/5 rounded-full blur-2xl group-hover:bg-[#1A73E8]/10 transition-colors pointer-events-none" />
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
        <div className="bg-[#1A73E8] rounded-3xl p-6 sm:p-8 relative overflow-hidden min-h-[160px] sm:h-64 flex flex-col justify-between text-white shadow-lg shadow-blue-900/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
            <div className="relative z-10 w-full">
                <div className="flex justify-between items-start opacity-80 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
                </div>
                <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-4xl sm:text-6xl font-bold tracking-tighter">{value}</span>
                    <span className="text-xl sm:text-2xl font-medium opacity-80">{unit}</span>
                </div>
            </div>
        </div>
    );
}

