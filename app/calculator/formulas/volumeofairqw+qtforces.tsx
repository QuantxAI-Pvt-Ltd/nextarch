"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { MetricCard, ResultCard } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { Upload, Wind, Info, ArrowLeft, Loader2, Sun, Moon, CheckCircle2, X, RefreshCw } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { Label } from "@/components/ui/label";
import { useTheme } from "../theme-context";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

interface AvailableMonthData {
    days: number[];
    hours_by_day: Record<string, number[]>;
}

type AvailableData = Record<string, Record<string, AvailableMonthData>>;

interface ResultData {
    Qt: number;
    Qw: number;
    Q_combined: number;
}

interface EPWHourRow {
    hour: number;
    temperature: number;
    wind_speed_ms: number;
    wind_speed_mh: number;
}

/** Convert raw EPW hour (1–24) → readable AM/PM label */
function formatHour(h: number): string {
    if (h === 24) return "12 AM";
    if (h === 12) return "12 PM";
    if (h > 12) return `${h - 12} PM`;
    return `${h} AM`;
}

export default function Voaqwqtforce() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [values, setValues] = useState({
        A_inlet: 0, h: 0, t_i: 0, t_o: 0, A_smaller: 0, V: 0, K: 0.6,
    });
    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    type UploadState = "idle" | "uploading" | "uploaded" | "error";
    const [uploadState, setUploadState] = useState<UploadState>("idle");
    const [epwFileName, setEpwFileName] = useState("");
    const [epwYears, setEpwYears] = useState<number[]>([]);
    const [selectedDate, setSelectedDate] = useState({ year: 2024, month: 1, day: 1, hour: 12 });
    const [availableData, setAvailableData] = useState<AvailableData>({});
    const [epwMessage, setEpwMessage] = useState("");
    const replaceInputRef = useRef<HTMLInputElement>(null);

    // ── Day viewer state ───────────────────────────────────────────────────────
    const [dayRows, setDayRows] = useState<EPWHourRow[]>([]);
    const [dayLoading, setDayLoading] = useState(false);
    const [dayError, setDayError] = useState("");
    const [selectedHour, setSelectedHour] = useState<number | null>(null);
    const [viewerTab, setViewerTab] = useState<"AM" | "PM">("AM");

    // --- Derived option lists (cascade from selected year → month → day) ---
    const availableMonths = useMemo(() => {
        const yr = availableData[String(selectedDate.year)];
        if (!yr) return [];
        return Object.keys(yr).map(Number).sort((a, b) => a - b);
    }, [availableData, selectedDate.year]);

    const availableDays = useMemo(() => {
        const mo = availableData[String(selectedDate.year)]?.[String(selectedDate.month)];
        return mo ? mo.days : [];
    }, [availableData, selectedDate.year, selectedDate.month]);

    const availableHours = useMemo(() => {
        const mo = availableData[String(selectedDate.year)]?.[String(selectedDate.month)];
        return mo ? (mo.hours_by_day[String(selectedDate.day)] ?? []) : [];
    }, [availableData, selectedDate.year, selectedDate.month, selectedDate.day]);

    // ── Viewer split: AM = hours 1–12, PM = hours 13–24 ──────────────────────
    const amRows = useMemo(() => dayRows.filter(r => r.hour >= 1 && r.hour <= 12), [dayRows]);
    const pmRows = useMemo(() => dayRows.filter(r => r.hour >= 13 && r.hour <= 24), [dayRows]);
    const activeRows = viewerTab === "AM" ? amRows : pmRows;

    // ── Fetch all hours for the selected day ──────────────────────────────────
    const fetchDayRows = useCallback(async (year: number, month: number, day: number) => {
        setDayLoading(true);
        setDayRows([]);
        setDayError("");
        setSelectedHour(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/epw-day`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ year, month, day }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.success) setDayRows(data.rows);
            else setDayError(data.message || "No data returned from API.");
        } catch (e) {
            console.error("Failed to fetch day rows", e);
            setDayError(`Could not reach API: ${e instanceof Error ? e.message : e}. Is the Python backend running?`);
        } finally {
            setDayLoading(false);
        }
    }, []);

    // Re-fetch whenever year/month/day changes (and EPW is uploaded)
    useEffect(() => {
        if (uploadState === "uploaded") {
            fetchDayRows(selectedDate.year, selectedDate.month, selectedDate.day);
        }
    }, [uploadState, selectedDate.year, selectedDate.month, selectedDate.day, fetchDayRows]);

    // ── Row select → auto-fill t_o and V ─────────────────────────────────────
    const handleRowSelect = (row: EPWHourRow) => {
        setSelectedHour(row.hour);
        setSelectedDate(prev => ({ ...prev, hour: row.hour }));
        setValues(prev => ({ ...prev, t_o: row.temperature, V: row.wind_speed_mh }));
        setEpwMessage(
            `Selected ${formatHour(row.hour)}: Outdoor ${row.temperature}°C, Wind ${row.wind_speed_mh} m/h`
        );
    };

    // --- Cascading change handlers ---
    const handleYearChange = (year: number) => {
        const yr = availableData[String(year)];
        if (!yr) { setSelectedDate(prev => ({ ...prev, year })); return; }
        const firstMonth = Math.min(...Object.keys(yr).map(Number));
        const mo = yr[String(firstMonth)];
        const firstDay = mo?.days[0] ?? 1;
        const firstHour = mo?.hours_by_day[String(firstDay)]?.[0] ?? 1;
        setSelectedDate({ year, month: firstMonth, day: firstDay, hour: firstHour });
    };

    const handleMonthChange = (month: number) => {
        const mo = availableData[String(selectedDate.year)]?.[String(month)];
        const firstDay = mo?.days[0] ?? 1;
        const firstHour = mo?.hours_by_day[String(firstDay)]?.[0] ?? 1;
        setSelectedDate(prev => ({ ...prev, month, day: firstDay, hour: firstHour }));
    };

    const handleDayChange = (day: number) => {
        const mo = availableData[String(selectedDate.year)]?.[String(selectedDate.month)];
        const firstHour = mo?.hours_by_day[String(day)]?.[0] ?? 1;
        setSelectedDate(prev => ({ ...prev, day, hour: firstHour }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const parsed = parseFloat(value);
        setValues(prev => ({ ...prev, [name]: isNaN(parsed) ? 0 : Math.abs(parsed) }));
    };

    const { A_inlet, h, t_i, t_o, A_smaller, V, K } = values;

    const processEpwFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        setEpwFileName(file.name);
        setUploadState("uploading");
        setEpwMessage("");
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-epw`, { method: 'POST', body: formData });
            const data = await response.json();
            if (data.success) {
                setEpwYears(data.years || []);
                setAvailableData(data.available_data || {});
                const firstYear: number = data.years?.[0] ?? 2024;
                const ad: AvailableData = data.available_data || {};
                const yrData = ad[String(firstYear)] ?? {};
                const firstMonth = Math.min(...Object.keys(yrData).map(Number)) || 1;
                const moData = yrData[String(firstMonth)];
                const firstDay = moData?.days[0] ?? 1;
                const firstHour = moData?.hours_by_day[String(firstDay)]?.[0] ?? 1;
                setSelectedDate({ year: firstYear, month: firstMonth, day: firstDay, hour: firstHour });
                setUploadState("uploaded");
                setEpwMessage(`${data.total_records} hourly records loaded.`);
            } else {
                setUploadState("error");
                setEpwMessage(data.message || 'Failed to upload EPW file');
            }
        } catch (error) {
            console.error('Error uploading EPW file:', error);
            setUploadState("error");
            setEpwMessage('Error uploading EPW file. Please ensure the API is running.');
        }
    };

    const handleEpwUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = "";
        await processEpwFile(file);
    };

    const handleReplaceEpw = () => { replaceInputRef.current?.click(); };

    const handleRemoveEpw = () => {
        setUploadState("idle");
        setEpwFileName("");
        setEpwYears([]);
        setAvailableData({});
        setEpwMessage("");
        setDayRows([]);
        setDayError("");
        setSelectedHour(null);
    };

    // Mobile: Apply button fallback
    const handleFetchEpwData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/query-epw`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedDate),
            });
            const data = await response.json();
            if (data.success) {
                setValues(prev => ({ ...prev, t_o: data.temperature, V: data.wind_speed_mh }));
                setEpwMessage(`Data fetched: ${data.temperature}°C, ${data.wind_speed_mh} wind speed`);
            } else {
                setEpwMessage(data.message || 'No data found for selected date/time');
            }
        } catch (error) {
            console.error('Error querying EPW data:', error);
            setEpwMessage('Error fetching EPW data');
        }
    };

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/volume-air-forces`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ A_inlet, h, t_i, t_o, A_smaller, V, K }),
            });
            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error calculating:', error);
            alert('Error calculating...');
        } finally {
            setLoading(false);
        }
    };

    const titleColor = isDark ? "#ffffff" : "#1e293b";
    const subtitleColor = isDark ? "#9ca3af" : "#64748b";
    const labelColor = isDark ? "#6b7280" : "#94a3b8";
    const cardBg = isDark ? "#131B2C" : "#ffffff";
    const cardBorder = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0";
    const previewBg = isDark ? "#0f1623" : "#f8fafc";
    const previewBorder = isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0";
    const dividerColor = isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0";
    const selectBg = isDark ? "#0B1121" : "#f8fafc";
    const uploadBorderColor = isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0";
    const uploadTextColor = isDark ? "#d1d5db" : "#475569";
    const rowHoverBg = isDark ? "rgba(26,115,232,0.08)" : "rgba(26,115,232,0.05)";
    const rowSelectedBg = isDark ? "rgba(26,115,232,0.18)" : "rgba(26,115,232,0.10)";
    const tableHeaderBg = isDark ? "rgba(255,255,255,0.03)" : "#f8fafc";
    const tabActiveBg = "#1A73E8";
    const tabInactiveColor = isDark ? "#9ca3af" : "#64748b";

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: titleColor }}>Volume of Air (Forces)</h1>
                    <p className="max-w-2xl" style={{ color: subtitleColor }}>
                        Calculates thermal, wind, and combined ventilation flows based on opening areas and environmental conditions.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MetricCard label="Inlet Area (A)" value={A_inlet} unit="m²" name="A_inlet" onChange={handleChange} />
                        <MetricCard label="Height Diff (h)" value={h} unit="m" name="h" onChange={handleChange} />
                        <MetricCard label="Indoor Temp (ti)" value={t_i} unit="°C" name="t_i" onChange={handleChange} />
                        <MetricCard label="Smaller Area (As)" value={A_smaller} unit="m²" name="A_smaller" onChange={handleChange} />
                        <MetricCard label="Eff. Coeff (K)" value={K} unit="" name="K" step={0.1} onChange={handleChange} />
                        <MetricCard label="Outdoor Temp (to)" value={t_o} unit="°C" name="t_o" onChange={handleChange} />
                        <MetricCard label="Wind Speed (V)" value={V} unit="m/h" name="V" onChange={handleChange} />
                    </div>

                    {/* Weather Data Card */}
                    <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: cardBg, border: cardBorder }}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#1A73E8]/10 p-2 rounded-lg">
                                <Wind className="text-[#1A73E8] h-5 w-5" />
                            </div>
                            <h4 className="font-medium" style={{ color: titleColor }}>Auto-fill from Weather Data (EPW)</h4>
                        </div>

                        <div className="space-y-4">
                            {/* ── Hidden replace input */}
                            <input ref={replaceInputRef} type="file" accept=".epw" onChange={handleEpwUpload} className="hidden" />

                            {/* ── IDLE: large dashed upload zone */}
                            {uploadState === "idle" && (
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#1A73E8]/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <label
                                        className="relative border-2 border-dashed rounded-xl p-6 text-center transition-colors group-hover:border-[#1A73E8]/50 flex flex-col items-center cursor-pointer"
                                        style={{ borderColor: uploadBorderColor }}
                                    >
                                        <input type="file" accept=".epw" onChange={handleEpwUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        <Upload className="h-8 w-8 mb-2 group-hover:text-[#1A73E8] transition-colors" style={{ color: labelColor }} />
                                        <p className="text-sm font-medium" style={{ color: uploadTextColor }}>Click to upload .epw file</p>
                                        <p className="text-xs mt-1" style={{ color: labelColor }}>Maximum file size 200MB</p>
                                    </label>
                                </div>
                            )}

                            {/* ── UPLOADING: compact spinner */}
                            {uploadState === "uploading" && (
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: selectBg, border: cardBorder }}>
                                    <Loader2 className="h-5 w-5 animate-spin text-[#1A73E8] shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate" style={{ color: titleColor }}>{epwFileName}</p>
                                        <p className="text-xs" style={{ color: labelColor }}>Reading EPW weather data...</p>
                                    </div>
                                </div>
                            )}

                            {/* ── UPLOADED: compact success card */}
                            {uploadState === "uploaded" && (
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl animate-in fade-in duration-300" style={{ background: selectBg, border: "1px solid rgba(34,197,94,0.3)" }}>
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate" style={{ color: titleColor }}>{epwFileName}</p>
                                        <p className="text-xs" style={{ color: labelColor }}>EPW file uploaded successfully · {epwMessage}</p>
                                    </div>
                                    <button onClick={handleReplaceEpw} title="Replace file" className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors hover:bg-[#1A73E8]/10" style={{ color: "#1A73E8", border: "1px solid rgba(26,115,232,0.3)", whiteSpace: "nowrap" }}>
                                        <RefreshCw className="h-3 w-3" /> Replace
                                    </button>
                                    <button onClick={handleRemoveEpw} title="Remove file" className="flex items-center justify-center h-7 w-7 rounded-lg transition-colors hover:bg-red-500/10" style={{ color: labelColor }}>
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {/* ── ERROR: inline error with retry */}
                            {uploadState === "error" && (
                                <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: selectBg, border: "1px solid rgba(239,68,68,0.4)" }}>
                                    <Info className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium" style={{ color: "#f87171" }}>Upload failed</p>
                                        <p className="text-xs mt-0.5" style={{ color: labelColor }}>{epwMessage}</p>
                                    </div>
                                    <button onClick={handleReplaceEpw} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors hover:bg-[#1A73E8]/10" style={{ color: "#1A73E8", border: "1px solid rgba(26,115,232,0.3)", whiteSpace: "nowrap" }}>Try again</button>
                                    <button onClick={handleRemoveEpw} title="Dismiss" className="flex items-center justify-center h-7 w-7 rounded-lg transition-colors hover:bg-red-500/10" style={{ color: labelColor }}>
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {uploadState === "uploaded" && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    {/* Year / Month / Day selectors */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {/* Year */}
                                        <div className="space-y-1">
                                            <Label className="text-xs" style={{ color: labelColor }}>Year</Label>
                                            <div className="relative">
                                                <select className="w-full rounded-lg text-sm px-3 py-2 outline-none appearance-none pr-8" style={{ background: selectBg, border: cardBorder, color: titleColor }} value={selectedDate.year} onChange={(e) => handleYearChange(Number(e.target.value))}>
                                                    {epwYears.map(year => (<option key={year} value={year} style={{ background: selectBg, color: titleColor }}>{year}</option>))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: labelColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                                            </div>
                                        </div>
                                        {/* Month */}
                                        <div className="space-y-1">
                                            <Label className="text-xs" style={{ color: labelColor }}>Month</Label>
                                            <div className="relative">
                                                <select className="w-full rounded-lg text-sm px-3 py-2 outline-none appearance-none pr-8" style={{ background: selectBg, border: cardBorder, color: titleColor }} value={selectedDate.month} onChange={(e) => handleMonthChange(Number(e.target.value))}>
                                                    {availableMonths.map(m => (<option key={m} value={m} style={{ background: selectBg, color: titleColor }}>{MONTH_NAMES[m - 1]}</option>))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: labelColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                                            </div>
                                        </div>
                                        {/* Day */}
                                        <div className="space-y-1">
                                            <Label className="text-xs" style={{ color: labelColor }}>Day</Label>
                                            <div className="relative">
                                                <select className="w-full rounded-lg text-sm px-3 py-2 outline-none appearance-none pr-8" style={{ background: selectBg, border: cardBorder, color: titleColor }} value={selectedDate.day} onChange={(e) => handleDayChange(Number(e.target.value))}>
                                                    {availableDays.map(d => (<option key={d} value={d} style={{ background: selectBg, color: titleColor }}>{d}</option>))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: labelColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── DESKTOP-ONLY AM/PM Day Viewer */}
                                    <div className="hidden md:block">
                                        {dayLoading ? (
                                            <div className="flex items-center justify-center py-8 gap-2" style={{ color: labelColor }}>
                                                <Loader2 className="h-4 w-4 animate-spin text-[#1A73E8]" />
                                                <span className="text-sm">Loading hourly data...</span>
                                            </div>
                                        ) : dayError ? (
                                            <div className="flex gap-2 items-start text-xs p-3 rounded-lg" style={{ background: selectBg, border: "1px solid #ef4444", color: "#f87171" }}>
                                                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                                                <span>{dayError}</span>
                                            </div>
                                        ) : dayRows.length > 0 ? (
                                            <div className="rounded-xl overflow-hidden" style={{ border: cardBorder }}>
                                                {/* Tab strip */}
                                                <div className="flex" style={{ background: tableHeaderBg, borderBottom: cardBorder }}>
                                                    <button onClick={() => setViewerTab("AM")} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200" style={{ background: viewerTab === "AM" ? tabActiveBg : "transparent", color: viewerTab === "AM" ? "#ffffff" : tabInactiveColor, borderRadius: "10px 10px 0 0" }}>
                                                        <Sun className="h-3.5 w-3.5" /> AM &nbsp;<span className="opacity-60 font-normal normal-case tracking-normal">1 – 12</span>
                                                    </button>
                                                    <button onClick={() => setViewerTab("PM")} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200" style={{ background: viewerTab === "PM" ? tabActiveBg : "transparent", color: viewerTab === "PM" ? "#ffffff" : tabInactiveColor, borderRadius: "10px 10px 0 0" }}>
                                                        <Moon className="h-3.5 w-3.5" /> PM &nbsp;<span className="opacity-60 font-normal normal-case tracking-normal">13 – 24</span>
                                                    </button>
                                                </div>
                                                {/* Column headers */}
                                                <div className="grid text-xs font-semibold uppercase tracking-wider px-4 py-2" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", background: tableHeaderBg, color: labelColor, borderBottom: `1px solid ${dividerColor}` }}>
                                                    <span>Time</span>
                                                    <span className="text-right">Temp (°C)</span>
                                                    <span className="text-right">Wind (m/s)</span>
                                                    <span className="text-right">Wind (m/h)</span>
                                                </div>
                                                {/* Data rows */}
                                                {activeRows.map((row) => {
                                                    const isSelected = selectedHour === row.hour;
                                                    return (
                                                        <div key={row.hour} onClick={() => handleRowSelect(row)} className="grid px-4 py-2.5 cursor-pointer transition-all duration-150" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", background: isSelected ? rowSelectedBg : "transparent", borderLeft: isSelected ? "3px solid #1A73E8" : "3px solid transparent", borderBottom: `1px solid ${dividerColor}` }}
                                                            onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = rowHoverBg; }}
                                                            onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                                                        >
                                                            <span className="text-sm font-medium" style={{ color: isSelected ? "#1A73E8" : titleColor }}>{formatHour(row.hour)}</span>
                                                            <span className="text-sm text-right font-mono" style={{ color: isSelected ? "#1A73E8" : subtitleColor }}>{row.temperature.toFixed(1)}</span>
                                                            <span className="text-sm text-right font-mono" style={{ color: isSelected ? "#1A73E8" : subtitleColor }}>{row.wind_speed_ms.toFixed(2)}</span>
                                                            <span className="text-sm text-right font-mono" style={{ color: isSelected ? "#1A73E8" : subtitleColor }}>{row.wind_speed_mh.toFixed(0)}</span>
                                                        </div>
                                                    );
                                                })}
                                                {activeRows.length === 0 && (
                                                    <div className="py-6 text-center text-sm" style={{ color: labelColor }}>No {viewerTab} data available for this day.</div>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>

                                    {/* ── MOBILE: Time selector + Apply button */}
                                    <div className="md:hidden space-y-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs" style={{ color: labelColor }}>Time</Label>
                                            <div className="relative">
                                                <select className="w-full rounded-lg text-sm px-3 py-2 outline-none appearance-none pr-8" style={{ background: selectBg, border: cardBorder, color: titleColor }} value={selectedDate.hour} onChange={(e) => setSelectedDate(prev => ({ ...prev, hour: Number(e.target.value) }))}>
                                                    {availableHours.map(hv => (<option key={hv} value={hv} style={{ background: selectBg, color: titleColor }}>{formatHour(hv)}</option>))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: labelColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                                            </div>
                                        </div>
                                        <Button onClick={handleFetchEpwData} className="w-full bg-[#1A73E8]/10 hover:bg-[#1A73E8]/20 text-[#1A73E8] border border-[#1A73E8]/20">
                                            Apply Weather Data to Inputs
                                        </Button>
                                    </div>

                                    {/* Status message */}
                                    {epwMessage && (
                                        <div className="flex gap-2 items-center text-xs p-3 rounded-lg" style={{ background: selectBg, border: cardBorder, color: subtitleColor }}>
                                            <Info className="h-4 w-4 text-[#1A73E8] shrink-0" />
                                            {epwMessage}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleCalculate}
                            disabled={loading}
                            className="bg-[#1A73E8] hover:bg-[#1557B0] text-white px-8 py-6 rounded-xl font-semibold text-lg"
                        >
                            {loading ? 'Calculating...' : 'Calculate Flows'}
                        </Button>
                    </div>

                    {/* Live Formula Preview */}
                    <div className="rounded-2xl p-4 md:p-6 relative w-full overflow-hidden" style={{ background: previewBg, border: previewBorder }}>
                        <div className="flex justify-between items-center mb-4 md:mb-8 pr-8 md:pr-0">
                            <h3 className="text-[#1A73E8] text-xs font-bold uppercase tracking-wider">LIVE FORMULA PREVIEW</h3>
                        </div>
                        <ArrowLeft className="absolute top-4 right-4 md:top-6 md:right-6 h-5 w-5" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "#cbd5e1" }} />
                        <div className="text-xs sm:text-base md:text-xl flex justify-start md:justify-center py-3 md:py-8 mb-2 md:mb-8 w-full overflow-x-auto px-2 md:px-0" style={{ color: titleColor }}>
                            <BlockMath
                                math={`\\begin{align*}
                                    Q_t &= 7.0 \\times A \\times \\sqrt{h \\times (t_i - t_o)} \\quad [\\text{m}^3/\\text{min}] \\\\
                                    Q_t &= 7.0 \\times ${A_inlet || 0} \\times \\sqrt{${h || 0} \\times (${t_i || 0} - ${t_o || 0})} \\\\
                                    Q_t &= ${(!A_inlet || !h || (t_i - t_o) <= 0) ? '\\text{---}' : '\\mathbf{' + (7.0 * A_inlet * Math.sqrt(Math.max(0, h * (t_i - t_o)))).toFixed(2) + '}'} \\; \\text{m}^3/\\text{min} \\\\[1em]
                                    
                                    Q_w &= \\frac{K \\times A_{smaller} \\times V}{60} \\quad [\\text{m}^3/\\text{min}] \\\\
                                    Q_w &= \\frac{${K || 0.6} \\times ${A_smaller || 0} \\times ${V || 0}}{60} \\\\
                                    Q_w &= ${(!A_smaller || !V) ? '\\text{---}' : '\\mathbf{' + ((K * A_smaller * V) / 60).toFixed(2) + '}'} \\; \\text{m}^3/\\text{min} \\\\[1em]
                                    
                                    Q_{combined} &= \\sqrt{Q_w^2 + Q_t^2} \\\\
                                    Q_{combined} &= ${((!A_inlet || !h || (t_i - t_o) <= 0) && (!A_smaller || !V)) ? '\\text{---}' : '\\mathbf{' + Math.sqrt(Math.pow((K * A_smaller * V) / 60, 2) + Math.pow(7.0 * A_inlet * Math.sqrt(Math.max(0, h * (t_i - t_o))), 2)).toFixed(2) + '}'} \\; \\text{m}^3/\\text{min}
                                \\end{align*}`}
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <ResultCard label="Combined Flow (Q)" value={result ? result.Q_combined.toFixed(2) : "---"} unit="m³/min" />

                    {result && (
                        <div className="rounded-2xl p-6 space-y-4" style={{ background: cardBg, border: cardBorder }}>
                            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: subtitleColor }}>Components</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs" style={{ color: labelColor }}>Thermal Flow</p>
                                    <p className="text-xl font-bold" style={{ color: titleColor }}>{result.Qt.toFixed(2)} <span className="text-sm font-normal" style={{ color: subtitleColor }}>m³/min</span></p>
                                </div>
                                <div className="w-full h-px" style={{ background: dividerColor }} />
                                <div>
                                    <p className="text-xs" style={{ color: labelColor }}>Wind Flow</p>
                                    <p className="text-xl font-bold" style={{ color: titleColor }}>{result.Qw.toFixed(2)} <span className="text-sm font-normal" style={{ color: subtitleColor }}>m³/min</span></p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}