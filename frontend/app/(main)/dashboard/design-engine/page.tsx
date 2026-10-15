"use client";

import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { usePathname, useRouter } from "next/navigation";

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
export type { IconElement } from "./types/icon-types";
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
import type { CanvasDocument, DesignWorkspace } from "./types/workspace";
import type { NavigationElement } from "./types/navigation";

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
    createNavigationElement,
} from "./constants/defaults";
import {
    DESIGN_WORKSPACE_STORAGE_KEY,
    createCanvasDocument,
    loadDesignWorkspace,
    saveDesignWorkspace,
} from "./utils/designWorkspace";

const DESIGN_ENGINE_PATH = "/dashboard/design-engine";

function getCanvasIdFromPath(pathname: string) {
    const prefix = `${DESIGN_ENGINE_PATH}/`;
    if (!pathname.startsWith(prefix)) return null;

    try {
        return decodeURIComponent(pathname.slice(prefix.length));
    } catch {
        return null;
    }
}

export default function DesignEnginePage() {
    const pathname = usePathname();
    const router = useRouter();
    const routeCanvasId = getCanvasIdFromPath(pathname);

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

    const [workspace, setWorkspace] = useState<DesignWorkspace | null>(null);
    const [hasLoadedWorkspace, setHasLoadedWorkspace] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"saved" | "error">("saved");
    const workspaceRef = useRef<DesignWorkspace | null>(null);
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

    const [isBackgroundMode, setIsBackgroundMode] = useState(false);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setWorkspace(loadDesignWorkspace());
            setHasLoadedWorkspace(true);
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        workspaceRef.current = workspace;
    }, [workspace]);

    useEffect(() => {
        if (!hasLoadedWorkspace || !workspace) return;

        const timeoutId = window.setTimeout(() => {
            setSaveStatus(saveDesignWorkspace(workspace) ? "saved" : "error");
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [hasLoadedWorkspace, workspace]);

    useEffect(() => {
        const saveOnPageHide = () => {
            if (workspaceRef.current) {
                saveDesignWorkspace(workspaceRef.current);
            }
        };

        window.addEventListener("pagehide", saveOnPageHide);
        return () => window.removeEventListener("pagehide", saveOnPageHide);
    }, []);

    useEffect(() => {
        const syncWorkspaceFromOtherTab = (event: StorageEvent) => {
            if (event.key !== DESIGN_WORKSPACE_STORAGE_KEY) return;

            const nextWorkspace = loadDesignWorkspace();
            workspaceRef.current = nextWorkspace;
            setWorkspace(nextWorkspace);
        };

        window.addEventListener("storage", syncWorkspaceFromOtherTab);
        return () => window.removeEventListener("storage", syncWorkspaceFromOtherTab);
    }, []);

    useEffect(() => {
        if (!hasLoadedWorkspace || !workspace) return;

        const requestedCanvas = workspace.canvases.find(
            (canvas) => canvas.id === routeCanvasId
        );

        if (requestedCanvas) {
            if (workspace.activeCanvasId !== requestedCanvas.id) {
                const timeoutId = window.setTimeout(() => {
                    setWorkspace((current) => current &&
                        current.activeCanvasId !== requestedCanvas.id
                        ? { ...current, activeCanvasId: requestedCanvas.id }
                        : current
                    );
                }, 0);

                return () => window.clearTimeout(timeoutId);
            }
            return;
        }

        if (workspace.activeCanvasId) {
            saveDesignWorkspace(workspace);
            router.replace(
                `${DESIGN_ENGINE_PATH}/${encodeURIComponent(workspace.activeCanvasId)}`
            );
        }
    }, [hasLoadedWorkspace, routeCanvasId, router, workspace]);

    const activeCanvas = workspace?.canvases.find(
        (canvas) => canvas.id === routeCanvasId
    ) ?? workspace?.canvases.find(
        (canvas) => canvas.id === workspace.activeCanvasId
    ) ?? workspace?.canvases[0] ?? null;
    const elements = activeCanvas?.elements ?? [];
    const backgroundSettings =
        activeCanvas?.backgroundSettings ?? DEFAULT_BACKGROUND_SETTINGS;

    const updateActiveCanvas = (
        update: (canvas: CanvasDocument) => CanvasDocument
    ) => {
        setWorkspace((current) => {
            if (!current) return current;
            const targetCanvasId = current.canvases.find(
                (canvas) => canvas.id === routeCanvasId
            )?.id ?? current.activeCanvasId;

            return {
                ...current,
                activeCanvasId: targetCanvasId,
                canvases: current.canvases.map((canvas) =>
                    canvas.id === targetCanvasId ? update(canvas) : canvas
                ),
            };
        });
    };

    const setElements: Dispatch<SetStateAction<CanvasElement[]>> = (update) => {
        updateActiveCanvas((canvas) => ({
            ...canvas,
            elements: typeof update === "function"
                ? update(canvas.elements)
                : update,
        }));
    };

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
        updateActiveCanvas((canvas) => ({
            ...canvas,
            backgroundSettings: { ...canvas.backgroundSettings, ...updates },
        }));
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

    const addNavigationElement = () => {
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        setIsBackgroundMode(false);
        const navigation = workspace?.sharedNavigation ?? createNavigationElement(
            1,
            workspace?.canvases ?? []
        );
        setWorkspace((current) => current && !current.sharedNavigation
            ? { ...current, sharedNavigation: navigation }
            : current
        );
        setSelectedElementId(navigation.id);
    };

    const navigateToCanvas = (canvasId: string) => {
        const current = workspaceRef.current;
        if (!current?.canvases.some((canvas) => canvas.id === canvasId)) return;

        const nextWorkspace = { ...current, activeCanvasId: canvasId };
        workspaceRef.current = nextWorkspace;
        saveDesignWorkspace(nextWorkspace);
        setWorkspace(nextWorkspace);
        setSelectedElementId(current.sharedNavigation?.id ?? null);
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        setIsBackgroundMode(false);
        router.push(`${DESIGN_ENGINE_PATH}/${encodeURIComponent(canvasId)}`);
    };

    const createCanvas = (name: string) => {
        const current = workspaceRef.current;
        if (!current) return;

        const canvas = createCanvasDocument(name);
        const navigation = current.sharedNavigation ?? createNavigationElement(
            1,
            current.canvases
        );
        const link = {
            id: crypto.randomUUID(),
            label: canvas.name,
            href: "",
            canvasId: canvas.id,
        };
        const nextWorkspace: DesignWorkspace = {
            ...current,
            activeCanvasId: canvas.id,
            canvases: [...current.canvases, canvas],
            sharedNavigation: {
                ...navigation,
                links: [...navigation.links, link],
            },
        };

        workspaceRef.current = nextWorkspace;
        saveDesignWorkspace(nextWorkspace);
        setWorkspace(nextWorkspace);
        setSelectedElementId(navigation.id);
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        setIsBackgroundMode(false);
        router.push(`${DESIGN_ENGINE_PATH}/${encodeURIComponent(canvas.id)}`);
    };

    const deleteActiveCanvas = () => {
        const current = workspaceRef.current;
        if (!current || current.canvases.length <= 1) return;
        const deletingCanvasId = current.canvases.find(
            (canvas) => canvas.id === routeCanvasId
        )?.id ?? current.activeCanvasId;

        const remainingCanvases = current.canvases.filter(
            (canvas) => canvas.id !== deletingCanvasId
        );
        const nextCanvas = remainingCanvases[0];
        const nextWorkspace: DesignWorkspace = {
            ...current,
            activeCanvasId: nextCanvas.id,
            canvases: remainingCanvases,
            sharedNavigation: current.sharedNavigation
                ? {
                    ...current.sharedNavigation,
                    links: current.sharedNavigation.links.filter(
                        (link) => link.canvasId !== deletingCanvasId
                    ),
                }
                : null,
        };

        workspaceRef.current = nextWorkspace;
        setWorkspace(nextWorkspace);
        setSelectedElementId(nextWorkspace.sharedNavigation?.id ?? null);
        setIsDrawMode(false);
        setIsFillMode(false);
        setIsEraserMode(false);
        setIsBackgroundMode(false);
        setSaveStatus(saveDesignWorkspace(nextWorkspace) ? "saved" : "error");
        router.replace(
            `${DESIGN_ENGINE_PATH}/${encodeURIComponent(nextCanvas.id)}`
        );
    };

    const saveWorkspace = () => {
        const current = workspaceRef.current;
        if (current) {
            setSaveStatus(saveDesignWorkspace(current) ? "saved" : "error");
        }
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
        workspace?.sharedNavigation?.id === selectedElementId
            ? workspace.sharedNavigation
            : elements.find((element) => element.id === selectedElementId) ?? null;

    const updateElement = (
        id: string,
        updates: Partial<CanvasElement>
    ) => {
        if (workspace?.sharedNavigation?.id === id) {
            setWorkspace((current) => current?.sharedNavigation
                ? {
                    ...current,
                    sharedNavigation: {
                        ...current.sharedNavigation,
                        ...updates,
                    } as NavigationElement,
                }
                : current
            );
            return;
        }

        setElements((prev) =>
            prev.map((element) =>
                element.id === id
                    ? ({ ...element, ...updates } as CanvasElement)
                    : element
            )
        );
    };

    const deleteElement = (id: string) => {
        if (workspace?.sharedNavigation?.id === id) {
            setWorkspace((current) => current
                ? { ...current, sharedNavigation: null }
                : current
            );
            setSelectedElementId(null);
            return;
        }

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
        if (workspace?.sharedNavigation?.id === id) {
            setWorkspace((current) => current?.sharedNavigation
                ? {
                    ...current,
                    sharedNavigation: {
                        ...current.sharedNavigation,
                        x,
                        y,
                    },
                }
                : current
            );
            return;
        }

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

    const handleCanvasSelection = (canvasId: string) => {
        navigateToCanvas(canvasId);
    };

    const canvasElements = workspace?.sharedNavigation
        ? [workspace.sharedNavigation, ...elements]
        : elements;

    if (!hasLoadedWorkspace || !workspace || !activeCanvas) {
        return (
            <main className="flex h-screen items-center justify-center bg-black text-sm text-gray-400">
                Loading Design Engine...
            </main>
        );
    }

    return (
        <main className="relative h-screen overflow-hidden bg-black text-white">
            {/* Header */}
            <DesignEngineHeader
                canvasName={activeCanvas.name}
                canvases={workspace.canvases}
                activeCanvasId={activeCanvas.id}
                onSelectCanvas={handleCanvasSelection}
                onDeleteCanvas={deleteActiveCanvas}
                onSave={saveWorkspace}
                saveStatus={saveStatus}
            />

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
                    onAddNavigation={addNavigationElement}
                    onSelectBackground={selectBackgroundMode}
                    isBackgroundMode={isBackgroundMode}
                />

                {/* Center Area */}
                <div className="flex min-w-0 min-h-0 flex-1 flex-col">
                    {/* Canvas */}
                    <DesignCanvas
                        elements={canvasElements}
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
                        onNavigateCanvas={navigateToCanvas}
                    />

                    {/* Bottom Layers Dock */}
                    <LayersPanel
                        elements={canvasElements}
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
                    canvases={workspace.canvases}
                    onCreateCanvas={createCanvas}
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