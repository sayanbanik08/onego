"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import type { CardStyleProps } from "../cardShared";
import {
    CardEditableText,
    handleCardButtonClick,
} from "../cardShared";

export default function CornerFoldCard({
    element,
    cardBgColor,
    cardMinHeight,
    shadowStyle,
    editingField,
    setEditingField,
    onUpdate,
    isEraserMode,
}: CardStyleProps) {
    const bgColor =
        cardBgColor === "transparent"
            ? "#40E0D0"
            : cardBgColor || "#40E0D0";

    return (
        <div
            className="group relative flex flex-col justify-between overflow-hidden transition-all duration-500"
            style={{
                width: "100%",
                minHeight: `${cardMinHeight}px`,
                backgroundColor: bgColor,
                borderRadius: `${element.borderRadius ?? 16}%`,
                border: `${element.cardBorderWidth ?? 0}px solid ${
                    element.cardBorderColor || "transparent"
                }`,
                boxShadow: shadowStyle,
            }}
        >
            {/* Top-Right Decorative Tab */}
            <div
                className="pointer-events-none absolute top-0 right-0 h-[22%] w-[22%] transition-all duration-500 ease-out group-hover:h-full group-hover:w-full group-hover:opacity-95"
                style={{
                    backgroundColor: element.accentColor || "#ADD8E6",
                    borderRadius: `0 ${element.borderRadius ?? 16}% 0 100%`,
                    zIndex: 1,
                }}
            />

            {/* Bottom-Left Decorative Tab */}
            <div
                className="pointer-events-none absolute bottom-0 left-0 h-[22%] w-[22%] transition-all duration-500 ease-out group-hover:h-full group-hover:w-full group-hover:opacity-95"
                style={{
                    backgroundColor: element.accentColor || "#ADD8E6",
                    borderRadius: `0 100% 0 ${element.borderRadius ?? 16}%`,
                    zIndex: 1,
                }}
            />

            {/* Content Layer */}
            <div
                className="relative z-10 flex h-full flex-1 flex-col justify-center items-center text-center p-6 gap-3.5"
                style={{ minHeight: `${cardMinHeight}px` }}
            >
                {/* Section 1: Heading */}
                <div className="w-full">
                    <CardEditableText
                        field="heading"
                        value={element.heading}
                        style={{
                            color: element.headingColor || "#0f172a",
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
                            color: element.bodyColor || "#1e293b",
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
                            className="flex items-center justify-center gap-2 font-semibold transition-all duration-200 hover:brightness-105 active:scale-95"
                            style={{
                                backgroundColor:
                                    element.buttonBgColor || "#0f172a",
                                color: element.buttonTextColor || "#ffffff",
                                borderRadius: `${
                                    element.buttonBorderRadius ?? 8
                                }px`,
                                fontSize: `${element.buttonFontSize || 14}px`,
                                padding: `${element.buttonPaddingY ?? 8}px ${
                                    element.buttonPaddingX ?? 18
                                }px`,
                            }}
                        >
                            <CardEditableText
                                field="button"
                                value={element.buttonText}
                                style={{
                                    color: element.buttonTextColor || "#ffffff",
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
        </div>
    );
}
