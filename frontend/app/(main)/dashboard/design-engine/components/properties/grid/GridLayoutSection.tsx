"use client";

import React from "react";
import { Columns, Sparkles, LayoutGrid, Plus, Minus } from "lucide-react";
import type { GridElement, GridLayoutPreset } from "../../../types/grid";

type GridLayoutSectionProps = {
    element: GridElement;
    updateElement: (updates: Partial<GridElement>) => void;
};

const GRID_PRESETS: {
    id: GridLayoutPreset;
    label: string;
    description: string;
    defaultCols: number;
    defaultRows: number;
    defaultGap: number;
    defaultCount: number;
    previewBadge: string;
}[] = [
    {
        id: "pinterest-masonry",
        label: "Pinterest Masonry",
        description: "Staggered waterfall columns with dynamic card heights",
        defaultCols: 3,
        defaultRows: 3,
        defaultGap: 14,
        defaultCount: 6,
        previewBadge: "📌",
    },
    {
        id: "bento-modern",
        label: "Bento Box",
        description: "Modern Apple/Vercel asymmetric feature grid",
        defaultCols: 4,
        defaultRows: 3,
        defaultGap: 12,
        defaultCount: 6,
        previewBadge: "🍱",
    },
    {
        id: "featured-split",
        label: "Split Hero",
        description: "Tall featured vertical hero on left with 2x2 cards",
        defaultCols: 3,
        defaultRows: 2,
        defaultGap: 12,
        defaultCount: 5,
        previewBadge: "🪟",
    },
    {
        id: "editorial-magazine",
        label: "Editorial Magazine",
        description: "Full-width header banner with 3 cards below",
        defaultCols: 3,
        defaultRows: 2,
        defaultGap: 14,
        defaultCount: 4,
        previewBadge: "📰",
    },
    {
        id: "classic-uniform",
        label: "Classic Uniform",
        description: "Balanced symmetrical rows and columns",
        defaultCols: 3,
        defaultRows: 3,
        defaultGap: 12,
        defaultCount: 9,
        previewBadge: "▦",
    },
    {
        id: "custom",
        label: "Custom Grid",
        description: "Full manual control over rows, columns & cells",
        defaultCols: 3,
        defaultRows: 2,
        defaultGap: 12,
        defaultCount: 6,
        previewBadge: "⚙️",
    },
];

