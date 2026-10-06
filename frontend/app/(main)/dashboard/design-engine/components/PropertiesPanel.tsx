import {
    MoreVertical,
    PanelRightOpen,
    Plus,
    Minus,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Sparkles,
    Trash2,
    Palette,
    Table as TableIcon,
} from "lucide-react";
import type {
    Dispatch,
    SetStateAction,
    PointerEvent as ReactPointerEvent,
} from "react";
import { useRef, useState } from "react";
import type { TimelineElement } from "../types/timeline";
import TimelineProperties from "./TimelineProperties";
import type { CardElement } from "../types/card";
import CardProperties from "./CardProperties";

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

type BackgroundType = "solid" | "gradient" | "image";

type DashboardBackgroundSettings = {
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

type PencilSettings = {
    strokeWidth: number;
    opacity: number;
    color: string;
    rotation?: number;
    size?: number;
};

type EraserSettings = {
    size: number;
    opacity: number;
};

type PropertiesPanelProps = {
    isMenuOpen: boolean;
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
    isPropertiesMinimised: boolean;
    setIsPropertiesMinimised: Dispatch<SetStateAction<boolean>>;
    isPropertiesFloating: boolean;
    setIsPropertiesFloating: Dispatch<SetStateAction<boolean>>;
    floatingPosition: {
        x: number;
        y: number;
    };
    setFloatingPosition: Dispatch<
        SetStateAction<{
            x: number;
            y: number;
        }>
    >;

    selectedElement: CanvasElement | null;
    updateElement: (
        id: string,
        updates: Partial<CanvasElement>
    ) => void;

    isDrawMode: boolean;
    pencilSettings: PencilSettings;
    updatePencilSettings: (updates: Partial<PencilSettings>) => void;
    elementsCount?: number;
    isEraserMode?: boolean;
    eraserSettings?: EraserSettings;
    updateEraserSettings?: (updates: Partial<EraserSettings>) => void;
    isBackgroundMode?: boolean;
    backgroundSettings?: DashboardBackgroundSettings;
    updateBackgroundSettings?: (updates: Partial<DashboardBackgroundSettings>) => void;
};

export default function PropertiesPanel({
    isMenuOpen,
    setIsMenuOpen,
    isPropertiesMinimised,
    setIsPropertiesMinimised,
    isPropertiesFloating,
    setIsPropertiesFloating,
    floatingPosition,
    setFloatingPosition,
    selectedElement,
    updateElement,
    isDrawMode,
    pencilSettings,
    updatePencilSettings,
    elementsCount = 0,
    isEraserMode = false,
    eraserSettings = { size: 30, opacity: 1 },
    updateEraserSettings = () => {},
    isBackgroundMode = false,
    backgroundSettings,
    updateBackgroundSettings = () => {},
}: PropertiesPanelProps) {
    const [bgImageTab, setBgImageTab] = useState<"url" | "upload">("upload");
    const panelRef = useRef<HTMLElement | null>(null);

    const handleFloat = () => {
        if (!panelRef.current) {
            return;
        }

        const rect = panelRef.current.getBoundingClientRect();

        setFloatingPosition({
            x: rect.left,
            y: rect.top,
        });

        setIsPropertiesFloating(true);
        setIsMenuOpen(false);
    };

    const handlePointerDown = (
        event: ReactPointerEvent<HTMLDivElement>
    ) => {
        if (!isPropertiesFloating) {
            return;
        }

        const startX = event.clientX;
        const startY = event.clientY;

        const initialX = floatingPosition.x;
        const initialY = floatingPosition.y;

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const panelWidth = 288;
            const panelHeight = 500;

            const newX = Math.min(
                Math.max(
                    0,
                    initialX + moveEvent.clientX - startX
                ),
                window.innerWidth - panelWidth
            );

            const newY = Math.min(
                Math.max(
                    64,
                    initialY + moveEvent.clientY - startY
                ),
                window.innerHeight - panelHeight
            );

            setFloatingPosition({
                x: newX,
                y: newY,
            });
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

    const eraserSettingsContent = (
        <div className="mt-6 space-y-5">

            {/* Eraser Tool Info */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">
                    Eraser
                </div>

                <div className="mt-1 text-xs text-gray-500">
                    Type: Eraser
                </div>
            </div>

            {/* Size */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">
                        Size
                    </label>

                    <span className="text-xs text-gray-500">
                        {eraserSettings.size}px
                    </span>
                </div>

                <input
                    type="range"
                    min="10"
                    max="100"
                    step="2"
                    value={eraserSettings.size}
                    onChange={(event) =>
                        updateEraserSettings({
                            size: Number(event.target.value),
                        })
                    }
                    className="w-full"
                />

                <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                    <span>Small</span>
                    <span>Large</span>
                </div>
            </div>

            {/* Opacity */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">
                        Opacity
                    </label>

                    <span className="text-xs text-gray-500">
                        {Math.round(eraserSettings.opacity * 100)}%
                    </span>
                </div>

                <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={eraserSettings.opacity}
                    onChange={(event) =>
                        updateEraserSettings({
                            opacity: Number(event.target.value),
                        })
                    }
                    className="w-full"
                />

                <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                    <span>Soft</span>
                    <span>Hard (100%)</span>
                </div>
            </div>

        </div>
    );

    const pencilSettingsContent = (
        <div className="mt-6 space-y-5">

            {/* Element Information */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">
                    Element {elementsCount + 1}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                    Type: Draw
                </div>
            </div>

            {/* Size */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Size
                </label>

                <input
                    type="number"
                    min="1"
                    value={pencilSettings.size ?? 100}
                    onChange={(event) =>
                        updatePencilSettings({
                            size: Math.max(1, Number(event.target.value)),
                        })
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-gray-500"
                />
            </div>

            {/* Stroke Width */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">
                        Stroke Width
                    </label>

                    <span className="text-xs text-gray-500">
                        {pencilSettings.strokeWidth}px
                    </span>
                </div>

                <input
                    type="range"
                    min="1"
                    max="24"
                    step="1"
                    value={pencilSettings.strokeWidth}
                    onChange={(event) =>
                        updatePencilSettings({
                            strokeWidth: Number(event.target.value),
                        })
                    }
                    className="w-full"
                />

                <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                    <span>Thin</span>
                    <span>Thick</span>
                </div>
            </div>

            {/* Opacity */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">
                        Opacity
                    </label>

                    <span className="text-xs text-gray-500">
                        {Math.round(pencilSettings.opacity * 100)}%
                    </span>
                </div>

                <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={pencilSettings.opacity}
                    onChange={(event) =>
                        updatePencilSettings({
                            opacity: Number(event.target.value),
                        })
                    }
                    className="w-full"
                />

                <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                    <span>Transparent</span>
                    <span>Opaque</span>
                </div>
            </div>

            {/* Color */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Color
                </label>

                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={pencilSettings.color}
                        onChange={(event) =>
                            updatePencilSettings({
                                color: event.target.value,
                            })
                        }
                        className="h-9 w-12 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />

                    <span className="text-sm text-gray-300">
                        {pencilSettings.color}
                    </span>
                </div>
            </div>

            {/* Rotation */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">
                        Rotation
                    </label>

                    <span className="text-xs text-gray-500">
                        {pencilSettings.rotation ?? 0}°
                    </span>
                </div>

                <input
                    type="range"
                    min="-360"
                    max="360"
                    step="1"
                    value={pencilSettings.rotation ?? 0}
                    onChange={(event) =>
                        updatePencilSettings({
                            rotation: Number(event.target.value),
                        })
                    }
                    className="w-full"
                />
            </div>

        </div>
    );

    const drawElementContent = selectedElement && selectedElement.type === "draw" ? (
        <div className="mt-6 space-y-5">

            {/* Element Information */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">
                    Element {selectedElement.serialNumber}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                    Type: Draw
                </div>
            </div>

            {/* Size */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Size
                </label>

                <input
                    type="number"
                    min="1"
                    value={selectedElement.size ?? 100}
                    onChange={(event) => {
                        const val = Math.max(1, Number(event.target.value));
                        updateElement(selectedElement.id, {
                            size: val,
                        });
                        updatePencilSettings({
                            size: val,
                        });
                    }}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-gray-500"
                />
            </div>

            {/* Stroke Width */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">
                        Stroke Width
                    </label>

                    <span className="text-xs text-gray-500">
                        {selectedElement.strokeWidth}px
                    </span>
                </div>

                <input
                    type="range"
                    min="1"
                    max="24"
                    step="1"
                    value={selectedElement.strokeWidth}
                    onChange={(event) => {
                        const val = Number(event.target.value);
                        updateElement(selectedElement.id, {
                            strokeWidth: val,
                        });
                        updatePencilSettings({
                            strokeWidth: val,
                        });
                    }}
                    className="w-full"
                />

                <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                    <span>Thin</span>
                    <span>Thick</span>
                </div>
            </div>

            {/* Opacity */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">
                        Opacity
                    </label>

                    <span className="text-xs text-gray-500">
                        {Math.round(selectedElement.opacity * 100)}%
                    </span>
                </div>

                <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={selectedElement.opacity}
                    onChange={(event) => {
                        const val = Number(event.target.value);
                        updateElement(selectedElement.id, {
                            opacity: val,
                        });
                        updatePencilSettings({
                            opacity: val,
                        });
                    }}
                    className="w-full"
                />

                <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                    <span>Transparent</span>
                    <span>Opaque</span>
                </div>
            </div>

            {/* Color */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Color
                </label>

                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={selectedElement.color}
                        onChange={(event) => {
                            const val = event.target.value;
                            updateElement(selectedElement.id, {
                                color: val,
                            });
                            updatePencilSettings({
                                color: val,
                            });
                        }}
                        className="h-9 w-12 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />

                    <span className="text-sm text-gray-300">
                        {selectedElement.color}
                    </span>
                </div>
            </div>

            {/* Rotation */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">
                        Rotation
                    </label>

                    <span className="text-xs text-gray-500">
                        {selectedElement.rotation}°
                    </span>
                </div>

                <input
                    type="range"
                    min="-360"
                    max="360"
                    step="1"
                    value={selectedElement.rotation}
                    onChange={(event) => {
                        const val = Number(event.target.value);
                        updateElement(selectedElement.id, {
                            rotation: val,
                        });
                        updatePencilSettings({
                            rotation: val,
                        });
                    }}
                    className="w-full"
                />
            </div>

        </div>
    ) : null;

    const [tableTab, setTableTab] = useState<"style" | "data">("style");

    const applyTablePreset = (presetName: TablePreset) => {
        if (!selectedElement || selectedElement.type !== "table") return;
        const presets: Record<TablePreset, Partial<TableElement>> = {
            minimal: {
                preset: "minimal",
                headerBg: "#f1f5f9",
                headerColor: "#0f172a",
                headerFontWeight: 600,
                rowBg: "#ffffff",
                altRowBg: "#f8fafc",
                cellColor: "#334155",
                borderColor: "#cbd5e1",
                borderWidth: 1,
                borderStyle: "solid",
                borderRadius: 6,
                shadow: "sm",
            },
            dark: {
                preset: "dark",
                headerBg: "#09090b",
                headerColor: "#fafafa",
                headerFontWeight: 600,
                rowBg: "#18181b",
                altRowBg: "#27272a",
                cellColor: "#e4e4e7",
                borderColor: "#3f3f46",
                borderWidth: 1,
                borderStyle: "solid",
                borderRadius: 8,
                shadow: "md",
            },
            ocean: {
                preset: "ocean",
                headerBg: "#1e40af",
                headerColor: "#ffffff",
                headerFontWeight: 600,
                rowBg: "#ffffff",
                altRowBg: "#eff6ff",
                cellColor: "#1e3a8a",
                borderColor: "#93c5fd",
                borderWidth: 1,
                borderStyle: "solid",
                borderRadius: 8,
                shadow: "sm",
            },
            emerald: {
                preset: "emerald",
                headerBg: "#065f46",
                headerColor: "#ffffff",
                headerFontWeight: 600,
                rowBg: "#ffffff",
                altRowBg: "#ecfdf5",
                cellColor: "#064e3b",
                borderColor: "#a7f3d0",
                borderWidth: 1,
                borderStyle: "solid",
                borderRadius: 8,
                shadow: "sm",
            },
            sunset: {
                preset: "sunset",
                headerBg: "#ea580c",
                headerColor: "#ffffff",
                headerFontWeight: 600,
                rowBg: "#ffffff",
                altRowBg: "#fff7ed",
                cellColor: "#7c2d12",
                borderColor: "#fed7aa",
                borderWidth: 1,
                borderStyle: "solid",
                borderRadius: 8,
                shadow: "sm",
            },
            classic: {
                preset: "classic",
                headerBg: "#e5e7eb",
                headerColor: "#111827",
                headerFontWeight: 600,
                rowBg: "#ffffff",
                altRowBg: "#ffffff",
                cellColor: "#111827",
                borderColor: "#4b5563",
                borderWidth: 1,
                borderStyle: "solid",
                borderRadius: 0,
                shadow: "none",
            },
        };
        updateElement(selectedElement.id, presets[presetName]);
    };

    const handleSetRows = (newRows: number) => {
        if (!selectedElement || selectedElement.type !== "table") return;
        const targetRows = Math.max(1, Math.min(25, newRows));
        let newData = [...selectedElement.data];
        if (targetRows > selectedElement.rows) {
            for (let i = selectedElement.rows; i < targetRows; i++) {
                const newRow: string[] = [];
                for (let j = 0; j < selectedElement.cols; j++) {
                    newRow.push(`Data ${i + 1}-${j + 1}`);
                }
                newData.push(newRow);
            }
        } else {
            newData = newData.slice(0, targetRows);
        }
        updateElement(selectedElement.id, { rows: targetRows, data: newData });
    };

    const handleSetCols = (newCols: number) => {
        if (!selectedElement || selectedElement.type !== "table") return;
        const targetCols = Math.max(1, Math.min(10, newCols));
        let newHeaders = [...selectedElement.headers];
        if (targetCols > selectedElement.cols) {
            for (let j = selectedElement.cols; j < targetCols; j++) {
                newHeaders.push(`Col ${j + 1}`);
            }
        } else {
            newHeaders = newHeaders.slice(0, targetCols);
        }
        const newData = selectedElement.data.map((row, rIdx) => {
            let nextRow = [...row];
            if (targetCols > selectedElement.cols) {
                for (let j = selectedElement.cols; j < targetCols; j++) {
                    nextRow.push(`Data ${rIdx + 1}-${j + 1}`);
                }
            } else {
                nextRow = nextRow.slice(0, targetCols);
            }
            return nextRow;
        });
        updateElement(selectedElement.id, {
            cols: targetCols,
            headers: newHeaders,
            data: newData,
        });
    };

    const handleFillSampleData = () => {
        if (!selectedElement || selectedElement.type !== "table") return;
        const sampleHeaders = ["Product", "Category", "Price", "Stock", "Rating"];
        const samples = [
            ["MacBook Air", "Laptop", "$999", "18", "4.8"],
            ["iPhone 15", "Phone", "$799", "45", "4.9"],
            ["AirPods Pro", "Audio", "$249", "60", "4.7"],
            ["iPad Pro", "Tablet", "$899", "22", "4.8"],
            ["Magic Mouse", "Accessory", "$79", "35", "4.4"],
        ];
        const newHeaders = selectedElement.headers.map((h, i) =>
            i < sampleHeaders.length ? sampleHeaders[i] : `Col ${i + 1}`
        );
        const newData = selectedElement.data.map((row, rIdx) => {
            const sampleRow = samples[rIdx % samples.length];
            return row.map((cell, cIdx) =>
                cIdx < sampleRow.length ? sampleRow[cIdx] : `Val ${rIdx + 1}-${cIdx + 1}`
            );
        });
        updateElement(selectedElement.id, { headers: newHeaders, data: newData });
    };

    const handleClearAllData = () => {
        if (!selectedElement || selectedElement.type !== "table") return;
        const emptyData = selectedElement.data.map((r) => r.map(() => ""));
        updateElement(selectedElement.id, { data: emptyData });
    };

    const tableElementContent =
        selectedElement && selectedElement.type === "table" ? (
            <div className="mt-6 space-y-5">
                {/* Element Information */}
                <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                    <div className="text-sm font-medium text-white">
                        Element {selectedElement.serialNumber}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                        Type: Table
                    </div>
                </div>

                {/* Sub Tab Switcher: Style vs Data */}
                <div className="grid grid-cols-2 rounded-lg border border-gray-800 bg-gray-900 p-1">
                    <button
                        type="button"
                        onClick={() => setTableTab("style")}
                        className={`rounded-md py-1.5 text-xs font-medium transition ${
                            tableTab === "style"
                                ? "bg-gray-800 text-white shadow-sm"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        🎨 Style & Layout
                    </button>
                    <button
                        type="button"
                        onClick={() => setTableTab("data")}
                        className={`rounded-md py-1.5 text-xs font-medium transition ${
                            tableTab === "data"
                                ? "bg-gray-800 text-white shadow-sm"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        📝 Edit Data
                    </button>
                </div>

                {tableTab === "style" ? (
                    <>
                        {/* 1. Rows & Columns */}
                        <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-3 space-y-3">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Grid Dimensions
                            </label>

                            {/* Rows */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-gray-300">
                                    Rows ({selectedElement.rows})
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetRows(selectedElement.rows - 1)
                                        }
                                        disabled={selectedElement.rows <= 1}
                                        className="flex h-7 w-7 items-center justify-center rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40"
                                    >
                                        <Minus size={13} />
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max="25"
                                        value={selectedElement.rows}
                                        onChange={(e) =>
                                            handleSetRows(Number(e.target.value))
                                        }
                                        className="h-7 w-12 rounded border border-gray-700 bg-gray-900 text-center text-xs text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetRows(selectedElement.rows + 1)
                                        }
                                        disabled={selectedElement.rows >= 25}
                                        className="flex h-7 w-7 items-center justify-center rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40"
                                    >
                                        <Plus size={13} />
                                    </button>
                                </div>
                            </div>

                            {/* Columns */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-gray-300">
                                    Columns ({selectedElement.cols})
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetCols(selectedElement.cols - 1)
                                        }
                                        disabled={selectedElement.cols <= 1}
                                        className="flex h-7 w-7 items-center justify-center rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40"
                                    >
                                        <Minus size={13} />
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={selectedElement.cols}
                                        onChange={(e) =>
                                            handleSetCols(Number(e.target.value))
                                        }
                                        className="h-7 w-12 rounded border border-gray-700 bg-gray-900 text-center text-xs text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetCols(selectedElement.cols + 1)
                                        }
                                        disabled={selectedElement.cols >= 10}
                                        className="flex h-7 w-7 items-center justify-center rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40"
                                    >
                                        <Plus size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 2. Default Style Presets */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Default Styles
                                </label>
                                <span className="text-[10px] text-gray-500">
                                    6 Presets
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    {
                                        id: "minimal" as TablePreset,
                                        label: "Minimal",
                                        dot: "bg-slate-400",
                                    },
                                    {
                                        id: "dark" as TablePreset,
                                        label: "Dark",
                                        dot: "bg-zinc-950",
                                    },
                                    {
                                        id: "ocean" as TablePreset,
                                        label: "Ocean",
                                        dot: "bg-blue-600",
                                    },
                                    {
                                        id: "emerald" as TablePreset,
                                        label: "Emerald",
                                        dot: "bg-emerald-600",
                                    },
                                    {
                                        id: "sunset" as TablePreset,
                                        label: "Sunset",
                                        dot: "bg-orange-500",
                                    },
                                    {
                                        id: "classic" as TablePreset,
                                        label: "Classic",
                                        dot: "bg-neutral-500",
                                    },
                                ].map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => applyTablePreset(p.id)}
                                        className={`flex flex-col items-center gap-1.5 rounded-lg border p-2 text-center text-xs transition ${
                                            selectedElement.preset === p.id
                                                ? "border-blue-500 bg-blue-950/40 text-blue-200"
                                                : "border-gray-800 bg-gray-900/60 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
                                        }`}
                                    >
                                        <div
                                            className={`h-3 w-8 rounded-sm ${p.dot}`}
                                        />
                                        <span className="text-[11px] font-medium">
                                            {p.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Custom CSS-Like Styling */}
                        <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-3 space-y-4">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Custom Styles
                            </label>

                            {/* Header Section */}
                            <div className="space-y-3 rounded border border-gray-800/80 bg-gray-900/60 p-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-300">
                                        Show Header
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={selectedElement.hasHeader}
                                        onChange={(e) =>
                                            updateElement(selectedElement.id, {
                                                hasHeader: e.target.checked,
                                            })
                                        }
                                        className="h-4 w-4 rounded accent-blue-600"
                                    />
                                </div>

                                {selectedElement.hasHeader && (
                                    <>
                                        {/* Header Background */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">
                                                Header Bg
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={
                                                        selectedElement.headerBg
                                                    }
                                                    onChange={(e) =>
                                                        updateElement(
                                                            selectedElement.id,
                                                            {
                                                                headerBg:
                                                                    e.target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                                />
                                                <span className="text-xs font-mono text-gray-400">
                                                    {selectedElement.headerBg}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Header Text Color */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">
                                                Header Text
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={
                                                        selectedElement.headerColor
                                                    }
                                                    onChange={(e) =>
                                                        updateElement(
                                                            selectedElement.id,
                                                            {
                                                                headerColor:
                                                                    e.target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                                />
                                                <span className="text-xs font-mono text-gray-400">
                                                    {
                                                        selectedElement.headerColor
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        {/* Header Font Weight */}
                                        <div>
                                            <div className="mb-1.5 flex items-center justify-between text-xs text-gray-400">
                                                <span>Font Weight</span>
                                                <span className="text-gray-500">
                                                    {selectedElement.headerFontWeight}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-1">
                                                {[
                                                    { label: "Normal", val: 400 },
                                                    { label: "Semi", val: 600 },
                                                    { label: "Bold", val: 700 },
                                                ].map((w) => (
                                                    <button
                                                        key={w.val}
                                                        type="button"
                                                        onClick={() =>
                                                            updateElement(
                                                                selectedElement.id,
                                                                {
                                                                    headerFontWeight:
                                                                        w.val,
                                                                }
                                                            )
                                                        }
                                                        className={`rounded py-1 text-xs transition ${
                                                            selectedElement.headerFontWeight ===
                                                            w.val
                                                                ? "bg-blue-600 text-white font-semibold"
                                                                : "bg-gray-800 text-gray-400 hover:text-white"
                                                        }`}
                                                    >
                                                        {w.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Header Text Alignment */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">
                                                Header Align
                                            </span>
                                            <div className="flex rounded border border-gray-700 bg-gray-900 p-0.5">
                                                {(
                                                    [
                                                        "left",
                                                        "center",
                                                        "right",
                                                    ] as const
                                                ).map((align) => (
                                                    <button
                                                        key={align}
                                                        type="button"
                                                        onClick={() =>
                                                            updateElement(
                                                                selectedElement.id,
                                                                {
                                                                    headerAlign:
                                                                        align,
                                                                }
                                                            )
                                                        }
                                                        className={`rounded px-2.5 py-1 text-xs transition ${
                                                            selectedElement.headerAlign ===
                                                            align
                                                                ? "bg-blue-600 text-white"
                                                                : "text-gray-400 hover:text-white"
                                                        }`}
                                                    >
                                                        {align === "left" && (
                                                            <AlignLeft
                                                                size={12}
                                                            />
                                                        )}
                                                        {align === "center" && (
                                                            <AlignCenter
                                                                size={12}
                                                            />
                                                        )}
                                                        {align === "right" && (
                                                            <AlignRight
                                                                size={12}
                                                            />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Body Rows Styling */}
                            <div className="space-y-3 rounded border border-gray-800/80 bg-gray-900/60 p-2.5">
                                <span className="block text-xs font-medium text-gray-300">
                                    Rows & Cells
                                </span>

                                {/* Primary Row Bg */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">
                                        Row Bg
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={selectedElement.rowBg}
                                            onChange={(e) =>
                                                updateElement(
                                                    selectedElement.id,
                                                    {
                                                        rowBg: e.target.value,
                                                    }
                                                )
                                            }
                                            className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                        />
                                        <span className="text-xs font-mono text-gray-400">
                                            {selectedElement.rowBg}
                                        </span>
                                    </div>
                                </div>

                                {/* Alternating Row Bg */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">
                                        Alt Row (Striped)
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={selectedElement.altRowBg}
                                            onChange={(e) =>
                                                updateElement(
                                                    selectedElement.id,
                                                    {
                                                        altRowBg:
                                                            e.target.value,
                                                    }
                                                )
                                            }
                                            className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                        />
                                        <span className="text-xs font-mono text-gray-400">
                                            {selectedElement.altRowBg}
                                        </span>
                                    </div>
                                </div>

                                {/* Cell Text Color */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">
                                        Cell Text
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={selectedElement.cellColor}
                                            onChange={(e) =>
                                                updateElement(
                                                    selectedElement.id,
                                                    {
                                                        cellColor:
                                                            e.target.value,
                                                    }
                                                )
                                            }
                                            className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                        />
                                        <span className="text-xs font-mono text-gray-400">
                                            {selectedElement.cellColor}
                                        </span>
                                    </div>
                                </div>

                                {/* Cell Text Alignment */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">
                                        Cell Align
                                    </span>
                                    <div className="flex rounded border border-gray-700 bg-gray-900 p-0.5">
                                        {(
                                            [
                                                "left",
                                                "center",
                                                "right",
                                            ] as const
                                        ).map((align) => (
                                            <button
                                                key={align}
                                                type="button"
                                                onClick={() =>
                                                    updateElement(
                                                        selectedElement.id,
                                                        {
                                                            cellAlign: align,
                                                        }
                                                    )
                                                }
                                                className={`rounded px-2.5 py-1 text-xs transition ${
                                                    selectedElement.cellAlign ===
                                                    align
                                                        ? "bg-blue-600 text-white"
                                                        : "text-gray-400 hover:text-white"
                                                }`}
                                            >
                                                {align === "left" && (
                                                    <AlignLeft size={12} />
                                                )}
                                                {align === "center" && (
                                                    <AlignCenter size={12} />
                                                )}
                                                {align === "right" && (
                                                    <AlignRight size={12} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Font Size */}
                                <div>
                                    <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                                        <span>Font Size</span>
                                        <span className="text-gray-500">
                                            {selectedElement.fontSize}px
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="24"
                                        value={selectedElement.fontSize}
                                        onChange={(e) =>
                                            updateElement(selectedElement.id, {
                                                fontSize: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full"
                                    />
                                </div>

                                {/* Cell Padding */}
                                <div>
                                    <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                                        <span>Cell Padding</span>
                                        <span className="text-gray-500">
                                            {selectedElement.cellPadding}px
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="4"
                                        max="20"
                                        value={selectedElement.cellPadding}
                                        onChange={(e) =>
                                            updateElement(selectedElement.id, {
                                                cellPadding: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Borders & Container Styling */}
                            <div className="space-y-3 rounded border border-gray-800/80 bg-gray-900/60 p-2.5">
                                <span className="block text-xs font-medium text-gray-300">
                                    Borders & Corners
                                </span>

                                {/* Border Color */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">
                                        Border Color
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={
                                                selectedElement.borderColor
                                            }
                                            onChange={(e) =>
                                                updateElement(
                                                    selectedElement.id,
                                                    {
                                                        borderColor:
                                                            e.target.value,
                                                    }
                                                )
                                            }
                                            className="h-7 w-8 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                        />
                                        <span className="text-xs font-mono text-gray-400">
                                            {selectedElement.borderColor}
                                        </span>
                                    </div>
                                </div>

                                {/* Border Width */}
                                <div>
                                    <div className="mb-1.5 flex items-center justify-between text-xs text-gray-400">
                                        <span>Border Width</span>
                                        <span className="text-gray-500">
                                            {selectedElement.borderWidth}px
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-5 gap-1">
                                        {[0, 1, 2, 3, 4].map((bw) => (
                                            <button
                                                key={bw}
                                                type="button"
                                                onClick={() =>
                                                    updateElement(
                                                        selectedElement.id,
                                                        {
                                                            borderWidth: bw,
                                                        }
                                                    )
                                                }
                                                className={`rounded py-1 text-xs transition ${
                                                    selectedElement.borderWidth ===
                                                    bw
                                                        ? "bg-blue-600 text-white font-semibold"
                                                        : "bg-gray-800 text-gray-400 hover:text-white"
                                                }`}
                                            >
                                                {bw}px
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Border Style */}
                                <div>
                                    <label className="mb-1.5 block text-xs text-gray-400">
                                        Border Style
                                    </label>
                                    <div className="grid grid-cols-4 gap-1">
                                        {(
                                            [
                                                "solid",
                                                "dashed",
                                                "dotted",
                                                "none",
                                            ] as const
                                        ).map((style) => (
                                            <button
                                                key={style}
                                                type="button"
                                                onClick={() =>
                                                    updateElement(
                                                        selectedElement.id,
                                                        {
                                                            borderStyle:
                                                                style,
                                                        }
                                                    )
                                                }
                                                className={`rounded py-1 text-[11px] capitalize transition ${
                                                    selectedElement.borderStyle ===
                                                    style
                                                        ? "bg-blue-600 text-white font-semibold"
                                                        : "bg-gray-800 text-gray-400 hover:text-white"
                                                }`}
                                            >
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Border Radius */}
                                <div>
                                    <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                                        <span>Corner Radius</span>
                                        <span className="text-gray-500">
                                            {selectedElement.borderRadius}px
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="20"
                                        value={selectedElement.borderRadius}
                                        onChange={(e) =>
                                            updateElement(selectedElement.id, {
                                                borderRadius: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full"
                                    />
                                </div>

                                {/* Shadow */}
                                <div>
                                    <label className="mb-1.5 block text-xs text-gray-400">
                                        Shadow
                                    </label>
                                    <div className="grid grid-cols-4 gap-1">
                                        {(
                                            ["none", "sm", "md", "lg"] as const
                                        ).map((sh) => (
                                            <button
                                                key={sh}
                                                type="button"
                                                onClick={() =>
                                                    updateElement(
                                                        selectedElement.id,
                                                        {
                                                            shadow: sh,
                                                        }
                                                    )
                                                }
                                                className={`rounded py-1 text-[11px] uppercase transition ${
                                                    (selectedElement.shadow ||
                                                        "none") === sh
                                                        ? "bg-blue-600 text-white font-semibold"
                                                        : "bg-gray-800 text-gray-400 hover:text-white"
                                                }`}
                                            >
                                                {sh}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Size (Scale) */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-xs font-medium text-gray-400">
                                    Size (Scale)
                                </label>
                                <span className="text-xs text-gray-500">
                                    {selectedElement.size ?? 100}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="20"
                                max="200"
                                step="5"
                                value={selectedElement.size ?? 100}
                                onChange={(e) =>
                                    updateElement(selectedElement.id, {
                                        size: Number(e.target.value),
                                    })
                                }
                                className="w-full"
                            />
                        </div>

                        {/* 5. Rotation */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-xs font-medium text-gray-400">
                                    Rotation
                                </label>
                                <span className="text-xs text-gray-500">
                                    {selectedElement.rotation}°
                                </span>
                            </div>
                            <input
                                type="range"
                                min="-360"
                                max="360"
                                step="1"
                                value={selectedElement.rotation}
                                onChange={(e) =>
                                    updateElement(selectedElement.id, {
                                        rotation: Number(e.target.value),
                                    })
                                }
                                className="w-full"
                            />
                        </div>

                        {/* 6. Opacity */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-xs font-medium text-gray-400">
                                    Opacity
                                </label>
                                <span className="text-xs text-gray-500">
                                    {Math.round(
                                        (selectedElement.opacity ?? 1) * 100
                                    )}
                                    %
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0.05"
                                max="1"
                                step="0.05"
                                value={selectedElement.opacity ?? 1}
                                onChange={(e) =>
                                    updateElement(selectedElement.id, {
                                        opacity: Number(e.target.value),
                                    })
                                }
                                className="w-full"
                            />
                        </div>
                    </>
                ) : (
                    /* Data Tab */
                    <div className="space-y-4">
                        {/* Quick actions */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleFillSampleData}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-800 bg-blue-950/40 px-3 py-2 text-xs font-medium text-blue-300 transition hover:bg-blue-900/60"
                            >
                                <Sparkles size={13} />
                                Fill Sample Data
                            </button>
                            <button
                                type="button"
                                onClick={handleClearAllData}
                                className="flex items-center justify-center gap-1 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-xs font-medium text-gray-400 transition hover:border-red-800 hover:bg-red-950/30 hover:text-red-300"
                                title="Clear all cell contents"
                            >
                                <Trash2 size={13} />
                                Clear
                            </button>
                        </div>

                        <div className="rounded-lg border border-blue-900/40 bg-blue-950/20 p-2.5 text-[11px] text-blue-300">
                            💡 You can also double-click directly on any cell on the canvas to edit it in place!
                        </div>

                        {/* Headers Editor */}
                        {selectedElement.hasHeader && (
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Column Headers
                                </label>
                                <div className="space-y-1.5">
                                    {selectedElement.headers.map(
                                        (hdr, cIdx) => (
                                            <div
                                                key={cIdx}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="w-12 font-mono text-[11px] text-gray-500">
                                                    Col {cIdx + 1}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={hdr}
                                                    onChange={(e) => {
                                                        const newHeaders = [
                                                            ...selectedElement.headers,
                                                        ];
                                                        newHeaders[cIdx] =
                                                            e.target.value;
                                                        updateElement(
                                                            selectedElement.id,
                                                            {
                                                                headers:
                                                                    newHeaders,
                                                            }
                                                        );
                                                    }}
                                                    className="flex-1 rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
                                                    placeholder={`Header ${cIdx + 1}`}
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Cell Values Editor */}
                        <div className="space-y-3">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Row Data Cells
                            </label>
                            {Array.from({
                                length: selectedElement.rows,
                            }).map((_, rIdx) => (
                                <div
                                    key={rIdx}
                                    className="rounded-lg border border-gray-800 bg-gray-900/50 p-2.5 space-y-1.5"
                                >
                                    <span className="block text-[11px] font-semibold text-gray-400">
                                        Row {rIdx + 1}
                                    </span>
                                    <div className="space-y-1">
                                        {Array.from({
                                            length: selectedElement.cols,
                                        }).map((__, cIdx) => (
                                            <div
                                                key={cIdx}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="w-12 text-[10px] text-gray-500">
                                                    {selectedElement.headers[
                                                        cIdx
                                                    ] || `C${cIdx + 1}`}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={
                                                        selectedElement.data?.[
                                                            rIdx
                                                        ]?.[cIdx] ?? ""
                                                    }
                                                    onChange={(e) => {
                                                        const newData =
                                                            selectedElement.data.map(
                                                                (r) => [...r]
                                                            );
                                                        if (!newData[rIdx])
                                                            newData[rIdx] = [];
                                                        newData[rIdx][cIdx] =
                                                            e.target.value;
                                                        updateElement(
                                                            selectedElement.id,
                                                            {
                                                                data: newData,
                                                            }
                                                        );
                                                    }}
                                                    className="flex-1 rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
                                                    placeholder={`Cell (${rIdx + 1}, ${cIdx + 1})`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        ) : null;

    const clockElementContent =
        selectedElement && selectedElement.type === "clock" ? (() => {
            const clk = selectedElement as ClockElement;
            const DESIGNS: { value: ClockDesign; label: string }[] = [
                { value: "digital-minimal", label: "Digital Minimal" },
                { value: "analog-classic",  label: "Analog Classic"  },
                { value: "digital-neon",    label: "Neon Digital"    },
                { value: "analog-swiss",    label: "Swiss Minimal"   },
                { value: "flip-card",       label: "Flip Card"       },
                { value: "smartwatch",      label: "Smartwatch"      },
            ];
            return (
                <div className="mt-6 space-y-5">
                    {/* Info */}
                    <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                        <div className="text-sm font-medium text-white">Element {clk.serialNumber}</div>
                        <div className="mt-1 text-xs text-gray-500">Type: Clock</div>
                    </div>

                    {/* Design Presets */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-gray-400">Design</label>
                        <div className="grid grid-cols-2 gap-1.5">
                            {DESIGNS.map((d) => (
                                <button
                                    key={d.value}
                                    type="button"
                                    onClick={() => updateElement(clk.id, { design: d.value })}
                                    className={`rounded-md border px-2 py-1.5 text-left text-xs transition ${clk.design === d.value ? "border-blue-500 bg-blue-950/40 text-blue-200" : "border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-800"}`}
                                >{d.label}</button>
                            ))}
                        </div>
                        {(() => {
                            const PALETTES: Record<ClockDesign, Partial<ClockElement>> = {
                                "digital-minimal": { bgColor: "#0b0f19", textColor: "#f8fafc", accentColor: "#38bdf8", borderColor: "#1e293b", borderRadius: 20 },
                                "analog-classic":  { bgColor: "#0b0f19", textColor: "#f8fafc", accentColor: "#f59e0b", borderColor: "#334155", borderRadius: 24 },
                                "digital-neon":    { bgColor: "#06080e", textColor: "#38bdf8", accentColor: "#00f0ff", borderColor: "#0284c7", borderRadius: 16 },
                                "analog-swiss":    { bgColor: "#ffffff", textColor: "#0f172a", accentColor: "#ef4444", borderColor: "#cbd5e1", borderRadius: 24 },
                                "flip-card":       { bgColor: "#111317", textColor: "#ffffff", accentColor: "#f97316", borderColor: "#272a33", borderRadius: 16 },
                                "smartwatch":      { bgColor: "#06080e", textColor: "#f8fafc", accentColor: "#38bdf8", borderColor: "#334155", borderRadius: 32 },
                            };
                            const currentTheme = PALETTES[clk.design];
                            return currentTheme ? (
                                <button
                                    type="button"
                                    onClick={() => updateElement(clk.id, currentTheme)}
                                    className="mt-2 w-full rounded border border-gray-700/80 bg-gray-800/40 px-2 py-1.5 text-center text-[11px] font-medium text-gray-300 transition hover:border-gray-500 hover:bg-gray-800 hover:text-white"
                                >
                                    ✨ Apply {DESIGNS.find((d) => d.value === clk.design)?.label} Curated Palette
                                </button>
                            ) : null;
                        })()}
                    </div>

                    {/* Time Mode */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-gray-400">Time Mode</label>
                        <div className="flex gap-1.5">
                            {(["live","custom","static"] as ClockTimeMode[]).map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => {
                                        const updates: Partial<ClockElement> = { timeMode: m };
                                        if (m === "custom" || m === "static") {
                                            updates.startEpochMs = Date.now();
                                        }
                                        updateElement(clk.id, updates);
                                    }}
                                    className={`flex-1 rounded-md border px-2 py-1.5 text-xs capitalize transition ${clk.timeMode === m ? "border-blue-500 bg-blue-950/40 text-blue-200" : "border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-800"}`}
                                >{m === "static" ? "Demo" : m}</button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Time Inputs */}
                    {(clk.timeMode === "custom" || clk.timeMode === "static") && (
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-400">
                                {clk.timeMode === "static" ? "Static Time (frozen)" : "Start Time (runs live from here)"}
                            </label>
                            <div className="flex gap-2">
                                {(["customHour","customMinute","customSecond"] as const).map((field, i) => (
                                    <div key={field} className="flex flex-col items-center gap-1">
                                        <input
                                            type="number"
                                            min="0"
                                            max={i === 0 ? 23 : 59}
                                            value={clk[field]}
                                            onChange={(e) => {
                                                const updates: Partial<ClockElement> = { [field]: Math.max(0, Math.min(i === 0 ? 23 : 59, Number(e.target.value))) };
                                                if (clk.timeMode === "custom") updates.startEpochMs = Date.now();
                                                updateElement(clk.id, updates);
                                            }}
                                            className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1.5 text-center text-sm text-white outline-none focus:border-blue-500"
                                        />
                                        <span className="text-[9px] text-gray-600">{["HH","MM","SS"][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 12h / 24h & Seconds */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => updateElement(clk.id, { is24Hour: !clk.is24Hour })}
                            className={`flex-1 rounded-md border px-2 py-1.5 text-xs transition ${clk.is24Hour ? "border-blue-500 bg-blue-950/40 text-blue-200" : "border-gray-700 text-gray-400 hover:border-gray-500"}`}
                        >{clk.is24Hour ? "24h ✓" : "12h"}</button>
                        <button
                            type="button"
                            onClick={() => updateElement(clk.id, { showSeconds: !clk.showSeconds })}
                            className={`flex-1 rounded-md border px-2 py-1.5 text-xs transition ${clk.showSeconds ? "border-blue-500 bg-blue-950/40 text-blue-200" : "border-gray-700 text-gray-400 hover:border-gray-500"}`}
                        >{clk.showSeconds ? "Sec ✓" : "No Sec"}</button>
                    </div>

                    {/* Date */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-400">Date</label>
                            <button
                                type="button"
                                onClick={() => updateElement(clk.id, { showDate: !clk.showDate })}
                                className={`rounded-md border px-2 py-0.5 text-[10px] transition ${clk.showDate ? "border-blue-500 bg-blue-950/40 text-blue-200" : "border-gray-700 text-gray-500"}`}
                            >{clk.showDate ? "On" : "Off"}</button>
                        </div>
                        {clk.showDate && (
                            <div className="space-y-2">
                                <div className="flex gap-1.5">
                                    {(["live","custom"] as const).map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => updateElement(clk.id, { dateMode: m })}
                                            className={`flex-1 rounded-md border px-2 py-1.5 text-xs capitalize transition ${clk.dateMode === m ? "border-blue-500 bg-blue-950/40 text-blue-200" : "border-gray-700 text-gray-400 hover:border-gray-500"}`}
                                        >{m === "live" ? "Current" : "Custom"}</button>
                                    ))}
                                </div>
                                {clk.dateMode === "custom" && (
                                    <input
                                        type="text"
                                        value={clk.customDateStr}
                                        onChange={(e) => updateElement(clk.id, { customDateStr: e.target.value })}
                                        placeholder="DD/MM/YYYY or any string"
                                        className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500"
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Colors */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-gray-400">Colors</label>
                        <div className="space-y-2">
                            {([
                                ["bgColor",     "Background"],
                                ["textColor",   "Text / Hands"],
                                ["accentColor", "Accent / Sec Hand"],
                                ["borderColor", "Border"],
                            ] as const).map(([field, label]) => (
                                <div key={field} className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={clk[field]}
                                        onChange={(e) => updateElement(clk.id, { [field]: e.target.value })}
                                        className="h-8 w-10 cursor-pointer rounded border border-gray-700 bg-gray-900"
                                    />
                                    <span className="text-xs text-gray-400">{label}</span>
                                    <span className="ml-auto text-[10px] text-gray-600">{clk[field]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Border Width & Radius */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="mb-1 flex justify-between">
                                <label className="text-xs text-gray-400">Border</label>
                                <span className="text-[10px] text-gray-600">{clk.borderWidth}px</span>
                            </div>
                            <input type="range" min="0" max="8" step="1" value={clk.borderWidth}
                                onChange={(e) => updateElement(clk.id, { borderWidth: Number(e.target.value) })}
                                className="w-full" />
                        </div>
                        <div>
                            <div className="mb-1 flex justify-between">
                                <label className="text-xs text-gray-400">Radius</label>
                                <span className="text-[10px] text-gray-600">{clk.borderRadius}px</span>
                            </div>
                            <input type="range" min="0" max="64" step="2" value={clk.borderRadius}
                                onChange={(e) => updateElement(clk.id, { borderRadius: Number(e.target.value) })}
                                className="w-full" />
                        </div>
                    </div>

                    {/* Shadow */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-gray-400">Shadow</label>
                        <div className="flex gap-1.5">
                            {(["none","sm","md","lg"] as const).map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => updateElement(clk.id, { shadow: s })}
                                    className={`flex-1 rounded border px-2 py-1.5 text-xs transition ${clk.shadow === s ? "border-blue-500 bg-blue-950/40 text-blue-200" : "border-gray-700 text-gray-400 hover:border-gray-500"}`}
                                >{s}</button>
                            ))}
                        </div>
                    </div>

                    {/* Size */}
                    <div>
                        <div className="mb-2 flex justify-between">
                            <label className="text-xs font-medium text-gray-400">Size</label>
                            <span className="text-xs text-gray-500">{clk.size}%</span>
                        </div>
                        <input type="range" min="20" max="200" step="5" value={clk.size}
                            onChange={(e) => updateElement(clk.id, { size: Number(e.target.value) })}
                            className="w-full" />
                    </div>

                    {/* Rotation */}
                    <div>
                        <div className="mb-2 flex justify-between">
                            <label className="text-xs font-medium text-gray-400">Rotation</label>
                            <span className="text-xs text-gray-500">{clk.rotation}°</span>
                        </div>
                        <input type="range" min="-360" max="360" step="1" value={clk.rotation}
                            onChange={(e) => updateElement(clk.id, { rotation: Number(e.target.value) })}
                            className="w-full" />
                    </div>

                    {/* Opacity */}
                    <div>
                        <div className="mb-2 flex justify-between">
                            <label className="text-xs font-medium text-gray-400">Opacity</label>
                            <span className="text-xs text-gray-500">{Math.round((clk.opacity ?? 1) * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.05" value={clk.opacity ?? 1}
                            onChange={(e) => updateElement(clk.id, { opacity: Number(e.target.value) })}
                            className="w-full" />
                    </div>
                </div>
            );
        })() : null;

    // ── Background settings UI ──
    const defaultBg: DashboardBackgroundSettings = {
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
    };
    const bg = backgroundSettings ?? defaultBg;
    const upBg = updateBackgroundSettings;

    const backgroundSettingsContent = (
        <div className="mt-4 space-y-5">
            {/* Header */}
            <div className="rounded-lg border border-purple-800/50 bg-purple-900/20 px-3 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🎨</span>
                    <div>
                        <div className="text-sm font-medium text-white">Dashboard Background</div>
                        <div className="text-xs text-gray-400">Canvas-wide background settings</div>
                    </div>
                </div>
            </div>

            {/* Background Type */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Background Type</label>
                <div className="grid grid-cols-3 gap-1 rounded-lg border border-gray-700 bg-gray-900 p-1">
                    {(["solid", "gradient", "image"] as BackgroundType[]).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => upBg({ type: t })}
                            className={`rounded-md py-1.5 text-xs font-medium capitalize transition ${
                                bg.type === t
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* ─── SOLID ─── */}
            {bg.type === "solid" && (
                <div>
                    <label className="mb-2 block text-xs font-medium text-gray-400">Color</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={bg.color}
                            onChange={(e) => upBg({ color: e.target.value })}
                            className="h-9 w-12 cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                        <span className="text-sm text-gray-300">{bg.color}</span>
                    </div>
                </div>
            )}

            {/* ─── GRADIENT ─── */}
            {bg.type === "gradient" && (
                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-xs font-medium text-gray-400">Gradient Style</label>
                        <div className="flex gap-2">
                            {(["linear", "radial"] as const).map((gt) => (
                                <button
                                    key={gt}
                                    type="button"
                                    onClick={() => upBg({ gradientType: gt })}
                                    className={`flex-1 rounded-md border py-1.5 text-xs capitalize transition ${
                                        bg.gradientType === gt
                                            ? "border-purple-500 bg-purple-600/20 text-purple-300"
                                            : "border-gray-700 text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {gt}
                                </button>
                            ))}
                        </div>
                    </div>
                    {bg.gradientType === "linear" && (
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-xs font-medium text-gray-400">Angle</label>
                                <span className="text-xs text-gray-500">{bg.gradientAngle}°</span>
                            </div>
                            <input
                                type="range" min="0" max="360" step="1"
                                value={bg.gradientAngle}
                                onChange={(e) => upBg({ gradientAngle: Number(e.target.value) })}
                                className="w-full"
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs text-gray-400">Color 1</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={bg.gradientColor1}
                                    onChange={(e) => upBg({ gradientColor1: e.target.value })}
                                    className="h-8 w-10 cursor-pointer rounded border border-gray-700 bg-gray-900" />
                                <span className="text-xs text-gray-400">{bg.gradientColor1}</span>
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-gray-400">Color 2</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={bg.gradientColor2}
                                    onChange={(e) => upBg({ gradientColor2: e.target.value })}
                                    className="h-8 w-10 cursor-pointer rounded border border-gray-700 bg-gray-900" />
                                <span className="text-xs text-gray-400">{bg.gradientColor2}</span>
                            </div>
                        </div>
                    </div>
                    {/* Preview swatch */}
                    <div
                        className="h-10 w-full rounded-lg border border-gray-700"
                        style={{
                            background: bg.gradientType === "radial"
                                ? `radial-gradient(circle, ${bg.gradientColor1}, ${bg.gradientColor2})`
                                : `linear-gradient(${bg.gradientAngle}deg, ${bg.gradientColor1}, ${bg.gradientColor2})`,
                        }}
                    />
                </div>
            )}

            {/* ─── IMAGE ─── */}
            {bg.type === "image" && (
                <div className="space-y-4">
                    {/* Tab: upload vs URL */}
                    <div className="flex gap-1 rounded-lg border border-gray-700 bg-gray-900 p-1">
                        {(["upload", "url"] as const).map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setBgImageTab(tab)}
                                className={`flex-1 rounded-md py-1 text-xs capitalize transition ${
                                    bgImageTab === tab
                                        ? "bg-purple-600 text-white"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                {tab === "upload" ? "Upload File" : "Image URL"}
                            </button>
                        ))}
                    </div>
                    {bgImageTab === "upload" ? (
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-400">Upload Image</label>
                            <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-600 bg-gray-900 py-5 transition hover:border-purple-500">
                                <span className="text-2xl">🖼️</span>
                                <span className="text-xs text-gray-400">Click to choose image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const url = URL.createObjectURL(file);
                                        upBg({ imageUrl: url });
                                    }}
                                />
                            </label>
                            {bg.imageUrl && (
                                <div className="mt-2 overflow-hidden rounded-lg border border-gray-700">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={bg.imageUrl} alt="bg preview" className="h-20 w-full object-cover" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-400">Image URL</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={bg.imageUrl}
                                onChange={(e) => upBg({ imageUrl: e.target.value })}
                                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                            />
                        </div>
                    )}

                    {/* Image Fit */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-gray-400">Fit</label>
                        <div className="grid grid-cols-3 gap-1 rounded-lg border border-gray-700 bg-gray-900 p-1">
                            {(["cover", "contain", "tile"] as const).map((f) => (
                                <button key={f} type="button"
                                    onClick={() => upBg({ imageFit: f })}
                                    className={`rounded-md py-1 text-xs capitalize transition ${
                                        bg.imageFit === f
                                            ? "bg-purple-600 text-white"
                                            : "text-gray-400 hover:text-white"
                                    }`}
                                >{f}</button>
                            ))}
                        </div>
                    </div>

                    {/* Image Opacity */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-400">Image Opacity</label>
                            <span className="text-xs text-gray-500">{Math.round(bg.imageOpacity * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.05" value={bg.imageOpacity}
                            onChange={(e) => upBg({ imageOpacity: Number(e.target.value) })}
                            className="w-full" />
                    </div>

                    {/* Blur */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-400">Blur</label>
                            <span className="text-xs text-gray-500">{bg.imageBlur}px</span>
                        </div>
                        <input type="range" min="0" max="30" step="1" value={bg.imageBlur}
                            onChange={(e) => upBg({ imageBlur: Number(e.target.value) })}
                            className="w-full" />
                    </div>

                    {/* Overlay */}
                    <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                        <div className="text-xs font-medium text-gray-400">Color Overlay</div>
                        <div className="flex items-center gap-2">
                            <input type="color" value={bg.imageOverlayColor}
                                onChange={(e) => upBg({ imageOverlayColor: e.target.value })}
                                className="h-8 w-10 cursor-pointer rounded border border-gray-700 bg-gray-900" />
                            <span className="text-xs text-gray-400">{bg.imageOverlayColor}</span>
                        </div>
                        <div>
                            <div className="mb-1 flex items-center justify-between">
                                <label className="text-xs text-gray-400">Overlay Opacity</label>
                                <span className="text-xs text-gray-500">{Math.round(bg.imageOverlayOpacity * 100)}%</span>
                            </div>
                            <input type="range" min="0" max="1" step="0.05" value={bg.imageOverlayOpacity}
                                onChange={(e) => upBg({ imageOverlayOpacity: Number(e.target.value) })}
                                className="w-full" />
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Grid Dots ─── */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">Grid Dots</span>
                    <button
                        type="button"
                        onClick={() => upBg({ showGridDots: !bg.showGridDots })}
                        className={`relative h-5 w-9 rounded-full transition-colors ${
                            bg.showGridDots ? "bg-purple-600" : "bg-gray-700"
                        }`}
                    >
                        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                            bg.showGridDots ? "left-4" : "left-0.5"
                        }`} />
                    </button>
                </div>
                {bg.showGridDots && (
                    <>
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-400">Dot Color</label>
                            <input type="color" value={bg.gridDotsColor}
                                onChange={(e) => upBg({ gridDotsColor: e.target.value })}
                                className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900" />
                        </div>
                        <div>
                            <div className="mb-1 flex items-center justify-between">
                                <label className="text-xs text-gray-400">Dot Spacing</label>
                                <span className="text-xs text-gray-500">{bg.gridDotsSize}px</span>
                            </div>
                            <input type="range" min="10" max="50" step="2" value={bg.gridDotsSize}
                                onChange={(e) => upBg({ gridDotsSize: Number(e.target.value) })}
                                className="w-full" />
                        </div>
                    </>
                )}
            </div>

            {/* Reset button */}
            <button
                type="button"
                onClick={() => upBg(defaultBg)}
                className="w-full rounded-lg border border-gray-700 py-2 text-xs text-gray-400 transition hover:border-red-700 hover:bg-red-900/20 hover:text-red-400"
            >
                Reset to Default
            </button>
        </div>
    );

    const propertiesContent = isBackgroundMode
        ? backgroundSettingsContent
        : isEraserMode && !selectedElement
        ? eraserSettingsContent
        : isDrawMode && !selectedElement
        ? pencilSettingsContent
        : selectedElement && selectedElement.type === "draw"
        ? drawElementContent
        : selectedElement && selectedElement.type === "table"
        ? tableElementContent
        : selectedElement && selectedElement.type === "clock"
        ? clockElementContent
        : selectedElement && selectedElement.type === "timeline"
        ? (
            <TimelineProperties
                selectedElement={selectedElement as TimelineElement}
                updateElement={updateElement as any}
            />
        )
        : selectedElement && selectedElement.type === "card"
        ? (
            <CardProperties
                selectedElement={selectedElement as CardElement}
                updateElement={updateElement as any}
            />
        )

        : selectedElement && selectedElement.type === "text" ? (
        <div className="mt-6 space-y-5">

            {/* Element Information */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">
                    Element {selectedElement.serialNumber}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                    Type:{" "}
                    {selectedElement.type
                        .charAt(0)
                        .toUpperCase() +
                        selectedElement.type.slice(1)}
                </div>
            </div>

            {/* Text */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Text
                </label>

                <input
                    type="text"
                    value={selectedElement.text}
                    onChange={(event) =>
                        updateElement(selectedElement.id, {
                            text: event.target.value,
                        })
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-gray-500"
                />
            </div>

            {/* Font Size */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Font Size
                </label>

                <input
                    type="number"
                    min="1"
                    value={selectedElement.fontSize}
                    onChange={(event) =>
                        updateElement(selectedElement.id, {
                            fontSize: Number(
                                event.target.value
                            ),
                        })
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-gray-500"
                />
            </div>

            {/* Font Weight */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">
                        Font Weight
                    </label>

                    <span className="text-xs text-gray-500">
                        {selectedElement.fontWeight}
                    </span>
                </div>

                <input
                    type="range"
                    min="300"
                    max="900"
                    step="100"
                    value={selectedElement.fontWeight}
                    onChange={(event) =>
                        updateElement(selectedElement.id, {
                            fontWeight: Number(event.target.value),
                        })
                    }
                    className="w-full"
                />

                <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                    <span>Light</span>
                    <span>Normal</span>
                    <span>Bold</span>
                    <span>Black</span>
                </div>
            </div>

            {/* Font Family */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Font Family
                </label>

                <select
                    value={selectedElement.fontFamily}
                    onChange={(event) =>
                        updateElement(selectedElement.id, {
                            fontFamily: event.target.value,
                        })
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-gray-500"
                >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Tahoma">Tahoma</option>
                    <option value="Trebuchet MS">Trebuchet MS</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Garamond">Garamond</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Lucida Console">Lucida Console</option>
                    <option value="Impact">Impact</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                    <option value="Arial Black">Arial Black</option>
                    <option value="Palatino Linotype">Palatino Linotype</option>
                    <option value="Book Antiqua">Book Antiqua</option>
                </select>
            </div>

            {/* Font Style */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Font Style
                </label>

                <select
                    value={
                        selectedElement.fontStyle === "italic-underline" ||
                        (selectedElement.fontStyle === "italic" && selectedElement.underline)
                            ? "italic-underline"
                            : selectedElement.underline || selectedElement.fontStyle === "underline"
                            ? "underline"
                            : selectedElement.fontStyle === "italic"
                            ? "italic"
                            : "normal"
                    }
                    onChange={(event) => {
                        const value = event.target.value;
                        if (value === "italic") {
                            updateElement(selectedElement.id, {
                                fontStyle: "italic",
                                underline: false,
                            });
                        } else if (value === "underline") {
                            updateElement(selectedElement.id, {
                                fontStyle: "underline",
                                underline: true,
                            });
                        } else if (value === "italic-underline") {
                            updateElement(selectedElement.id, {
                                fontStyle: "italic-underline",
                                underline: true,
                            });
                        } else {
                            updateElement(selectedElement.id, {
                                fontStyle: "normal",
                                underline: false,
                            });
                        }
                    }}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-gray-500"
                >
                    <option value="normal">Normal</option>
                    <option value="italic">Italic</option>
                    <option value="underline">Underline</option>
                    <option value="italic-underline">Italic & Underline</option>
                </select>
            </div>

            {/* Color */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Color
                </label>

                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={selectedElement.color}
                        onChange={(event) =>
                            updateElement(selectedElement.id, {
                                color: event.target.value,
                            })
                        }
                        className="h-9 w-12 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />

                    <span className="text-sm text-gray-300">
                        {selectedElement.color}
                    </span>
                </div>
            </div>

            {/* Background Color */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Background Color
                </label>

                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={
                            selectedElement.backgroundColor &&
                            selectedElement.backgroundColor !== "transparent"
                                ? selectedElement.backgroundColor
                                : "#ffffff"
                        }
                        onChange={(event) =>
                            updateElement(selectedElement.id, {
                                backgroundColor: event.target.value,
                            })
                        }
                        className="h-9 w-12 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />

                    <span className="text-sm text-gray-300">
                        {selectedElement.backgroundColor &&
                        selectedElement.backgroundColor !== "transparent"
                            ? selectedElement.backgroundColor
                            : "Transparent"}
                    </span>

                    {selectedElement.backgroundColor &&
                        selectedElement.backgroundColor !== "transparent" && (
                            <button
                                type="button"
                                onClick={() =>
                                    updateElement(selectedElement.id, {
                                        backgroundColor: "transparent",
                                    })
                                }
                                className="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-400 transition hover:bg-gray-700 hover:text-white"
                                title="Reset to transparent"
                            >
                                Clear
                            </button>
                        )}
                </div>
            </div>

            {/* Rotation */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">
                        Rotation
                    </label>

                    <span className="text-xs text-gray-500">
                        {selectedElement.rotation}°
                    </span>
                </div>

                <input
                    type="range"
                    min="-360"
                    max="360"
                    step="1"
                    value={selectedElement.rotation}
                    onChange={(event) =>
                        updateElement(selectedElement.id, {
                            rotation: Number(
                                event.target.value
                            ),
                        })
                    }
                    className="w-full"
                />
            </div>
        </div>
    ) : (
        <p className="mt-6 text-center text-sm text-gray-500">
            Select an element to edit its properties.
        </p>
    );

    return (
        <>
            {/* Right Panel */}
            {!isPropertiesMinimised &&
                !isPropertiesFloating && (
                    <aside
                        ref={panelRef}
                        className="relative flex h-full w-72 shrink-0 flex-col border-l border-gray-800 p-5"
                    >
                        <div className="relative flex shrink-0 items-center justify-center">

                            <h2 className="text-sm font-semibold text-gray-300">
                                Properties
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsMenuOpen(
                                        (prev) => !prev
                                    )
                                }
                                className="absolute right-0 flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-800 hover:text-white"
                            >
                                <MoreVertical size={18} />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 top-10 z-50 w-32 rounded-lg border border-gray-700 bg-gray-900 p-1 shadow-lg">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsPropertiesMinimised(
                                                true
                                            );
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                                    >
                                        Minimise
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleFloat}
                                        className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                                    >
                                        Float
                                    </button>

                                </div>
                            )}

                        </div>

                        {/* Scrollable Properties Content */}
                        <div
                            className="min-h-0 flex-1 overflow-y-auto pr-1"
                            style={{
                                scrollbarWidth: "thin",
                                scrollbarColor: "white transparent",
                            }}
                        >
                            {propertiesContent}
                        </div>
                    </aside>
                )}

            {/* Floating Properties Panel */}
            {!isPropertiesMinimised &&
                isPropertiesFloating && (
                    <aside
                        className="fixed z-50 flex h-[500px] w-72 flex-col rounded-xl border border-gray-700 bg-black p-5 shadow-2xl"
                        style={{
                            left: floatingPosition.x,
                            top: floatingPosition.y,
                        }}
                    >
                        <div
                            onPointerDown={handlePointerDown}
                            className="relative mb-4 flex shrink-0 cursor-move touch-none items-center justify-center select-none"
                        >

                            <h2 className="text-sm font-semibold text-gray-300">
                                Properties
                            </h2>

                            <button
                                type="button"
                                onPointerDown={(event) =>
                                    event.stopPropagation()
                                }
                                onClick={() =>
                                    setIsMenuOpen(
                                        (prev) => !prev
                                    )
                                }
                                className="absolute right-0 flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-800 hover:text-white"
                            >
                                <MoreVertical size={18} />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 top-10 z-50 w-32 rounded-lg border border-gray-700 bg-gray-900 p-1 shadow-lg">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsPropertiesMinimised(
                                                true
                                            );
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                                    >
                                        Minimise
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsPropertiesFloating(
                                                false
                                            );
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                                    >
                                        Dock
                                    </button>

                                </div>
                            )}

                        </div>

                        {/* Scrollable Properties Content */}
                        <div
                            className="min-h-0 flex-1 overflow-y-auto pr-1"
                            style={{
                                scrollbarWidth: "thin",
                                scrollbarColor: "white transparent",
                            }}
                        >
                            {propertiesContent}
                        </div>
                    </aside>
                )}

            {/* Restore Properties Panel */}
            {isPropertiesMinimised && (
                <button
                    type="button"
                    onClick={() =>
                        setIsPropertiesMinimised(false)
                    }
                    className="absolute right-2 top-20 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 bg-gray-900 text-gray-400 shadow-lg transition hover:border-gray-500 hover:bg-gray-800 hover:text-white"
                    title="Show Properties"
                >
                    <PanelRightOpen size={18} />
                </button>
            )}
        </>
    );
}