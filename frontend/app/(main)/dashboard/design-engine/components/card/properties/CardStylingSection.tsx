"use client";

import React from "react";
import type { CardElement, CardShadow } from "../../../types/card";

export const SHADOW_OPTIONS: { value: CardShadow; label: string }[] = [
    { value: "none", label: "None" },
    { value: "sm", label: "Sm" },
    { value: "md", label: "Md" },
    { value: "lg", label: "Lg" },
    { value: "neon", label: "Neon" },
    { value: "neumorphic", label: "Neu" },
];

export function CardStylingSection({
    element: el,
    updateElement,
}: {
    element: CardElement;
    updateElement: (updates: Partial<CardElement>) => void;
}) {
    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Card Styling
            </label>

            {/* Accent Color */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Accent Color</span>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={el.accentColor || "#387ef0"}
                        onChange={(e) =>
                            updateElement({ accentColor: e.target.value })
                        }
                        className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />
                    <span className="font-mono text-xs text-gray-400">
                        {el.accentColor || "#387ef0"}
                    </span>
                </div>
            </div>

            {/* Card Background Color */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Card Background</span>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={
                            el.cardBg && el.cardBg !== "transparent"
                                ? el.cardBg
                                : "#0f0f1a"
                        }
                        onChange={(e) =>
                            updateElement({ cardBg: e.target.value })
                        }
                        className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />
                    <button
                        type="button"
                        onClick={() => updateElement({ cardBg: "transparent" })}
                        className={`rounded px-1.5 py-0.5 text-[10px] border transition ${
                            el.cardBg === "transparent"
                                ? "border-blue-500 bg-blue-950/40 text-blue-300 font-medium"
                                : "border-gray-700 bg-gray-800 text-gray-400 hover:text-white"
                        }`}
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Border Width */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Border Width</span>
                    <span className="font-mono text-gray-400">
                        {el.cardBorderWidth}px
                    </span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={8}
                    step={1}
                    value={el.cardBorderWidth}
                    onChange={(e) =>
                        updateElement({
                            cardBorderWidth: Number(e.target.value),
                        })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>

            {/* Border Color */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Border Color</span>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={el.cardBorderColor || "#334155"}
                        onChange={(e) =>
                            updateElement({ cardBorderColor: e.target.value })
                        }
                        className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />
                    <span className="font-mono text-xs text-gray-400">
                        {el.cardBorderColor || "#334155"}
                    </span>
                </div>
            </div>

            {/* Border Radius */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Card Radius</span>
                    <span className="font-mono text-gray-400">
                        {el.borderRadius}%
                    </span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={el.borderRadius}
                    onChange={(e) =>
                        updateElement({ borderRadius: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>

            {/* Shadow */}
            <div className="space-y-1.5">
                <span className="text-xs text-gray-300">Shadow</span>
                <div className="grid grid-cols-3 gap-1.5">
                    {SHADOW_OPTIONS.map((s) => (
                        <button
                            key={s.value}
                            type="button"
                            onClick={() => updateElement({ shadow: s.value })}
                            className={`rounded-md py-1.5 text-xs font-medium uppercase transition ${
                                (el.shadow ?? "none") === s.value
                                    ? "border border-blue-500 bg-blue-950/40 text-blue-200 shadow-sm"
                                    : "border border-gray-800 bg-gray-900/60 text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
