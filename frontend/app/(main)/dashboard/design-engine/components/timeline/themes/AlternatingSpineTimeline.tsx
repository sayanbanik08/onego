"use client";

import React from "react";
import type { TimelineThemeProps } from "../timelineShared";
import {
    getIconComponent,
    getNodeShapeStyles,
    getShadowStyle,
    getHoverClasses,
    renderEditableText,
} from "../timelineShared";

export default function AlternatingSpineTimeline({
    element,
    isEraserMode,
    editingState,
    setEditingState,
    onUpdateItem,
}: TimelineThemeProps) {
    const cardBgColor =
        element.cardBg && element.cardBg !== "transparent"
            ? element.cardBg
            : "transparent";
    const cardWidth = element.cardWidth || 480;
    const cardMinHeight = element.cardMinHeight || 60;

    return (
        <div
            className="relative flex flex-col"
            style={{
                gap: `${element.spacing + 8}px`,
                width: `${Math.max(480, cardWidth * 1.25)}px`,
            }}
        >
            {/* Center Spine */}
            <div
                className="absolute bottom-6 top-6"
                style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: `${element.lineWidth}px`,
                    backgroundColor: element.lineColor,
                }}
            />

            {element.items.map((item, idx) => {
                const isEven = idx % 2 === 0;
                const accColor = item.accentColor || element.accentColor;

                return (
                    <div
                        key={item.id || idx}
                        className={`relative flex items-center justify-between ${getHoverClasses(
                            element.hoverEffect
                        )}`}
                    >
                        {/* Left Side Item */}
                        <div
                            className={`w-[45%] ${
                                isEven
                                    ? "text-right"
                                    : "pointer-events-none opacity-0"
                            }`}
                        >
                            {isEven && (
                                <div
                                    className="rounded-xl p-3 flex flex-col justify-center gap-y-1.5"
                                    style={{
                                        minHeight: `${cardMinHeight}px`,
                                        backgroundColor: cardBgColor,
                                        borderTop: `${element.cardBorderWidth}px solid ${
                                            element.cardBorderColor ||
                                            "rgba(255,255,255,0.15)"
                                        }`,
                                        borderBottom: `${element.cardBorderWidth}px solid ${
                                            element.cardBorderColor ||
                                            "rgba(255,255,255,0.15)"
                                        }`,
                                        borderLeft: `${element.cardBorderWidth}px solid ${
                                            element.cardBorderColor ||
                                            "rgba(255,255,255,0.15)"
                                        }`,
                                        borderRight: `3px solid ${accColor}`,
                                        borderRadius: `${element.borderRadius}px`,
                                        boxShadow: getShadowStyle(
                                            element.shadow,
                                            element.accentColor
                                        ),
                                    }}
                                >
                                    <div className="flex items-center justify-end gap-1.5 pb-0.5">
                                        {renderEditableText({
                                            item,
                                            field: "date",
                                            value: item.date,
                                            style: {
                                                color:
                                                    element.dateColor ||
                                                    "#38bdf8",
                                                fontSize: `${
                                                    element.dateFontSize || 11
                                                }px`,
                                            },
                                            className:
                                                "rounded-full bg-white/10 px-2 py-0.5 font-medium",
                                            element,
                                            isEraserMode,
                                            editingState,
                                            setEditingState,
                                            onUpdateItem,
                                            cardBgColor,
                                        })}
                                        {renderEditableText({
                                            item,
                                            field: "title",
                                            value: item.title,
                                            style: {
                                                color:
                                                    element.titleColor ||
                                                    "#ffffff",
                                                fontSize: `${
                                                    element.titleFontSize || 15
                                                }px`,
                                                fontWeight:
                                                    element.titleFontWeight ||
                                                    600,
                                                lineHeight: "1.3",
                                            },
                                            element,
                                            isEraserMode,
                                            editingState,
                                            setEditingState,
                                            onUpdateItem,
                                            cardBgColor,
                                        })}
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        {item.tag && (
                                            <span
                                                className="rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider"
                                                style={{
                                                    backgroundColor: `${
                                                        element.tagColor ||
                                                        accColor
                                                    }22`,
                                                    color:
                                                        element.tagColor ||
                                                        accColor,
                                                    border: `1px solid ${
                                                        element.tagColor ||
                                                        accColor
                                                    }55`,
                                                    fontSize: `${
                                                        element.tagFontSize ||
                                                        10
                                                    }px`,
                                                }}
                                            >
                                                {renderEditableText({
                                                    item,
                                                    field: "tag",
                                                    value: item.tag,
                                                    style: {
                                                        color:
                                                            element.tagColor ||
                                                            accColor,
                                                        fontSize: `${
                                                            element.tagFontSize ||
                                                            10
                                                        }px`,
                                                    },
                                                    element,
                                                    isEraserMode,
                                                    editingState,
                                                    setEditingState,
                                                    onUpdateItem,
                                                    cardBgColor,
                                                })}
                                            </span>
                                        )}
                                        {renderEditableText({
                                            item,
                                            field: "subtitle",
                                            value: item.subtitle,
                                            style: {
                                                color:
                                                    element.subtitleColor ||
                                                    "#94a3b8",
                                                fontSize: `${
                                                    element.subtitleFontSize ||
                                                    12
                                                }px`,
                                            },
                                            element,
                                            isEraserMode,
                                            editingState,
                                            setEditingState,
                                            onUpdateItem,
                                            cardBgColor,
                                        })}
                                    </div>
                                    {item.description && (
                                        <div className="mt-1">
                                            {renderEditableText({
                                                item,
                                                field: "description",
                                                value: item.description,
                                                style: {
                                                    color:
                                                        element.textColor ||
                                                        "#e2e8f0",
                                                    fontSize: `${
                                                        element.bodyFontSize ||
                                                        12
                                                    }px`,
                                                    lineHeight: "1.45",
                                                },
                                                className: "block",
                                                element,
                                                isEraserMode,
                                                editingState,
                                                setEditingState,
                                                onUpdateItem,
                                                cardBgColor,
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Center Node */}
                        <div
                            style={getNodeShapeStyles(
                                element.nodeShape,
                                element.nodeSize,
                                accColor
                            )}
                        >
                            {getIconComponent(
                                item.icon,
                                Math.max(12, element.nodeSize * 0.45)
                            )}
                        </div>

                        {/* Right Side Item */}
                        <div
                            className={`w-[45%] ${
                                !isEven
                                    ? "text-left"
                                    : "pointer-events-none opacity-0"
                            }`}
                        >
                            {!isEven && (
                                <div
                                    className="rounded-xl p-3 flex flex-col gap-y-1.5"
                                    style={{
                                        minHeight: `${cardMinHeight}px`,
                                        backgroundColor: cardBgColor,
                                        borderTop: `${element.cardBorderWidth}px solid ${
                                            element.cardBorderColor ||
                                            "rgba(255,255,255,0.15)"
                                        }`,
                                        borderBottom: `${element.cardBorderWidth}px solid ${
                                            element.cardBorderColor ||
                                            "rgba(255,255,255,0.15)"
                                        }`,
                                        borderRight: `${element.cardBorderWidth}px solid ${
                                            element.cardBorderColor ||
                                            "rgba(255,255,255,0.15)"
                                        }`,
                                        borderLeft: `3px solid ${accColor}`,
                                        borderRadius: `${element.borderRadius}px`,
                                        boxShadow: getShadowStyle(
                                            element.shadow,
                                            element.accentColor
                                        ),
                                    }}
                                >
                                    <div className="flex items-center gap-1.5 pb-0.5">
                                        {renderEditableText({
                                            item,
                                            field: "title",
                                            value: item.title,
                                            style: {
                                                color:
                                                    element.titleColor ||
                                                    "#ffffff",
                                                fontSize: `${
                                                    element.titleFontSize || 15
                                                }px`,
                                                fontWeight:
                                                    element.titleFontWeight ||
                                                    600,
                                                lineHeight: "1.3",
                                            },
                                            element,
                                            isEraserMode,
                                            editingState,
                                            setEditingState,
                                            onUpdateItem,
                                            cardBgColor,
                                        })}
                                        {renderEditableText({
                                            item,
                                            field: "date",
                                            value: item.date,
                                            style: {
                                                color:
                                                    element.dateColor ||
                                                    "#38bdf8",
                                                fontSize: `${
                                                    element.dateFontSize || 11
                                                }px`,
                                            },
                                            className:
                                                "rounded-full bg-white/10 px-2 py-0.5 font-medium",
                                            element,
                                            isEraserMode,
                                            editingState,
                                            setEditingState,
                                            onUpdateItem,
                                            cardBgColor,
                                        })}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {renderEditableText({
                                            item,
                                            field: "subtitle",
                                            value: item.subtitle,
                                            style: {
                                                color:
                                                    element.subtitleColor ||
                                                    "#94a3b8",
                                                fontSize: `${
                                                    element.subtitleFontSize ||
                                                    12
                                                }px`,
                                            },
                                            element,
                                            isEraserMode,
                                            editingState,
                                            setEditingState,
                                            onUpdateItem,
                                            cardBgColor,
                                        })}
                                        {item.tag && (
                                            <span
                                                className="rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider"
                                                style={{
                                                    backgroundColor: `${
                                                        element.tagColor ||
                                                        accColor
                                                    }22`,
                                                    color:
                                                        element.tagColor ||
                                                        accColor,
                                                    border: `1px solid ${
                                                        element.tagColor ||
                                                        accColor
                                                    }55`,
                                                    fontSize: `${
                                                        element.tagFontSize ||
                                                        10
                                                    }px`,
                                                }}
                                            >
                                                {renderEditableText({
                                                    item,
                                                    field: "tag",
                                                    value: item.tag,
                                                    style: {
                                                        color:
                                                            element.tagColor ||
                                                            accColor,
                                                        fontSize: `${
                                                            element.tagFontSize ||
                                                            10
                                                        }px`,
                                                    },
                                                    element,
                                                    isEraserMode,
                                                    editingState,
                                                    setEditingState,
                                                    onUpdateItem,
                                                    cardBgColor,
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    {item.description && (
                                        <div className="mt-1">
                                            {renderEditableText({
                                                item,
                                                field: "description",
                                                value: item.description,
                                                style: {
                                                    color:
                                                        element.textColor ||
                                                        "#e2e8f0",
                                                    fontSize: `${
                                                        element.bodyFontSize ||
                                                        12
                                                    }px`,
                                                    lineHeight: "1.45",
                                                },
                                                className: "block",
                                                element,
                                                isEraserMode,
                                                editingState,
                                                setEditingState,
                                                onUpdateItem,
                                                cardBgColor,
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
