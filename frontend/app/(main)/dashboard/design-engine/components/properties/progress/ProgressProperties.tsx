"use client";

import React from "react";
import type { ProgressElement } from "../../../types/progress";
import ProgressLayoutSection from "./ProgressLayoutSection";
import ProgressDataSection from "./ProgressDataSection";
import ProgressStylingSection from "./ProgressStylingSection";
import ProgressDimensionsSection from "./ProgressDimensionsSection";
import ProgressTransformSection from "./ProgressTransformSection";
import ProgressShadowSection from "./ProgressShadowSection";

type ProgressPropertiesProps = {
    selectedElement: ProgressElement;
    updateElement: (id: string, updates: Partial<ProgressElement>) => void;
};

export default function ProgressProperties({
    selectedElement,
    updateElement,
}: ProgressPropertiesProps) {
    const handleUpdate = (updates: Partial<ProgressElement>) => {
        updateElement(selectedElement.id, updates);
    };

    return (
        <div className="space-y-4 pb-8 text-white w-full min-w-0 overflow-x-hidden">
            {/* ── Top Header ────────────────────────────────────────────── */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">
                    Element {selectedElement.serialNumber}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                    Type: Progress & Chart
                </div>
            </div>

            {/* ── 1. Layout & Presets (Vertical Pills, Donut, Bars, etc.) ── */}
            <ProgressLayoutSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 2. Data Items & Percentage Levels ──────────────────────── */}
            <ProgressDataSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 3. Bar & Track Styling (Colors, Radius, Gap, Axes) ────── */}
            <ProgressStylingSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 4. Dimensions & Container (Width & Height with PX / %) ─── */}
            <ProgressDimensionsSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 5. Transform & Scale (Size, Rotation, Opacity) ─────────── */}
            <ProgressTransformSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 6. Shadow Effects ──────────────────────────────────────── */}
            <ProgressShadowSection
                element={selectedElement}
                updateElement={handleUpdate}
            />
        </div>
    );
}
