"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Wind, Upload, CheckCircle2, RefreshCw, X, Sun, Moon, Info, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTheme } from "./theme-context";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export interface EPWHourlyData {
    hour: number;
    time_label: string;
    temperature: number;
    wind_speed_ms: number;
    wind_speed_mh: number;
    radiation: number;
    global_horizontal_radiation: number;
    direct_normal_radiation: number;
    diffuse_horizontal_radiation: number;
}

export interface EPWMonthlyDiffuseData {
    year: number;
    month: number;
    month_name: string;
    days_count: number;
    avg_daily_diffuse_wh_m2: number;
    diffuse_rad_w_m2: number;
}

interface EPWMonthlyDiffuseResponse {
    success: boolean;
    message: string;
    year: number;
    month: number;
    month_name: string;
    days_count: number;
    avg_daily_diffuse_wh_m2: number;
    diffuse_rad_w_m2: number;
}

interface AvailableMonthData {
    days: number[];
    hours_by_day: Record<string, number[]>;
}

type AvailableData = Record<string, Record<string, AvailableMonthData>>;

interface EpwViewerProps {
    mode?: "hourly" | "monthly-diffuse";
    onSelectHour?: (data: EPWHourlyData) => void;
    onSelectMonthlyDiffuse?: (data: EPWMonthlyDiffuseData) => void;
    showRadiation?: boolean;
    initialSelectedHour?: number;
}

