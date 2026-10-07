"use client";

import React from "react";
import type { CardElement } from "../../../types/card";

export function CardContentSection({
    element: el,
    updateElement,
}: {
    element: CardElement;
    updateElement: (updates: Partial<CardElement>) => void;
}) {
    return (
        <>
            {/* Heading */}
            <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Heading
                </label>
                <div className="space-y-1">
                    <span className="text-xs text-gray-300">Text</span>
                    <textarea
                        rows={2}
                        value={el.heading}
                        onChange={(e) =>
                            updateElement({ heading: e.target.value })
                        }
                        className="w-full resize-none rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    />
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Font Size</span>
                        <span className="font-mono text-gray-400">
                            {el.headingFontSize}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min={10}
                        max={60}
                        step={1}
                        value={el.headingFontSize}
                        onChange={(e) =>
                            updateElement({
                                headingFontSize: Number(e.target.value),
                            })
                        }
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-gray-300">Font Weight</span>
                    <select
                        value={el.headingFontWeight}
                        onChange={(e) =>
                            updateElement({
                                headingFontWeight: Number(e.target.value),
                            })
                        }
                        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    >
                        <option value={300}>Light (300)</option>
                        <option value={400}>Regular (400)</option>
                        <option value={500}>Medium (500)</option>
                        <option value={600}>Semi-Bold (600)</option>
                        <option value={700}>Bold (700)</option>
                        <option value={800}>Extra-Bold (800)</option>
                        <option value={900}>Black (900)</option>
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Color</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={el.headingColor}
                            onChange={(e) =>
                                updateElement({ headingColor: e.target.value })
                            }
                            className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                        <span className="font-mono text-xs text-gray-400">
                            {el.headingColor}
                        </span>
                    </div>
                </div>
            </div>

            {/* Body Text */}
            <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Body Text
                </label>
                <div className="space-y-1">
                    <span className="text-xs text-gray-300">Text</span>
                    <textarea
                        rows={3}
                        value={el.bodyText}
                        onChange={(e) =>
                            updateElement({ bodyText: e.target.value })
                        }
                        className="w-full resize-none rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    />
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Font Size</span>
                        <span className="font-mono text-gray-400">
                            {el.bodyFontSize}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min={10}
                        max={32}
                        step={1}
                        value={el.bodyFontSize}
                        onChange={(e) =>
                            updateElement({
                                bodyFontSize: Number(e.target.value),
                            })
                        }
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Color</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={el.bodyColor}
                            onChange={(e) =>
                                updateElement({ bodyColor: e.target.value })
                            }
                            className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                        <span className="font-mono text-xs text-gray-400">
                            {el.bodyColor}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
