"use client";

import { useState, useMemo } from "react";
import { MetricCard, ResultCard } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Wind, Info, Loader2 } from "lucide-react";
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
    Q: number;
}

export default function Qfromach() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [values, setValues] = useState({
        ACH: 0,
        V: 0,
        rho: 1.2,
        Cp: 1005.0,
        delta_T: 0,
        t_i: 25,
    });
    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    // ── EPW state ─────────────────────────────────────────────────────────────
    const [epwUploaded, setEpwUploaded] = useState(false);
    const [epwYears, setEpwYears] = useState<number[]>([]);
    const [selectedDate, setSelectedDate] = useState({ year: 2024, month: 1, day: 1, hour: 12 });
    const [availableData, setAvailableData] = useState<AvailableData>({});
    const [epwMessage, setEpwMessage] = useState("");
    const [epwLoading, setEpwLoading] = useState(false);

    // ── Derived option lists (cascade year → month → day → hour) ─────────────
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

    // ── Cascading date change handlers ────────────────────────────────────────
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

    // ── Input handler ─────────────────────────────────────────────────────────
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const parsed = parseFloat(value);
        setValues((prev) => ({ ...prev, [name]: isNaN(parsed) ? 0 : Math.abs(parsed) }));
    };

    const { ACH, V, rho, Cp, delta_T, t_i } = values;

    // ── EPW upload ────────────────────────────────────────────────────────────
    const handleEpwUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        setEpwMessage("Processing EPW file...");
        setEpwUploaded(false);
        setEpwLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-epw`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                setEpwUploaded(true);
                setEpwYears(data.years || []);
                setAvailableData(data.available_data || {});

                // Auto-select first valid year → month → day → hour
                const firstYear: number = data.years?.[0] ?? 2024;
                const ad: AvailableData = data.available_data || {};
                const yrData = ad[String(firstYear)] ?? {};
                const firstMonth = Math.min(...Object.keys(yrData).map(Number)) || 1;
                const moData = yrData[String(firstMonth)];
                const firstDay = moData?.days[0] ?? 1;
                const firstHour = moData?.hours_by_day[String(firstDay)]?.[0] ?? 1;
                setSelectedDate({ year: firstYear, month: firstMonth, day: firstDay, hour: firstHour });

                setEpwMessage(`EPW file uploaded! ${data.total_records} records found.`);
            } else {
                setEpwMessage(data.message || "Failed to upload EPW file.");
            }
        } catch (error) {
            console.error("Error uploading EPW file:", error);
            setEpwMessage("Error uploading EPW file. Please ensure the API is running.");
        } finally {
            setEpwLoading(false);
        }
    };

    // ── EPW query → auto-fill t_o and recompute delta_T ──────────────────────
    const handleFetchEpwData = async () => {
        setEpwLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/query-epw`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedDate),
            });
            const data = await response.json();
            if (data.success) {
                const t_o = data.temperature;
                const newDeltaT = parseFloat(Math.abs(t_i - t_o).toFixed(2));
                setValues(prev => ({ ...prev, delta_T: newDeltaT }));
                setEpwMessage(
                    `Data fetched: Outdoor temp = ${t_o}°C, ΔT = ${newDeltaT} K (Indoor ${t_i}°C − Outdoor ${t_o}°C)`
                );
            } else {
                setEpwMessage(data.message || "No data found for selected date/time.");
            }
        } catch (error) {
            console.error("Error querying EPW data:", error);
            setEpwMessage("Error fetching EPW data.");
        } finally {
            setEpwLoading(false);
        }
    };

    const formatHour = (h: number) => {
        if (h === 24) return "12 AM (Midnight)";
        if (h === 12) return "12 PM (Noon)";
        if (h > 12) return `${h - 12} PM`;
        return `${h} AM`;
    };

    // ── API calculate ─────────────────────────────────────────────────────────
    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/q-from-ach`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ACH, V, rho, Cp, delta_T }),
            });
            if (!response.ok) throw new Error("API request failed");
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Error calculating:", error);
            alert("Error calculating...");
        } finally {
            setLoading(false);
        }
    };

    // ── Theme tokens ──────────────────────────────────────────────────────────
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: titleColor }}>Q from ACH (Heat Load)</h1>
                    <p className="max-w-2xl" style={{ color: subtitleColor }}>
                        Calculates the amount of heat energy supplied to or removed from a space based on air changes.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                <div className="lg:col-span-8 space-y-6">
                    {/* Input cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <MetricCard label="Air Changes (ACH)" value={ACH} unit="h⁻¹" name="ACH" onChange={handleChange} />
                        <MetricCard label="Room Volume (V)" value={V} unit="m³" name="V" onChange={handleChange} />
                        <MetricCard label="Air Density (ρ)" value={rho} unit="kg/m³" name="rho" step={0.01} onChange={handleChange} />
                        <MetricCard label="Specific Heat (Cp)" value={Cp} unit="J/kg·K" name="Cp" onChange={handleChange} />
                        <MetricCard label="Indoor Temp (ti)" value={t_i} unit="°C" name="t_i" onChange={handleChange} />
                        <MetricCard label="Temp. Diff (ΔT)" value={delta_T} unit="K" name="delta_T" onChange={handleChange} />
                    </div>

                    {/* ── EPW Weather Data Card ─────────────────────────────────── */}
                    <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: cardBg, border: cardBorder }}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#1A73E8]/10 p-2 rounded-lg">
                                <Wind className="text-[#1A73E8] h-5 w-5" />
                            </div>
                            <h4 className="font-medium" style={{ color: titleColor }}>Auto-fill Outdoor Temp from Weather Data (EPW)</h4>
                        </div>

                        <div className="space-y-4">
                            {/* Upload zone */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#1A73E8]/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div
                                    className="relative border-2 border-dashed rounded-xl p-6 text-center transition-colors group-hover:border-[#1A73E8]/50"
                                    style={{ borderColor: uploadBorderColor }}
                                >
                                    {!epwLoading && (
                                        <input
                                            type="file"
                                            accept=".epw"
                                            onChange={handleEpwUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    )}
                                    {epwLoading ? (
                                        <>
                                            <Loader2 className="animate-spin mx-auto h-8 w-8 mb-2 text-[#1A73E8]" />
                                            <p className="text-sm font-medium" style={{ color: uploadTextColor }}>Processing EPW file...</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mx-auto h-8 w-8 mb-2 group-hover:text-[#1A73E8] transition-colors" style={{ color: labelColor }} />
                                            <p className="text-sm font-medium" style={{ color: uploadTextColor }}>Click to upload .epw file</p>
                                            <p className="text-xs mt-1" style={{ color: labelColor }}>Maximum file size 200MB</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Date selectors — shown after upload */}
                            {epwUploaded && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {/* Year */}
                                        <div className="space-y-1">
                                            <Label className="text-xs" style={{ color: labelColor }}>Year</Label>
                                            <div className="relative">
                                                <select
                                                    className="w-full rounded-lg text-sm px-3 py-2 outline-none appearance-none pr-8"
                                                    style={{ background: selectBg, border: cardBorder, color: titleColor }}
                                                    value={selectedDate.year}
                                                    onChange={(e) => handleYearChange(Number(e.target.value))}
                                                >
                                                    {epwYears.map(year => (
                                                        <option key={year} value={year} style={{ background: selectBg, color: titleColor }}>{year}</option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: labelColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Month */}
                                        <div className="space-y-1">
                                            <Label className="text-xs" style={{ color: labelColor }}>Month</Label>
                                            <div className="relative">
                                                <select
                                                    className="w-full rounded-lg text-sm px-3 py-2 outline-none appearance-none pr-8"
                                                    style={{ background: selectBg, border: cardBorder, color: titleColor }}
                                                    value={selectedDate.month}
                                                    onChange={(e) => handleMonthChange(Number(e.target.value))}
                                                >
                                                    {availableMonths.map(m => (
                                                        <option key={m} value={m} style={{ background: selectBg, color: titleColor }}>{MONTH_NAMES[m - 1]}</option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: labelColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Day */}
                                        <div className="space-y-1">
                                            <Label className="text-xs" style={{ color: labelColor }}>Day</Label>
                                            <div className="relative">
                                                <select
                                                    className="w-full rounded-lg text-sm px-3 py-2 outline-none appearance-none pr-8"
                                                    style={{ background: selectBg, border: cardBorder, color: titleColor }}
                                                    value={selectedDate.day}
                                                    onChange={(e) => handleDayChange(Number(e.target.value))}
                                                >
                                                    {availableDays.map(d => (
                                                        <option key={d} value={d} style={{ background: selectBg, color: titleColor }}>{d}</option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: labelColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Hour */}
                                        <div className="space-y-1">
                                            <Label className="text-xs" style={{ color: labelColor }}>Time</Label>
                                            <div className="relative">
                                                <select
                                                    className="w-full rounded-lg text-sm px-3 py-2 outline-none appearance-none pr-8"
                                                    style={{ background: selectBg, border: cardBorder, color: titleColor }}
                                                    value={selectedDate.hour}
                                                    onChange={(e) => setSelectedDate(prev => ({ ...prev, hour: Number(e.target.value) }))}
                                                >
                                                    {availableHours.map(hv => (
                                                        <option key={hv} value={hv} style={{ background: selectBg, color: titleColor }}>{formatHour(hv)}</option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: labelColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleFetchEpwData}
                                        disabled={epwLoading}
                                        className="w-full bg-[#1A73E8]/10 hover:bg-[#1A73E8]/20 text-[#1A73E8] border border-[#1A73E8]/20"
                                    >
                                        {epwLoading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Fetching weather data...
                                            </span>
                                        ) : (
                                            "Apply Outdoor Temp & Compute ΔT"
                                        )}
                                    </Button>

                                    {epwMessage && (
                                        <div className="flex gap-2 items-start text-xs p-3 rounded-lg" style={{ background: selectBg, border: cardBorder, color: subtitleColor }}>
                                            <Info className="h-4 w-4 text-[#1A73E8] shrink-0 mt-0.5" />
                                            <span>{epwMessage}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Show message even before upload (e.g. upload error) */}
                            {!epwUploaded && epwMessage && !epwLoading && (
                                <div className="flex gap-2 items-start text-xs p-3 rounded-lg" style={{ background: selectBg, border: cardBorder, color: subtitleColor }}>
                                    <Info className="h-4 w-4 text-[#1A73E8] shrink-0 mt-0.5" />
                                    <span>{epwMessage}</span>
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
                            {loading ? "Calculating..." : "Calculate Heat Load"}
                        </Button>
                    </div>

                    {/* Live Formula Preview */}
                    <div className="rounded-2xl p-4 md:p-6 relative w-full overflow-hidden" style={{ background: previewBg, border: previewBorder }}>
                        <div className="flex justify-between items-center mb-4 md:mb-8 pr-8 md:pr-0">
                            <h3 className="text-[#1A73E8] text-xs font-bold uppercase tracking-wider">LIVE FORMULA PREVIEW</h3>
                        </div>
                        <ArrowLeft className="absolute top-4 right-4 md:top-6 md:right-6 h-5 w-5" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "#cbd5e1" }} />
                        <div className="text-xs sm:text-base md:text-xl flex justify-start md:justify-center py-3 md:py-8 mb-2 md:mb-8 w-full overflow-x-auto px-2 md:px-0" style={{ color: titleColor }}>
                            <BlockMath math={`\\begin{align*}
                                Q &= \\frac{ACH \\times V \\times \\rho \\times C_p \\times \\Delta T}{3600} \\\\[6pt]
                                Q &= \\frac{${ACH || 0} \\times ${V || 0} \\times ${rho || 1.2} \\times ${Cp || 1005} \\times ${delta_T || 0}}{3600} \\\\[6pt]
                                Q &= ${((ACH || 0) * (V || 0) * (delta_T || 0)) === 0 ? '\\text{---}' : '\\mathbf{' + ((ACH * V * rho * Cp * delta_T) / 3600).toFixed(2) + '}'} \\; \\text{W}
                            \\end{align*}`} />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <ResultCard label="Heat Load (Q)" value={result ? result.Q.toFixed(0) : "---"} unit="W" />

                    {result && (
                        <div className="rounded-2xl p-6 space-y-4" style={{ background: cardBg, border: cardBorder }}>
                            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: subtitleColor }}>Key Parameters</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs" style={{ color: labelColor }}>Air Exchange</p>
                                    <p className="text-xl font-bold" style={{ color: titleColor }}>
                                        {ACH} <span className="text-sm font-normal" style={{ color: subtitleColor }}>ACH</span>
                                    </p>
                                </div>
                                <div className="w-full h-px" style={{ background: dividerColor }} />
                                <div>
                                    <p className="text-xs" style={{ color: labelColor }}>Room Volume</p>
                                    <p className="text-xl font-bold" style={{ color: titleColor }}>
                                        {V} <span className="text-sm font-normal" style={{ color: subtitleColor }}>m³</span>
                                    </p>
                                </div>
                                <div className="w-full h-px" style={{ background: dividerColor }} />
                                <div>
                                    <p className="text-xs" style={{ color: labelColor }}>Indoor Temp</p>
                                    <p className="text-xl font-bold" style={{ color: titleColor }}>
                                        {t_i} <span className="text-sm font-normal" style={{ color: subtitleColor }}>°C</span>
                                    </p>
                                </div>
                                <div className="w-full h-px" style={{ background: dividerColor }} />
                                <div>
                                    <p className="text-xs" style={{ color: labelColor }}>Temp Difference</p>
                                    <p className="text-xl font-bold" style={{ color: titleColor }}>
                                        {delta_T} <span className="text-sm font-normal" style={{ color: subtitleColor }}>K</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}