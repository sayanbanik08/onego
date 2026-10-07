import type { PointerEvent as ReactPointerEvent } from "react";
import { useRef, useState, useEffect } from "react";

import DemoDashboardHeader from "./DemoDashboardHeader";
import { CanvasBackground } from "./canvas/CanvasBackground";
import {
    CanvasTextElement,
    CanvasDrawElement,
    CanvasTableElement,
    CanvasClockElement,
    CanvasTimelineElement,
    CanvasCardElement,
} from "./canvas/elements";

import type {
    CanvasElement,
    DrawElement,
    TextElement,
    TableElement,
    ClockElement,
    PencilSettings,
    EraserSettings,
    EraserPath,
    BackgroundType,
    DashboardBackgroundSettings,
} from "../types/elements";
import type { TimelineElement } from "../types/timeline";
import type { CardElement } from "../types/card";
import {
    pointsToSvgPath,
    canvasPointsToElementLocal,
    doesStrokeIntersectElement,
    getElementDimensions,
} from "../utils/canvasUtils";

export type { BackgroundType, DashboardBackgroundSettings };

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
    pencilSettings: PencilSettings;
    onAddDrawElement: (element: DrawElement) => void;
    isEraserMode: boolean;
    eraserSettings: EraserSettings;
    backgroundSettings?: DashboardBackgroundSettings;
    onSelectBackground?: () => void;
};

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
    const [eraserPos, setEraserPos] = useState<{ x: number; y: number } | null>(
        null
    );
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
                    const {
                        width: elW,
                        height: elH,
                        scale,
                        origin,
                    } = getElementDimensions(el);

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
                            size:
                                el.type === "draw" ||
                                el.type === "table" ||
                                el.type === "clock" ||
                                el.type === "timeline" ||
                                el.type === "card"
                                    ? el.size
                                    : 100,
                        },
                        origin
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

    // ── Element drag ──
    const handlePointerDown = (
        event: ReactPointerEvent,
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

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            const newX = Math.max(0, initialX + deltaX);
            const newY = Math.max(0, initialY + deltaY);

            updateElementPosition(element.id, newX, newY);
        };

        const handlePointerUp = () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
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

        const rect = designAreaRef.current?.getBoundingClientRect();
        if (!rect) return;

        const startX = event.clientX - rect.left;
        const startY = event.clientY - rect.top;

        let points = [{ x: startX, y: startY }];
        setCurrentPoints(points);

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const currentRect =
                designAreaRef.current?.getBoundingClientRect();
            if (!currentRect) return;

            const curX = moveEvent.clientX - currentRect.left;
            const curY = moveEvent.clientY - currentRect.top;

            points = [...points, { x: curX, y: curY }];
            setCurrentPoints(points);
        };

        const handlePointerUp = () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);

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

                const pad = Math.max(12, pencilSettings.strokeWidth);
                const elementX = Math.max(0, Math.round(minX - pad));
                const elementY = Math.max(0, Math.round(minY - pad));
                const width = Math.max(24, Math.round(maxX - minX + pad * 2));
                const height = Math.max(24, Math.round(maxY - minY + pad * 2));

                const relativePoints = points.map((p) => ({
                    x: p.x - elementX,
                    y: p.y - elementY,
                }));

                const pathData = pointsToSvgPath(relativePoints);

                const newDrawElement: DrawElement = {
                    id: crypto.randomUUID(),
                    type: "draw",
                    serialNumber: elements.length + 1,
                    x: elementX,
                    y: elementY,
                    width,
                    height,
                    pathData,
                    strokeWidth: pencilSettings.strokeWidth,
                    opacity: pencilSettings.opacity,
                    color: pencilSettings.color,
                    rotation: pencilSettings.rotation ?? 0,
                    size: pencilSettings.size ?? 100,
                };

                onAddDrawElement(newDrawElement);
            }

            setCurrentPoints(null);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
    };

    return (
        <section className="min-h-0 flex-1 overflow-y-auto">
            <CanvasBackground
                backgroundSettings={backgroundSettings}
                isDrawMode={isDrawMode}
                isEraserMode={isEraserMode}
                onSelectBackground={onSelectBackground}
            >
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
                                    Math.min(
                                        rect.width,
                                        event.clientX - rect.left
                                    )
                                );
                                const curY = Math.max(
                                    0,
                                    Math.min(
                                        rect.height,
                                        event.clientY - rect.top
                                    )
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
                    className={`relative min-h-[1120px] overflow-hidden ${
                        isEraserMode
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
                                d={pointsToSvgPath(currentPoints)}
                                fill="none"
                                stroke={pencilSettings.color}
                                strokeWidth={pencilSettings.strokeWidth}
                                strokeOpacity={pencilSettings.opacity}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}

                    {elements.map((element) => {
                        const isSelected = selectedElementId === element.id;

                        // ── Text Element ──
                        if (element.type === "text") {
                            return (
                                <CanvasTextElement
                                    key={element.id}
                                    element={element}
                                    isSelected={isSelected}
                                    isEraserMode={isEraserMode}
                                    isErasing={isErasing}
                                    currentEraserPoints={currentEraserPoints}
                                    eraserSettings={eraserSettings}
                                    handlePointerDown={handlePointerDown}
                                    deleteElement={deleteElement}
                                />
                            );
                        }

                        // ── Draw Element ──
                        if (element.type === "draw") {
                            return (
                                <CanvasDrawElement
                                    key={element.id}
                                    element={element}
                                    isSelected={isSelected}
                                    isEraserMode={isEraserMode}
                                    isErasing={isErasing}
                                    currentEraserPoints={currentEraserPoints}
                                    eraserSettings={eraserSettings}
                                    handlePointerDown={handlePointerDown}
                                    deleteElement={deleteElement}
                                />
                            );
                        }

                        // ── Table Element ──
                        if (element.type === "table") {
                            return (
                                <CanvasTableElement
                                    key={element.id}
                                    element={element}
                                    isSelected={isSelected}
                                    isEraserMode={isEraserMode}
                                    isErasing={isErasing}
                                    currentEraserPoints={currentEraserPoints}
                                    eraserSettings={eraserSettings}
                                    handlePointerDown={handlePointerDown}
                                    deleteElement={deleteElement}
                                    editingCell={editingCell}
                                    setEditingCell={setEditingCell}
                                    updateElement={updateElement}
                                />
                            );
                        }

                        // ── Clock Element ──
                        if (element.type === "clock") {
                            return (
                                <CanvasClockElement
                                    key={element.id}
                                    element={element}
                                    isSelected={isSelected}
                                    isEraserMode={isEraserMode}
                                    isErasing={isErasing}
                                    currentEraserPoints={currentEraserPoints}
                                    eraserSettings={eraserSettings}
                                    handlePointerDown={handlePointerDown}
                                    deleteElement={deleteElement}
                                />
                            );
                        }

                        // ── Timeline Element ──
                        if (element.type === "timeline") {
                            return (
                                <CanvasTimelineElement
                                    key={element.id}
                                    element={element}
                                    isSelected={isSelected}
                                    isEraserMode={isEraserMode}
                                    isErasing={isErasing}
                                    currentEraserPoints={currentEraserPoints}
                                    eraserSettings={eraserSettings}
                                    handlePointerDown={handlePointerDown}
                                    deleteElement={deleteElement}
                                    updateElement={updateElement}
                                />
                            );
                        }

                        // ── Card Element ──
                        if (element.type === "card") {
                            return (
                                <CanvasCardElement
                                    key={element.id}
                                    element={element}
                                    isSelected={isSelected}
                                    isEraserMode={isEraserMode}
                                    isErasing={isErasing}
                                    currentEraserPoints={currentEraserPoints}
                                    eraserSettings={eraserSettings}
                                    handlePointerDown={handlePointerDown}
                                    deleteElement={deleteElement}
                                    updateElement={updateElement}
                                />
                            );
                        }

                        return null;
                    })}
                </div>
            </CanvasBackground>
        </section>
    );
}