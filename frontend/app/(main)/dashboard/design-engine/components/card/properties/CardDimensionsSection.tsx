"use client";

import React from "react";
import type { CardElement } from "../../../types/card";

export function CardDimensionsSection({
    element: el,
    updateElement,
}: {
    element: CardElement;
    updateElement: (updates: Partial<CardElement>) => void;
}) {
    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Dimensions
            </label>
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Card Width</span>
                    <span className="font-mono text-gray-400">
                        {el.cardWidth}px
                    </span>
                </div>
                <input
                    type="range"
                    min={160}
                    max={700}
                    step={10}
                    value={el.cardWidth}
                    onChange={(e) =>
                        updateElement({ cardWidth: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Card Min Height</span>
                    <span className="font-mono text-gray-400">
                        {el.cardMinHeight}px
                    </span>
                </div>
                <input
                    type="range"
                    min={80}
                    max={600}
                    step={10}
                    value={el.cardMinHeight}
                    onChange={(e) =>
                        updateElement({ cardMinHeight: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>
        </div>
    );
}
