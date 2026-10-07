"use client";

import React from "react";
import type { CardElement, CardStyle } from "../../../types/card";

export const CARD_DESIGNS: { value: CardStyle; label: string; emoji: string }[] = [
    { value: "neon-glow", label: "Neon Glow", emoji: "⚡" },
    { value: "corner-fold", label: "Corner Fold", emoji: "📐" },
    { value: "neumorphic", label: "Neumorphic", emoji: "🟤" },
    { value: "social-marquee", label: "Social Marquee", emoji: "🌐" },
];

export function CardThemesSection({
    element: el,
    updateElement,
}: {
    element: CardElement;
    updateElement: (updates: Partial<CardElement>) => void;
}) {
    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Card Themes
            </label>
            <div className="grid grid-cols-2 gap-2">
                {CARD_DESIGNS.map((d) => {
                    const isSelected = el.design === d.value;
                    return (
                        <button
                            key={d.value}
                            type="button"
                            onClick={() => updateElement({ design: d.value })}
                            className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition ${
                                isSelected
                                    ? "border-blue-500 bg-blue-950/40 text-blue-200 shadow-sm"
                                    : "border-gray-800 bg-gray-900/60 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
                            }`}
                        >
                            <span className="text-base">{d.emoji}</span>
                            <span className="truncate text-xs font-medium">
                                {d.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
