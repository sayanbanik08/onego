"use client";

import React from "react";
import { LayoutGrid, BarChart2 } from "lucide-react";
import type { ProgressElement, ProgressDesignPreset } from "../../../types/progress";

type ProgressLayoutSectionProps = {
    element: ProgressElement;
    updateElement: (updates: Partial<ProgressElement>) => void;
};

const PRESETS: {
    id: ProgressDesignPreset;
    label: string;
    description: string;
    previewBadge: string;
}[] = [
    {
        id: "vertical-pill",
        label: "Vertical Pills",
        description: "Minimal pill columns with top % and bottom labels",
        previewBadge: "📊",
    },
    {
        id: "horizontal-bar",
        label: "Horizontal Bars",
        description: "Clean progress rows with labels and % badges",
        previewBadge: "📈",
    },
    {
        id: "circular-donut",
        label: "Donut / Pie",
        description: "Radial donut chart with average % & legend",
        previewBadge: "🍩",
    },
    {
        id: "histogram",
        label: "Histogram",
        description: "Stepped distribution columns with baseline",
        previewBadge: "📶",
    },
    {
        id: "capsule-gauge",
        label: "Capsule Gauge",
        description: "Segmented metric meters with efficiency level",
        previewBadge: "🔋",
    },
];

export default function ProgressLayoutSection({
    element,
    updateElement,
}: ProgressLayoutSectionProps) {
    return (
        <div className="space-y-3.5 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                    <BarChart2 size={14} className="text-blue-400 shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">
                        Chart Design Presets
                    </span>
                </div>
                <span className="text-[10px] text-gray-500 capitalize">
                    {element.designPreset?.replace("-", " ") || "Vertical Pill"}
                </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-1.5">
                {PRESETS.map((preset) => {
                    const isSelected = element.designPreset === preset.id;
                    return (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => updateElement({ designPreset: preset.id })}
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
        </div>
    );
}
