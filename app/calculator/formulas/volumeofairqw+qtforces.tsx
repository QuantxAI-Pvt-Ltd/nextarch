"use client";

import { useState } from "react";
import { MetricCard, ResultCard, ValidationAlert } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, AlertCircle } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { useTheme } from "../theme-context";
import EpwViewer from "../epw-viewer";

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
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [errorList, setErrorList] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const parsed = parseFloat(value);
        setErrors(prev => ({ ...prev, [name]: false }));
        if (errorList.length > 0) setErrorList([]);
        setValues(prev => ({ ...prev, [name]: isNaN(parsed) ? 0 : Math.abs(parsed) }));
    };

    const { A_inlet, h, t_i, t_o, A_smaller, V, K } = values;

    const handleCalculate = async () => {
        const newErrors: Record<string, boolean> = {};
        const missing: string[] = [];

        const hasThermalInput = A_inlet > 0 || h > 0;
        const hasWindInput = A_smaller > 0 || V > 0;

        if (!hasThermalInput && !hasWindInput) {
            newErrors.A_inlet = true;
            newErrors.h = true;
            newErrors.A_smaller = true;
            newErrors.V = true;
            missing.push("Thermal Flow (Inlet Area & Height Diff) or Wind Flow (Smaller Area & Wind Speed)");
        } else {
            if (hasThermalInput) {
                if (!A_inlet || A_inlet <= 0) {
                    newErrors.A_inlet = true;
                    missing.push("Inlet Area (A)");
                }
                if (!h || h <= 0) {
                    newErrors.h = true;
                    missing.push("Height Diff (h)");
                }
            }
            if (hasWindInput) {
                if (!A_smaller || A_smaller <= 0) {
                    newErrors.A_smaller = true;
                    missing.push("Smaller Area (As)");
                }
                if (!V || V <= 0) {
                    newErrors.V = true;
                    missing.push("Wind Speed (V)");
                }
            }
        }

        if (missing.length > 0) {
            setErrors(newErrors);
            setErrorList(missing);
            return;
        }

        setErrors({});
        setErrorList([]);
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/volume-air-forces`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ A_inlet, h, t_i, t_o, A_smaller, V, K }),
            });
            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();
            setResult(data);
        } catch {
            alert('Unable to complete calculation. Please verify your inputs and backend connection.');
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
                        <MetricCard label="Inlet Area (A)" value={A_inlet} unit="m²" name="A_inlet" onChange={handleChange} error={errors.A_inlet} />
                        <MetricCard label="Height Diff (h)" value={h} unit="m" name="h" onChange={handleChange} error={errors.h} />
                        <MetricCard label="Indoor Temp (ti)" value={t_i} unit="°C" name="t_i" onChange={handleChange} />
                        <MetricCard label="Smaller Area (As)" value={A_smaller} unit="m²" name="A_smaller" onChange={handleChange} error={errors.A_smaller} />
                        <MetricCard label="Eff. Coeff (K)" value={K} unit="" name="K" step={0.1} onChange={handleChange} />
                        <MetricCard label="Outdoor Temp (to)" value={t_o} unit="°C" name="t_o" onChange={handleChange} />
                        <MetricCard label="Wind Speed (V)" value={V} unit="m/h" name="V" onChange={handleChange} error={errors.V} />
                    </div>

                    {/* Interactive EPW Weather Viewer */}
                    <EpwViewer
                        onSelectHour={(data) => {
                            setErrors(prev => ({ ...prev, V: false }));
                            if (errorList.length > 0) setErrorList([]);
                            setValues(prev => ({
                                ...prev,
                                t_o: data.temperature,
                                V: data.wind_speed_mh,
                            }));
                        }}
                    />

                    {/* Validation Alert */}
                    <ValidationAlert errors={errorList} onDismiss={() => setErrorList([])} />

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
                                    <p className="text-xs" style={{ color: labelColor }}>Thermal Flow (Qt)</p>
                                    <p className="text-xl font-bold" style={{ color: titleColor }}>
                                        {result.Qt.toFixed(2)} <span className="text-sm font-normal" style={{ color: subtitleColor }}>m³/min</span>
                                    </p>
                                </div>
                                <div className="w-full h-px" style={{ background: dividerColor }} />
                                <div>
                                    <p className="text-xs" style={{ color: labelColor }}>Wind Flow (Qw)</p>
                                    <p className="text-xl font-bold" style={{ color: titleColor }}>
                                        {result.Qw.toFixed(2)} <span className="text-sm font-normal" style={{ color: subtitleColor }}>m³/min</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contextual Notice when Thermal Flow is 0 */}
                    {((result && result.Qt === 0) || (A_inlet > 0 && h > 0 && t_i <= t_o)) && (
                        <div
                            className="rounded-2xl p-4 flex items-start gap-3 border transition-all"
                            style={{
                                background: isDark ? "rgba(245, 158, 11, 0.08)" : "#fffbeb",
                                borderColor: isDark ? "rgba(245, 158, 11, 0.25)" : "#fde68a",
                            }}
                        >
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-wider text-amber-500">
                                    Thermal Flow (Qt) is 0
                                </p>
                                <p className="text-xs leading-relaxed" style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                                    {t_i <= t_o ? (
                                        <>
                                            Indoor temp ({t_i}°C) ≤ Outdoor temp ({t_o}°C). Thermal buoyancy requires <span className="font-semibold text-amber-500">ti &gt; to</span> to generate upward stack flow. Total ventilation is driven entirely by Wind Flow (Qw).
                                        </>
                                    ) : (
                                        <>
                                            Opening area (A) or height difference (h) is 0. Both parameters must be greater than zero for stack ventilation.
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Explanatory Card: Thermal Flow & Night Flushing Insights */}
                    <div
                        className="rounded-2xl p-6 space-y-4"
                        style={{ background: cardBg, border: cardBorder }}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="bg-[#1A73E8]/10 p-2 rounded-xl text-[#1A73E8]">
                                <Info className="w-4 h-4" />
                            </div>
                            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: subtitleColor }}>
                                Thermal Flow & Night Flushing
                            </h4>
                        </div>

                        <div className="space-y-3.5 text-xs leading-relaxed" style={{ color: subtitleColor }}>
                            <div>
                                <p className="font-semibold text-sm mb-1" style={{ color: titleColor }}>
                                    Why is Thermal Flow 0?
                                </p>
                                <p>
                                    Thermal ventilation is driven by <strong className="text-[#1A73E8]"><a href="https://en.wikipedia.org/wiki/Stack_effect">stack effect</a></strong> (stack effect). Warm indoor air is lighter than cool outdoor air and rises through upper openings. If outdoor air is warmer than or equal to indoor air (<span className="font-mono font-semibold">ti ≤ to</span>), buoyant upward flow stops and <span className="font-mono">Qt = 0</span>.
                                </p>
                            </div>

                            <div className="w-full h-px" style={{ background: dividerColor }} />

                            <div>
                                <p className="font-semibold text-sm mb-1" style={{ color: titleColor }}>
                                    Night Flushing Behavior
                                </p>
                                <p>
                                    In night flushing strategies, outdoor air cools the building thermal mass. Once indoor temperatures drop equal to or below outdoor night air (<span className="font-mono font-semibold">ti ≤ to</span>), the stack effect no longer contributes. The building then relies entirely on <strong className="text-[#1A73E8]"><a href="https://en.wikipedia.org/wiki/Cross_ventilation">wind-driven cross-ventilation (Qw)</a></strong>.
                                </p>
                            </div>

                            <div className="w-full h-px" style={{ background: dividerColor }} />

                            <div>
                                <p className="font-semibold text-sm mb-1" style={{ color: titleColor }}>
                                    Formula Guard
                                </p>
                                <div className="p-2.5 rounded-xl font-mono text-[11px] my-1" style={{ background: previewBg, border: previewBorder, color: titleColor }}>
                                    Qt = 7.0 × A × √(max(0, h × (ti - to)))
                                </div>
                                <p className="text-[11px] mt-1">
                                    When (ti - to) ≤ 0, the term is clamped to 0 to prevent imaginary roots.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}