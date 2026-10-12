"use client";

import React from "react";
import type { ProgressElement } from "../../../types/progress";
import type { ButtonShadowPreset } from "../../../types/button";

type ProgressShadowSectionProps = {
    element: ProgressElement;
    updateElement: (updates: Partial<ProgressElement>) => void;
};

const SHADOW_PRESETS: { label: string; value: ButtonShadowPreset }[] = [
    { label: "None", value: "none" },
    { label: "Subtle", value: "sm" },
    { label: "Medium", value: "md" },
    { label: "Large", value: "lg" },
    { label: "Deep", value: "xl" },
    { label: "Neon", value: "neon" },
    { label: "3D Offset", value: "3d-offset" },
    { label: "Steps", value: "layered-steps" },
    { label: "Custom", value: "custom" },
];

export default function ProgressShadowSection({
    element,
    updateElement,
}: ProgressShadowSectionProps) {
    const isCustom = element.shadow === "custom";

    const getValidHexColor = (colorStr?: string, defaultHex = "rgba(0, 0, 0, 0.35)") => {
        if (!colorStr || colorStr === "transparent") return defaultHex;
        if (colorStr.startsWith("#")) {
            if (colorStr.length >= 7) return colorStr.slice(0, 7);
            return colorStr;
        }
        return defaultHex;
    };

    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Shadow Effects
            </span>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 gap-1.5">
                {SHADOW_PRESETS.map((preset) => {
                    const isSelected = element.shadow === preset.value;
                    return (
                        <button
                            key={preset.value}
                            type="button"
                            onClick={() => updateElement({ shadow: preset.value })}
                            className={`rounded-lg border px-2 py-1.5 text-center text-xs transition ${
                                isSelected
                                    ? "border-blue-500 bg-blue-600/30 text-blue-300 font-semibold"
                                    : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700 hover:text-white"
                            }`}
                        >
                            {preset.label}
                        </button>
                    );
                })}
            </div>

            {/* Custom Shadow Controls */}
            {isCustom && (
                <div className="space-y-2.5 border-t border-gray-800 pt-2.5">
                    {/* Shadow Color */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Shadow Color</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={getValidHexColor(element.shadowColor, "#000000")}
                                onChange={(e) =>
                                    updateElement({ shadowColor: e.target.value })
                                }
                                className="h-6 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                            />
                        </div>
                    </div>

                    {/* Blur */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Blur</span>
                            <span className="font-mono text-gray-400">
                                {element.shadowBlur ?? 12}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={60}
                            step={1}
                            value={element.shadowBlur ?? 12}
                            onChange={(e) =>
                                updateElement({ shadowBlur: Number(e.target.value) })
                            }
                            className="w-full cursor-pointer accent-blue-500"
                        />
                    </div>

                    {/* Offset X & Y */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-gray-400">Offset X</span>
                                <span className="font-mono text-gray-400">
                                    {element.shadowOffsetX ?? 0}px
                                </span>
                            </div>
                            <input
                                type="range"
                                min={-30}
                                max={30}
                                step={1}
                                value={element.shadowOffsetX ?? 0}
                                onChange={(e) =>
                                    updateElement({
                                        shadowOffsetX: Number(e.target.value),
                                    })
                                }
                                className="w-full cursor-pointer accent-blue-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-gray-400">Offset Y</span>
                                <span className="font-mono text-gray-400">
                                    {element.shadowOffsetY ?? 4}px
                                </span>
                            </div>
                            <input
                                type="range"
                                min={-30}
                                max={30}
                                step={1}
                                value={element.shadowOffsetY ?? 4}
                                onChange={(e) =>
                                    updateElement({
                                        shadowOffsetY: Number(e.target.value),
                                    })
                                }
                                className="w-full cursor-pointer accent-blue-500"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
