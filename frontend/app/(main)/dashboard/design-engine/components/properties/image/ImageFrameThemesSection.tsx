"use client";

import React from "react";
import type { ImageElement, ImageFrameTheme } from "../../../types/image";

type ImageFrameThemesSectionProps = {
    element: ImageElement;
    updateElement: (updates: Partial<ImageElement>) => void;
};

const FRAME_THEMES: {
    id: ImageFrameTheme;
    label: string;
    defaultBg: string;
    defaultBorder: string;
    defaultBorderWidth: number;
    previewBadgeClass: string;
}[] = [
    {
        id: "minimal-clean",
        label: "Minimal Clean",
        defaultBg: "#18181b",
        defaultBorder: "#27272a",
        defaultBorderWidth: 1,
        previewBadgeClass: "bg-zinc-800 text-white border border-zinc-700",
    },
    {
        id: "polaroid",
        label: "Polaroid",
        defaultBg: "#ffffff",
        defaultBorder: "#e4e4e7",
        defaultBorderWidth: 1,
        previewBadgeClass: "bg-white text-zinc-800 border border-zinc-300 shadow-sm",
    },
    {
        id: "film-strip",
        label: "Film Strip",
        defaultBg: "#09090b",
        defaultBorder: "#27272a",
        defaultBorderWidth: 2,
        previewBadgeClass: "bg-black text-white border border-zinc-700",
    },
    {
        id: "neon-border",
        label: "Neon Cyber",
        defaultBg: "#050510",
        defaultBorder: "#06b6d4",
        defaultBorderWidth: 2,
        previewBadgeClass: "bg-black text-cyan-400 border border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]",
    },
    {
        id: "gradient-glow",
        label: "Gradient Glow",
        defaultBg: "#18181b",
        defaultBorder: "#a855f7",
        defaultBorderWidth: 2,
        previewBadgeClass: "bg-gradient-to-tr from-purple-500 to-pink-500 text-white",
    },
    {
        id: "glassmorphic",
        label: "Glassmorphic",
        defaultBg: "#ffffff",
        defaultBorder: "rgba(255, 255, 255, 0.3)",
        defaultBorderWidth: 1,
        previewBadgeClass: "bg-white/10 text-white border border-white/30 backdrop-blur-sm",
    },
    {
        id: "shadow-lift",
        label: "Shadow Lift",
        defaultBg: "#18181b",
        defaultBorder: "#3f3f46",
        defaultBorderWidth: 1,
        previewBadgeClass: "bg-zinc-800 text-white shadow-lg border border-zinc-600",
    },
    {
        id: "double-border",
        label: "Double Ring",
        defaultBg: "#18181b",
        defaultBorder: "#eab308",
        defaultBorderWidth: 2,
        previewBadgeClass: "bg-zinc-900 text-amber-400 border-2 border-amber-400 ring-1 ring-amber-300",
    },
    {
        id: "rustic-wood",
        label: "Rustic Wood",
        defaultBg: "#c49258",
        defaultBorder: "#8c5828",
        defaultBorderWidth: 0,
        previewBadgeClass: "bg-amber-700 text-amber-100 border border-amber-600 shadow-sm",
    },
];

export default function ImageFrameThemesSection({
    element,
    updateElement,
}: ImageFrameThemesSectionProps) {
    const handleSelectTheme = (themeDef: (typeof FRAME_THEMES)[0]) => {
        updateElement({
            theme: themeDef.id,
            frameColor: themeDef.defaultBg,
            borderColor: themeDef.defaultBorder,
            borderWidth: themeDef.defaultBorderWidth,
        });
    };

    return (
        <div className="space-y-2.5 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Frame Themes
                </span>
                <span className="text-[10px] text-gray-500 capitalize">
                    Active: {element.theme}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
                {FRAME_THEMES.map((theme) => {
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
                            <span className="text-xs font-medium text-white truncate mr-1">
                                {theme.label}
                            </span>
                            <div
                                className={`h-4 w-4 shrink-0 rounded-full flex items-center justify-center text-[9px] ${theme.previewBadgeClass}`}
                            >
                                🖼
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
