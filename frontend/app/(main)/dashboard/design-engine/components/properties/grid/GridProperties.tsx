"use client";

import React from "react";
import type { GridElement } from "../../../types/grid";
import GridLayoutSection from "./GridLayoutSection";
import GridStylingSection from "./GridStylingSection";
import GridDimensionsSection from "./GridDimensionsSection";
import GridTransformSection from "./GridTransformSection";
import GridShadowSection from "./GridShadowSection";

type GridPropertiesProps = {
    selectedElement: GridElement;
    updateElement: (id: string, updates: Partial<GridElement>) => void;
};

export default function GridProperties({
    selectedElement,
    updateElement,
}: GridPropertiesProps) {
    const handleUpdate = (updates: Partial<GridElement>) => {
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
                    Type: Grid
                </div>
            </div>

            {/* ── 1. Layout & Presets (Pinterest, Bento, Split, etc.) ────── */}
            <GridLayoutSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 2. Cell Skeleton Styling (Borders, Corner Radius, Fill) ─ */}
            <GridStylingSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 3. Grid Dimensions (Width & Height with PX / %) ───────── */}
            <GridDimensionsSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 4. Transform & Scale (Size, Rotation, Opacity) ─────────── */}
            <GridTransformSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 5. Shadow Effects ──────────────────────────────────────── */}
            <GridShadowSection
                element={selectedElement}
                updateElement={handleUpdate}
            />
        </div>
    );
}
