"use client";

import React from "react";
import type { GridElement } from "../../../types/grid";

type GridStylingSectionProps = {
    element: GridElement;
    updateElement: (updates: Partial<GridElement>) => void;
};

const COLOR_PALETTE = [
    "rgba(255, 255, 255, 0.03)",
    "#18181b",
    "#09090b",
    "#1e1b4b",
    "#0f172a",
    "#065f46",
    "#991b1b",
    "#ffffff",
];

const BORDER_PALETTE = [
    "rgba(255, 255, 255, 0.15)",
    "#3f3f46",
    "#3b82f6",
    "#10b981",
    "#ec4899",
    "#eab308",
    "#ffffff",
    "#000000",
];

export default function GridStylingSection({
    element,
    updateElement,
}: GridStylingSectionProps) {
    const getValidHexColor = (colorStr?: string, defaultHex = "#3f3f46") => {
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
                Cell Skeleton Styling
            </span>

            {/* ── 1. Corner Radius (PX & %) ───────────────────────────────── */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Corner Radius</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-gray-400">
                            {element.cellBorderRadius}
                            {element.cellBorderRadiusUnit || "px"}
                        </span>
                        <div className="flex rounded border border-gray-800 bg-gray-950 p-0.5">
                            <button
                                type="button"
                                onClick={() =>
                                    updateElement({ cellBorderRadiusUnit: "px" })
                                }
                                className={`px-1.5 py-0.5 text-[10px] rounded ${
                                    element.cellBorderRadiusUnit === "px"
                                        ? "bg-blue-600 text-white font-medium"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                PX
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    updateElement({ cellBorderRadiusUnit: "%" })
                                }
                                className={`px-1.5 py-0.5 text-[10px] rounded ${
                                    element.cellBorderRadiusUnit === "%"
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
                    max={element.cellBorderRadiusUnit === "%" ? 50 : 60}
                    step={1}
                    value={element.cellBorderRadius ?? 16}
                    onChange={(e) =>
                        updateElement({ cellBorderRadius: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>

            {/* ── 2. Border Styling (Color, Width, Style) ────────────────── */}
            <div className="space-y-2 border-t border-gray-800/80 pt-2.5">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Border Color</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={getValidHexColor(element.cellBorderColor, "#3f3f46")}
                            onChange={(e) =>
                                updateElement({ cellBorderColor: e.target.value })
                            }
                            className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                        <span className="font-mono text-xs text-gray-400 truncate max-w-[70px]">
                            {element.cellBorderColor}
                        </span>
                    </div>
                </div>

                {/* Quick border color dots */}
                <div className="flex items-center gap-1.5 pt-0.5">
                    {BORDER_PALETTE.map((c, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => updateElement({ cellBorderColor: c })}
                            style={{ backgroundColor: c }}
                            className={`h-5 w-5 rounded-full border transition ${
                                element.cellBorderColor === c
                                    ? "border-blue-400 ring-2 ring-blue-500/50 scale-110"
                                    : "border-gray-700 hover:scale-105"
                            }`}
                            title={c}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Border Width */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="text-gray-400">Width</span>
                            <span className="font-mono text-gray-400">
                                {element.cellBorderWidth}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={8}
                            step={0.5}
                            value={element.cellBorderWidth}
                            onChange={(e) =>
                                updateElement({
                                    cellBorderWidth: Number(e.target.value),
                                })
                            }
                            className="w-full cursor-pointer accent-blue-500"
                        />
                    </div>

                    {/* Border Style */}
                    <div className="space-y-1">
                        <div className="text-[11px] text-gray-400">Style</div>
                        <select
                            value={element.cellBorderStyle}
                            onChange={(e) =>
                                updateElement({
                                    cellBorderStyle: e.target.value as any,
                                })
                            }
                            className="w-full rounded border border-gray-700 bg-gray-950 px-2 py-1 text-xs text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="dashed">Dashed</option>
                            <option value="solid">Solid</option>
                            <option value="dotted">Dotted</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ── 3. Cell Fill / Background Color ────────────────────────── */}
            <div className="space-y-2 border-t border-gray-800/80 pt-2.5">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Cell Fill Color</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={getValidHexColor(element.cellBgColor, "#18181b")}
                            onChange={(e) =>
                                updateElement({ cellBgColor: e.target.value })
                            }
                            className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                        <span className="font-mono text-xs text-gray-400 truncate max-w-[70px]">
                            {element.cellBgColor}
                        </span>
                    </div>
                </div>

                {/* Quick fill color preset dots */}
                <div className="flex items-center gap-1.5 pt-0.5">
                    {COLOR_PALETTE.map((c, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => updateElement({ cellBgColor: c })}
                            style={{ backgroundColor: c }}
                            className={`h-5 w-5 rounded-full border transition ${
                                element.cellBgColor === c
                                    ? "border-blue-400 ring-2 ring-blue-500/50 scale-110"
                                    : "border-gray-700 hover:scale-105"
                            }`}
                            title={c}
                        />
                    ))}
                </div>
            </div>

            {/* ── 4. Visual Indicators Toggles ───────────────────────────── */}
            <div className="space-y-2 border-t border-gray-800/80 pt-2.5">
                {/* Show Cell Numbers Toggle */}
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Show Slot Numbers (#1, #2)</span>
                    <input
                        type="checkbox"
                        checked={element.showCellNumbers}
                        onChange={(e) =>
                            updateElement({ showCellNumbers: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-gray-700 bg-gray-900 accent-blue-600 cursor-pointer"
                    />
                </div>

                {/* Show Plus Icon Toggle */}
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Show Drop / Plus Icon</span>
                    <input
                        type="checkbox"
                        checked={element.showPlusIcon}
                        onChange={(e) =>
                            updateElement({ showPlusIcon: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-gray-700 bg-gray-900 accent-blue-600 cursor-pointer"
                    />
                </div>

                {/* Skeleton Pulse Toggle */}
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Subtle Shimmer Pulse</span>
                    <input
                        type="checkbox"
                        checked={element.skeletonPulse}
                        onChange={(e) =>
                            updateElement({ skeletonPulse: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-gray-700 bg-gray-900 accent-blue-600 cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}
