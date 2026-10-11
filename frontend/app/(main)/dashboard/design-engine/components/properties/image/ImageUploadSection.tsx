"use client";

import React, { useState, useRef } from "react";
import {
    Upload,
    Trash2,
    Crop,
    Sparkles,
    Check,
    Circle,
    Square,
    RectangleHorizontal,
    Hexagon,
    Gem,
} from "lucide-react";
import type { ImageElement, ImageCustomCrop, ImageFrameShape } from "../../../types/image";
import ImageMoveAndScaleModal from "./ImageMoveAndScaleModal";

type ImageUploadSectionProps = {
    element: ImageElement;
    updateElement: (updates: Partial<ImageElement>) => void;
};

const SAMPLE_PRESET_IMAGES = [
    {
        label: "Neon Cyber",
        url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    },
    {
        label: "Portrait",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    },
    {
        label: "Minimal Architecture",
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    },
    {
        label: "Abstract 3D",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    },
    {
        label: "Nordic Minimal",
        url: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=600&auto=format&fit=crop&q=80",
    },
    {
        label: "Cyberpunk Street",
        url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80",
    },
    {
        label: "Gradient Fluid",
        url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    },
    {
        label: "Nature Landscape",
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    },
];

const FRAME_SHAPES: { id: ImageFrameShape; label: string; icon: React.ReactNode }[] = [
    { id: "circle", label: "Circle", icon: <Circle size={12} /> },
    { id: "square", label: "Square", icon: <Square size={12} /> },
    { id: "rounded", label: "Rounded", icon: <RectangleHorizontal size={12} /> },
    { id: "hexagon", label: "Hexagon", icon: <Hexagon size={12} /> },
    { id: "diamond", label: "Diamond", icon: <Gem size={12} /> },
    { id: "blob", label: "Blob", icon: <span className="text-[11px]">💧</span> },
];

export default function ImageUploadSection({
    element,
    updateElement,
}: ImageUploadSectionProps) {
    const [isMoveScaleModalOpen, setIsMoveScaleModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            if (result) {
                updateElement({
                    imageUrl: result,
                    imageCrop: { x: 0, y: 0, scale: 1 },
                });
                setIsMoveScaleModalOpen(true);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSaveCrop = (crop: ImageCustomCrop, shape?: ImageFrameShape) => {
        updateElement({
            imageCrop: crop,
            ...(shape ? { frameShape: shape } : {}),
        });
    };

    return (
        <div className="space-y-3.5 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Custom Image Upload
                </span>
                {element.imageUrl && (
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
                    <span>{element.imageUrl ? "Replace Image" : "Upload Image"}</span>
                </button>

                {element.imageUrl && (
                    <button
                        type="button"
                        onClick={() =>
                            updateElement({
                                imageUrl: "",
                                imageCrop: { x: 0, y: 0, scale: 1 },
                            })
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-900 bg-red-950/40 text-red-400 hover:bg-red-900/60 transition"
                        title="Remove Image"
                    >
                        <Trash2 size={13} />
                    </button>
                )}
            </div>

            {/* Frame Shape Selector */}
            <div className="space-y-1.5 border-t border-gray-800/80 pt-2.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300 font-medium">Frame Shape</span>
                    <span className="text-[10px] text-gray-500 capitalize">
                        {element.frameShape || "rounded"}
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                    {FRAME_SHAPES.map((shape) => {
                        const isSelected = element.frameShape === shape.id;
                        return (
                            <button
                                key={shape.id}
                                type="button"
                                onClick={() => updateElement({ frameShape: shape.id })}
                                className={`flex items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs transition ${
                                    isSelected
                                        ? "border-blue-500 bg-blue-600/20 text-white font-medium ring-1 ring-blue-500/40"
                                        : "border-gray-800 bg-gray-950/70 text-gray-400 hover:border-gray-700 hover:text-white"
                                }`}
                            >
                                {shape.icon}
                                <span className="text-[11px]">{shape.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Interactive Framing & Crop Section */}
            {element.imageUrl ? (
                <div className="space-y-2 rounded-lg border border-gray-800 bg-gray-950 p-2.5">
                    <div className="flex items-center gap-3">
                        {/* Thumbnail preview with current crop and shape */}
                        <div
                            className={`relative h-14 w-14 overflow-hidden border border-white/20 bg-black shrink-0 ${
                                element.frameShape === "circle"
                                    ? "rounded-full"
                                    : element.frameShape === "square"
                                    ? "rounded-none"
                                    : "rounded-lg"
                            }`}
                        >
                            <img
                                src={element.imageUrl}
                                alt="Preview"
                                className="h-full w-full object-cover"
                                style={{
                                    transform: `translate(${element.imageCrop?.x ?? 0}%, ${element.imageCrop?.y ?? 0}%) scale(${element.imageCrop?.scale ?? 1})`,
                                    transformOrigin: "center center",
                                }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-white truncate">
                                Position & Scale
                            </div>
                            <div className="text-[10px] text-gray-400 mt-0.5">
                                Zoom: {Math.round((element.imageCrop?.scale ?? 1) * 100)}% • Offset: (
                                {element.imageCrop?.x ?? 0}, {element.imageCrop?.y ?? 0})
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
            <div className="space-y-1.5 pt-1 border-t border-gray-800/80">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                        <Sparkles size={11} className="text-yellow-400" />
                        Or pick a sample preset:
                    </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                    {SAMPLE_PRESET_IMAGES.map((sample, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => {
                                updateElement({
                                    imageUrl: sample.url,
                                    imageCrop: { x: 0, y: 0, scale: 1 },
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
                            {element.imageUrl === sample.url && (
                                <div className="absolute inset-0 flex items-center justify-center bg-blue-600/50">
                                    <Check size={14} className="text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Move & Scale Modal */}
            <ImageMoveAndScaleModal
                isOpen={isMoveScaleModalOpen}
                imageUrl={element.imageUrl}
                initialCrop={element.imageCrop}
                frameShape={element.frameShape}
                onClose={() => setIsMoveScaleModalOpen(false)}
                onSave={handleSaveCrop}
            />
        </div>
    );
}
