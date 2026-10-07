import React from "react";
import { X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type {
    CanvasElement,
    EraserSettings,
} from "../../../types/elements";
import type { TimelineElement } from "../../../types/timeline";
import TimelineRenderer from "../../TimelineRenderer";
import {
    pointsToSvgPath,
    canvasPointsToElementLocal,
} from "../../../utils/canvasUtils";

type CanvasTimelineElementProps = {
    element: TimelineElement;
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
        updates: Partial<TimelineElement>
    ) => void;
};

export function CanvasTimelineElement({
    element: tl,
    isSelected,
    isEraserMode,
    isErasing,
    currentEraserPoints,
    eraserSettings,
    handlePointerDown,
    deleteElement,
    updateElement,
}: CanvasTimelineElementProps) {
    const tlCardW = tl.cardWidth ?? 480;
    const tlCardMH = tl.cardMinHeight ?? 60;
    const timelineW =
        tl.theme === "horizontal-stepper"
            ? Math.max(
                  tlCardW + 60,
                  tl.items.length *
                      (Math.min(tlCardW, 260) + (tl.spacing + 16)) +
                      40
              )
            : tlCardW + (tl.nodeSize ?? 32) + 32;
    const timelineH =
        tl.theme === "horizontal-stepper"
            ? tlCardMH + (tl.nodeSize ?? 32) + 80
            : Math.max(
                  220,
                  tl.items.length *
                      ((tl.spacing ?? 24) +
                          tlCardMH +
                          (tl.nodeSize ?? 32) * 0.5) +
                      40
              );
    const scale = (tl.size ?? 100) / 100;

    const liveTimelineEraserPath =
        isEraserMode && isErasing && currentEraserPoints
            ? pointsToSvgPath(
                  canvasPointsToElementLocal(
                      currentEraserPoints,
                      {
                          x: tl.x,
                          y: tl.y,
                          width: timelineW,
                          height: timelineH,
                          rotation: tl.rotation,
                          size: tl.size,
                      },
                      "top-left"
                  )
              )
            : null;

    const hasTimelineMask =
        (tl.eraserPaths && tl.eraserPaths.length > 0) ||
        Boolean(liveTimelineEraserPath);

    return (
        <div
            key={tl.id}
            data-element-id={tl.id}
            onPointerDown={(event) => handlePointerDown(event, tl)}
            className={`absolute select-none ${
                isEraserMode
                    ? "pointer-events-none cursor-none"
                    : isSelected
                    ? "cursor-move outline outline-2 outline-blue-500"
                    : "cursor-move"
            }`}
            style={{
                left: tl.x,
                top: tl.y,
                width: timelineW,
                transform: `rotate(${tl.rotation}deg) scale(${scale})`,
                transformOrigin: "top left",
                pointerEvents: isEraserMode ? "none" : "auto",
                opacity: tl.opacity !== undefined ? tl.opacity : 1,
                backgroundColor: "transparent",
                mask: hasTimelineMask
                    ? `url(#eraser-mask-${tl.id})`
                    : undefined,
                WebkitMask: hasTimelineMask
                    ? `url(#eraser-mask-${tl.id})`
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
                        id={`eraser-mask-${tl.id}`}
                        maskUnits="userSpaceOnUse"
                    >
                        <rect
                            x="-5000"
                            y="-5000"
                            width="10000"
                            height="10000"
                            fill="white"
                        />
                        {tl.eraserPaths?.map((ep, idx) => (
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
                        {liveTimelineEraserPath && (
                            <path
                                d={liveTimelineEraserPath}
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
                        deleteElement(tl.id);
                    }}
                    className="absolute -right-7 -top-7 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                    title="Delete timeline"
                >
                    <X size={14} />
                </button>
            )}

            {/* Timeline Component Body */}
            <TimelineRenderer
                element={tl}
                isSelected={isSelected}
                isEraserMode={isEraserMode}
                onUpdateItem={(itemId, updates) => {
                    const nextItems = tl.items.map((it) =>
                        it.id === itemId ? { ...it, ...updates } : it
                    );
                    updateElement(tl.id, {
                        items: nextItems,
                    });
                }}
            />
        </div>
    );
}
