"use client";

import React from "react";
import type { IconElement } from "../../../types/icon";
import type { ButtonShadowPreset } from "../../../types/button";

type IconShadowSectionProps = {
    element: IconElement;
    updateElement: (updates: Partial<IconElement>) => void;
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

export default function IconShadowSection({
    element,
    updateElement,
}: IconShadowSectionProps) {
    const isCustom = element.shadow === "custom";

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

            {/* Custom Shadow Sliders */}
            {isCustom && (
                <div className="space-y-2.5 pt-2 border-t border-gray-800/80">
                    {/* Shadow Color */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-300">Shadow Color</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={
                                    element.shadowColor?.startsWith("#")
                                        ? element.shadowColor
                                        : "#000000"
                                }
                                onChange={(e) =>
                                    updateElement({ shadowColor: e.target.value })
                                }
                                className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                            />
                            <span className="font-mono text-xs text-gray-400">
                                {element.shadowColor}
                            </span>
                        </div>
                    </div>

                    {/* X Offset */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Offset X</span>
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

                    {/* Y Offset */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Offset Y</span>
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

                    {/* Blur */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Blur</span>
                            <span className="font-mono text-gray-400">
                                {element.shadowBlur ?? 12}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={50}
                            step={1}
                            value={element.shadowBlur ?? 12}
                            onChange={(e) =>
                                updateElement({
                                    shadowBlur: Number(e.target.value),
                                })
                            }
                            className="w-full cursor-pointer accent-blue-500"
                        />
                    </div>

                    {/* Spread */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Spread</span>
                            <span className="font-mono text-gray-400">
                                {element.shadowSpread ?? 0}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min={-15}
                            max={30}
                            step={1}
                            value={element.shadowSpread ?? 0}
                            onChange={(e) =>
                                updateElement({
                                    shadowSpread: Number(e.target.value),
                                })
                            }
                            className="w-full cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
