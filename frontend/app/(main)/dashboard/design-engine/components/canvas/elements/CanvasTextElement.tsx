import React from "react";
import { X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type {
    CanvasElement,
    EraserSettings,
    TextElement,
} from "../../../types/elements";
import {
    pointsToSvgPath,
    canvasPointsToElementLocal,
} from "../../../utils/canvasUtils";

type CanvasTextElementProps = {
    element: TextElement;
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

export function CanvasTextElement({
    element,
    isSelected,
    isEraserMode,
    isErasing,
    currentEraserPoints,
    eraserSettings,
    handlePointerDown,
    deleteElement,
}: CanvasTextElementProps) {
    const textApproxW = Math.max(
        80,
        element.text.length * element.fontSize * 0.7 + 20
    );
    const textApproxH = Math.max(40, element.fontSize * 1.5 + 10);

    const liveTextEraserPath =
        isEraserMode && isErasing && currentEraserPoints
            ? pointsToSvgPath(
                  canvasPointsToElementLocal(currentEraserPoints, {
                      x: element.x,
                      y: element.y,
                      width: textApproxW,
                      height: textApproxH,
                      rotation: element.rotation,
                      size: 100,
                  })
              )
            : null;

    const hasTextMask =
        (element.eraserPaths && element.eraserPaths.length > 0) ||
        Boolean(liveTextEraserPath);

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
                transform: `rotate(${element.rotation}deg)`,
                transformOrigin: "center center",
                pointerEvents: isEraserMode ? "none" : "auto",
                mask: hasTextMask
                    ? `url(#eraser-mask-${element.id})`
                    : undefined,
                WebkitMask: hasTextMask
                    ? `url(#eraser-mask-${element.id})`
                    : undefined,
                opacity:
                    element.opacity !== undefined ? element.opacity : 1,
                backgroundColor:
                    element.backgroundColor &&
                    element.backgroundColor !== "transparent"
                        ? element.backgroundColor
                        : undefined,
                padding:
                    element.backgroundColor &&
                    element.backgroundColor !== "transparent"
                        ? "4px 8px"
                        : undefined,
                borderRadius:
                    element.backgroundColor &&
                    element.backgroundColor !== "transparent"
                        ? "4px"
                        : undefined,
            }}
        >
            {/* SVG Defs for Text Mask */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
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
                        {liveTextEraserPath && (
                            <path
                                d={liveTextEraserPath}
                                stroke="black"
                                strokeWidth={eraserSettings.size}
                                strokeOpacity={eraserSettings.opacity}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        )}
                    </mask>
                </defs>
            </svg>

            {/* Delete Button */}
            {isSelected && (
                <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                        event.stopPropagation();
                        deleteElement(element.id);
                    }}
                    className="absolute -right-7 -top-7 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                    title="Delete element"
                >
                    <X size={14} />
                </button>
            )}

            {/* Text */}
            <span
                style={{
                    fontSize: element.fontSize,
                    color: element.color,
                    fontWeight: element.fontWeight,
                    fontFamily: element.fontFamily,
                    fontStyle:
                        element.fontStyle === "italic" ||
                        element.fontStyle === "italic-underline"
                            ? "italic"
                            : "normal",
                    textDecoration:
                        element.underline ||
                        element.fontStyle === "underline" ||
                        element.fontStyle === "italic-underline"
                            ? "underline"
                            : "none",
                    whiteSpace: "pre",
                }}
            >
                {element.text}
            </span>
        </div>
    );
}
