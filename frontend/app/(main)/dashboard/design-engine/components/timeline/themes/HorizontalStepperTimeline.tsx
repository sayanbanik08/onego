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

export default function HorizontalStepperTimeline({
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
            className="relative flex items-start"
            style={{
                gap: `${element.spacing + 16}px`,
                minWidth: `${Math.max(
                    520,
                    element.items.length * (Math.min(cardWidth, 260) + 20)
                )}px`,
                padding: "16px 8px",
            }}
        >
            {/* Horizontal Connector Line */}
            <div
                className="absolute left-10 right-10"
                style={{
                    top: `${16 + element.nodeSize / 2}px`,
                    height: `${element.lineWidth}px`,
                    backgroundColor: element.lineColor,
                    zIndex: 1,
                }}
            />

            {element.items.map((item, idx) => {
                const accColor = item.accentColor || element.accentColor;
                return (
                    <div
                        key={item.id || idx}
                        className={`relative z-10 flex flex-1 flex-col items-center text-center ${getHoverClasses(
                            element.hoverEffect
                        )}`}
                        style={{ minWidth: `${Math.min(cardWidth, 260)}px` }}
                    >
                        {/* Step Node */}
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

                        {/* Step Label Card */}
                        <div
                            className="mt-3.5 w-full rounded-xl p-2.5 flex flex-col justify-center gap-y-1.5"
                            style={{
                                minHeight: `${cardMinHeight}px`,
                                backgroundColor: cardBgColor,
                                border: `${element.cardBorderWidth}px solid ${
                                    element.cardBorderColor ||
                                    "rgba(255,255,255,0.15)"
                                }`,
                                borderRadius: `${element.borderRadius}px`,
                                boxShadow: getShadowStyle(
                                    element.shadow,
                                    element.accentColor
                                ),
                            }}
                        >
                            <div className="mb-1 font-semibold uppercase tracking-wider">
                                {renderEditableText({
                                    item,
                                    field: "date",
                                    value: item.date,
                                    style: {
                                        color: element.dateColor || accColor,
                                        fontSize: `${
                                            element.dateFontSize || 11
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
                            <div className="leading-tight">
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
                            </div>
                            <div className="mt-1 flex items-center justify-center gap-1.5">
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
                                <div className="mt-1.5">
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
