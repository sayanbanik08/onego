"use client";

import React, { useState } from "react";
import {
    Plus,
    Trash2,
    ChevronUp,
    ChevronDown,
    Palette,
    Layers,
    Briefcase,
    GraduationCap,
    Trophy,
    Star,
    Code,
    Rocket,
    CheckCircle2,
    Circle,
} from "lucide-react";
import {
    TimelineElement,
    TimelineItem,
    TimelineTheme,
    TimelineIconType,
    TimelineHoverEffect,
    TimelineShadow,
} from "../types/timeline";
import {
    EDUCATION_TEMPLATE,
    EXPERIENCE_TEMPLATE,
    ACHIEVEMENTS_TEMPLATE,
    ROADMAP_TEMPLATE,
    THEME_DETAILS,
} from "./timelineTemplates";

type TimelinePropertiesProps = {
    selectedElement: TimelineElement;
    updateElement: (id: string, updates: Partial<TimelineElement>) => void;
};

export default function TimelineProperties({
    selectedElement: tl,
    updateElement,
}: TimelinePropertiesProps) {
    const [activeTab, setActiveTab] = useState<"design" | "data">("design");
    const [expandedItemId, setExpandedItemId] = useState<string | null>(
        tl.items[0]?.id ?? null
    );

    const updateTl = (updates: Partial<TimelineElement>) => {
        updateElement(tl.id, updates);
    };

    const handleAccentColorChange = (newColor: string) => {
        // Update global accent and sync to items so it immediately updates everywhere
        const nextItems = tl.items.map((it) => ({
            ...it,
            accentColor: undefined, // remove per-item override so global takes effect
        }));
        updateTl({ accentColor: newColor, items: nextItems });
    };

    const updateItem = (itemId: string, itemUpdates: Partial<TimelineItem>) => {
        const nextItems = tl.items.map((it) =>
            it.id === itemId ? { ...it, ...itemUpdates } : it
        );
        updateTl({ items: nextItems });
    };

    const handleAddItem = () => {
        const newItem: TimelineItem = {
            id: crypto.randomUUID(),
            title: `Milestone ${tl.items.length + 1}`,
            subtitle: "Organization / Institution",
            date: "2024 - 2025",
            description: "Describe this milestone or achievement...",
            tag: "Milestone",
            icon: "star",
        };
        updateTl({ items: [...tl.items, newItem] });
        setExpandedItemId(newItem.id);
    };

    const handleDeleteItem = (itemId: string) => {
        if (tl.items.length <= 1) return;
        const nextItems = tl.items.filter((it) => it.id !== itemId);
        updateTl({ items: nextItems });
    };

    const handleMoveItem = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= tl.items.length) return;
        const nextItems = [...tl.items];
        const [moved] = nextItems.splice(index, 1);
        nextItems.splice(targetIndex, 0, moved);
        updateTl({ items: nextItems });
    };

    const handleApplyTemplate = (type: "education" | "experience" | "achievements" | "roadmap") => {
        let templateData: TimelineItem[] = [];
        let recommendedTheme: TimelineTheme = tl.theme;
        let recommendedAccent = tl.accentColor;

        if (type === "education") {
            templateData = EDUCATION_TEMPLATE;
            recommendedTheme = "modern-vertical";
            recommendedAccent = "#3b82f6";
        } else if (type === "experience") {
            templateData = EXPERIENCE_TEMPLATE;
            recommendedTheme = "alternating-zigzag";
            recommendedAccent = "#10b981";
        } else if (type === "achievements") {
            templateData = ACHIEVEMENTS_TEMPLATE;
            recommendedTheme = "neon-cyber";
            recommendedAccent = "#ec4899";
        } else {
            templateData = ROADMAP_TEMPLATE;
            recommendedTheme = "horizontal-stepper";
            recommendedAccent = "#06b6d4";
        }

        updateTl({
            items: JSON.parse(JSON.stringify(templateData)),
            theme: recommendedTheme,
            accentColor: recommendedAccent,
        });
        setExpandedItemId(templateData[0]?.id ?? null);
    };

    const fontFamilies = [
        "Inter, sans-serif",
        "Arial, sans-serif",
        "Roboto, sans-serif",
        "Georgia, serif",
        "'Fira Code', monospace",
        "'Outfit', sans-serif",
    ];

    return (
        <div className="w-full max-w-full overflow-hidden mt-6 space-y-5">
            {/* Element Information (Consistent with all other elements) */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">
                    Element {tl.serialNumber}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                    Type: Timeline
                </div>
            </div>

            {/* Navigation Tabs (Themes & Style | Data) */}
            <div className="flex rounded-lg border border-gray-800 bg-gray-900 p-1 text-xs">
                <button
                    type="button"
                    onClick={() => setActiveTab("design")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition ${
                        activeTab === "design"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-400 hover:text-white"
                    }`}
                >
                    <Palette size={13} />
                    Themes & Style
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("data")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition ${
                        activeTab === "data"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-400 hover:text-white"
                    }`}
                >
                    <Layers size={13} />
                    Data ({tl.items.length})
                </button>
            </div>

            {/* ═════════ TAB 1: DESIGN & THEME ═════════ */}
            {activeTab === "design" && (
                <div className="w-full max-w-full space-y-5 overflow-hidden">
                    {/* 8 Themes Selector (Heading only, NO description) */}
                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Timeline Themes (8 Styles)
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                            {(Object.keys(THEME_DETAILS) as TimelineTheme[]).map((thm) => {
                                const info = THEME_DETAILS[thm];
                                const isSelected = tl.theme === thm;
                                return (
                                    <button
                                        key={thm}
                                        type="button"
                                        onClick={() =>
                                            updateTl({
                                                theme: thm,
                                            })
                                        }
                                        className={`flex items-center justify-between rounded-lg border px-2.5 py-2 text-left transition ${
                                            isSelected
                                                ? "border-blue-500 bg-blue-950/40 text-blue-200 shadow-sm"
                                                : "border-gray-800 bg-gray-900/60 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
                                        }`}
                                    >
                                        <span className="truncate text-xs font-medium">
                                            {info.name}
                                        </span>
                                        <span
                                            className="ml-1.5 h-2 w-2 shrink-0 rounded-full"
                                            style={{ backgroundColor: info.defaultAccent }}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Color Palette (Includes Accent Color & Card Background) */}
                    <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Color Palette
                        </label>

                        {/* Accent Color (Fully reactive) */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-300">Accent Color</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={tl.accentColor}
                                    onChange={(e) => handleAccentColorChange(e.target.value)}
                                    className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                />
                                <span className="font-mono text-xs text-gray-400">{tl.accentColor}</span>
                            </div>
                        </div>

                        {/* Card Background Color */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-300">Card Background</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={
                                        tl.cardBg && tl.cardBg !== "transparent"
                                            ? tl.cardBg
                                            : "#0f172a"
                                    }
                                    onChange={(e) => updateTl({ cardBg: e.target.value })}
                                    className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                />
                                <button
                                    type="button"
                                    onClick={() => updateTl({ cardBg: "transparent" })}
                                    className={`rounded px-1.5 py-0.5 text-[10px] border transition ${
                                        tl.cardBg === "transparent"
                                            ? "border-blue-500 bg-blue-950/40 text-blue-300 font-medium"
                                            : "border-gray-700 bg-gray-800 text-gray-400 hover:text-white"
                                    }`}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {/* Connector Line Color */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-300">Line Color</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={tl.lineColor}
                                    onChange={(e) => updateTl({ lineColor: e.target.value })}
                                    className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                />
                                <span className="font-mono text-xs text-gray-400">{tl.lineColor}</span>
                            </div>
                        </div>

                        {/* Card Border Color */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-300">Border Color</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={
                                        tl.cardBorderColor && tl.cardBorderColor.startsWith("#")
                                            ? tl.cardBorderColor
                                            : "#334155"
                                    }
                                    onChange={(e) => updateTl({ cardBorderColor: e.target.value })}
                                    className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                />
                                <span className="font-mono text-xs text-gray-400">
                                    {tl.cardBorderColor || "auto"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Nodes & Connectors */}
                    <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Nodes & Connectors
                        </label>

                        {/* Node Shape */}
                        <div>
                            <span className="mb-1.5 block text-xs text-gray-400">Node Shape</span>
                            <div className="grid grid-cols-4 gap-1">
                                {(["circle", "square", "diamond", "hexagon"] as const).map((sh) => (
                                    <button
                                        key={sh}
                                        type="button"
                                        onClick={() => updateTl({ nodeShape: sh })}
                                        className={`rounded py-1 text-xs capitalize transition ${
                                            tl.nodeShape === sh
                                                ? "bg-blue-600 text-white font-semibold"
                                                : "bg-gray-800 text-gray-400 hover:text-white"
                                        }`}
                                    >
                                        {sh}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Node Size */}
                        <div>
                            <div className="mb-1 flex justify-between">
                                <label className="text-xs text-gray-400">Node Size</label>
                                <span className="text-xs text-gray-500">{tl.nodeSize}px</span>
                            </div>
                            <input
                                type="range"
                                min="16"
                                max="48"
                                step="2"
                                value={tl.nodeSize}
                                onChange={(e) => updateTl({ nodeSize: Number(e.target.value) })}
                                className="w-full"
                            />
                        </div>

                        {/* Line Thickness */}
                        <div>
                            <div className="mb-1 flex justify-between">
                                <label className="text-xs text-gray-400">Line Thickness</label>
                                <span className="text-xs text-gray-500">{tl.lineWidth}px</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="8"
                                step="1"
                                value={tl.lineWidth}
                                onChange={(e) => updateTl({ lineWidth: Number(e.target.value) })}
                                className="w-full"
                            />
                        </div>

                        {/* Item Spacing */}
                        <div>
                            <div className="mb-1 flex justify-between">
                                <label className="text-xs text-gray-400">Item Spacing</label>
                                <span className="text-xs text-gray-500">{tl.spacing}px</span>
                            </div>
                            <input
                                type="range"
                                min="12"
                                max="72"
                                step="2"
                                value={tl.spacing}
                                onChange={(e) => updateTl({ spacing: Number(e.target.value) })}
                                className="w-full"
                            />
                        </div>

                        {/* Card Border Radius */}
                        <div>
                            <div className="mb-1 flex justify-between">
                                <label className="text-xs text-gray-400">Card Radius</label>
                                <span className="text-xs text-gray-500">{tl.borderRadius}px</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="32"
                                step="2"
                                value={tl.borderRadius}
                                onChange={(e) => updateTl({ borderRadius: Number(e.target.value) })}
                                className="w-full"
                            />
                        </div>

                        {/* Card Width */}
                        <div>
                            <div className="mb-1 flex justify-between">
                                <label className="text-xs text-gray-400">Card Width</label>
                                <span className="text-xs text-gray-500">{tl.cardWidth ?? 480}px</span>
                            </div>
                            <input
                                type="range"
                                min="240"
                                max="850"
                                step="10"
                                value={tl.cardWidth ?? 480}
                                onChange={(e) => updateTl({ cardWidth: Number(e.target.value) })}
                                className="w-full"
                            />
                        </div>

                        {/* Card Min Height */}
                        <div>
                            <div className="mb-1 flex justify-between">
                                <label className="text-xs text-gray-400">Card Min Height</label>
                                <span className="text-xs text-gray-500">{tl.cardMinHeight ?? 60}px</span>
                            </div>
                            <input
                                type="range"
                                min="40"
                                max="250"
                                step="5"
                                value={tl.cardMinHeight ?? 60}
                                onChange={(e) => updateTl({ cardMinHeight: Number(e.target.value) })}
                                className="w-full"
                            />
                        </div>

                        {/* Card Border Width */}
                        <div>
                            <div className="mb-1 flex justify-between">
                                <label className="text-xs text-gray-400">Card Border Width</label>
                                <span className="text-xs text-gray-500">{tl.cardBorderWidth}px</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="8"
                                step="1"
                                value={tl.cardBorderWidth}
                                onChange={(e) => updateTl({ cardBorderWidth: Number(e.target.value) })}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Typography & Text */}
                    <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Typography & Text
                        </label>

                        {/* Font Family */}
                        <div>
                            <label className="mb-1 block text-xs text-gray-400">Font Family</label>
                            <select
                                value={tl.fontFamily}
                                onChange={(e) => updateTl({ fontFamily: e.target.value })}
                                className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1.5 text-xs text-white outline-none"
                            >
                                {fontFamilies.map((f) => (
                                    <option key={f} value={f}>
                                        {f.split(",")[0].replace(/'/g, "")}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Title Font Size & Color */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <div className="mb-1 flex justify-between">
                                    <label className="text-xs text-gray-400">Title Size</label>
                                    <span className="text-xs text-gray-500">{tl.titleFontSize ?? 15}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="36"
                                    step="1"
                                    value={tl.titleFontSize ?? 15}
                                    onChange={(e) => updateTl({ titleFontSize: Number(e.target.value) })}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-gray-400">Title Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={tl.titleColor || "#ffffff"}
                                        onChange={(e) => updateTl({ titleColor: e.target.value })}
                                        className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                    />
                                    <span className="font-mono text-[10px] text-gray-400">{tl.titleColor || "#ffffff"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Subtitle / Org Font Size & Color */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <div className="mb-1 flex justify-between">
                                    <label className="text-xs text-gray-400">Subtitle / Org Size</label>
                                    <span className="text-xs text-gray-500">{tl.subtitleFontSize ?? 12}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="24"
                                    step="1"
                                    value={tl.subtitleFontSize ?? 12}
                                    onChange={(e) => updateTl({ subtitleFontSize: Number(e.target.value) })}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-gray-400">Subtitle Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={tl.subtitleColor || "#94a3b8"}
                                        onChange={(e) => updateTl({ subtitleColor: e.target.value })}
                                        className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                    />
                                    <span className="font-mono text-[10px] text-gray-400">{tl.subtitleColor || "#94a3b8"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Date / Period Font Size & Color */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <div className="mb-1 flex justify-between">
                                    <label className="text-xs text-gray-400">Date / Period Size</label>
                                    <span className="text-xs text-gray-500">{tl.dateFontSize ?? 11}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="9"
                                    max="22"
                                    step="1"
                                    value={tl.dateFontSize ?? 11}
                                    onChange={(e) => updateTl({ dateFontSize: Number(e.target.value) })}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-gray-400">Date Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={tl.dateColor || "#38bdf8"}
                                        onChange={(e) => updateTl({ dateColor: e.target.value })}
                                        className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                    />
                                    <span className="font-mono text-[10px] text-gray-400">{tl.dateColor || "#38bdf8"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tag / Badge Font Size & Color */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <div className="mb-1 flex justify-between">
                                    <label className="text-xs text-gray-400">Tag / Badge Size</label>
                                    <span className="text-xs text-gray-500">{tl.tagFontSize ?? 10}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="8"
                                    max="20"
                                    step="1"
                                    value={tl.tagFontSize ?? 10}
                                    onChange={(e) => updateTl({ tagFontSize: Number(e.target.value) })}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-gray-400">Tag Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={tl.tagColor || tl.accentColor || "#3b82f6"}
                                        onChange={(e) => updateTl({ tagColor: e.target.value })}
                                        className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                    />
                                    <span className="font-mono text-[10px] text-gray-400">{tl.tagColor || tl.accentColor || "#3b82f6"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Body Text Size & Color */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <div className="mb-1 flex justify-between">
                                    <label className="text-xs text-gray-400">Body Size</label>
                                    <span className="text-xs text-gray-500">{tl.bodyFontSize ?? 12}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="24"
                                    step="1"
                                    value={tl.bodyFontSize ?? 12}
                                    onChange={(e) => updateTl({ bodyFontSize: Number(e.target.value) })}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-gray-400">Body Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={tl.textColor || "#e2e8f0"}
                                        onChange={(e) => updateTl({ textColor: e.target.value })}
                                        className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                    />
                                    <span className="font-mono text-[10px] text-gray-400">{tl.textColor || "#e2e8f0"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hover Interactions (No artificial background!) */}
                    <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Hover Effects
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                            {(["lift", "scale", "glow", "none"] as TimelineHoverEffect[]).map((h) => (
                                <button
                                    key={h}
                                    type="button"
                                    onClick={() => updateTl({ hoverEffect: h })}
                                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium capitalize transition ${
                                        tl.hoverEffect === h
                                            ? "border-blue-500 bg-blue-950/40 text-blue-200 shadow-sm"
                                            : "border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
                                    }`}
                                >
                                    {h === "lift" ? "Lift" : h === "scale" ? "Scale" : h === "glow" ? "Glow" : "None"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Shadow Controls (Custom deleted as requested) */}
                    <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Shadow & Glow
                        </label>
                        <div className="grid grid-cols-5 gap-1">
                            {(["none", "sm", "md", "lg", "neon"] as TimelineShadow[]).map((sh) => (
                                <button
                                    key={sh}
                                    type="button"
                                    onClick={() => updateTl({ shadow: sh })}
                                    className={`rounded border py-1.5 text-center text-xs capitalize transition ${
                                        tl.shadow === sh
                                            ? "border-blue-500 bg-blue-950/40 text-blue-200 font-semibold"
                                            : "border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
                                    }`}
                                >
                                    {sh}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Transform Controls (Standard size, rotation, opacity) */}
                    <div className="space-y-3">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Transform & Properties
                        </label>

                        {/* Size / Scale */}
                        <div>
                            <div className="mb-1 flex justify-between">
                                <label className="text-xs text-gray-400">Size (Scale)</label>
                                <span className="text-xs text-gray-500">{tl.size}%</span>
                            </div>
                            <input
                                type="range"
                                min="20"
                                max="200"
                                step="5"
                                value={tl.size}
                                onChange={(e) => updateTl({ size: Number(e.target.value) })}
                                className="w-full"
                            />
                        </div>

                        {/* Rotation */}
                        <div>
                            <div className="mb-1 flex justify-between">
                                <label className="text-xs text-gray-400">Rotation</label>
                                <span className="text-xs text-gray-500">{tl.rotation}°</span>
                            </div>
                            <input
                                type="range"
                                min="-360"
                                max="360"
                                step="1"
                                value={tl.rotation}
                                onChange={(e) => updateTl({ rotation: Number(e.target.value) })}
                                className="w-full"
                            />
                        </div>

                        {/* Opacity */}
                        <div>
                            <div className="mb-1 flex justify-between">
                                <label className="text-xs text-gray-400">Opacity</label>
                                <span className="text-xs text-gray-500">
                                    {Math.round((tl.opacity ?? 1) * 100)}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0.05"
                                max="1"
                                step="0.05"
                                value={tl.opacity ?? 1}
                                onChange={(e) => updateTl({ opacity: Number(e.target.value) })}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ═════════ TAB 2: DATA & MILESTONES ═════════ */}
            {activeTab === "data" && (
                <div className="w-full max-w-full space-y-4 overflow-hidden">
                    {/* Quick Template Fill Buttons */}
                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Content Templates
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                            <button
                                type="button"
                                onClick={() => handleApplyTemplate("education")}
                                className="flex items-center gap-1.5 rounded-lg border border-blue-900/50 bg-blue-950/30 px-2.5 py-2 text-xs font-medium text-blue-300 transition hover:bg-blue-900/50"
                            >
                                <GraduationCap size={13} />
                                Education
                            </button>
                            <button
                                type="button"
                                onClick={() => handleApplyTemplate("experience")}
                                className="flex items-center gap-1.5 rounded-lg border border-emerald-900/50 bg-emerald-950/30 px-2.5 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-900/50"
                            >
                                <Briefcase size={13} />
                                Experience
                            </button>
                            <button
                                type="button"
                                onClick={() => handleApplyTemplate("achievements")}
                                className="flex items-center gap-1.5 rounded-lg border border-amber-900/50 bg-amber-950/30 px-2.5 py-2 text-xs font-medium text-amber-300 transition hover:bg-amber-900/50"
                            >
                                <Trophy size={13} />
                                Achievements
                            </button>
                            <button
                                type="button"
                                onClick={() => handleApplyTemplate("roadmap")}
                                className="flex items-center gap-1.5 rounded-lg border border-purple-900/50 bg-purple-950/30 px-2.5 py-2 text-xs font-medium text-purple-300 transition hover:bg-purple-900/50"
                            >
                                <Rocket size={13} />
                                Roadmap
                            </button>
                        </div>
                    </div>

                    {/* Add Milestone Button */}
                    <div className="flex items-center justify-between border-t border-gray-800 pt-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Milestones ({tl.items.length})
                        </span>
                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="flex items-center gap-1 rounded-lg border border-blue-600 bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-blue-500"
                        >
                            <Plus size={13} />
                            Add Milestone
                        </button>
                    </div>

                    <div className="rounded-lg border border-blue-900/40 bg-blue-950/20 p-2 text-[11px] text-blue-300">
                        💡 Double-click any text on the canvas to edit directly!
                    </div>

                    {/* Milestones List (Responsive, no horizontal scroll) */}
                    <div className="w-full max-w-full space-y-2 overflow-hidden">
                        {tl.items.map((item, index) => {
                            const isExpanded = expandedItemId === item.id;
                            const iconsList: TimelineIconType[] = [
                                "graduation",
                                "briefcase",
                                "trophy",
                                "star",
                                "code",
                                "rocket",
                                "check",
                                "circle",
                            ];

                            return (
                                <div
                                    key={item.id}
                                    className="w-full max-w-full rounded-lg border border-gray-800 bg-gray-900/80 p-2.5 transition overflow-hidden"
                                >
                                    {/* Item Summary Header */}
                                    <div className="flex items-center justify-between min-w-0">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setExpandedItemId(isExpanded ? null : item.id)
                                            }
                                            className="flex flex-1 items-center gap-2 text-left min-w-0 pr-1"
                                        >
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-800 text-[10px] font-bold text-gray-400">
                                                {index + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-xs font-semibold text-white">
                                                    {item.title || "Untitled Milestone"}
                                                </div>
                                                <div className="truncate text-[10px] text-gray-500">
                                                    {item.date} • {item.subtitle}
                                                </div>
                                            </div>
                                        </button>

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-0.5 shrink-0">
                                            <button
                                                type="button"
                                                disabled={index === 0}
                                                onClick={() => handleMoveItem(index, "up")}
                                                className="rounded p-1 text-gray-500 transition hover:bg-gray-800 hover:text-white disabled:opacity-30"
                                                title="Move up"
                                            >
                                                <ChevronUp size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                disabled={index === tl.items.length - 1}
                                                onClick={() => handleMoveItem(index, "down")}
                                                className="rounded p-1 text-gray-500 transition hover:bg-gray-800 hover:text-white disabled:opacity-30"
                                                title="Move down"
                                            >
                                                <ChevronDown size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteItem(item.id)}
                                                className="rounded p-1 text-gray-500 transition hover:bg-red-950/50 hover:text-red-400"
                                                title="Delete milestone"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Edit Form */}
                                    {isExpanded && (
                                        <div className="w-full max-w-full mt-2.5 space-y-2 border-t border-gray-800 pt-2 text-xs overflow-hidden">
                                            {/* Title */}
                                            <div>
                                                <label className="mb-1 block text-[10px] uppercase text-gray-400">
                                                    Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) =>
                                                        updateItem(item.id, { title: e.target.value })
                                                    }
                                                    className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-white outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            {/* Subtitle & Date */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="mb-1 block text-[10px] uppercase text-gray-400">
                                                        Subtitle / Org
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.subtitle}
                                                        onChange={(e) =>
                                                            updateItem(item.id, { subtitle: e.target.value })
                                                        }
                                                        className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-white outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-[10px] uppercase text-gray-400">
                                                        Date / Period
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.date}
                                                        onChange={(e) =>
                                                            updateItem(item.id, { date: e.target.value })
                                                        }
                                                        className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-white outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            {/* Tag */}
                                            <div>
                                                <label className="mb-1 block text-[10px] uppercase text-gray-400">
                                                    Tag / Badge
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.tag || ""}
                                                    onChange={(e) =>
                                                        updateItem(item.id, { tag: e.target.value })
                                                    }
                                                    placeholder="e.g. Degree / Full-Time"
                                                    className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-white outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            {/* Icon Picker */}
                                            <div>
                                                <label className="mb-1 block text-[10px] uppercase text-gray-400">
                                                    Icon
                                                </label>
                                                <div className="flex flex-wrap gap-1">
                                                    {iconsList.map((ic) => (
                                                        <button
                                                            key={ic}
                                                            type="button"
                                                            onClick={() => updateItem(item.id, { icon: ic })}
                                                            className={`flex h-6 w-6 items-center justify-center rounded border transition ${
                                                                (item.icon || "circle") === ic
                                                                    ? "border-blue-500 bg-blue-950/60 text-blue-300"
                                                                    : "border-gray-800 bg-gray-800 text-gray-400 hover:text-white"
                                                            }`}
                                                            title={ic}
                                                        >
                                                            {ic === "graduation" && <GraduationCap size={12} />}
                                                            {ic === "briefcase" && <Briefcase size={12} />}
                                                            {ic === "trophy" && <Trophy size={12} />}
                                                            {ic === "star" && <Star size={12} />}
                                                            {ic === "code" && <Code size={12} />}
                                                            {ic === "rocket" && <Rocket size={12} />}
                                                            {ic === "check" && <CheckCircle2 size={12} />}
                                                            {ic === "circle" && <Circle size={12} />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <label className="mb-1 block text-[10px] uppercase text-gray-400">
                                                    Description
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={item.description}
                                                    onChange={(e) =>
                                                        updateItem(item.id, { description: e.target.value })
                                                    }
                                                    className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
