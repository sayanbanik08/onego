"use client";

import React from "react";
import { X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type {
    CanvasElement,
    EraserSettings,
} from "../../../../types/elements";
import type { GridElement } from "../../../../types/grid";
import GridRenderer from "./GridRenderer";
import {
    pointsToSvgPath,
    canvasPointsToElementLocal,
    getElementDimensions,
} from "../../../../utils/canvasUtils";

type CanvasGridElementProps = {
    element: GridElement;
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
        updates: Partial<GridElement>
    ) => void;
};

export function CanvasGridElement({
    element: grid,
    isSelected,
    isEraserMode,
    isErasing,
    currentEraserPoints,
    eraserSettings,
    handlePointerDown,
    deleteElement,
}: CanvasGridElementProps) {
    const dimensions = getElementDimensions(grid);
    const gridW = dimensions.width;
    const gridH = dimensions.height;
    const scale = (grid.size ?? 100) / 100;

    // ── Live Eraser Stroke in local coords ─────────────────────────────
    const liveEraserPath =
        isEraserMode && isErasing && currentEraserPoints
            ? pointsToSvgPath(
                  canvasPointsToElementLocal(
                      currentEraserPoints,
                      {
                          x: grid.x,
                          y: grid.y,
                          width: gridW,
                          height: gridH,
                          rotation: grid.rotation,
                          size: grid.size,
                      },
                      "top-left"
                  )
              )
            : null;

    const hasEraserMask =
        (grid.eraserPaths && grid.eraserPaths.length > 0) ||
        Boolean(liveEraserPath);

    return (
        <div
            key={grid.id}
            data-element-id={grid.id}
            onPointerDown={(event) => handlePointerDown(event, grid)}
            className={`absolute select-none ${
                isEraserMode
                    ? "pointer-events-none cursor-none"
                    : isSelected
                    ? "cursor-move outline outline-2 outline-blue-500"
                    : "cursor-move"
            }`}
            style={{
                left: grid.x,
                top: grid.y,
                transform: `rotate(${grid.rotation}deg) scale(${scale})`,
                transformOrigin: "top left",
                pointerEvents: isEraserMode ? "none" : "auto",
                opacity: grid.opacity !== undefined ? grid.opacity : 1,
                backgroundColor: "transparent",
                mask: hasEraserMask ? `url(#eraser-mask-${grid.id})` : undefined,
                WebkitMask: hasEraserMask
                    ? `url(#eraser-mask-${grid.id})`
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
                        id={`eraser-mask-${grid.id}`}
                        maskUnits="userSpaceOnUse"
                    >
                        <rect
                            x="-5000"
                            y="-5000"
                            width="10000"
                            height="10000"
                            fill="white"
                        />
                        {grid.eraserPaths?.map((ep, idx) => (
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
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteElement(grid.id);
                    }}
                    className="absolute -top-3 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition"
                    title="Delete element"
                >
                    <X size={13} />
                </button>
            )}

            {/* Rendered Grid Skeleton */}
            <GridRenderer element={grid} isInteractive={true} />
        </div>
    );
}

export default CanvasGridElement;
