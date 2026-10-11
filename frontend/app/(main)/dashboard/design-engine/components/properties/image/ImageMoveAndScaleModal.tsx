"use client";

import React, { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Circle, Square, RectangleHorizontal, Hexagon, Gem } from "lucide-react";
import type { ImageCustomCrop, ImageFrameShape } from "../../../types/image";

type ImageMoveAndScaleModalProps = {
    isOpen: boolean;
    imageUrl: string;
    initialCrop?: ImageCustomCrop;
    frameShape?: ImageFrameShape;
    onClose: () => void;
    onSave: (crop: ImageCustomCrop, shape: ImageFrameShape) => void;
};

const STAGE_SIZE = 320; // 320px stage

const FRAME_SHAPES: { id: ImageFrameShape; label: string; icon: React.ReactNode }[] = [
    { id: "circle", label: "Circle", icon: <Circle size={13} /> },
    { id: "square", label: "Square", icon: <Square size={13} /> },
    { id: "rounded", label: "Rounded", icon: <RectangleHorizontal size={13} /> },
    { id: "hexagon", label: "Hexagon", icon: <Hexagon size={13} /> },
    { id: "diamond", label: "Diamond", icon: <Gem size={13} /> },
    { id: "blob", label: "Organic", icon: <span className="text-[12px]">💧</span> },
];

export default function ImageMoveAndScaleModal({
    isOpen,
    imageUrl,
    initialCrop,
    frameShape = "rounded",
    onClose,
    onSave,
}: ImageMoveAndScaleModalProps) {
    const [scale, setScale] = useState<number>(initialCrop?.scale ?? 1);
    const [selectedShape, setSelectedShape] = useState<ImageFrameShape>(frameShape);

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
            setScale(initialCrop?.scale ?? 1);
            setSelectedShape(frameShape);
            setPan({
                x: ((initialCrop?.x ?? 0) / 100) * STAGE_SIZE,
                y: ((initialCrop?.y ?? 0) / 100) * STAGE_SIZE,
            });
        }
    }, [isOpen, initialCrop, frameShape]);

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
        setScale(1);
        setPan({ x: 0, y: 0 });
    };

    const handleSave = () => {
        // Convert modal pixels back to normalized percentage
        const panXPercent = Number(((pan.x / STAGE_SIZE) * 100).toFixed(2));
        const panYPercent = Number(((pan.y / STAGE_SIZE) * 100).toFixed(2));
        onSave(
            {
                x: panXPercent,
                y: panYPercent,
                scale,
            },
            selectedShape
        );
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black text-white select-none backdrop-blur-md">
            {/* Top Title Bar & Shape Selector */}
            <div className="w-full pt-6 pb-2 text-center flex flex-col items-center gap-2">
                <div>
                    <h2 className="text-base font-medium tracking-tight text-white/90">
                        Move and scale
                    </h2>
                    <p className="text-xs text-white/50 mt-0.5">
                        Drag image to reposition • Choose frame shape • Adjust zoom
                    </p>
                </div>

                {/* Shape Switcher Pills */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 px-4 pt-1">
                    {FRAME_SHAPES.map((shape) => {
                        const isCurrent = selectedShape === shape.id;
                        return (
                            <button
                                key={shape.id}
                                type="button"
                                onClick={() => setSelectedShape(shape.id)}
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition ${
                                    isCurrent
                                        ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-500/30"
                                        : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"
                                }`}
                            >
                                {shape.icon}
                                <span>{shape.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Viewport Frame with Shape Vignette */}
            <div className="relative flex flex-1 w-full items-center justify-center overflow-hidden">
                {/* Image Stage Container (Exact 320x320 box) */}
                <div
                    className="relative h-80 w-80 cursor-grab active:cursor-grabbing touch-none select-none flex items-center justify-center overflow-hidden"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    {/* Underlying Image */}
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

                    {/* Darkened Vignette Overlay using SVG Cutout */}
                    <svg
                        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
                        viewBox="0 0 320 320"
                    >
                        <defs>
                            <mask id="shape-cutout-mask">
                                <rect x="0" y="0" width="320" height="320" fill="white" />
                                {selectedShape === "circle" && (
                                    <circle cx="160" cy="160" r="145" fill="black" />
                                )}
                                {selectedShape === "square" && (
                                    <rect x="15" y="15" width="290" height="290" fill="black" />
                                )}
                                {selectedShape === "rounded" && (
                                    <rect
                                        x="15"
                                        y="15"
                                        width="290"
                                        height="290"
                                        rx="36"
                                        ry="36"
                                        fill="black"
                                    />
                                )}
                                {selectedShape === "hexagon" && (
                                    <polygon
                                        points="160,15 285,87 285,233 160,305 35,233 35,87"
                                        fill="black"
                                    />
                                )}
                                {selectedShape === "diamond" && (
                                    <polygon
                                        points="160,15 305,160 160,305 15,160"
                                        fill="black"
                                    />
                                )}
                                {selectedShape === "blob" && (
                                    <path
                                        d="M160,20 C230,10 300,80 300,160 C300,240 220,300 150,300 C80,300 20,240 20,160 C20,80 90,30 160,20 Z"
                                        fill="black"
                                    />
                                )}
                            </mask>
                        </defs>
                        {/* Dark surround */}
                        <rect
                            x="0"
                            y="0"
                            width="320"
                            height="320"
                            fill="rgba(0, 0, 0, 0.72)"
                            mask="url(#shape-cutout-mask)"
                        />
                        {/* Crisp Shape Frame Border */}
                        {selectedShape === "circle" && (
                            <circle
                                cx="160"
                                cy="160"
                                r="145"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.85)"
                                strokeWidth="2"
                            />
                        )}
                        {selectedShape === "square" && (
                            <rect
                                x="15"
                                y="15"
                                width="290"
                                height="290"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.85)"
                                strokeWidth="2"
                            />
                        )}
                        {selectedShape === "rounded" && (
                            <rect
                                x="15"
                                y="15"
                                width="290"
                                height="290"
                                rx="36"
                                ry="36"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.85)"
                                strokeWidth="2"
                            />
                        )}
                        {selectedShape === "hexagon" && (
                            <polygon
                                points="160,15 285,87 285,233 160,305 35,233 35,87"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.85)"
                                strokeWidth="2"
                            />
                        )}
                        {selectedShape === "diamond" && (
                            <polygon
                                points="160,15 305,160 160,305 15,160"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.85)"
                                strokeWidth="2"
                            />
                        )}
                        {selectedShape === "blob" && (
                            <path
                                d="M160,20 C230,10 300,80 300,160 C300,240 220,300 150,300 C80,300 20,240 20,160 C20,80 90,30 160,20 Z"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.85)"
                                strokeWidth="2"
                            />
                        )}
                    </svg>

                    {/* Subtle Rule-of-thirds grid lines */}
                    <div className="pointer-events-none absolute inset-0 z-10 p-4 opacity-25">
                        <div className="h-full w-full relative">
                            <div className="absolute top-1/3 left-0 right-0 h-px bg-white" />
                            <div className="absolute top-2/3 left-0 right-0 h-px bg-white" />
                            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white" />
                            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Zoom Slider and Controls */}
            <div className="w-full max-w-xs px-6 py-2 flex flex-col items-center gap-2">
                <div className="flex w-full items-center gap-3">
                    <ZoomOut size={16} className="text-white/60" />
                    <input
                        type="range"
                        min={0.5}
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

            {/* Bottom Actions Bar */}
            <div className="w-full px-8 pb-8 pt-4 flex items-center justify-between border-t border-white/10 bg-black/80">
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
