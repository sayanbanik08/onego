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

export default function GlassCardsTimeline({
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
            style={{ gap: `${element.spacing}px`, width: `${cardWidth}px` }}
        >
            {/* Glass stem line */}
            <div
                className="absolute bottom-6 top-6"
                style={{
                    left: `${element.nodeSize / 2}px`,
                    transform: "translateX(-50%)",
                    width: `${element.lineWidth}px`,
                    backgroundColor: element.lineColor,
                }}
            />

            {element.items.map((item, idx) => {
                const accColor = item.accentColor || element.accentColor;
                return (
                    <div
                        key={item.id || idx}
                        className={`relative flex items-start gap-4 ${getHoverClasses(
                            element.hoverEffect
                        )}`}
                    >
                        {/* Node */}
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

                        <div
                            className="flex-1 p-4 transition hover:border-white/30 flex flex-col justify-center gap-y-1.5"
                            style={{
                                minHeight: `${cardMinHeight}px`,
                                backgroundColor: cardBgColor,
                                border: `${element.cardBorderWidth}px solid ${
                                    element.cardBorderColor ||
                                    "rgba(255,255,255,0.2)"
                                }`,
                                boxShadow:
                                    getShadowStyle(
                                        element.shadow,
                                        element.accentColor
                                    ) !== "none"
                                        ? getShadowStyle(
                                              element.shadow,
                                              element.accentColor
                                          )
                                        : "0 8px 32px 0 rgba(0, 0, 0, 0.35)",
                                borderRadius: `${element.borderRadius}px`,
                            }}
                        >
                            <div className="flex items-center justify-between pb-1">
                                {renderEditableText({
                                    item,
                                    field: "title",
                                    value: item.title,
                                    style: {
                                        color:
                                            element.titleColor || "#ffffff",
                                        fontSize: `${
                                            element.titleFontSize || 15
                                        }px`,
                                        fontWeight:
                                            element.titleFontWeight || 600,
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
                                        color: element.dateColor || "#38bdf8",
                                        fontSize: `${
                                            element.dateFontSize || 11
                                        }px`,
                                    },
                                    className:
                                        "rounded-lg bg-white/10 px-2.5 py-0.5 font-medium",
                                    element,
                                    isEraserMode,
                                    editingState,
                                    setEditingState,
                                    onUpdateItem,
                                    cardBgColor,
                                })}
                            </div>
                            <div className="flex items-center gap-2 font-medium">
                                {renderEditableText({
                                    item,
                                    field: "subtitle",
                                    value: item.subtitle,
                                    style: {
                                        color:
                                            element.subtitleColor || "#94a3b8",
                                        fontSize: `${
                                            element.subtitleFontSize || 12
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
                                                element.tagColor || accColor
                                            }22`,
                                            color: element.tagColor || accColor,
                                            border: `1px solid ${
                                                element.tagColor || accColor
                                            }55`,
                                            fontSize: `${
                                                element.tagFontSize || 10
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
                                                    element.tagFontSize || 10
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
                                <div className="mt-2 leading-relaxed">
                                    {renderEditableText({
                                        item,
                                        field: "description",
                                        value: item.description,
                                        style: {
                                            color:
                                                element.textColor || "#e2e8f0",
                                            fontSize: `${
                                                element.bodyFontSize || 12
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
                    </div>
                );
            })}
        </div>
    );
}
