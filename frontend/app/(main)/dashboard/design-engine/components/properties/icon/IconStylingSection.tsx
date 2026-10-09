"use client";

import React from "react";
import type { IconElement } from "../../../types/icon";

type IconStylingSectionProps = {
    element: IconElement;
    updateElement: (updates: Partial<IconElement>) => void;
};

const COLOR_PALETTE = [
    "#18181b",
    "#000000",
    "#1e1b4b",
    "#0f172a",
    "#065f46",
    "#991b1b",
    "#854d0e",
    "#581c87",
];

export default function IconStylingSection({
    element,
    updateElement,
}: IconStylingSectionProps) {
    const isCustomType = element.iconType === "custom";

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
                Icon Styling & Frame
            </span>

            {/* ── 1. Remove Background Toggle (HIDDEN when Custom type!) ────── */}
            {!isCustomType && (
                <div className="flex items-center justify-between border-b border-gray-800/80 pb-2.5">
                    <div>
                        <div className="text-xs text-gray-200">Remove Background</div>
                        <div className="text-[10px] text-gray-500">
                            Transparent canvas icon without outer container box
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            updateElement({
                                removeBackground: !element.removeBackground,
                            })
                        }
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            element.removeBackground ? "bg-blue-600" : "bg-gray-700"
                        }`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                element.removeBackground
                                    ? "translate-x-4"
                                    : "translate-x-0"
                            }`}
                        />
                    </button>
                </div>
            )}

            {/* ── 2. Color & Tint ──────────────────────────────────────────── */}
            {element.iconType === "social" && (
                <div className="space-y-2 border-b border-gray-800/80 pb-2.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Original Brand Color</span>
                        <input
                            type="checkbox"
                            checked={element.useOriginalBrandColor}
                            onChange={(e) =>
                                updateElement({
                                    useOriginalBrandColor: e.target.checked,
                                })
                            }
                            className="h-4 w-4 rounded border-gray-700 bg-gray-900 accent-blue-600 cursor-pointer"
                        />
                    </div>

                    {!element.useOriginalBrandColor && (
                        <div className="flex items-center justify-between pt-1">
                            <span className="text-xs text-gray-400">Custom Icon Tint</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={getValidHexColor(element.iconColor, "#ffffff")}
                                    onChange={(e) =>
                                        updateElement({ iconColor: e.target.value })
                                    }
                                    className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                />
                                <span className="font-mono text-xs text-gray-400 truncate max-w-[65px]">
                                    {element.iconColor}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── 3. Background Color (Fix 2: Controls theme background) ────── */}
            {(!element.removeBackground || isCustomType) && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-300">Background Color</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={getValidHexColor(element.bgColor, "#18181b")}
                                onChange={(e) =>
                                    updateElement({ bgColor: e.target.value })
                                }
                                className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                            />
                            <span className="font-mono text-xs text-gray-400 truncate max-w-[70px]">
                                {element.bgColor}
                            </span>
                        </div>
                    </div>

                    {/* Quick color preset dots */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                        {COLOR_PALETTE.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => updateElement({ bgColor: c })}
                                style={{ backgroundColor: c }}
                                className={`h-5 w-5 rounded-full border transition ${
                                    element.bgColor === c
                                        ? "border-blue-400 ring-2 ring-blue-500/50 scale-110"
                                        : "border-gray-700 hover:scale-105"
                                }`}
                                title={c}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ── 4. Border Radius (Circle vs Squircle vs Square) ─────────── */}
            <div className="space-y-1.5 border-t border-gray-800/80 pt-2.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Corner Radius</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-gray-400">
                            {element.borderRadius}
                            {element.borderRadiusUnit || "%"}
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
                    value={element.borderRadius ?? 50}
                    onChange={(e) =>
                        updateElement({ borderRadius: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>

            {/* ── 5. Border Styling ────────────────────────────────────────── */}
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
                            max={12}
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

            {/* ── 6. Padding (Hidden for Custom Type) ──────────────────────── */}
            {!element.removeBackground && !isCustomType && (
                <div className="space-y-1 border-t border-gray-800/80 pt-2.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Inner Padding</span>
                        <span className="font-mono text-gray-400">
                            {element.padding ?? 12}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={40}
                        step={1}
                        value={element.padding ?? 12}
                        onChange={(e) =>
                            updateElement({ padding: Number(e.target.value) })
                        }
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>
            )}
        </div>
    );
}
