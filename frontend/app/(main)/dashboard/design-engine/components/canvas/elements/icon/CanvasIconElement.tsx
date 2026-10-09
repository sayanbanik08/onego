"use client";

import React from "react";
import { X, ExternalLink } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type {
    CanvasElement,
    EraserSettings,
} from "../../../../types/elements";
import type { IconElement } from "../../../../types/icon";
import IconRenderer from "./IconRenderer";
import { handleIconRedirect } from "./iconLibraries";
import {
    pointsToSvgPath,
    canvasPointsToElementLocal,
    getElementDimensions,
} from "../../../../utils/canvasUtils";

type CanvasIconElementProps = {
    element: IconElement;
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
        updates: Partial<IconElement>
    ) => void;
};

export function CanvasIconElement({
    element: icon,
    isSelected,
    isEraserMode,
    isErasing,
    currentEraserPoints,
    eraserSettings,
    handlePointerDown,
    deleteElement,
}: CanvasIconElementProps) {
    const dimensions = getElementDimensions(icon);
    const iconW = dimensions.width;
    const iconH = dimensions.height;
    const scale = (icon.size ?? 100) / 100;

    // ── Live Eraser Stroke in local coords ─────────────────────────────
    const liveEraserPath =
        isEraserMode && isErasing && currentEraserPoints
            ? pointsToSvgPath(
                  canvasPointsToElementLocal(
                      currentEraserPoints,
                      {
                          x: icon.x,
                          y: icon.y,
                          width: iconW,
                          height: iconH,
                          rotation: icon.rotation,
                          size: icon.size,
                      },
                      "top-left"
                  )
              )
            : null;

    const hasEraserMask =
        (icon.eraserPaths && icon.eraserPaths.length > 0) ||
        Boolean(liveEraserPath);

    const handleIconClick = (e: React.MouseEvent) => {
        if (isEraserMode) return;
        if (icon.enableLink && icon.linkUrl) {
            e.stopPropagation();
            handleIconRedirect(icon.linkUrl);
        }
    };

    return (
        <div
            key={icon.id}
            data-element-id={icon.id}
            onPointerDown={(event) => handlePointerDown(event, icon)}
            className={`absolute select-none ${
                isEraserMode
                    ? "pointer-events-none cursor-none"
                    : isSelected
                    ? "cursor-move outline outline-2 outline-blue-500"
                    : "cursor-move"
            }`}
            style={{
                left: icon.x,
                top: icon.y,
                transform: `rotate(${icon.rotation}deg) scale(${scale})`,
                transformOrigin: "top left",
                pointerEvents: isEraserMode ? "none" : "auto",
                opacity: icon.opacity !== undefined ? icon.opacity : 1,
                backgroundColor: "transparent",
                mask: hasEraserMask ? `url(#eraser-mask-${icon.id})` : undefined,
                WebkitMask: hasEraserMask
                    ? `url(#eraser-mask-${icon.id})`
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
                        id={`eraser-mask-${icon.id}`}
                        maskUnits="userSpaceOnUse"
                    >
                        <rect
                            x="-5000"
                            y="-5000"
                            width="10000"
                            height="10000"
                            fill="white"
                        />
                        {icon.eraserPaths?.map((ep, idx) => (
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
                            deleteElement(icon.id);
                        }}
                        className="absolute -top-3 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition"
                        title="Delete element"
                    >
                        <X size={13} />
                    </button>
                    {icon.enableLink && icon.linkUrl && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                handleIconRedirect(icon.linkUrl);
                            }}
                            className="absolute -top-3 -left-3 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition cursor-pointer"
                            title={`Open Link: ${icon.linkUrl}`}
                        >
                            <ExternalLink size={12} />
                        </div>
                    )}
                </>
            )}

            {/* Rendered Icon */}
            <IconRenderer
                element={icon}
                isInteractive={true}
                onIconClick={handleIconClick}
            />
        </div>
    );
}

export default CanvasIconElement;
