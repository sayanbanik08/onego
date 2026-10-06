"use client";

import { useState } from "react";

import DesignEngineHeader from "./components/DesignEngineHeader";
import ElementsPanel from "./components/ElementsPanel";
import DesignCanvas from "./components/DesignCanvas";
import PropertiesPanel from "./components/PropertiesPanel";
import LayersPanel from "./components/LayersPanel";
import type { TimelineElement } from "./types/timeline";
export type { TimelineElement } from "./types/timeline";
import type { CardElement } from "./types/card";
export type { CardElement } from "./types/card";

export type EraserPath = {
    d: string;
    strokeWidth: number;
    opacity: number;
};

export type TextElement = {
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

export type DrawElement = {
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

export type TablePreset =
    | "minimal"
    | "dark"
    | "ocean"
    | "emerald"
    | "sunset"
    | "classic";

export type TableElement = {
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

export type ClockDesign =
    | "digital-minimal"
    | "analog-classic"
    | "digital-neon"
    | "analog-swiss"
    | "flip-card"
    | "smartwatch";

export type ClockTimeMode = "live" | "custom" | "static";

export type ClockElement = {
    id: string;
    type: "clock";
    serialNumber: number;
    x: number;
    y: number;

    design: ClockDesign;
    timeMode: ClockTimeMode;

    // Custom / starting time values
    customHour: number; // 0-23
    customMinute: number; // 0-59
    customSecond: number; // 0-59
    startEpochMs: number; // reference point for custom running time

    is24Hour: boolean;
    showSeconds: boolean;

    // Date
    showDate: boolean;
    dateMode: "live" | "custom";
    customDateStr: string;

    // Visual styles
    bgColor: string;
    textColor: string;
    accentColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    shadow: "none" | "sm" | "md" | "lg";

    // Transform
    size: number;
    rotation: number;
    opacity?: number;
    eraserPaths?: EraserPath[];
};

export type CanvasElement =
    | TextElement
    | DrawElement
    | TableElement
    | ClockElement
    | TimelineElement
    | CardElement;

export type PencilSettings = {
    strokeWidth: number;
    opacity: number;
    color: string;
    rotation?: number;
    size?: number;
};

export type EraserSettings = {
    size: number;
    opacity: number;
};

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
    const [isPropertiesMinimised, setIsPropertiesMinimised] =
        useState(false);
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
    const [pencilSettings, setPencilSettings] = useState<PencilSettings>({
        strokeWidth: 4,
        opacity: 1,
        color: "#000000",
        rotation: 0,
        size: 100,
    });

    const [isEraserMode, setIsEraserMode] = useState(false);
    const [eraserSettings, setEraserSettings] = useState<EraserSettings>({
        size: 30,
        opacity: 1,
    });

    // 🎨 Dashboard Background Settings
    const [backgroundSettings, setBackgroundSettings] =
        useState<DashboardBackgroundSettings>({
            type: "solid",
            color: "#ffffff",
            gradientType: "linear",
            gradientAngle: 135,
            gradientColor1: "#0f172a",
            gradientColor2: "#1e1b4b",
            imageUrl: "",
            imageFit: "cover",
            imageOpacity: 1,
            imageBlur: 0,
            imageOverlayColor: "#000000",
            imageOverlayOpacity: 0.2,
            showGridDots: true,
            gridDotsColor: "#b8b8b8",
            gridDotsSize: 20,
        });
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
        const newTextElement: TextElement = {
            id: crypto.randomUUID(),
            type: "text",
            serialNumber: elements.length + 1,
            x: 100,
            y: 100,
            text: "Text",
            fontSize: 24,
            color: "#000000",
            backgroundColor: "transparent",

            fontWeight: 400,
            fontFamily: "Arial",
            fontStyle: "normal",
            underline: false,
            rotation: 0,
        };

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
        const newTableElement: TableElement = {
            id: crypto.randomUUID(),
            type: "table",
            serialNumber: elements.length + 1,
            x: 100,
            y: 120,
            rows: 3,
            cols: 3,
            headers: ["Column 1", "Column 2", "Column 3"],
            data: [
                ["Data 1-1", "Data 1-2", "Data 1-3"],
                ["Data 2-1", "Data 2-2", "Data 2-3"],
                ["Data 3-1", "Data 3-2", "Data 3-3"],
            ],
            hasHeader: true,
            preset: "minimal",
            headerBg: "#f1f5f9",
            headerColor: "#0f172a",
            headerFontWeight: 600,
            headerAlign: "left",
            rowBg: "#ffffff",
            altRowBg: "#f8fafc",
            cellColor: "#334155",
            cellAlign: "left",
            fontSize: 14,
            borderColor: "#cbd5e1",
            borderWidth: 1,
            borderStyle: "solid",
            cellPadding: 8,
            borderRadius: 6,
            shadow: "sm",
            size: 100,
            rotation: 0,
            opacity: 1,
        };

        setElements((prev) => [...prev, newTableElement]);
        setSelectedElementId(newTableElement.id);
    };

    const addClockElement = () => {
        setIsDrawMode(false);
        setIsEraserMode(false);
        const now = new Date();
        const newClockElement: ClockElement = {
            id: crypto.randomUUID(),
            type: "clock",
            serialNumber: elements.length + 1,
            x: 140,
            y: 140,
            design: "digital-minimal",
            timeMode: "live",
            customHour: now.getHours(),
            customMinute: now.getMinutes(),
            customSecond: now.getSeconds(),
            startEpochMs: Date.now(),
            is24Hour: false,
            showSeconds: true,
            showDate: true,
            dateMode: "live",
            customDateStr: now.toISOString().split("T")[0],
            bgColor: "#0f172a",
            textColor: "#f8fafc",
            accentColor: "#38bdf8",
            borderColor: "#334155",
            borderWidth: 1,
            borderRadius: 16,
            shadow: "md",
            size: 100,
            rotation: 0,
            opacity: 1,
        };

        setElements((prev) => [...prev, newClockElement]);
        setSelectedElementId(newClockElement.id);
    };

    const addTimelineElement = () => {
        setIsDrawMode(false);
        setIsEraserMode(false);
        const newTimelineElement: TimelineElement = {
            id: crypto.randomUUID(),
            type: "timeline",
            serialNumber: elements.length + 1,
            x: 120,
            y: 80,
            theme: "modern-vertical",
            items: [
                {
                    id: crypto.randomUUID(),
                    title: "B.Tech in Computer Science",
                    subtitle: "Institute of Technology",
                    date: "2020 - 2024",
                    description: "Graduated with Honors. Specialized in Cloud Computing and Modern Web Architectures.",
                    tag: "Bachelor's Degree",
                    icon: "graduation",
                },
                {
                    id: crypto.randomUUID(),
                    title: "Senior Full-Stack Engineer",
                    subtitle: "HyperScale Tech Solutions",
                    date: "2023 - Present",
                    description: "Architected modern design engine & canvas workspace. Scaled real-time collaboration pipeline.",
                    tag: "Full-Time",
                    icon: "briefcase",
                },
                {
                    id: crypto.randomUUID(),
                    title: "1st Prize - Global AI & Design Hackathon",
                    subtitle: "International Open Innovate Summit",
                    date: "Nov 2024",
                    description: "Built autonomous canvas design agents powered by Gemini AI, winning out of 3,500+ participants.",
                    tag: "Award",
                    icon: "trophy",
                },
            ],
            spacing: 24,
            nodeShape: "circle",
            nodeSize: 32,
            cardWidth: 480,
            cardMinHeight: 60,
            lineWidth: 2,
            lineColor: "#334155",
            animatedLine: false,
            accentColor: "#3b82f6",
            cardBg: "#0f172a",
            cardBorderColor: "#334155",
            cardBorderWidth: 1,
            borderRadius: 12,
            fontFamily: "Inter, sans-serif",
            titleColor: "#ffffff",
            titleFontSize: 15,
            titleFontWeight: 600,
            subtitleColor: "#94a3b8",
            subtitleFontSize: 12,
            dateColor: "#38bdf8",
            dateFontSize: 11,
            tagColor: "#3b82f6",
            tagFontSize: 10,
            textColor: "#e2e8f0",
            bodyFontSize: 12,
            shadow: "md",
            hoverEffect: "lift",
            size: 100,
            rotation: 0,
            opacity: 1,
        };

        setElements((prev) => [...prev, newTimelineElement]);
        setSelectedElementId(newTimelineElement.id);
    };

    const addCardElement = () => {
        setIsDrawMode(false);
        setIsEraserMode(false);
        const newCardElement: CardElement = {
            id: crypto.randomUUID(),
            type: "card",
            serialNumber: elements.length + 1,
            x: 140,
            y: 100,
            design: "neon-glow",
            cardWidth: 320,
            cardMinHeight: 220,
            cardBg: "#0f0f1a",
            cardBorderWidth: 1,
            cardBorderColor: "#334155",
            borderRadius: 16,
            shadow: "neon",
            accentColor: "#387ef0",
            heading: "Modern Card Component",
            headingColor: "#ffffff",
            headingFontSize: 20,
            headingFontWeight: 700,
            bodyText: "Create stunning glassmorphic and futuristic card components with customizable typography, colors, and interactive buttons.",
            bodyColor: "#94a3b8",
            bodyFontSize: 13,
            showButton: true,
            buttonText: "Explore More",
            buttonBgColor: "#387ef0",
            buttonTextColor: "#ffffff",
            buttonBorderRadius: 8,
            buttonFontSize: 13,
            buttonPaddingX: 18,
            buttonPaddingY: 9,
            buttonLink: "https://example.com",
            socialHandles: [
                { id: "1", platform: "github", label: "GitHub", url: "https://github.com" },
                { id: "2", platform: "twitter", label: "Twitter", url: "https://twitter.com" },
                { id: "3", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com" },
                { id: "4", platform: "discord", label: "Discord", url: "https://discord.com" },
                { id: "5", platform: "youtube", label: "YouTube", url: "https://youtube.com" },
                { id: "6", platform: "instagram", label: "Instagram", url: "https://instagram.com" },
            ],
            socialMarqueeSpeed: 20,
            size: 100,
            rotation: 0,
            opacity: 1,
        };

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