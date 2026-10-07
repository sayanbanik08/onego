"use client";

import React from "react";
import type { TimelineThemeProps } from "../timelineShared";
import {
    getIconComponent,
    getNodeShapeStyles,
    getHoverClasses,
    renderEditableText,
} from "../timelineShared";

export default function NeonCyberTimeline({
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
            className="relative flex flex-col font-mono"
            style={{
                gap: `${element.spacing + 4}px`,
                width: `${cardWidth}px`,
            }}
        >
            {/* Glowing neon vertical spine */}
            <div
                className="absolute bottom-6 top-6"
                style={{
                    left: `${element.nodeSize / 2}px`,
                    transform: "translateX(-50%)",
                    width: `${element.lineWidth}px`,
                    backgroundColor: element.lineColor || element.accentColor,
                    boxShadow: `0 0 10px ${element.accentColor}, 0 0 20px ${element.accentColor}`,
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

                        {/* Cyber Card */}
                        <div
                            className="flex-1 border p-3.5 flex flex-col justify-center gap-y-1.5"
                            style={{
                                minHeight: `${cardMinHeight}px`,
                                borderColor: `${accColor}aa`,
                                borderWidth: `${element.cardBorderWidth}px`,
                                backgroundColor: cardBgColor,
                                boxShadow: `0 0 15px ${accColor}33`,
                                borderRadius: `${element.borderRadius}px`,
                            }}
                        >
                            <div className="flex items-center justify-between pb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase tracking-widest text-emerald-400">
                                        [0{idx + 1}_LOG]
                                    </span>
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
                                            fontWeight: 700,
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
                                <span
                                    className="px-1.5 py-0.5 font-bold uppercase"
                                    style={{
                                        backgroundColor: `${accColor}22`,
                                        color: element.dateColor || accColor,
                                        border: `1px solid ${accColor}66`,
                                        fontSize: `${
                                            element.dateFontSize || 10
                                        }px`,
                                    }}
                                >
                                    {renderEditableText({
                                        item,
                                        field: "date",
                                        value: item.date,
                                        style: {
                                            color:
                                                element.dateColor || accColor,
                                            fontSize: `${
                                                element.dateFontSize || 10
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
                            </div>

                            <div
                                className="flex items-center gap-2"
                                style={{ color: accColor }}
                            >
                                &gt;{" "}
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
                                <div className="mt-2 font-sans">
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
