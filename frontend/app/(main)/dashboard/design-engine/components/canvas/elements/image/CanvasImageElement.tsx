"use client";

import React from "react";
import { X, ExternalLink } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type {
    CanvasElement,
    EraserSettings,
} from "../../../../types/elements";
import type { ImageElement } from "../../../../types/image";
import ImageRenderer from "./ImageRenderer";
import { handleImageRedirect } from "./imageHelpers";
import {
    pointsToSvgPath,
    canvasPointsToElementLocal,
    getElementDimensions,
} from "../../../../utils/canvasUtils";

type CanvasImageElementProps = {
    element: ImageElement;
    isSelected: boolean;
    isEraserMode: boolean;
    isErasing: boolean;
    currentEraserPoints: { x: number; y: number }[] | null;
    eraserSettings: EraserSettings;
    handlePointerDown: (
        event: ReactPointerEvent,
        element: CanvasElement
    ) => void;
    deleteElement: (id: string) => void;
    updateElement: (
        id: string,
        updates: Partial<ImageElement>
    ) => void;
};

export function CanvasImageElement({
    element: image,
    isSelected,
    isEraserMode,
    isErasing,
    currentEraserPoints,
    eraserSettings,
    handlePointerDown,
    deleteElement,
}: CanvasImageElementProps) {
    const dimensions = getElementDimensions(image);
    const imageW = dimensions.width;
    const imageH = dimensions.height;
    const scale = (image.size ?? 100) / 100;

    // ── Live Eraser Stroke in local coords ─────────────────────────────
    const liveEraserPath =
        isEraserMode && isErasing && currentEraserPoints
            ? pointsToSvgPath(
                  canvasPointsToElementLocal(
                      currentEraserPoints,
                      {
                          x: image.x,
                          y: image.y,
                          width: imageW,
                          height: imageH,
                          rotation: image.rotation,
                          size: image.size,
                      },
                      "top-left"
                  )
              )
            : null;

    const hasEraserMask =
        (image.eraserPaths && image.eraserPaths.length > 0) ||
        Boolean(liveEraserPath);

    const handleImageClick = (e: React.MouseEvent) => {
        if (isEraserMode) return;
        if (image.enableLink && image.linkUrl) {
            e.stopPropagation();
            handleImageRedirect(image.linkUrl);
        }
    };

    return (
        <div
            key={image.id}
            data-element-id={image.id}
            onPointerDown={(event) => handlePointerDown(event, image)}
            className={`absolute select-none ${
                isEraserMode
                    ? "pointer-events-none cursor-none"
                    : isSelected
                    ? "cursor-move outline outline-2 outline-blue-500"
                    : "cursor-move"
            }`}
            style={{
                left: image.x,
                top: image.y,
                transform: `rotate(${image.rotation}deg) scale(${scale})`,
                transformOrigin: "top left",
                pointerEvents: isEraserMode ? "none" : "auto",
                opacity: image.opacity !== undefined ? image.opacity : 1,
                backgroundColor: "transparent",
                mask: hasEraserMask ? `url(#eraser-mask-${image.id})` : undefined,
                WebkitMask: hasEraserMask
                    ? `url(#eraser-mask-${image.id})`
                    : undefined,
            }}
        >
            {/* SVG Eraser Mask Defs */}
            <svg
                className="pointer-events-none absolute inset-0 overflow-hidden"
                style={{ width: "100%", height: "100%" }}
            >
                <defs>
                    <mask
                        id={`eraser-mask-${image.id}`}
                        maskUnits="userSpaceOnUse"
                    >
                        <rect
                            x="-5000"
                            y="-5000"
                            width="10000"
                            height="10000"
                            fill="white"
                        />
                        {image.eraserPaths?.map((ep, idx) => (
                            <path
                                key={idx}
                                d={ep.d}
                                stroke="black"
                                strokeWidth={ep.strokeWidth}
                                strokeOpacity={ep.opacity}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        ))}
                        {liveEraserPath && (
                            <path
                                d={liveEraserPath}
                                stroke="black"
                                strokeWidth={eraserSettings.size / scale}
                                strokeOpacity={eraserSettings.opacity}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        )}
                    </mask>
                </defs>
            </svg>

            {/* Selected Indicator Controls */}
            {isSelected && !isEraserMode && (
                <>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteElement(image.id);
                        }}
                        className="absolute -top-3 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition"
                        title="Delete element"
                    >
                        <X size={13} />
                    </button>
                    {image.enableLink && image.linkUrl && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                handleImageRedirect(image.linkUrl);
                            }}
                            className="absolute -top-3 -left-3 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition cursor-pointer"
                            title={`Open Link: ${image.linkUrl}`}
                        >
                            <ExternalLink size={12} />
                        </div>
                    )}
                </>
            )}

            {/* Rendered Image */}
            <ImageRenderer
                element={image}
                isInteractive={true}
                onImageClick={handleImageClick}
            />
        </div>
    );
}

export default CanvasImageElement;
