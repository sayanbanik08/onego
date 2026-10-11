"use client";

import React from "react";
import type { ImageElement } from "../../../../types/image";
import { getImageShadow } from "./imageHelpers";

type ImageRendererProps = {
    element: ImageElement;
    isInteractive?: boolean;
    onImageClick?: (e: React.MouseEvent) => void;
};

export function ImageRenderer({
    element,
    isInteractive = false,
    onImageClick,
}: ImageRendererProps) {
    const {
        imageUrl,
        imageCrop,
        frameShape,
        theme,
        width,
        widthUnit,
        height,
        heightUnit,
        frameColor,
        borderColor,
        borderWidth,
        borderStyle,
        borderRadius,
        borderRadiusUnit,
    } = element;

    const w = widthUnit === "%" ? `${width}%` : `${width}px`;
    const h = heightUnit === "%" ? `${height}px` : `${height}px`;

    // ── 1. Calculate Shape Styling & Clip Paths ──────────────────────────────
    let shapeRadius = "0px";
    let shapeClipPath: string | undefined = undefined;

    if (frameShape === "circle") {
        shapeRadius = "50%";
    } else if (frameShape === "square") {
        shapeRadius = "0px";
    } else if (frameShape === "rounded") {
        shapeRadius = `${borderRadius ?? 16}${borderRadiusUnit || "px"}`;
    } else if (frameShape === "hexagon") {
        shapeClipPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
    } else if (frameShape === "diamond") {
        shapeClipPath = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";
    } else if (frameShape === "blob") {
        shapeRadius = "60% 40% 30% 70% / 60% 30% 70% 40%";
    } else {
        shapeRadius = `${borderRadius ?? 16}${borderRadiusUnit || "px"}`;
    }

    // ── 2. Theme Presets ─────────────────────────────────────────────────────
    let themeBg = frameColor || "#18181b";
    let themeBorderColor = borderColor || "#3f3f46";
    let themeBorderWidth = borderWidth ?? 1;
    let themeExtraClass = "";
    let themeExtraShadow = "";
    let isPolaroid = theme === "polaroid";
    let isFilmStrip = theme === "film-strip";
    let isDoubleBorder = theme === "double-border";
    let isRusticWood = theme === "rustic-wood";

    if (theme === "minimal-clean") {
        themeBg = frameColor || "#18181b";
        themeBorderColor = borderColor || "#27272a";
        themeBorderWidth = borderWidth ?? 1;
    } else if (theme === "polaroid") {
        themeBg = frameColor || "#ffffff";
        themeBorderColor = borderColor || "#e4e4e7";
        themeBorderWidth = borderWidth ?? 1;
        themeExtraShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.3)";
    } else if (theme === "film-strip") {
        themeBg = frameColor || "#09090b";
        themeBorderColor = borderColor || "#27272a";
        themeBorderWidth = borderWidth ?? 2;
    } else if (theme === "neon-border") {
        themeBg = frameColor || "#050510";
        themeBorderColor = borderColor || "#06b6d4";
        themeBorderWidth = Math.max(1.5, themeBorderWidth);
        themeExtraShadow = `0 0 14px ${themeBorderColor}aa, 0 0 28px ${themeBorderColor}44`;
    } else if (theme === "gradient-glow") {
        themeBg = frameColor || "#18181b";
        themeBorderColor = borderColor || "#a855f7";
        themeBorderWidth = Math.max(1.5, themeBorderWidth);
        themeExtraShadow = "0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(236, 72, 153, 0.2)";
    } else if (theme === "glassmorphic") {
        themeBg = frameColor
            ? frameColor.startsWith("#") && frameColor.length === 7
                ? `${frameColor}33`
                : frameColor
            : "rgba(255, 255, 255, 0.12)";
        themeBorderColor = borderColor || "rgba(255, 255, 255, 0.25)";
        themeBorderWidth = Math.max(1, themeBorderWidth);
        themeExtraClass = "backdrop-blur-md";
    } else if (theme === "shadow-lift") {
        themeBg = frameColor || "#18181b";
        themeBorderColor = borderColor || "#3f3f46";
        themeExtraShadow = "0 20px 35px -5px rgba(0, 0, 0, 0.5), 0 10px 15px -5px rgba(0, 0, 0, 0.3)";
    } else if (theme === "double-border") {
        themeBg = frameColor || "#18181b";
        themeBorderColor = borderColor || "#eab308";
        themeBorderWidth = Math.max(1.5, themeBorderWidth);
    } else if (theme === "rustic-wood") {
        themeBg = "transparent";
        themeBorderColor = "transparent";
        themeBorderWidth = 0;
        themeExtraShadow = "0 14px 28px -4px rgba(0, 0, 0, 0.28), 0 6px 12px -2px rgba(0, 0, 0, 0.16)";
    }

    const baseShadow = getImageShadow(element);
    const combinedShadow =
        baseShadow !== "none" && themeExtraShadow
            ? `${baseShadow}, ${themeExtraShadow}`
            : themeExtraShadow || baseShadow;

    // ── 3. Container Style ───────────────────────────────────────────────────
    const containerStyle: React.CSSProperties = {
        width: w,
        height: h,
        borderRadius: shapeClipPath ? undefined : shapeRadius,
        clipPath: shapeClipPath,
        background: themeBg,
        border:
            borderStyle === "none" || themeBorderWidth === 0
                ? "none"
                : `${themeBorderWidth}px ${borderStyle} ${themeBorderColor}`,
        boxShadow: combinedShadow === "none" ? undefined : combinedShadow,
        outline: isDoubleBorder ? `2px solid ${themeBorderColor}88` : undefined,
        outlineOffset: isDoubleBorder ? "3px" : undefined,
        display: "flex",
        flexDirection: isPolaroid ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        overflow: isRusticWood ? "visible" : "hidden",
        position: "relative",
        boxSizing: "border-box",
        transition: "all 0.15s ease",
        cursor: element.enableLink && isInteractive ? "pointer" : "default",
    };

    // ── 4. Render Image with Crop / Panning ──────────────────────────────────
    const crop = imageCrop || { x: 0, y: 0, scale: 1 };
    const panX = typeof crop.x === "number" ? crop.x : 0;
    const panY = typeof crop.y === "number" ? crop.y : 0;
    const scale = typeof crop.scale === "number" ? crop.scale : 1;

    // ── Calculate Rustic Wood dimensions & styles ─────────────────────────
    const numWidth = typeof width === "number" ? width : 140;
    const numHeight = typeof height === "number" ? height : 140;
    const minDim = Math.min(numWidth, numHeight);
    const beamSize = Math.max(14, Math.min(30, Math.round(minDim * 0.13)));
    const overhang = Math.round(beamSize * 0.7);
    const woodColor = frameColor && frameColor !== "#18181b" ? frameColor : "#c49258";

    const woodHStyle: React.CSSProperties = {
        background: `
            repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 4px, rgba(0,0,0,0.06) 4px, rgba(0,0,0,0.06) 6px, transparent 6px, transparent 11px),
            repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 7px),
            linear-gradient(180deg, #dfb482 0%, #ce9e65 25%, ${woodColor} 60%, #ab773d 100%)
        `,
        border: "1px solid rgba(138, 86, 36, 0.5)",
    };

    const woodVStyle: React.CSSProperties = {
        background: `
            repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 4px, rgba(0,0,0,0.06) 4px, rgba(0,0,0,0.06) 6px, transparent 6px, transparent 11px),
            repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 7px),
            linear-gradient(90deg, #dfb482 0%, #ce9e65 25%, ${woodColor} 60%, #ab773d 100%)
        `,
        border: "1px solid rgba(138, 86, 36, 0.5)",
    };

    return (
        <div
            style={containerStyle}
            className={`${themeExtraClass} ${
                element.enableLink && isInteractive
                    ? "hover:opacity-95 active:scale-[0.98]"
                    : ""
            }`}
            onClick={onImageClick}
        >
            {/* Film strip decorative border sprockets */}
            {isFilmStrip && (
                <>
                    <div className="pointer-events-none absolute left-1 top-0 bottom-0 z-20 flex flex-col justify-between py-1 opacity-70">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-2 w-1.5 rounded-sm bg-white/40 mb-1" />
                        ))}
                    </div>
                    <div className="pointer-events-none absolute right-1 top-0 bottom-0 z-20 flex flex-col justify-between py-1 opacity-70">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-2 w-1.5 rounded-sm bg-white/40 mb-1" />
                        ))}
                    </div>
                </>
            )}

            {/* Rustic Wood crossed wooden beams matching the photo */}
            {isRusticWood && (
                <>
                    {/* Left vertical post */}
                    <div
                        className="pointer-events-none absolute rounded-[2px]"
                        style={{
                            left: 0,
                            top: -overhang,
                            bottom: -overhang,
                            width: beamSize,
                            zIndex: 10,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.22), inset 1px 0 2px rgba(255,255,255,0.4), inset -1px 0 2px rgba(0,0,0,0.25)",
                            ...woodVStyle,
                        }}
                    />
                    {/* Right vertical post */}
                    <div
                        className="pointer-events-none absolute rounded-[2px]"
                        style={{
                            right: 0,
                            top: -overhang,
                            bottom: -overhang,
                            width: beamSize,
                            zIndex: 10,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.22), inset 1px 0 2px rgba(255,255,255,0.4), inset -1px 0 2px rgba(0,0,0,0.25)",
                            ...woodVStyle,
                        }}
                    />
                    {/* Top horizontal beam (overlaps vertical posts with shadow & subtle arch) */}
                    <div
                        className="pointer-events-none absolute rounded-t-[3px] rounded-b-[1px]"
                        style={{
                            top: 0,
                            left: -overhang,
                            right: -overhang,
                            height: beamSize,
                            zIndex: 20,
                            boxShadow: "0 3px 8px rgba(0,0,0,0.32), inset 0 1px 2px rgba(255,255,255,0.45), inset 0 -1px 2px rgba(0,0,0,0.25)",
                            ...woodHStyle,
                        }}
                    />
                    {/* Bottom horizontal beam (overlaps vertical posts with shadow) */}
                    <div
                        className="pointer-events-none absolute rounded-t-[1px] rounded-b-[3px]"
                        style={{
                            bottom: 0,
                            left: -overhang,
                            right: -overhang,
                            height: beamSize,
                            zIndex: 20,
                            boxShadow: "0 -2px 6px rgba(0,0,0,0.2), 0 3px 8px rgba(0,0,0,0.32), inset 0 1px 2px rgba(255,255,255,0.45), inset 0 -1px 2px rgba(0,0,0,0.25)",
                            ...woodHStyle,
                        }}
                    />
                </>
            )}

            {/* Inner Image Container */}
            <div
                className={`relative h-full w-full overflow-hidden ${
                    isPolaroid ? "mb-6 m-2 rounded-sm" : ""
                } ${isFilmStrip ? "px-4" : ""}`}
                style={{
                    margin: isRusticWood ? `${beamSize}px` : undefined,
                    borderRadius: isPolaroid ? "2px" : isRusticWood ? "1px" : shapeClipPath ? undefined : shapeRadius,
                    boxShadow: isRusticWood ? "inset 0 2px 6px rgba(0,0,0,0.5)" : undefined,
                }}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Canvas Element"
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none transition-transform duration-75 ease-out"
                        style={{
                            transform: `translate(${panX}%, ${panY}%) scale(${scale})`,
                            transformOrigin: "center center",
                        }}
                        draggable={false}
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-3 text-center text-gray-500">
                        <span className="text-2xl">🖼</span>
                        <span className="text-[11px] text-gray-400 mt-1">No Image</span>
                    </div>
                )}
            </div>

            {/* Polaroid bottom caption strip */}
            {isPolaroid && (
                <div className="absolute bottom-1 w-full text-center pointer-events-none">
                    <div className="mx-auto h-1 w-10 rounded-full bg-zinc-300/60" />
                </div>
            )}
        </div>
    );
}

export default ImageRenderer;
