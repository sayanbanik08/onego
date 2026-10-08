"use client";

import React, { useRef, useState, useEffect } from "react";
import {
    Paintbrush,
    Pencil,
    Eraser,
    PaintBucket,
    RotateCcw,
    RotateCw,
    Trash2,
    X,
    Eye,
    Sparkles,
} from "lucide-react";

type MsPaintTool =
    | "pencil"
    | "brush"
    | "eraser"
    | "bucket";

const MS_PAINT_PALETTE = [
    "#000000",
    "#7f7f7f",
    "#880015",
    "#ed1c24",
    "#ff7f27",
    "#fff200",
    "#22b14c",
    "#00a2e8",
    "#3f48cc",
    "#a349a4",
    "#ffffff",
    "#c3c3c3",
    "#b97a57",
    "#ffaec9",
    "#ffc90e",
    "#efe4b0",
    "#b5e61d",
    "#99d9ea",
    "#7092be",
    "#c8bfe7",
    "#38bdf8",
    "#ec4899",
    "#8b5cf6",
    "#10b981",
];

type MsPaintButtonStudioProps = {
    isOpen: boolean;
    onClose: () => void;
    onApplyShape: (dataUrl: string, width: number, height: number) => void;
    onClearShape: () => void;
    hasExistingShape: boolean;
    buttonText: string;
    textColor: string;
    fontFamily: string;
    fontSize: number;
};

