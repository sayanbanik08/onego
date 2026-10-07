import React from "react";
import { X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type {
    CanvasElement,
    EraserSettings,
    TableElement,
} from "../../../types/elements";
import {
    pointsToSvgPath,
    canvasPointsToElementLocal,
} from "../../../utils/canvasUtils";

type CanvasTableElementProps = {
    element: TableElement;
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
    updateElement: (id: string, updates: Partial<CanvasElement>) => void;
    editingCell: { elementId: string; row: number; col: number } | null;
    setEditingCell: (
        cell: { elementId: string; row: number; col: number } | null
    ) => void;
};

const SHADOW_STYLES = {
    none: "none",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
};

export function CanvasTableElement({
    element,
    isSelected,
    isEraserMode,
    isErasing,
    currentEraserPoints,
    eraserSettings,
    handlePointerDown,
    deleteElement,
    updateElement,
    editingCell,
    setEditingCell,
}: CanvasTableElementProps) {
    const approxW = Math.max(160, element.cols * 120);
    const approxH = Math.max(
        80,
        (element.rows + (element.hasHeader ? 1 : 0)) *
            (element.fontSize * 1.5 + element.cellPadding * 2 + 4)
    );

    const liveTableEraserPath =
        isEraserMode && isErasing && currentEraserPoints
            ? pointsToSvgPath(
                  canvasPointsToElementLocal(currentEraserPoints, {
                      x: element.x,
                      y: element.y,
                      width: approxW,
                      height: approxH,
                      rotation: element.rotation,
                      size: element.size,
                  })
              )
            : null;

    const hasTableMask =
        (element.eraserPaths && element.eraserPaths.length > 0) ||
        Boolean(liveTableEraserPath);

    return (
        <div
            key={element.id}
            data-element-id={element.id}
            onPointerDown={(event) => handlePointerDown(event, element)}
            className={`absolute select-none ${
                isEraserMode
                    ? "pointer-events-none cursor-none"
                    : isSelected
                    ? "cursor-move outline outline-2 outline-blue-500"
                    : "cursor-move"
            }`}
            style={{
                left: element.x,
                top: element.y,
                transform: `rotate(${element.rotation}deg) scale(${
                    (element.size ?? 100) / 100
                })`,
                transformOrigin: "center center",
                pointerEvents: isEraserMode ? "none" : "auto",
                opacity:
                    element.opacity !== undefined ? element.opacity : 1,
                mask: hasTableMask
                    ? `url(#eraser-mask-${element.id})`
                    : undefined,
                WebkitMask: hasTableMask
                    ? `url(#eraser-mask-${element.id})`
                    : undefined,
            }}
        >
            {/* SVG Defs for Table Mask */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
                <defs>
                    <mask
                        id={`eraser-mask-${element.id}`}
                        maskUnits="userSpaceOnUse"
                    >
                        <rect
                            x="-5000"
                            y="-5000"
                            width="10000"
                            height="10000"
                            fill="white"
                        />
                        {element.eraserPaths?.map((ep, idx) => (
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
                        {liveTableEraserPath && (
                            <path
                                d={liveTableEraserPath}
                                stroke="black"
                                strokeWidth={
                                    eraserSettings.size /
                                    ((element.size ?? 100) / 100 || 1)
                                }
                                strokeOpacity={eraserSettings.opacity}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        )}
                    </mask>
                </defs>
            </svg>

            {/* Delete Button */}
            {isSelected && !isEraserMode && (
                <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                        event.stopPropagation();
                        deleteElement(element.id);
                    }}
                    className="absolute -right-7 -top-7 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                    title="Delete table"
                >
                    <X size={14} />
                </button>
            )}

            {/* Table Content */}
            <div
                className="overflow-hidden"
                style={{
                    borderRadius: element.borderRadius,
                    boxShadow:
                        SHADOW_STYLES[element.shadow || "none"],
                    border:
                        element.borderStyle !== "none" &&
                        element.borderWidth > 0
                            ? `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`
                            : undefined,
                }}
            >
                <table
                    className="border-collapse"
                    style={{
                        fontSize: element.fontSize,
                        borderSpacing: 0,
                    }}
                >
                    {element.hasHeader && (
                        <thead>
                            <tr
                                style={{
                                    backgroundColor: element.headerBg,
                                }}
                            >
                                {element.headers.map((hdr, cIdx) => (
                                    <th
                                        key={cIdx}
                                        style={{
                                            color: element.headerColor,
                                            fontWeight:
                                                element.headerFontWeight,
                                            textAlign: element.headerAlign,
                                            padding: `${element.cellPadding}px ${
                                                element.cellPadding * 1.5
                                            }px`,
                                            borderBottom:
                                                element.borderStyle !==
                                                    "none" &&
                                                element.borderWidth > 0
                                                    ? `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`
                                                    : undefined,
                                            borderRight:
                                                cIdx < element.cols - 1 &&
                                                element.borderStyle !==
                                                    "none" &&
                                                element.borderWidth > 0
                                                    ? `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`
                                                    : undefined,
                                        }}
                                    >
                                        {editingCell &&
                                        editingCell.elementId ===
                                            element.id &&
                                        editingCell.row === -1 &&
                                        editingCell.col === cIdx ? (
                                            <input
                                                autoFocus
                                                value={hdr}
                                                onChange={(e) => {
                                                    const newHeaders = [
                                                        ...element.headers,
                                                    ];
                                                    newHeaders[cIdx] =
                                                        e.target.value;
                                                    updateElement(
                                                        element.id,
                                                        {
                                                            headers:
                                                                newHeaders,
                                                        }
                                                    );
                                                }}
                                                onBlur={() =>
                                                    setEditingCell(null)
                                                }
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "Enter" ||
                                                        e.key === "Escape"
                                                    )
                                                        setEditingCell(
                                                            null
                                                        );
                                                }}
                                                className="w-full rounded bg-transparent px-1 outline-none ring-1 ring-blue-500"
                                            />
                                        ) : (
                                            <span
                                                onDoubleClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingCell({
                                                        elementId:
                                                            element.id,
                                                        row: -1,
                                                        col: cIdx,
                                                    });
                                                }}
                                                className="cursor-text"
                                                title="Double click to edit"
                                            >
                                                {hdr || " "}
                                            </span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    )}
                    <tbody>
                        {Array.from({ length: element.rows }).map(
                            (_, rIdx) => {
                                const rowBg =
                                    rIdx % 2 === 1 && element.altRowBg
                                        ? element.altRowBg
                                        : element.rowBg;
                                return (
                                    <tr
                                        key={rIdx}
                                        style={{
                                            backgroundColor: rowBg,
                                        }}
                                    >
                                        {Array.from({
                                            length: element.cols,
                                        }).map((__, cIdx) => {
                                            const val =
                                                element.data?.[rIdx]?.[
                                                    cIdx
                                                ] ?? "";
                                            return (
                                                <td
                                                    key={cIdx}
                                                    style={{
                                                        color: element.cellColor,
                                                        textAlign:
                                                            element.cellAlign,
                                                        padding: `${element.cellPadding}px ${
                                                            element.cellPadding *
                                                            1.5
                                                        }px`,
                                                        borderBottom:
                                                            rIdx <
                                                                element.rows -
                                                                    1 &&
                                                            element.borderStyle !==
                                                                "none" &&
                                                            element.borderWidth >
                                                                0
                                                                ? `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`
                                                                : undefined,
                                                        borderRight:
                                                            cIdx <
                                                                element.cols -
                                                                    1 &&
                                                            element.borderStyle !==
                                                                "none" &&
                                                            element.borderWidth >
                                                                0
                                                                ? `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`
                                                                : undefined,
                                                    }}
                                                >
                                                    {editingCell &&
                                                    editingCell.elementId ===
                                                        element.id &&
                                                    editingCell.row ===
                                                        rIdx &&
                                                    editingCell.col ===
                                                        cIdx ? (
                                                        <input
                                                            autoFocus
                                                            value={val}
                                                            onChange={(
                                                                e
                                                            ) => {
                                                                const newData =
                                                                    element.data.map(
                                                                        (
                                                                            r
                                                                        ) => [
                                                                            ...r,
                                                                        ]
                                                                    );
                                                                if (
                                                                    !newData[
                                                                        rIdx
                                                                    ]
                                                                )
                                                                    newData[
                                                                        rIdx
                                                                    ] = [];
                                                                newData[
                                                                    rIdx
                                                                ][cIdx] =
                                                                    e.target.value;
                                                                updateElement(
                                                                    element.id,
                                                                    {
                                                                        data: newData,
                                                                    }
                                                                );
                                                            }}
                                                            onBlur={() =>
                                                                setEditingCell(
                                                                    null
                                                                )
                                                            }
                                                            onKeyDown={(
                                                                e
                                                            ) => {
                                                                if (
                                                                    e.key ===
                                                                        "Enter" ||
                                                                    e.key ===
                                                                        "Escape"
                                                                )
                                                                    setEditingCell(
                                                                        null
                                                                    );
                                                            }}
                                                            className="w-full rounded bg-transparent px-1 outline-none ring-1 ring-blue-500"
                                                        />
                                                    ) : (
                                                        <span
                                                            onDoubleClick={(
                                                                e
                                                            ) => {
                                                                e.stopPropagation();
                                                                setEditingCell(
                                                                    {
                                                                        elementId:
                                                                            element.id,
                                                                        row: rIdx,
                                                                        col: cIdx,
                                                                    }
                                                                );
                                                            }}
                                                            className="cursor-text"
                                                            title="Double click to edit"
                                                        >
                                                            {val || " "}
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
