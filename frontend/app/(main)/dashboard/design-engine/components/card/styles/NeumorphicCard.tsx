"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import type { CardStyleProps } from "../cardShared";
import {
    CardEditableText,
    handleCardButtonClick,
} from "../cardShared";

export default function NeumorphicCard({
    element,
    cardBgColor,
    cardMinHeight,
    editingField,
    setEditingField,
    onUpdate,
    isEraserMode,
}: CardStyleProps) {
    const bgColor =
        cardBgColor === "transparent"
            ? "#e0e0e0"
            : cardBgColor || "#e0e0e0";

    const shadow =
        element.shadow === "none"
            ? "none"
            : "18px 18px 45px rgba(0,0,0,0.14), -18px -18px 45px rgba(255,255,255,0.85)";

    return (
        <div
            className="relative flex flex-col justify-center items-center text-center p-6 gap-3.5 transition-all duration-300"
            style={{
                width: "100%",
                minHeight: `${cardMinHeight}px`,
                backgroundColor: bgColor,
                borderRadius: `${element.borderRadius ?? 32}%`,
                border: `${element.cardBorderWidth ?? 0}px solid ${
                    element.cardBorderColor || "transparent"
                }`,
                boxShadow: shadow,
            }}
        >
            {/* Section 1: Heading */}
            <div className="w-full">
                <CardEditableText
                    field="heading"
                    value={element.heading}
                    style={{
                        color: element.headingColor || "#262626",
                        fontSize: `${element.headingFontSize || 22}px`,
                        fontWeight: element.headingFontWeight || 700,
                        lineHeight: "1.25",
                    }}
                    className="block font-bold tracking-tight text-center"
                    editingField={editingField}
                    setEditingField={setEditingField}
                    onUpdate={onUpdate}
                    isEraserMode={isEraserMode}
                />
            </div>

            {/* Section 2: Body Text */}
            <div className="w-full">
                <CardEditableText
                    field="body"
                    value={element.bodyText}
                    style={{
                        color: element.bodyColor || "#525252",
                        fontSize: `${element.bodyFontSize || 14}px`,
                        lineHeight: "1.5",
                    }}
                    className="block leading-relaxed text-center"
                    multiline
                    editingField={editingField}
                    setEditingField={setEditingField}
                    onUpdate={onUpdate}
                    isEraserMode={isEraserMode}
                />
            </div>

            {/* Section 3: Button */}
            {element.showButton && (
                <div className="flex w-full justify-center pt-1">
                    <button
                        type="button"
                        onClick={(e) =>
                            handleCardButtonClick(e, element.buttonLink)
                        }
                        className="flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-95"
                        style={{
                            backgroundColor:
                                element.buttonBgColor ||
                                element.accentColor ||
                                "#e0e0e0",
                            color: element.buttonTextColor || "#262626",
                            borderRadius: `${element.buttonBorderRadius ?? 20}px`,
                            fontSize: `${element.buttonFontSize || 14}px`,
                            padding: `${element.buttonPaddingY ?? 8}px ${
                                element.buttonPaddingX ?? 20
                            }px`,
                            boxShadow:
                                "6px 6px 14px rgba(0,0,0,0.12), -6px -6px 14px rgba(255,255,255,0.9)",
                        }}
                    >
                        <CardEditableText
                            field="button"
                            value={element.buttonText}
                            style={{
                                color: element.buttonTextColor || "#262626",
                            }}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onUpdate={onUpdate}
                            isEraserMode={isEraserMode}
                            fallbackText="Click Me"
                        />
                        {element.buttonLink && (
                            <ExternalLink
                                size={Math.max(
                                    12,
                                    (element.buttonFontSize || 14) * 0.85
                                )}
                            />
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
