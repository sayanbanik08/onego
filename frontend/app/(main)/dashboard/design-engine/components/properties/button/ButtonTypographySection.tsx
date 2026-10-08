"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import type { ButtonElement } from "../../../types/button";
import { BUTTON_FONT_FAMILIES, handleButtonRedirect } from "../../canvas/elements/button/buttonHelpers";

type ButtonTypographySectionProps = {
    element: ButtonElement;
    updateElement: (updates: Partial<ButtonElement>) => void;
};

export default function ButtonTypographySection({
    element,
    updateElement,
}: ButtonTypographySectionProps) {
    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Text & Link Settings
            </span>

            {/* 1. Button Text */}
            <div className="space-y-1">
                <span className="text-xs text-gray-300">Button Text</span>
                <input
                    type="text"
                    value={element.text}
                    onChange={(e) => updateElement({ text: e.target.value })}
                    placeholder="Enter button label..."
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                />
            </div>

            {/* 2. Map To (Redirect Link) */}
            <div className="space-y-1">
                <span className="text-xs text-gray-300">Map To (Redirect Link)</span>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="https://example.com"
                        value={element.link}
                        onChange={(e) => updateElement({ link: e.target.value })}
                        className="flex-1 min-w-0 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    />
                    {element.link && (
                        <button
                            type="button"
                            onClick={() => handleButtonRedirect(element.link)}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-400 transition hover:bg-gray-700 hover:text-white"
                            title={`Test Link: ${element.link}`}
                        >
                            <ExternalLink size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* 3. Font Size */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Font Size</span>
                    <input
                        type="number"
                        min={8}
                        max={72}
                        value={element.fontSize}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= 8 && val <= 72) {
                                updateElement({ fontSize: val });
                            }
                        }}
                        className="w-14 rounded border border-gray-700 bg-gray-900 px-1.5 py-0.5 text-right font-mono text-xs text-white outline-none focus:border-blue-500"
                    />
                </div>
                <input
                    type="range"
                    min={8}
                    max={72}
                    step={1}
                    value={element.fontSize}
                    onChange={(e) =>
                        updateElement({ fontSize: Number(e.target.value) })
                    }
                    className="w-full cursor-pointer accent-blue-500"
                />
            </div>

            {/* 5. Font Family (10 modern styles) */}
            <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Font Family (10 Styles)</span>
                </div>
                <select
                    value={element.fontFamily}
                    onChange={(e) =>
                        updateElement({ fontFamily: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                >
                    {BUTTON_FONT_FAMILIES.map((f) => (
                        <option key={f.value} value={f.value}>
                            {f.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* 9. Button Text Color */}
            <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-gray-300">Text Color</span>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={
                            element.textColor && element.textColor.startsWith("#") && element.textColor.length === 7
                                ? element.textColor
                                : "#ffffff"
                        }
                        onChange={(e) =>
                            updateElement({ textColor: e.target.value })
                        }
                        className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />
                    <span className="font-mono text-xs text-gray-400">
                        {element.textColor || "#ffffff"}
                    </span>
                </div>
            </div>
        </div>
    );
}
