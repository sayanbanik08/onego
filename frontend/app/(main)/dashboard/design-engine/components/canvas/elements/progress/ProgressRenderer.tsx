"use client";

import React from "react";
import type { ProgressElement } from "../../../../types/progress";
import { getProgressDropShadowFilter } from "./progressHelpers";

type ProgressRendererProps = {
    element: ProgressElement;
    isInteractive?: boolean;
    onProgressClick?: (e: React.MouseEvent) => void;
};

export function ProgressRenderer({
    element,
    isInteractive = false,
    onProgressClick,
}: ProgressRendererProps) {
    const {
        designPreset,
        items = [],
        width,
        widthUnit,
        height,
        heightUnit,
        itemSpacing = 20,
        barWidth = 32,
        borderRadius = 4,
        borderRadiusUnit = "px",
        barColor = "#ffff00",
        trackColor = "#f0f0f2",
        cardBgColor = "transparent",
        cardBorderColor = "transparent",
        cardBorderWidth = 0,
        cardBorderStyle = "none",
        cardBorderRadius = 12,
        showValues = true,
        showLabels = true,
        showYAxis = false,
        showGridLines = false,
        valueColor = "#4b5563",
        labelColor = "#6b7280",
        axisColor = "#94a3b8",
        fontSize = 11,
    } = element;

    const w = widthUnit === "%" ? `${width}%` : `${width}px`;
    const h = heightUnit === "%" ? `${height}%` : `${height}px`;
    const barRadius = `${borderRadius}${borderRadiusUnit}`;
    const dropShadowFilter = getProgressDropShadowFilter(element);

    // Use drop-shadow filter (not boxShadow) so the shadow hugs the actual
    // bars/content — not the invisible transparent container rectangle.
    const containerStyle: React.CSSProperties = {
        width: w,
        height: h,
        backgroundColor: cardBgColor || "transparent",
        border:
            cardBorderStyle === "none" || cardBorderWidth === 0
                ? "none"
                : `${cardBorderWidth}px ${cardBorderStyle} ${cardBorderColor}`,
        borderRadius: `${cardBorderRadius}px`,
        filter: dropShadowFilter !== "none" ? dropShadowFilter : undefined,
    };

    const resolvedAxisColor = axisColor || "#94a3b8";

    // ── 1. Vertical Pill Layout (Matches user's attached screenshot!) ─────────
    if (designPreset === "vertical-pill") {
        return (
            <div
                style={containerStyle}
                className="relative flex flex-col p-4 select-none box-border"
                onClick={onProgressClick}
            >
                <div className="relative flex flex-1 w-full min-h-0">
                    {/* Optional Y-Axis ticks & line */}
                    {showYAxis && (
                        <div
                            className="flex flex-col justify-between items-end pr-2.5 pb-6 text-[10px] font-mono shrink-0 select-none border-r-[1.5px]"
                            style={{
                                borderColor: resolvedAxisColor,
                                color: labelColor || "#6b7280",
                            }}
                        >
                            <span>100%</span>
                            <span>75%</span>
                            <span>50%</span>
                            <span>25%</span>
                            <span>0%</span>
                        </div>
                    )}

                    {/* Chart Core Area */}
                    <div className="relative flex flex-1 flex-col h-full min-w-0">
                        {/* Optional Horizontal Gridlines (Fix 4: Crisp & clearly visible) */}
                        {showGridLines && (
                            <div className="pointer-events-none absolute inset-x-0 top-6 bottom-7 flex flex-col justify-between z-0">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-full border-b border-dashed"
                                        style={{
                                            borderColor: resolvedAxisColor,
                                            borderBottomWidth: "1px",
                                            opacity: 0.65,
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Bars Container */}
                        <div
                            style={{ gap: `${itemSpacing}px` }}
                            className="relative z-10 flex flex-1 items-stretch justify-around px-2"
                        >
                            {items.map((item) => {
                                const fillPercentage = Math.max(
                                    0,
                                    Math.min(100, item.value ?? 0)
                                );
                                const activeBarColor = item.color || barColor || "#ffff00";
                                const activeTrackColor =
                                    item.trackColor || trackColor || "#f0f0f2";

                                return (
                                    <div
                                        key={item.id}
                                        style={{ width: `${barWidth}px` }}
                                        className="flex flex-col items-center justify-end h-full min-w-0 shrink-0 group"
                                    >
                                        {/* Value Label (Top) */}
                                        {showValues && (
                                            <span
                                                style={{
                                                    color: valueColor,
                                                    fontSize: `${fontSize}px`,
                                                }}
                                                className="mb-1.5 font-medium tracking-tight text-center select-none"
                                            >
                                                {fillPercentage}%
                                            </span>
                                        )}

                                        {/* Pill Track & Fill */}
                                        <div
                                            style={{
                                                backgroundColor: activeTrackColor,
                                                borderRadius: barRadius,
                                                width: `${barWidth}px`,
                                            }}
                                            className="relative flex-1 w-full overflow-hidden transition-all duration-200 group-hover:brightness-105"
                                        >
                                            {/* Filled Bar from bottom */}
                                            <div
                                                style={{
                                                    height: `${fillPercentage}%`,
                                                    backgroundColor: activeBarColor,
                                                    borderRadius: barRadius,
                                                    transition:
                                                        "height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                                                }}
                                                className="absolute bottom-0 left-0 right-0 w-full"
                                            />
                                        </div>

                                        {/* Item Name / Label (Bottom) */}
                                        {showLabels && (
                                            <span
                                                style={{
                                                    color: labelColor,
                                                    fontSize: `${fontSize}px`,
                                                }}
                                                className="mt-2 text-center font-normal truncate max-w-full select-none"
                                                title={item.label}
                                            >
                                                {item.label}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* X-Axis baseline (Fix 3: Always shown!) */}
                        <div
                            style={{
                                borderColor: resolvedAxisColor,
                                bottom: showLabels ? `${fontSize + 14}px` : "0px",
                                borderBottomWidth: "1.5px",
                            }}
                            className="absolute inset-x-0 pointer-events-none z-10"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // ── 2. Horizontal Progress Bars ───────────────────────────────────────────
    if (designPreset === "horizontal-bar") {
        return (
            <div
                style={containerStyle}
                className="relative flex flex-col justify-center p-4 select-none box-border overflow-hidden"
                onClick={onProgressClick}
            >
                <div
                    style={{ gap: `${itemSpacing}px` }}
                    className="flex flex-col w-full h-full justify-around overflow-y-auto pr-1"
                >
                    {items.map((item) => {
                        const fill = Math.max(0, Math.min(100, item.value ?? 0));
                        const activeBarColor = item.color || barColor;

                        return (
                            <div
                                key={item.id}
                                className="flex flex-col gap-1 w-full group"
                            >
                                <div className="flex items-center justify-between">
                                    {showLabels && (
                                        <span
                                            style={{
                                                color: labelColor,
                                                fontSize: `${fontSize}px`,
                                            }}
                                            className="font-medium truncate max-w-[70%]"
                                        >
                                            {item.label}
                                        </span>
                                    )}
                                    {showValues && (
                                        <span
                                            style={{
                                                color: valueColor,
                                                fontSize: `${fontSize}px`,
                                            }}
                                            className="font-mono font-semibold"
                                        >
                                            {fill}%
                                        </span>
                                    )}
                                </div>

                                {/* Track */}
                                <div
                                    style={{
                                        backgroundColor:
                                            item.trackColor || trackColor || "#f0f0f2",
                                        height: `${Math.max(6, Math.min(36, barWidth / 2))}px`,
                                        borderRadius: barRadius,
                                    }}
                                    className="relative w-full overflow-hidden"
                                >
                                    <div
                                        style={{
                                            width: `${fill}%`,
                                            backgroundColor: activeBarColor,
                                            borderRadius: barRadius,
                                            transition: "width 0.35s ease",
                                        }}
                                        className="h-full"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ── 3. Circular Donut / Pie Chart ─────────────────────────────────────────
    if (designPreset === "circular-donut") {
        const total = items.reduce((acc, it) => acc + (it.value || 0), 0);
        const avg =
            items.length > 0 ? Math.round(total / items.length) : 0;

        // Circular segments calculation
        let accumulatedPercent = 0;
        const radius = 64;
        const circumference = 2 * Math.PI * radius;

        // For donut: apply filter ONLY on the SVG ring, not the whole container
        // (otherwise the center text and legend also get the shadow effect)
        const donutContainerStyle: React.CSSProperties = {
            ...containerStyle,
            filter: undefined, // remove from container
        };

        return (
            <div
                style={donutContainerStyle}
                className="relative flex items-center justify-around p-4 select-none box-border"
                onClick={onProgressClick}
            >
                {/* Donut SVG Ring — shadow applied here only */}
                <div className="relative flex items-center justify-center shrink-0">
                    <svg
                        className="w-36 h-36 -rotate-90"
                        viewBox="0 0 160 160"
                        style={{
                            filter: dropShadowFilter !== "none" ? dropShadowFilter : undefined,
                        }}
                    >
                        {/* Background track circle */}
                        <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            fill="transparent"
                            stroke={trackColor}
                            strokeWidth={Math.max(10, Math.min(26, barWidth / 1.5))}
                        />

                        {/* Segments */}
                        {items.map((item, idx) => {
                            const val = Math.max(0, item.value || 0);
                            const segmentRatio = total > 0 ? val / total : 1 / items.length;
                            const strokeDash = segmentRatio * circumference;
                            const strokeOffset =
                                circumference - (accumulatedPercent / 100) * circumference;
                            accumulatedPercent += segmentRatio * 100;
                            const segmentColor =
                                item.color ||
                                (idx === 0
                                    ? barColor
                                    : `hsl(${(idx * 55) % 360}, 85%, 60%)`);

                            return (
                                <circle
                                    key={item.id}
                                    cx="80"
                                    cy="80"
                                    r={radius}
                                    fill="transparent"
                                    stroke={segmentColor}
                                    strokeWidth={Math.max(10, Math.min(26, barWidth / 1.5))}
                                    strokeDasharray={`${strokeDash} ${circumference}`}
                                    strokeDashoffset={strokeOffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-500"
                                />
                            );
                        })}
                    </svg>

                    {/* Donut Center Display — no shadow here */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        {showValues && (
                            <span
                                style={{ color: valueColor, fontSize: `${fontSize + 6}px` }}
                                className="font-bold tracking-tight"
                            >
                                {avg}%
                            </span>
                        )}
                        <span
                            style={{ color: labelColor, fontSize: `${Math.max(9, fontSize - 2)}px` }}
                            className="font-medium uppercase tracking-wider text-gray-500"
                        >
                            Avg Eff.
                        </span>
                    </div>
                </div>

                {/* Legend list */}
                {showLabels && (
                    <div
                        style={{ gap: `${Math.max(4, itemSpacing / 3)}px` }}
                        className="flex flex-col justify-center min-w-0 max-w-[50%] overflow-y-auto pl-2"
                    >
                        {items.slice(0, 6).map((it, idx) => {
                            const color =
                                it.color ||
                                (idx === 0
                                    ? barColor
                                    : `hsl(${(idx * 55) % 360}, 85%, 60%)`);
                            return (
                                <div
                                    key={it.id}
                                    className="flex items-center gap-2 min-w-0 text-xs"
                                >
                                    <div
                                        style={{ backgroundColor: color }}
                                        className="h-2.5 w-2.5 rounded-full shrink-0"
                                    />
                                    <span
                                        style={{ color: labelColor, fontSize: `${fontSize}px` }}
                                        className="truncate font-medium"
                                    >
                                        {it.label}
                                    </span>
                                    {showValues && (
                                        <span
                                            style={{ color: valueColor, fontSize: `${fontSize}px` }}
                                            className="font-mono text-gray-400 ml-auto pl-1"
                                        >
                                            {it.value}%
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    // ── 4. Histogram Layout ───────────────────────────────────────────────────
    if (designPreset === "histogram") {
        return (
            <div
                style={containerStyle}
                className="relative flex flex-col p-4 select-none box-border"
                onClick={onProgressClick}
            >
                {/* Histogram columns tightly grouped */}
                <div className="relative flex flex-1 flex-col h-full min-w-0">
                    {/* Background guidelines */}
                    {showGridLines && (
                        <div className="pointer-events-none absolute inset-x-0 top-4 bottom-6 flex flex-col justify-between">
                            {[0, 1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="w-full border-b border-dashed"
                                    style={{
                                        borderColor: resolvedAxisColor,
                                        opacity: 0.65,
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <div
                        style={{ gap: `${Math.max(2, itemSpacing / 3)}px` }}
                        className="relative z-10 flex flex-1 items-end justify-center px-1"
                    >
                        {items.map((item) => {
                            const fill = Math.max(0, Math.min(100, item.value ?? 0));
                            const activeColor = item.color || barColor;

                            return (
                                <div
                                    key={item.id}
                                    className="flex flex-1 flex-col items-center justify-end h-full max-w-[60px] group"
                                >
                                    {showValues && (
                                        <span
                                            style={{
                                                color: valueColor,
                                                fontSize: `${Math.max(9, fontSize - 1)}px`,
                                            }}
                                            className="mb-1 font-mono text-[10px]"
                                        >
                                            {fill}%
                                        </span>
                                    )}

                                    {/* Histogram Column */}
                                    <div
                                        style={{
                                            height: `${fill}%`,
                                            backgroundColor: activeColor,
                                            borderTopLeftRadius: barRadius,
                                            borderTopRightRadius: barRadius,
                                            transition: "height 0.3s ease",
                                        }}
                                        className="w-full relative shadow-sm group-hover:brightness-110"
                                    >
                                        <div
                                            className="absolute inset-0 opacity-20 bg-gradient-to-t from-black to-transparent pointer-events-none"
                                        />
                                    </div>

                                    {showLabels && (
                                        <span
                                            style={{
                                                color: labelColor,
                                                fontSize: `${Math.max(9, fontSize - 1)}px`,
                                            }}
                                            className="mt-1.5 truncate max-w-full text-center"
                                        >
                                            {item.label}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Baseline */}
                    <div
                        style={{
                            borderColor: resolvedAxisColor,
                            borderBottomWidth: "1.5px",
                        }}
                        className="border-b w-full mt-1"
                    />
                </div>
            </div>
        );
    }

    // ── 5. Capsule Gauge Layout ───────────────────────────────────────────────
    return (
        <div
            style={containerStyle}
            className="relative flex flex-col justify-around p-4 select-none box-border"
            onClick={onProgressClick}
        >
            <div
                style={{ gap: `${itemSpacing}px` }}
                className="flex flex-col w-full h-full justify-around overflow-y-auto pr-1"
            >
                {items.map((item) => {
                    const fill = Math.max(0, Math.min(100, item.value ?? 0));
                    const activeBarColor = item.color || barColor;
                    const segments = 10;
                    const filledSegments = Math.round((fill / 100) * segments);

                    return (
                        <div key={item.id} className="flex flex-col gap-1.5 w-full">
                            <div className="flex items-center justify-between">
                                {showLabels && (
                                    <span
                                        style={{ color: labelColor, fontSize: `${fontSize}px` }}
                                        className="font-medium"
                                    >
                                        {item.label}
                                    </span>
                                )}
                                {showValues && (
                                    <span
                                        style={{ color: valueColor, fontSize: `${fontSize}px` }}
                                        className="font-mono font-semibold"
                                    >
                                        {fill}%
                                    </span>
                                )}
                            </div>

                            {/* Segmented Capsule Track */}
                            <div
                                style={{
                                    backgroundColor:
                                        item.trackColor || trackColor || "#f0f0f2",
                                    borderRadius: barRadius,
                                    padding: "3px",
                                }}
                                className="flex items-center gap-1 w-full"
                            >
                                {Array.from({ length: segments }).map((_, segIdx) => {
                                    const isFilled = segIdx < filledSegments;
                                    return (
                                        <div
                                            key={segIdx}
                                            style={{
                                                height: `${Math.max(8, barWidth / 2.5)}px`,
                                                backgroundColor: isFilled
                                                    ? activeBarColor
                                                    : "rgba(255, 255, 255, 0.06)",
                                                borderRadius: `${Math.max(2, borderRadius / 2)}${borderRadiusUnit}`,
                                            }}
                                            className="flex-1 transition-all duration-200"
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ProgressRenderer;
