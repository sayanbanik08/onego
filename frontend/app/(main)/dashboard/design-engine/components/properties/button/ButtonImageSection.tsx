"use client";

import React, { useRef, useState } from "react";
import { Upload, Trash2, Image as ImageIcon, Move } from "lucide-react";
import type { ButtonElement, ButtonImageFit } from "../../../types/button";
import { SAMPLE_BUTTON_IMAGES } from "../../canvas/elements/button/buttonHelpers";

type ButtonImageSectionProps = {
    element: ButtonElement;
    updateElement: (updates: Partial<ButtonElement>) => void;
};

export default function ButtonImageSection({
    element,
    updateElement,
}: ButtonImageSectionProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const cropBoxRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
            const dataUrl = uploadEvent.target?.result as string;
            if (dataUrl) {
                updateElement({ bgImage: dataUrl });
            }
        };
        reader.readAsDataURL(file);
    };

    // ── Interactive Drag to Pan / Crop ──────────────────────────────────
    const handleCropPointer = (clientX: number, clientY: number) => {
        if (!cropBoxRef.current) return;
        const rect = cropBoxRef.current.getBoundingClientRect();
        const xPercent = Math.max(
            0,
            Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100))
        );
        const yPercent = Math.max(
            0,
            Math.min(100, Math.round(((clientY - rect.top) / rect.height) * 100))
        );
        updateElement({ bgImagePosition: `${xPercent}% ${yPercent}%` });
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        handleCropPointer(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        handleCropPointer(e.clientX, e.clientY);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(false);
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            // ignore
        }
    };

    // Parse current position percentage for crosshair indicator
    const currentPos = element.bgImagePosition || "50% 50%";
    let focalX = 50;
    let focalY = 50;
    const parts = currentPos.replace(/%/g, "").split(" ");
    if (parts.length >= 2) {
        focalX = Math.max(0, Math.min(100, Number(parts[0]) || 50));
        focalY = Math.max(0, Math.min(100, Number(parts[1]) || 50));
    } else if (currentPos === "top") {
        focalX = 50; focalY = 0;
    } else if (currentPos === "bottom") {
        focalX = 50; focalY = 100;
    } else if (currentPos === "left") {
        focalX = 0; focalY = 50;
    } else if (currentPos === "right") {
        focalX = 100; focalY = 50;
    }

    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Background Image & Crop
                </span>
                {element.bgImage && (
                    <button
                        type="button"
                        onClick={() => updateElement({ bgImage: "" })}
                        className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition"
                        title="Remove Image"
                    >
                        <Trash2 size={12} />
                        <span>Remove</span>
                    </button>
                )}
            </div>

            {/* Image URL Input & Upload Button */}
            <div className="space-y-1.5">
                <span className="text-xs text-gray-300">Image URL or Upload</span>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Paste image URL..."
                        value={element.bgImage}
                        onChange={(e) => updateElement({ bgImage: e.target.value })}
                        className="flex-1 min-w-0 rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-8 items-center gap-1 shrink-0 rounded-lg border border-gray-700 bg-gray-800 px-2.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition"
                        title="Upload from computer"
                    >
                        <Upload size={13} />
                        <span>Upload</span>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                </div>
            </div>

            {/* Quick Sample Presets */}
            <div className="space-y-1">
                <span className="text-[11px] text-gray-400">Quick Image Presets:</span>
                <div className="grid grid-cols-2 gap-1.5">
                    {SAMPLE_BUTTON_IMAGES.map((sample) => (
                        <button
                            key={sample.label}
                            type="button"
                            onClick={() => updateElement({ bgImage: sample.url })}
                            className="rounded border border-gray-800 bg-gray-900/80 px-2 py-1.5 text-center text-[10px] text-gray-300 hover:border-blue-500 hover:text-blue-400 transition truncate"
                        >
                            {sample.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Interactive Drag-to-Crop Box when Image is Set */}
            {element.bgImage ? (
                <div className="space-y-3 pt-2 border-t border-gray-800/80">
                    <div className="relative rounded-lg border border-gray-700 bg-black/60 p-2 overflow-hidden">
                        <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1.5">
                            <span className="flex items-center gap-1 font-medium text-blue-300">
                                <Move size={12} />
                                <span>Hold & Drag to Crop / Pan</span>
                            </span>
                            <span className="font-mono text-[10px] text-blue-400">
                                {focalX}% {focalY}%
                            </span>
                        </div>

                        {/* Interactive Drag Canvas */}
                        <div
                            ref={cropBoxRef}
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                            className={`relative h-28 w-full select-none rounded border border-blue-500/50 overflow-hidden touch-none ${
                                isDragging ? "cursor-grabbing ring-2 ring-blue-500" : "cursor-grab"
                            }`}
                            style={{
                                backgroundImage: `url(${element.bgImage})`,
                                backgroundSize: element.bgImageFit || "cover",
                                backgroundPosition: element.bgImagePosition || "center",
                                backgroundRepeat: element.bgImageFit === "repeat" ? "repeat" : "no-repeat",
                                opacity: element.bgImageOpacity ?? 1,
                            }}
                        >
                            {/* 3x3 Grid Overlay */}
                            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-25">
                                <div className="border-r border-b border-white" />
                                <div className="border-r border-b border-white" />
                                <div className="border-b border-white" />
                                <div className="border-r border-b border-white" />
                                <div className="border-r border-b border-white" />
                                <div className="border-b border-white" />
                                <div className="border-r border-white" />
                                <div className="border-r border-white" />
                                <div />
                            </div>

                            {/* Focal Target Crosshair */}
                            <div
                                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-75"
                                style={{
                                    left: `${focalX}%`,
                                    top: `${focalY}%`,
                                }}
                            >
                                <div className="h-6 w-6 rounded-full border-2 border-white bg-blue-500/40 shadow-lg ring-1 ring-black flex items-center justify-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
                                </div>
                            </div>
                        </div>

                        <p className="mt-1 text-center text-[10px] text-gray-400 italic">
                            Click or drag inside the box to reposition the focal crop.
                        </p>
                    </div>

                    {/* Quick Snap Alignment Buttons */}
                    <div className="space-y-1">
                        <span className="text-[11px] text-gray-400">Quick Snap:</span>
                        <div className="grid grid-cols-5 gap-1">
                            {[
                                { label: "Center", val: "50% 50%" },
                                { label: "Top", val: "50% 0%" },
                                { label: "Bottom", val: "50% 100%" },
                                { label: "Left", val: "0% 50%" },
                                { label: "Right", val: "100% 50%" },
                            ].map((snap) => (
                                <button
                                    key={snap.label}
                                    type="button"
                                    onClick={() =>
                                        updateElement({ bgImagePosition: snap.val })
                                    }
                                    className="rounded border border-gray-800 bg-gray-900 py-1 text-center text-[10px] text-gray-400 hover:border-gray-700 hover:text-white transition"
                                >
                                    {snap.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image Fit */}
                    <div className="space-y-1">
                        <span className="text-xs text-gray-300">Image Fit (Crop Mode)</span>
                        <div className="grid grid-cols-4 gap-1">
                            {(["cover", "contain", "fill", "repeat"] as ButtonImageFit[]).map((fit) => (
                                <button
                                    key={fit}
                                    type="button"
                                    onClick={() => updateElement({ bgImageFit: fit })}
                                    className={`rounded border py-1 text-center text-xs capitalize transition ${
                                        element.bgImageFit === fit
                                            ? "border-blue-500 bg-blue-600/30 text-blue-300 font-semibold"
                                            : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                                    }`}
                                >
                                    {fit}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image Opacity Slider */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Image Opacity</span>
                            <span className="font-mono text-gray-400">
                                {Math.round((element.bgImageOpacity ?? 1) * 100)}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={element.bgImageOpacity ?? 1}
                            onChange={(e) =>
                                updateElement({
                                    bgImageOpacity: Number(e.target.value),
                                })
                            }
                            className="w-full cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>
            ) : (
                <p className="text-[11px] text-gray-500 italic">
                    Paste an image URL or choose a preset above to enable interactive crop & pan.
                </p>
            )}
        </div>
    );
}
