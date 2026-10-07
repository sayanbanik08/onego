"use client";

import React from "react";
import type { TimelineElement } from "../../../types/timeline";

export function TimelineColorsSection({
    timeline: tl,
    updateTimeline,
    onAccentColorChange,
}: {
    timeline: TimelineElement;
    updateTimeline: (updates: Partial<TimelineElement>) => void;
    onAccentColorChange: (newColor: string) => void;
}) {
    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Color Palette
            </label>

            {/* Accent Color (Fully reactive) */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Accent Color</span>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={tl.accentColor}
                        onChange={(e) => onAccentColorChange(e.target.value)}
                        className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />
                    <span className="font-mono text-xs text-gray-400">
                        {tl.accentColor}
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
                            tl.cardBg && tl.cardBg !== "transparent"
                                ? tl.cardBg
                                : "#0f172a"
                        }
                        onChange={(e) =>
                            updateTimeline({ cardBg: e.target.value })
                        }
                        className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />
                    <button
                        type="button"
                        onClick={() => updateTimeline({ cardBg: "transparent" })}
                        className={`rounded px-1.5 py-0.5 text-[10px] border transition ${
                            tl.cardBg === "transparent"
                                ? "border-blue-500 bg-blue-950/40 text-blue-300 font-medium"
                                : "border-gray-700 bg-gray-800 text-gray-400 hover:text-white"
                        }`}
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Connector Line Color */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Line Color</span>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={tl.lineColor}
                        onChange={(e) =>
                            updateTimeline({ lineColor: e.target.value })
                        }
                        className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />
                    <span className="font-mono text-xs text-gray-400">
                        {tl.lineColor}
                    </span>
                </div>
            </div>

            {/* Card Border Color */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Border Color</span>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={
                            tl.cardBorderColor &&
                            tl.cardBorderColor.startsWith("#")
                                ? tl.cardBorderColor
                                : "#334155"
                        }
                        onChange={(e) =>
                            updateTimeline({ cardBorderColor: e.target.value })
                        }
                        className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />
                    <span className="font-mono text-xs text-gray-400">
                        {tl.cardBorderColor || "auto"}
                    </span>
                </div>
            </div>
        </div>
    );
}
