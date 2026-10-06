"use client";

import React, { useState } from "react";
import {
    Briefcase,
    GraduationCap,
    Trophy,
    Star,
    Code,
    Rocket,
    CheckCircle2,
    Circle,
} from "lucide-react";
import { TimelineElement, TimelineIconType, TimelineItem } from "../types/timeline";

type TimelineRendererProps = {
    element: TimelineElement;
    isSelected: boolean;
    isEraserMode: boolean;
    onUpdateItem: (itemId: string, updates: Partial<TimelineItem>) => void;
};

export default function TimelineRenderer({
    element,
    isSelected,
    isEraserMode,
    onUpdateItem,
}: TimelineRendererProps) {
    const [editingState, setEditingState] = useState<{
        itemId: string;
        field: "title" | "subtitle" | "date" | "description" | "tag";
    } | null>(null);

    const getIconComponent = (iconName?: TimelineIconType, size = 16) => {
        switch (iconName) {
            case "graduation":
                return <GraduationCap size={size} />;
            case "briefcase":
                return <Briefcase size={size} />;
            case "trophy":
                return <Trophy size={size} />;
            case "star":
                return <Star size={size} />;
            case "code":
                return <Code size={size} />;
            case "rocket":
                return <Rocket size={size} />;
            case "check":
                return <CheckCircle2 size={size} />;
            case "circle":
            default:
                return <Circle size={size} />;
        }
    };

    const getShadowStyle = () => {
        if (element.shadow === "none") return "none";
        if (element.shadow === "sm") return "0 2px 6px rgba(0,0,0,0.3)";
        if (element.shadow === "md") return "0 6px 18px rgba(0,0,0,0.4)";
        if (element.shadow === "lg") return "0 12px 36px rgba(0,0,0,0.55)";
        if (element.shadow === "neon") {
            const acc = element.accentColor || "#3b82f6";
            return `0 0 16px ${acc}88, 0 0 32px ${acc}33`;
        }
        return "none";
    };

    // Clean hover effects WITHOUT unwanted background or shadow artifacts
    const getHoverClasses = () => {
        if (element.hoverEffect === "lift") return "transition-transform duration-200 hover:-translate-y-1.5";
        if (element.hoverEffect === "scale") return "transition-transform duration-200 hover:scale-[1.02]";
        if (element.hoverEffect === "glow") return "transition-all duration-200 hover:brightness-110";
        return "transition-all duration-200";
    };

    // Card background: strictly respects user cardBg, transparent if not set
    const cardBgColor =
        element.cardBg && element.cardBg !== "transparent"
            ? element.cardBg
            : "transparent";

    // Card dimensions configured by user
    const cardWidth = element.cardWidth || 480;
    const cardMinHeight = element.cardMinHeight || 60;

    const renderEditableText = (
        item: TimelineItem,
        field: "title" | "subtitle" | "date" | "description" | "tag",
        value: string,
        style: React.CSSProperties,
        className = ""
    ) => {
        const isEditing =
            editingState?.itemId === item.id && editingState.field === field;

        if (isEditing) {
            if (field === "description") {
                return (
                    <textarea
                        autoFocus
                        value={value}
                        onChange={(e) =>
                            onUpdateItem(item.id, { [field]: e.target.value })
                        }
                        onBlur={() => setEditingState(null)}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") setEditingState(null);
                        }}
                        className="w-full rounded bg-gray-900/90 p-1.5 text-xs text-white outline-none ring-1 ring-blue-500"
                        rows={3}
                        style={{ fontFamily: element.fontFamily }}
                    />
                );
            }

            return (
                <input
                    autoFocus
                    type="text"
                    value={value}
                    onChange={(e) =>
                        onUpdateItem(item.id, { [field]: e.target.value })
                    }
                    onBlur={() => setEditingState(null)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "Escape")
                            setEditingState(null);
                    }}
                    className="w-full rounded bg-gray-900/90 px-1.5 py-0.5 text-inherit outline-none ring-1 ring-blue-500"
                    style={{ ...style, fontFamily: element.fontFamily }}
                />
            );
        }

        return (
            <span
                onDoubleClick={(e) => {
                    if (isEraserMode) return;
                    e.stopPropagation();
                    setEditingState({ itemId: item.id, field });
                }}
                className={`cursor-text selection:bg-blue-600/30 ${className}`}
                style={{
                    textShadow:
                        cardBgColor === "transparent" &&
                        (!style.color || style.color === "#ffffff" || style.color === "white" || style.color === "#fff")
                            ? "0 1px 2px rgba(0,0,0,0.7), 0 0 1px rgba(0,0,0,0.8)"
                            : undefined,
                    ...style,
                }}
                title="Double click to edit directly"
            >
                {value || (field === "tag" ? "" : "(empty)")}
            </span>
        );
    };

    // Node shape styling that works across ALL shapes and ALL themes
    const getNodeShapeStyles = (size: number, accColor: string): React.CSSProperties => {
        const base: React.CSSProperties = {
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: accColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            position: "relative",
            zIndex: 10,
            boxShadow: `0 0 12px ${accColor}77`,
            color: "#ffffff",
        };

        if (element.nodeShape === "hexagon") {
            return {
                ...base,
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                borderRadius: 0,
            };
        }
        if (element.nodeShape === "diamond") {
            return {
                ...base,
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                borderRadius: 0,
            };
        }
        if (element.nodeShape === "square") {
            return {
                ...base,
                borderRadius: "6px",
                border: "2px solid rgba(255,255,255,0.35)",
            };
        }
        // default circle
        return {
            ...base,
            borderRadius: "9999px",
            border: "2px solid rgba(255,255,255,0.35)",
        };
    };

    return (
        <div
            className="relative select-none"
            style={{
                fontFamily: element.fontFamily || "Inter, sans-serif",
                backgroundColor: "transparent",
            }}
        >
            {/* 1. THEME: MODERN VERTICAL */}
            {element.theme === "modern-vertical" && (
                <div
                    className="relative flex flex-col"
                    style={{ gap: `${element.spacing}px`, width: `${cardWidth}px` }}
                >
                    {/* Vertical Connector Line centered behind node */}
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
                                className={`relative flex items-start gap-4 ${getHoverClasses()}`}
                            >
                                {/* Node Marker */}
                                <div style={getNodeShapeStyles(element.nodeSize, accColor)}>
                                    {getIconComponent(item.icon, Math.max(12, element.nodeSize * 0.45))}
                                </div>

                                {/* Content Card */}
                                <div
                                    className="flex-1 rounded-xl p-3.5 flex flex-col justify-center gap-y-1.5"
                                    style={{
                                        minHeight: `${cardMinHeight}px`,
                                        backgroundColor: cardBgColor,
                                        border: `${element.cardBorderWidth}px solid ${element.cardBorderColor || "rgba(255,255,255,0.15)"}`,
                                        borderRadius: `${element.borderRadius}px`,
                                        boxShadow: getShadowStyle(),
                                    }}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1">
                                        <div className="flex items-center gap-2">
                                            {renderEditableText(
                                                item,
                                                "title",
                                                item.title,
                                                {
                                                    color: element.titleColor || "#ffffff",
                                                    fontSize: `${element.titleFontSize || 15}px`,
                                                    fontWeight: element.titleFontWeight || 600,
                                                    lineHeight: "1.3",
                                                },
                                                "font-semibold"
                                            )}
                                        </div>

                                        {renderEditableText(
                                            item,
                                            "date",
                                            item.date,
                                            {
                                                color: element.dateColor || "#38bdf8",
                                                fontSize: `${element.dateFontSize || 11}px`,
                                            },
                                            "rounded-full bg-white/10 px-2 py-0.5 font-medium"
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 py-0.5">
                                        {renderEditableText(
                                            item,
                                            "subtitle",
                                            item.subtitle,
                                            {
                                                color: element.subtitleColor || "#94a3b8",
                                                fontSize: `${element.subtitleFontSize || 12}px`,
                                            },
                                            "font-medium"
                                        )}

                                        {item.tag && (
                                            <span
                                                className="rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider"
                                                style={{
                                                    backgroundColor: `${element.tagColor || accColor}22`,
                                                    color: element.tagColor || accColor,
                                                    border: `1px solid ${element.tagColor || accColor}55`,
                                                    fontSize: `${element.tagFontSize || 10}px`,
                                                }}
                                            >
                                                {renderEditableText(
                                                    item,
                                                    "tag",
                                                    item.tag,
                                                    { color: element.tagColor || accColor, fontSize: `${element.tagFontSize || 10}px` }
                                                )}
                                            </span>
                                        )}
                                    </div>

                                    {item.description && (
                                        <div className="mt-1">
                                            {renderEditableText(
                                                item,
                                                "description",
                                                item.description,
                                                {
                                                    color: element.textColor || "#e2e8f0",
                                                    fontSize: `${element.bodyFontSize || 12}px`,
                                                    lineHeight: "1.45",
                                                },
                                                "block"
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 2. THEME: ALTERNATING ZIGZAG */}
            {element.theme === "alternating-zigzag" && (
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
                                className={`relative flex items-center justify-between ${getHoverClasses()}`}
                            >
                                {/* Left Side Item */}
                                <div
                                    className={`w-[45%] ${
                                        isEven ? "text-right" : "pointer-events-none opacity-0"
                                    }`}
                                >
                                    {isEven && (
                                        <div
                                            className="rounded-xl p-3 flex flex-col justify-center gap-y-1.5"
                                            style={{
                                                minHeight: `${cardMinHeight}px`,
                                                backgroundColor: cardBgColor,
                                                borderTop: `${element.cardBorderWidth}px solid ${element.cardBorderColor || "rgba(255,255,255,0.15)"}`,
                                                borderBottom: `${element.cardBorderWidth}px solid ${element.cardBorderColor || "rgba(255,255,255,0.15)"}`,
                                                borderLeft: `${element.cardBorderWidth}px solid ${element.cardBorderColor || "rgba(255,255,255,0.15)"}`,
                                                borderRight: `3px solid ${accColor}`,
                                                borderRadius: `${element.borderRadius}px`,
                                                boxShadow: getShadowStyle(),
                                            }}
                                        >
                                            <div className="flex items-center justify-end gap-1.5 pb-0.5">
                                                {renderEditableText(
                                                    item,
                                                    "date",
                                                    item.date,
                                                    { color: element.dateColor || "#38bdf8", fontSize: `${element.dateFontSize || 11}px` },
                                                    "rounded-full bg-white/10 px-2 py-0.5 font-medium"
                                                )}
                                                {renderEditableText(
                                                    item,
                                                    "title",
                                                    item.title,
                                                    { color: element.titleColor || "#ffffff", fontSize: `${element.titleFontSize || 15}px`, fontWeight: element.titleFontWeight || 600, lineHeight: "1.3" }
                                                )}
                                            </div>
                                            <div className="flex items-center justify-end gap-2">
                                                {item.tag && (
                                                    <span
                                                        className="rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider"
                                                        style={{
                                                            backgroundColor: `${element.tagColor || accColor}22`,
                                                            color: element.tagColor || accColor,
                                                            border: `1px solid ${element.tagColor || accColor}55`,
                                                            fontSize: `${element.tagFontSize || 10}px`,
                                                        }}
                                                    >
                                                        {renderEditableText(item, "tag", item.tag, { color: element.tagColor || accColor, fontSize: `${element.tagFontSize || 10}px` })}
                                                    </span>
                                                )}
                                                {renderEditableText(item, "subtitle", item.subtitle, { color: element.subtitleColor || "#94a3b8", fontSize: `${element.subtitleFontSize || 12}px` })}
                                            </div>
                                            {item.description && (
                                                <div className="mt-1">
                                                    {renderEditableText(item, "description", item.description, { color: element.textColor || "#e2e8f0", fontSize: `${element.bodyFontSize || 12}px`, lineHeight: "1.45" }, "block")}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Center Node */}
                                <div style={getNodeShapeStyles(element.nodeSize, accColor)}>
                                    {getIconComponent(item.icon, Math.max(12, element.nodeSize * 0.45))}
                                </div>

                                {/* Right Side Item */}
                                <div
                                    className={`w-[45%] ${
                                        !isEven ? "text-left" : "pointer-events-none opacity-0"
                                    }`}
                                >
                                    {!isEven && (
                                        <div
                                            className="rounded-xl p-3 flex flex-col gap-y-1.5"
                                            style={{
                                                minHeight: `${cardMinHeight}px`,
                                                backgroundColor: cardBgColor,
                                                borderTop: `${element.cardBorderWidth}px solid ${element.cardBorderColor || "rgba(255,255,255,0.15)"}`,
                                                borderBottom: `${element.cardBorderWidth}px solid ${element.cardBorderColor || "rgba(255,255,255,0.15)"}`,
                                                borderRight: `${element.cardBorderWidth}px solid ${element.cardBorderColor || "rgba(255,255,255,0.15)"}`,
                                                borderLeft: `3px solid ${accColor}`,
                                                borderRadius: `${element.borderRadius}px`,
                                                boxShadow: getShadowStyle(),
                                            }}
                                        >
                                            <div className="flex items-center gap-1.5 pb-0.5">
                                                {renderEditableText(
                                                    item,
                                                    "title",
                                                    item.title,
                                                    { color: element.titleColor || "#ffffff", fontSize: `${element.titleFontSize || 15}px`, fontWeight: element.titleFontWeight || 600, lineHeight: "1.3" }
                                                )}
                                                {renderEditableText(
                                                    item,
                                                    "date",
                                                    item.date,
                                                    { color: element.dateColor || "#38bdf8", fontSize: `${element.dateFontSize || 11}px` },
                                                    "rounded-full bg-white/10 px-2 py-0.5 font-medium"
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {renderEditableText(item, "subtitle", item.subtitle, { color: element.subtitleColor || "#94a3b8", fontSize: `${element.subtitleFontSize || 12}px` })}
                                                {item.tag && (
                                                    <span
                                                        className="rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider"
                                                        style={{
                                                            backgroundColor: `${element.tagColor || accColor}22`,
                                                            color: element.tagColor || accColor,
                                                            border: `1px solid ${element.tagColor || accColor}55`,
                                                            fontSize: `${element.tagFontSize || 10}px`,
                                                        }}
                                                    >
                                                        {renderEditableText(item, "tag", item.tag, { color: element.tagColor || accColor, fontSize: `${element.tagFontSize || 10}px` })}
                                                    </span>
                                                )}
                                            </div>
                                            {item.description && (
                                                <div className="mt-1">
                                                    {renderEditableText(item, "description", item.description, { color: element.textColor || "#e2e8f0", fontSize: `${element.bodyFontSize || 12}px`, lineHeight: "1.45" }, "block")}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 3. THEME: HORIZONTAL STEPPER */}
            {element.theme === "horizontal-stepper" && (
                <div
                    className="relative flex items-start"
                    style={{
                        gap: `${element.spacing + 16}px`,
                        minWidth: `${Math.max(520, element.items.length * (Math.min(cardWidth, 260) + 20))}px`,
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
                                className={`relative z-10 flex flex-1 flex-col items-center text-center ${getHoverClasses()}`}
                                style={{ minWidth: `${Math.min(cardWidth, 260)}px` }}
                            >
                                {/* Step Node */}
                                <div style={getNodeShapeStyles(element.nodeSize, accColor)}>
                                    {getIconComponent(item.icon, Math.max(12, element.nodeSize * 0.45))}
                                </div>

                                {/* Step Label Card */}
                                <div
                                    className="mt-3.5 w-full rounded-xl p-2.5 flex flex-col justify-center gap-y-1.5"
                                    style={{
                                        minHeight: `${cardMinHeight}px`,
                                        backgroundColor: cardBgColor,
                                        border: `${element.cardBorderWidth}px solid ${element.cardBorderColor || "rgba(255,255,255,0.15)"}`,
                                        borderRadius: `${element.borderRadius}px`,
                                        boxShadow: getShadowStyle(),
                                    }}
                                >
                                    <div className="mb-1 font-semibold uppercase tracking-wider">
                                        {renderEditableText(item, "date", item.date, { color: element.dateColor || accColor, fontSize: `${element.dateFontSize || 11}px` })}
                                    </div>
                                    <div className="leading-tight">
                                        {renderEditableText(
                                            item,
                                            "title",
                                            item.title,
                                            { color: element.titleColor || "#ffffff", fontSize: `${element.titleFontSize || 15}px`, fontWeight: element.titleFontWeight || 600, lineHeight: "1.3" }
                                        )}
                                    </div>
                                    <div className="mt-1 flex items-center justify-center gap-1.5">
                                        {renderEditableText(item, "subtitle", item.subtitle, { color: element.subtitleColor || "#94a3b8", fontSize: `${element.subtitleFontSize || 12}px` })}
                                        {item.tag && (
                                            <span
                                                className="rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider"
                                                style={{
                                                    backgroundColor: `${element.tagColor || accColor}22`,
                                                    color: element.tagColor || accColor,
                                                    border: `1px solid ${element.tagColor || accColor}55`,
                                                    fontSize: `${element.tagFontSize || 10}px`,
                                                }}
                                            >
                                                {renderEditableText(item, "tag", item.tag, { color: element.tagColor || accColor, fontSize: `${element.tagFontSize || 10}px` })}
                                            </span>
                                        )}
                                    </div>
                                    {item.description && (
                                        <div className="mt-1.5">
                                            {renderEditableText(item, "description", item.description, { color: element.textColor || "#e2e8f0", fontSize: `${element.bodyFontSize || 12}px`, lineHeight: "1.45" }, "block")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 4. THEME: NEON CYBERPUNK */}
            {element.theme === "neon-cyber" && (
                <div
                    className="relative flex flex-col font-mono"
                    style={{ gap: `${element.spacing + 4}px`, width: `${cardWidth}px` }}
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
                                className={`relative flex items-start gap-4 ${getHoverClasses()}`}
                            >
                                {/* Node */}
                                <div style={getNodeShapeStyles(element.nodeSize, accColor)}>
                                    {getIconComponent(item.icon, Math.max(12, element.nodeSize * 0.45))}
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
                                            {renderEditableText(
                                                item,
                                                "title",
                                                item.title,
                                                { color: element.titleColor || "#ffffff", fontSize: `${element.titleFontSize || 15}px`, fontWeight: 700, lineHeight: "1.3" }
                                            )}
                                        </div>
                                        <span
                                            className="px-1.5 py-0.5 font-bold uppercase"
                                            style={{
                                                backgroundColor: `${accColor}22`,
                                                color: element.dateColor || accColor,
                                                border: `1px solid ${accColor}66`,
                                                fontSize: `${element.dateFontSize || 10}px`,
                                            }}
                                        >
                                            {renderEditableText(item, "date", item.date, { color: element.dateColor || accColor, fontSize: `${element.dateFontSize || 10}px` })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2" style={{ color: accColor }}>
                                        &gt; {renderEditableText(item, "subtitle", item.subtitle, { color: element.subtitleColor || "#94a3b8", fontSize: `${element.subtitleFontSize || 12}px` })}
                                        {item.tag && (
                                            <span
                                                className="rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider"
                                                style={{
                                                    backgroundColor: `${element.tagColor || accColor}22`,
                                                    color: element.tagColor || accColor,
                                                    border: `1px solid ${element.tagColor || accColor}55`,
                                                    fontSize: `${element.tagFontSize || 10}px`,
                                                }}
                                            >
                                                {renderEditableText(item, "tag", item.tag, { color: element.tagColor || accColor, fontSize: `${element.tagFontSize || 10}px` })}
                                            </span>
                                        )}
                                    </div>

                                    {item.description && (
                                        <div className="mt-2 font-sans">
                                            {renderEditableText(item, "description", item.description, { color: element.textColor || "#e2e8f0", fontSize: `${element.bodyFontSize || 12}px`, lineHeight: "1.45" }, "block")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 5. THEME: GLASS CARDS */}
            {element.theme === "glass-cards" && (
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
                                className={`relative flex items-start gap-4 ${getHoverClasses()}`}
                            >
                                {/* Node */}
                                <div style={getNodeShapeStyles(element.nodeSize, accColor)}>
                                    {getIconComponent(item.icon, Math.max(12, element.nodeSize * 0.45))}
                                </div>

                                <div
                                    className="flex-1 p-4 transition hover:border-white/30 flex flex-col justify-center gap-y-1.5"
                                    style={{
                                        minHeight: `${cardMinHeight}px`,
                                        backgroundColor: cardBgColor,
                                        border: `${element.cardBorderWidth}px solid ${element.cardBorderColor || "rgba(255,255,255,0.2)"}`,
                                        boxShadow: getShadowStyle() !== "none" ? getShadowStyle() : "0 8px 32px 0 rgba(0, 0, 0, 0.35)",
                                        borderRadius: `${element.borderRadius}px`,
                                    }}
                                >
                                    <div className="flex items-center justify-between pb-1">
                                        {renderEditableText(
                                            item,
                                            "title",
                                            item.title,
                                            { color: element.titleColor || "#ffffff", fontSize: `${element.titleFontSize || 15}px`, fontWeight: element.titleFontWeight || 600, lineHeight: "1.3" }
                                        )}
                                        {renderEditableText(
                                            item,
                                            "date",
                                            item.date,
                                            { color: element.dateColor || "#38bdf8", fontSize: `${element.dateFontSize || 11}px` },
                                            "rounded-lg bg-white/10 px-2.5 py-0.5 font-medium"
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 font-medium">
                                        {renderEditableText(item, "subtitle", item.subtitle, { color: element.subtitleColor || "#94a3b8", fontSize: `${element.subtitleFontSize || 12}px` })}
                                        {item.tag && (
                                            <span
                                                className="rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider"
                                                style={{
                                                    backgroundColor: `${element.tagColor || accColor}22`,
                                                    color: element.tagColor || accColor,
                                                    border: `1px solid ${element.tagColor || accColor}55`,
                                                    fontSize: `${element.tagFontSize || 10}px`,
                                                }}
                                            >
                                                {renderEditableText(item, "tag", item.tag, { color: element.tagColor || accColor, fontSize: `${element.tagFontSize || 10}px` })}
                                            </span>
                                        )}
                                    </div>
                                    {item.description && (
                                        <div className="mt-2 leading-relaxed">
                                            {renderEditableText(item, "description", item.description, { color: element.textColor || "#e2e8f0", fontSize: `${element.bodyFontSize || 12}px`, lineHeight: "1.45" }, "block")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 6. THEME: BULLET COMPACT (CV / RESUME MINIMAL) */}
            {element.theme === "bullet-compact" && (
                <div
                    className="relative flex flex-col"
                    style={{ gap: `${element.spacing}px`, width: `${cardWidth}px` }}
                >
                    {/* Hairline Rule */}
                    <div
                        className="absolute bottom-2 top-2"
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
                                className={`relative flex items-start gap-4 ${getHoverClasses()}`}
                            >
                                {/* Node */}
                                <div style={getNodeShapeStyles(element.nodeSize, accColor)}>
                                    {getIconComponent(item.icon, Math.max(10, element.nodeSize * 0.4))}
                                </div>

                                <div
                                    className="flex-1 pb-1 px-3 py-2 flex flex-col justify-center gap-y-1.5"
                                    style={{
                                        minHeight: `${cardMinHeight}px`,
                                        backgroundColor: cardBgColor,
                                        border: `${element.cardBorderWidth}px solid ${element.cardBorderColor || "transparent"}`,
                                        borderRadius: `${element.borderRadius}px`,
                                        boxShadow: getShadowStyle(),
                                    }}
                                >
                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            {renderEditableText(
                                                item,
                                                "title",
                                                item.title,
                                                { color: element.titleColor || "#ffffff", fontSize: `${element.titleFontSize || 15}px`, fontWeight: 600, lineHeight: "1.3" }
                                            )}
                                            <span className="text-gray-400" style={{ fontSize: `${element.subtitleFontSize || 12}px` }}>•</span>
                                            {renderEditableText(
                                                item,
                                                "subtitle",
                                                item.subtitle,
                                                { color: element.subtitleColor || "#94a3b8", fontSize: `${element.subtitleFontSize || 12}px` },
                                                "font-medium"
                                            )}
                                            {item.tag && (
                                                <span
                                                    className="rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider"
                                                    style={{
                                                        backgroundColor: `${element.tagColor || accColor}22`,
                                                        color: element.tagColor || accColor,
                                                        border: `1px solid ${element.tagColor || accColor}55`,
                                                        fontSize: `${element.tagFontSize || 10}px`,
                                                    }}
                                                >
                                                    {renderEditableText(item, "tag", item.tag, { color: element.tagColor || accColor, fontSize: `${element.tagFontSize || 10}px` })}
                                                </span>
                                            )}
                                        </div>
                                        {renderEditableText(
                                            item,
                                            "date",
                                            item.date,
                                            { color: element.dateColor || "#38bdf8", fontSize: `${element.dateFontSize || 11}px` },
                                            "font-mono"
                                        )}
                                    </div>
                                    {item.description && (
                                        <div className="mt-1">
                                            {renderEditableText(item, "description", item.description, { color: element.textColor || "#e2e8f0", fontSize: `${element.bodyFontSize || 12}px`, lineHeight: "1.45" }, "block")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 7. THEME: CIRCULAR MILESTONES */}
            {element.theme === "circular-milestones" && (
                <div
                    className="relative flex flex-col"
                    style={{ gap: `${element.spacing + 6}px`, width: `${cardWidth}px` }}
                >
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
                                className={`relative flex items-center gap-4 ${getHoverClasses()}`}
                            >
                                {/* Milestone Badge Node */}
                                <div style={getNodeShapeStyles(element.nodeSize, accColor)}>
                                    <div className="flex flex-col items-center justify-center">
                                        {getIconComponent(item.icon, Math.max(12, element.nodeSize * 0.45))}
                                        {element.nodeSize >= 38 && (
                                            <span className="text-[8px] uppercase tracking-wider font-bold">
                                                {idx + 1}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div
                                    className="flex-1 p-3.5 flex flex-col justify-center gap-y-1.5"
                                    style={{
                                        minHeight: `${cardMinHeight}px`,
                                        backgroundColor: cardBgColor,
                                        border: `${element.cardBorderWidth}px solid ${element.cardBorderColor || "rgba(255,255,255,0.15)"}`,
                                        borderRadius: `${element.borderRadius}px`,
                                        boxShadow: getShadowStyle(),
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        {renderEditableText(
                                            item,
                                            "title",
                                            item.title,
                                            { color: element.titleColor || "#ffffff", fontSize: `${element.titleFontSize || 15}px`, fontWeight: element.titleFontWeight || 600, lineHeight: "1.3" }
                                        )}
                                        <span
                                            className="rounded-full px-2 py-0.5 font-semibold"
                                            style={{
                                                backgroundColor: `${accColor}22`,
                                                color: element.dateColor || accColor,
                                                fontSize: `${element.dateFontSize || 11}px`,
                                            }}
                                        >
                                            {renderEditableText(item, "date", item.date, { color: element.dateColor || accColor, fontSize: `${element.dateFontSize || 11}px` })}
                                        </span>
                                    </div>
                                    <div className="mt-0.5 flex items-center gap-2">
                                        {renderEditableText(item, "subtitle", item.subtitle, { color: element.subtitleColor || "#94a3b8", fontSize: `${element.subtitleFontSize || 12}px` })}
                                        {item.tag && (
                                            <span
                                                className="rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider"
                                                style={{
                                                    backgroundColor: `${element.tagColor || accColor}22`,
                                                    color: element.tagColor || accColor,
                                                    border: `1px solid ${element.tagColor || accColor}55`,
                                                    fontSize: `${element.tagFontSize || 10}px`,
                                                }}
                                            >
                                                {renderEditableText(item, "tag", item.tag, { color: element.tagColor || accColor, fontSize: `${element.tagFontSize || 10}px` })}
                                            </span>
                                        )}
                                    </div>
                                    {item.description && (
                                        <div className="mt-1.5">
                                            {renderEditableText(item, "description", item.description, { color: element.textColor || "#e2e8f0", fontSize: `${element.bodyFontSize || 12}px`, lineHeight: "1.45" }, "block")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 8. THEME: GRADIENT METRO */}
            {element.theme === "gradient-metro" && (
                <div
                    className="relative flex flex-col"
                    style={{ gap: `${element.spacing + 4}px`, width: `${cardWidth}px` }}
                >
                    {/* Subway track */}
                    <div
                        className="absolute bottom-6 top-6"
                        style={{
                            left: `${element.nodeSize / 2}px`,
                            transform: "translateX(-50%)",
                            width: `${element.lineWidth}px`,
                            backgroundColor: element.lineColor,
                            borderRadius: "9999px",
                        }}
                    />

                    {element.items.map((item, idx) => {
                        const accColor = item.accentColor || element.accentColor;
                        return (
                            <div
                                key={item.id || idx}
                                className={`relative flex items-start gap-4 ${getHoverClasses()}`}
                            >
                                {/* Metro Stop Node */}
                                <div style={getNodeShapeStyles(element.nodeSize, accColor)}>
                                    {getIconComponent(item.icon, Math.max(12, element.nodeSize * 0.45))}
                                </div>

                                <div
                                    className="flex-1 p-3.5 flex flex-col justify-center gap-y-1.5"
                                    style={{
                                        minHeight: `${cardMinHeight}px`,
                                        backgroundColor: cardBgColor,
                                        border: `${element.cardBorderWidth}px solid ${element.cardBorderColor || "rgba(255,255,255,0.15)"}`,
                                        borderRadius: `${element.borderRadius}px`,
                                        boxShadow: getShadowStyle(),
                                    }}
                                >
                                    <div className="flex items-center justify-between pb-1">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-black"
                                                style={{ backgroundColor: accColor }}
                                            >
                                                STN {idx + 1}
                                            </span>
                                            {renderEditableText(
                                                item,
                                                "title",
                                                item.title,
                                                { color: element.titleColor || "#ffffff", fontSize: `${element.titleFontSize || 15}px`, fontWeight: 700, lineHeight: "1.3" }
                                            )}
                                        </div>
                                        {renderEditableText(
                                            item,
                                            "date",
                                            item.date,
                                            { color: element.dateColor || "#38bdf8", fontSize: `${element.dateFontSize || 11}px` },
                                            "font-mono"
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 font-medium">
                                        {renderEditableText(item, "subtitle", item.subtitle, { color: element.subtitleColor || "#94a3b8", fontSize: `${element.subtitleFontSize || 12}px` })}
                                        {item.tag && (
                                            <span
                                                className="rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider"
                                                style={{
                                                    backgroundColor: `${element.tagColor || accColor}22`,
                                                    color: element.tagColor || accColor,
                                                    border: `1px solid ${element.tagColor || accColor}55`,
                                                    fontSize: `${element.tagFontSize || 10}px`,
                                                }}
                                            >
                                                {renderEditableText(item, "tag", item.tag, { color: element.tagColor || accColor, fontSize: `${element.tagFontSize || 10}px` })}
                                            </span>
                                        )}
                                    </div>
                                    {item.description && (
                                        <div className="mt-1">
                                            {renderEditableText(item, "description", item.description, { color: element.textColor || "#e2e8f0", fontSize: `${element.bodyFontSize || 12}px`, lineHeight: "1.45" }, "block")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
