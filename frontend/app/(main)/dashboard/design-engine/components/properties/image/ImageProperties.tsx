"use client";

import React from "react";
import type { ImageElement } from "../../../types/image";
import ImageUploadSection from "./ImageUploadSection";
import ImageLinkSection from "./ImageLinkSection";
import ImageFrameThemesSection from "./ImageFrameThemesSection";
import ImageFrameStylingSection from "./ImageFrameStylingSection";
import ImageDimensionsSection from "./ImageDimensionsSection";
import ImageTransformSection from "./ImageTransformSection";
import ImageShadowSection from "./ImageShadowSection";

type ImagePropertiesProps = {
    selectedElement: ImageElement;
    updateElement: (id: string, updates: Partial<ImageElement>) => void;
};

export default function ImageProperties({
    selectedElement,
    updateElement,
}: ImagePropertiesProps) {
    const handleUpdate = (updates: Partial<ImageElement>) => {
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
                    Type: Image
                </div>
            </div>

            {/* ── 1. Custom Image Upload & Framing ──────────────────────── */}
            <ImageUploadSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 2. Map To (Redirect Link) ──────────────────────────────── */}
            <ImageLinkSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 3. Frame Themes ────────────────────────────────────────── */}
            <ImageFrameThemesSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 4. Frame Styling (Frame Color, Borders, Corner Radius) ─── */}
            <ImageFrameStylingSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 5. Frame Dimensions (Width & Height with PX / %) ──────── */}
            <ImageDimensionsSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 6. Transform & Scale (Size, Rotation, Opacity) ─────────── */}
            <ImageTransformSection
                element={selectedElement}
                updateElement={handleUpdate}
            />

            {/* ── 7. Shadow Effects ──────────────────────────────────────── */}
            <ImageShadowSection
                element={selectedElement}
                updateElement={handleUpdate}
            />
        </div>
    );
}
