"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type {
    CardElement,
    SocialHandleItem,
    SocialPlatformKey,
} from "../../../types/card";

export const SOCIAL_PLATFORMS: {
    value: SocialPlatformKey;
    label: string;
}[] = [
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

export function CardSocialMarqueeSection({
    element: el,
    updateElement,
}: {
    element: CardElement;
    updateElement: (updates: Partial<CardElement>) => void;
}) {
    const [newPlatform, setNewPlatform] =
        useState<SocialPlatformKey>("instagram");
    const [newLabel, setNewLabel] = useState("");
    const [newUrl, setNewUrl] = useState("");

    const addSocialHandle = () => {
        const handle: SocialHandleItem = {
            id: crypto.randomUUID(),
            platform: newPlatform,
            label: newLabel || newPlatform,
            url: newUrl,
        };
        updateElement({
            socialHandles: [...(el.socialHandles ?? []), handle],
        });
        setNewLabel("");
        setNewUrl("");
    };

    const removeSocialHandle = (id: string) => {
        updateElement({
            socialHandles: (el.socialHandles ?? []).filter((h) => h.id !== id),
        });
    };

    const updateSocialHandle = (
        id: string,
        field: keyof SocialHandleItem,
        value: string
    ) => {
        updateElement({
            socialHandles: (el.socialHandles ?? []).map((h) =>
                h.id === id ? { ...h, [field]: value } : h
            ),
        });
    };

    return (
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
                        updateElement({
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
                                onClick={() => removeSocialHandle(handle.id)}
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
    );
}
