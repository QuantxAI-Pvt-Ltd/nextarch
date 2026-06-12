"use client";

import { useState } from "react";
import { MetricCard, ResultCard } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { useTheme } from "../theme-context";

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
    });
    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const { ACH, V, rho, Cp, delta_T } = values;

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
                    <h1 className="text-3xl font-bold mb-2" style={{ color: titleColor }}>Q from ACH (Heat Load)</h1>
                    <p className="max-w-2xl" style={{ color: subtitleColor }}>
                        Calculates the amount of heat energy supplied to or removed from a space based on air changes.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <MetricCard label="Air Changes (ACH)" value={ACH} unit="h⁻¹" name="ACH" onChange={handleChange} />
                        <MetricCard label="Room Volume (V)" value={V} unit="m³" name="V" onChange={handleChange} />
                        <MetricCard label="Air Density (ρ)" value={rho} unit="kg/m³" name="rho" step={0.01} onChange={handleChange} />
                        <MetricCard label="Specific Heat (Cp)" value={Cp} unit="J/kg·K" name="Cp" onChange={handleChange} />
                        <MetricCard label="Temp. Diff (ΔT)" value={delta_T} unit="K" name="delta_T" onChange={handleChange} />
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
                    <div className="rounded-2xl p-6 relative" style={{ background: previewBg, border: previewBorder }}>
                        <div className="text-xl flex justify-center py-8 mb-8" style={{ color: titleColor }}>
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