export default function EpwViewer({
    mode = "hourly",
    onSelectHour,
    onSelectMonthlyDiffuse,
    showRadiation = false,
    initialSelectedHour = 1,
}: EpwViewerProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [fileUploaded, setFileUploaded] = useState(false);
    const [fileName, setFileName] = useState("");
    const [totalRecords, setTotalRecords] = useState(0);
    const [years, setYears] = useState<number[]>([]);
    const [availableData, setAvailableData] = useState<AvailableData>({});

    const [selectedDate, setSelectedDate] = useState({
        year: 2024,
        month: 1,
        day: 1,
    });
    const [selectedHour, setSelectedHour] = useState<number>(initialSelectedHour);
    const [timePeriod, setTimePeriod] = useState<"AM" | "PM">("AM");

    const [dayRecords, setDayRecords] = useState<EPWHourlyData[]>([]);
    const [monthlyDiffuseData, setMonthlyDiffuseData] = useState<EPWMonthlyDiffuseData | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // --- Cascading Options ---
    const availableMonths = useMemo(() => {
        const yr = availableData[String(selectedDate.year)];
        if (!yr) return [];
        return Object.keys(yr).map(Number).sort((a, b) => a - b);
    }, [availableData, selectedDate.year]);

    const availableDays = useMemo(() => {
        const mo = availableData[String(selectedDate.year)]?.[String(selectedDate.month)];
        return mo ? mo.days : [];
    }, [availableData, selectedDate.year, selectedDate.month]);

    // Handle Year change
    const handleYearChange = (year: number) => {
        const yr = availableData[String(year)];
        if (!yr) {
            setSelectedDate(prev => ({ ...prev, year }));
            return;
        }
        const firstMonth = Math.min(...Object.keys(yr).map(Number)) || 1;
        const mo = yr[String(firstMonth)];
        const firstDay = mo?.days[0] ?? 1;
        setSelectedDate({ year, month: firstMonth, day: firstDay });
    };

    // Handle Month change
    const handleMonthChange = (month: number) => {
        const mo = availableData[String(selectedDate.year)]?.[String(month)];
        const firstDay = mo?.days[0] ?? 1;
        setSelectedDate(prev => ({ ...prev, month, day: firstDay }));
    };

    // Handle Day change
    const handleDayChange = (day: number) => {
        setSelectedDate(prev => ({ ...prev, day }));
    };

    // Upload EPW
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setLoading(true);
        setErrorMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(`${apiUrl}/api/upload-epw`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();

            if (data.success) {
                setFileUploaded(true);
                setTotalRecords(data.total_records || 8760);
                const yrList: number[] = data.years || [];
                setYears(yrList);
                const ad: AvailableData = data.available_data || {};
                setAvailableData(ad);

                const firstYear = yrList[0] ?? 2024;
                const yrData = ad[String(firstYear)] ?? {};
                const firstMonth = Math.min(...Object.keys(yrData).map(Number)) || 1;
                const moData = yrData[String(firstMonth)];
                const firstDay = moData?.days[0] ?? 1;

                setSelectedDate({
                    year: firstYear,
                    month: firstMonth,
                    day: firstDay,
                });
            } else {
                setErrorMessage(data.message || "Failed to parse EPW file");
            }
        } catch (error) {
            console.error("Upload error:", error);
            setErrorMessage("Error uploading EPW file. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    // Query 24-hour day records (for "hourly" mode)
    useEffect(() => {
        if (!fileUploaded || mode !== "hourly") return;

        let active = true;
        const fetchDayData = async () => {
            setLoading(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                const response = await fetch(`${apiUrl}/api/query-epw-day`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(selectedDate),
                });
                const data = await response.json();
                if (active && data.success && Array.isArray(data.records)) {
                    setDayRecords(data.records);

                    // If currently selected hour is in this day, trigger callback or default to first
                    const currentRecord = data.records.find((r: EPWHourlyData) => r.hour === selectedHour) || data.records[0];
                    if (currentRecord && onSelectHour) {
                        onSelectHour(currentRecord);
                        setSelectedHour(currentRecord.hour);
                    }
                }
            } catch (err) {
                console.error("Day query error:", err);
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchDayData();
        return () => {
            active = false;
        };
    }, [fileUploaded, mode, selectedDate.year, selectedDate.month, selectedDate.day]);

    // Query monthly diffuse radiation (for "monthly-diffuse" mode)
    useEffect(() => {
        if (!fileUploaded || mode !== "monthly-diffuse") return;

        let active = true;
        const fetchMonthlyDiffuseData = async () => {
            setLoading(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                const response = await fetch(`${apiUrl}/api/query-epw-monthly-diffuse`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        year: selectedDate.year,
                        month: selectedDate.month
                    }),
                });
                const data: EPWMonthlyDiffuseResponse = await response.json();
                if (active && data.success) {
                    const diffuseResult: EPWMonthlyDiffuseData = {
                        year: data.year,
                        month: data.month,
                        month_name: data.month_name,
                        days_count: data.days_count,
                        avg_daily_diffuse_wh_m2: data.avg_daily_diffuse_wh_m2,
                        diffuse_rad_w_m2: data.diffuse_rad_w_m2,
                    };
                    setMonthlyDiffuseData(diffuseResult);
                    if (onSelectMonthlyDiffuse) {
                        onSelectMonthlyDiffuse(diffuseResult);
                    }
                }
            } catch (err) {
                console.error("Monthly diffuse query error:", err);
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchMonthlyDiffuseData();
        return () => {
            active = false;
        };
    }, [fileUploaded, mode, selectedDate.year, selectedDate.month]);

    // Handle row click (hourly mode)
    const handleSelectRow = (record: EPWHourlyData) => {
        setSelectedHour(record.hour);
        if (onSelectHour) {
            onSelectHour(record);
        }
    };

    // Filter displayed rows by AM (hours 1-12) vs PM (hours 13-24)
    const displayedRecords = useMemo(() => {
        if (timePeriod === "AM") {
            return dayRecords.filter(r => r.hour >= 1 && r.hour <= 12);
        } else {
            return dayRecords.filter(r => r.hour >= 13 && r.hour <= 24);
        }
    }, [dayRecords, timePeriod]);

    // Color tokens
    const cardBg = isDark ? "#131B2C" : "#ffffff";
    const cardBorder = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0";
    const bannerBg = isDark ? "rgba(16, 185, 129, 0.05)" : "#f0fdf4";
    const bannerBorder = isDark ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid #bbf7d0";
    const titleColor = isDark ? "#ffffff" : "#1e293b";
    const subtitleColor = isDark ? "#9ca3af" : "#64748b";
    const labelColor = isDark ? "#6b7280" : "#64748b";
    const selectBg = isDark ? "#0B1121" : "#f8fafc";
    const tableHeaderBg = isDark ? "rgba(255,255,255,0.02)" : "#f8fafc";
    const tableBorderColor = isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9";
    const tabContainerBg = isDark ? "#0B1121" : "#f1f5f9";
    const statCardBg = isDark ? "#0B1121" : "#f8fafc";
    const statCardBorder = isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #e2e8f0";

    return (
        <div className="rounded-2xl p-6 relative overflow-hidden transition-all shadow-sm" style={{ background: cardBg, border: cardBorder }}>
            {/* Hidden Input for Replace / Upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".epw"
                onChange={handleFileUpload}
                className="hidden"
            />

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#1A73E8]/10 p-2.5 rounded-xl flex items-center justify-center">
                    {mode === "monthly-diffuse" ? (
                        <SunMedium className="text-[#1A73E8] h-5 w-5" />
                    ) : (
                        <Wind className="text-[#1A73E8] h-5 w-5" />
                    )}
                </div>
                <div>
                    <h4 className="font-semibold text-lg" style={{ color: titleColor }}>
                        {mode === "monthly-diffuse"
                            ? "Auto-fill Diffuse Radiation from Weather Data (EPW)"
                            : "Auto-fill from Weather Data (EPW)"}
                    </h4>
                    {mode === "monthly-diffuse" && (
                        <p className="text-xs" style={{ color: subtitleColor }}>
                            Monthly average daily diffuse solar radiation converted to W/m² (Wh/m² ÷ 24 hrs)
                        </p>
                    )}
                </div>
            </div>

            {!fileUploaded ? (
                /* Upload Dropzone */
                <div className="space-y-4">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all hover:border-[#1A73E8] group"
                        style={{ borderColor: isDark ? "rgba(255,255,255,0.15)" : "#cbd5e1" }}
                    >
                        <div className="mx-auto w-12 h-12 rounded-full bg-[#1A73E8]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="h-6 w-6 text-[#1A73E8]" />
                        </div>
                        <p className="text-sm font-semibold mb-1" style={{ color: titleColor }}>
                            {loading ? "Parsing EPW file..." : "Click or drag to upload .epw file"}
                        </p>
                        <p className="text-xs" style={{ color: subtitleColor }}>
                            Supports EnergyPlus Weather files up to 200MB
                        </p>
                    </div>
                    {errorMessage && (
                        <div className="p-3 text-xs text-red-500 rounded-lg bg-red-500/10 border border-red-500/20">
                            {errorMessage}
                        </div>
                    )}
                </div>
            ) : (
                /* Full EPW Viewer */
                <div className="space-y-5 animate-in fade-in duration-300">
                    {/* File Info Banner */}
                    <div
                        className="p-4 rounded-xl flex items-center justify-between gap-3"
                        style={{ background: bannerBg, border: bannerBorder }}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold truncate" style={{ color: titleColor }}>
                                    {fileName || "EPW Weather File"}
                                </p>
                                <p className="text-xs" style={{ color: subtitleColor }}>
                                    EPW file loaded · {totalRecords} hourly records available.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-8 px-3 text-xs font-medium bg-white/5 hover:bg-white/10 text-[#1A73E8] border-[#1A73E8]/30"
                            >
                                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                                Replace
                            </Button>
                            <button
                                onClick={() => {
                                    setFileUploaded(false);
                                    setDayRecords([]);
                                    setMonthlyDiffuseData(null);
                                }}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-500/10 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Date Dropdowns */}
                    <div className={`grid gap-3 ${mode === "monthly-diffuse" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
                        {/* Year */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium" style={{ color: labelColor }}>Year</Label>
                            <div className="relative">
                                <select
                                    className="w-full rounded-xl text-sm px-3.5 py-2.5 outline-none appearance-none pr-8 transition-colors cursor-pointer"
                                    style={{ background: selectBg, border: cardBorder, color: titleColor }}
                                    value={selectedDate.year}
                                    onChange={(e) => handleYearChange(Number(e.target.value))}
                                >
                                    {years.map(y => (
                                        <option key={y} value={y} style={{ background: selectBg, color: titleColor }}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: labelColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Month */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium" style={{ color: labelColor }}>Month</Label>
                            <div className="relative">
                                <select
                                    className="w-full rounded-xl text-sm px-3.5 py-2.5 outline-none appearance-none pr-8 transition-colors cursor-pointer"
                                    style={{ background: selectBg, border: cardBorder, color: titleColor }}
                                    value={selectedDate.month}
                                    onChange={(e) => handleMonthChange(Number(e.target.value))}
                                >
                                    {availableMonths.map(m => (
                                        <option key={m} value={m} style={{ background: selectBg, color: titleColor }}>
                                            {MONTH_NAMES[m - 1]}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: labelColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Day (Only for hourly mode) */}
                        {mode === "hourly" && (
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium" style={{ color: labelColor }}>Day</Label>
                                <div className="relative">
                                    <select
                                        className="w-full rounded-xl text-sm px-3.5 py-2.5 outline-none appearance-none pr-8 transition-colors cursor-pointer"
                                        style={{ background: selectBg, border: cardBorder, color: titleColor }}
                                        value={selectedDate.day}
                                        onChange={(e) => handleDayChange(Number(e.target.value))}
                                    >
                                        {availableDays.map(d => (
                                            <option key={d} value={d} style={{ background: selectBg, color: titleColor }}>
                                                {d}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: labelColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mode Specific Body */}
                    {mode === "monthly-diffuse" ? (
                        /* Monthly Diffuse Radiation Display */
                        <div className="space-y-4 pt-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Converted Radiation (W/m²) */}
                                <div
                                    className="p-4 rounded-2xl relative overflow-hidden transition-all flex flex-col justify-between border"
                                    style={{ background: statCardBg, borderColor: isDark ? "rgba(26, 115, 232, 0.3)" : "#bfdbfe" }}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs uppercase font-semibold text-[#1A73E8]">
                                                Calculated Diffuse Radiation
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A73E8]/10 text-[#1A73E8] font-semibold">
                                                Auto-applied
                                            </span>
                                        </div>
                                        <div className="text-3xl font-bold font-mono my-2 text-[#1A73E8]">
                                            {loading ? "..." : (monthlyDiffuseData ? `${monthlyDiffuseData.diffuse_rad_w_m2.toFixed(2)}` : "---")}
                                            <span className="text-sm font-sans font-normal ml-1.5" style={{ color: subtitleColor }}>W/m²</span>
                                        </div>
                                    </div>
                                    <p className="text-xs font-mono" style={{ color: subtitleColor }}>
                                        = Daily Avg ({monthlyDiffuseData?.avg_daily_diffuse_wh_m2.toFixed(1) ?? "0"} Wh/m²) ÷ 24 hrs
                                    </p>
                                </div>

                                {/* Monthly Average Daily Wh/m² */}
                                <div
                                    className="p-4 rounded-2xl relative overflow-hidden transition-all flex flex-col justify-between"
                                    style={{ background: statCardBg, border: statCardBorder }}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs uppercase font-semibold" style={{ color: labelColor }}>
                                                Monthly Avg Daily Diffuse
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
                                                {monthlyDiffuseData?.days_count ?? 0} Days
                                            </span>
                                        </div>
                                        <div className="text-2xl font-bold font-mono my-2" style={{ color: titleColor }}>
                                            {loading ? "..." : (monthlyDiffuseData ? `${monthlyDiffuseData.avg_daily_diffuse_wh_m2.toFixed(2)}` : "---")}
                                            <span className="text-sm font-sans font-normal ml-1.5" style={{ color: subtitleColor }}>Wh/m²</span>
                                        </div>
                                    </div>
                                    <p className="text-xs" style={{ color: subtitleColor }}>
                                        {MONTH_NAMES[selectedDate.month - 1]} {selectedDate.year} average daily solar total
                                    </p>
                                </div>
                            </div>

                            {/* Bottom Indicator */}
                            <div className="flex items-center gap-2 text-xs pt-1" style={{ color: subtitleColor }}>
                                <Info className="w-4 h-4 text-[#1A73E8] shrink-0" />
                                <span>
                                    Showing diffuse radiation for {MONTH_NAMES[selectedDate.month - 1]} {selectedDate.year}. Values automatically update the window profiles below.
                                </span>
                            </div>
                        </div>
                    ) : (
                        /* Hourly Mode (AM/PM & Table) */
                        <>
                            {/* AM / PM Segmented Control */}
                            <div
                                className="p-1 rounded-2xl flex items-center gap-1 border"
                                style={{ background: tabContainerBg, borderColor: isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0" }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setTimePeriod("AM")}
                                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${timePeriod === "AM"
                                            ? "bg-[#1A73E8] text-white shadow-sm"
                                            : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                                        }`}
                                >
                                    <Sun className="w-4 h-4" />
                                    <span>AM</span>
                                    <span className={`text-[11px] font-normal ${timePeriod === "AM" ? "text-white/80" : "text-gray-400"}`}>1 – 12</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setTimePeriod("PM")}
                                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${timePeriod === "PM"
                                            ? "bg-[#1A73E8] text-white shadow-sm"
                                            : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                                        }`}
                                >
                                    <Moon className="w-4 h-4" />
                                    <span>PM</span>
                                    <span className={`text-[11px] font-normal ${timePeriod === "PM" ? "text-white/80" : "text-gray-400"}`}>13 – 24</span>
                                </button>
                            </div>

                            {/* Hourly Records Table */}
                            <div
                                className="rounded-2xl border overflow-hidden"
                                style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0" }}
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr
                                                className="border-b text-[11px] uppercase tracking-wider font-bold"
                                                style={{ background: tableHeaderBg, borderColor: tableBorderColor, color: subtitleColor }}
                                            >
                                                <th className="py-3 px-4">TIME</th>
                                                <th className="py-3 px-4 text-right">TEMP (°C)</th>
                                                <th className="py-3 px-4 text-right">WIND (M/S)</th>
                                                <th className="py-3 px-4 text-right">WIND (M/H)</th>
                                                {showRadiation && (
                                                    <th className="py-3 px-4 text-right">RAD (W/M²)</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedRecords.length === 0 ? (
                                                <tr>
                                                    <td colSpan={showRadiation ? 5 : 4} className="py-6 text-center text-xs" style={{ color: subtitleColor }}>
                                                        {loading ? "Loading weather data..." : "No records found for this date."}
                                                    </td>
                                                </tr>
                                            ) : (
                                                displayedRecords.map((r) => {
                                                    const isSelected = selectedHour === r.hour;
                                                    return (
                                                        <tr
                                                            key={r.hour}
                                                            onClick={() => handleSelectRow(r)}
                                                            className={`border-b cursor-pointer transition-all ${isSelected
                                                                    ? "bg-[#1A73E8]/15 font-semibold"
                                                                    : "hover:bg-[#1A73E8]/5"
                                                                }`}
                                                            style={{ borderColor: tableBorderColor }}
                                                        >
                                                            <td className="py-3 px-4 font-semibold" style={{ color: isSelected ? "#1A73E8" : titleColor }}>
                                                                {r.time_label}
                                                            </td>
                                                            <td className="py-3 px-4 text-right font-mono" style={{ color: titleColor }}>
                                                                {r.temperature.toFixed(1)}
                                                            </td>
                                                            <td className="py-3 px-4 text-right font-mono" style={{ color: titleColor }}>
                                                                {r.wind_speed_ms.toFixed(2)}
                                                            </td>
                                                            <td className="py-3 px-4 text-right font-mono" style={{ color: titleColor }}>
                                                                {Math.round(r.wind_speed_mh)}
                                                            </td>
                                                            {showRadiation && (
                                                                <td className="py-3 px-4 text-right font-mono text-[#1A73E8]" style={{ color: titleColor }}>
                                                                    {r.radiation.toFixed(1)}
                                                                </td>
                                                            )}
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Bottom Indicator */}
                            <div className="flex items-center gap-2 text-xs pt-1" style={{ color: subtitleColor }}>
                                <Info className="w-4 h-4 text-[#1A73E8] shrink-0" />
                                <span>Click on any hour to select and auto-fill calculations. {totalRecords} hourly records loaded.</span>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
