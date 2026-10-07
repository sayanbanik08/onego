"use client";

import React from "react";
import type { CardElement } from "../../types/card";

export type CardEditingField = "heading" | "body" | "button" | null;

export type CardStyleProps = {
    element: CardElement;
    cardBgColor: string;
    cardMinHeight: number;
    shadowStyle: string;
    editingField: CardEditingField;
    setEditingField: (field: CardEditingField) => void;
    onUpdate: (updates: Partial<CardElement>) => void;
    isEraserMode: boolean;
};

export const getCardShadowStyle = (element: CardElement): string => {
    if (element.shadow === "none") return "none";
    if (element.shadow === "sm") return "0 2px 8px rgba(0,0,0,0.25)";
    if (element.shadow === "md") return "0 8px 24px rgba(0,0,0,0.35)";
    if (element.shadow === "lg") return "0 16px 48px rgba(0,0,0,0.5)";
    if (element.shadow === "neon") {
        const acc = element.accentColor || "#387ef0";
        return `0 0 20px ${acc}66, 0 0 40px ${acc}33`;
    }
    if (element.shadow === "neumorphic") {
        return "16px 16px 36px rgba(0,0,0,0.18), -16px -16px 36px rgba(255,255,255,0.7)";
    }
    return "none";
};

export const handleCardButtonClick = (
    e: React.MouseEvent,
    buttonLink?: string
) => {
    e.stopPropagation();
    if (buttonLink) {
        let url = buttonLink.trim();
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }
        window.open(url, "_blank", "noopener,noreferrer");
    }
};

export const handleCardSocialClick = (
    e: React.MouseEvent,
    url?: string
) => {
    e.stopPropagation();
    if (url) {
        let targetUrl = url.trim();
        if (
            !targetUrl.startsWith("http://") &&
            !targetUrl.startsWith("https://")
        ) {
            targetUrl = "https://" + targetUrl;
        }
        window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
};

export function CardEditableText({
    field,
    value,
    style,
    className = "",
    multiline = false,
    editingField,
    setEditingField,
    onUpdate,
    isEraserMode,
    fallbackText,
}: {
    field: "heading" | "body" | "button";
    value: string;
    style: React.CSSProperties;
    className?: string;
    multiline?: boolean;
    editingField: CardEditingField;
    setEditingField: (field: CardEditingField) => void;
    onUpdate: (updates: Partial<CardElement>) => void;
    isEraserMode: boolean;
    fallbackText?: string;
}) {
    const isEditing = editingField === field;

    if (isEditing) {
        if (multiline) {
            return (
                <textarea
                    autoFocus
                    value={value}
                    onChange={(e) => onUpdate({ bodyText: e.target.value })}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") setEditingField(null);
                    }}
                    className="w-full rounded bg-gray-900/90 p-1.5 text-inherit outline-none ring-1 ring-blue-500"
                    rows={3}
                    style={style}
                />
            );
        }

        return (
            <input
                autoFocus
                type="text"
                value={value}
                onChange={(e) => {
                    if (field === "heading")
                        onUpdate({ heading: e.target.value });
                    if (field === "button")
                        onUpdate({ buttonText: e.target.value });
                }}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape")
                        setEditingField(null);
                }}
                className="w-full rounded bg-gray-900/90 px-1.5 py-0.5 text-inherit outline-none ring-1 ring-blue-500"
                style={style}
            />
        );
    }

    return (
        <span
            onDoubleClick={(e) => {
                if (isEraserMode) return;
                e.stopPropagation();
                setEditingField(field);
            }}
            className={`cursor-text selection:bg-blue-600/30 ${className}`}
            style={style}
            title="Double click to edit directly"
        >
            {value || fallbackText || (field === "button" ? "Click Me" : "(empty)")}
        </span>
    );
}
