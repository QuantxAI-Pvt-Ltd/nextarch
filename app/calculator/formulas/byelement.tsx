"use client";

import { useState } from "react";
import { MetricCard, ResultCard, ValidationAlert } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Layers, ArrowRight, ArrowLeft } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "../theme-context";

interface Element {
    U: number;
    A: number;
}

interface ResultData {
    Q_total: number;
    total_UA: number;
    elements_UA: number[];
}

export default function Byelement() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [elements, setElements] = useState<Element[]>([{ U: 0, A: 0 }]);
    const [deltaT, setDeltaT] = useState<number>(0);
    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [invalidElements, setInvalidElements] = useState<Record<string, boolean>>({});
    const [errorList, setErrorList] = useState<string[]>([]);

    const handleElementChange = (index: number, field: 'U' | 'A', value: string) => {
        const newElements = [...elements];
        const parsed = parseFloat(value);
        newElements[index][field] = isNaN(parsed) ? 0 : Math.abs(parsed);
        setElements(newElements);
        setInvalidElements(prev => ({ ...prev, [`${index}-${field}`]: false }));
        if (errorList.length > 0) setErrorList([]);
    };

    const addElement = () => setElements([...elements, { U: 0, A: 0 }]);

    const removeElement = (index: number) => {
        if (elements.length > 1) {
            setElements(elements.filter((_, i) => i !== index));
            setInvalidElements({});
            setErrorList([]);
        }
    };

    const handleCalculate = async () => {
        const newErrors: Record<string, boolean> = {};
        const newInvalidElements: Record<string, boolean> = {};
        const missing: string[] = [];

        if (!deltaT || deltaT <= 0) {
            newErrors.deltaT = true;
            missing.push("Temp. Diff (ΔT)");
        }

        elements.forEach((el, idx) => {
            const num = idx + 1;
            if (!el.U || el.U <= 0) {
                newInvalidElements[`${idx}-U`] = true;
                missing.push(`Element ${num} U-value`);
            }
            if (!el.A || el.A <= 0) {
                newInvalidElements[`${idx}-A`] = true;
                missing.push(`Element ${num} Area`);
            }
        });

        if (missing.length > 0) {
            setErrors(newErrors);
            setInvalidElements(newInvalidElements);
            setErrorList(missing);
            return;
        }

        setErrors({});
        setInvalidElements({});
        setErrorList([]);
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/by-element`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ elements, delta_T: deltaT }),
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

    const cardBg = isDark ? "#131B2C" : "#ffffff";
    const cardBorder = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0";
    const rowBg = isDark ? "#0B1121" : "#f8fafc";
    const rowBorder = isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0";
    const labelColor = isDark ? "#6b7280" : "#94a3b8";
    const titleColor = isDark ? "#ffffff" : "#1e293b";
    const subtitleColor = isDark ? "#9ca3af" : "#64748b";
    const previewBg = isDark ? "#0f1623" : "#f8fafc";
    const previewBorder = isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0";
    const stepBg = isDark ? "#131B2C" : "#f1f5f9";
    const stepBorder = isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0";
    const dividerColor = isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0";
    const numberBubbleBg = isDark ? "#131B2C" : "#f1f5f9";
    const numberBubbleBorder = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0";

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: titleColor }}>Heat Flow by Element</h1>
                    <p className="max-w-2xl" style={{ color: subtitleColor }}>
                        Calculates total heat flow through a structure by summing heat lost or gained by each component.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MetricCard
                            label="Temp. Diff (ΔT)"
                            value={deltaT}
                            unit="K"
                            name="deltaT"
                            error={errors.deltaT}
                            onChange={(e) => {
                                const parsed = parseFloat(e.target.value);
                                setErrors(prev => ({ ...prev, deltaT: false }));
                                if (errorList.length > 0) setErrorList([]);
                                setDeltaT(isNaN(parsed) ? 0 : Math.abs(parsed));
                            }}
                        />
                    </div>

                    {/* Dynamic Elements List */}
                    <div className="rounded-2xl p-6" style={{ background: cardBg, border: cardBorder }}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#1A73E8]/10 p-2 rounded-lg">
                                    <Layers className="text-[#1A73E8] h-5 w-5" />
                                </div>
                                <h4 className="font-medium" style={{ color: titleColor }}>Building Elements</h4>
                            </div>
                            <Button onClick={addElement} className="bg-[#1A73E8]/10 hover:bg-[#1A73E8]/20 text-[#1A73E8] border border-[#1A73E8]/20">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Element
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {elements.map((element, index) => {
                                const hasElementError = invalidElements[`${index}-U`] || invalidElements[`${index}-A`];
                                return (
                                    <div
                                        key={index}
                                        className="rounded-xl p-4 relative group transition-all"
                                        style={{
                                            background: rowBg,
                                            border: hasElementError ? "1px solid #ef4444" : rowBorder,
                                            boxShadow: hasElementError ? (isDark ? "0 0 0 1px rgba(239,68,68,0.4)" : "0 0 0 1px #ef4444") : "none",
                                        }}
                                    >
                                        <div className="flex flex-wrap md:flex-nowrap items-end gap-4">
                                            <div className="flex-1 min-w-[140px]">
                                                <Label className="text-xs mb-1.5 block" style={{ color: invalidElements[`${index}-U`] ? "#ef4444" : labelColor }}>
                                                    U-value (W/m²·K) {invalidElements[`${index}-U`] && "*"}
                                                </Label>
                                                <Input
                                                    type="number"
                                                    value={element.U}
                                                    onChange={(e) => handleElementChange(index, 'U', e.target.value)}
                                                    min={0}
                                                    onFocus={(e) => e.target.select()}
                                                    onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                                                    className="h-10"
                                                    style={{
                                                        background: cardBg,
                                                        border: invalidElements[`${index}-U`] ? "1px solid #ef4444" : cardBorder,
                                                        color: invalidElements[`${index}-U`] ? "#ef4444" : titleColor,
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-center pb-2" style={{ color: labelColor }}>
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-[140px]">
                                                <Label className="text-xs mb-1.5 block" style={{ color: invalidElements[`${index}-A`] ? "#ef4444" : labelColor }}>
                                                    Area (m²) {invalidElements[`${index}-A`] && "*"}
                                                </Label>
                                                <Input
                                                    type="number"
                                                    value={element.A}
                                                    onChange={(e) => handleElementChange(index, 'A', e.target.value)}
                                                    min={0}
                                                    onFocus={(e) => e.target.select()}
                                                    onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                                                    className="h-10"
                                                    style={{
                                                        background: cardBg,
                                                        border: invalidElements[`${index}-A`] ? "1px solid #ef4444" : cardBorder,
                                                        color: invalidElements[`${index}-A`] ? "#ef4444" : titleColor,
                                                    }}
                                                />
                                            </div>
                                            {elements.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeElement(index)}
                                                    className="text-gray-500 hover:text-red-400 hover:bg-transparent h-10 w-10 shrink-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <div
                                            className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold"
                                            style={{
                                                background: numberBubbleBg,
                                                border: hasElementError ? "1px solid #ef4444" : numberBubbleBorder,
                                                color: hasElementError ? "#ef4444" : labelColor,
                                            }}
                                        >
                                            {index + 1}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Validation Alert */}
                    <ValidationAlert errors={errorList} onDismiss={() => setErrorList([])} />

                    <div className="flex justify-end">
                        <Button
                            onClick={handleCalculate}
                            disabled={loading}
                            className="bg-[#1A73E8] hover:bg-[#1557B0] text-white px-8 py-6 rounded-xl font-semibold text-lg"
                        >
                            {loading ? 'Calculating...' : 'Calculate Total Flow'}
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
                                ${elements.map((e, index) => `UA_{${index + 1}} &= U_{${index + 1}} \\times A_{${index + 1}} = ${e.U || 0} \\times ${e.A || 0} = ${((e.U || 0) * (e.A || 0)).toFixed(2)} \\; \\text{W/K} \\\\[6pt]`).join('')}
                                UA_{\\text{total}} &= ${elements.map((_, i) => `UA_{${i + 1}}`).join(' + ')} \\\\
                                UA_{\\text{total}} &= ${elements.map((e, i) => ((e.U || 0) * (e.A || 0)).toFixed(2)).join(' + ')} = ${elements.reduce((acc, el) => acc + ((el.U || 0) * (el.A || 0)), 0).toFixed(2)} \\; \\text{W/K} \\\\[1em]
                                Q_{\\text{total}} &= UA_{\\text{total}} \\times \\Delta T \\\\
                                Q_{\\text{total}} &= ${elements.reduce((acc, el) => acc + ((el.U || 0) * (el.A || 0)), 0).toFixed(2)} \\times ${deltaT || 0} \\\\
                                Q_{\\text{total}} &= ${elements.reduce((acc, el) => acc + ((el.U || 0) * (el.A || 0)), 0) === 0 || !deltaT ? '\\text{---}' : '\\mathbf{' + (elements.reduce((acc, el) => acc + ((el.U || 0) * (el.A || 0)), 0) * deltaT).toFixed(2) + '}'} \\; \\text{W}
                            \\end{align*}`} />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <ResultCard label="Total Heat Flow" value={result ? result.Q_total.toFixed(2) : "---"} unit="W" />

                    {result && (
                        <div className="rounded-2xl p-6 space-y-4" style={{ background: cardBg, border: cardBorder }}>
                            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: subtitleColor }}>Element Breakdown (UA)</h4>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                {result.elements_UA.map((ua, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 rounded-lg" style={{ background: rowBg, border: rowBorder }}>
                                        <span className="text-sm" style={{ color: subtitleColor }}>Element {index + 1}</span>
                                        <span className="font-mono font-medium" style={{ color: titleColor }}>
                                            {ua.toFixed(2)} <span className="text-xs" style={{ color: dividerColor }}>W/K</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}