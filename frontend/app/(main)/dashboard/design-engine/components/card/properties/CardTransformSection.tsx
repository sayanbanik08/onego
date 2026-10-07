"use client";

import React from "react";
import type { CardElement } from "../../../types/card";

export function CardTransformSection({
    element: el,
    updateElement,
}: {
    element: CardElement;
    updateElement: (updates: Partial<CardElement>) => void;
}) {
    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Transform
            </label>
            {/* Size (Scale) */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Size (Scale)</span>
                    <span className="font-mono text-gray-400">
                        {el.size ?? 100}%
                    </span>
                </div>
                <input
                    type="range"
                    min={20}
                    max={200}
                    step={5}
                    value={el.size ?? 100}
                    onChange={(e) =>
                        updateElement({ size: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>

            {/* Rotation */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Rotation</span>
                    <span className="font-mono text-gray-400">
                        {el.rotation}°
                    </span>
                </div>
                <input
                    type="range"
                    min={-360}
                    max={360}
                    step={1}
                    value={el.rotation}
                    onChange={(e) =>
                        updateElement({ rotation: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>

            {/* Opacity */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Opacity</span>
                    <span className="font-mono text-gray-400">
                        {Math.round((el.opacity ?? 1) * 100)}%
                    </span>
                </div>
                <input
                    type="range"
                    min={0.05}
                    max={1}
                    step={0.05}
                    value={el.opacity ?? 1}
                    onChange={(e) =>
                        updateElement({ opacity: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>
        </div>
    );
}
