import React from "react";
import { X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type {
    CanvasElement,
    EraserSettings,
} from "../../../types/elements";
import type { CardElement } from "../../../types/card";
import CardRenderer from "../../CardRenderer";
import {
    pointsToSvgPath,
    canvasPointsToElementLocal,
} from "../../../utils/canvasUtils";

type CanvasCardElementProps = {
    element: CardElement;
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
        updates: Partial<CardElement>
    ) => void;
};

export function CanvasCardElement({
    element: card,
    isSelected,
    isEraserMode,
    isErasing,
    currentEraserPoints,
    eraserSettings,
    handlePointerDown,
    deleteElement,
    updateElement,
}: CanvasCardElementProps) {
    const cardW = card.cardWidth ?? 320;
    const cardH = card.cardMinHeight ?? 220;
    const scale = (card.size ?? 100) / 100;

    const liveCardEraserPath =
        isEraserMode && isErasing && currentEraserPoints
            ? pointsToSvgPath(
                  canvasPointsToElementLocal(
                      currentEraserPoints,
                      {
                          x: card.x,
                          y: card.y,
                          width: cardW,
                          height: cardH,
                          rotation: card.rotation,
                          size: card.size,
                      },
                      "top-left"
                  )
              )
            : null;

    const hasCardMask =
        (card.eraserPaths && card.eraserPaths.length > 0) ||
        Boolean(liveCardEraserPath);

    return (
        <div
            key={card.id}
            data-element-id={card.id}
            onPointerDown={(event) => handlePointerDown(event, card)}
            className={`absolute select-none ${
                isEraserMode
                    ? "pointer-events-none cursor-none"
                    : isSelected
                    ? "cursor-move outline outline-2 outline-blue-500"
                    : "cursor-move"
            }`}
            style={{
                left: card.x,
                top: card.y,
                width: cardW,
                transform: `rotate(${card.rotation}deg) scale(${scale})`,
                transformOrigin: "top left",
                pointerEvents: isEraserMode ? "none" : "auto",
                opacity: card.opacity !== undefined ? card.opacity : 1,
                backgroundColor: "transparent",
                mask: hasCardMask ? `url(#eraser-mask-${card.id})` : undefined,
                WebkitMask: hasCardMask
                    ? `url(#eraser-mask-${card.id})`
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
                        id={`eraser-mask-${card.id}`}
                        maskUnits="userSpaceOnUse"
                    >
                        <rect
                            x="-5000"
                            y="-5000"
                            width="10000"
                            height="10000"
                            fill="white"
                        />
                        {card.eraserPaths?.map((ep, idx) => (
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
                        {liveCardEraserPath && (
                            <path
                                d={liveCardEraserPath}
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

            {/* Delete Button */}
            {isSelected && !isEraserMode && (
                <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                        event.stopPropagation();
                        deleteElement(card.id);
                    }}
                    className="absolute -right-7 -top-7 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700 z-50"
                    title="Delete card"
                >
                    <X size={14} />
                </button>
            )}

            {/* Card Component Body */}
            <CardRenderer
                element={card}
                isSelected={isSelected}
                isEraserMode={isEraserMode}
                onUpdate={(updates) =>
                    updateElement(card.id, updates)
                }
            />
        </div>
    );
}
