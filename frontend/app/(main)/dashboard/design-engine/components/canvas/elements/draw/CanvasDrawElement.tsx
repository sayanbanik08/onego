import React from "react";
import { X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type {
    CanvasElement,
    DrawElement,
    EraserSettings,
} from "../../../../types/elements";
import type { ButtonShadowPreset } from "../../../../types/button";
import {
    pointsToSvgPath,
    canvasPointsToDrawLocal,
} from "../../../../utils/canvasUtils";

type CanvasDrawElementProps = {
    element: DrawElement;
    isSelected: boolean;
    isEraserMode: boolean;
    isFillMode: boolean;
    isErasing: boolean;
    currentEraserPoints: { x: number; y: number }[] | null;
    eraserSettings: EraserSettings;
    handlePointerDown: (
        event: ReactPointerEvent,
        element: CanvasElement
    ) => void;
    onFill: (event: ReactPointerEvent, element: DrawElement) => void;
    deleteElement: (id: string) => void;
};

type DrawShadowLayer = {
    color: string;
    opacity: number;
    blur: number;
    offsetX: number;
    offsetY: number;
    spread: number;
};

function getDrawShadowLayers(element: DrawElement): DrawShadowLayer[] {
    const preset: ButtonShadowPreset = element.shadow ?? "none";
    const black = "#000000";

    if (preset === "none") return [];
    if (preset === "sm") {
        return [{ color: black, opacity: 0.25, blur: 6, offsetX: 0, offsetY: 2, spread: 0 }];
    }
    if (preset === "md") {
        return [{ color: black, opacity: 0.35, blur: 16, offsetX: 0, offsetY: 6, spread: 0 }];
    }
    if (preset === "lg") {
        return [{ color: black, opacity: 0.45, blur: 28, offsetX: 0, offsetY: 12, spread: 0 }];
    }
    if (preset === "xl") {
        return [{ color: black, opacity: 0.55, blur: 48, offsetX: 0, offsetY: 20, spread: 0 }];
    }
    if (preset === "neon") {
        return [
            { color: element.color, opacity: 0.67, blur: 16, offsetX: 0, offsetY: 0, spread: 0 },
            { color: element.color, opacity: 0.33, blur: 32, offsetX: 0, offsetY: 0, spread: 0 },
        ];
    }
    if (preset === "3d-offset") {
        return [{ color: black, opacity: 0.85, blur: 0, offsetX: 4, offsetY: 4, spread: 0 }];
    }
    if (preset === "layered-steps") {
        return Array.from({ length: 7 }, (_, index) => ({
            color: "#ffffff",
            opacity: 0.9 - index * 0.12,
            blur: 0,
            offsetX: (index + 1) * 2,
            offsetY: (index + 1) * 2,
            spread: 0,
        }));
    }

    return [
        {
            color: element.shadowColor ?? black,
            opacity: 0.35,
            blur: element.shadowBlur ?? 12,
            offsetX: element.shadowOffsetX ?? 0,
            offsetY: element.shadowOffsetY ?? 4,
            spread: element.shadowSpread ?? 0,
        },
    ];
}

export function CanvasDrawElement({
    element,
    isSelected,
    isEraserMode,
    isFillMode,
    isErasing,
    currentEraserPoints,
    eraserSettings,
    handlePointerDown,
    onFill,
    deleteElement,
}: CanvasDrawElementProps) {
    const liveDrawEraserPath =
        isEraserMode && isErasing && currentEraserPoints
            ? pointsToSvgPath(
                  canvasPointsToDrawLocal(currentEraserPoints, element)
              )
            : null;
    const shadowLayers = getDrawShadowLayers(element);
    const shadowPadding = shadowLayers.reduce(
        (padding, layer) =>
            Math.max(
                padding,
                Math.abs(layer.offsetX) + layer.blur * 2 + Math.abs(layer.spread) + 8,
                Math.abs(layer.offsetY) + layer.blur * 2 + Math.abs(layer.spread) + 8
            ),
        0
    );
    const pathWidth = element.pathWidth ?? element.width;
    const pathHeight = element.pathHeight ?? element.height;

    return (
        <div
            key={element.id}
            data-element-id={element.id}
            onPointerDown={(event) => {
                if (isFillMode) {
                    event.stopPropagation();
                    if (event.button === 0) onFill(event, element);
                    return;
                }
                handlePointerDown(event, element);
            }}
            className={`absolute select-none ${
                isEraserMode
                    ? "pointer-events-none cursor-none"
                    : isFillMode
                    ? "cursor-crosshair"
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
                viewBox={`0 0 ${pathWidth} ${pathHeight}`}
                preserveAspectRatio="none"
            >
                <defs>
                    {shadowLayers.length > 0 && (
                        <filter
                            id={`draw-shadow-${element.id}`}
                            filterUnits="userSpaceOnUse"
                            x={-shadowPadding}
                            y={-shadowPadding}
                            width={pathWidth + shadowPadding * 2}
                            height={pathHeight + shadowPadding * 2}
                            colorInterpolationFilters="sRGB"
                        >
                            {shadowLayers.map((layer, index) => (
                                <React.Fragment key={index}>
                                    <feMorphology
                                        in="SourceAlpha"
                                        operator={layer.spread < 0 ? "erode" : "dilate"}
                                        radius={Math.abs(layer.spread)}
                                        result={`shadow-shape-${index}`}
                                    />
                                    <feGaussianBlur
                                        in={`shadow-shape-${index}`}
                                        stdDeviation={layer.blur / 2}
                                        result={`shadow-blur-${index}`}
                                    />
                                    <feOffset
                                        in={`shadow-blur-${index}`}
                                        dx={layer.offsetX}
                                        dy={layer.offsetY}
                                        result={`shadow-offset-${index}`}
                                    />
                                    <feFlood
                                        floodColor={layer.color}
                                        floodOpacity={layer.opacity}
                                        result={`shadow-color-${index}`}
                                    />
                                    <feComposite
                                        in={`shadow-color-${index}`}
                                        in2={`shadow-offset-${index}`}
                                        operator="in"
                                        result={`shadow-layer-${index}`}
                                    />
                                </React.Fragment>
                            ))}
                            <feMerge>
                                {shadowLayers.map((_, index) => (
                                    <feMergeNode
                                        key={index}
                                        in={`shadow-layer-${index}`}
                                    />
                                ))}
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    )}
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
                                    ((element.size ?? 100) / 100 || 1) /
                                    Math.sqrt(
                                        (element.width / (element.pathWidth ?? element.width)) *
                                            (element.height / (element.pathHeight ?? element.height))
                                    )
                                }
                                strokeOpacity={eraserSettings.opacity}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        )}
                    </mask>
                </defs>
                <g
                    mask={`url(#eraser-mask-${element.id})`}
                    filter={
                        shadowLayers.length > 0
                            ? `url(#draw-shadow-${element.id})`
                            : undefined
                    }
                >
                    {element.fillLayers?.map((fillLayer, index) => (
                        <image
                            key={index}
                            href={fillLayer}
                            x="0"
                            y="0"
                            width={pathWidth}
                            height={pathHeight}
                            preserveAspectRatio="none"
                        />
                    ))}
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
