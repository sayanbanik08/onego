"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import type { CardStyleProps } from "../cardShared";
import {
    CardEditableText,
    handleCardButtonClick,
} from "../cardShared";

export default function NeonGlowCard({
    element,
    cardBgColor,
    cardMinHeight,
    shadowStyle,
    editingField,
    setEditingField,
    onUpdate,
    isEraserMode,
}: CardStyleProps) {
    return (
        <div
            className="group relative flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-2xl"
            style={{
                width: "100%",
                minHeight: `${cardMinHeight}px`,
                backgroundColor: cardBgColor,
                borderRadius: `${element.borderRadius ?? 16}%`,
                border: `${element.cardBorderWidth ?? 0}px solid ${
                    element.cardBorderColor || "transparent"
                }`,
                boxShadow: shadowStyle,
            }}
        >
            {/* Rotating Beam on Hover */}
            <div
                className="pointer-events-none absolute -top-1/2 -left-1/2 h-[200%] w-[200%] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: `conic-gradient(from 0deg, transparent 0deg, ${
                        element.accentColor || "#ff2288"
                    } 120deg, #387ef0 180deg, transparent 240deg)`,
                    animation: "card_beam_spin 6s linear infinite",
                    zIndex: 1,
                }}
            />

            {/* Dark blur overlay */}
            <div
                className="pointer-events-none absolute inset-[2px] backdrop-blur-[40px]"
                style={{
                    backgroundColor:
                        cardBgColor === "transparent"
                            ? "rgba(23, 23, 23, 0.75)"
                            : cardBgColor,
                    borderRadius: `${element.borderRadius ?? 16}%`,
                    zIndex: 2,
                }}
            />

            {/* Card Inner Content */}
            <div
                className="relative z-10 flex h-full flex-1 flex-col justify-center items-center text-center p-6 gap-3.5"
                style={{
                    minHeight: `${cardMinHeight}px`,
                }}
            >
                {/* Section 1: Heading */}
                <div className="w-full">
                    <CardEditableText
                        field="heading"
                        value={element.heading}
                        style={{
                            color: element.headingColor || "#ffffff",
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
                            color: element.bodyColor || "#94a3b8",
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
                            className="group/btn flex items-center justify-center gap-2 font-medium transition-all duration-200 hover:brightness-110 active:scale-95"
                            style={{
                                backgroundColor:
                                    element.buttonBgColor ||
                                    element.accentColor ||
                                    "#3b82f6",
                                color: element.buttonTextColor || "#ffffff",
                                borderRadius: `${
                                    element.buttonBorderRadius ?? 8
                                }px`,
                                fontSize: `${element.buttonFontSize || 14}px`,
                                padding: `${element.buttonPaddingY ?? 8}px ${
                                    element.buttonPaddingX ?? 18
                                }px`,
                                boxShadow: `0 4px 14px ${
                                    element.buttonBgColor ||
                                    element.accentColor ||
                                    "#3b82f6"
                                }44`,
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
