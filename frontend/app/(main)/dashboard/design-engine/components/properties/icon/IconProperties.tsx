"use client";

import React from "react";
import type { IconElement } from "../../../types/icon";
import IconTypeSection from "./IconTypeSection";
import IconLibrariesSection from "./IconLibrariesSection";
import IconLinkSection from "./IconLinkSection";
import IconThemesSection from "./IconThemesSection";
import IconStylingSection from "./IconStylingSection";
import IconDimensionsSection from "./IconDimensionsSection";
import IconTransformSection from "./IconTransformSection";
import IconShadowSection from "./IconShadowSection";

type IconPropertiesProps = {
    selectedElement: IconElement;
    updateElement: (id: string, updates: Partial<IconElement>) => void;
};

export default function IconProperties({
    selectedElement,
    updateElement,
}: IconPropertiesProps) {
    const handleUpdate = (updates: Partial<IconElement>) => {
        updateElement(selectedElement.id, updates);
    };

    return (
        <div className="space-y-4 pb-8 text-white w-full min-w-0 overflow-x-hidden">
            {/* ── Top Header & Live Miniature Preview ────────────────────── */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">
                    Element {selectedElement.serialNumber}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                    Type: Icon
                </div>
            </div>

            {/* ── 1. Icon Type Selection ─────────────────────────────────── */}
            <IconTypeSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 2. Library Selection / Custom Upload ──────────────────── */}
            <IconLibrariesSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 3. Map To (Redirect Link) ──────────────────────────────── */}
            <IconLinkSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 4. Themes ──────────────────────────────────────────────── */}
            <IconThemesSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 5. Styling & Frame (Remove Background, colors, borders) ── */}
            <IconStylingSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 6. Dimensions (Width & Height with PX / %) ────────────── */}
            <IconDimensionsSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 7. Transform (Scale Size, Rotation, Opacity) ───────────── */}
            <IconTransformSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 8. Shadow Effects (Hidden when Remove Background is ON) ── */}
            {!selectedElement.removeBackground && (
                <IconShadowSection
                    element={selectedElement}
                    updateElement={handleUpdate}
                />
            )}
        </div>
    );
}
