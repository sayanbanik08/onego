"use client";

import React, { useState } from "react";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import type {
    CardElement,
    CardStyle,
    CardShadow,
    SocialPlatformKey,
    SocialHandleItem,
} from "../types/card";

type CardPropertiesProps = {
    selectedElement: CardElement;
    updateElement: (id: string, updates: Partial<CardElement>) => void;
};

const CARD_DESIGNS: { value: CardStyle; label: string; emoji: string }[] = [
    { value: "neon-glow", label: "Neon Glow", emoji: "⚡" },
    { value: "corner-fold", label: "Corner Fold", emoji: "📐" },
    { value: "neumorphic", label: "Neumorphic", emoji: "🟤" },
    { value: "social-marquee", label: "Social Marquee", emoji: "🌐" },
];

const SHADOW_OPTIONS: { value: CardShadow; label: string }[] = [
    { value: "none", label: "None" },
    { value: "sm", label: "Sm" },
    { value: "md", label: "Md" },
    { value: "lg", label: "Lg" },
    { value: "neon", label: "Neon" },
    { value: "neumorphic", label: "Neu" },
];

const SOCIAL_PLATFORMS: { value: SocialPlatformKey; label: string }[] = [
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter / X" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "github", label: "GitHub" },
    { value: "youtube", label: "YouTube" },
    { value: "twitch", label: "Twitch" },
    { value: "discord", label: "Discord" },
    { value: "reddit", label: "Reddit" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "snapchat", label: "Snapchat" },
    { value: "threads", label: "Threads" },
    { value: "vimeo", label: "Vimeo" },
    { value: "dribbble", label: "Dribbble" },
    { value: "behance", label: "Behance" },
    { value: "soundcloud", label: "SoundCloud" },
    { value: "vk", label: "VK" },
];

