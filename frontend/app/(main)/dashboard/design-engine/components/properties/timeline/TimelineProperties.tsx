"use client";

import React, { useState } from "react";
import { Palette, Layers } from "lucide-react";
import type { TimelineElement } from "../../../types/timeline";
import { TimelineDesignTab } from "./TimelineDesignTab";
import { TimelineDataTab } from "./TimelineDataTab";

type TimelinePropertiesProps = {
    selectedElement: TimelineElement;
    updateElement: (id: string, updates: Partial<TimelineElement>) => void;
};

export default function TimelineProperties({
    selectedElement: tl,
    updateElement,
}: TimelinePropertiesProps) {
    const [activeTab, setActiveTab] = useState<"design" | "data">("design");

    const updateTl = (updates: Partial<TimelineElement>) => {
        updateElement(tl.id, updates);
    };

    const handleAccentColorChange = (newColor: string) => {
        // Update global accent and sync to items so it immediately updates everywhere
        const nextItems = tl.items.map((it) => ({
            ...it,
            accentColor: undefined, // remove per-item override so global takes effect
        }));
        updateTl({ accentColor: newColor, items: nextItems });
    };

    return (
        <div className="w-full max-w-full overflow-hidden mt-6 space-y-5">
            {/* Element Information (Consistent with all other elements) */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">
                    Element {tl.serialNumber}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                    Type: Timeline
                </div>
            </div>

            {/* Navigation Tabs (Themes & Style | Data) */}
            <div className="flex rounded-lg border border-gray-800 bg-gray-900 p-1 text-xs">
                <button
                    type="button"
                    onClick={() => setActiveTab("design")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition ${
                        activeTab === "design"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-400 hover:text-white"
                    }`}
                >
                    <Palette size={13} />
                    Themes & Style
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("data")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition ${
                        activeTab === "data"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-400 hover:text-white"
                    }`}
                >
                    <Layers size={13} />
                    Data ({tl.items.length})
                </button>
            </div>

            {/* TAB 1: DESIGN & THEME */}
            {activeTab === "design" && (
                <TimelineDesignTab
                    timeline={tl}
                    updateTimeline={updateTl}
                    onAccentColorChange={handleAccentColorChange}
                />
            )}

            {/* TAB 2: DATA & MILESTONES */}
            {activeTab === "data" && (
                <TimelineDataTab
                    timeline={tl}
                    updateTimeline={updateTl}
                />
            )}
        </div>
    );
}
