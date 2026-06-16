"use client";

import { useState } from "react";
import { ResultCard } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { useTheme } from "../theme-context";

interface WindowElement {
    qa: number;
    area: number;
    shgc: number;
    pf: number;
    radiation: number;
}

interface ResultData {
    Q_solar: number;
}

export default function SolarHeatGain() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [elements, setElements] = useState<WindowElement[]>([
        { qa: 1, area: 0, shgc: 0, pf: 1, radiation: 800 }
    ]);
    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAddElement = () => {
        setElements([...elements, { qa: 1, area: 0, shgc: 0, pf: 1, radiation: 800 }]);
    };

    const handleRemoveElement = (index: number) => {
        if (elements.length > 1) {
            setElements(elements.filter((_, i) => i !== index));
        }
    };

    const handleElementChange = (index: number, field: keyof WindowElement, value: string) => {
        const newElements = [...elements];
        newElements[index][field] = parseFloat(value) || 0;
        setElements(newElements);
    };

    const handleCalculate = async () => {
        setLoading(true);
        try {
            // Note: API integration might need to be adjusted to support arrays for solar heat gain.
            // For now, calculating the sum internally to match the live preview functionality
            const Q_solar = elements.reduce((acc, el) => acc + (el.qa * el.area * el.shgc * el.pf * el.radiation), 0);
            setResult({ Q_solar });
        } catch (error) {
            console.error("Error calculating:", error);
            alert("Error calculating.");
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
    const rowBg = isDark ? "#0B1121" : "#f8fafc";
    const rowBorder = isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0";
    const dividerColor = isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0";
    const numberBubbleBg = isDark ? "#131B2C" : "#f1f5f9";
    const numberBubbleBorder = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0";
    const stepBg = isDark ? "#131B2C" : "#f1f5f9";
    const stepBorder = isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0";

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: titleColor }}>Equivalent Solar Heat Gain</h1>
                    <p className="max-w-2xl" style={{ color: subtitleColor }}>
                        Calculates the total heat gain through glazing considering shading and solar irradiation for multiple window types.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold" style={{ color: titleColor }}>Window Types</h2>
                            <Button
                                onClick={handleAddElement}
                                variant="outline"
                                size="sm"
                                className="bg-[#1A73E8]/10  text-[#1A73E8] border border-[#1A73E8]/20"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Window Type
                            </Button>

                        </div>

                        {elements.map((element, index) => (
                            <div
                                key={index}
                                className="p-5 rounded-2xl relative transition-all"
                                style={{ background: rowBg, border: rowBorder }}
                            >
                                <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[#1A73E8] shadow-sm z-10"
                                    style={{ background: numberBubbleBg, border: numberBubbleBorder }}>
                                    {index + 1}
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-medium text-sm ml-4" style={{ color: titleColor }}>Window {index + 1} Profile</h3>
                                    {elements.length > 1 && (
                                        <Button
                                            onClick={() => handleRemoveElement(index)}
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: labelColor }}>
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={element.qa || ''}
                                            onChange={(e) => handleElementChange(index, "qa", e.target.value)}
                                            className="w-full bg-transparent border-0 border-b-2 border-transparent hover:border-[#1A73E8]/30 focus:border-[#1A73E8] focus:ring-0 px-0 py-2 text-lg font-mono transition-colors"
                                            style={{ color: titleColor }}
                                            placeholder="1"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: labelColor }}>
                                            Area (m²)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={element.area || ''}
                                            onChange={(e) => handleElementChange(index, "area", e.target.value)}
                                            className="w-full bg-transparent border-0 border-b-2 border-transparent hover:border-[#1A73E8]/30 focus:border-[#1A73E8] focus:ring-0 px-0 py-2 text-lg font-mono transition-colors"
                                            style={{ color: titleColor }}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: labelColor }}>
                                            SHGC
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={element.shgc || ''}
                                            onChange={(e) => handleElementChange(index, "shgc", e.target.value)}
                                            className="w-full bg-transparent border-0 border-b-2 border-transparent hover:border-[#1A73E8]/30 focus:border-[#1A73E8] focus:ring-0 px-0 py-2 text-lg font-mono transition-colors"
                                            style={{ color: titleColor }}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: labelColor }}>
                                            PF
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={element.pf || ''}
                                            onChange={(e) => handleElementChange(index, "pf", e.target.value)}
                                            className="w-full bg-transparent border-0 border-b-2 border-transparent hover:border-[#1A73E8]/30 focus:border-[#1A73E8] focus:ring-0 px-0 py-2 text-lg font-mono transition-colors"
                                            style={{ color: titleColor }}
                                            placeholder="1.0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: labelColor }}>
                                            Rad (W/m²)
                                        </label>
                                        <input
                                            type="number"
                                            value={element.radiation || ''}
                                            onChange={(e) => handleElementChange(index, "radiation", e.target.value)}
                                            className="w-full bg-transparent border-0 border-b-2 border-transparent hover:border-[#1A73E8]/30 focus:border-[#1A73E8] focus:ring-0 px-0 py-2 text-lg font-mono transition-colors"
                                            style={{ color: titleColor }}
                                            placeholder="800"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4 border-t" style={{ borderColor: dividerColor }}>
                        <Button
                            onClick={handleCalculate}
                            disabled={loading}
                            className="bg-[#1A73E8] hover:bg-[#1557B0] text-white px-8 py-6 rounded-xl font-semibold text-lg"
                        >
                            {loading ? "Calculating..." : "Calculate Gain"}
                        </Button>
                    </div>

                    {/* Live Formula Preview */}
                    <div className="rounded-2xl p-6 relative" style={{ background: previewBg, border: previewBorder }}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[#1A73E8] text-xs font-bold uppercase tracking-wider">LIVE FORMULA PREVIEW</h3>
                            <ArrowLeft className="h-5 w-5" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "#cbd5e1" }} />
                        </div>
                        <div className="text-xl flex justify-center py-8 mb-8 w-full overflow-x-auto" style={{ color: titleColor }}>
                            <BlockMath math={`\\begin{align*}
                                ${elements.map((e, index) => {
                                const val = (e.area || 0) * (e.shgc || 0) * (e.pf || 0) * (e.radiation || 0);
                                return `${index + 1}\\text{)} \\quad Q_{${index + 1}} &= ${e.area || 0} \\times ${e.shgc || 0} \\times ${e.pf || 0} \\times ${e.radiation || 0} = ${val === 0 ? '\\text{---}' : val.toFixed(3)} \\; \\text{W} \\\\[6pt]`;
                            }).join('')}
                                Q_{\\text{total}} &= ${elements.map((e, i) => {
                                const val = (e.area || 0) * (e.shgc || 0) * (e.pf || 0) * (e.radiation || 0);
                                return `(${val === 0 ? '\\text{---}' : val.toFixed(3)} \\times ${e.qa || 0})`;
                            }).join(' + ')} \\\\
                                Q_{\\text{total}} &= ${elements.map((e, i) => {
                                const totalVal = (e.area || 0) * (e.shgc || 0) * (e.pf || 0) * (e.radiation || 0) * (e.qa || 0);
                                return totalVal === 0 ? '\\text{---}' : totalVal.toFixed(3);
                            }).join(' + ')} \\\\
                                Q_{\\text{total}} &= ${elements.reduce((acc, el) => acc + ((el.area || 0) * (el.shgc || 0) * (el.pf || 0) * (el.radiation || 0) * (el.qa || 0)), 0) === 0 ? '\\text{---}' : '\\mathbf{' + elements.reduce((acc, el) => acc + ((el.area || 0) * (el.shgc || 0) * (el.pf || 0) * (el.radiation || 0) * (el.qa || 0)), 0).toFixed(3) + '}'} \\; \\text{W}
                            \\end{align*}`} />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <ResultCard label="Total Solar Heat Gain (Q)" value={result ? result.Q_solar.toFixed(2) : "---"} unit="W" />
                </div>
            </div>
        </div>
    );
}
