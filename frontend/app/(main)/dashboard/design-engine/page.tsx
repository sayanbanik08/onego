"use client";

import { useState } from "react";

import DesignEngineHeader from "./components/layout/DesignEngineHeader";
import ElementsPanel from "./components/layout/ElementsPanel";
import DesignCanvas from "./components/canvas/DesignCanvas";
import PropertiesPanel from "./components/layout/PropertiesPanel";
import LayersPanel from "./components/layout/LayersPanel";

// Re-export element types for backward compatibility
export type {
    EraserPath,
    TextElement,
    DrawElement,
    DrawShapeType,
    TablePreset,
    TableElement,
    ClockDesign,
    ClockTimeMode,
    ClockDateMode,
    ClockElement,
    CanvasElement,
    PencilSettings,
    EraserSettings,
    BackgroundType,
    DashboardBackgroundSettings,
} from "./types";
import {
    createDrawShapePath,
    isClosedDrawShape,
} from "./utils/drawShapes";
export type { TimelineElement } from "./types/timeline";
export type { CardElement } from "./types/card";
export type { ButtonElement } from "./types/button";
export type { IconElement } from "./types/icon";
export type { ImageElement } from "./types/image";
export type { GridElement } from "./types/grid";
export type { ProgressElement } from "./types/progress";

import type {
    CanvasElement,
    DrawElement,
    DrawShapeType,
    PencilSettings,
    EraserSettings,
    DashboardBackgroundSettings,
} from "./types";

import {
    DEFAULT_PENCIL_SETTINGS,
    DEFAULT_ERASER_SETTINGS,
    DEFAULT_BACKGROUND_SETTINGS,
    createTextElement,
    createTableElement,
    createClockElement,
    createTimelineElement,
    createCardElement,
    createButtonElement,
    createIconElement,
    createImageElement,
    createFormElement,
    createGridElement,
    createProgressElement,
} from "./constants/defaults";

