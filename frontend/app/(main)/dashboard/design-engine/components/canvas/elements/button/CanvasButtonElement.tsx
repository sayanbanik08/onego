"use client";

import React, { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type {
    CanvasElement,
    EraserSettings,
} from "../../../../types/elements";
import type { ButtonElement } from "../../../../types/button";
import ButtonThemeRenderer from "./ButtonThemeRenderers";
import { handleButtonRedirect } from "./buttonHelpers";
import {
    pointsToSvgPath,
    canvasPointsToElementLocal,
    getElementDimensions,
} from "../../../../utils/canvasUtils";

type CanvasButtonElementProps = {
    element: ButtonElement;
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
        updates: Partial<ButtonElement>
    ) => void;
};

export function CanvasButtonElement({
    element: button,
    isSelected,
    isEraserMode,
    isErasing,
    currentEraserPoints,
    eraserSettings,
    handlePointerDown,
    deleteElement,
    updateElement,
}: CanvasButtonElementProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingText, setEditingText] = useState(button.text || "Button");

    const dimensions = getElementDimensions(button);
    const btnW = dimensions.width;
    const btnH = dimensions.height;
    const scale = (button.size ?? 100) / 100;

    // ── Live Eraser Stroke in local coords ─────────────────────────────
    const liveEraserPath =
        isEraserMode && isErasing && currentEraserPoints
            ? pointsToSvgPath(
                  canvasPointsToElementLocal(
                      currentEraserPoints,
                      {
                          x: button.x,
                          y: button.y,
                          width: btnW,
                          height: btnH,
                          rotation: button.rotation,
                          size: button.size,
                      },
                      "top-left"
                  )
              )
            : null;

    const hasEraserMask =
        (button.eraserPaths && button.eraserPaths.length > 0) ||
        Boolean(liveEraserPath);

    const handleDoubleClick = (e: React.MouseEvent) => {
        if (isEraserMode) return;
        e.stopPropagation();
        setIsEditing(true);
        setEditingText(button.text);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (editingText.trim() !== button.text) {
            updateElement(button.id, { text: editingText.trim() || "Button" });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === "Escape") {
            handleBlur();
        }
    };

    const handleButtonClick = (e: React.MouseEvent) => {
        if (isEraserMode || isEditing) return;
        if (button.link) {
            e.stopPropagation();
            handleButtonRedirect(button.link);
        }
    };

    return (
        <div
            key={button.id}
            data-element-id={button.id}
            onPointerDown={(event) => handlePointerDown(event, button)}
            onDoubleClick={handleDoubleClick}
            className={`absolute select-none ${
                isEraserMode
                    ? "pointer-events-none cursor-none"
                    : isSelected
                    ? "cursor-move outline outline-2 outline-blue-500"
                    : "cursor-move"
            }`}
            style={{
                left: button.x,
                top: button.y,
                transform: `rotate(${button.rotation}deg) scale(${scale})`,
                transformOrigin: "top left",
                pointerEvents: isEraserMode ? "none" : "auto",
                opacity: button.opacity !== undefined ? button.opacity : 1,
                backgroundColor: "transparent",
                mask: hasEraserMask ? `url(#eraser-mask-${button.id})` : undefined,
                WebkitMask: hasEraserMask
                    ? `url(#eraser-mask-${button.id})`
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
                        id={`eraser-mask-${button.id}`}
                        maskUnits="userSpaceOnUse"
                    >
                        <rect
                            x="-5000"
                            y="-5000"
                            width="10000"
                            height="10000"
                            fill="white"
                        />
                        {button.eraserPaths?.map((ep, idx) => (
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
                            deleteElement(button.id);
                        }}
                        className="absolute -top-3 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition"
                        title="Delete element"
                    >
                        <X size={13} />
                    </button>
                    {button.link && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                handleButtonRedirect(button.link);
                            }}
                            className="absolute -top-3 -left-3 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition cursor-pointer"
                            title={`Open Link: ${button.link}`}
                        >
                            <ExternalLink size={12} />
                        </div>
                    )}
                </>
            )}

            {/* Rendered Theme Button Component */}
            <ButtonThemeRenderer
                element={button}
                isEditing={isEditing}
                editingText={editingText}
                setEditingText={setEditingText}
                handleBlur={handleBlur}
                handleKeyDown={handleKeyDown}
                onButtonClick={handleButtonClick}
            />
        </div>
    );
}
export default CanvasButtonElement;
