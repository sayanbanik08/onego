import { X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useRef, useState, useEffect } from "react";

import DemoDashboardHeader from "./DemoDashboardHeader";
import type { TimelineElement } from "../types/timeline";
import TimelineRenderer from "./TimelineRenderer";
import type { CardElement } from "../types/card";
import CardRenderer from "./CardRenderer";

type TextElement = {
    id: string;
    type: "text";
    serialNumber: number;
    x: number;
    y: number;
    text: string;
    fontSize: number;
    color: string;
    backgroundColor?: string;

    fontWeight: number;
    fontFamily: string;
    fontStyle: "normal" | "italic" | "underline" | "italic-underline";
    underline?: boolean;
    rotation: number;
    opacity?: number;
    eraserPaths?: EraserPath[];
};

type EraserPath = {
    d: string;
    strokeWidth: number;
    opacity: number;
};

type DrawElement = {
    id: string;
    type: "draw";
    serialNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;
    pathData: string;
    strokeWidth: number;
    opacity: number;
    color: string;
    rotation: number;
    size?: number;
    eraserPaths?: EraserPath[];
};

type TablePreset =
    | "minimal"
    | "dark"
    | "ocean"
    | "emerald"
    | "sunset"
    | "classic";

type TableElement = {
    id: string;
    type: "table";
    serialNumber: number;
    x: number;
    y: number;
    rows: number;
    cols: number;
    headers: string[];
    data: string[][];
    hasHeader: boolean;

    preset?: TablePreset;

    // Header Styles
    headerBg: string;
    headerColor: string;
    headerFontWeight: number;
    headerAlign: "left" | "center" | "right";

    // Body Styles
    rowBg: string;
    altRowBg: string;
    cellColor: string;
    cellAlign: "left" | "center" | "right";
    fontSize: number;

    // Borders & Container
    borderColor: string;
    borderWidth: number;
    borderStyle: "solid" | "dashed" | "dotted" | "none";
    cellPadding: number;
    borderRadius: number;
    shadow: "none" | "sm" | "md" | "lg";

    // Transform
    size: number;
    rotation: number;
    opacity?: number;
    eraserPaths?: EraserPath[];
};

type ClockDesign =
    | "digital-minimal"
    | "analog-classic"
    | "digital-neon"
    | "analog-swiss"
    | "flip-card"
    | "smartwatch";

type ClockTimeMode = "live" | "custom" | "static";

type ClockElement = {
    id: string;
    type: "clock";
    serialNumber: number;
    x: number;
    y: number;

    design: ClockDesign;
    timeMode: ClockTimeMode;

    customHour: number;
    customMinute: number;
    customSecond: number;
    startEpochMs: number;

    is24Hour: boolean;
    showSeconds: boolean;

    showDate: boolean;
    dateMode: "live" | "custom";
    customDateStr: string;

    bgColor: string;
    textColor: string;
    accentColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    shadow: "none" | "sm" | "md" | "lg";

    size: number;
    rotation: number;
    opacity?: number;
    eraserPaths?: EraserPath[];
};

type CanvasElement = TextElement | DrawElement | TableElement | ClockElement | TimelineElement | CardElement;


export type BackgroundType = "solid" | "gradient" | "image";

export type DashboardBackgroundSettings = {
    type: BackgroundType;
    color: string;
    gradientType: "linear" | "radial";
    gradientAngle: number;
    gradientColor1: string;
    gradientColor2: string;
    imageUrl: string;
    imageFit: "cover" | "contain" | "tile";
    imageOpacity: number;
    imageBlur: number;
    imageOverlayColor: string;
    imageOverlayOpacity: number;
    showGridDots: boolean;
    gridDotsColor: string;
    gridDotsSize: number;
};

type DesignCanvasProps = {
    elements: CanvasElement[];
    selectedElementId: string | null;
    setSelectedElementId: (id: string | null) => void;
    deleteElement: (id: string) => void;
    updateElementPosition: (
        id: string,
        x: number,
        y: number
    ) => void;
    updateElement: (
        id: string,
        updates: Partial<CanvasElement>
    ) => void;
    isDrawMode: boolean;
    pencilSettings: {
        strokeWidth: number;
        opacity: number;
        color: string;
        rotation?: number;
        size?: number;
    };
    onAddDrawElement: (element: DrawElement) => void;
    isEraserMode: boolean;
    eraserSettings: {
        size: number;
        opacity: number;
    };
    backgroundSettings?: DashboardBackgroundSettings;
    onSelectBackground?: () => void;
};

function pointsToSvgPath(
    points: { x: number; y: number }[]
): string {
    if (!points || points.length === 0) return "";

    if (points.length === 1) {
        return `M ${points[0].x} ${points[0].y} L ${points[0].x + 0.1} ${points[0].y + 0.1}`;
    }

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        d += ` Q ${p1.x} ${p1.y}, ${midX} ${midY}`;
    }

    const last = points[points.length - 1];
    d += ` L ${last.x} ${last.y}`;

    return d;
}

