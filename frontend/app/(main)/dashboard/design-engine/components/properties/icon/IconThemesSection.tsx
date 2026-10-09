"use client";

import React from "react";
import type { IconElement, IconTheme } from "../../../types/icon";

type IconThemesSectionProps = {
    element: IconElement;
    updateElement: (updates: Partial<IconElement>) => void;
};

const ICON_THEMES: {
    id: IconTheme;
    label: string;
    description: string;
    defaultBg: string;
    defaultBorder: string;
    defaultBorderWidth: number;
    previewBadgeClass: string;
}[] = [
    {
        id: "flat",
        label: "Flat",
        description: "Modern solid minimal aesthetic",
        defaultBg: "#18181b",
        defaultBorder: "#3f3f46",
        defaultBorderWidth: 0,
        previewBadgeClass: "bg-zinc-800 text-white border border-zinc-700",
    },
    {
        id: "glassmorphic",
        label: "Glassmorphic",
        description: "Frosted translucent glass blur",
        defaultBg: "#ffffff",
        defaultBorder: "rgba(255, 255, 255, 0.3)",
        defaultBorderWidth: 1,
        previewBadgeClass: "bg-white/10 text-white border border-white/30 backdrop-blur-sm",
    },
    {
        id: "neon-glow",
        label: "Neon Cyber",
        description: "Glowing futuristic cyber border",
        defaultBg: "#050510",
        defaultBorder: "#06b6d4",
        defaultBorderWidth: 2,
        previewBadgeClass: "bg-black text-cyan-400 border border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]",
    },
    {
        id: "neo-brutalist",
        label: "Neo-Brutal",
        description: "Bold black borders with tactile shadow",
        defaultBg: "#fbbf24",
        defaultBorder: "#000000",
        defaultBorderWidth: 2,
        previewBadgeClass: "bg-amber-400 text-black border-2 border-black font-bold",
    },
    {
        id: "gradient-badge",
        label: "Gradient",
        description: "Rich vibrant violet-to-pink gradient",
        defaultBg: "#6366f1",
        defaultBorder: "#ec4899",
        defaultBorderWidth: 0,
        previewBadgeClass: "bg-gradient-to-tr from-indigo-500 to-pink-500 text-white",
    },
    {
        id: "minimal-outline",
        label: "Outline",
        description: "Transparent body with crisp outline",
        defaultBg: "#18181b",
        defaultBorder: "#a1a1aa",
        defaultBorderWidth: 2,
        previewBadgeClass: "bg-transparent text-zinc-300 border border-zinc-400",
    },
    {
        id: "3d-skeuo",
        label: "3D Skeuo",
        description: "Soft tactile highlights and depth",
        defaultBg: "#27272a",
        defaultBorder: "rgba(255,255,255,0.2)",
        defaultBorderWidth: 1,
        previewBadgeClass: "bg-gradient-to-b from-zinc-700 to-zinc-900 text-white border-t border-zinc-500 shadow-md",
    },
    {
        id: "dark-pill",
        label: "Dark Pill",
        description: "Sleek matte deep stealth pill",
        defaultBg: "#09090b",
        defaultBorder: "#27272a",
        defaultBorderWidth: 1,
        previewBadgeClass: "bg-zinc-950 text-zinc-400 border border-zinc-800",
    },
];

export default function IconThemesSection({
    element,
    updateElement,
}: IconThemesSectionProps) {
    const handleSelectTheme = (themeDef: typeof ICON_THEMES[0]) => {
        updateElement({
            theme: themeDef.id,
            bgColor: themeDef.defaultBg,
            borderColor: themeDef.defaultBorder,
            borderWidth: themeDef.defaultBorderWidth,
        });
    };

    return (
        <div className="space-y-2.5 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Icon Themes
                </span>
                <span className="text-[10px] text-gray-500 capitalize">
                    Active: {element.theme}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
                {ICON_THEMES.map((theme) => {
                    const isSelected = element.theme === theme.id;
                    return (
                        <button
                            key={theme.id}
                            type="button"
                            onClick={() => handleSelectTheme(theme)}
                            className={`flex items-center justify-between rounded-lg border p-2 text-left transition ${
                                isSelected
                                    ? "border-blue-500 bg-blue-600/15 text-white ring-1 ring-blue-500/50"
                                    : "border-gray-800 bg-gray-950/60 text-gray-400 hover:border-gray-700 hover:text-white"
                            }`}
                        >
                            <span className="text-xs font-medium text-white">
                                {theme.label}
                            </span>
                            <div
                                className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] ${theme.previewBadgeClass}`}
                            >
                                ★
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
