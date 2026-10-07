"use client";

import React, { useState } from "react";
import type { TimelineElement, TimelineItem } from "../types/timeline";
import type {
    TimelineEditingState,
    TimelineThemeProps,
} from "./timeline/timelineShared";
import ModernVerticalTimeline from "./timeline/themes/ModernVerticalTimeline";
import AlternatingSpineTimeline from "./timeline/themes/AlternatingSpineTimeline";
import HorizontalStepperTimeline from "./timeline/themes/HorizontalStepperTimeline";
import GlassCardsTimeline from "./timeline/themes/GlassCardsTimeline";
import NeonCyberTimeline from "./timeline/themes/NeonCyberTimeline";

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
    const [editingState, setEditingState] = useState<TimelineEditingState>(null);

    const themeProps: TimelineThemeProps = {
        element,
        isSelected,
        isEraserMode,
        onUpdateItem,
        editingState,
        setEditingState,
    };

    return (
        <div
            className="relative select-none"
            style={{
                fontFamily: element.fontFamily || "Inter, sans-serif",
                backgroundColor: "transparent",
            }}
        >
            {element.theme === "alternating-zigzag" && (
                <AlternatingSpineTimeline {...themeProps} />
            )}
            {element.theme === "horizontal-stepper" && (
                <HorizontalStepperTimeline {...themeProps} />
            )}
            {element.theme === "glass-cards" && (
                <GlassCardsTimeline {...themeProps} />
            )}
            {element.theme === "neon-cyber" && (
                <NeonCyberTimeline {...themeProps} />
            )}
            {(!element.theme || element.theme === "modern-vertical") && (
                <ModernVerticalTimeline {...themeProps} />
            )}
        </div>
    );
}
