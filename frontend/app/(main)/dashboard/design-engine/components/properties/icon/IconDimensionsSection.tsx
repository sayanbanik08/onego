"use client";

import React from "react";
import type { IconElement, IconDimensionUnit } from "../../../types/icon";

type IconDimensionsSectionProps = {
    element: IconElement;
    updateElement: (updates: Partial<IconElement>) => void;
};

export default function IconDimensionsSection({
    element,
    updateElement,
}: IconDimensionsSectionProps) {
    const widthUnit: IconDimensionUnit = element.widthUnit || "px";
    const heightUnit: IconDimensionUnit = element.heightUnit || "px";

    const isWidthPx = widthUnit === "px";
    const isHeightPx = heightUnit === "px";

    const widthMin = isWidthPx ? 20 : 10;
    const widthMax = isWidthPx ? 300 : 100;

    const heightMin = isHeightPx ? 20 : 10;
    const heightMax = isHeightPx ? 300 : 100;

    return (
        <div className="space-y-3.5 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Icon Dimensions
            </span>

            {/* ── Width ─────────────────────────────────────────────────── */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Width</span>
                    <div className="flex items-center gap-2">
                        {/* Number Input */}
                        <input
                            type="number"
                            min={widthMin}
                            max={widthMax}
                            value={element.width ?? 64}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                if (!isNaN(val)) {
                                    updateElement({ width: Math.max(1, val) });
                                }
                            }}
                            className="w-14 rounded border border-gray-700 bg-gray-950 px-1.5 py-0.5 text-right font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                        />

                        {/* Unit Toggle (PX / %) */}
                        <div className="flex rounded border border-gray-800 bg-gray-950 p-0.5">
                            <button
                                type="button"
                                onClick={() => {
                                    if (widthUnit !== "px") {
                                        updateElement({
                                            widthUnit: "px",
                                            width: Math.min(300, Math.max(20, Math.round((element.width / 100) * 100))),
                                        });
                                    }
                                }}
                                className={`px-1.5 py-0.5 text-[10px] rounded ${
                                    isWidthPx
                                        ? "bg-blue-600 text-white font-medium"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                PX
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (widthUnit !== "%") {
                                        updateElement({
                                            widthUnit: "%",
                                            width: 100,
                                        });
                                    }
                                }}
                                className={`px-1.5 py-0.5 text-[10px] rounded ${
                                    !isWidthPx
                                        ? "bg-blue-600 text-white font-medium"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                %
                            </button>
                        </div>
                    </div>
                </div>

                {/* Slider */}
                <input
                    type="range"
                    min={widthMin}
                    max={widthMax}
                    step={1}
                    value={element.width ?? 64}
                    onChange={(e) =>
                        updateElement({ width: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>

            {/* ── Height ────────────────────────────────────────────────── */}
            <div className="space-y-2 border-t border-gray-800/80 pt-2.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Height</span>
                    <div className="flex items-center gap-2">
                        {/* Number Input */}
                        <input
                            type="number"
                            min={heightMin}
                            max={heightMax}
                            value={element.height ?? 64}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                if (!isNaN(val)) {
                                    updateElement({ height: Math.max(1, val) });
                                }
                            }}
                            className="w-14 rounded border border-gray-700 bg-gray-950 px-1.5 py-0.5 text-right font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                        />

                        {/* Unit Toggle (PX / %) */}
                        <div className="flex rounded border border-gray-800 bg-gray-950 p-0.5">
                            <button
                                type="button"
                                onClick={() => {
                                    if (heightUnit !== "px") {
                                        updateElement({
                                            heightUnit: "px",
                                            height: Math.min(300, Math.max(20, Math.round((element.height / 100) * 100))),
                                        });
                                    }
                                }}
                                className={`px-1.5 py-0.5 text-[10px] rounded ${
                                    isHeightPx
                                        ? "bg-blue-600 text-white font-medium"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                PX
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (heightUnit !== "%") {
                                        updateElement({
                                            heightUnit: "%",
                                            height: 100,
                                        });
                                    }
                                }}
                                className={`px-1.5 py-0.5 text-[10px] rounded ${
                                    !isHeightPx
                                        ? "bg-blue-600 text-white font-medium"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                %
                            </button>
                        </div>
                    </div>
                </div>

                {/* Slider */}
                <input
                    type="range"
                    min={heightMin}
                    max={heightMax}
                    step={1}
                    value={element.height ?? 64}
                    onChange={(e) =>
                        updateElement({ height: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>
        </div>
    );
}
