import React from "react";
import { X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type {
    CanvasElement,
    DrawElement,
    EraserSettings,
} from "../../../types/elements";
import {
    pointsToSvgPath,
    canvasPointsToElementLocal,
} from "../../../utils/canvasUtils";

type CanvasDrawElementProps = {
    element: DrawElement;
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
};

export function CanvasDrawElement({
    element,
    isSelected,
    isEraserMode,
    isErasing,
    currentEraserPoints,
    eraserSettings,
    handlePointerDown,
    deleteElement,
}: CanvasDrawElementProps) {
    const liveDrawEraserPath =
        isEraserMode && isErasing && currentEraserPoints
            ? pointsToSvgPath(
                  canvasPointsToElementLocal(currentEraserPoints, {
                      x: element.x,
                      y: element.y,
                      width: element.width,
                      height: element.height,
                      rotation: element.rotation,
                      size: element.size,
                  })
              )
            : null;

    return (
        <div
            key={element.id}
            data-element-id={element.id}
            onPointerDown={(event) => handlePointerDown(event, element)}
            className={`absolute select-none ${
                isEraserMode
                    ? "pointer-events-none cursor-none"
                    : isSelected
                    ? "cursor-move outline outline-2 outline-blue-500"
                    : "cursor-move"
            }`}
            style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                transform: `rotate(${element.rotation}deg) scale(${
                    (element.size ?? 100) / 100
                })`,
                transformOrigin: "center center",
                pointerEvents: isEraserMode ? "none" : "auto",
                opacity:
                    element.opacity !== undefined ? element.opacity : 1,
            }}
        >
            {/* Delete Button */}
            {isSelected && !isEraserMode && (
                <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                        event.stopPropagation();
                        deleteElement(element.id);
                    }}
                    className="absolute -right-7 -top-7 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                    title="Delete drawing"
                >
                    <X size={14} />
                </button>
            )}

            {/* SVG Drawing with Eraser Mask */}
            <svg
                className="pointer-events-none h-full w-full overflow-visible"
                viewBox={`0 0 ${element.width} ${element.height}`}
            >
                <defs>
                    <mask
                        id={`eraser-mask-${element.id}`}
                        maskUnits="userSpaceOnUse"
                    >
                        <rect
                            x="-5000"
                            y="-5000"
                            width="10000"
                            height="10000"
                            fill="white"
                        />
                        {element.eraserPaths?.map((ep, idx) => (
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
                        {liveDrawEraserPath && (
                            <path
                                d={liveDrawEraserPath}
                                stroke="black"
                                strokeWidth={
                                    eraserSettings.size /
                                    ((element.size ?? 100) / 100 || 1)
                                }
                                strokeOpacity={eraserSettings.opacity}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        )}
                    </mask>
                </defs>
                <g mask={`url(#eraser-mask-${element.id})`}>
                    <path
                        d={element.pathData}
                        fill="none"
                        stroke={element.color}
                        strokeWidth={element.strokeWidth}
                        strokeOpacity={element.opacity}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
            </svg>
        </div>
    );
}
