"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import type { CardElement } from "../../../types/card";

export function CardButtonSection({
    element: el,
    updateElement,
}: {
    element: CardElement;
    updateElement: (updates: Partial<CardElement>) => void;
}) {
    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
            <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Button (Optional)
                </label>
                <button
                    type="button"
                    role="switch"
                    aria-checked={el.showButton}
                    onClick={() =>
                        updateElement({ showButton: !el.showButton })
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                        el.showButton
                            ? "bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                            : "border border-gray-700 bg-gray-800 hover:bg-gray-700"
                    }`}
                    title={el.showButton ? "Button Enabled" : "Button Disabled"}
                >
                    <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform duration-200 ease-in-out ${
                            el.showButton ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                </button>
            </div>

            {el.showButton && (
                <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                        <span className="text-xs text-gray-300">
                            Button Text
                        </span>
                        <input
                            type="text"
                            value={el.buttonText}
                            onChange={(e) =>
                                updateElement({ buttonText: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <span className="text-xs text-gray-300">
                            Map To (Redirect Link)
                        </span>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="https://example.com"
                                value={el.buttonLink}
                                onChange={(e) =>
                                    updateElement({
                                        buttonLink: e.target.value,
                                    })
                                }
                                className="flex-1 min-w-0 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                            />
                            {el.buttonLink && (
                                <a
                                    href={
                                        el.buttonLink.startsWith("http")
                                            ? el.buttonLink
                                            : `https://${el.buttonLink}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-400 transition hover:text-white"
                                    title="Open link"
                                >
                                    <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Font Size</span>
                            <span className="font-mono text-gray-400">
                                {el.buttonFontSize}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min={10}
                            max={24}
                            step={1}
                            value={el.buttonFontSize}
                            onChange={(e) =>
                                updateElement({
                                    buttonFontSize: Number(e.target.value),
                                })
                            }
                            className="w-full cursor-pointer accent-blue-500"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">
                                Button Radius
                            </span>
                            <span className="font-mono text-gray-400">
                                {el.buttonBorderRadius}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={40}
                            step={2}
                            value={el.buttonBorderRadius}
                            onChange={(e) =>
                                updateElement({
                                    buttonBorderRadius: Number(
                                        e.target.value
                                    ),
                                })
                            }
                            className="w-full cursor-pointer accent-blue-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <span className="text-xs text-gray-300">
                            Padding (X / Y)
                        </span>
                        <div className="flex gap-2">
                            <div className="flex-1 min-w-0">
                                <input
                                    type="number"
                                    min={4}
                                    max={48}
                                    value={el.buttonPaddingX}
                                    onChange={(e) =>
                                        updateElement({
                                            buttonPaddingX: Number(
                                                e.target.value
                                            ),
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500"
                                    placeholder="Padding X"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <input
                                    type="number"
                                    min={2}
                                    max={24}
                                    value={el.buttonPaddingY}
                                    onChange={(e) =>
                                        updateElement({
                                            buttonPaddingY: Number(
                                                e.target.value
                                            ),
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500"
                                    placeholder="Padding Y"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-300">
                            Button Background
                        </span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={el.buttonBgColor}
                                onChange={(e) =>
                                    updateElement({
                                        buttonBgColor: e.target.value,
                                    })
                                }
                                className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                            />
                            <span className="font-mono text-xs text-gray-400">
                                {el.buttonBgColor}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-300">
                            Button Text Color
                        </span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={el.buttonTextColor}
                                onChange={(e) =>
                                    updateElement({
                                        buttonTextColor: e.target.value,
                                    })
                                }
                                className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                            />
                            <span className="font-mono text-xs text-gray-400">
                                {el.buttonTextColor}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