export default function GridLayoutSection({
    element,
    updateElement,
}: GridLayoutSectionProps) {
    const handleSelectPreset = (preset: (typeof GRID_PRESETS)[0]) => {
        updateElement({
            layoutPreset: preset.id,
            columns: preset.defaultCols,
            rows: preset.defaultRows,
            gap: preset.defaultGap,
            cellCount: preset.defaultCount,
        });
    };

    return (
        <div className="space-y-3.5 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                    <LayoutGrid size={14} className="text-blue-400 shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">
                        Grid Layout & Presets
                    </span>
                </div>
                <span className="text-[10px] text-gray-500 capitalize">
                    {element.layoutPreset.replace("-", " ")}
                </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-1.5">
                {GRID_PRESETS.map((preset) => {
                    const isSelected = element.layoutPreset === preset.id;
                    return (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPreset(preset)}
                            className={`flex items-center justify-between rounded-lg border p-2 text-left transition ${
                                isSelected
                                    ? "border-blue-500 bg-blue-600/15 text-white ring-1 ring-blue-500/50"
                                    : "border-gray-800 bg-gray-950/60 text-gray-400 hover:border-gray-700 hover:text-white"
                            }`}
                        >
                            <span className="text-xs font-medium text-white truncate mr-1">
                                {preset.label}
                            </span>
                            <span className="text-xs shrink-0">
                                {preset.previewBadge}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Grid Columns, Rows & Count Controls (Normal inputs without slider limits) */}
            <div className="space-y-2.5 border-t border-gray-800/80 pt-2.5">
                {/* Columns */}
                <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950/70 px-3 py-2">
                    <div>
                        <div className="text-xs font-medium text-gray-200">Columns</div>
                        <div className="text-[10px] text-gray-500">Number of vertical columns</div>
                    </div>
                    <div className="flex items-center rounded-md border border-gray-700 bg-gray-900 p-0.5">
                        <button
                            type="button"
                            onClick={() => {
                                const nextCols = Math.max(1, (element.columns ?? 3) - 1);
                                updateElement({
                                    columns: nextCols,
                                    ...(element.layoutPreset !== "custom" &&
                                    element.layoutPreset !== "pinterest-masonry"
                                        ? { layoutPreset: "custom" }
                                        : {}),
                                });
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-gray-800 hover:text-white transition active:scale-95"
                            title="Decrease columns"
                        >
                            <Minus size={13} />
                        </button>
                        <input
                            type="number"
                            min={1}
                            value={element.columns ?? 3}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                updateElement({
                                    columns: isNaN(val) ? 1 : Math.max(1, val),
                                    ...(element.layoutPreset !== "custom" &&
                                    element.layoutPreset !== "pinterest-masonry"
                                        ? { layoutPreset: "custom" }
                                        : {}),
                                });
                            }}
                            className="w-14 bg-transparent text-center font-mono text-xs text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                const nextCols = (element.columns ?? 3) + 1;
                                updateElement({
                                    columns: nextCols,
                                    ...(element.layoutPreset !== "custom" &&
                                    element.layoutPreset !== "pinterest-masonry"
                                        ? { layoutPreset: "custom" }
                                        : {}),
                                });
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-gray-800 hover:text-white transition active:scale-95"
                            title="Increase columns"
                        >
                            <Plus size={13} />
                        </button>
                    </div>
                </div>

                {/* Rows (applicable to non-pinterest layouts) */}
                {element.layoutPreset !== "pinterest-masonry" && (
                    <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950/70 px-3 py-2">
                        <div>
                            <div className="text-xs font-medium text-gray-200">Rows</div>
                            <div className="text-[10px] text-gray-500">Number of horizontal rows</div>
                        </div>
                        <div className="flex items-center rounded-md border border-gray-700 bg-gray-900 p-0.5">
                            <button
                                type="button"
                                onClick={() => {
                                    const nextRows = Math.max(1, (element.rows ?? 3) - 1);
                                    updateElement({
                                        rows: nextRows,
                                        ...(element.layoutPreset !== "custom"
                                            ? { layoutPreset: "custom" }
                                            : {}),
                                    });
                                }}
                                className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-gray-800 hover:text-white transition active:scale-95"
                                title="Decrease rows"
                            >
                                <Minus size={13} />
                            </button>
                            <input
                                type="number"
                                min={1}
                                value={element.rows ?? 3}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    updateElement({
                                        rows: isNaN(val) ? 1 : Math.max(1, val),
                                        ...(element.layoutPreset !== "custom"
                                            ? { layoutPreset: "custom" }
                                            : {}),
                                    });
                                }}
                                className="w-14 bg-transparent text-center font-mono text-xs text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const nextRows = (element.rows ?? 3) + 1;
                                    updateElement({
                                        rows: nextRows,
                                        ...(element.layoutPreset !== "custom"
                                            ? { layoutPreset: "custom" }
                                            : {}),
                                    });
                                }}
                                className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-gray-800 hover:text-white transition active:scale-95"
                                title="Increase rows"
                            >
                                <Plus size={13} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Number of Skeleton Pins / Cells (for Pinterest & Custom) */}
                {(element.layoutPreset === "pinterest-masonry" ||
                    element.layoutPreset === "custom") && (
                    <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950/70 px-3 py-2">
                        <div>
                            <div className="text-xs font-medium text-gray-200">
                                {element.layoutPreset === "pinterest-masonry"
                                    ? "Total Pins"
                                    : "Total Cells"}
                            </div>
                            <div className="text-[10px] text-gray-500">
                                {element.layoutPreset === "pinterest-masonry"
                                    ? "Pins in waterfall layout"
                                    : "Placeholder cells in grid"}
                            </div>
                        </div>
                        <div className="flex items-center rounded-md border border-gray-700 bg-gray-900 p-0.5">
                            <button
                                type="button"
                                onClick={() => {
                                    const nextCount = Math.max(1, (element.cellCount ?? 6) - 1);
                                    updateElement({ cellCount: nextCount });
                                }}
                                className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-gray-800 hover:text-white transition active:scale-95"
                                title="Decrease total count"
                            >
                                <Minus size={13} />
                            </button>
                            <input
                                type="number"
                                min={1}
                                value={element.cellCount ?? 6}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    updateElement({
                                        cellCount: isNaN(val) ? 1 : Math.max(1, val),
                                    });
                                }}
                                className="w-14 bg-transparent text-center font-mono text-xs text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const nextCount = (element.cellCount ?? 6) + 1;
                                    updateElement({ cellCount: nextCount });
                                }}
                                className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-gray-800 hover:text-white transition active:scale-95"
                                title="Increase total count"
                            >
                                <Plus size={13} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Gap Slider */}
                <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Grid Gap</span>
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                min={0}
                                value={element.gap ?? 14}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    updateElement({ gap: isNaN(val) ? 0 : Math.max(0, val) });
                                }}
                                className="w-12 rounded border border-gray-700 bg-gray-950 px-1 py-0.5 text-center font-mono text-xs text-white focus:border-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="text-gray-500 text-[10px]">px</span>
                        </div>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={60}
                        step={1}
                        value={element.gap ?? 14}
                        onChange={(e) =>
                            updateElement({ gap: Number(e.target.value) })
                        }
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>
            </div>
        </div>
    );
}
