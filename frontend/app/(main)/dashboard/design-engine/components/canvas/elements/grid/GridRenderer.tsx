"use client";

import React from "react";
import { Plus, LayoutGrid, Image as ImageIcon } from "lucide-react";
import type { GridElement } from "../../../../types/grid";
import { getGridShadow } from "./gridHelpers";

type GridRendererProps = {
    element: GridElement;
    isInteractive?: boolean;
    onGridClick?: (e: React.MouseEvent) => void;
};

// Masonry heights pattern for Pinterest layout (varied heights in px)
const PINTEREST_HEIGHT_MULTIPLIERS = [1.5, 0.9, 1.8, 1.1, 1.4, 1.0, 1.7, 1.2, 1.6];

export function GridRenderer({
    element,
    isInteractive = false,
    onGridClick,
}: GridRendererProps) {
    const {
        layoutPreset,
        columns,
        rows,
        gap,
        cellCount,
        width,
        widthUnit,
        height,
        heightUnit,
        cellHeight,
        cellBgColor,
        cellBorderColor,
        cellBorderWidth,
        cellBorderStyle,
        cellBorderRadius,
        cellBorderRadiusUnit,
        showCellNumbers,
        showPlusIcon,
        skeletonPulse,
    } = element;

    const w = widthUnit === "%" ? `${width}%` : `${width}px`;
    const h = heightUnit === "%" ? `${height}px` : `${height}px`;
    const radius = `${cellBorderRadius}${cellBorderRadiusUnit || "px"}`;
    const shadowStyle = getGridShadow(element);

    const cellBorder =
        cellBorderStyle === "none" || cellBorderWidth === 0
            ? "none"
            : `${cellBorderWidth}px ${cellBorderStyle} ${cellBorderColor}`;

    const cellStyle: React.CSSProperties = {
        background: cellBgColor || "#111111",
        border: cellBorder,
        borderRadius: radius,
        boxShadow: shadowStyle !== "none"
            ? shadowStyle
            : "inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.4)",
        transition: "all 0.2s ease",
    };

    const pulseClass = skeletonPulse ? "animate-pulse" : "";

    // ── Helper to render a single skeleton cell ──────────────────────────────
    const renderCell = (
        index: number,
        customClasses = "",
        customInlineStyle: React.CSSProperties = {}
    ) => {
        return (
            <div
                key={index}
                style={{ ...cellStyle, ...customInlineStyle }}
                className={`relative flex flex-col items-center justify-center overflow-hidden select-none group ${pulseClass} ${customClasses}`}
            >
                {/* Subtle inner top highlight */}
                <div className="pointer-events-none absolute inset-0 rounded-[inherit]"
                    style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.055) 0%, transparent 50%)" }}
                />

                {/* Cell Slot Number Badge */}
                {showCellNumbers && (
                    <span className="absolute top-2.5 left-2.5 rounded-md bg-white/8 border border-white/10 px-1.5 py-0.5 text-[9px] font-mono text-gray-500 backdrop-blur-sm">
                        #{index + 1}
                    </span>
                )}

                {/* Center Content */}
                <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
                    {showPlusIcon ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/6 text-gray-500 transition-all duration-200 group-hover:border-white/25 group-hover:bg-white/12 group-hover:text-gray-300 group-hover:scale-110">
                            <Plus size={15} />
                        </div>
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-gray-600">
                            <LayoutGrid size={15} />
                        </div>
                    )}
                    <span className="text-[10px] font-medium tracking-wide text-gray-600 group-hover:text-gray-400 transition-colors duration-200">
                        Drop here
                    </span>
                </div>

                {/* Bottom skeleton lines */}
                <div className="absolute bottom-3 left-3.5 right-3.5 flex flex-col gap-1.5 opacity-20">
                    <div className="h-1.5 w-4/5 rounded-full bg-white/20" />
                    <div className="h-1.5 w-3/5 rounded-full bg-white/15" />
                </div>
            </div>
        );
    };

    // ── 1. Pinterest Masonry Layout ──────────────────────────────────────────
    if (layoutPreset === "pinterest-masonry") {
        const colsCount = Math.max(1, columns || 3);
        const count = Math.max(colsCount, cellCount || 6);

        // Group items into columns to create true Pinterest waterfall masonry!
        const columnItems: number[][] = Array.from({ length: colsCount }, () => []);
        for (let i = 0; i < count; i++) {
            columnItems[i % colsCount].push(i);
        }

        return (
            <div
                style={{ width: w, height: h, gap: `${gap}px` }}
                className="flex w-full h-full box-sizing-border"
                onClick={onGridClick}
            >
                {columnItems.map((colIndexes, colIdx) => (
                    <div
                        key={colIdx}
                        style={{ gap: `${gap}px` }}
                        className="flex flex-1 flex-col"
                    >
                        {colIndexes.map((itemIdx) => {
                            const multiplier =
                                PINTEREST_HEIGHT_MULTIPLIERS[
                                    itemIdx % PINTEREST_HEIGHT_MULTIPLIERS.length
                                ];
                            const calculatedHeight = Math.round(
                                (cellHeight || 120) * multiplier
                            );
                            return renderCell(itemIdx, "w-full", {
                                minHeight: `${calculatedHeight}px`,
                                height: `${calculatedHeight}px`,
                            });
                        })}
                    </div>
                ))}
            </div>
        );
    }

    // ── 2. Bento Modern Grid Layout ──────────────────────────────────────────
    if (layoutPreset === "bento-modern") {
        return (
            <div
                style={{
                    width: w,
                    height: h,
                    gap: `${gap}px`,
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gridAutoRows: "minmax(0, 1fr)",
                }}
                className="w-full h-full"
                onClick={onGridClick}
            >
                {renderCell(0, "col-span-2 row-span-2")}
                {renderCell(1, "col-span-2 row-span-1")}
                {renderCell(2, "col-span-1 row-span-1")}
                {renderCell(3, "col-span-1 row-span-1")}
                {renderCell(4, "col-span-2 row-span-1")}
                {renderCell(5, "col-span-2 row-span-1")}
            </div>
        );
    }

    // ── 3. Featured Split Layout ─────────────────────────────────────────────
    if (layoutPreset === "featured-split") {
        return (
            <div
                style={{
                    width: w,
                    height: h,
                    gap: `${gap}px`,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gridTemplateRows: "repeat(2, minmax(0, 1fr))",
                }}
                className="w-full h-full"
                onClick={onGridClick}
            >
                {renderCell(0, "col-span-1 row-span-2")}
                {renderCell(1, "col-span-1 row-span-1")}
                {renderCell(2, "col-span-1 row-span-1")}
                {renderCell(3, "col-span-1 row-span-1")}
                {renderCell(4, "col-span-1 row-span-1")}
            </div>
        );
    }

    // ── 4. Editorial Magazine Layout ─────────────────────────────────────────
    if (layoutPreset === "editorial-magazine") {
        return (
            <div
                style={{
                    width: w,
                    height: h,
                    gap: `${gap}px`,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gridTemplateRows: "1.2fr 1fr",
                }}
                className="w-full h-full"
                onClick={onGridClick}
            >
                {renderCell(0, "col-span-3 row-span-1")}
                {renderCell(1, "col-span-1 row-span-1")}
                {renderCell(2, "col-span-1 row-span-1")}
                {renderCell(3, "col-span-1 row-span-1")}
            </div>
        );
    }

    // ── 5. Classic Uniform or Custom Grid ────────────────────────────────────
    const cols = Math.max(1, columns || 3);
    const rws = Math.max(1, rows || 3);
    const totalCells = layoutPreset === "custom" ? (cellCount || cols * rws) : cols * rws;

    return (
        <div
            style={{
                width: w,
                height: h,
                gap: `${gap}px`,
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rws}, minmax(0, 1fr))`,
            }}
            className="w-full h-full"
            onClick={onGridClick}
        >
            {Array.from({ length: totalCells }).map((_, i) =>
                renderCell(i, "w-full h-full", {
                    minHeight: cellHeight ? `${cellHeight}px` : undefined,
                })
            )}
        </div>
    );
}

export default GridRenderer;
