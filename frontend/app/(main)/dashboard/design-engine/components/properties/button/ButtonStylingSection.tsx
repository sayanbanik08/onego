"use client";

import React from "react";
import type { ButtonElement, ButtonRadiusUnit } from "../../../types/button";

type ButtonStylingSectionProps = {
    element: ButtonElement;
    updateElement: (updates: Partial<ButtonElement>) => void;
};

function toHex(col?: string, fallback = "#3b82f6"): string {
    if (!col || col === "transparent") return fallback;
    if (col === "white") return "#ffffff";
    if (col === "black") return "#000000";
    if (col.startsWith("#") && col.length === 7) return col;
    if (col.startsWith("#") && col.length === 4) {
        return `#${col[1]}${col[1]}${col[2]}${col[2]}${col[3]}${col[3]}`;
    }
    return fallback;
}

export default function ButtonStylingSection({
    element,
    updateElement,
}: ButtonStylingSectionProps) {
    const handleRadiusUnitToggle = (unit: ButtonRadiusUnit) => {
        let newRadius = element.borderRadius;
        if (unit === "%" && element.borderRadiusUnit === "px") {
            newRadius = Math.min(50, Math.round(element.borderRadius / 2));
        } else if (unit === "px" && element.borderRadiusUnit === "%") {
            newRadius = Math.min(60, element.borderRadius * 2);
        }
        updateElement({ borderRadiusUnit: unit, borderRadius: newRadius });
    };

    const currentBgHex = toHex(element.bgColor, "#3b82f6");

    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Colors, Radius & Padding
            </span>

            {/* Background Color - matching card pattern */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Background Color</span>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={currentBgHex}
                        onChange={(e) =>
                            updateElement({ bgColor: e.target.value })
                        }
                        className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />
                    <span className="font-mono text-xs text-gray-400">
                        {element.bgColor && element.bgColor !== "transparent"
                            ? element.bgColor
                            : "transparent"}
                    </span>
                </div>
            </div>

            {/* Button Radius with % and px support */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Button Radius</span>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => handleRadiusUnitToggle("px")}
                            className={`rounded px-1.5 py-0.5 text-[10px] font-mono transition ${
                                element.borderRadiusUnit === "px"
                                    ? "bg-blue-600 text-white font-bold"
                                    : "bg-gray-800 text-gray-400 hover:text-white"
                            }`}
                        >
                            px
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRadiusUnitToggle("%")}
                            className={`rounded px-1.5 py-0.5 text-[10px] font-mono transition ${
                                element.borderRadiusUnit === "%"
                                    ? "bg-blue-600 text-white font-bold"
                                    : "bg-gray-800 text-gray-400 hover:text-white"
                            }`}
                        >
                            %
                        </button>
                        <span className="font-mono text-gray-400 ml-1">
                            {element.borderRadius}
                            {element.borderRadiusUnit || "px"}
                        </span>
                    </div>
                </div>
                <input
                    type="range"
                    min={0}
                    max={element.borderRadiusUnit === "%" ? 50 : 80}
                    step={1}
                    value={element.borderRadius}
                    onChange={(e) =>
                        updateElement({ borderRadius: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>

            {/* Padding (X / Y) - using range sliders for reliability */}
            <div className="space-y-2">
                <span className="text-xs text-gray-300">Padding</span>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Horizontal (X)</span>
                        <span className="font-mono text-gray-400">
                            {element.paddingX}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={80}
                        step={1}
                        value={element.paddingX}
                        onChange={(e) =>
                            updateElement({ paddingX: Number(e.target.value) })
                        }
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Vertical (Y)</span>
                        <span className="font-mono text-gray-400">
                            {element.paddingY}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={60}
                        step={1}
                        value={element.paddingY}
                        onChange={(e) =>
                            updateElement({ paddingY: Number(e.target.value) })
                        }
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>
            </div>

            {/* Border Settings */}
            <div className="space-y-2 pt-1 border-t border-gray-800/80">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Border Width</span>
                    <span className="font-mono text-gray-400">
                        {element.borderWidth}px
                    </span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={element.borderWidth}
                    onChange={(e) =>
                        updateElement({ borderWidth: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />

                <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                        <span className="text-[10px] text-gray-500">Border Style</span>
                        <select
                            value={element.borderStyle}
                            onChange={(e) =>
                                updateElement({
                                    borderStyle: e.target.value as any,
                                })
                            }
                            className="w-full mt-1 rounded-lg border border-gray-700 bg-gray-900 px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                        >
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                            <option value="none">None</option>
                        </select>
                    </div>

                    <div>
                        <span className="text-[10px] text-gray-500">Border Color</span>
                        <div className="flex items-center gap-1.5 mt-1">
                            <input
                                type="color"
                                value={toHex(element.borderColor, "#3b82f6")}
                                onChange={(e) =>
                                    updateElement({ borderColor: e.target.value })
                                }
                                className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                            />
                            <span className="font-mono text-[10px] text-gray-400 truncate">
                                {element.borderColor}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
