"use client";

import { useState } from "react";
import { MetricCard, ResultCard } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { Label } from "@/components/ui/label";
import { useTheme } from "../theme-context";

interface ResultData {
    Q: number;
    A?: number;
    Ai: number;
    Ao: number;
}

export default function Windowcalculations() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [equalOpenings, setEqualOpenings] = useState(true);
    const [calcInlet, setCalcInlet] = useState(true);
    const [values, setValues] = useState({
        V_room: 0, n_ach: 0, K: 0.6, V: 0, A_effective: 2.0,
    });
    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: Number(value) }));
    };

    const { V_room, n_ach, K, V, A_effective } = values;
    const calculatedQ = V_room * n_ach;

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/window-calculations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    V_room, n_ach, K, V,
                    equal_opening: equalOpenings,
                    A_effective: equalOpenings ? null : A_effective,
                    calc_inlet: equalOpenings ? null : calcInlet,
                }),
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
    const stepBg = isDark ? "#131B2C" : "#f1f5f9";
    const stepBorder = isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0";
    const dividerColor = isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0";

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: titleColor }}>Window Calculations</h1>
                    <p className="max-w-2xl" style={{ color: subtitleColor }}>
                        Calculates opening area for ventilation derived from Room Volume and Air Changes per Hour.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MetricCard label="Room Volume (V)" value={V_room} unit="m³" name="V_room" onChange={handleChange} />
                        <MetricCard label="Air Changes per Hour (n)" value={n_ach} unit="ACH" name="n_ach" onChange={handleChange} />
                    </div>

                    {/* Derived Q display */}
                    <div className="rounded-2xl p-4 flex items-center gap-4" style={{
                        background: cardBg,
                        border: isDark ? "1px solid rgba(26,115,232,0.2)" : "1px solid #bfdbfe",
                    }}>
                        <div className="bg-[#1A73E8]/10 p-2 rounded-lg shrink-0">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: labelColor }}>Calculated Airflow Rate (Q = n × V)</p>
                            <p className="text-xl font-bold text-[#1A73E8]">{calculatedQ.toFixed(2)} <span className="text-sm font-normal" style={{ color: labelColor }}>m³/h</span></p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MetricCard label="Flow Coefficient (K)" value={K} unit="" name="K" step={0.05} onChange={handleChange} />
                        <MetricCard label="Wind Speed (V)" value={V} unit="m/h" name="V" onChange={handleChange} />
                    </div>

                    {/* Equal Openings toggle */}
                    <div className="rounded-2xl p-5 flex items-center justify-between" style={{ background: cardBg, border: cardBorder }}>
                        <div>
                            <p className="text-sm font-medium" style={{ color: titleColor }}>Equal Openings</p>
                            <p className="text-xs mt-0.5" style={{ color: labelColor }}>Inlet = Outlet area (simplified calculation)</p>
                        </div>
                        <button
                            onClick={() => setEqualOpenings(!equalOpenings)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${equalOpenings ? 'bg-[#1A73E8]' : ''}`}
                            style={!equalOpenings ? { background: isDark ? "#374151" : "#cbd5e1" } : {}}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${equalOpenings ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {!equalOpenings && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <MetricCard label="Effective Area (A_effective)" value={A_effective} unit="m²" name="A_effective" step={0.1} onChange={handleChange} />
                            <div className="rounded-2xl p-5" style={{ background: cardBg, border: cardBorder }}>
                                <Label className="text-xs uppercase tracking-wider font-bold mb-3 block" style={{ color: subtitleColor }}>Calculate For:</Label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setCalcInlet(true)}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors border ${calcInlet ? 'bg-[#1A73E8] border-[#1A73E8] text-white' : ''}`}
                                        style={!calcInlet ? { background: "transparent", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0", color: labelColor } : {}}
                                    >
                                        Inlet
                                    </button>
                                    <button
                                        onClick={() => setCalcInlet(false)}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors border ${!calcInlet ? 'bg-[#1A73E8] border-[#1A73E8] text-white' : ''}`}
                                        style={calcInlet ? { background: "transparent", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0", color: labelColor } : {}}
                                    >
                                        Outlet
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button
                            onClick={handleCalculate}
                            disabled={loading}
                            className="bg-[#1A73E8] hover:bg-[#1557B0] text-white px-8 py-6 rounded-xl font-semibold text-lg"
                        >
                            {loading ? 'Calculating...' : 'Calculate Parameters'}
                        </Button>
                    </div>

                    {/* Live Formula Preview */}
                    <div className="rounded-2xl p-6 relative" style={{ background: previewBg, border: previewBorder }}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[#1A73E8] text-xs font-bold uppercase tracking-wider">LIVE FORMULA PREVIEW</h3>
                            <ArrowLeft className="h-5 w-5" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "#cbd5e1" }} />
                        </div>
                        <div className="text-xl flex justify-center py-8 mb-8 w-full overflow-x-auto" style={{ color: titleColor }}>
                            {equalOpenings ? (
                                <BlockMath math={`\\begin{align*}
                                    Q &= V_{room} \\times n_{ach} \\\\
                                    Q &= ${V_room || 0} \\times ${n_ach || 0} = ${(!V_room || !n_ach) ? '0.00' : '\\mathbf{' + calculatedQ.toFixed(2) + '}'} \\; \\text{m}^3/\\text{h} \\\\[1em]
                                    A &= \\frac{Q}{K \\times V} \\quad \\text{(equal openings)} \\\\
                                    A &= \\frac{${(!V_room || !n_ach) ? '0.00' : calculatedQ.toFixed(2)}}{${K || 0.6} \\times ${V || 0}} = ${(!V || !calculatedQ) ? '\\text{---}' : '\\mathbf{' + (calculatedQ / (K * V)).toFixed(3) + '}'} \\; \\text{m}^2 \\\\
                                    \\Rightarrow \\text{Inlet} &= \\text{Outlet} = ${(!V || !calculatedQ) ? '\\text{---}' : '\\mathbf{' + (calculatedQ / (K * V)).toFixed(3) + '}'} \\; \\text{m}^2
                                \\end{align*}`} />
                            ) : (
                                <BlockMath math={`\\begin{align*}
                                    \\frac{1}{A_{eff}^2} &= \\frac{1}{A_i^2} + \\frac{1}{A_o^2} \\\\[6pt] 
                                    A_i &= \\text{Inlet}, \\quad A_o = \\text{Outlet} \\\\
                                    A_{eff} &= ${A_effective > 0 ? '\\mathbf{' + A_effective.toFixed(3) + '}' : '\\text{---}'} \\; \\text{m}^2
                                \\end{align*}`} />
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <ResultCard label="Airflow Rate (Q)" value={result ? result.Q.toFixed(2) : "---"} unit="m³/h" />

                    {result && (
                        <div className="rounded-2xl p-6 space-y-4" style={{ background: cardBg, border: cardBorder }}>
                            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: subtitleColor }}>Detailed Breakdown</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs" style={{ color: labelColor }}>Airflow Rate (Q)</p>
                                    <p className="text-xl font-bold" style={{ color: titleColor }}>{result.Q.toFixed(2)} <span className="text-sm font-normal" style={{ color: subtitleColor }}>m³/h</span></p>
                                </div>
                                {result.A !== undefined && result.A !== null && (
                                    <>
                                        <div className="w-full h-px" style={{ background: dividerColor }} />
                                        <div>
                                            <p className="text-xs" style={{ color: labelColor }}>Opening Area (A)</p>
                                            <p className="text-xl font-bold" style={{ color: titleColor }}>{result.A.toFixed(3)} <span className="text-sm font-normal" style={{ color: subtitleColor }}>m²</span></p>
                                        </div>
                                    </>
                                )}
                                <div className="w-full h-px" style={{ background: dividerColor }} />
                                <div>
                                    <p className="text-xs" style={{ color: labelColor }}>Inlet Area (Aᵢ)</p>
                                    <p className="text-xl font-bold" style={{ color: titleColor }}>{result.Ai.toFixed(3)} <span className="text-sm font-normal" style={{ color: subtitleColor }}>m²</span></p>
                                </div>
                                <div className="w-full h-px" style={{ background: dividerColor }} />
                                <div>
                                    <p className="text-xs" style={{ color: labelColor }}>Outlet Area (Aₒ)</p>
                                    <p className="text-xl font-bold" style={{ color: titleColor }}>{result.Ao.toFixed(3)} <span className="text-sm font-normal" style={{ color: subtitleColor }}>m²</span></p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}