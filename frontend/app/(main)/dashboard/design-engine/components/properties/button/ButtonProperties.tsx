"use client";

import React, { useState } from "react";
import { Sparkles, Palette, Trash2 } from "lucide-react";
import type { ButtonElement } from "../../../types/button";
import ButtonThemesSection from "./ButtonThemesSection";
import ButtonTypographySection from "./ButtonTypographySection";
import ButtonStylingSection from "./ButtonStylingSection";
import ButtonImageSection from "./ButtonImageSection";
import ButtonShadowSection from "./ButtonShadowSection";
import ButtonTransformSection from "./ButtonTransformSection";
import MsPaintButtonStudio from "./MsPaintButtonStudio";

type ButtonPropertiesProps = {
    selectedElement: ButtonElement;
    updateElement: (id: string, updates: Partial<ButtonElement>) => void;
};

export default function ButtonProperties({
    selectedElement: el,
    updateElement,
}: ButtonPropertiesProps) {
    const [isPaintStudioOpen, setIsPaintStudioOpen] = useState(false);

    const up = (updates: Partial<ButtonElement>) =>
        updateElement(el.id, updates);

    const hasDrawnShape = Boolean(
        el.drawnShape?.hasDrawnShape && el.drawnShape.dataUrl
    );
    const isGamepad = el.theme === "button-1" || el.theme === "gamepad-3d";

    return (
        <div className="w-full max-w-full min-w-0 space-y-4 pb-8 text-white overflow-x-hidden">
            {/* ── Element Information (Consistent with Text & Other Elements) ── */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">
                    Element {el.serialNumber}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                    Type: Button / Link
                </div>
            </div>

            {/* ── Custom Draw Studio Button ── */}
            <div className="rounded-lg border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-blue-950/40 p-3 shadow-md">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300">
                        <Sparkles size={14} className="text-blue-400" />
                        <span>Paint Studio</span>
                    </div>
                    {hasDrawnShape && (
                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/30">
                            Custom Shape Active
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsPaintStudioOpen(true)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-500 active:scale-95 transition"
                    >
                        <Palette size={14} />
                        <span>{hasDrawnShape ? "Edit Shape" : "Draw Custom Shape"}</span>
                    </button>

                    {hasDrawnShape && (
                        <button
                            type="button"
                            onClick={() =>
                                up({
                                    drawnShape: {
                                        dataUrl: "",
                                        width: 0,
                                        height: 0,
                                        hasDrawnShape: false,
                                    },
                                })
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-800 bg-red-950/40 text-red-300 hover:bg-red-900/60 transition"
                            title="Remove Drawn Shape"
                        >
                            <Trash2 size={13} />
                        </button>
                    )}
                </div>
            </div>

            {/* ── Custom Paint Studio Modal ──────────────────── */}
            <MsPaintButtonStudio
                isOpen={isPaintStudioOpen}
                onClose={() => setIsPaintStudioOpen(false)}
                onApplyShape={(dataUrl, width, height) =>
                    up({
                        drawnShape: {
                            dataUrl,
                            width,
                            height,
                            hasDrawnShape: true,
                        },
                    })
                }
                onClearShape={() =>
                    up({
                        drawnShape: {
                            dataUrl: "",
                            width: 0,
                            height: 0,
                            hasDrawnShape: false,
                        },
                    })
                }
                hasExistingShape={hasDrawnShape}
                buttonText={el.text}
                textColor={el.textColor}
                fontFamily={el.fontFamily}
                fontSize={el.fontSize}
            />

            {/* ── Preset Themes (Hidden if custom drawn shape is active) ────── */}
            {!hasDrawnShape && (
                <ButtonThemesSection element={el} updateElement={up} />
            )}

            {/* ── Typography, Text & Link ───────────────────────── */}
            <ButtonTypographySection element={el} updateElement={up} />

            {/* ── Colors, Radius (% and px), Padding & Borders (Hidden if custom drawn shape is active) ── */}
            {!hasDrawnShape && (
                <ButtonStylingSection element={el} updateElement={up} />
            )}

            {/* ── Background Image & Interactive Crop (Hidden if custom shape active OR if Button 1 Gamepad) ── */}
            {!hasDrawnShape && !isGamepad && (
                <ButtonImageSection element={el} updateElement={up} />
            )}

            {/* ── Shadow Effects & Custom Shadow Sliders ────────── */}
            <ButtonShadowSection element={el} updateElement={up} />

            {/* ── Transform (Scale, Rotation) & Opacity ─────────── */}
            <ButtonTransformSection element={el} updateElement={up} />
        </div>
    );
}
