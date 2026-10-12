"use client";

import React from "react";
import { X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type {
    CanvasElement,
    EraserSettings,
} from "../../../../types/elements";
import type { ProgressElement } from "../../../../types/progress";
import ProgressRenderer from "./ProgressRenderer";
import {
    pointsToSvgPath,
    canvasPointsToElementLocal,
    getElementDimensions,
} from "../../../../utils/canvasUtils";

type CanvasProgressElementProps = {
    element: ProgressElement;
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
        updates: Partial<ProgressElement>
    ) => void;
};

export function CanvasProgressElement({
    element: progress,
    isSelected,
    isEraserMode,
    isErasing,
    currentEraserPoints,
    eraserSettings,
    handlePointerDown,
    deleteElement,
}: CanvasProgressElementProps) {
    const dimensions = getElementDimensions(progress);
    const progressW = dimensions.width;
    const progressH = dimensions.height;
    const scale = (progress.size ?? 100) / 100;

    // ── Live Eraser Stroke in local coords ─────────────────────────────
    const liveEraserPath =
        isEraserMode && isErasing && currentEraserPoints
            ? pointsToSvgPath(
                  canvasPointsToElementLocal(
                      currentEraserPoints,
                      {
                          x: progress.x,
                          y: progress.y,
                          width: progressW,
                          height: progressH,
                          rotation: progress.rotation,
                          size: progress.size,
                      },
                      "top-left"
                  )
              )
            : null;

    const hasEraserMask =
        (progress.eraserPaths && progress.eraserPaths.length > 0) ||
        Boolean(liveEraserPath);

    return (
        <div
            key={progress.id}
            data-element-id={progress.id}
            onPointerDown={(event) => handlePointerDown(event, progress)}
            className={`absolute select-none ${
                isEraserMode
                    ? "pointer-events-none cursor-none"
                    : isSelected
                    ? "cursor-move outline outline-2 outline-blue-500"
                    : "cursor-move"
            }`}
            style={{
                left: progress.x,
                top: progress.y,
                transform: `rotate(${progress.rotation}deg) scale(${scale})`,
                transformOrigin: "top left",
                pointerEvents: isEraserMode ? "none" : "auto",
                opacity: progress.opacity !== undefined ? progress.opacity : 1,
                backgroundColor: "transparent",
                mask: hasEraserMask ? `url(#eraser-mask-${progress.id})` : undefined,
                WebkitMask: hasEraserMask
                    ? `url(#eraser-mask-${progress.id})`
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
                        id={`eraser-mask-${progress.id}`}
                        maskUnits="userSpaceOnUse"
                    >
                        <rect
                            x="-5000"
                            y="-5000"
                            width="10000"
                            height="10000"
                            fill="white"
                        />
                        {progress.eraserPaths?.map((ep, idx) => (
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

            {/* Selected Indicator Delete Control */}
            {isSelected && !isEraserMode && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteElement(progress.id);
                    }}
                    className="absolute -top-3 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition"
                    title="Delete element"
                >
                    <X size={13} />
                </button>
            )}

            {/* Rendered Progress / Chart */}
            <ProgressRenderer element={progress} isInteractive={true} />
        </div>
    );
}

export default CanvasProgressElement;
