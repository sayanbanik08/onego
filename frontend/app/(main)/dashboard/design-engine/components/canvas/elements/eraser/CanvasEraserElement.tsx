import React from "react";
import type { EraserSettings } from "../../../../types/elements";

export type CanvasEraserElementProps = {
    isEraserMode: boolean;
    eraserPos: { x: number; y: number } | null;
    eraserSettings: EraserSettings;
};

export function CanvasEraserElement({
    isEraserMode,
    eraserPos,
    eraserSettings,
}: CanvasEraserElementProps) {
    if (!isEraserMode || !eraserPos) {
        return null;
    }

    return (
        <div
            className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-1/2 border border-black bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.18)]"
            style={{
                left: eraserPos.x,
                top: eraserPos.y,
                width: eraserSettings.size,
                height: eraserSettings.size,
                opacity: Math.max(0.6, eraserSettings.opacity),
            }}
        >
            <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60" />
        </div>
    );
}

export default CanvasEraserElement;
