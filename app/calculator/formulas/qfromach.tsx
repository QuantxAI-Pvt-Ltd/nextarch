"use client";

import { useState } from "react";
import { MetricCard, ResultCard } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { useTheme } from "../theme-context";
import EpwViewer from "../epw-viewer";

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

    // ── Input handler ─────────────────────────────────────────────────────────
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const parsed = parseFloat(value);
        setValues((prev) => ({ ...prev, [name]: isNaN(parsed) ? 0 : Math.abs(parsed) }));
    };

    const { ACH, V, rho, Cp, delta_T, t_i } = values;

    // ── API calculate ─────────────────────────────────────────────────────────
    const handleCalculate = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/q-from-ach`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ACH, V, rho, Cp, delta_T }),
            });
            if (!response.ok) throw new Error("API request failed");
            const data = await response.json();
            setResult(data);
        } catch {
            alert("Unable to complete calculation. Please verify your inputs and backend connection.");
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

                    {/* ── Interactive EPW Weather Viewer ──────────────────────── */}
                    <EpwViewer
                        onSelectHour={(data) => {
                            const t_o = data.temperature;
                            const newDeltaT = parseFloat(Math.abs(t_i - t_o).toFixed(2));
                            setValues(prev => ({ ...prev, delta_T: newDeltaT }));
                        }}
                    />

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