export default function MsPaintButtonStudio({
    isOpen,
    onClose,
    onApplyShape,
    onClearShape,
    hasExistingShape,
    buttonText,
    textColor,
    fontFamily,
    fontSize,
}: MsPaintButtonStudioProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [tool, setTool] = useState<MsPaintTool>("pencil");
    const [primaryColor, setPrimaryColor] = useState<string>("#3b82f6");
    const [strokeWidth, setStrokeWidth] = useState<number>(4);
    const [showTextPreview, setShowTextPreview] = useState<boolean>(true);

    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    const [history, setHistory] = useState<ImageData[]>([]);
    const [historyStep, setHistoryStep] = useState<number>(-1);

    const CANVAS_WIDTH = 400;
    const CANVAS_HEIGHT = 180;

    // Initialize or clear canvas
    useEffect(() => {
        if (!isOpen) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        // Save initial blank state
        const initialImg = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        setHistory([initialImg]);
        setHistoryStep(0);
    }, [isOpen]);

    const saveHistory = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const currentImg = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(currentImg);
        // Limit history to 20 steps
        if (newHistory.length > 20) newHistory.shift();
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
    };

    const handleUndo = () => {
        if (historyStep <= 0) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const prevStep = historyStep - 1;
        ctx.putImageData(history[prevStep], 0, 0);
        setHistoryStep(prevStep);
    };

    const handleRedo = () => {
        if (historyStep >= history.length - 1) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const nextStep = historyStep + 1;
        ctx.putImageData(history[nextStep], 0, 0);
        setHistoryStep(nextStep);
    };

    const handleClearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        saveHistory();
    };

    // ── Flood Fill Algorithm for Paint Bucket ───────────────────────────
    const floodFill = (startX: number, startY: number, fillColor: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const imgData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const data = imgData.data;

        // Parse hex / rgb color to RGBA
        const tempEl = document.createElement("div");
        tempEl.style.color = fillColor;
        document.body.appendChild(tempEl);
        const computed = getComputedStyle(tempEl).color;
        document.body.removeChild(tempEl);
        const match = computed.match(/\d+/g);
        if (!match) return;

        const fillR = Number(match[0]);
        const fillG = Number(match[1]);
        const fillB = Number(match[2]);
        const fillA = match[3] !== undefined ? Math.round(Number(match[3]) * 255) : 255;

        const startIdx = (startY * CANVAS_WIDTH + startX) * 4;
        const targetR = data[startIdx];
        const targetG = data[startIdx + 1];
        const targetB = data[startIdx + 2];
        const targetA = data[startIdx + 3];

        if (
            targetR === fillR &&
            targetG === fillG &&
            targetB === fillB &&
            targetA === fillA
        ) {
            return;
        }

        const colorMatch = (idx: number) => {
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];
            // Match with threshold tolerance 35
            return (
                Math.abs(r - targetR) <= 35 &&
                Math.abs(g - targetG) <= 35 &&
                Math.abs(b - targetB) <= 35 &&
                Math.abs(a - targetA) <= 35
            );
        };

        const queue: [number, number][] = [[startX, startY]];
        const visited = new Uint8Array(CANVAS_WIDTH * CANVAS_HEIGHT);

        while (queue.length > 0) {
            const [cx, cy] = queue.pop()!;
            const pos = cy * CANVAS_WIDTH + cx;
            if (visited[pos]) continue;
            visited[pos] = 1;

            const idx = pos * 4;
            if (!colorMatch(idx)) continue;

            data[idx] = fillR;
            data[idx + 1] = fillG;
            data[idx + 2] = fillB;
            data[idx + 3] = fillA;

            if (cx > 0) queue.push([cx - 1, cy]);
            if (cx < CANVAS_WIDTH - 1) queue.push([cx + 1, cy]);
            if (cy > 0) queue.push([cx, cy - 1]);
            if (cy < CANVAS_HEIGHT - 1) queue.push([cx, cy + 1]);
        }

        ctx.putImageData(imgData, 0, 0);
        saveHistory();
    };

    // ── Mouse Pointer Handlers ──────────────────────────────────────────
    const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };
        const scaleX = CANVAS_WIDTH / rect.width;
        const scaleY = CANVAS_HEIGHT / rect.height;
        return {
            x: Math.round((e.clientX - rect.left) * scaleX),
            y: Math.round((e.clientY - rect.top) * scaleY),
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const coords = getCanvasCoords(e);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        if (tool === "bucket") {
            floodFill(coords.x, coords.y, primaryColor);
            return;
        }

        setIsDrawing(true);

        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);

        if (tool === "pencil" || tool === "brush") {
            ctx.strokeStyle = primaryColor;
            ctx.fillStyle = primaryColor;
            ctx.lineWidth = tool === "pencil" ? 2 : strokeWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineTo(coords.x + 0.1, coords.y + 0.1);
            ctx.stroke();
        } else if (tool === "eraser") {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = strokeWidth * 2;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineTo(coords.x + 0.1, coords.y + 0.1);
            ctx.stroke();
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const coords = getCanvasCoords(e);

        if (tool === "pencil" || tool === "brush") {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = tool === "pencil" ? 2 : strokeWidth;
            ctx.lineTo(coords.x, coords.y);
            ctx.stroke();
        } else if (tool === "eraser") {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = strokeWidth * 2;
            ctx.lineTo(coords.x, coords.y);
            ctx.stroke();
        }
    };

    const handleMouseUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.globalCompositeOperation = "source-over";
        }
        saveHistory();
    };

    const handleApply = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL("image/png");
        onApplyShape(dataUrl, CANVAS_WIDTH, CANVAS_HEIGHT);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative flex flex-col w-full max-w-2xl rounded-xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden text-white">
                {/* ── Title Bar ── */}
                <div className="flex items-center justify-between border-b border-gray-800 bg-gradient-to-r from-blue-950 via-gray-900 to-gray-950 px-4 py-2.5">
                    <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-sm shadow">
                            🎨
                        </span>
                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-wide">
                                Paint Studio
                            </h3>
                            <p className="text-[11px] text-gray-400">
                                Draw a custom button shape & convert to interactive button
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ── Tools Ribbon ── */}
                <div className="flex flex-wrap items-center gap-3 border-b border-gray-800 bg-gray-950/70 p-3">
                    {/* Tools Palette */}
                    <div className="flex items-center gap-1 rounded-lg border border-gray-800 bg-gray-900 p-1">
                        <ToolButton
                            active={tool === "pencil"}
                            onClick={() => setTool("pencil")}
                            title="Pencil (2px freehand)"
                            icon={<Pencil size={15} />}
                        />
                        <ToolButton
                            active={tool === "brush"}
                            onClick={() => setTool("brush")}
                            title="Brush"
                            icon={<Paintbrush size={15} />}
                        />
                        <ToolButton
                            active={tool === "bucket"}
                            onClick={() => setTool("bucket")}
                            title="Paint Bucket (Flood Fill Color)"
                            icon={<PaintBucket size={15} />}
                            highlight
                        />
                        <ToolButton
                            active={tool === "eraser"}
                            onClick={() => setTool("eraser")}
                            title="Eraser"
                            icon={<Eraser size={15} />}
                        />
                    </div>

                    {/* Stroke Width */}
                    <div className="flex items-center gap-1.5 px-2">
                        <span className="text-[11px] text-gray-400">Brush:</span>
                        {[2, 4, 8, 14].map((w) => (
                            <button
                                key={w}
                                type="button"
                                onClick={() => setStrokeWidth(w)}
                                className={`flex h-6 w-6 items-center justify-center rounded border text-[10px] font-mono transition ${
                                    strokeWidth === w
                                        ? "border-blue-500 bg-blue-600/30 text-blue-300"
                                        : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                                }`}
                            >
                                {w}
                            </button>
                        ))}
                    </div>

                    {/* Undo / Redo / Clear */}
                    <div className="ml-auto flex items-center gap-1">
                        <button
                            type="button"
                            onClick={handleUndo}
                            disabled={historyStep <= 0}
                            className="rounded p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30 transition"
                            title="Undo (Ctrl+Z)"
                        >
                            <RotateCcw size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={handleRedo}
                            disabled={historyStep >= history.length - 1}
                            className="rounded p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30 transition"
                            title="Redo"
                        >
                            <RotateCw size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={handleClearCanvas}
                            className="rounded p-1.5 text-red-400 hover:bg-red-950/40 hover:text-red-300 transition"
                            title="Clear Canvas"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                </div>

                {/* ── Color Palette Swatches ── */}
                <div className="flex flex-wrap items-center gap-2 border-b border-gray-800 bg-gray-950/40 px-4 py-2">
                    {/* Primary Color Indicator */}
                    <div className="relative flex items-center gap-2 pr-2 border-r border-gray-800">
                        <div className="text-[10px] text-gray-400">Color:</div>
                        <div
                            className="h-6 w-6 rounded border border-gray-600 shadow-inner cursor-pointer"
                            style={{ backgroundColor: primaryColor }}
                            onClick={() => {
                                const el = document.getElementById("paint-color-picker");
                                if (el) el.click();
                            }}
                        />
                        <input
                            id="paint-color-picker"
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="h-0 w-0 overflow-hidden opacity-0 absolute"
                        />
                    </div>

                    {/* 24 Swatches */}
                    <div className="flex flex-wrap gap-1">
                        {MS_PAINT_PALETTE.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setPrimaryColor(c)}
                                className={`h-5 w-5 rounded-sm border transition-transform hover:scale-110 ${
                                    primaryColor === c
                                        ? "border-white ring-1 ring-white"
                                        : "border-gray-800"
                                }`}
                                style={{ backgroundColor: c }}
                                title={c}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Canvas Work Area (With Checkered Transparency Grid) ── */}
                <div className="relative flex flex-col items-center justify-center p-6 bg-neutral-950">
                    <div
                        className="relative rounded-lg border-2 border-dashed border-gray-700 shadow-xl overflow-hidden"
                        style={{
                            backgroundImage: `
                                linear-gradient(45deg, #18181b 25%, transparent 25%),
                                linear-gradient(-45deg, #18181b 25%, transparent 25%),
                                linear-gradient(45deg, transparent 75%, #18181b 75%),
                                linear-gradient(-45deg, transparent 75%, #18181b 75%)
                            `,
                            backgroundSize: "20px 20px",
                            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                            backgroundColor: "#09090b",
                        }}
                    >
                        <canvas
                            ref={canvasRef}
                            width={CANVAS_WIDTH}
                            height={CANVAS_HEIGHT}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            className={`block cursor-${
                                tool === "bucket"
                                    ? "pointer"
                                    : tool === "eraser"
                                    ? "cell"
                                    : "crosshair"
                            }`}
                        />

                        {/* Text Preview Overlay */}
                        {showTextPreview && (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <span
                                    className="px-3 py-1 font-medium tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] opacity-90"
                                    style={{
                                        fontFamily,
                                        fontSize: `${fontSize}px`,
                                        color: textColor || "#ffffff",
                                    }}
                                >
                                    {buttonText || "Button Text"}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Preview Toggle & Info */}
                    <div className="mt-3 flex items-center justify-between w-full max-w-[400px] text-xs text-gray-400">
                        <button
                            type="button"
                            onClick={() => setShowTextPreview(!showTextPreview)}
                            className="flex items-center gap-1.5 hover:text-white transition"
                        >
                            <Eye size={14} />
                            <span>{showTextPreview ? "Hide" : "Show"} Text Preview</span>
                        </button>
                        <span className="font-mono text-[11px] text-gray-500">
                            400 × 180 px
                        </span>
                    </div>
                </div>

                {/* ── Studio Footer Actions ── */}
                <div className="flex items-center justify-between border-t border-gray-800 bg-gray-950 px-4 py-3">
                    {hasExistingShape ? (
                        <button
                            type="button"
                            onClick={() => {
                                onClearShape();
                                onClose();
                            }}
                            className="rounded-lg border border-red-800 bg-red-950/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-900/60 transition"
                        >
                            Remove Custom Shape
                        </button>
                    ) : (
                        <span className="text-xs text-gray-500">
                            Draw any shape, fill with bucket, then Apply!
                        </span>
                    )}

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleApply}
                            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-blue-500 active:scale-95 transition"
                        >
                            <Sparkles size={14} />
                            <span>Apply as Button Shape</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToolButton({
    active,
    onClick,
    title,
    icon,
    highlight,
}: {
    active: boolean;
    onClick: () => void;
    title: string;
    icon: React.ReactNode;
    highlight?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`flex h-7 w-7 items-center justify-center rounded transition ${
                active
                    ? "bg-blue-600 text-white shadow-sm"
                    : highlight
                    ? "text-blue-400 hover:bg-gray-800 hover:text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
        >
            {icon}
        </button>
    );
}
