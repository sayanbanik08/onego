"use client";

import React from "react";
import type { CardElement } from "../types/card";
import {
    CARD_DESIGNS,
    CardThemesSection,
} from "./card/properties/CardThemesSection";
import { CardDimensionsSection } from "./card/properties/CardDimensionsSection";
import { CardStylingSection } from "./card/properties/CardStylingSection";
import { CardContentSection } from "./card/properties/CardContentSection";
import { CardButtonSection } from "./card/properties/CardButtonSection";
import { CardSocialMarqueeSection } from "./card/properties/CardSocialMarqueeSection";
import { CardTransformSection } from "./card/properties/CardTransformSection";

type CardPropertiesProps = {
    selectedElement: CardElement;
    updateElement: (id: string, updates: Partial<CardElement>) => void;
};

export default function CardProperties({
    selectedElement: el,
    updateElement,
}: CardPropertiesProps) {
    const up = (updates: Partial<CardElement>) =>
        updateElement(el.id, updates);

    const isSocialMarquee = el.design === "social-marquee";

    return (
        <div className="w-full max-w-full min-w-0 space-y-4 pb-8 text-white overflow-x-hidden">
            {/* ── Element Header Info ─────────────────────────── */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <div className="text-sm font-medium text-white">
                    Element {el.serialNumber} • Card
                </div>
                <div className="mt-1 text-xs text-gray-400">
                    Theme:{" "}
                    {CARD_DESIGNS.find((d) => d.value === el.design)?.label ??
                        el.design}
                </div>
            </div>

            {/* ── Card Themes (4 Styles) ─────────────────────── */}
            <CardThemesSection element={el} updateElement={up} />

            {/* ── Dimensions ─────────────────────────────────── */}
            <CardDimensionsSection element={el} updateElement={up} />

            {/* ── Card Styling (Hidden for Social Marquee) ─────── */}
            {!isSocialMarquee && (
                <CardStylingSection element={el} updateElement={up} />
            )}

            {/* ── Section 1 & 2: Heading & Body Text (Hidden for Social Marquee) ─ */}
            {!isSocialMarquee && (
                <CardContentSection element={el} updateElement={up} />
            )}

            {/* ── Section 3: Button (Optional, Hidden for Social) */}
            {!isSocialMarquee && (
                <CardButtonSection element={el} updateElement={up} />
            )}

            {/* ── Social Marquee Settings (Only for Social Marquee) */}
            {isSocialMarquee && (
                <CardSocialMarqueeSection element={el} updateElement={up} />
            )}

            {/* ── Transform ───────────────────────────────────── */}
            <CardTransformSection element={el} updateElement={up} />
        </div>
    );
}
