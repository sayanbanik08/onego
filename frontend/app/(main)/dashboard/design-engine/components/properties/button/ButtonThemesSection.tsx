"use client";

import React from "react";
import type { ButtonElement, ButtonTheme } from "../../../types/button";

export const THEME_DEFAULT_STYLES: Record<
    string,
    { bgColor: string; textColor: string; borderColor: string }
> = {
    "button-1": {
        bgColor: "transparent",
        textColor: "#2c3e50",
        borderColor: "#3b82f6",
    },
    "button-3": {
        bgColor: "#000000",
        textColor: "#ffffff",
        borderColor: "#ffffff",
    },
    "button-4": {
        bgColor: "#252525",
        textColor: "#fafafa",
        borderColor: "#fafafa",
    },
    "button-5": {
        bgColor: "#ffffff",
        textColor: "#000000",
        borderColor: "#000000",
    },
    "button-6": {
        bgColor: "#3653f8",
        textColor: "#ffffff",
        borderColor: "#3653f8",
    },
    "button-7": {
        bgColor: "#975fff",
        textColor: "#ffffff",
        borderColor: "#975fff",
    },
    "button-8": {
        bgColor: "#212121",
        textColor: "#fefefe",
        borderColor: "#fefefe",
    },
    custom: {
        bgColor: "#3b82f6",
        textColor: "#ffffff",
        borderColor: "#3b82f6",
    },
};

export const BUTTON_THEME_OPTIONS: {
    value: ButtonTheme;
    aliases: string[];
    label: string;
    badge: string;
}[] = [
    {
        value: "button-1",
        aliases: ["button-1", "gamepad-3d"],
        label: "Controller",
        badge: "1",
    },
    {
        value: "button-3",
        aliases: ["button-3", "skew-slide"],
        label: "Skew Slide",
        badge: "3",
    },
    {
        value: "button-4",
        aliases: ["button-4", "neo-brutalist"],
        label: "Neo Brutal",
        badge: "4",
    },
    {
        value: "button-5",
        aliases: ["button-5", "stacked-3d"],
        label: "Layered 3D",
        badge: "5",
    },
    {
        value: "button-6",
        aliases: ["button-6", "letter-slide"],
        label: "Kinetic",
        badge: "6",
    },
    {
        value: "button-7",
        aliases: ["button-7", "jelly-pill"],
        label: "Jelly Pill",
        badge: "7",
    },
    {
        value: "button-8",
        aliases: ["button-8", "cyber-cut"],
        label: "Cyber Cut",
        badge: "8",
    },
    {
        value: "custom",
        aliases: ["custom"],
        label: "Custom",
        badge: "★",
    },
];

type ButtonThemesSectionProps = {
    element: ButtonElement;
    updateElement: (updates: Partial<ButtonElement>) => void;
};

export default function ButtonThemesSection({
    element,
    updateElement,
}: ButtonThemesSectionProps) {
    const handleSelectTheme = (themeValue: ButtonTheme) => {
        const defaultStyles = THEME_DEFAULT_STYLES[themeValue] || {};
        updateElement({
            theme: themeValue,
            ...defaultStyles,
        });
    };

    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Preset Themes
                </span>
                <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                    {BUTTON_THEME_OPTIONS.find((t) =>
                        t.aliases.includes(element.theme)
                    )?.label || "Custom"}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {BUTTON_THEME_OPTIONS.map((theme) => {
                    const isSelected = theme.aliases.includes(element.theme);

                    return (
                        <button
                            key={theme.value}
                            type="button"
                            onClick={() => handleSelectTheme(theme.value)}
                            className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition ${
                                isSelected
                                    ? "border-blue-500 bg-blue-950/40 text-blue-200 shadow-sm"
                                    : "border-gray-800 bg-gray-900/60 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
                            }`}
                        >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-800 text-[10px] font-mono text-gray-300">
                                {theme.badge}
                            </span>
                            <span className="truncate text-xs font-medium">
                                {theme.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
