"use client";

import React from "react";
import type { TimelineElement } from "../../../types/timeline";

export function TimelineNodesConnectorsSection({
    timeline: tl,
    updateTimeline,
}: {
    timeline: TimelineElement;
    updateTimeline: (updates: Partial<TimelineElement>) => void;
}) {
    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Nodes & Connectors
            </label>

            {/* Node Shape */}
            <div>
                <span className="mb-1.5 block text-xs text-gray-400">
                    Node Shape
                </span>
                <div className="grid grid-cols-4 gap-1">
                    {(["circle", "square", "diamond", "hexagon"] as const).map(
                        (sh) => (
                            <button
                                key={sh}
                                type="button"
                                onClick={() => updateTimeline({ nodeShape: sh })}
                                className={`rounded py-1 text-xs capitalize transition ${
                                    tl.nodeShape === sh
                                        ? "bg-blue-600 text-white font-semibold"
                                        : "bg-gray-800 text-gray-400 hover:text-white"
                                }`}
                            >
                                {sh}
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Node Size */}
            <div>
                <div className="mb-1 flex justify-between">
                    <label className="text-xs text-gray-400">Node Size</label>
                    <span className="text-xs text-gray-500">{tl.nodeSize}px</span>
                </div>
                <input
                    type="range"
                    min="16"
                    max="48"
                    step="2"
                    value={tl.nodeSize}
                    onChange={(e) =>
                        updateTimeline({ nodeSize: Number(e.target.value) })
                    }
                    className="w-full"
                />
            </div>

            {/* Line Thickness */}
            <div>
                <div className="mb-1 flex justify-between">
                    <label className="text-xs text-gray-400">
                        Line Thickness
                    </label>
                    <span className="text-xs text-gray-500">{tl.lineWidth}px</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={tl.lineWidth}
                    onChange={(e) =>
                        updateTimeline({ lineWidth: Number(e.target.value) })
                    }
                    className="w-full"
                />
            </div>

            {/* Item Spacing */}
            <div>
                <div className="mb-1 flex justify-between">
                    <label className="text-xs text-gray-400">Item Spacing</label>
                    <span className="text-xs text-gray-500">{tl.spacing}px</span>
                </div>
                <input
                    type="range"
                    min="12"
                    max="72"
                    step="2"
                    value={tl.spacing}
                    onChange={(e) =>
                        updateTimeline({ spacing: Number(e.target.value) })
                    }
                    className="w-full"
                />
            </div>

            {/* Card Border Radius */}
            <div>
                <div className="mb-1 flex justify-between">
                    <label className="text-xs text-gray-400">Card Radius</label>
                    <span className="text-xs text-gray-500">
                        {tl.borderRadius}px
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="32"
                    step="2"
                    value={tl.borderRadius}
                    onChange={(e) =>
                        updateTimeline({ borderRadius: Number(e.target.value) })
                    }
                    className="w-full"
                />
            </div>

            {/* Card Width */}
            <div>
                <div className="mb-1 flex justify-between">
                    <label className="text-xs text-gray-400">Card Width</label>
                    <span className="text-xs text-gray-500">
                        {tl.cardWidth ?? 480}px
                    </span>
                </div>
                <input
                    type="range"
                    min="240"
                    max="850"
                    step="10"
                    value={tl.cardWidth ?? 480}
                    onChange={(e) =>
                        updateTimeline({ cardWidth: Number(e.target.value) })
                    }
                    className="w-full"
                />
            </div>

            {/* Card Min Height */}
            <div>
                <div className="mb-1 flex justify-between">
                    <label className="text-xs text-gray-400">
                        Card Min Height
                    </label>
                    <span className="text-xs text-gray-500">
                        {tl.cardMinHeight ?? 60}px
                    </span>
                </div>
                <input
                    type="range"
                    min="40"
                    max="250"
                    step="5"
                    value={tl.cardMinHeight ?? 60}
                    onChange={(e) =>
                        updateTimeline({
                            cardMinHeight: Number(e.target.value),
                        })
                    }
                    className="w-full"
                />
            </div>

            {/* Card Border Width */}
            <div>
                <div className="mb-1 flex justify-between">
                    <label className="text-xs text-gray-400">
                        Card Border Width
                    </label>
                    <span className="text-xs text-gray-500">
                        {tl.cardBorderWidth}px
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="8"
                    step="1"
                    value={tl.cardBorderWidth}
                    onChange={(e) =>
                        updateTimeline({
                            cardBorderWidth: Number(e.target.value),
                        })
                    }
                    className="w-full"
                />
            </div>
        </div>
    );
}