export default function CardProperties({
    selectedElement: el,
    updateElement,
}: CardPropertiesProps) {
    const up = (updates: Partial<CardElement>) =>
        updateElement(el.id, updates);

    const [newPlatform, setNewPlatform] = useState<SocialPlatformKey>("instagram");
    const [newLabel, setNewLabel] = useState("");
    const [newUrl, setNewUrl] = useState("");

    const addSocialHandle = () => {
        const handle: SocialHandleItem = {
            id: crypto.randomUUID(),
            platform: newPlatform,
            label: newLabel || newPlatform,
            url: newUrl,
        };
        up({ socialHandles: [...(el.socialHandles ?? []), handle] });
        setNewLabel("");
        setNewUrl("");
    };

    const removeSocialHandle = (id: string) => {
        up({
            socialHandles: (el.socialHandles ?? []).filter((h) => h.id !== id),
        });
    };

    const updateSocialHandle = (
        id: string,
        field: keyof SocialHandleItem,
        value: string
    ) => {
        up({
            socialHandles: (el.socialHandles ?? []).map((h) =>
                h.id === id ? { ...h, [field]: value } : h
            ),
        });
    };

    const isSocialMarquee = el.design === "social-marquee";

    return (
        <div className="w-full max-w-full min-w-0 space-y-4 pb-8 text-white overflow-x-hidden">

            {/* ── Element Header Info ─────────────────────────── */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <div className="text-sm font-medium text-white">
                    Element {el.serialNumber} • Card
                </div>
                <div className="mt-1 text-xs text-gray-400">
                    Theme: {CARD_DESIGNS.find((d) => d.value === el.design)?.label ?? el.design}
                </div>
            </div>

            {/* ── Card Themes (4 Styles) ─────────────────────── */}
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
                                onClick={() => up({ design: d.value })}
                                className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition ${
                                    isSelected
                                        ? "border-blue-500 bg-blue-950/40 text-blue-200 shadow-sm"
                                        : "border-gray-800 bg-gray-900/60 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
                                }`}
                            >
                                <span className="text-base">{d.emoji}</span>
                                <span className="truncate text-xs font-medium">{d.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Dimensions ─────────────────────────────────── */}
            <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Dimensions
                </label>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Card Width</span>
                        <span className="font-mono text-gray-400">{el.cardWidth}px</span>
                    </div>
                    <input
                        type="range"
                        min={160}
                        max={700}
                        step={10}
                        value={el.cardWidth}
                        onChange={(e) => up({ cardWidth: Number(e.target.value) })}
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Card Min Height</span>
                        <span className="font-mono text-gray-400">{el.cardMinHeight}px</span>
                    </div>
                    <input
                        type="range"
                        min={80}
                        max={600}
                        step={10}
                        value={el.cardMinHeight}
                        onChange={(e) => up({ cardMinHeight: Number(e.target.value) })}
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>
            </div>

            {/* ── Card Styling (Hidden for Social Marquee) ─────── */}
            {!isSocialMarquee && (
                <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Card Styling
                    </label>

                    {/* Accent Color */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-300">Accent Color</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={el.accentColor || "#387ef0"}
                                onChange={(e) => up({ accentColor: e.target.value })}
                                className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                            />
                            <span className="font-mono text-xs text-gray-400">
                                {el.accentColor || "#387ef0"}
                            </span>
                        </div>
                    </div>

                    {/* Card Background Color */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-300">Card Background</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={
                                    el.cardBg && el.cardBg !== "transparent"
                                        ? el.cardBg
                                        : "#0f0f1a"
                                }
                                onChange={(e) => up({ cardBg: e.target.value })}
                                className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                            />
                            <button
                                type="button"
                                onClick={() => up({ cardBg: "transparent" })}
                                className={`rounded px-1.5 py-0.5 text-[10px] border transition ${
                                    el.cardBg === "transparent"
                                        ? "border-blue-500 bg-blue-950/40 text-blue-300 font-medium"
                                        : "border-gray-700 bg-gray-800 text-gray-400 hover:text-white"
                                }`}
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Border Width */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Border Width</span>
                            <span className="font-mono text-gray-400">{el.cardBorderWidth}px</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={8}
                            step={1}
                            value={el.cardBorderWidth}
                            onChange={(e) =>
                                up({ cardBorderWidth: Number(e.target.value) })
                            }
                            className="w-full cursor-pointer accent-blue-500"
                        />
                    </div>

                    {/* Border Color */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-300">Border Color</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={el.cardBorderColor || "#334155"}
                                onChange={(e) => up({ cardBorderColor: e.target.value })}
                                className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                            />
                            <span className="font-mono text-xs text-gray-400">
                                {el.cardBorderColor || "#334155"}
                            </span>
                        </div>
                    </div>

                    {/* Border Radius */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Card Radius</span>
                            <span className="font-mono text-gray-400">{el.borderRadius}px</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={48}
                            step={2}
                            value={el.borderRadius}
                            onChange={(e) => up({ borderRadius: Number(e.target.value) })}
                            className="w-full cursor-pointer accent-blue-500"
                        />
                    </div>

                    {/* Shadow (grid-cols-3 for responsive stability) */}
                    <div className="space-y-1.5">
                        <span className="text-xs text-gray-300">Shadow</span>
                        <div className="grid grid-cols-3 gap-1.5">
                            {SHADOW_OPTIONS.map((s) => (
                                <button
                                    key={s.value}
                                    type="button"
                                    onClick={() => up({ shadow: s.value })}
                                    className={`rounded-md py-1.5 text-xs font-medium uppercase transition ${
                                        (el.shadow ?? "none") === s.value
                                            ? "border border-blue-500 bg-blue-950/40 text-blue-200 shadow-sm"
                                            : "border border-gray-800 bg-gray-900/60 text-gray-400 hover:text-white hover:bg-gray-800"
                                    }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Section 1: Heading (Hidden for Social Marquee) ─ */}
            {!isSocialMarquee && (
                <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Heading
                    </label>
                    <div className="space-y-1">
                        <span className="text-xs text-gray-300">Text</span>
                        <textarea
                            rows={2}
                            value={el.heading}
                            onChange={(e) => up({ heading: e.target.value })}
                            className="w-full resize-none rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Font Size</span>
                            <span className="font-mono text-gray-400">{el.headingFontSize}px</span>
                        </div>
                        <input
                            type="range"
                            min={10}
                            max={60}
                            step={1}
                            value={el.headingFontSize}
                            onChange={(e) =>
                                up({ headingFontSize: Number(e.target.value) })
                            }
                            className="w-full cursor-pointer accent-blue-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-gray-300">Font Weight</span>
                        <select
                            value={el.headingFontWeight}
                            onChange={(e) =>
                                up({ headingFontWeight: Number(e.target.value) })
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
                                onChange={(e) => up({ headingColor: e.target.value })}
                                className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                            />
                            <span className="font-mono text-xs text-gray-400">
                                {el.headingColor}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Section 2: Body Text (Hidden for Social Marquee) */}
            {!isSocialMarquee && (
                <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Body Text
                    </label>
                    <div className="space-y-1">
                        <span className="text-xs text-gray-300">Text</span>
                        <textarea
                            rows={3}
                            value={el.bodyText}
                            onChange={(e) => up({ bodyText: e.target.value })}
                            className="w-full resize-none rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Font Size</span>
                            <span className="font-mono text-gray-400">{el.bodyFontSize}px</span>
                        </div>
                        <input
                            type="range"
                            min={10}
                            max={32}
                            step={1}
                            value={el.bodyFontSize}
                            onChange={(e) =>
                                up({ bodyFontSize: Number(e.target.value) })
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
                                onChange={(e) => up({ bodyColor: e.target.value })}
                                className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                            />
                            <span className="font-mono text-xs text-gray-400">{el.bodyColor}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Section 3: Button (Optional, Hidden for Social) */}
            {!isSocialMarquee && (
                <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Button (Optional)
                        </label>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={el.showButton}
                            onClick={() => up({ showButton: !el.showButton })}
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
                                <span className="text-xs text-gray-300">Button Text</span>
                                <input
                                    type="text"
                                    value={el.buttonText}
                                    onChange={(e) => up({ buttonText: e.target.value })}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs text-gray-300">Map To (Redirect Link)</span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="https://example.com"
                                        value={el.buttonLink}
                                        onChange={(e) =>
                                            up({ buttonLink: e.target.value })
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
                                    <span className="font-mono text-gray-400">{el.buttonFontSize}px</span>
                                </div>
                                <input
                                    type="range"
                                    min={10}
                                    max={24}
                                    step={1}
                                    value={el.buttonFontSize}
                                    onChange={(e) =>
                                        up({ buttonFontSize: Number(e.target.value) })
                                    }
                                    className="w-full cursor-pointer accent-blue-500"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-300">Button Radius</span>
                                    <span className="font-mono text-gray-400">{el.buttonBorderRadius}px</span>
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={40}
                                    step={2}
                                    value={el.buttonBorderRadius}
                                    onChange={(e) =>
                                        up({ buttonBorderRadius: Number(e.target.value) })
                                    }
                                    className="w-full cursor-pointer accent-blue-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs text-gray-300">Padding (X / Y)</span>
                                <div className="flex gap-2">
                                    <div className="flex-1 min-w-0">
                                        <input
                                            type="number"
                                            min={4}
                                            max={48}
                                            value={el.buttonPaddingX}
                                            onChange={(e) =>
                                                up({ buttonPaddingX: Number(e.target.value) })
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
                                                up({ buttonPaddingY: Number(e.target.value) })
                                            }
                                            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500"
                                            placeholder="Padding Y"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-300">Button Background</span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={el.buttonBgColor}
                                        onChange={(e) =>
                                            up({ buttonBgColor: e.target.value })
                                        }
                                        className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                    />
                                    <span className="font-mono text-xs text-gray-400">
                                        {el.buttonBgColor}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-300">Button Text Color</span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={el.buttonTextColor}
                                        onChange={(e) =>
                                            up({ buttonTextColor: e.target.value })
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
            )}

            {/* ── Social Marquee Settings (Only for Social Marquee) */}
            {isSocialMarquee && (
                <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Social Marquee Settings
                    </label>

                    {/* Marquee Speed */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Scroll Speed</span>
                            <span className="font-mono text-gray-400">
                                {el.socialMarqueeSpeed ?? 20}s
                            </span>
                        </div>
                        <input
                            type="range"
                            min={5}
                            max={60}
                            step={5}
                            value={el.socialMarqueeSpeed ?? 20}
                            onChange={(e) =>
                                up({
                                    socialMarqueeSpeed: Number(e.target.value),
                                })
                            }
                            className="w-full cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-[10px] text-gray-500">
                            <span>Fast (5s)</span>
                            <span>Slow (60s)</span>
                        </div>
                    </div>

                    {/* Existing handles */}
                    <div className="space-y-2 pt-1">
                        <div className="text-xs font-medium text-gray-300">
                            Active Handles ({(el.socialHandles ?? []).length})
                        </div>
                        {(el.socialHandles ?? []).map((handle) => (
                            <div
                                key={handle.id}
                                className="space-y-2 rounded-lg border border-gray-800 bg-gray-900/80 p-2.5"
                            >
                                <div className="flex items-center gap-2">
                                    <select
                                        value={handle.platform}
                                        onChange={(e) =>
                                            updateSocialHandle(
                                                handle.id,
                                                "platform",
                                                e.target.value
                                            )
                                        }
                                        className="flex-1 min-w-0 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-white outline-none"
                                    >
                                        {SOCIAL_PLATFORMS.map((p) => (
                                            <option key={p.value} value={p.value}>
                                                {p.label}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeSocialHandle(handle.id)
                                        }
                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-red-900/30 text-red-400 transition hover:bg-red-900 hover:text-white"
                                        title="Delete handle"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Label (e.g. @yourname)"
                                    value={handle.label}
                                    onChange={(e) =>
                                        updateSocialHandle(
                                            handle.id,
                                            "label",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="URL (Map to)"
                                    value={handle.url}
                                    onChange={(e) =>
                                        updateSocialHandle(
                                            handle.id,
                                            "url",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Add new handle */}
                    <div className="space-y-2 rounded-lg border border-dashed border-gray-700 bg-gray-900/40 p-3 pt-2">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Add New Handle
                        </div>
                        <select
                            value={newPlatform}
                            onChange={(e) =>
                                setNewPlatform(e.target.value as SocialPlatformKey)
                            }
                            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-white outline-none"
                        >
                            {SOCIAL_PLATFORMS.map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Label (e.g. @sayan)"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="URL (https://...)"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                        />
                        <button
                            type="button"
                            onClick={addSocialHandle}
                            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
                        >
                            <Plus size={14} />
                            Add Handle
                        </button>
                    </div>
                </div>
            )}

            {/* ── Transform ───────────────────────────────────── */}
            <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Transform
                </label>
                {/* Size (Scale) */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Size (Scale)</span>
                        <span className="font-mono text-gray-400">{el.size ?? 100}%</span>
                    </div>
                    <input
                        type="range"
                        min={20}
                        max={200}
                        step={5}
                        value={el.size ?? 100}
                        onChange={(e) => up({ size: Number(e.target.value) })}
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Rotation */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Rotation</span>
                        <span className="font-mono text-gray-400">{el.rotation}°</span>
                    </div>
                    <input
                        type="range"
                        min={-360}
                        max={360}
                        step={1}
                        value={el.rotation}
                        onChange={(e) => up({ rotation: Number(e.target.value) })}
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Opacity */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Opacity</span>
                        <span className="font-mono text-gray-400">
                            {Math.round((el.opacity ?? 1) * 100)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0.05}
                        max={1}
                        step={0.05}
                        value={el.opacity ?? 1}
                        onChange={(e) => up({ opacity: Number(e.target.value) })}
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>
            </div>

        </div>
    );
}
