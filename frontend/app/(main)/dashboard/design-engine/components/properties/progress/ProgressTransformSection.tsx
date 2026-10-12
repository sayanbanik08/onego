"use client";

import React from "react";
import type { ProgressElement } from "../../../types/progress";

type ProgressTransformSectionProps = {
    element: ProgressElement;
    updateElement: (updates: Partial<ProgressElement>) => void;
};

export default function ProgressTransformSection({
    element,
    updateElement,
}: ProgressTransformSectionProps) {
    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Transform & Scale
            </span>

            {/* ── 1. Overall Scale (Size) ─────────────────────────────────── */}
            <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Overall Scale (Size)</span>
                    <span className="font-mono text-gray-400">
                        {element.size ?? 100}%
                    </span>
                </div>
                <input
                    type="range"
                    min={10}
                    max={250}
                    step={1}
                    value={element.size ?? 100}
                    onChange={(e) =>
                        updateElement({ size: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>

            {/* ── 2. Rotation ─────────────────────────────────────────────── */}
            <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Rotation</span>
                    <div className="flex items-center gap-1.5 font-mono text-xs text-gray-400">
                        <span>{element.rotation ?? 0}°</span>
                        {element.rotation !== 0 && (
                            <button
                                type="button"
                                onClick={() => updateElement({ rotation: 0 })}
                                className="text-[10px] text-blue-400 hover:underline"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
                <input
                    type="range"
                    min={0}
                    max={360}
                    step={1}
                    value={element.rotation ?? 0}
                    onChange={(e) =>
                        updateElement({ rotation: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>

            {/* ── 3. Opacity ──────────────────────────────────────────────── */}
            <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Opacity</span>
                    <span className="font-mono text-gray-400">
                        {Math.round((element.opacity ?? 1) * 100)}%
                    </span>
                </div>
                <input
                    type="range"
                    min={5}
                    max={100}
                    step={1}
                    value={Math.round((element.opacity ?? 1) * 100)}
                    onChange={(e) =>
                        updateElement({ opacity: Number(e.target.value) / 100 })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>
        </div>
    );
}
