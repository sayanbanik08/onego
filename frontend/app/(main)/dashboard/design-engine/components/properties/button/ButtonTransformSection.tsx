"use client";

import React from "react";
import type { ButtonElement } from "../../../types/button";

type ButtonTransformSectionProps = {
    element: ButtonElement;
    updateElement: (updates: Partial<ButtonElement>) => void;
};

export default function ButtonTransformSection({
    element,
    updateElement,
}: ButtonTransformSectionProps) {
    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Transform & Opacity
            </span>

            {/* 10. Size (Scale) */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Size (Scale)</span>
                    <span className="font-mono text-gray-400">
                        {element.size ?? 100}%
                    </span>
                </div>
                <input
                    type="range"
                    min={20}
                    max={250}
                    step={1}
                    value={element.size ?? 100}
                    onChange={(e) =>
                        updateElement({ size: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>

            {/* 11. Rotation */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Rotation</span>
                    <span className="font-mono text-gray-400">
                        {element.rotation}°
                    </span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={360}
                    step={1}
                    value={element.rotation}
                    onChange={(e) =>
                        updateElement({ rotation: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>

            {/* 12. Opacity */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Opacity</span>
                    <span className="font-mono text-gray-400">
                        {Math.round((element.opacity ?? 1) * 100)}%
                    </span>
                </div>
                <input
                    type="range"
                    min={0.05}
                    max={1}
                    step={0.05}
                    value={element.opacity ?? 1}
                    onChange={(e) =>
                        updateElement({ opacity: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>
        </div>
    );
}
