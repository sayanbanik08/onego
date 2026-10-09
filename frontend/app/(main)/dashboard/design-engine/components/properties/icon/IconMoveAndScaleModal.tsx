"use client";

import React, { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import type { IconCustomCrop } from "../../../types/icon";

type IconMoveAndScaleModalProps = {
    isOpen: boolean;
    imageUrl: string;
    initialCrop?: IconCustomCrop;
    onClose: () => void;
    onSave: (crop: IconCustomCrop) => void;
};

const STAGE_SIZE = 320; // 320px circular stage

export default function IconMoveAndScaleModal({
    isOpen,
    imageUrl,
    initialCrop,
    onClose,
    onSave,
}: IconMoveAndScaleModalProps) {
    const [scale, setScale] = useState<number>(initialCrop?.scale ?? 1.2);
    // Convert normalized percentage crop to modal pixels
    const [pan, setPan] = useState<{ x: number; y: number }>({
        x: ((initialCrop?.x ?? 0) / 100) * STAGE_SIZE,
        y: ((initialCrop?.y ?? 0) / 100) * STAGE_SIZE,
    });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef<{
        x: number;
        y: number;
        initialPanX: number;
        initialPanY: number;
    }>({
        x: 0,
        y: 0,
        initialPanX: 0,
        initialPanY: 0,
    });

    useEffect(() => {
        if (isOpen) {
            setScale(initialCrop?.scale ?? 1.2);
            setPan({
                x: ((initialCrop?.x ?? 0) / 100) * STAGE_SIZE,
                y: ((initialCrop?.y ?? 0) / 100) * STAGE_SIZE,
            });
        }
    }, [isOpen, initialCrop]);

    if (!isOpen) return null;

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            initialPanX: pan.x,
            initialPanY: pan.y,
        };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        setPan({
            x: Math.round(dragStartRef.current.initialPanX + dx),
            y: Math.round(dragStartRef.current.initialPanY + dy),
        });
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(false);
        try {
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {
            // ignore
        }
    };

    const handleReset = () => {
        setScale(1.2);
        setPan({ x: 0, y: 0 });
    };

    const handleSave = () => {
        // Convert modal pixels back to normalized percentage
        const panXPercent = Number(((pan.x / STAGE_SIZE) * 100).toFixed(2));
        const panYPercent = Number(((pan.y / STAGE_SIZE) * 100).toFixed(2));
        onSave({
            x: panXPercent,
            y: panYPercent,
            scale,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black text-white select-none backdrop-blur-md">
            {/* Top Title Bar */}
            <div className="w-full pt-8 pb-4 text-center">
                <h2 className="text-base font-medium tracking-tight text-white/90">
                    Move and scale
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
                    Drag image to reposition • Slider to adjust zoom
                </p>
            </div>

            {/* Viewport Frame with Circular Vignette */}
            <div className="relative flex flex-1 w-full items-center justify-center overflow-hidden">
                {/* Image Stage Container (Exact 320x320 box) */}
                <div
                    className="relative h-80 w-80 cursor-grab active:cursor-grabbing touch-none select-none flex items-center justify-center overflow-hidden"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    {/* Underlying Image: object-cover guarantees full coverage with no black gaps! */}
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Crop Target"
                            draggable={false}
                            className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none transition-transform duration-75 ease-out"
                            style={{
                                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                                transformOrigin: "center center",
                            }}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-900 text-gray-500">
                            No image selected
                        </div>
                    )}

                    {/* Darkened Vignette Overlay with Center Circular Cutout */}
                    <div
                        className="pointer-events-none absolute inset-0 z-10"
                        style={{
                            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.72)",
                            borderRadius: "50%",
                            border: "2px solid rgba(255, 255, 255, 0.85)",
                        }}
                    />

                    {/* Subtle grid lines inside circle */}
                    <div className="pointer-events-none absolute inset-0 rounded-full border border-white/20 z-10">
                        <div className="absolute top-1/3 left-0 right-0 h-px bg-white/15" />
                        <div className="absolute top-2/3 left-0 right-0 h-px bg-white/15" />
                        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/15" />
                        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/15" />
                    </div>
                </div>
            </div>

            {/* Zoom Slider and Controls */}
            <div className="w-full max-w-xs px-6 py-3 flex flex-col items-center gap-2">
                <div className="flex w-full items-center gap-3">
                    <ZoomOut size={16} className="text-white/60" />
                    <input
                        type="range"
                        min={1}
                        max={4}
                        step={0.05}
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="h-1.5 flex-1 cursor-pointer accent-white bg-white/20 rounded-lg"
                    />
                    <ZoomIn size={16} className="text-white/60" />
                </div>
                <div className="flex items-center gap-4 text-xs text-white/50">
                    <span>Zoom: {Math.round(scale * 100)}%</span>
                    <span>•</span>
                    <span>Offset: ({Math.round(pan.x)}px, {Math.round(pan.y)}px)</span>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-1 text-white/70 hover:text-white transition"
                    >
                        <RotateCcw size={12} /> Reset
                    </button>
                </div>
            </div>

            {/* Bottom Actions Bar (Matches Screenshot) */}
            <div className="w-full px-8 pb-10 pt-4 flex items-center justify-between border-t border-white/10 bg-black/80">
                <button
                    type="button"
                    onClick={onClose}
                    className="text-base font-normal text-white hover:text-white/80 active:scale-95 transition"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    className="text-base font-semibold text-white hover:text-white/80 active:scale-95 transition"
                >
                    Choose
                </button>
            </div>
        </div>
    );
}
