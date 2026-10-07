"use client";

import { useState } from "react";

import DesignEngineHeader from "./components/DesignEngineHeader";
import ElementsPanel from "./components/ElementsPanel";
import DesignCanvas from "./components/DesignCanvas";
import PropertiesPanel from "./components/PropertiesPanel";
import LayersPanel from "./components/LayersPanel";

// Re-export element types for backward compatibility
export type {
    EraserPath,
    TextElement,
    DrawElement,
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
export type { TimelineElement } from "./types/timeline";
export type { CardElement } from "./types/card";

import type {
    CanvasElement,
    DrawElement,
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
        setIsEraserMode(false);
        setSelectedElementId(null);
    };

    const updateBackgroundSettings = (
        updates: Partial<DashboardBackgroundSettings>
    ) => {
        setBackgroundSettings((prev) => ({ ...prev, ...updates }));
    };

    const handleSelectElementId = (id: string | null) => {
        setSelectedElementId(id);
        if (id !== null) {
            setIsBackgroundMode(false);
        }
    };

    const toggleDrawMode = () => {
        setIsDrawMode((prev) => {
            const next = !prev;
            if (next) {
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
                setIsDrawMode(false);
                setIsBackgroundMode(false);
                setSelectedElementId(null);
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
        setIsEraserMode(false);
        const newTextElement = createTextElement(elements.length + 1);
        setElements((prev) => [...prev, newTextElement]);
        setSelectedElementId(newTextElement.id);
    };

    const addDrawElement = (newDrawElement: DrawElement) => {
        setElements((prev) => [...prev, newDrawElement]);
        setSelectedElementId(newDrawElement.id);
    };

    const addTableElement = () => {
        setIsDrawMode(false);
        setIsEraserMode(false);
        const newTableElement = createTableElement(elements.length + 1);
        setElements((prev) => [...prev, newTableElement]);
        setSelectedElementId(newTableElement.id);
    };

    const addClockElement = () => {
        setIsDrawMode(false);
        setIsEraserMode(false);
        const newClockElement = createClockElement(elements.length + 1);
        setElements((prev) => [...prev, newClockElement]);
        setSelectedElementId(newClockElement.id);
    };

    const addTimelineElement = () => {
        setIsDrawMode(false);
        setIsEraserMode(false);
        const newTimelineElement = createTimelineElement(elements.length + 1);
        setElements((prev) => [...prev, newTimelineElement]);
        setSelectedElementId(newTimelineElement.id);
    };

    const addCardElement = () => {
        setIsDrawMode(false);
        setIsEraserMode(false);
        const newCardElement = createCardElement(elements.length + 1);
        setElements((prev) => [...prev, newCardElement]);
        setSelectedElementId(newCardElement.id);
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
                        backgroundSettings={backgroundSettings}
                        onSelectBackground={selectBackgroundMode}
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