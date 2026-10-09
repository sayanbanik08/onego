"use client";

import React, { useState, useRef } from "react";
import {
    Search,
    Crop,
    Upload,
    Check,
    Sparkles,
    Trash2,
} from "lucide-react";
import type { IconElement, IconCustomCrop } from "../../../types/icon";
import {
    SOCIAL_MEDIA_ICONS,
    AVATAR_ICONS,
    EMOJI_CATEGORIES,
} from "../../canvas/elements/icon/iconLibraries";
import IconMoveAndScaleModal from "./IconMoveAndScaleModal";

type IconLibrariesSectionProps = {
    element: IconElement;
    updateElement: (updates: Partial<IconElement>) => void;
};

const SAMPLE_CUSTOM_IMAGES = [
    {
        label: "Modern Portrait",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    {
        label: "Dev at Work",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    {
        label: "Cyberpunk Glow",
        url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80",
    },
    {
        label: "Creative Girl",
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    },
];

export default function IconLibrariesSection({
    element,
    updateElement,
}: IconLibrariesSectionProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [socialCategory, setSocialCategory] = useState<string>("all");
    const [avatarCategory, setAvatarCategory] = useState<string>("all");
    const [activeEmojiCategory, setActiveEmojiCategory] = useState<string>(
        EMOJI_CATEGORIES[0].category
    );
    const [isMoveScaleModalOpen, setIsMoveScaleModalOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // ── Handle Custom File Upload ──
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
            const dataUrl = uploadEvent.target?.result as string;
            updateElement({
                customImageUrl: dataUrl,
                customImageCrop: { x: 0, y: 0, scale: 1.2 },
            });
            // Automatically open Move and Scale editor for framing!
            setIsMoveScaleModalOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveCrop = (crop: IconCustomCrop) => {
        updateElement({ customImageCrop: crop });
    };

    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
            {/* ── 1. SOCIAL MEDIA LIBRARY ──────────────────────────────────── */}
            {element.iconType === "social" && (
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Social Media Library
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                            {SOCIAL_MEDIA_ICONS.length} Available
                        </span>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search
                            size={14}
                            className="absolute left-2.5 top-2.5 text-gray-500"
                        />
                        <input
                            type="text"
                            placeholder="Search social icons..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-md border border-gray-800 bg-gray-950 py-1.5 pl-8 pr-3 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                        {["all", "social", "dev", "media", "chat", "creative"].map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSocialCategory(cat)}
                                className={`rounded-md px-2 py-0.5 capitalize transition shrink-0 ${
                                    socialCategory === cat
                                        ? "bg-blue-600 text-white font-medium"
                                        : "bg-gray-800/80 text-gray-400 hover:text-white"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Icon Grid */}
                    <div className="grid grid-cols-4 gap-1.5 max-h-52 overflow-y-auto pr-1">
                        {SOCIAL_MEDIA_ICONS.filter((item) => {
                            const matchesCat =
                                socialCategory === "all" ||
                                item.category === socialCategory;
                            const matchesSearch = item.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase());
                            return matchesCat && matchesSearch;
                        }).map((item) => {
                            const isSelected = element.socialIconId === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() =>
                                        updateElement({ socialIconId: item.id })
                                    }
                                    title={item.name}
                                    className={`group flex flex-col items-center justify-center gap-1 rounded-lg border p-2 text-center transition ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-600/20 text-white shadow"
                                            : "border-gray-800 bg-gray-950/60 text-gray-400 hover:border-gray-700 hover:bg-gray-800 hover:text-white"
                                    }`}
                                >
                                    <div style={{ color: item.brandColor }}>
                                        {item.svg({ size: 20 })}
                                    </div>
                                    <span className="w-full truncate text-[10px]">
                                        {item.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── 2. AVATAR ICONS LIBRARY ──────────────────────────────────── */}
            {element.iconType === "avatar" && (
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Avatar Icons Library
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                            {AVATAR_ICONS.length} Avatars
                        </span>
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                        {["all", "coder", "creatives", "3d", "minimal"].map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setAvatarCategory(cat)}
                                className={`rounded-md px-2 py-0.5 capitalize transition shrink-0 ${
                                    avatarCategory === cat
                                        ? "bg-blue-600 text-white font-medium"
                                        : "bg-gray-800/80 text-gray-400 hover:text-white"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Avatar Grid */}
                    <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                        {AVATAR_ICONS.filter((item) => {
                            return (
                                avatarCategory === "all" ||
                                item.category === avatarCategory
                            );
                        }).map((item) => {
                            const isSelected = element.avatarIconId === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() =>
                                        updateElement({ avatarIconId: item.id })
                                    }
                                    className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-2 text-center transition ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-600/20 text-white shadow-sm ring-1 ring-blue-500"
                                            : "border-gray-800 bg-gray-950/60 text-gray-400 hover:border-gray-700 hover:bg-gray-800 hover:text-white"
                                    }`}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center">
                                        {item.svg({ size: 36 })}
                                    </div>
                                    <span className="w-full truncate text-[10px] font-medium">
                                        {item.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── 3. EMOJI PICKER LIBRARY ──────────────────────────────────── */}
            {element.iconType === "emoji" && (
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Emoji Picker Library
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-gray-400">Selected:</span>
                            <span className="rounded bg-gray-800 px-1.5 py-0.5 text-sm">
                                {element.emoji || "🚀"}
                            </span>
                        </div>
                    </div>

                    {/* Search Emoji */}
                    <div className="relative">
                        <Search
                            size={14}
                            className="absolute left-2.5 top-2.5 text-gray-500"
                        />
                        <input
                            type="text"
                            placeholder="Filter emojis..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-md border border-gray-800 bg-gray-950 py-1.5 pl-8 pr-3 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Emoji Category Tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs no-scrollbar">
                        {EMOJI_CATEGORIES.map((cat) => (
                            <button
                                key={cat.category}
                                type="button"
                                onClick={() => {
                                    setActiveEmojiCategory(cat.category);
                                    setSearchQuery("");
                                }}
                                title={cat.category}
                                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition shrink-0 ${
                                    activeEmojiCategory === cat.category
                                        ? "bg-blue-600 text-white font-medium"
                                        : "bg-gray-800/80 text-gray-400 hover:text-white"
                                }`}
                            >
                                <span>{cat.icon}</span>
                                <span className="text-[10px] hidden sm:inline">
                                    {cat.category.split(" ")[0]}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Emoji Grid */}
                    <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto pr-1">
                        {(() => {
                            const list = searchQuery
                                ? EMOJI_CATEGORIES.flatMap((c) => c.emojis)
                                : EMOJI_CATEGORIES.find(
                                      (c) => c.category === activeEmojiCategory
                                  )?.emojis || [];

                            return list.map((em, idx) => {
                                const isSelected = element.emoji === em;
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => updateElement({ emoji: em })}
                                        className={`flex h-8 w-8 items-center justify-center rounded-md text-lg transition active:scale-95 ${
                                            isSelected
                                                ? "bg-blue-600/40 border border-blue-500"
                                                : "hover:bg-gray-800"
                                        }`}
                                    >
                                        {em}
                                    </button>
                                );
                            });
                        })()}
                    </div>
                </div>
            )}

            {/* ── 4. CUSTOM (IMAGE UPLOAD & MOVE / SCALE) ──────────────────── */}
            {element.iconType === "custom" && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Custom Image Upload
                        </span>
                        {element.customImageUrl && (
                            <span className="rounded bg-emerald-950/60 px-1.5 py-0.5 text-[10px] text-emerald-400 border border-emerald-800">
                                Active Image
                            </span>
                        )}
                    </div>

                    {/* Hidden File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />

                    {/* Upload / Replace Button */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-600/80 bg-blue-600/20 px-3 py-2 text-xs font-medium text-blue-300 transition hover:bg-blue-600/30 active:scale-[0.99]"
                        >
                            <Upload size={14} />
                            <span>{element.customImageUrl ? "Replace Image" : "Upload Image"}</span>
                        </button>

                        {element.customImageUrl && (
                            <button
                                type="button"
                                onClick={() =>
                                    updateElement({
                                        customImageUrl: "",
                                        customImageCrop: { x: 0, y: 0, scale: 1 },
                                    })
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-900 bg-red-950/40 text-red-400 hover:bg-red-900/60 transition"
                                title="Remove Image"
                            >
                                <Trash2 size={13} />
                            </button>
                        )}
                    </div>

                    {/* Interactive Framing & Crop Section */}
                    {element.customImageUrl ? (
                        <div className="space-y-2 rounded-lg border border-gray-800 bg-gray-950 p-2.5">
                            <div className="flex items-center gap-3">
                                {/* Thumbnail preview with current crop */}
                                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/20 bg-black shrink-0">
                                    <img
                                        src={element.customImageUrl}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                        style={{
                                            transform: `translate(${element.customImageCrop?.x ?? 0}%, ${element.customImageCrop?.y ?? 0}%) scale(${element.customImageCrop?.scale ?? 1})`,
                                            transformOrigin: "center center",
                                        }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-white truncate">
                                        Position & Scale
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-0.5">
                                        Zoom: {Math.round((element.customImageCrop?.scale ?? 1) * 100)}% • Offset: ({element.customImageCrop?.x ?? 0}, {element.customImageCrop?.y ?? 0})
                                    </div>
                                </div>
                            </div>

                            {/* Move and Scale Adjustment Button */}
                            <button
                                type="button"
                                onClick={() => setIsMoveScaleModalOpen(true)}
                                className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:border-gray-600 hover:bg-gray-700 transition active:scale-[0.99]"
                            >
                                <Crop size={14} className="text-blue-400" />
                                <span>Adjust / Move & Scale Framing</span>
                            </button>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed border-gray-800 p-3 text-center">
                            <p className="text-xs text-gray-500">
                                Upload an image from device or choose a preset below.
                            </p>
                        </div>
                    )}

                    {/* Sample Preset Images */}
                    <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] text-gray-400">
                            <span className="flex items-center gap-1">
                                <Sparkles size={11} className="text-yellow-400" />
                                Or pick a sample preset:
                            </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                            {SAMPLE_CUSTOM_IMAGES.map((sample, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        updateElement({
                                            customImageUrl: sample.url,
                                            customImageCrop: { x: 0, y: 0, scale: 1.2 },
                                        });
                                        setIsMoveScaleModalOpen(true);
                                    }}
                                    className="group relative h-12 w-full overflow-hidden rounded-md border border-gray-800 hover:border-blue-500 transition"
                                    title={sample.label}
                                >
                                    <img
                                        src={sample.url}
                                        alt={sample.label}
                                        className="h-full w-full object-cover group-hover:scale-105 transition"
                                    />
                                    {element.customImageUrl === sample.url && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-blue-600/50">
                                            <Check size={14} className="text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── 5. Move & Scale Modal (Exact Mobile Interface) ───────────── */}
            <IconMoveAndScaleModal
                isOpen={isMoveScaleModalOpen}
                imageUrl={element.customImageUrl}
                initialCrop={element.customImageCrop}
                onClose={() => setIsMoveScaleModalOpen(false)}
                onSave={handleSaveCrop}
            />
        </div>
    );
}
