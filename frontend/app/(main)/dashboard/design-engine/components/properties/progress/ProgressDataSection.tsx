"use client";

import React from "react";
import { Plus, Trash2, ListFilter } from "lucide-react";
import type { ProgressElement, ProgressItem } from "../../../types/progress";

type ProgressDataSectionProps = {
    element: ProgressElement;
    updateElement: (updates: Partial<ProgressElement>) => void;
};

const TRACK_COLOR_PALETTE = [
    "#f0f0f2", // Light soft gray (matches screenshot)
    "rgba(255, 255, 255, 0.08)", // Dark subtle
    "#18181b", // Zinc 900
    "#27272a", // Zinc 800
    "#1e293b", // Slate 800
    "transparent",
];

export default function ProgressDataSection({
    element,
    updateElement,
}: ProgressDataSectionProps) {
    const items = element.items || [];

    const getValidHexColor = (colorStr?: string, defaultHex = "#ffff00") => {
        if (!colorStr || colorStr === "transparent" || colorStr.startsWith("rgba"))
            return defaultHex;
        if (colorStr.startsWith("#")) {
            if (colorStr.length >= 7) return colorStr.slice(0, 7);
            return colorStr;
        }
        return defaultHex;
    };

    const handleUpdateItem = (
        id: string,
        updates: Partial<ProgressItem>
    ) => {
        const updated = items.map((it) =>
            it.id === id ? { ...it, ...updates } : it
        );
        updateElement({ items: updated });
    };

    const handleAddItem = () => {
        const newItem: ProgressItem = {
            id: crypto.randomUUID(),
            label: `Item ${items.length + 1}`,
            value: 70,
            color: element.barColor || "#ffff00",
            trackColor: element.trackColor || "#f0f0f2",
        };
        updateElement({ items: [...items, newItem] });
    };

    const handleDeleteItem = (id: string) => {
        if (items.length <= 1) return;
        updateElement({ items: items.filter((it) => it.id !== id) });
    };

    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between gap-1 w-full min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <ListFilter size={14} className="text-blue-400 shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">
                        Data Items ({items.length})
                    </span>
                </div>
                <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-1 rounded bg-blue-600/20 px-2 py-0.5 text-[11px] font-medium text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition shrink-0"
                >
                    <Plus size={12} />
                    <span>Add Item</span>
                </button>
            </div>

            {/* ── Global Track Background (Fix 2) ─────────────────────────── */}
            <div className="rounded-lg border border-gray-800 bg-gray-950/70 p-2.5 space-y-2 w-full min-w-0">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300 font-medium">
                        Track Background
                    </span>
                    <div className="flex items-center gap-1.5">
                        <input
                            type="color"
                            value={getValidHexColor(element.trackColor, "#f0f0f2")}
                            onChange={(e) =>
                                updateElement({ trackColor: e.target.value })
                            }
                            className="h-6 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900 shrink-0"
                        />
                        <span className="font-mono text-[11px] text-gray-400 truncate max-w-[60px]">
                            {element.trackColor || "#f0f0f2"}
                        </span>
                    </div>
                </div>

                {/* Quick Track palette dots */}
                <div className="flex items-center gap-1.5 pt-0.5">
                    {TRACK_COLOR_PALETTE.map((c, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => updateElement({ trackColor: c })}
                            style={{ backgroundColor: c }}
                            className={`h-4.5 w-4.5 rounded-full border transition ${
                                element.trackColor === c
                                    ? "border-blue-400 ring-2 ring-blue-500/50 scale-110"
                                    : "border-gray-700 hover:scale-105"
                            }`}
                            title={c}
                        />
                    ))}
                </div>
            </div>

            {/* ── Items List (Fix 6: Fully responsive without width scroll) ─ */}
            <div className="space-y-2 max-h-72 overflow-y-auto overflow-x-hidden pr-0.5 w-full min-w-0">
                {items.map((item, idx) => {
                    const itemBarColor = item.color || element.barColor || "#ffff00";
                    const itemTrackColor = item.trackColor || element.trackColor || "#f0f0f2";

                    return (
                        <div
                            key={item.id}
                            className="rounded-lg border border-gray-800 bg-gray-950/70 p-2.5 space-y-2 text-xs w-full min-w-0 overflow-hidden box-border"
                        >
                            {/* Row 1: Index, Name Input, Delete */}
                            <div className="flex items-center gap-1.5 w-full min-w-0">
                                <span className="font-mono text-[10px] text-gray-500 shrink-0">
                                    #{idx + 1}
                                </span>

                                <input
                                    type="text"
                                    value={item.label}
                                    placeholder="Item name"
                                    onChange={(e) =>
                                        handleUpdateItem(item.id, {
                                            label: e.target.value,
                                        })
                                    }
                                    className="flex-1 min-w-0 w-full rounded border border-gray-800 bg-gray-900 px-2 py-1 text-xs text-white focus:border-blue-500 focus:outline-none"
                                />

                                {items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="text-gray-500 hover:text-red-400 transition p-1 shrink-0"
                                        title="Remove item"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                )}
                            </div>

                            {/* Row 2: Efficiency Slider & Numeric Input */}
                            <div className="flex items-center gap-2 w-full min-w-0">
                                <span className="text-[11px] text-gray-400 shrink-0">
                                    Eff:
                                </span>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={item.value}
                                    onChange={(e) =>
                                        handleUpdateItem(item.id, {
                                            value: Number(e.target.value),
                                        })
                                    }
                                    className="flex-1 min-w-0 w-full cursor-pointer accent-yellow-400 h-1.5 bg-gray-800 rounded"
                                />
                                <div className="flex items-center gap-0.5 shrink-0">
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={item.value}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value, 10);
                                            handleUpdateItem(item.id, {
                                                value: isNaN(val)
                                                    ? 0
                                                    : Math.min(100, Math.max(0, val)),
                                            });
                                        }}
                                        className="w-10 rounded border border-gray-800 bg-gray-900 px-1 py-0.5 text-center font-mono text-[11px] text-white focus:border-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="text-[10px] font-mono text-gray-500">
                                        %
                                    </span>
                                </div>
                            </div>

                            {/* Row 3: Colors for THIS item (Bar Fill + Track Background) */}
                            <div className="flex items-center justify-between border-t border-gray-800/60 pt-2 w-full min-w-0">
                                {/* Bar Fill Color */}
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-[10px] text-gray-400 shrink-0">
                                        Bar:
                                    </span>
                                    <input
                                        type="color"
                                        value={getValidHexColor(itemBarColor, "#ffff00")}
                                        onChange={(e) =>
                                            handleUpdateItem(item.id, {
                                                color: e.target.value,
                                            })
                                        }
                                        className="h-5 w-7 cursor-pointer rounded border border-gray-700 bg-gray-900 shrink-0"
                                        title="Bar Fill Color"
                                    />
                                </div>

                                {/* Track Color */}
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-[10px] text-gray-400 shrink-0">
                                        Track:
                                    </span>
                                    <input
                                        type="color"
                                        value={getValidHexColor(itemTrackColor, "#f0f0f2")}
                                        onChange={(e) =>
                                            handleUpdateItem(item.id, {
                                                trackColor: e.target.value,
                                            })
                                        }
                                        className="h-5 w-7 cursor-pointer rounded border border-gray-700 bg-gray-900 shrink-0"
                                        title="Track Background Color"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
