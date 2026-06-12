"use client";

import { useState } from "react";
import { MetricCard, ResultCard } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { useTheme } from "../theme-context";

interface ResultData {
    Qs: number;
    Ql_vapor: number;
    Q_humidity: number;
    Qt_vapor: number;
    Qt_humidity: number;
}

export default function Volumeofairheatgain() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [values, setvalues] = useState({
        ks: 0,
        h: 0,
        t: 0,
        wo: 0,
        kl: 0,
        wi: 0,
    });

    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setvalues(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    }

    const { ks, h, t, wo, kl, wi } = values;

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/volume-air-heat-gain`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Ks: ks,
                    Kl: kl,
                    t: t,
                    h: h,
                    wo: wo,
                    wi: wi
                }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error calculating:', error);
            alert('Error calculating...');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: isDark ? "#ffffff" : "#1e293b" }}>Volume of Air (Heat Gain)</h1>
                    <p className="max-w-2xl" style={{ color: isDark ? "#9ca3af" : "#64748b" }}>
                        Calculates sensible and latent air volumes based on heat gain and humidity differences.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Inputs */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <MetricCard
                            label="Sensible Heat (Ks)"
                            value={ks}
                            unit="W"
                            name="ks"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Vapor Diff (h)"
                            value={h}
                            unit="mm Hg"
                            name="h"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Temp Rise (t)"
                            value={t}
                            unit="°C"
                            name="t"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Spec. Humidity Out (wo)"
                            value={wo}
                            unit=""
                            name="wo"
                            step={0.001}
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Latent Heat (Kl)"
                            value={kl}
                            unit="W"
                            name="kl"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Spec. Humidity In (wi)"
                            value={wi}
                            unit=""
                            name="wi"
                            step={0.001}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleCalculate}
                            disabled={loading}
                            className="w-full sm:w-auto bg-[#1A73E8] hover:bg-[#1557B0] text-white px-8 py-6 rounded-xl font-semibold text-lg"
                        >
                            {loading ? 'Calculating...' : 'Calculate Parameters'}
                        </Button>
                    </div>

                    {/* Live Formula Preview */}
                    <div
                        className="rounded-2xl p-6 relative"
                        style={{
                            background: isDark ? "#0f1623" : "#f8fafc",
                            border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0",
                        }}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[#1A73E8] text-xs font-bold uppercase tracking-wider">LIVE FORMULA PREVIEW</h3>
                            <ArrowLeft className="h-5 w-5" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "#cbd5e1" }} />
                        </div>
                        <div className="text-base sm:text-lg flex justify-center py-4 sm:py-8 mb-4 sm:mb-8 w-full overflow-x-auto" style={{ color: isDark ? "#ffffff" : "#1e293b" }}>
                            <BlockMath
                                math={`\\begin{align*}
                                    
                                    Q_1 &= \\frac{2{,}976.8 \\times ${ks || 0}}{${t || 0}} \\\\
                                    Q_1 &= ${(!ks || !t) ? '\\text{---}' : '\\mathbf{' + ((2.9768 * ks) / t).toFixed(2) + '}'} \\; \\text{m}^3/\\text{h} \\\\[1em]

                                    
                                    Q_2 &= \\frac{4{,}127.26 \\times ${kl || 0}}{${h || 0}} \\\\
                                    Q_2 &= ${(!kl || !h) ? '\\text{---}' : '\\mathbf{' + ((4127.26 * kl) / h).toFixed(2) + '}'} \\; \\text{m}^3/\\text{h} \\\\[1em]

                                    
                                    Q_l &= \\frac{${kl || 0}}{814 \\times (${wo || 0} - ${wi || 0})} \\\\
                                    Q_l &= ${(!kl || (wo - wi) === 0) ? '\\text{---}' : '\\mathbf{' + (kl / (814 * (wo - wi))).toFixed(2) + '}'} \\; \\text{m}^3/\\text{h} \\\\[1em]

                                    Q_T &= Q_1 + Q_2 \\\\
                                    Q_T &= ${(() => { const q1 = (!ks || !t) ? null : (2.9768 * ks) / t; const q2 = (!kl || !h) ? null : (4127.26 * kl) / h; return (q1 === null || q2 === null) ? '\\text{---}' : '\\mathbf{' + (q1 + q2).toFixed(2) + '}'; })()} \\; \\text{m}^3/\\text{h}
                                \\end{align*}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Results */}
                <div className="lg:col-span-4 space-y-6">
                    <ResultCard
                        label="Total Air Volume (QT)"
                        value={result ? result.Qt_vapor.toFixed(0) : "---"}
                        unit="m³/h"
                    />

                    {/* Breakdown Results */}
                    {result && (
                        <div
                            className="rounded-2xl p-6 space-y-4"
                            style={{
                                background: isDark ? "#131B2C" : "#ffffff",
                                border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
                            }}
                        >
                            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: isDark ? "#9ca3af" : "#64748b" }}>Detailed Breakdown</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs" style={{ color: isDark ? "#6b7280" : "#94a3b8" }}>Q₁ — Sensible Heat (Qs)</p>
                                    <p className="text-xl font-bold" style={{ color: isDark ? "#ffffff" : "#1e293b" }}>{result.Qs.toFixed(1)} <span className="text-sm font-normal" style={{ color: isDark ? "#4b5563" : "#94a3b8" }}>m³/h</span></p>
                                </div>
                                <div className="w-full h-px" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0" }}></div>
                                <div>
                                    <p className="text-xs" style={{ color: isDark ? "#6b7280" : "#94a3b8" }}>Q₂ — Latent: Vapour Pressure Method</p>
                                    <p className="text-xl font-bold" style={{ color: isDark ? "#ffffff" : "#1e293b" }}>{result.Ql_vapor.toFixed(1)} <span className="text-sm font-normal" style={{ color: isDark ? "#4b5563" : "#94a3b8" }}>m³/h</span></p>
                                </div>
                                <div className="w-full h-px" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0" }}></div>
                                <div>
                                    <p className="text-xs" style={{ color: isDark ? "#6b7280" : "#94a3b8" }}>Ql — Latent: Specific Humidity Method</p>
                                    <p className="text-xl font-bold" style={{ color: isDark ? "#ffffff" : "#1e293b" }}>{result.Q_humidity.toFixed(1)} <span className="text-sm font-normal" style={{ color: isDark ? "#4b5563" : "#94a3b8" }}>m³/h</span></p>
                                </div>
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}
