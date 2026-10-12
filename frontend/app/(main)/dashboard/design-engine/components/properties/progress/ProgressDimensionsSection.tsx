"use client";

import React from "react";
import type { ProgressElement } from "../../../types/progress";

type ProgressDimensionsSectionProps = {
    element: ProgressElement;
    updateElement: (updates: Partial<ProgressElement>) => void;
};

export default function ProgressDimensionsSection({
    element,
    updateElement,
}: ProgressDimensionsSectionProps) {
    const widthUnit = element.widthUnit ?? "px";
    const heightUnit = element.heightUnit ?? "px";

    const widthMin = widthUnit === "%" ? 10 : 160;
    const widthMax = widthUnit === "%" ? 100 : 1200;

    const heightMin = heightUnit === "%" ? 10 : 80;
    const heightMax = heightUnit === "%" ? 100 : 800;

    return (
        <div className="space-y-3.5 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Chart Dimensions
            </span>

            {/* ── Width ─────────────────────────────────────────────────── */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Total Width</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min={widthMin}
                            max={widthMax}
                            value={element.width ?? 580}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                if (!isNaN(val)) {
                                    updateElement({ width: Math.max(10, val) });
                                }
                            }}
                            className="w-16 rounded border border-gray-700 bg-gray-950 px-1.5 py-0.5 text-right font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                        />

                        {/* Unit Toggle (PX / %) */}
                        <div className="flex rounded border border-gray-800 bg-gray-950 p-0.5">
                            <button
                                type="button"
                                onClick={() => {
                                    if (widthUnit !== "px") {
                                        updateElement({
                                            widthUnit: "px",
                                            width: 580,
                                        });
                                    }
                                }}
                                className={`px-1.5 py-0.5 text-[10px] rounded ${
                                    widthUnit === "px"
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
                                            width: 60,
                                        });
                                    }
                                }}
                                className={`px-1.5 py-0.5 text-[10px] rounded ${
                                    widthUnit === "%"
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
                    min={widthMin}
                    max={widthMax}
                    step={1}
                    value={element.width ?? 580}
                    onChange={(e) =>
                        updateElement({ width: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>

            {/* ── Height ────────────────────────────────────────────────── */}
            <div className="space-y-2 border-t border-gray-800/80 pt-2.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Total Height</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min={heightMin}
                            max={heightMax}
                            value={element.height ?? 250}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                if (!isNaN(val)) {
                                    updateElement({ height: Math.max(10, val) });
                                }
                            }}
                            className="w-16 rounded border border-gray-700 bg-gray-950 px-1.5 py-0.5 text-right font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                        />

                        {/* Unit Toggle (PX / %) */}
                        <div className="flex rounded border border-gray-800 bg-gray-950 p-0.5">
                            <button
                                type="button"
                                onClick={() => {
                                    if (heightUnit !== "px") {
                                        updateElement({
                                            heightUnit: "px",
                                            height: 250,
                                        });
                                    }
                                }}
                                className={`px-1.5 py-0.5 text-[10px] rounded ${
                                    heightUnit === "px"
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
                                            height: 40,
                                        });
                                    }
                                }}
                                className={`px-1.5 py-0.5 text-[10px] rounded ${
                                    heightUnit === "%"
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
                    min={heightMin}
                    max={heightMax}
                    step={1}
                    value={element.height ?? 250}
                    onChange={(e) =>
                        updateElement({ height: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>
        </div>
    );
}
