"use client";

import { useState } from "react";
import { MetricCard, ResultCard } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { Upload, Wind, Info, ArrowLeft } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { Label } from "@/components/ui/label";
import { useTheme } from "../theme-context";

interface ResultData {
    Qt: number;
    Qw: number;
    Q_combined: number;
}

export default function Voaqwqtforce() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [values, setValues] = useState({
        A_inlet: 0, h: 0, t_i: 0, t_o: 0, A_smaller: 0, V: 0, K: 0.6,
    });
    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    const [epwUploaded, setEpwUploaded] = useState(false);
    const [epwYears, setEpwYears] = useState<number[]>([]);
    const [selectedDate, setSelectedDate] = useState({ year: 2024, month: 1, day: 1, hour: 12 });
    const [epwData, setEpwData] = useState<Record<string, string[]>>({});
    const [epwMessage, setEpwMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const { A_inlet, h, t_i, t_o, A_smaller, V, K } = values;

    const handleEpwUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        setEpwMessage("Uploading...");
        setEpwUploaded(false);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-epw`, { method: 'POST', body: formData });
            const data = await response.json();
            if (data.success) {
                setEpwUploaded(true);
                setEpwYears(data.years || []);
                setEpwData(data.year_month_data || {});
                setSelectedDate(prev => ({ ...prev, year: data.years[0] || 2024 }));
                setEpwMessage(`EPW file uploaded! ${data.total_records} records found.`);
            } else {
                setEpwMessage(data.message || 'Failed to upload EPW file');
            }
        } catch (error) {
            console.error('Error uploading EPW file:', error);
            setEpwMessage('Error uploading EPW file. Please ensure the API is running.');
        }
    };

    const handleFetchEpwData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/query-epw', {
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

    const formatHour = (h: number) => {
        if (h === 24) return "12 AM (Midnight)";
        if (h === 12) return "12 PM (Noon)";
        if (h > 12) return `${h - 12} PM`;
        return `${h} AM`;
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
            alert('Error calculating. Please ensure the API is running on http://localhost:8000');
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
    const stepBg = isDark ? "#131B2C" : "#f1f5f9";
    const stepBorder = isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0";
    const dividerColor = isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0";
    const selectBg = isDark ? "#0B1121" : "#f8fafc";
    const uploadBorderColor = isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0";
    const uploadTextColor = isDark ? "#d1d5db" : "#475569";

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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#1A73E8]/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div
                                    className="relative border-2 border-dashed rounded-xl p-6 text-center transition-colors group-hover:border-[#1A73E8]/50"
                                    style={{ borderColor: uploadBorderColor }}
                                >
                                    <input
                                        type="file"
                                        accept=".epw"
                                        onChange={handleEpwUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Upload className="mx-auto h-8 w-8 mb-2 group-hover:text-[#1A73E8] transition-colors" style={{ color: labelColor }} />
                                    <p className="text-sm font-medium" style={{ color: uploadTextColor }}>Click to upload .epw file</p>
                                    <p className="text-xs mt-1" style={{ color: labelColor }}>Maximum file size 200MB</p>
                                </div>
                            </div>

                            {epwUploaded && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[
                                            { label: "Day", key: "day", options: Array.from({ length: 31 }, (_, i) => i + 1) },
                                            { label: "Month", key: "month", options: Array.from({ length: 12 }, (_, i) => i + 1) },
                                        ].map(({ label, key, options }) => (
                                            <div key={key} className="space-y-1">
                                                <Label className="text-xs" style={{ color: labelColor }}>{label}</Label>
                                                <select
                                                    className="w-full rounded-lg text-sm px-3 py-2 outline-none"
                                                    style={{ background: selectBg, border: cardBorder, color: titleColor }}
                                                    value={selectedDate[key as keyof typeof selectedDate]}
                                                    onChange={(e) => setSelectedDate(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                                                >
                                                    {options.map(v => <option key={v} value={v}>{v}</option>)}
                                                </select>
                                            </div>
                                        ))}
                                        <div className="space-y-1">
                                            <Label className="text-xs" style={{ color: labelColor }}>Year</Label>
                                            <select
                                                className="w-full rounded-lg text-sm px-3 py-2 outline-none"
                                                style={{ background: selectBg, border: cardBorder, color: titleColor }}
                                                value={selectedDate.year}
                                                onChange={(e) => setSelectedDate(prev => ({ ...prev, year: Number(e.target.value) }))}
                                            >
                                                {epwYears.map(year => <option key={year} value={year}>{year}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs" style={{ color: labelColor }}>Hour</Label>
                                            <select
                                                className="w-full rounded-lg text-sm px-3 py-2 outline-none"
                                                style={{ background: selectBg, border: cardBorder, color: titleColor }}
                                                value={selectedDate.hour}
                                                onChange={(e) => setSelectedDate(prev => ({ ...prev, hour: Number(e.target.value) }))}
                                            >
                                                {Array.from({ length: 24 }, (_, i) => i + 1).map(hv => <option key={hv} value={hv}>{formatHour(hv)}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <Button onClick={handleFetchEpwData} className="w-full bg-[#1A73E8]/10 hover:bg-[#1A73E8]/20 text-[#1A73E8] border border-[#1A73E8]/20">
                                        Apply Weather Data to Inputs
                                    </Button>

                                    {epwMessage && (
                                        <div className="flex gap-2 items-center text-xs p-3 rounded-lg" style={{ background: selectBg, border: cardBorder, color: subtitleColor }}>
                                            <Info className="h-4 w-4 text-[#1A73E8]" />
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
                    <div className="rounded-2xl p-6 relative" style={{ background: previewBg, border: previewBorder }}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[#1A73E8] text-xs font-bold uppercase tracking-wider">LIVE FORMULA PREVIEW</h3>
                            <ArrowLeft className="h-5 w-5" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "#cbd5e1" }} />
                        </div>
                        <div className="text-xl flex justify-center py-8 mb-8 w-full overflow-x-auto" style={{ color: titleColor }}>
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