"use client";

import React from "react";
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
import type {
    TimelineElement,
    TimelineIconType,
    TimelineItem,
} from "../../../../types/timeline";

export type TimelineEditingState = {
    itemId: string;
    field: "title" | "subtitle" | "date" | "description" | "tag";
} | null;

export type TimelineThemeProps = {
    element: TimelineElement;
    isSelected: boolean;
    isEraserMode: boolean;
    onUpdateItem: (itemId: string, updates: Partial<TimelineItem>) => void;
    editingState: TimelineEditingState;
    setEditingState: (state: TimelineEditingState) => void;
};

export const getIconComponent = (
    iconName?: TimelineIconType,
    size = 16
) => {
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

export const getShadowStyle = (
    shadow: TimelineElement["shadow"],
    accentColor?: string
) => {
    if (shadow === "none") return "none";
    if (shadow === "sm") return "0 2px 6px rgba(0,0,0,0.3)";
    if (shadow === "md") return "0 6px 18px rgba(0,0,0,0.4)";
    if (shadow === "lg") return "0 12px 36px rgba(0,0,0,0.55)";
    if (shadow === "neon") {
        const acc = accentColor || "#3b82f6";
        return `0 0 16px ${acc}88, 0 0 32px ${acc}33`;
    }
    return "none";
};

export const getHoverClasses = (
    hoverEffect: TimelineElement["hoverEffect"]
) => {
    if (hoverEffect === "lift")
        return "transition-transform duration-200 hover:-translate-y-1.5";
    if (hoverEffect === "scale")
        return "transition-transform duration-200 hover:scale-[1.02]";
    if (hoverEffect === "glow")
        return "transition-all duration-200 hover:brightness-110";
    return "transition-all duration-200";
};

export const getNodeShapeStyles = (
    shape: TimelineElement["nodeShape"],
    size: number,
    accColor: string
): React.CSSProperties => {
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

    if (shape === "hexagon") {
        return {
            ...base,
            clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            borderRadius: 0,
        };
    }
    if (shape === "diamond") {
        return {
            ...base,
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            borderRadius: 0,
        };
    }
    if (shape === "square") {
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

export function renderEditableText({
    item,
    field,
    value,
    style,
    className = "",
    element,
    isEraserMode,
    editingState,
    setEditingState,
    onUpdateItem,
    cardBgColor,
}: {
    item: TimelineItem;
    field: "title" | "subtitle" | "date" | "description" | "tag";
    value: string;
    style: React.CSSProperties;
    className?: string;
    element: TimelineElement;
    isEraserMode: boolean;
    editingState: TimelineEditingState;
    setEditingState: (state: TimelineEditingState) => void;
    onUpdateItem: (itemId: string, updates: Partial<TimelineItem>) => void;
    cardBgColor: string;
}) {
    const isEditing =
        editingState?.itemId === item.id && editingState?.field === field;

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
                    (!style.color ||
                        style.color === "#ffffff" ||
                        style.color === "white" ||
                        style.color === "#fff")
                        ? "0 1px 2px rgba(0,0,0,0.7), 0 0 1px rgba(0,0,0,0.8)"
                        : undefined,
                ...style,
            }}
            title="Double click to edit directly"
        >
            {value || (field === "tag" ? "" : "(empty)")}
        </span>
    );
}
