"use client";

import React from "react";
import type { TimelineElement } from "../../../types/timeline";

export const TIMELINE_FONT_FAMILIES = [
    "Inter, sans-serif",
    "Arial, sans-serif",
    "Roboto, sans-serif",
    "Georgia, serif",
    "'Fira Code', monospace",
    "'Outfit', sans-serif",
];

export function TimelineTypographySection({
    timeline: tl,
    updateTimeline,
}: {
    timeline: TimelineElement;
    updateTimeline: (updates: Partial<TimelineElement>) => void;
}) {
    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Typography & Text
            </label>

            {/* Font Family */}
            <div>
                <label className="mb-1 block text-xs text-gray-400">
                    Font Family
                </label>
                <select
                    value={tl.fontFamily}
                    onChange={(e) =>
                        updateTimeline({ fontFamily: e.target.value })
                    }
                    className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1.5 text-xs text-white outline-none"
                >
                    {TIMELINE_FONT_FAMILIES.map((f) => (
                        <option key={f} value={f}>
                            {f.split(",")[0].replace(/'/g, "")}
                        </option>
                    ))}
                </select>
            </div>

            {/* Title Font Size & Color */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-xs text-gray-400">
                            Title Size
                        </label>
                        <span className="text-xs text-gray-500">
                            {tl.titleFontSize ?? 15}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="36"
                        step="1"
                        value={tl.titleFontSize ?? 15}
                        onChange={(e) =>
                            updateTimeline({
                                titleFontSize: Number(e.target.value),
                            })
                        }
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs text-gray-400">
                        Title Color
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={tl.titleColor || "#ffffff"}
                            onChange={(e) =>
                                updateTimeline({ titleColor: e.target.value })
                            }
                            className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                        <span className="font-mono text-[10px] text-gray-400">
                            {tl.titleColor || "#ffffff"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Subtitle / Org Font Size & Color */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-xs text-gray-400">
                            Subtitle / Org Size
                        </label>
                        <span className="text-xs text-gray-500">
                            {tl.subtitleFontSize ?? 12}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="24"
                        step="1"
                        value={tl.subtitleFontSize ?? 12}
                        onChange={(e) =>
                            updateTimeline({
                                subtitleFontSize: Number(e.target.value),
                            })
                        }
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs text-gray-400">
                        Subtitle Color
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={tl.subtitleColor || "#94a3b8"}
                            onChange={(e) =>
                                updateTimeline({
                                    subtitleColor: e.target.value,
                                })
                            }
                            className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                        <span className="font-mono text-[10px] text-gray-400">
                            {tl.subtitleColor || "#94a3b8"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Date / Period Font Size & Color */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-xs text-gray-400">
                            Date / Period Size
                        </label>
                        <span className="text-xs text-gray-500">
                            {tl.dateFontSize ?? 11}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min="9"
                        max="22"
                        step="1"
                        value={tl.dateFontSize ?? 11}
                        onChange={(e) =>
                            updateTimeline({
                                dateFontSize: Number(e.target.value),
                            })
                        }
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs text-gray-400">
                        Date Color
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={tl.dateColor || "#38bdf8"}
                            onChange={(e) =>
                                updateTimeline({ dateColor: e.target.value })
                            }
                            className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                        <span className="font-mono text-[10px] text-gray-400">
                            {tl.dateColor || "#38bdf8"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tag / Badge Font Size & Color */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-xs text-gray-400">
                            Tag / Badge Size
                        </label>
                        <span className="text-xs text-gray-500">
                            {tl.tagFontSize ?? 10}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min="8"
                        max="20"
                        step="1"
                        value={tl.tagFontSize ?? 10}
                        onChange={(e) =>
                            updateTimeline({
                                tagFontSize: Number(e.target.value),
                            })
                        }
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs text-gray-400">
                        Tag Color
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={tl.tagColor || tl.accentColor || "#3b82f6"}
                            onChange={(e) =>
                                updateTimeline({ tagColor: e.target.value })
                            }
                            className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                        <span className="font-mono text-[10px] text-gray-400">
                            {tl.tagColor || tl.accentColor || "#3b82f6"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Body Text Size & Color */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-xs text-gray-400">
                            Body Size
                        </label>
                        <span className="text-xs text-gray-500">
                            {tl.bodyFontSize ?? 12}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="24"
                        step="1"
                        value={tl.bodyFontSize ?? 12}
                        onChange={(e) =>
                            updateTimeline({
                                bodyFontSize: Number(e.target.value),
                            })
                        }
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs text-gray-400">
                        Body Color
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={tl.textColor || "#e2e8f0"}
                            onChange={(e) =>
                                updateTimeline({ textColor: e.target.value })
                            }
                            className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                        <span className="font-mono text-[10px] text-gray-400">
                            {tl.textColor || "#e2e8f0"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
