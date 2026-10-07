"use client";

import React from "react";
import type { TimelineElement } from "../../../types/timeline";
import { TimelineThemesSection } from "./TimelineThemesSection";
import { TimelineColorsSection } from "./TimelineColorsSection";
import { TimelineNodesConnectorsSection } from "./TimelineNodesConnectorsSection";
import { TimelineTypographySection } from "./TimelineTypographySection";
import { TimelineEffectsTransformSection } from "./TimelineEffectsTransformSection";

export function TimelineDesignTab({
    timeline: tl,
    updateTimeline,
    onAccentColorChange,
}: {
    timeline: TimelineElement;
    updateTimeline: (updates: Partial<TimelineElement>) => void;
    onAccentColorChange: (newColor: string) => void;
}) {
    return (
        <div className="w-full max-w-full space-y-5 overflow-hidden">
            <TimelineThemesSection
                timeline={tl}
                updateTimeline={updateTimeline}
            />

            <TimelineColorsSection
                timeline={tl}
                updateTimeline={updateTimeline}
                onAccentColorChange={onAccentColorChange}
            />

            <TimelineNodesConnectorsSection
                timeline={tl}
                updateTimeline={updateTimeline}
            />

            <TimelineTypographySection
                timeline={tl}
                updateTimeline={updateTimeline}
            />

            <TimelineEffectsTransformSection
                timeline={tl}
                updateTimeline={updateTimeline}
            />
        </div>
    );
}
