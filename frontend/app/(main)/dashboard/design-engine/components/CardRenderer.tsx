"use client";

import React, { useState } from "react";
import type { CardElement } from "../types/card";
import "./card-animations.css";
import type { CardEditingField, CardStyleProps } from "./card/cardShared";
import { getCardShadowStyle } from "./card/cardShared";
import NeonGlowCard from "./card/styles/NeonGlowCard";
import CornerFoldCard from "./card/styles/CornerFoldCard";
import NeumorphicCard from "./card/styles/NeumorphicCard";
import SocialMarqueeCard from "./card/styles/SocialMarqueeCard";

export { SocialPlatformIcon } from "./card/SocialPlatformIcon";

type CardRendererProps = {
    element: CardElement;
    isSelected: boolean;
    isEraserMode: boolean;
    onUpdate: (updates: Partial<CardElement>) => void;
};

export default function CardRenderer({
    element,
    isSelected,
    isEraserMode,
    onUpdate,
}: CardRendererProps) {
    const [editingField, setEditingField] = useState<CardEditingField>(null);

    const cardWidth = element.cardWidth || 320;
    const cardMinHeight = element.cardMinHeight || 240;
    const cardBgColor =
        element.cardBg && element.cardBg !== "transparent"
            ? element.cardBg
            : element.cardBg === "transparent"
            ? "transparent"
            : "#171717";

    const styleProps: CardStyleProps = {
        element,
        cardBgColor,
        cardMinHeight,
        shadowStyle: getCardShadowStyle(element),
        editingField,
        setEditingField,
        onUpdate,
        isEraserMode,
    };

    return (
        <div
            className="relative select-none transition-all duration-300"
            style={{
                width: `${cardWidth}px`,
                minHeight: `${cardMinHeight}px`,
            }}
        >
            {element.design === "neon-glow" && (
                <NeonGlowCard {...styleProps} />
            )}
            {element.design === "corner-fold" && (
                <CornerFoldCard {...styleProps} />
            )}
            {element.design === "neumorphic" && (
                <NeumorphicCard {...styleProps} />
            )}
            {element.design === "social-marquee" && (
                <SocialMarqueeCard {...styleProps} />
            )}
        </div>
    );
}
