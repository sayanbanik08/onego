"use client";

import React from "react";
import type { ImageElement } from "../../../types/image";

type ImageFrameStylingSectionProps = {
    element: ImageElement;
    updateElement: (updates: Partial<ImageElement>) => void;
};

const COLOR_PALETTE = [
    "#18181b",
    "#000000",
    "#ffffff",
    "#1e1b4b",
    "#0f172a",
    "#065f46",
    "#991b1b",
    "#854d0e",
];

export default function ImageFrameStylingSection({
    element,
    updateElement,
}: ImageFrameStylingSectionProps) {
    const getValidHexColor = (colorStr?: string, defaultHex = "#18181b") => {
        if (!colorStr || colorStr === "transparent") return defaultHex;
        if (colorStr.startsWith("#")) {
            if (colorStr.length >= 7) return colorStr.slice(0, 7);
            return colorStr;
        }
        return defaultHex;
    };

    return (
        <div className="space-y-3.5 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Frame Styling
            </span>

            {/* ── 1. Frame Color ─────────────────────────────────────────── */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Frame Color</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={getValidHexColor(element.frameColor, "#18181b")}
                            onChange={(e) =>
                                updateElement({ frameColor: e.target.value })
                            }
                            className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                        <span className="font-mono text-xs text-gray-400 truncate max-w-[70px]">
                            {element.frameColor}
                        </span>
                    </div>
                </div>

                {/* Quick color preset dots */}
                <div className="flex items-center gap-1.5 pt-0.5">
                    {COLOR_PALETTE.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => updateElement({ frameColor: c })}
                            style={{ backgroundColor: c }}
                            className={`h-5 w-5 rounded-full border transition ${
                                element.frameColor === c
                                    ? "border-blue-400 ring-2 ring-blue-500/50 scale-110"
                                    : "border-gray-700 hover:scale-105"
                            }`}
                            title={c}
                        />
                    ))}
                </div>
            </div>

            {/* ── 2. Corner Radius ───────────────────────────────────────── */}
            {element.frameShape === "rounded" && (
                <div className="space-y-1.5 border-t border-gray-800/80 pt-2.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Corner Radius</span>
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
                        max={element.borderRadiusUnit === "%" ? 50 : 100}
                        step={1}
                        value={element.borderRadius ?? 16}
                        onChange={(e) =>
                            updateElement({ borderRadius: Number(e.target.value) })
                        }
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>
            )}

            {/* ── 3. Border Styling ────────────────────────────────────────── */}
            <div className="space-y-2 border-t border-gray-800/80 pt-2.5">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Border Color</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={getValidHexColor(element.borderColor, "#3f3f46")}
                            onChange={(e) =>
                                updateElement({ borderColor: e.target.value })
                            }
                            className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                        <span className="font-mono text-xs text-gray-400 truncate max-w-[70px]">
                            {element.borderColor}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {/* Border Width */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="text-gray-400">Width</span>
                            <span className="font-mono text-gray-400">
                                {element.borderWidth}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={16}
                            step={1}
                            value={element.borderWidth}
                            onChange={(e) =>
                                updateElement({
                                    borderWidth: Number(e.target.value),
                                })
                            }
                            className="w-full cursor-pointer accent-blue-500"
                        />
                    </div>

                    {/* Border Style */}
                    <div className="space-y-1">
                        <div className="text-[11px] text-gray-400">Style</div>
                        <select
                            value={element.borderStyle}
                            onChange={(e) =>
                                updateElement({
                                    borderStyle: e.target.value as any,
                                })
                            }
                            className="w-full rounded border border-gray-700 bg-gray-950 px-2 py-1 text-xs text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
