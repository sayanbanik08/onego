"use client";

import React from "react";
import type { GridElement, GridDimensionUnit } from "../../../types/grid";

type GridDimensionsSectionProps = {
    element: GridElement;
    updateElement: (updates: Partial<GridElement>) => void;
};

export default function GridDimensionsSection({
    element,
    updateElement,
}: GridDimensionsSectionProps) {
    const widthUnit: GridDimensionUnit = element.widthUnit || "px";
    const heightUnit: GridDimensionUnit = element.heightUnit || "px";

    const isWidthPx = widthUnit === "px";
    const isHeightPx = heightUnit === "px";

    const widthMin = isWidthPx ? 100 : 10;
    const widthMax = isWidthPx ? 1200 : 100;

    const heightMin = isHeightPx ? 100 : 10;
    const heightMax = isHeightPx ? 1400 : 100;

    return (
        <div className="space-y-3.5 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Grid Dimensions
            </span>

            {/* ── Width ─────────────────────────────────────────────────── */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Total Width</span>
                    <div className="flex items-center gap-2">
                        {/* Number Input */}
                        <input
                            type="number"
                            min={widthMin}
                            max={widthMax}
                            value={element.width ?? 380}
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
                                            width: Math.min(1200, Math.max(100, Math.round((element.width / 100) * 380))),
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
                    value={element.width ?? 380}
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
                        {/* Number Input */}
                        <input
                            type="number"
                            min={heightMin}
                            max={heightMax}
                            value={element.height ?? 440}
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
                                            height: Math.min(1400, Math.max(100, Math.round((element.height / 100) * 440))),
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
                    value={element.height ?? 440}
                    onChange={(e) =>
                        updateElement({ height: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>

            {/* ── Base Cell Height (PX) ─────────────────────────────────── */}
            <div className="space-y-1 border-t border-gray-800/80 pt-2.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Base Cell Height</span>
                    <span className="font-mono text-gray-400">
                        {element.cellHeight ?? 120}px
                    </span>
                </div>
                <input
                    type="range"
                    min={40}
                    max={300}
                    step={2}
                    value={element.cellHeight ?? 120}
                    onChange={(e) =>
                        updateElement({ cellHeight: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>
        </div>
    );
}
