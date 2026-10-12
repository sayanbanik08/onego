"use client";

import React from "react";
import type { ProgressElement } from "../../../types/progress";

type ProgressStylingSectionProps = {
    element: ProgressElement;
    updateElement: (updates: Partial<ProgressElement>) => void;
};

const AXIS_COLOR_PALETTE = [
    "#94a3b8", // Slate 400 (visible & balanced)
    "#cbd5e1", // Slate 300 (light gray)
    "#64748b", // Slate 500 (medium gray)
    "#334155", // Slate 700 (dark gray)
    "#3b82f6", // Blue
    "#ffffff", // Crisp White
    "#000000", // Solid Black
];

export default function ProgressStylingSection({
    element,
    updateElement,
}: ProgressStylingSectionProps) {
    const getValidHexColor = (colorStr?: string, defaultHex = "#94a3b8") => {
        if (!colorStr || colorStr === "transparent" || colorStr.startsWith("rgba"))
            return defaultHex;
        if (colorStr.startsWith("#")) {
            if (colorStr.length >= 7) return colorStr.slice(0, 7);
            return colorStr;
        }
        return defaultHex;
    };

    return (
        <div className="space-y-3.5 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Bar Geometry & Toggles
            </span>

            {/* ── 1. Corner Radius (PX & %) ───────────────────────────────── */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Bar Corner Radius</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-gray-400">
                            {element.borderRadius}
                            {element.borderRadiusUnit || "px"}
                        </span>
                        <div className="flex rounded border border-gray-800 bg-gray-950 p-0.5">
                            <button
                                type="button"
                                onClick={() =>
                                    updateElement({ borderRadiusUnit: "px" })
                                }
                                className={`px-1.5 py-0.5 text-[10px] rounded ${
                                    element.borderRadiusUnit === "px"
                                        ? "bg-blue-600 text-white font-medium"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                PX
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    updateElement({ borderRadiusUnit: "%" })
                                }
                                className={`px-1.5 py-0.5 text-[10px] rounded ${
                                    element.borderRadiusUnit === "%"
                                        ? "bg-blue-600 text-white font-medium"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                %
                            </button>
                        </div>
                    </div>
                </div>
                <input
                    type="range"
                    min={0}
                    max={element.borderRadiusUnit === "%" ? 50 : 36}
                    step={1}
                    value={element.borderRadius ?? 4}
                    onChange={(e) =>
                        updateElement({ borderRadius: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>

            {/* ── 2. Item Spacing & Bar Width ─────────────────────────────── */}
            <div className="grid grid-cols-2 gap-2 border-t border-gray-800/80 pt-2.5">
                {/* Item Spacing */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-400">Spacing</span>
                        <span className="font-mono text-gray-400">
                            {element.itemSpacing ?? 20}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min={4}
                        max={48}
                        step={1}
                        value={element.itemSpacing ?? 20}
                        onChange={(e) =>
                            updateElement({ itemSpacing: Number(e.target.value) })
                        }
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Bar Width */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-400">Bar Width</span>
                        <span className="font-mono text-gray-400">
                            {element.barWidth ?? 32}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min={12}
                        max={72}
                        step={2}
                        value={element.barWidth ?? 32}
                        onChange={(e) =>
                            updateElement({ barWidth: Number(e.target.value) })
                        }
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>
            </div>

            {/* ── 3. Axes, Lines & Toggles ────────────────────────────────── */}
            <div className="space-y-2 border-t border-gray-800/80 pt-2.5">
                <span className="text-[11px] font-medium text-gray-400 block mb-1">
                    Axes, Grid & Labels
                </span>

                {/* Show Y-Axis Scale Ticks */}
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Show Y-Axis Scale Ticks</span>
                    <input
                        type="checkbox"
                        checked={element.showYAxis}
                        onChange={(e) =>
                            updateElement({ showYAxis: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-gray-700 bg-gray-900 accent-blue-600 cursor-pointer"
                    />
                </div>

                {/* Show Gridlines (Fix 4) */}
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Show Grid Guideline Lines</span>
                    <input
                        type="checkbox"
                        checked={element.showGridLines}
                        onChange={(e) =>
                            updateElement({ showGridLines: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-gray-700 bg-gray-900 accent-blue-600 cursor-pointer"
                    />
                </div>

                {/* Show Percentage Values */}
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Show Percentage Values</span>
                    <input
                        type="checkbox"
                        checked={element.showValues}
                        onChange={(e) =>
                            updateElement({ showValues: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-gray-700 bg-gray-900 accent-blue-600 cursor-pointer"
                    />
                </div>

                {/* Show Labels */}
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Show Item Labels</span>
                    <input
                        type="checkbox"
                        checked={element.showLabels}
                        onChange={(e) =>
                            updateElement({ showLabels: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-gray-700 bg-gray-900 accent-blue-600 cursor-pointer"
                    />
                </div>
            </div>

            {/* ── 4. Axis & Gridline Color (Fix 4) ────────────────────────── */}
            <div className="space-y-2 border-t border-gray-800/80 pt-2.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Axis & Gridline Color</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={getValidHexColor(element.axisColor, "#94a3b8")}
                            onChange={(e) =>
                                updateElement({ axisColor: e.target.value })
                            }
                            className="h-6 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                        <span className="font-mono text-[11px] text-gray-400 truncate max-w-[65px]">
                            {element.axisColor || "#94a3b8"}
                        </span>
                    </div>
                </div>

                {/* Quick axis color dots */}
                <div className="flex items-center gap-1.5 pt-0.5">
                    {AXIS_COLOR_PALETTE.map((c, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => updateElement({ axisColor: c })}
                            style={{ backgroundColor: c }}
                            className={`h-4.5 w-4.5 rounded-full border transition ${
                                element.axisColor === c
                                    ? "border-blue-400 ring-2 ring-blue-500/50 scale-110"
                                    : "border-gray-700 hover:scale-105"
                            }`}
                            title={c}
                        />
                    ))}
                </div>
            </div>

            {/* ── 5. Typography Colors ────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-2 border-t border-gray-800/80 pt-2.5">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">Value Color</span>
                    <input
                        type="color"
                        value={getValidHexColor(element.valueColor, "#4b5563")}
                        onChange={(e) =>
                            updateElement({ valueColor: e.target.value })
                        }
                        className="h-6 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">Label Color</span>
                    <input
                        type="color"
                        value={getValidHexColor(element.labelColor, "#6b7280")}
                        onChange={(e) =>
                            updateElement({ labelColor: e.target.value })
                        }
                        className="h-6 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />
                </div>
            </div>
        </div>
    );
}
