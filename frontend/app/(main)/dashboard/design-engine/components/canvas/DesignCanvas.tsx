import type { PointerEvent as ReactPointerEvent } from "react";
import { useRef, useState, useEffect } from "react";

import DemoDashboardHeader from "../layout/DemoDashboardHeader";
import { CanvasBackground } from "./CanvasBackground";
import {
    CanvasTextElement,
    CanvasDrawElement,
    CanvasEraserElement,
    CanvasTableElement,
    CanvasClockElement,
    CanvasTimelineElement,
    CanvasCardElement,
    CanvasButtonElement,
    CanvasIconElement,
    CanvasImageElement,
    CanvasFormElement,
    CanvasGridElement,
    CanvasProgressElement,
} from "./elements";

import type {
    CanvasElement,
    DrawElement,
    PencilSettings,
    EraserSettings,
    EraserPath,
    BackgroundType,
    DashboardBackgroundSettings,
} from "../../types/elements";

import {
    pointsToSvgPath,
    createDrawFillLayer,
    canvasPointsToDrawLocal,
    canvasPointsToElementLocal,
    doesStrokeIntersectElement,
    getElementDimensions,
} from "../../utils/canvasUtils";

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
    isFillMode: boolean;
    backgroundSettings?: DashboardBackgroundSettings;
    onSelectBackground?: () => void;
    onFillDashboard: (color: string) => void;
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
    isFillMode,
    backgroundSettings,
    onSelectBackground,
    onFillDashboard,
}: DesignCanvasProps) {
    const designAreaRef = useRef<HTMLDivElement | null>(null);
        const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 1120 });
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
    const [, setClockTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setClockTick((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const canvas = designAreaRef.current;
        if (!canvas) return;

        const observer = new ResizeObserver(([entry]) => {
            setCanvasSize({
                width: entry.contentRect.width,
                height: entry.contentRect.height,
            });
        });
        observer.observe(canvas);
        return () => observer.disconnect();
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
                    } = getElementDimensions(el, {
                        width: designAreaRef.current?.clientWidth ?? 1200,
                        height: designAreaRef.current?.clientHeight ?? 1120,
                    });

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
                                el.type === "card" ||
                                el.type === "button" ||
                                el.type === "form" ||
                                el.type === "grid" ||
                                el.type === "progress"
                                    ? el.size
                                    : 100,
                        },
                        origin
                    );
                    const pathPoints =
                        el.type === "draw"
                            ? canvasPointsToDrawLocal(points, el)
                            : localPoints;
                    const intrinsicScale =
                        el.type === "draw"
                            ? Math.sqrt(
                                  (el.width / (el.pathWidth ?? el.width)) *
                                      (el.height / (el.pathHeight ?? el.height))
                              )
                            : 1;

                    if (
                        doesStrokeIntersectElement(
                            localPoints,
                            elW,
                            elH,
                            eraserRadiusLocal
                        )
                    ) {
                        const localPathData = pointsToSvgPath(pathPoints);
                        const newEraserPath: EraserPath = {
                            d: localPathData,
                            strokeWidth:
                                eraserSettings.size / scale / intrinsicScale,
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
            const raf = requestAnimationFrame(() => {
                setEraserPos(null);
                setIsErasing(false);
                setCurrentEraserPoints(null);
            });
            return () => cancelAnimationFrame(raf);
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

        if (
            element.type === "form" &&
            (event.target as HTMLElement).closest("input, textarea, select, button")
        ) {
            return;
        }

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

    const handleFillDrawElement = (
        event: ReactPointerEvent,
        element: DrawElement
    ) => {
        const rect = designAreaRef.current?.getBoundingClientRect();
        if (!rect) return;

        const canvasPoint = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
        const drawBoundaries = elements.filter(
            (candidate): candidate is DrawElement => candidate.type === "draw"
        );
        const selectedDraw = drawBoundaries.find(
            (candidate) => candidate.id === selectedElementId
        );
        const fillColor =
            selectedDraw?.fillColor ?? element.fillColor ?? "#ff0000";
        let openRegion: {
            element: DrawElement;
            fill: { dataUrl: string; reachesBounds: boolean };
        } | null = null;

        const candidatesInDrawOrder = [...drawBoundaries].reverse();
        const enclosedTargets = candidatesInDrawOrder
            .flatMap((candidate) => {
                const [localPoint] = canvasPointsToDrawLocal(
                    [canvasPoint],
                    candidate
                );
                const isolatedFill = createDrawFillLayer(
                    candidate,
                    localPoint,
                    fillColor,
                    [candidate]
                );
                if (!isolatedFill || isolatedFill.reachesBounds) return [];

                return [{
                    candidate,
                    localPoint,
                    area:
                        candidate.width *
                        candidate.height *
                        ((candidate.size ?? 100) / 100) ** 2,
                }];
            })
            .sort((a, b) => a.area - b.area);
        const fillTargets = enclosedTargets.length > 0
            ? enclosedTargets
            : candidatesInDrawOrder.map((candidate) => {
                  const [localPoint] = canvasPointsToDrawLocal(
                      [canvasPoint],
                      candidate
                  );
                  return { candidate, localPoint };
              });

        for (const { candidate, localPoint } of fillTargets) {
            const fillResult = createDrawFillLayer(
                candidate,
                localPoint,
                fillColor,
                drawBoundaries
            );
            if (!fillResult) continue;

            if (fillResult.reachesBounds) {
                openRegion ??= { element: candidate, fill: fillResult };
                continue;
            }

            setSelectedElementId(candidate.id);
            updateElement(candidate.id, {
                fillLayers: [
                    ...(candidate.fillLayers ?? []),
                    fillResult.dataUrl,
                ],
            });
            return;
        }

        if (openRegion) {
            const elementArea =
                openRegion.element.width *
                openRegion.element.height *
                ((openRegion.element.size ?? 100) / 100) ** 2;
            const parentCandidates = [...drawBoundaries]
                .filter(
                    (candidate) =>
                        candidate.id !== openRegion?.element.id &&
                        candidate.width *
                            candidate.height *
                            ((candidate.size ?? 100) / 100) ** 2 >
                            elementArea
                )
                .sort(
                    (a, b) =>
                        a.width * a.height * ((a.size ?? 100) / 100) ** 2 -
                        b.width * b.height * ((b.size ?? 100) / 100) ** 2
                );

            for (const parent of parentCandidates) {
                const [parentLocalPoint] = canvasPointsToDrawLocal(
                    [canvasPoint],
                    parent
                );
                const parentFill = createDrawFillLayer(
                    parent,
                    parentLocalPoint,
                    fillColor,
                    drawBoundaries
                );
                if (parentFill && !parentFill.reachesBounds) {
                    setSelectedElementId(parent.id);
                    updateElement(parent.id, {
                        fillLayers: [
                            ...(parent.fillLayers ?? []),
                            parentFill.dataUrl,
                        ],
                    });
                    return;
                }
            }

            onFillDashboard(fillColor);
            updateElement(openRegion.element.id, { fillLayers: [] });
        }
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
                const pathWidth = Math.max(24, Math.round(maxX - minX + pad * 2));
                const pathHeight = Math.max(24, Math.round(maxY - minY + pad * 2));
                const width = Math.max(
                    24,
                    Math.round(pathWidth * ((pencilSettings.widthScale ?? 100) / 100))
                );
                const height = Math.max(
                    24,
                    Math.round(pathHeight * ((pencilSettings.heightScale ?? 100) / 100))
                );
                const x = Math.max(0, elementX + Math.round((pathWidth - width) / 2));
                const y = Math.max(0, elementY + Math.round((pathHeight - height) / 2));

                const relativePoints = points.map((p) => ({
                    x: p.x - elementX,
                    y: p.y - elementY,
                }));

                const pathData = pointsToSvgPath(relativePoints);

                const newDrawElement: DrawElement = {
                    id: crypto.randomUUID(),
                    type: "draw",
                    serialNumber: elements.length + 1,
                    x,
                    y,
                    width,
                    height,
                    pathWidth,
                    pathHeight,
                    pathData,
                    strokeWidth: pencilSettings.strokeWidth,
                    opacity: pencilSettings.opacity,
                    color: pencilSettings.color,
                    fillColor: pencilSettings.fillColor ?? "#ff0000",
                    rotation: pencilSettings.rotation ?? 0,
                    size: pencilSettings.size ?? 100,
                    shadow: pencilSettings.shadow ?? "none",
                    shadowColor: pencilSettings.shadowColor ?? "#000000",
                    shadowBlur: pencilSettings.shadowBlur ?? 12,
                    shadowOffsetX: pencilSettings.shadowOffsetX ?? 0,
                    shadowOffsetY: pencilSettings.shadowOffsetY ?? 4,
                    shadowSpread: pencilSettings.shadowSpread ?? 0,
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
                    <CanvasEraserElement
                        isEraserMode={isEraserMode}
                        eraserPos={eraserPos}
                        eraserSettings={eraserSettings}
                    />

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
                                                if (element.type === "form") {
                                                    return (
                                                        <CanvasFormElement
                                                            key={element.id}
                                                            element={element}
                                                            isSelected={isSelected}
                                                            isEraserMode={isEraserMode}
                                                            isErasing={isErasing}
                                                            currentEraserPoints={currentEraserPoints}
                                                            eraserSettings={eraserSettings}
                                                            canvasWidth={canvasSize.width}
                                                            canvasHeight={canvasSize.height}
                                                            handlePointerDown={handlePointerDown}
                                                            deleteElement={deleteElement}
                                                        />
                                                    );
                                                }

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
                                    isFillMode={isFillMode}
                                    isErasing={isErasing}
                                    currentEraserPoints={currentEraserPoints}
                                    eraserSettings={eraserSettings}
                                    handlePointerDown={handlePointerDown}
                                    onFill={handleFillDrawElement}
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

                        // ── Button / Link Element ──
                        if (element.type === "button") {
                            return (
                                <CanvasButtonElement
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

                        // ── Icon Element ──
                        if (element.type === "icon") {
                            return (
                                <CanvasIconElement
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

                        // ── Image Element ──
                        if (element.type === "image") {
                            return (
                                <CanvasImageElement
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

                        // ── Grid Element ──
                        if (element.type === "grid") {
                            return (
                                <CanvasGridElement
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

                        // ── Progress Element ──
                        if (element.type === "progress") {
                            return (
                                <CanvasProgressElement
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