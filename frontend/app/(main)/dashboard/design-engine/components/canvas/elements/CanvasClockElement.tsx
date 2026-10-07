import React from "react";
import { X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type {
    CanvasElement,
    ClockElement,
    EraserSettings,
} from "../../../types/elements";
import {
    pointsToSvgPath,
    canvasPointsToElementLocal,
} from "../../../utils/canvasUtils";
import {
    ClockFaceProps,
    AnalogClassicFace,
    AnalogSwissFace,
    DigitalNeonFace,
    FlipCardFace,
    SmartwatchFace,
    DigitalMinimalFace,
} from "./clock";

type CanvasClockElementProps = {
    element: ClockElement;
    isSelected: boolean;
    isEraserMode: boolean;
    isErasing: boolean;
    currentEraserPoints: { x: number; y: number }[] | null;
    eraserSettings: EraserSettings;
    handlePointerDown: (
        event: ReactPointerEvent,
        element: CanvasElement
    ) => void;
    deleteElement: (id: string) => void;
};

export function CanvasClockElement({
    element: clk,
    isSelected,
    isEraserMode,
    isErasing,
    currentEraserPoints,
    eraserSettings,
    handlePointerDown,
    deleteElement,
}: CanvasClockElementProps) {
    const clockW = 300;
    const clockH = 190;
    const scale = (clk.size ?? 100) / 100;

    // ── Compute display time ──
    let totalSeconds: number;
    if (clk.timeMode === "live") {
        const now = new Date();
        totalSeconds =
            now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    } else if (clk.timeMode === "custom") {
        const base =
            clk.customHour * 3600 +
            clk.customMinute * 60 +
            clk.customSecond;
        const elapsed = Math.floor(
            (Date.now() - clk.startEpochMs) / 1000
        );
        totalSeconds = base + elapsed;
    } else {
        totalSeconds =
            clk.customHour * 3600 +
            clk.customMinute * 60 +
            clk.customSecond;
    }

    const displayH = Math.floor(totalSeconds / 3600) % 24;
    const displayM = Math.floor(totalSeconds / 60) % 60;
    const displayS = totalSeconds % 60;

    const h12 = clk.is24Hour
        ? displayH
        : displayH % 12 === 0
        ? 12
        : displayH % 12;
    const ampm = displayH < 12 ? "AM" : "PM";
    const pad = (n: number) => String(n).padStart(2, "0");
    const timeStr = clk.showSeconds
        ? `${pad(h12)}:${pad(displayM)}:${pad(displayS)}`
        : `${pad(h12)}:${pad(displayM)}`;

    // ── Date string ──
    const now = new Date();
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
    ];
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const dayNum = pad(now.getDate());
    const yearNum = now.getFullYear();
    const liveFormattedDate = `${dayName} • ${dayNum} ${monthName} ${yearNum}`;
    const dateDisplayStr = clk.showDate
        ? clk.dateMode === "live"
            ? liveFormattedDate
            : clk.customDateStr
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
                  canvasPointsToElementLocal(currentEraserPoints, {
                      x: clk.x,
                      y: clk.y,
                      width: clockW,
                      height: clockH,
                      rotation: clk.rotation,
                      size: clk.size,
                  })
              )
            : null;

    const hasClockMask =
        (clk.eraserPaths && clk.eraserPaths.length > 0) ||
        Boolean(liveClockEraserPath);

    // ── Render clock body by design ──
    const faceProps: ClockFaceProps = {
        clk,
        clockW,
        clockH,
        displayH,
        displayM,
        displayS,
        h12,
        ampm,
        pad,
        timeStr,
        dateDisplayStr,
        hourAngle,
        minuteAngle,
        secondAngle,
        now,
    };

    const renderClockFace = () => {
        switch (clk.design) {
            case "analog-classic":
                return <AnalogClassicFace {...faceProps} />;
            case "analog-swiss":
                return <AnalogSwissFace {...faceProps} />;
            case "digital-neon":
                return <DigitalNeonFace {...faceProps} />;
            case "flip-card":
                return <FlipCardFace {...faceProps} />;
            case "smartwatch":
                return <SmartwatchFace {...faceProps} />;
            case "digital-minimal":
            default:
                return <DigitalMinimalFace {...faceProps} />;
        }
    };

    return (
        <div
            key={clk.id}
            data-element-id={clk.id}
            onPointerDown={(event) => handlePointerDown(event, clk)}
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
                WebkitMask: hasClockMask
                    ? `url(#eraser-mask-${clk.id})`
                    : undefined,
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
                    <mask
                        id={`eraser-mask-${clk.id}`}
                        maskUnits="userSpaceOnUse"
                    >
                        <rect
                            x="-5000"
                            y="-5000"
                            width="10000"
                            height="10000"
                            fill="white"
                        />
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
                    <filter
                        id={`neon-glow-${clk.id}`}
                        x="-30%"
                        y="-30%"
                        width="160%"
                        height="160%"
                    >
                        <feGaussianBlur stdDeviation="2.5" result="blur1" />
                        <feGaussianBlur stdDeviation="6" result="blur2" />
                        <feMerge>
                            <feMergeNode in="blur2" />
                            <feMergeNode in="blur1" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient
                        id={`titanium-${clk.id}`}
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                    >
                        <stop offset="0%" stopColor="#2c303c" />
                        <stop offset="50%" stopColor="#1e222a" />
                        <stop offset="100%" stopColor="#12151b" />
                    </linearGradient>
                    <linearGradient
                        id={`glass-shine-${clk.id}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopColor="#ffffff"
                            stopOpacity="0.12"
                        />
                        <stop
                            offset="100%"
                            stopColor="#ffffff"
                            stopOpacity="0"
                        />
                    </linearGradient>
                    <linearGradient
                        id={`flip-top-${clk.id}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop offset="0%" stopColor="#242733" />
                        <stop offset="100%" stopColor="#1b1d26" />
                    </linearGradient>
                    <linearGradient
                        id={`flip-bot-${clk.id}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop offset="0%" stopColor="#151720" />
                        <stop offset="100%" stopColor="#0d0f14" />
                    </linearGradient>
                </defs>

                <g
                    mask={
                        hasClockMask
                            ? `url(#eraser-mask-${clk.id})`
                            : undefined
                    }
                >
                    {renderClockFace()}
                </g>
            </svg>
        </div>
    );
}
