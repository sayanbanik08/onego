"use client";

import React from "react";
import type {
    TimelineElement,
    TimelineHoverEffect,
    TimelineShadow,
} from "../../../types/timeline";

export function TimelineEffectsTransformSection({
    timeline: tl,
    updateTimeline,
}: {
    timeline: TimelineElement;
    updateTimeline: (updates: Partial<TimelineElement>) => void;
}) {
    return (
        <>
            {/* Hover Interactions */}
            <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Hover Effects
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                    {(["lift", "scale", "glow", "none"] as TimelineHoverEffect[]).map(
                        (h) => (
                            <button
                                key={h}
                                type="button"
                                onClick={() => updateTimeline({ hoverEffect: h })}
                                className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium capitalize transition ${
                                    tl.hoverEffect === h
                                        ? "border-blue-500 bg-blue-950/40 text-blue-200 shadow-sm"
                                        : "border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
                                }`}
                            >
                                {h === "lift"
                                    ? "Lift"
                                    : h === "scale"
                                    ? "Scale"
                                    : h === "glow"
                                    ? "Glow"
                                    : "None"}
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Shadow Controls */}
            <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Shadow & Glow
                </label>
                <div className="grid grid-cols-5 gap-1">
                    {(["none", "sm", "md", "lg", "neon"] as TimelineShadow[]).map(
                        (sh) => (
                            <button
                                key={sh}
                                type="button"
                                onClick={() => updateTimeline({ shadow: sh })}
                                className={`rounded border py-1.5 text-center text-xs capitalize transition ${
                                    tl.shadow === sh
                                        ? "border-blue-500 bg-blue-950/40 text-blue-200 font-semibold"
                                        : "border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
                                }`}
                            >
                                {sh}
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Transform Controls */}
            <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Transform & Properties
                </label>

                {/* Size / Scale */}
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-xs text-gray-400">
                            Size (Scale)
                        </label>
                        <span className="text-xs text-gray-500">{tl.size}%</span>
                    </div>
                    <input
                        type="range"
                        min="20"
                        max="200"
                        step="5"
                        value={tl.size}
                        onChange={(e) =>
                            updateTimeline({ size: Number(e.target.value) })
                        }
                        className="w-full"
                    />
                </div>

                {/* Rotation */}
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-xs text-gray-400">Rotation</label>
                        <span className="text-xs text-gray-500">
                            {tl.rotation}°
                        </span>
                    </div>
                    <input
                        type="range"
                        min="-360"
                        max="360"
                        step="1"
                        value={tl.rotation}
                        onChange={(e) =>
                            updateTimeline({ rotation: Number(e.target.value) })
                        }
                        className="w-full"
                    />
                </div>

                {/* Opacity */}
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-xs text-gray-400">Opacity</label>
                        <span className="text-xs text-gray-500">
                            {Math.round((tl.opacity ?? 1) * 100)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0.05"
                        max="1"
                        step="0.05"
                        value={tl.opacity ?? 1}
                        onChange={(e) =>
                            updateTimeline({ opacity: Number(e.target.value) })
                        }
                        className="w-full"
                    />
                </div>
            </div>
        </>
    );
}