export default function DesignEnginePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isElementsMinimised, setIsElementsMinimised] = useState(false);
    const [isElementsFloating, setIsElementsFloating] = useState(false);
    const [isLayersMinimised, setIsLayersMinimised] = useState(false);

    const [floatingPosition, setFloatingPosition] = useState({
        x: 20,
        y: 80,
    });

    const [isPropertiesMenuOpen, setIsPropertiesMenuOpen] = useState(false);
    const [isPropertiesMinimised, setIsPropertiesMinimised] = useState(false);
    const [isPropertiesFloating, setIsPropertiesFloating] = useState(false);

    const [propertiesFloatingPosition, setPropertiesFloatingPosition] =
        useState({
            x: 20,
            y: 80,
        });

    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(
        null
    );

    const [isDrawMode, setIsDrawMode] = useState(false);
    const [isFillMode, setIsFillMode] = useState(false);
    const [pencilSettings, setPencilSettings] =
        useState<PencilSettings>(DEFAULT_PENCIL_SETTINGS);

    const [isEraserMode, setIsEraserMode] = useState(false);
    const [eraserSettings, setEraserSettings] =
        useState<EraserSettings>(DEFAULT_ERASER_SETTINGS);

    // 🎨 Dashboard Background Settings
    const [backgroundSettings, setBackgroundSettings] =
        useState<DashboardBackgroundSettings>(DEFAULT_BACKGROUND_SETTINGS);
    const [isBackgroundMode, setIsBackgroundMode] = useState(false);

    const selectBackgroundMode = () => {
        setIsBackgroundMode(true);
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        setSelectedElementId(null);
    };

    const updateBackgroundSettings = (
        updates: Partial<DashboardBackgroundSettings>
    ) => {
        setBackgroundSettings((prev) => ({ ...prev, ...updates }));
    };

    const fillDashboard = (color: string) => {
        updateBackgroundSettings({ type: "solid", color, showGridDots: false });
    };

    const handleSelectElementId = (id: string | null) => {
        setSelectedElementId(id);
        if (id !== null) {
            setIsBackgroundMode(false);
            if (elements.find((element) => element.id === id)?.type !== "draw") {
                setIsFillMode(false);
            }
        }
    };

    const toggleDrawMode = () => {
        setIsDrawMode((prev) => {
            const next = !prev;
            if (next) {
                setIsFillMode(false);
                setIsEraserMode(false);
                setIsBackgroundMode(false);
                setSelectedElementId(null);
            }
            return next;
        });
    };

    const toggleEraserMode = () => {
        setIsEraserMode((prev) => {
            const next = !prev;
            if (next) {
                setIsFillMode(false);
                setIsDrawMode(false);
                setIsBackgroundMode(false);
                setSelectedElementId(null);
            }
            return next;
        });
    };

    const toggleFillMode = () => {
        setIsFillMode((prev) => {
            const next = !prev;
            if (next) {
                setIsDrawMode(false);
                setIsEraserMode(false);
                setIsBackgroundMode(false);
            }
            return next;
        });
    };

    const updatePencilSettings = (updates: Partial<PencilSettings>) => {
        setPencilSettings((prev) => ({ ...prev, ...updates }));
    };

    const updateEraserSettings = (updates: Partial<EraserSettings>) => {
        setEraserSettings((prev) => ({ ...prev, ...updates }));
    };

    const addTextElement = () => {
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        const newTextElement = createTextElement(elements.length + 1);
        setElements((prev) => [...prev, newTextElement]);
        setSelectedElementId(newTextElement.id);
    };

    const addDrawElement = (newDrawElement: DrawElement) => {
        setElements((prev) => [...prev, newDrawElement]);
        setSelectedElementId(newDrawElement.id);
    };

    const addDrawShape = (shapeType: DrawShapeType) => {
        const pathWidth = 180;
        const pathHeight = 140;
        const width = Math.max(
            24,
            Math.round(pathWidth * ((pencilSettings.widthScale ?? 100) / 100))
        );
        const height = Math.max(
            24,
            Math.round(pathHeight * ((pencilSettings.heightScale ?? 100) / 100))
        );
        const offset = (elements.length % 6) * 24;
        const newShape: DrawElement = {
            id: crypto.randomUUID(),
            type: "draw",
            serialNumber: elements.length + 1,
            x: 100 + offset,
            y: 120 + offset,
            width,
            height,
            pathWidth,
            pathHeight,
            pathData: createDrawShapePath(shapeType, pathWidth, pathHeight),
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
            shapeType,
            shapeClosed: isClosedDrawShape(shapeType),
        };

        setElements((prev) => [...prev, newShape]);
        setSelectedElementId(newShape.id);
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        setIsBackgroundMode(false);
    };

    const addTableElement = () => {
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        const newTableElement = createTableElement(elements.length + 1);
        setElements((prev) => [...prev, newTableElement]);
        setSelectedElementId(newTableElement.id);
    };

    const addClockElement = () => {
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        const newClockElement = createClockElement(elements.length + 1);
        setElements((prev) => [...prev, newClockElement]);
        setSelectedElementId(newClockElement.id);
    };

    const addTimelineElement = () => {
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        const newTimelineElement = createTimelineElement(elements.length + 1);
        setElements((prev) => [...prev, newTimelineElement]);
        setSelectedElementId(newTimelineElement.id);
    };

    const addCardElement = () => {
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        const newCardElement = createCardElement(elements.length + 1);
        setElements((prev) => [...prev, newCardElement]);
        setSelectedElementId(newCardElement.id);
    };

    const addButtonElement = () => {
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        const newButtonElement = createButtonElement(elements.length + 1);
        setElements((prev) => [...prev, newButtonElement]);
        setSelectedElementId(newButtonElement.id);
    };

    const addIconElement = () => {
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        const newIconElement = createIconElement(elements.length + 1);
        setElements((prev) => [...prev, newIconElement]);
        setSelectedElementId(newIconElement.id);
    };

    const addImageElement = () => {
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        const newImageElement = createImageElement(elements.length + 1);
        setElements((prev) => [...prev, newImageElement]);
        setSelectedElementId(newImageElement.id);
    };

    const addFormElement = () => {
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        const newFormElement = createFormElement(elements.length + 1);
        setElements((prev) => [...prev, newFormElement]);
        setSelectedElementId(newFormElement.id);
    };

    const addGridElement = () => {
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        const newGridElement = createGridElement(elements.length + 1);
        setElements((prev) => [...prev, newGridElement]);
        setSelectedElementId(newGridElement.id);
    };

    const addProgressElement = () => {
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        const newProgressElement = createProgressElement(elements.length + 1);
        setElements((prev) => [...prev, newProgressElement]);
        setSelectedElementId(newProgressElement.id);
    };

    const selectedElement =
        elements.find((element) => element.id === selectedElementId) ?? null;

    const updateElement = (
        id: string,
        updates: Partial<CanvasElement>
    ) => {
        setElements((prev) =>
            prev.map((element) =>
                element.id === id
                    ? ({ ...element, ...updates } as CanvasElement)
                    : element
            )
        );
    };

    const deleteElement = (id: string) => {
        setElements((prev) => {
            const remainingElements = prev.filter(
                (element) => element.id !== id
            );

            return remainingElements.map((element, index) => ({
                ...element,
                serialNumber: index + 1,
            }));
        });

        setSelectedElementId(null);
    };

    const updateElementPosition = (
        id: string,
        x: number,
        y: number
    ) => {
        setElements((prev) =>
            prev.map((element) =>
                element.id === id
                    ? ({ ...element, x, y } as CanvasElement)
                    : element
            )
        );
    };

    const reorderElements = (
        sourceId: string,
        targetId: string
    ) => {
        setElements((prev) => {
            const sourceIndex = prev.findIndex(
                (element) => element.id === sourceId
            );

            const targetIndex = prev.findIndex(
                (element) => element.id === targetId
            );

            if (
                sourceIndex === -1 ||
                targetIndex === -1 ||
                sourceIndex === targetIndex
            ) {
                return prev;
            }

            const next = [...prev];

            const [movedElement] = next.splice(sourceIndex, 1);

            next.splice(targetIndex, 0, movedElement);

            return next;
        });
    };

    return (
        <main className="relative h-screen overflow-hidden bg-black text-white">
            {/* Header */}
            <DesignEngineHeader />

            {/* Editor Area */}
            <div className="flex h-[calc(100vh-4rem)] min-h-0">
                {/* Left Panel */}
                <ElementsPanel
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    isElementsMinimised={isElementsMinimised}
                    setIsElementsMinimised={setIsElementsMinimised}
                    isElementsFloating={isElementsFloating}
                    setIsElementsFloating={setIsElementsFloating}
                    floatingPosition={floatingPosition}
                    setFloatingPosition={setFloatingPosition}
                    onAddText={addTextElement}
                    onToggleDraw={toggleDrawMode}
                    isDrawMode={isDrawMode}
                    onToggleEraser={toggleEraserMode}
                    isEraserMode={isEraserMode}
                    onAddTable={addTableElement}
                    onAddClock={addClockElement}
                    onAddTimeline={addTimelineElement}
                    onAddCard={addCardElement}
                    onAddButton={addButtonElement}
                    onAddIcon={addIconElement}
                    onAddImage={addImageElement}
                    onAddForm={addFormElement}
                    onAddGrid={addGridElement}
                    onAddProgress={addProgressElement}
                    onSelectBackground={selectBackgroundMode}
                    isBackgroundMode={isBackgroundMode}
                />

                {/* Center Area */}
                <div className="flex min-w-0 min-h-0 flex-1 flex-col">
                    {/* Canvas */}
                    <DesignCanvas
                        elements={elements}
                        selectedElementId={selectedElementId}
                        setSelectedElementId={handleSelectElementId}
                        deleteElement={deleteElement}
                        updateElementPosition={updateElementPosition}
                        updateElement={updateElement}
                        isDrawMode={isDrawMode}
                        pencilSettings={pencilSettings}
                        onAddDrawElement={addDrawElement}
                        isEraserMode={isEraserMode}
                        eraserSettings={eraserSettings}
                        isFillMode={isFillMode}
                        backgroundSettings={backgroundSettings}
                        onSelectBackground={selectBackgroundMode}
                        onFillDashboard={fillDashboard}
                    />

                    {/* Bottom Layers Dock */}
                    <LayersPanel
                        elements={elements}
                        selectedElementId={selectedElementId}
                        setSelectedElementId={handleSelectElementId}
                        reorderElements={reorderElements}
                        isMinimised={isLayersMinimised}
                        setIsMinimised={setIsLayersMinimised}
                    />
                </div>

                {/* Right Panel */}
                <PropertiesPanel
                    isMenuOpen={isPropertiesMenuOpen}
                    setIsMenuOpen={setIsPropertiesMenuOpen}
                    isPropertiesMinimised={isPropertiesMinimised}
                    setIsPropertiesMinimised={setIsPropertiesMinimised}
                    isPropertiesFloating={isPropertiesFloating}
                    setIsPropertiesFloating={setIsPropertiesFloating}
                    floatingPosition={propertiesFloatingPosition}
                    setFloatingPosition={setPropertiesFloatingPosition}
                    selectedElement={selectedElement}
                    updateElement={updateElement}
                    isDrawMode={isDrawMode}
                    isFillMode={isFillMode}
                    onToggleFillMode={toggleFillMode}
                    onAddShape={addDrawShape}
                    pencilSettings={pencilSettings}
                    updatePencilSettings={updatePencilSettings}
                    elementsCount={elements.length}
                    isEraserMode={isEraserMode}
                    eraserSettings={eraserSettings}
                    updateEraserSettings={updateEraserSettings}
                    backgroundSettings={backgroundSettings}
                    updateBackgroundSettings={updateBackgroundSettings}
                    isBackgroundMode={isBackgroundMode}
                />
            </div>
        </main>
    );
}