export default function DesignCanvas({
    elements,
    selectedElementId,
    setSelectedElementId,
    deleteElement,
    updateElementPosition,
    updateElement,
    isDrawMode,
    pencilSettings,
    onAddDrawElement,
    isEraserMode,
    eraserSettings,
    backgroundSettings,
    onSelectBackground,
}: DesignCanvasProps) {
    const designAreaRef = useRef<HTMLDivElement | null>(null);
    const [currentPoints, setCurrentPoints] = useState<
        { x: number; y: number }[] | null
    >(null);
    const [editingCell, setEditingCell] = useState<{
        elementId: string;
        row: number;
        col: number;
    } | null>(null);

    // ── Eraser state & rubbing stroke tracking ──
    const [eraserPos, setEraserPos] = useState<{ x: number; y: number } | null>(null);
    const [isErasing, setIsErasing] = useState(false);
    const [currentEraserPoints, setCurrentEraserPoints] = useState<
        { x: number; y: number }[] | null
    >(null);

    // ── Clock tick (1 s interval) ──
    const [clockTick, setClockTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setClockTick((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, []);

    const canvasPointsToElementLocal = (
        pts: { x: number; y: number }[],
        el: {
            x: number;
            y: number;
            width: number;
            height: number;
            rotation: number;
            size?: number;
        },
        origin: "center" | "top-left" = "center"
    ) => {
        const scale = (el.size ?? 100) / 100 || 1;
        const rad = (-el.rotation * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        if (origin === "top-left") {
            return pts.map((p) => {
                const relX = p.x - el.x;
                const relY = p.y - el.y;
                const unrotX = (relX * cos - relY * sin) / scale;
                const unrotY = (relX * sin + relY * cos) / scale;
                return {
                    x: Math.round(unrotX),
                    y: Math.round(unrotY),
                };
            });
        }

        const centerX = el.width / 2;
        const centerY = el.height / 2;

        return pts.map((p) => {
            const relX = p.x - el.x;
            const relY = p.y - el.y;
            const dx = (relX - centerX) / scale;
            const dy = (relY - centerY) / scale;
            const unrotX = dx * cos - dy * sin;
            const unrotY = dx * sin + dy * cos;
            return {
                x: Math.round(unrotX + centerX),
                y: Math.round(unrotY + centerY),
            };
        });
    };

    const doesStrokeIntersectElement = (
        localPoints: { x: number; y: number }[],
        width: number,
        height: number,
        eraserRadiusLocal: number
    ) => {
        const pad = eraserRadiusLocal + 12;
        return localPoints.some(
            (p) =>
                p.x >= -pad &&
                p.x <= width + pad &&
                p.y >= -pad &&
                p.y <= height + pad
        );
    };

    const handleEraserPointerDown = (
        event: ReactPointerEvent<HTMLDivElement>
    ) => {
        if (!isEraserMode || event.button !== 0) return;

        const rect = designAreaRef.current?.getBoundingClientRect();
        if (!rect) return;

        const startX = event.clientX - rect.left;
        const startY = event.clientY - rect.top;

        let points = [{ x: startX, y: startY }];
        setIsErasing(true);
        setCurrentEraserPoints(points);
        setEraserPos({ x: startX, y: startY });

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const curRect = designAreaRef.current?.getBoundingClientRect();
            if (!curRect) return;

            const curX = Math.max(
                0,
                Math.min(curRect.width, moveEvent.clientX - curRect.left)
            );
            const curY = Math.max(
                0,
                Math.min(curRect.height, moveEvent.clientY - curRect.top)
            );

            points = [...points, { x: curX, y: curY }];
            setCurrentEraserPoints(points);
            setEraserPos({ x: curX, y: curY });
        };

        const handlePointerUp = () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);

            setIsErasing(false);
            setCurrentEraserPoints(null);

            if (points.length >= 1) {
                elements.forEach((el) => {
                    let elW = 100;
                    let elH = 100;
                    let scale = 1;

                    if (el.type === "draw") {
                        elW = el.width;
                        elH = el.height;
                        scale = (el.size ?? 100) / 100 || 1;
                    } else if (el.type === "text") {
                        elW = Math.max(
                            80,
                            (el as TextElement).text.length *
                                (el as TextElement).fontSize *
                                0.7 +
                                20
                        );
                        elH = Math.max(
                            40,
                            (el as TextElement).fontSize * 1.5 + 10
                        );
                        scale = 1;
                    } else if (el.type === "table") {
                        const tbl = el as TableElement;
                        elW = Math.max(160, tbl.cols * 120);
                        elH = Math.max(
                            80,
                            (tbl.rows + (tbl.hasHeader ? 1 : 0)) *
                                (tbl.fontSize * 1.5 + tbl.cellPadding * 2 + 4)
                        );
                        scale = (tbl.size ?? 100) / 100 || 1;
                    } else if (el.type === "clock") {
                        elW = 300;
                        elH = 190;
                        scale = ((el as ClockElement).size ?? 100) / 100 || 1;
                    } else if (el.type === "timeline") {
                        const tl = el as TimelineElement;
                        const tlCardW = tl.cardWidth ?? 480;
                        const tlCardMH = tl.cardMinHeight ?? 60;
                        elW = tl.theme === "horizontal-stepper"
                            ? Math.max(tlCardW + 60, tl.items.length * (Math.min(tlCardW, 260) + (tl.spacing + 16)) + 40)
                            : tlCardW + (tl.nodeSize ?? 32) + 32;
                        elH = tl.theme === "horizontal-stepper"
                            ? tlCardMH + (tl.nodeSize ?? 32) + 80
                            : Math.max(220, tl.items.length * ((tl.spacing ?? 24) + tlCardMH + (tl.nodeSize ?? 32) * 0.5) + 40);
                        scale = ((el as TimelineElement).size ?? 100) / 100 || 1;
                    }

                    const eraserRadiusLocal =
                        eraserSettings.size / scale / 2;

                    const localPoints = canvasPointsToElementLocal(
                        points,
                        {
                            x: el.x,
                            y: el.y,
                            width: elW,
                            height: elH,
                            rotation: el.rotation,
                            size: el.type === "draw" || el.type === "table" || el.type === "clock" || el.type === "timeline" ? el.size : 100,
                        },
                        el.type === "timeline" ? "top-left" : "center"
                    );

                    if (
                        doesStrokeIntersectElement(
                            localPoints,
                            elW,
                            elH,
                            eraserRadiusLocal
                        )
                    ) {
                        const localPathData = pointsToSvgPath(localPoints);
                        const newEraserPath: EraserPath = {
                            d: localPathData,
                            strokeWidth: eraserSettings.size / scale,
                            opacity: eraserSettings.opacity,
                        };
                        const existingPaths = el.eraserPaths || [];
                        updateElement(el.id, {
                            eraserPaths: [...existingPaths, newEraserPath],
                        });
                    }
                });
            }
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
    };

    useEffect(() => {
        if (!isEraserMode) {
            setEraserPos(null);
            setIsErasing(false);
            setCurrentEraserPoints(null);
        }
    }, [isEraserMode]);

    // ── Element drag (same pattern as original text implementation) ──
    const handlePointerDown = (
        event: ReactPointerEvent<HTMLDivElement>,
        element: CanvasElement
    ) => {
        if (event.button !== 0) {
            return;
        }

        event.stopPropagation();

        setSelectedElementId(element.id);

        const startX = event.clientX;
        const startY = event.clientY;

        const initialX = element.x;
        const initialY = element.y;

        const handlePointerMove = (
            moveEvent: PointerEvent
        ) => {
            const deltaX =
                moveEvent.clientX - startX;

            const deltaY =
                moveEvent.clientY - startY;

            const newX = Math.max(
                0,
                initialX + deltaX
            );

            const newY = Math.max(
                0,
                initialY + deltaY
            );

            updateElementPosition(
                element.id,
                newX,
                newY
            );
        };

        const handlePointerUp = () => {
            window.removeEventListener(
                "pointermove",
                handlePointerMove
            );

            window.removeEventListener(
                "pointerup",
                handlePointerUp
            );
        };

        window.addEventListener(
            "pointermove",
            handlePointerMove
        );

        window.addEventListener(
            "pointerup",
            handlePointerUp
        );
    };

    // ── Freehand draw on canvas ──
    const handleDrawPointerDown = (
        event: ReactPointerEvent<HTMLDivElement>
    ) => {
        if (!isDrawMode || event.button !== 0) {
            return;
        }

        // Only draw on the editable area, not on elements
        if (event.target !== event.currentTarget) {
            return;
        }

        const rect =
            designAreaRef.current?.getBoundingClientRect();

        if (!rect) return;

        const startX = event.clientX - rect.left;
        const startY = event.clientY - rect.top;

        let points = [{ x: startX, y: startY }];
        setCurrentPoints(points);

        const handlePointerMove = (
            moveEvent: PointerEvent
        ) => {
            const currentRect =
                designAreaRef.current?.getBoundingClientRect();

            if (!currentRect) return;

            const curX =
                moveEvent.clientX - currentRect.left;
            const curY =
                moveEvent.clientY - currentRect.top;

            points = [
                ...points,
                { x: curX, y: curY },
            ];

            setCurrentPoints(points);
        };

        const handlePointerUp = () => {
            window.removeEventListener(
                "pointermove",
                handlePointerMove
            );

            window.removeEventListener(
                "pointerup",
                handlePointerUp
            );

            if (points.length >= 2) {
                let minX = Infinity;
                let minY = Infinity;
                let maxX = -Infinity;
                let maxY = -Infinity;

                points.forEach((p) => {
                    if (p.x < minX) minX = p.x;
                    if (p.y < minY) minY = p.y;
                    if (p.x > maxX) maxX = p.x;
                    if (p.y > maxY) maxY = p.y;
                });

                const pad = Math.max(
                    12,
                    pencilSettings.strokeWidth
                );

                const elementX = Math.max(
                    0,
                    Math.round(minX - pad)
                );

                const elementY = Math.max(
                    0,
                    Math.round(minY - pad)
                );

                const width = Math.max(
                    24,
                    Math.round(maxX - minX + pad * 2)
                );

                const height = Math.max(
                    24,
                    Math.round(maxY - minY + pad * 2)
                );

                const relativePoints = points.map(
                    (p) => ({
                        x: p.x - elementX,
                        y: p.y - elementY,
                    })
                );

                const pathData =
                    pointsToSvgPath(relativePoints);

                const newDrawElement: DrawElement = {
                    id: crypto.randomUUID(),
                    type: "draw",
                    serialNumber: elements.length + 1,
                    x: elementX,
                    y: elementY,
                    width,
                    height,
                    pathData,
                    strokeWidth:
                        pencilSettings.strokeWidth,
                    opacity: pencilSettings.opacity,
                    color: pencilSettings.color,
                    rotation: pencilSettings.rotation ?? 0,
                    size: pencilSettings.size ?? 100,
                };

                onAddDrawElement(newDrawElement);
            }

            setCurrentPoints(null);
        };

        window.addEventListener(
            "pointermove",
            handlePointerMove
        );

        window.addEventListener(
            "pointerup",
            handlePointerUp
        );
    };

    // ── Compute canvas background styles ──
    const bg = backgroundSettings;
    const getCanvasBg = () => {
        if (!bg || bg.type === "solid") {
            return {
                backgroundColor: bg?.color ?? "#ffffff",
                backgroundImage: (bg?.showGridDots ?? true)
                    ? `radial-gradient(${bg?.gridDotsColor ?? "#b8b8b8"} 1px, transparent 1px)`
                    : "none",
                backgroundSize: (bg?.showGridDots ?? true)
                    ? `${bg?.gridDotsSize ?? 20}px ${bg?.gridDotsSize ?? 20}px`
                    : undefined,
            };
        }
        if (bg.type === "gradient") {
            const grad = bg.gradientType === "radial"
                ? `radial-gradient(circle, ${bg.gradientColor1}, ${bg.gradientColor2})`
                : `linear-gradient(${bg.gradientAngle}deg, ${bg.gradientColor1}, ${bg.gradientColor2})`;
            return {
                backgroundImage: bg.showGridDots
                    ? `radial-gradient(${bg.gridDotsColor} 1px, transparent 1px), ${grad}`
                    : grad,
                backgroundSize: bg.showGridDots
                    ? `${bg.gridDotsSize}px ${bg.gridDotsSize}px, 100% 100%`
                    : "100% 100%",
            };
        }
        // image mode: handled via child divs
        return {
            backgroundColor: bg.color,
            backgroundImage: bg.showGridDots
                ? `radial-gradient(${bg.gridDotsColor} 1px, transparent 1px)`
                : "none",
            backgroundSize: bg.showGridDots
                ? `${bg.gridDotsSize}px ${bg.gridDotsSize}px`
                : undefined,
        };
    };

    return (
        <section className="min-h-0 flex-1 overflow-y-auto">

            {/* Portfolio Canvas */}
            <div
                className="relative min-h-[1200px] w-full"
                style={getCanvasBg()}
                onClick={() => {
                    // clicking empty canvas area deselects element; but if backgroundSettings are set,
                    // clicking background triggers background mode via a transparent overlay click
                }}
            >
                {/* Background image layer */}
                {bg?.type === "image" && bg.imageUrl && (
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            backgroundImage: `url(${bg.imageUrl})`,
                            backgroundSize: bg.imageFit === "tile" ? "auto" : bg.imageFit,
                            backgroundRepeat: bg.imageFit === "tile" ? "repeat" : "no-repeat",
                            backgroundPosition: "center",
                            opacity: bg.imageOpacity,
                            filter: bg.imageBlur > 0 ? `blur(${bg.imageBlur}px)` : undefined,
                        }}
                    />
                )}
                {/* Overlay for image background */}
                {bg?.type === "image" && bg.imageUrl && bg.imageOverlayOpacity > 0 && (
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            backgroundColor: bg.imageOverlayColor,
                            opacity: bg.imageOverlayOpacity,
                        }}
                    />
                )}
                {/* Transparent "click background to edit" zone – sits below elements */}
                <div
                    className="absolute inset-0"
                    style={{ zIndex: 0 }}
                    onClick={() => {
                        if (!isDrawMode && !isEraserMode && onSelectBackground) {
                            onSelectBackground();
                        }
                    }}
                />

                {/* Demo Fixed Dashboard Header */}
                <DemoDashboardHeader />

                {/* EDITABLE DESIGN AREA */}
                <div
                    ref={designAreaRef}
                    onPointerDown={(event) => {
                        if (isEraserMode) {
                            handleEraserPointerDown(event);
                            return;
                        }
                        if (isDrawMode) {
                            handleDrawPointerDown(event);
                        }
                    }}
                    onPointerMove={(event) => {
                        if (isEraserMode && !isErasing) {
                            const rect =
                                designAreaRef.current?.getBoundingClientRect();
                            if (rect) {
                                const curX = Math.max(
                                    0,
                                    Math.min(rect.width, event.clientX - rect.left)
                                );
                                const curY = Math.max(
                                    0,
                                    Math.min(rect.height, event.clientY - rect.top)
                                );
                                setEraserPos({ x: curX, y: curY });
                            }
                        }
                    }}
                    onPointerLeave={() => {
                        if (isEraserMode && !isErasing) {
                            setEraserPos(null);
                        }
                    }}
                    className={`relative min-h-[1120px] overflow-hidden ${isEraserMode
                        ? "cursor-none"
                        : isDrawMode
                            ? "cursor-crosshair"
                            : ""
                        }`}
                >

                    {/* Eraser Cursor Preview (MS Paint rectangular eraser) */}
                    {isEraserMode && eraserPos && (
                        <div
                            className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-1/2 border border-black bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.18)]"
                            style={{
                                left: eraserPos.x,
                                top: eraserPos.y,
                                width: eraserSettings.size,
                                height: eraserSettings.size,
                                opacity: Math.max(0.6, eraserSettings.opacity),
                            }}
                        >
                            <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60" />
                        </div>
                    )}

                    {/* Live Drawing Preview */}
                    {currentPoints && (
                        <svg className="pointer-events-none absolute inset-0 z-40 h-full w-full overflow-visible">
                            <path
                                d={pointsToSvgPath(
                                    currentPoints
                                )}
                                fill="none"
                                stroke={
                                    pencilSettings.color
                                }
                                strokeWidth={
                                    pencilSettings.strokeWidth
                                }
                                strokeOpacity={
                                    pencilSettings.opacity
                                }
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}

                    {elements.map((element) => {
                        const isSelected =
                            selectedElementId ===
                            element.id;

                        // ── Text Element ──
                        if (element.type === "text") {
                            const textApproxW = Math.max(
                                80,
                                element.text.length * element.fontSize * 0.7 + 20
                            );
                            const textApproxH = Math.max(
                                40,
                                element.fontSize * 1.5 + 10
                            );

                            const liveTextEraserPath =
                                isEraserMode && isErasing && currentEraserPoints
                                    ? pointsToSvgPath(
                                        canvasPointsToElementLocal(
                                            currentEraserPoints,
                                            {
                                                x: element.x,
                                                y: element.y,
                                                width: textApproxW,
                                                height: textApproxH,
                                                rotation: element.rotation,
                                                size: 100,
                                            }
                                        )
                                    )
                                    : null;

                            const hasTextMask =
                                (element.eraserPaths &&
                                    element.eraserPaths.length > 0) ||
                                Boolean(liveTextEraserPath);

                            return (
                                <div
                                    key={element.id}
                                    data-element-id={element.id}
                                    onPointerDown={(event) =>
                                        handlePointerDown(event, element)
                                    }
                                    className={`absolute select-none ${isEraserMode
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
                                        pointerEvents: isEraserMode
                                            ? "none"
                                            : "auto",
                                        mask: hasTextMask
                                            ? `url(#eraser-mask-${element.id})`
                                            : undefined,
                                        WebkitMask: hasTextMask
                                            ? `url(#eraser-mask-${element.id})`
                                            : undefined,
                                        opacity:
                                            element.opacity !== undefined
                                                ? element.opacity
                                                : 1,
                                        backgroundColor:
                                            element.backgroundColor &&
                                                element.backgroundColor !==
                                                "transparent"
                                                ? element.backgroundColor
                                                : undefined,
                                        padding:
                                            element.backgroundColor &&
                                                element.backgroundColor !==
                                                "transparent"
                                                ? "4px 8px"
                                                : undefined,
                                        borderRadius:
                                            element.backgroundColor &&
                                                element.backgroundColor !==
                                                "transparent"
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
                                                {element.eraserPaths?.map(
                                                    (ep, idx) => (
                                                        <path
                                                            key={idx}
                                                            d={ep.d}
                                                            stroke="black"
                                                            strokeWidth={
                                                                ep.strokeWidth
                                                            }
                                                            strokeOpacity={
                                                                ep.opacity
                                                            }
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            fill="none"
                                                        />
                                                    )
                                                )}
                                                {liveTextEraserPath && (
                                                    <path
                                                        d={liveTextEraserPath}
                                                        stroke="black"
                                                        strokeWidth={
                                                            eraserSettings.size
                                                        }
                                                        strokeOpacity={
                                                            eraserSettings.opacity
                                                        }
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
                                            onPointerDown={(
                                                event
                                            ) =>
                                                event.stopPropagation()
                                            }
                                            onClick={(
                                                event
                                            ) => {
                                                event.stopPropagation();

                                                deleteElement(
                                                    element.id
                                                );
                                            }}
                                            className="absolute -right-7 -top-7 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                                            title="Delete element"
                                        >
                                            <X
                                                size={
                                                    14
                                                }
                                            />
                                        </button>
                                    )}

                                    {/* Text */}
                                    <span
                                        style={{
                                            fontSize:
                                                element.fontSize,
                                            color: element.color,
                                            fontWeight:
                                                element.fontWeight,
                                            fontFamily:
                                                element.fontFamily,
                                            fontStyle:
                                                element.fontStyle ===
                                                    "italic" ||
                                                    element.fontStyle ===
                                                    "italic-underline"
                                                    ? "italic"
                                                    : "normal",
                                            textDecoration:
                                                element.underline ||
                                                    element.fontStyle ===
                                                    "underline" ||
                                                    element.fontStyle ===
                                                    "italic-underline"
                                                    ? "underline"
                                                    : "none",
                                            whiteSpace:
                                                "pre",
                                        }}
                                    >
                                        {element.text}
                                    </span>

                                </div>
                            );
                        }

                        // ── Draw Element ──
                        if (element.type === "draw") {
                            const liveDrawEraserPath =
                                isEraserMode && isErasing && currentEraserPoints
                                    ? pointsToSvgPath(
                                        canvasPointsToElementLocal(
                                            currentEraserPoints,
                                            {
                                                x: element.x,
                                                y: element.y,
                                                width: element.width,
                                                height: element.height,
                                                rotation: element.rotation,
                                                size: element.size,
                                            }
                                        )
                                    )
                                    : null;

                            return (
                                <div
                                    key={element.id}
                                    data-element-id={element.id}
                                    onPointerDown={(event) =>
                                        handlePointerDown(event, element)
                                    }
                                    className={`absolute select-none ${isEraserMode
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
                                        transform: `rotate(${element.rotation}deg) scale(${(element.size ?? 100) / 100})`,
                                        transformOrigin: "center center",
                                        pointerEvents: isEraserMode
                                            ? "none"
                                            : "auto",
                                        opacity:
                                            element.opacity !== undefined
                                                ? element.opacity
                                                : 1,
                                    }}
                                >
                                    {/* Delete Button */}
                                    {isSelected && !isEraserMode && (
                                        <button
                                            type="button"
                                            onPointerDown={(event) =>
                                                event.stopPropagation()
                                            }
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
                                                {element.eraserPaths?.map(
                                                    (ep, idx) => (
                                                        <path
                                                            key={idx}
                                                            d={ep.d}
                                                            stroke="black"
                                                            strokeWidth={
                                                                ep.strokeWidth
                                                            }
                                                            strokeOpacity={
                                                                ep.opacity
                                                            }
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            fill="none"
                                                        />
                                                    )
                                                )}
                                                {liveDrawEraserPath && (
                                                    <path
                                                        d={liveDrawEraserPath}
                                                        stroke="black"
                                                        strokeWidth={
                                                            eraserSettings.size /
                                                            ((element.size ??
                                                                100) /
                                                                100 || 1)
                                                        }
                                                        strokeOpacity={
                                                            eraserSettings.opacity
                                                        }
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        fill="none"
                                                    />
                                                )}
                                            </mask>
                                        </defs>
                                        <g
                                            mask={`url(#eraser-mask-${element.id})`}
                                        >
                                            <path
                                                d={element.pathData}
                                                fill="none"
                                                stroke={element.color}
                                                strokeWidth={
                                                    element.strokeWidth
                                                }
                                                strokeOpacity={element.opacity}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </g>
                                    </svg>
                                </div>
                            );
                        }

                        // ── Table Element ──
                        if (element.type === "table") {
                            const approxW = Math.max(160, element.cols * 120);
                            const approxH = Math.max(
                                80,
                                (element.rows + (element.hasHeader ? 1 : 0)) *
                                    (element.fontSize * 1.5 + element.cellPadding * 2 + 4)
                            );

                            const liveTableEraserPath =
                                isEraserMode && isErasing && currentEraserPoints
                                    ? pointsToSvgPath(
                                          canvasPointsToElementLocal(
                                              currentEraserPoints,
                                              {
                                                  x: element.x,
                                                  y: element.y,
                                                  width: approxW,
                                                  height: approxH,
                                                  rotation: element.rotation,
                                                  size: element.size,
                                              }
                                          )
                                      )
                                    : null;

                            const hasTableMask =
                                (element.eraserPaths &&
                                    element.eraserPaths.length > 0) ||
                                Boolean(liveTableEraserPath);

                            const shadowStyles = {
                                none: "none",
                                sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
                                md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
                                lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                            };

                            return (
                                <div
                                    key={element.id}
                                    data-element-id={element.id}
                                    onPointerDown={(event) =>
                                        handlePointerDown(event, element)
                                    }
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
                                        transform: `rotate(${element.rotation}deg) scale(${(element.size ?? 100) / 100})`,
                                        transformOrigin: "center center",
                                        pointerEvents: isEraserMode
                                            ? "none"
                                            : "auto",
                                        opacity:
                                            element.opacity !== undefined
                                                ? element.opacity
                                                : 1,
                                        mask: hasTableMask
                                            ? `url(#eraser-mask-${element.id})`
                                            : undefined,
                                        WebkitMask: hasTableMask
                                            ? `url(#eraser-mask-${element.id})`
                                            : undefined,
                                    }}
                                >
                                    {/* SVG Defs for Table Mask */}
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
                                                {element.eraserPaths?.map(
                                                    (ep, idx) => (
                                                        <path
                                                            key={idx}
                                                            d={ep.d}
                                                            stroke="black"
                                                            strokeWidth={
                                                                ep.strokeWidth
                                                            }
                                                            strokeOpacity={
                                                                ep.opacity
                                                            }
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            fill="none"
                                                        />
                                                    )
                                                )}
                                                {liveTableEraserPath && (
                                                    <path
                                                        d={liveTableEraserPath}
                                                        stroke="black"
                                                        strokeWidth={
                                                            eraserSettings.size /
                                                            ((element.size ??
                                                                100) /
                                                                100 || 1)
                                                        }
                                                        strokeOpacity={
                                                            eraserSettings.opacity
                                                        }
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
                                            onPointerDown={(event) =>
                                                event.stopPropagation()
                                            }
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                deleteElement(element.id);
                                            }}
                                            className="absolute -right-7 -top-7 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                                            title="Delete table"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}

                                    {/* Table Content */}
                                    <div
                                        className="overflow-hidden"
                                        style={{
                                            borderRadius: element.borderRadius,
                                            boxShadow:
                                                shadowStyles[
                                                    element.shadow || "none"
                                                ],
                                            border:
                                                element.borderStyle !== "none" &&
                                                element.borderWidth > 0
                                                    ? `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`
                                                    : undefined,
                                        }}
                                    >
                                        <table
                                            className="border-collapse"
                                            style={{
                                                fontSize: element.fontSize,
                                                borderSpacing: 0,
                                            }}
                                        >
                                            {element.hasHeader && (
                                                <thead>
                                                    <tr
                                                        style={{
                                                            backgroundColor:
                                                                element.headerBg,
                                                        }}
                                                    >
                                                        {element.headers.map(
                                                            (hdr, cIdx) => (
                                                                <th
                                                                    key={cIdx}
                                                                    style={{
                                                                        color: element.headerColor,
                                                                        fontWeight:
                                                                            element.headerFontWeight,
                                                                        textAlign:
                                                                            element.headerAlign,
                                                                        padding: `${element.cellPadding}px ${element.cellPadding * 1.5}px`,
                                                                        borderBottom:
                                                                            element.borderStyle !==
                                                                                "none" &&
                                                                            element.borderWidth >
                                                                                0
                                                                                ? `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`
                                                                                : undefined,
                                                                        borderRight:
                                                                            cIdx <
                                                                                element.cols -
                                                                                    1 &&
                                                                            element.borderStyle !==
                                                                                "none" &&
                                                                            element.borderWidth >
                                                                                0
                                                                                ? `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`
                                                                                : undefined,
                                                                    }}
                                                                >
                                                                    {editingCell &&
                                                                    editingCell.elementId ===
                                                                        element.id &&
                                                                    editingCell.row ===
                                                                        -1 &&
                                                                    editingCell.col ===
                                                                        cIdx ? (
                                                                        <input
                                                                            autoFocus
                                                                            value={hdr}
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                const newHeaders =
                                                                                    [
                                                                                        ...element.headers,
                                                                                    ];
                                                                                newHeaders[
                                                                                    cIdx
                                                                                ] =
                                                                                    e.target.value;
                                                                                updateElement(
                                                                                    element.id,
                                                                                    {
                                                                                        headers:
                                                                                            newHeaders,
                                                                                    }
                                                                                );
                                                                            }}
                                                                            onBlur={() =>
                                                                                setEditingCell(
                                                                                    null
                                                                                )
                                                                            }
                                                                            onKeyDown={(
                                                                                e
                                                                            ) => {
                                                                                if (
                                                                                    e.key ===
                                                                                        "Enter" ||
                                                                                    e.key ===
                                                                                        "Escape"
                                                                                )
                                                                                    setEditingCell(
                                                                                        null
                                                                                    );
                                                                            }}
                                                                            className="w-full rounded bg-transparent px-1 outline-none ring-1 ring-blue-500"
                                                                        />
                                                                    ) : (
                                                                        <span
                                                                            onDoubleClick={(
                                                                                e
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                                setEditingCell(
                                                                                    {
                                                                                        elementId:
                                                                                            element.id,
                                                                                        row: -1,
                                                                                        col: cIdx,
                                                                                    }
                                                                                );
                                                                            }}
                                                                            className="cursor-text"
                                                                            title="Double click to edit"
                                                                        >
                                                                            {hdr ||
                                                                                " "}
                                                                        </span>
                                                                    )}
                                                                </th>
                                                            )
                                                        )}
                                                    </tr>
                                                </thead>
                                            )}
                                            <tbody>
                                                {Array.from({
                                                    length: element.rows,
                                                }).map((_, rIdx) => {
                                                    const rowBg =
                                                        rIdx % 2 === 1 &&
                                                        element.altRowBg
                                                            ? element.altRowBg
                                                            : element.rowBg;
                                                    return (
                                                        <tr
                                                            key={rIdx}
                                                            style={{
                                                                backgroundColor:
                                                                    rowBg,
                                                            }}
                                                        >
                                                            {Array.from({
                                                                length: element.cols,
                                                            }).map(
                                                                (__, cIdx) => {
                                                                    const val =
                                                                        element
                                                                            .data?.[
                                                                            rIdx
                                                                        ]?.[
                                                                            cIdx
                                                                        ] ?? "";
                                                                    return (
                                                                        <td
                                                                            key={
                                                                                cIdx
                                                                            }
                                                                            style={{
                                                                                color: element.cellColor,
                                                                                textAlign:
                                                                                    element.cellAlign,
                                                                                padding: `${element.cellPadding}px ${element.cellPadding * 1.5}px`,
                                                                                borderBottom:
                                                                                    rIdx <
                                                                                        element.rows -
                                                                                            1 &&
                                                                                    element.borderStyle !==
                                                                                        "none" &&
                                                                                    element.borderWidth >
                                                                                        0
                                                                                        ? `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`
                                                                                        : undefined,
                                                                                borderRight:
                                                                                    cIdx <
                                                                                        element.cols -
                                                                                            1 &&
                                                                                    element.borderStyle !==
                                                                                        "none" &&
                                                                                    element.borderWidth >
                                                                                        0
                                                                                        ? `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`
                                                                                        : undefined,
                                                                            }}
                                                                        >
                                                                            {editingCell &&
                                                                            editingCell.elementId ===
                                                                                element.id &&
                                                                            editingCell.row ===
                                                                                rIdx &&
                                                                            editingCell.col ===
                                                                                cIdx ? (
                                                                                <input
                                                                                    autoFocus
                                                                                    value={
                                                                                        val
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newData =
                                                                                            element.data.map(
                                                                                                (
                                                                                                    r
                                                                                                ) => [
                                                                                                    ...r,
                                                                                                ]
                                                                                            );
                                                                                        if (
                                                                                            !newData[
                                                                                                rIdx
                                                                                            ]
                                                                                        )
                                                                                            newData[
                                                                                                rIdx
                                                                                            ] =
                                                                                                [];
                                                                                        newData[
                                                                                            rIdx
                                                                                        ][
                                                                                            cIdx
                                                                                        ] =
                                                                                            e.target.value;
                                                                                        updateElement(
                                                                                            element.id,
                                                                                            {
                                                                                                data: newData,
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                    onBlur={() =>
                                                                                        setEditingCell(
                                                                                            null
                                                                                        )
                                                                                    }
                                                                                    onKeyDown={(
                                                                                        e
                                                                                    ) => {
                                                                                        if (
                                                                                            e.key ===
                                                                                                "Enter" ||
                                                                                            e.key ===
                                                                                                "Escape"
                                                                                        )
                                                                                            setEditingCell(
                                                                                                null
                                                                                            );
                                                                                    }}
                                                                                    className="w-full rounded bg-transparent px-1 outline-none ring-1 ring-blue-500"
                                                                                />
                                                                            ) : (
                                                                                <span
                                                                                    onDoubleClick={(
                                                                                        e
                                                                                    ) => {
                                                                                        e.stopPropagation();
                                                                                        setEditingCell(
                                                                                            {
                                                                                                elementId:
                                                                                                    element.id,
                                                                                                row: rIdx,
                                                                                                col: cIdx,
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                    className="cursor-text"
                                                                                    title="Double click to edit"
                                                                                >
                                                                                    {val ||
                                                                                        " "}
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                    );
                                                                }
                                                            )}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        }

                        // ── Clock Element ──
                        if (element.type === "clock") {
                            const clk = element as ClockElement;
                            const clockW = 300;
                            const clockH = 190;
                            const scale = (clk.size ?? 100) / 100;

                            // ── Compute display time ──
                            let totalSeconds: number;
                            if (clk.timeMode === "live") {
                                const now = new Date();
                                totalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
                            } else if (clk.timeMode === "custom") {
                                const base = clk.customHour * 3600 + clk.customMinute * 60 + clk.customSecond;
                                const elapsed = Math.floor((Date.now() - clk.startEpochMs) / 1000);
                                totalSeconds = base + elapsed;
                            } else {
                                totalSeconds = clk.customHour * 3600 + clk.customMinute * 60 + clk.customSecond;
                            }

                            const displayH = Math.floor(totalSeconds / 3600) % 24;
                            const displayM = Math.floor(totalSeconds / 60) % 60;
                            const displayS = totalSeconds % 60;

                            const h12 = clk.is24Hour ? displayH : displayH % 12 === 0 ? 12 : displayH % 12;
                            const ampm = displayH < 12 ? "AM" : "PM";
                            const pad = (n: number) => String(n).padStart(2, "0");
                            const timeStr = clk.showSeconds
                                ? `${pad(h12)}:${pad(displayM)}:${pad(displayS)}`
                                : `${pad(h12)}:${pad(displayM)}`;

                            // ── Date string ──
                            const now = new Date();
                            const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
                            const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                            const dayName = days[now.getDay()];
                            const monthName = months[now.getMonth()];
                            const dayNum = pad(now.getDate());
                            const yearNum = now.getFullYear();
                            const liveFormattedDate = `${dayName} • ${dayNum} ${monthName} ${yearNum}`;
                            const dateDisplayStr = clk.showDate
                                ? (clk.dateMode === "live" ? liveFormattedDate : clk.customDateStr)
                                : "";

                            // ── Analog angles ──
                            const hourAngle = ((displayH % 12) + displayM / 60) * 30;
                            const minuteAngle = (displayM + displayS / 60) * 6;
                            const secondAngle = displayS * 6;

                            const shadowMap = {
                                none: "none",
                                sm: "0 1px 3px rgba(0,0,0,0.3)",
                                md: "0 4px 12px rgba(0,0,0,0.4)",
                                lg: "0 10px 30px rgba(0,0,0,0.5)",
                            };

                            const liveClockEraserPath =
                                isEraserMode && isErasing && currentEraserPoints
                                    ? pointsToSvgPath(
                                          canvasPointsToElementLocal(
                                              currentEraserPoints,
                                              {
                                                  x: clk.x,
                                                  y: clk.y,
                                                  width: clockW,
                                                  height: clockH,
                                                  rotation: clk.rotation,
                                                  size: clk.size,
                                              }
                                          )
                                      )
                                    : null;

                            const hasClockMask =
                                (clk.eraserPaths && clk.eraserPaths.length > 0) ||
                                Boolean(liveClockEraserPath);

                            // ── Render clock body by design ──
                            const renderClockFace = () => {
                                // 1. Analog Classic (Luxury Chronometer)
                                if (clk.design === "analog-classic") {
                                    const cx = clockW / 2;
                                    const cy = clockH / 2;
                                    const r = 78;
                                    const toX = (angle: number, len: number) => cx + Math.sin((angle * Math.PI) / 180) * len;
                                    const toY = (angle: number, len: number) => cy - Math.cos((angle * Math.PI) / 180) * len;

                                    return (
                                        <g>
                                            {/* Outer Case / Plate */}
                                            <rect x="0" y="0" width={clockW} height={clockH} rx={clk.borderRadius} fill={clk.bgColor} stroke={clk.borderColor} strokeWidth={clk.borderWidth} />

                                            {/* Outer Luxury Polished Bezel */}
                                            <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke="#475569" strokeWidth="3" />
                                            <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                                            <circle cx={cx} cy={cy} r={r} fill={clk.bgColor} stroke={clk.borderColor} strokeWidth={clk.borderWidth} />

                                            {/* Concentric Guilloché Texture Rings */}
                                            <circle cx={cx} cy={cy} r={r * 0.38} fill="none" stroke={clk.textColor} strokeWidth="0.5" opacity="0.08" />
                                            <circle cx={cx} cy={cy} r={r * 0.65} fill="none" stroke={clk.textColor} strokeWidth="0.5" opacity="0.08" />
                                            <circle cx={cx} cy={cy} r={r * 0.86} fill="none" stroke={clk.textColor} strokeWidth="0.5" opacity="0.08" />

                                            {/* Horology Inscriptions */}
                                            <text x={cx} y={cy - 26} textAnchor="middle" fill={clk.textColor} fontSize="7" fontWeight="700" letterSpacing="1.8" opacity="0.65">CHRONOMETER</text>
                                            <text x={cx} y={cy - 18} textAnchor="middle" fill={clk.accentColor} fontSize="5.5" fontWeight="600" letterSpacing="1.2" opacity="0.75">AUTOMATIC</text>
                                            <text x={cx} y={cy + 42} textAnchor="middle" fill={clk.textColor} fontSize="5" fontWeight="600" letterSpacing="2" opacity="0.45">SWISS HOROLOGY</text>

                                            {/* 60 Minute Chapter Ring & 12 Faceted Hour Markers */}
                                            {Array.from({ length: 60 }).map((_, i) => {
                                                const angle = i * 6;
                                                const isHour = i % 5 === 0;
                                                const len = isHour ? 10 : 3.5;
                                                const x1 = cx + Math.sin((angle * Math.PI) / 180) * (r - 3);
                                                const y1 = cy - Math.cos((angle * Math.PI) / 180) * (r - 3);
                                                const x2 = cx + Math.sin((angle * Math.PI) / 180) * (r - 3 - len);
                                                const y2 = cy - Math.cos((angle * Math.PI) / 180) * (r - 3 - len);
                                                return (
                                                    <line
                                                        key={i}
                                                        x1={x1}
                                                        y1={y1}
                                                        x2={x2}
                                                        y2={y2}
                                                        stroke={clk.textColor}
                                                        strokeWidth={isHour ? 2.5 : 0.8}
                                                        strokeLinecap="round"
                                                        opacity={isHour ? 0.95 : 0.35}
                                                    />
                                                );
                                            })}

                                            {/* Beveled Date Aperture at 3 o'clock */}
                                            <rect x={cx + 34} y={cy - 8} width="22" height="16" rx="2.5" fill="#0b0f19" stroke={clk.borderColor} strokeWidth="1" />
                                            <text x={cx + 45} y={cy + 4} textAnchor="middle" fill={clk.textColor} fontSize="9" fontWeight="700">
                                                {pad(now.getDate())}
                                            </text>

                                            {/* Hour Hand (Faceted Sword Hand) */}
                                            <line x1={cx} y1={cy} x2={toX(hourAngle, r * 0.52)} y2={toY(hourAngle, r * 0.52)} stroke={clk.textColor} strokeWidth="4" strokeLinecap="round" />
                                            <line x1={cx} y1={cy} x2={toX(hourAngle, r * 0.48)} y2={toY(hourAngle, r * 0.48)} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />

                                            {/* Minute Hand (Slender Sword Hand) */}
                                            <line x1={cx} y1={cy} x2={toX(minuteAngle, r * 0.78)} y2={toY(minuteAngle, r * 0.78)} stroke={clk.textColor} strokeWidth="3" strokeLinecap="round" />
                                            <line x1={cx} y1={cy} x2={toX(minuteAngle, r * 0.74)} y2={toY(minuteAngle, r * 0.74)} stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />

                                            {/* Second Hand (Needle with Counterweight Ring) */}
                                            {clk.showSeconds && (
                                                <g>
                                                    <line x1={cx} y1={cy} x2={toX(secondAngle + 180, r * 0.22)} y2={toY(secondAngle + 180, r * 0.22)} stroke={clk.accentColor} strokeWidth="1.5" strokeLinecap="round" />
                                                    <circle cx={toX(secondAngle + 180, r * 0.16)} cy={toY(secondAngle + 180, r * 0.16)} r="3" fill="none" stroke={clk.accentColor} strokeWidth="1.5" />
                                                    <line x1={cx} y1={cy} x2={toX(secondAngle, r * 0.88)} y2={toY(secondAngle, r * 0.88)} stroke={clk.accentColor} strokeWidth="1.5" strokeLinecap="round" />
                                                </g>
                                            )}

                                            {/* Layered Center Cap */}
                                            <circle cx={cx} cy={cy} r="5" fill="#334155" stroke="#1e293b" strokeWidth="1" />
                                            <circle cx={cx} cy={cy} r="2.2" fill={clk.accentColor} />

                                            {/* Bottom Date Text */}
                                            {dateDisplayStr && (
                                                <text x={cx} y={cy + 62} textAnchor="middle" fill={clk.textColor} fontSize="8" fontWeight="600" opacity="0.6">
                                                    {dateDisplayStr}
                                                </text>
                                            )}
                                        </g>
                                    );
                                }

                                // 2. Analog Swiss (Bauhaus Mondaine Minimalist)
                                if (clk.design === "analog-swiss") {
                                    const cx = clockW / 2;
                                    const cy = clockH / 2;
                                    const r = 78;
                                    const toX = (angle: number, len: number) => cx + Math.sin((angle * Math.PI) / 180) * len;
                                    const toY = (angle: number, len: number) => cy - Math.cos((angle * Math.PI) / 180) * len;

                                    return (
                                        <g>
                                            {/* Pure Bauhaus Minimalist Case */}
                                            <rect x="0" y="0" width={clockW} height={clockH} rx={clk.borderRadius} fill={clk.bgColor} stroke={clk.borderColor} strokeWidth={clk.borderWidth} />
                                            <circle cx={cx} cy={cy} r={r} fill={clk.bgColor} stroke={clk.textColor} strokeWidth="2.5" />

                                            {/* 12 Bold Bauhaus Baton Markers + 48 Minute Ticks */}
                                            {Array.from({ length: 60 }).map((_, i) => {
                                                const angle = i * 6;
                                                const isHour = i % 5 === 0;
                                                const len = isHour ? 12 : 4.5;
                                                const x1 = cx + Math.sin((angle * Math.PI) / 180) * (r - 2);
                                                const y1 = cy - Math.cos((angle * Math.PI) / 180) * (r - 2);
                                                const x2 = cx + Math.sin((angle * Math.PI) / 180) * (r - 2 - len);
                                                const y2 = cy - Math.cos((angle * Math.PI) / 180) * (r - 2 - len);
                                                return (
                                                    <line
                                                        key={i}
                                                        x1={x1}
                                                        y1={y1}
                                                        x2={x2}
                                                        y2={y2}
                                                        stroke={clk.textColor}
                                                        strokeWidth={isHour ? 3.5 : 1}
                                                        strokeLinecap="square"
                                                    />
                                                );
                                            })}

                                            {/* Hour Baton Hand */}
                                            <line x1={cx} y1={cy} x2={toX(hourAngle, r * 0.55)} y2={toY(hourAngle, r * 0.55)} stroke={clk.textColor} strokeWidth="5.5" strokeLinecap="square" />

                                            {/* Minute Baton Hand */}
                                            <line x1={cx} y1={cy} x2={toX(minuteAngle, r * 0.82)} y2={toY(minuteAngle, r * 0.82)} stroke={clk.textColor} strokeWidth="3.8" strokeLinecap="square" />

                                            {/* Iconic Swiss Railway Red Lollipop Second Hand */}
                                            {clk.showSeconds && (
                                                <g>
                                                    <line x1={cx} y1={cy} x2={toX(secondAngle + 180, r * 0.2)} y2={toY(secondAngle + 180, r * 0.2)} stroke={clk.accentColor} strokeWidth="1.8" />
                                                    <line x1={cx} y1={cy} x2={toX(secondAngle, r * 0.68)} y2={toY(secondAngle, r * 0.68)} stroke={clk.accentColor} strokeWidth="1.8" />
                                                    <circle cx={toX(secondAngle, r * 0.72)} cy={toY(secondAngle, r * 0.72)} r="5.5" fill={clk.accentColor} />
                                                </g>
                                            )}

                                            {/* Prominent Center Hub */}
                                            <circle cx={cx} cy={cy} r="5" fill={clk.accentColor} />
                                            <circle cx={cx} cy={cy} r="2" fill={clk.bgColor} />

                                            {/* Minimalist Date at 6 o'clock */}
                                            {dateDisplayStr && (
                                                <g>
                                                    <rect x={cx - 24} y={cy + 34} width="48" height="15" rx="3" fill="rgba(0,0,0,0.25)" stroke={clk.borderColor} strokeWidth="0.8" />
                                                    <text x={cx} y={cy + 45} textAnchor="middle" fill={clk.textColor} fontSize="8.5" fontWeight="700">
                                                        {dateDisplayStr.split(" • ")[0] || pad(now.getDate())}
                                                    </text>
                                                </g>
                                            )}
                                        </g>
                                    );
                                }

                                // 3. Neon Digital (Cyberpunk Luminescent HUD)
                                if (clk.design === "digital-neon") {
                                    const totalBars = 20;
                                    const activeBars = Math.floor((displayS / 60) * totalBars);
                                    return (
                                        <g>
                                            {/* Dark Cyber Base & Glow Border */}
                                            <rect x="0" y="0" width={clockW} height={clockH} rx={clk.borderRadius} fill={clk.bgColor} stroke={clk.borderColor} strokeWidth={clk.borderWidth} />
                                            <rect x="0" y="0" width={clockW} height={clockH} rx={clk.borderRadius} fill="none" stroke={clk.accentColor} strokeWidth="1" opacity="0.35" filter={`url(#neon-glow-${clk.id})`} />

                                            {/* Cyber Corner Brackets */}
                                            <path d="M 14 30 L 14 14 L 30 14" fill="none" stroke={clk.accentColor} strokeWidth="2" strokeLinecap="round" />
                                            <path d={`M ${clockW - 30} 14 L ${clockW - 14} 14 L ${clockW - 14} 30`} fill="none" stroke={clk.accentColor} strokeWidth="2" strokeLinecap="round" />
                                            <path d="M 14 160 L 14 176 L 30 176" fill="none" stroke={clk.accentColor} strokeWidth="2" strokeLinecap="round" />
                                            <path d={`M ${clockW - 30} 176 L ${clockW - 14} 176 L ${clockW - 14} 160`} fill="none" stroke={clk.accentColor} strokeWidth="2" strokeLinecap="round" />

                                            {/* Tactical Header */}
                                            <text x="36" y="30" fill={clk.accentColor} fontSize="9" fontWeight="800" fontFamily="monospace" letterSpacing="2">SYS.NEON // CHRONO</text>
                                            <text x={clockW - 36} y="30" textAnchor="end" fill={clk.textColor} fontSize="9" fontWeight="700" fontFamily="monospace" letterSpacing="1" opacity="0.7">{clk.is24Hour ? "24-HOUR" : ampm}</text>

                                            {/* Ghost 88:88:88 Background */}
                                            <text x={clockW / 2} y="106" textAnchor="middle" fill={clk.accentColor} opacity="0.08" fontSize={clk.showSeconds ? 44 : 52} fontWeight="900" fontFamily="'Courier New', monospace" letterSpacing="4">
                                                88:88{clk.showSeconds ? ":88" : ""}
                                            </text>

                                            {/* Bright Neon Digits */}
                                            <text
                                                x={clockW / 2}
                                                y="106"
                                                textAnchor="middle"
                                                fill={clk.textColor}
                                                stroke={clk.accentColor}
                                                strokeWidth="1.2"
                                                filter={`url(#neon-glow-${clk.id})`}
                                                fontSize={clk.showSeconds ? 44 : 52}
                                                fontWeight="900"
                                                fontFamily="'Courier New', monospace"
                                                letterSpacing="4"
                                            >
                                                {timeStr}
                                            </text>

                                            {/* Audio-meter style tick meter for seconds */}
                                            <g transform="translate(40, 130)">
                                                {Array.from({ length: totalBars }).map((_, i) => (
                                                    <rect
                                                        key={i}
                                                        x={i * 11}
                                                        y="0"
                                                        width="7"
                                                        height="6"
                                                        rx="1"
                                                        fill={i <= activeBars ? clk.accentColor : "#1e293b"}
                                                        opacity={i <= activeBars ? 0.95 : 0.3}
                                                        filter={i <= activeBars ? `url(#neon-glow-${clk.id})` : undefined}
                                                    />
                                                ))}
                                            </g>

                                            {/* Date Tag */}
                                            {dateDisplayStr && (
                                                <text x={clockW / 2} y="165" textAnchor="middle" fill={clk.accentColor} fontSize="10" fontWeight="700" fontFamily="monospace" letterSpacing="2.5" opacity="0.9">
                                                    {`[ ${dateDisplayStr} ]`}
                                                </text>
                                            )}
                                        </g>
                                    );
                                }

                                // 4. Flip Card (Mechanical Retro Solari Airport Clock)
                                if (clk.design === "flip-card") {
                                    const fH = pad(h12);
                                    const fM = pad(displayM);
                                    const fS = pad(displayS);
                                    const cards = clk.showSeconds
                                        ? [ { val: fH, label: "HOURS" }, { val: fM, label: "MINUTES" }, { val: fS, label: "SECONDS" } ]
                                        : [ { val: fH, label: "HOURS" }, { val: fM, label: "MINUTES" } ];
                                    
                                    const cardW = clk.showSeconds ? 76 : 118;
                                    const cardH = 92;
                                    const gap = clk.showSeconds ? 12 : 20;
                                    const totalW = cards.length * cardW + (cards.length - 1) * gap;
                                    const startX = (clockW - totalW) / 2;
                                    const cardY = 24;

                                    return (
                                        <g>
                                            {/* Vintage Solid Casing with Screw Rivets */}
                                            <rect x="0" y="0" width={clockW} height={clockH} rx={clk.borderRadius} fill={clk.bgColor} stroke={clk.borderColor} strokeWidth={clk.borderWidth} />
                                            {/* Screws in corners */}
                                            {[ [14, 14], [clockW - 14, 14], [14, clockH - 14], [clockW - 14, clockH - 14] ].map(([sx, sy], i) => (
                                                <g key={i}>
                                                    <circle cx={sx} cy={sy} r="3" fill="#374151" stroke="#1f2937" strokeWidth="0.8" />
                                                    <line x1={sx - 1.8} y1={sy} x2={sx + 1.8} y2={sy} stroke="#111827" strokeWidth="0.8" />
                                                </g>
                                            ))}

                                            {/* Flip Cards */}
                                            {cards.map((c, idx) => {
                                                const cx0 = startX + idx * (cardW + gap);
                                                const halfH = cardH / 2;
                                                return (
                                                    <g key={idx}>
                                                        {/* Shadow underneath */}
                                                        <rect x={cx0 + 2} y={cardY + 3} width={cardW} height={cardH} rx="7" fill="rgba(0,0,0,0.5)" />

                                                        {/* Top Flap */}
                                                        <rect x={cx0} y={cardY} width={cardW} height={halfH - 1} rx="7" fill={`url(#flip-top-${clk.id})`} stroke="#374151" strokeWidth="1" />
                                                        <rect x={cx0 + 2} y={cardY + 1} width={cardW - 4} height="2" fill="rgba(255,255,255,0.12)" />

                                                        {/* Bottom Flap */}
                                                        <rect x={cx0} y={cardY + halfH + 1} width={cardW} height={halfH - 1} rx="7" fill={`url(#flip-bot-${clk.id})`} stroke="#2b303c" strokeWidth="1" />

                                                        {/* Center Physical Slot */}
                                                        <line x1={cx0} y1={cardY + halfH} x2={cx0 + cardW} y2={cardY + halfH} stroke="#0b0d12" strokeWidth="3" />
                                                        <line x1={cx0} y1={cardY + halfH + 1.5} x2={cx0 + cardW} y2={cardY + halfH + 1.5} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                                                        {/* Side Hinge Clips */}
                                                        <rect x={cx0 - 3} y={cardY + halfH - 4} width="5" height="8" rx="1.5" fill="#6b7280" stroke="#1f2937" strokeWidth="0.6" />
                                                        <rect x={cx0 + cardW - 2} y={cardY + halfH - 4} width="5" height="8" rx="1.5" fill="#6b7280" stroke="#1f2937" strokeWidth="0.6" />

                                                        {/* Big Bold Split Numeral */}
                                                        <text
                                                            x={cx0 + cardW / 2}
                                                            y={cardY + halfH + 16}
                                                            textAnchor="middle"
                                                            fill={clk.textColor}
                                                            fontSize={clk.showSeconds ? 44 : 54}
                                                            fontWeight="900"
                                                            fontFamily="Impact, 'Arial Black', sans-serif"
                                                            letterSpacing="1"
                                                        >
                                                            {c.val}
                                                        </text>

                                                        {/* Label Under Card */}
                                                        <text x={cx0 + cardW / 2} y={cardY + cardH + 16} textAnchor="middle" fill={clk.textColor} fontSize="8" fontWeight="700" letterSpacing="1.5" opacity="0.5">
                                                            {c.label}
                                                        </text>

                                                        {/* Colon Separator */}
                                                        {idx < cards.length - 1 && (
                                                            <g>
                                                                <circle cx={cx0 + cardW + gap / 2} cy={cardY + halfH - 12} r="3" fill={clk.accentColor} />
                                                                <circle cx={cx0 + cardW + gap / 2} cy={cardY + halfH + 12} r="3" fill={clk.accentColor} />
                                                            </g>
                                                        )}
                                                    </g>
                                                );
                                            })}

                                            {/* Bottom Date Plaque */}
                                            {dateDisplayStr && (
                                                <g>
                                                    <rect x="50" y="156" width={clockW - 100} height="22" rx="4" fill="#14171e" stroke="#2a2e39" strokeWidth="1" />
                                                    <text x={clockW / 2} y="171" textAnchor="middle" fill={clk.accentColor} fontSize="9.5" fontWeight="700" letterSpacing="2">
                                                        {dateDisplayStr}
                                                    </text>
                                                </g>
                                            )}
                                        </g>
                                    );
                                }

                                // 5. Smartwatch (Apple Watch Ultra / Wide Titanium Squircle)
                                if (clk.design === "smartwatch") {
                                    const sw = 230; // Increased width as requested
                                    const sh = 174;
                                    const sx = (clockW - sw) / 2; // 35
                                    const sy = (clockH - sh) / 2; // 8
                                    const screenW = 206;
                                    const screenH = 152;
                                    const screenX = sx + 12; // 47
                                    const screenY = sy + 11; // 19

                                    return (
                                        <g>
                                            {/* Left Action Button (Orange / Tactical Accent) */}
                                            <rect x={sx - 5} y={sy + 52} width="6" height="32" rx="2.5" fill="#f97316" stroke="#9a3412" strokeWidth="0.8" />

                                            {/* Right Digital Crown with Ribbed Ridges */}
                                            <rect x={sx + sw - 1} y={sy + 36} width="8" height="38" rx="3.5" fill="#475569" stroke="#1e293b" strokeWidth="1" />
                                            <rect x={sx + sw + 1} y={sy + 40} width="2" height="30" fill={clk.accentColor} rx="1" />
                                            {[0, 1, 2, 3, 4, 5].map((r) => (
                                                <line key={r} x1={sx + sw + 3} y1={sy + 42 + r * 4.5} x2={sx + sw + 6} y2={sy + 42 + r * 4.5} stroke="#0f172a" strokeWidth="1" />
                                            ))}

                                            {/* Right Mic / Secondary Button */}
                                            <rect x={sx + sw - 1} y={sy + 86} width="5" height="22" rx="2" fill="#334155" stroke="#1e293b" strokeWidth="0.8" />

                                            {/* Watch Chassis (Titanium / Luxury Squircle Body) */}
                                            <rect x={sx} y={sy} width={sw} height={sh} rx="30" fill={`url(#titanium-${clk.id})`} stroke={clk.borderColor} strokeWidth={Math.max(2, clk.borderWidth)} />
                                            <rect x={sx + 2} y={sy + 2} width={sw - 4} height={sh - 4} rx="28" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

                                            {/* OLED Glass Screen */}
                                            <rect x={screenX} y={screenY} width={screenW} height={screenH} rx="22" fill={clk.bgColor} stroke="#171b26" strokeWidth="1.5" />
                                            {/* Screen Glass Specular Highlight Curve */}
                                            <path d={`M ${screenX + 8} ${screenY + 2} Q ${screenX + screenW / 2} ${screenY + 12} ${screenX + screenW - 8} ${screenY + 2}`} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

                                            {/* Status Bar */}
                                            <circle cx={screenX + 16} cy={screenY + 16} r="3" fill="#f97316" />
                                            <text x={screenX + 24} y={screenY + 19} fill="#f97316" fontSize="9" fontWeight="700">ACTIVE</text>

                                            <rect x={screenX + screenW - 32} y={screenY + 11} width="18" height="9" rx="2.5" fill="none" stroke="#22c55e" strokeWidth="1" />
                                            <rect x={screenX + screenW - 30} y={screenY + 13} width="12" height="5" rx="1" fill="#22c55e" />
                                            <text x={screenX + screenW - 36} y={screenY + 19} textAnchor="end" fill="#22c55e" fontSize="8" fontWeight="700">98%</text>

                                            {/* Big WatchOS Digital Time */}
                                            <text
                                                x={screenX + screenW / 2}
                                                y={screenY + 58}
                                                textAnchor="middle"
                                                fill={clk.textColor}
                                                fontSize="38"
                                                fontWeight="800"
                                                fontFamily="system-ui, -apple-system, sans-serif"
                                                letterSpacing="1"
                                            >
                                                {timeStr}
                                            </text>
                                            {!clk.is24Hour && (
                                                <text x={screenX + screenW - 14} y={screenY + 44} textAnchor="end" fill={clk.accentColor} fontSize="10" fontWeight="700">
                                                    {ampm}
                                                </text>
                                            )}

                                            {/* Apple-style 3-Ring Activity Complication (Left Side) */}
                                            <g transform={`translate(${screenX + 32}, ${screenY + 98})`}>
                                                {/* Ring 1 - Move Red */}
                                                <circle cx="0" cy="0" r="17" fill="none" stroke="#f43f5e" strokeWidth="3.5" opacity="0.25" />
                                                <circle cx="0" cy="0" r="17" fill="none" stroke="#f43f5e" strokeWidth="3.5" strokeDasharray="107" strokeDashoffset={107 - (107 * 0.78)} strokeLinecap="round" transform="rotate(-90)" />

                                                {/* Ring 2 - Exercise Green */}
                                                <circle cx="0" cy="0" r="12" fill="none" stroke="#10b981" strokeWidth="3.5" opacity="0.25" />
                                                <circle cx="0" cy="0" r="12" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray="75" strokeDashoffset={75 - (75 * 0.62)} strokeLinecap="round" transform="rotate(-90)" />

                                                {/* Ring 3 - Stand Cyan */}
                                                <circle cx="0" cy="0" r="7" fill="none" stroke="#06b6d4" strokeWidth="3.5" opacity="0.25" />
                                                <circle cx="0" cy="0" r="7" fill="none" stroke="#06b6d4" strokeWidth="3.5" strokeDasharray="44" strokeDashoffset={44 - (44 * 0.88)} strokeLinecap="round" transform="rotate(-90)" />
                                            </g>

                                            {/* Complication Widgets (Right Side) */}
                                            <text x={screenX + 64} y={screenY + 88} fill="#f43f5e" fontSize="9" fontWeight="700">❤️ 72 BPM</text>
                                            <text x={screenX + 130} y={screenY + 88} fill="#f59e0b" fontSize="9" fontWeight="700">🔥 420 KCAL</text>
                                            <text x={screenX + 64} y={screenY + 104} fill="#10b981" fontSize="9" fontWeight="700">👟 8,420 STEPS</text>
                                            <text x={screenX + 140} y={screenY + 104} fill="#06b6d4" fontSize="9" fontWeight="700">⚡ 12 HR</text>

                                            {/* Seconds Dynamic Track */}
                                            <line x1={screenX + 64} y1={screenY + 114} x2={screenX + screenW - 16} y2={screenY + 114} stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
                                            <line x1={screenX + 64} y1={screenY + 114} x2={screenX + 64 + ((screenW - 80) * (displayS / 60))} y2={screenY + 114} stroke={clk.accentColor} strokeWidth="2.5" strokeLinecap="round" />

                                            {/* Date Pill at Bottom */}
                                            {dateDisplayStr && (
                                                <text x={screenX + screenW / 2} y={screenY + 138} textAnchor="middle" fill={clk.textColor} fontSize="9.5" fontWeight="600" opacity="0.8" letterSpacing="1">
                                                    {dateDisplayStr}
                                                </text>
                                            )}
                                        </g>
                                    );
                                }

                                // 6. Default: Digital Minimal (Clean High-End Precision Widget)
                                const secProgressW = (clockW - 48) * (displayS / 60);
                                return (
                                    <g>
                                        {/* Background & Inset Glass Highlight */}
                                        <rect x="0" y="0" width={clockW} height={clockH} rx={clk.borderRadius} fill={clk.bgColor} stroke={clk.borderColor} strokeWidth={clk.borderWidth} />
                                        <rect x="1" y="1" width={clockW - 2} height={clockH - 2} rx={Math.max(0, clk.borderRadius - 1)} fill={`url(#glass-shine-${clk.id})`} />
                                        
                                        {/* Header: Status Dot & AM/PM Badge */}
                                        <circle cx="28" cy="26" r="3.5" fill={clk.accentColor} />
                                        <circle cx="28" cy="26" r="7" fill={clk.accentColor} opacity="0.2" />
                                        <text x="40" y="30" fill={clk.textColor} fontSize="10" fontWeight="600" letterSpacing="1.5" opacity="0.6">PRECISION TIME</text>

                                        <rect x={clockW - 56} y="16" width="38" height="20" rx="10" fill={clk.accentColor + "18"} stroke={clk.accentColor + "35"} strokeWidth="1" />
                                        <text x={clockW - 37} y="30" textAnchor="middle" fill={clk.accentColor} fontSize="10" fontWeight="700">{clk.is24Hour ? "24H" : ampm}</text>

                                        {/* Main Time Digits */}
                                        <text
                                            x={clk.showSeconds ? 126 : clockW / 2}
                                            y="112"
                                            textAnchor="middle"
                                            fill={clk.textColor}
                                            fontSize={clk.showSeconds ? 48 : 54}
                                            fontWeight="700"
                                            fontFamily="system-ui, -apple-system, sans-serif"
                                            letterSpacing="2"
                                        >
                                            {pad(h12)}:{pad(displayM)}
                                        </text>

                                        {/* Dedicated Seconds Badge */}
                                        {clk.showSeconds && (
                                            <g>
                                                <rect x="206" y="78" width="44" height="34" rx="8" fill={clk.accentColor + "16"} stroke={clk.accentColor + "38"} strokeWidth="1" />
                                                <text x="228" y="101" textAnchor="middle" fill={clk.accentColor} fontSize="19" fontWeight="800" fontFamily="monospace">{pad(displayS)}</text>
                                                <text x="228" y="70" textAnchor="middle" fill={clk.textColor} fontSize="8" fontWeight="600" letterSpacing="1" opacity="0.5">SEC</text>
                                            </g>
                                        )}

                                        {/* Minimal Second Progress Bar */}
                                        <line x1="24" y1="138" x2={clockW - 24} y2="138" stroke={clk.borderColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
                                        <line x1="24" y1="138" x2={24 + secProgressW} y2="138" stroke={clk.accentColor} strokeWidth="2.5" strokeLinecap="round" />

                                        {/* Date Pill */}
                                        {dateDisplayStr && (
                                            <g>
                                                <rect x="40" y="152" width={clockW - 80} height="22" rx="11" fill="rgba(0,0,0,0.2)" stroke={clk.borderColor} strokeWidth="0.8" />
                                                <text x={clockW / 2} y="167" textAnchor="middle" fill={clk.textColor} fontSize="10" fontWeight="600" letterSpacing="1.5" opacity="0.85">{dateDisplayStr}</text>
                                            </g>
                                        )}
                                    </g>
                                );
                            };

                            return (
                                <div
                                    key={clk.id}
                                    data-element-id={clk.id}
                                    onPointerDown={(event) => handlePointerDown(event, element)}
                                    className={`absolute select-none ${
                                        isEraserMode
                                            ? "pointer-events-none cursor-none"
                                            : isSelected
                                            ? "cursor-move outline outline-2 outline-blue-500"
                                            : "cursor-move"
                                    }`}
                                    style={{
                                        left: clk.x,
                                        top: clk.y,
                                        width: clockW,
                                        height: clockH,
                                        transform: `rotate(${clk.rotation}deg) scale(${scale})`,
                                        transformOrigin: "center center",
                                        pointerEvents: isEraserMode ? "none" : "auto",
                                        opacity: clk.opacity !== undefined ? clk.opacity : 1,
                                        boxShadow: shadowMap[clk.shadow],
                                        borderRadius: clk.borderRadius,
                                        mask: hasClockMask ? `url(#eraser-mask-${clk.id})` : undefined,
                                        WebkitMask: hasClockMask ? `url(#eraser-mask-${clk.id})` : undefined,
                                    }}
                                >
                                    {/* Delete Button */}
                                    {isSelected && !isEraserMode && (
                                        <button
                                            type="button"
                                            onPointerDown={(event) => event.stopPropagation()}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                deleteElement(clk.id);
                                            }}
                                            className="absolute -right-7 -top-7 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                                            title="Delete clock"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}

                                    {/* SVG Root with Defs & Unified Eraser Mask */}
                                    <svg
                                        width={clockW}
                                        height={clockH}
                                        viewBox={`0 0 ${clockW} ${clockH}`}
                                        style={{
                                            display: "block",
                                            width: clockW,
                                            height: clockH,
                                            borderRadius: clk.borderRadius,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <defs>
                                            <mask id={`eraser-mask-${clk.id}`} maskUnits="userSpaceOnUse">
                                                <rect x="-5000" y="-5000" width="10000" height="10000" fill="white" />
                                                {clk.eraserPaths?.map((ep, idx) => (
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
                                                {liveClockEraserPath && (
                                                    <path
                                                        d={liveClockEraserPath}
                                                        stroke="black"
                                                        strokeWidth={eraserSettings.size / scale}
                                                        strokeOpacity={eraserSettings.opacity}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        fill="none"
                                                    />
                                                )}
                                            </mask>
                                            <filter id={`neon-glow-${clk.id}`} x="-30%" y="-30%" width="160%" height="160%">
                                                <feGaussianBlur stdDeviation="2.5" result="blur1" />
                                                <feGaussianBlur stdDeviation="6" result="blur2" />
                                                <feMerge>
                                                    <feMergeNode in="blur2" />
                                                    <feMergeNode in="blur1" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                            <linearGradient id={`titanium-${clk.id}`} x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#2c303c" />
                                                <stop offset="50%" stopColor="#1e222a" />
                                                <stop offset="100%" stopColor="#12151b" />
                                            </linearGradient>
                                            <linearGradient id={`glass-shine-${clk.id}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                                            </linearGradient>
                                            <linearGradient id={`flip-top-${clk.id}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#242733" />
                                                <stop offset="100%" stopColor="#1b1d26" />
                                            </linearGradient>
                                            <linearGradient id={`flip-bot-${clk.id}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#151720" />
                                                <stop offset="100%" stopColor="#0d0f14" />
                                            </linearGradient>
                                        </defs>

                                        <g mask={hasClockMask ? `url(#eraser-mask-${clk.id})` : undefined}>
                                            {renderClockFace()}
                                        </g>
                                    </svg>
                                </div>
                            );
                        }

                        // ── Timeline Element ──
                        if (element.type === "timeline") {
                            const tl = element as TimelineElement;
                            const tlCardW = tl.cardWidth ?? 480;
                            const tlCardMH = tl.cardMinHeight ?? 60;
                            const timelineW =
                                tl.theme === "horizontal-stepper"
                                    ? Math.max(tlCardW + 60, tl.items.length * (Math.min(tlCardW, 260) + (tl.spacing + 16)) + 40)
                                    : tlCardW + (tl.nodeSize ?? 32) + 32;
                            const timelineH =
                                tl.theme === "horizontal-stepper"
                                    ? tlCardMH + (tl.nodeSize ?? 32) + 80
                                    : Math.max(220, tl.items.length * ((tl.spacing ?? 24) + tlCardMH + (tl.nodeSize ?? 32) * 0.5) + 40);
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
                                    onPointerDown={(event) =>
                                        handlePointerDown(event, element)
                                    }
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
                                        opacity:
                                            tl.opacity !== undefined ? tl.opacity : 1,
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
                                                        strokeWidth={
                                                            eraserSettings.size / scale
                                                        }
                                                        strokeOpacity={
                                                            eraserSettings.opacity
                                                        }
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
                                            onPointerDown={(event) =>
                                                event.stopPropagation()
                                            }
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
                                                it.id === itemId
                                                    ? { ...it, ...updates }
                                                    : it
                                            );
                                            updateElement(tl.id, {
                                                items: nextItems,
                                            });
                                        }}
                                    />
                                </div>
                            );
                        }

                        // ── Card Element ──
                        if (element.type === "card") {
                            const card = element as CardElement;
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
                                    onPointerDown={(event) =>
                                        handlePointerDown(event, element)
                                    }
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
                                        opacity:
                                            card.opacity !== undefined ? card.opacity : 1,
                                        backgroundColor: "transparent",
                                        mask: hasCardMask
                                            ? `url(#eraser-mask-${card.id})`
                                            : undefined,
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
                                                        strokeWidth={
                                                            eraserSettings.size / scale
                                                        }
                                                        strokeOpacity={
                                                            eraserSettings.opacity
                                                        }
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
                                            onPointerDown={(event) =>
                                                event.stopPropagation()
                                            }
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
                                            updateElement(card.id, updates as any)
                                        }
                                    />
                                </div>
                            );
                        }

                        return null;

                    })}

                </div>

            </div>

        </section>
    );
}