"use client";

import React from "react";
import type { TimelineElement, TimelineTheme } from "../../../types/timeline";
import { THEME_DETAILS } from "../timelineTemplates";

export function TimelineThemesSection({
    timeline: tl,
    updateTimeline,
}: {
    timeline: TimelineElement;
    updateTimeline: (updates: Partial<TimelineElement>) => void;
}) {
    return (
        <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Timeline Themes (8 Styles)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(THEME_DETAILS) as TimelineTheme[]).map((thm) => {
                    const info = THEME_DETAILS[thm];
                    const isSelected = tl.theme === thm;
                    return (
                        <button
                            key={thm}
                            type="button"
                            onClick={() =>
                                updateTimeline({
                                    theme: thm,
                                })
                            }
                            className={`flex items-center justify-between rounded-lg border px-2.5 py-2 text-left transition ${
                                isSelected
                                    ? "border-blue-500 bg-blue-950/40 text-blue-200 shadow-sm"
                                    : "border-gray-800 bg-gray-900/60 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
                            }`}
                        >
                            <span className="truncate text-xs font-medium">
                                {info.name}
                            </span>
                            <span
                                className="ml-1.5 h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: info.defaultAccent }}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
