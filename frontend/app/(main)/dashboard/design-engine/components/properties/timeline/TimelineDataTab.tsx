"use client";

import React, { useState } from "react";
import {
    Plus,
    Trash2,
    ChevronUp,
    ChevronDown,
    Briefcase,
    GraduationCap,
    Trophy,
    Star,
    Code,
    Rocket,
    CheckCircle2,
    Circle,
} from "lucide-react";
import type {
    TimelineElement,
    TimelineIconType,
    TimelineItem,
} from "../../../types/timeline";
import {
    EDUCATION_TEMPLATE,
    EXPERIENCE_TEMPLATE,
    ACHIEVEMENTS_TEMPLATE,
    ROADMAP_TEMPLATE,
} from "../../canvas/elements/timeline/timelineTemplates";

export function TimelineDataTab({
    timeline: tl,
    updateTimeline,
}: {
    timeline: TimelineElement;
    updateTimeline: (updates: Partial<TimelineElement>) => void;
}) {
    const [expandedItemId, setExpandedItemId] = useState<string | null>(
        tl.items[0]?.id ?? null
    );

    const updateItem = (
        itemId: string,
        itemUpdates: Partial<TimelineItem>
    ) => {
        const nextItems = tl.items.map((it) =>
            it.id === itemId ? { ...it, ...itemUpdates } : it
        );
        updateTimeline({ items: nextItems });
    };

    const handleAddItem = () => {
        const newItem: TimelineItem = {
            id: crypto.randomUUID(),
            title: `Milestone ${tl.items.length + 1}`,
            subtitle: "Organization / Institution",
            date: "2024 - 2025",
            description: "Describe this milestone or achievement...",
            tag: "Milestone",
            icon: "star",
        };
        updateTimeline({ items: [...tl.items, newItem] });
        setExpandedItemId(newItem.id);
    };

    const handleDeleteItem = (itemId: string) => {
        if (tl.items.length <= 1) return;
        const nextItems = tl.items.filter((it) => it.id !== itemId);
        updateTimeline({ items: nextItems });
    };

    const handleMoveItem = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= tl.items.length) return;
        const nextItems = [...tl.items];
        const [moved] = nextItems.splice(index, 1);
        nextItems.splice(targetIndex, 0, moved);
        updateTimeline({ items: nextItems });
    };

    const handleApplyTemplate = (
        type: "education" | "experience" | "achievements" | "roadmap"
    ) => {
        let templateData: TimelineItem[] = [];
        if (type === "education") templateData = EDUCATION_TEMPLATE;
        if (type === "experience") templateData = EXPERIENCE_TEMPLATE;
        if (type === "achievements") templateData = ACHIEVEMENTS_TEMPLATE;
        if (type === "roadmap") templateData = ROADMAP_TEMPLATE;

        const cloned = templateData.map((it) => ({
            ...it,
            id: crypto.randomUUID(),
        }));
        updateTimeline({ items: cloned });
        if (cloned.length > 0) setExpandedItemId(cloned[0].id);
    };

    const iconsList: TimelineIconType[] = [
        "graduation",
        "briefcase",
        "trophy",
        "star",
        "code",
        "rocket",
        "check",
        "circle",
    ];

    return (
        <div className="w-full max-w-full space-y-4 overflow-hidden">
            {/* Quick Template Fill Buttons */}
            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Content Templates
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                    <button
                        type="button"
                        onClick={() => handleApplyTemplate("education")}
                        className="flex items-center gap-1.5 rounded-lg border border-blue-900/50 bg-blue-950/30 px-2.5 py-2 text-xs font-medium text-blue-300 transition hover:bg-blue-900/50"
                    >
                        <GraduationCap size={13} />
                        Education
                    </button>
                    <button
                        type="button"
                        onClick={() => handleApplyTemplate("experience")}
                        className="flex items-center gap-1.5 rounded-lg border border-emerald-900/50 bg-emerald-950/30 px-2.5 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-900/50"
                    >
                        <Briefcase size={13} />
                        Experience
                    </button>
                    <button
                        type="button"
                        onClick={() => handleApplyTemplate("achievements")}
                        className="flex items-center gap-1.5 rounded-lg border border-amber-900/50 bg-amber-950/30 px-2.5 py-2 text-xs font-medium text-amber-300 transition hover:bg-amber-900/50"
                    >
                        <Trophy size={13} />
                        Achievements
                    </button>
                    <button
                        type="button"
                        onClick={() => handleApplyTemplate("roadmap")}
                        className="flex items-center gap-1.5 rounded-lg border border-purple-900/50 bg-purple-950/30 px-2.5 py-2 text-xs font-medium text-purple-300 transition hover:bg-purple-900/50"
                    >
                        <Rocket size={13} />
                        Roadmap
                    </button>
                </div>
            </div>

            {/* Add Milestone Button */}
            <div className="flex items-center justify-between border-t border-gray-800 pt-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Milestones ({tl.items.length})
                </span>
                <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-1 rounded-lg border border-blue-600 bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-blue-500"
                >
                    <Plus size={13} />
                    Add Milestone
                </button>
            </div>

            <div className="rounded-lg border border-blue-900/40 bg-blue-950/20 p-2 text-[11px] text-blue-300">
                💡 Double-click any text on the canvas to edit directly!
            </div>

            {/* Milestones List (Responsive, no horizontal scroll) */}
            <div className="w-full max-w-full space-y-2 overflow-hidden">
                {tl.items.map((item, index) => {
                    const isExpanded = expandedItemId === item.id;

                    return (
                        <div
                            key={item.id}
                            className="w-full max-w-full rounded-lg border border-gray-800 bg-gray-900/80 p-2.5 transition overflow-hidden"
                        >
                            {/* Item Summary Header */}
                            <div className="flex items-center justify-between min-w-0">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExpandedItemId(
                                            isExpanded ? null : item.id
                                        )
                                    }
                                    className="flex flex-1 items-center gap-2 text-left min-w-0 pr-1"
                                >
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-800 text-[10px] font-bold text-gray-400">
                                        {index + 1}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-xs font-semibold text-white">
                                            {item.title || "Untitled Milestone"}
                                        </div>
                                        <div className="truncate text-[10px] text-gray-500">
                                            {item.date} • {item.subtitle}
                                        </div>
                                    </div>
                                </button>

                                {/* Action buttons */}
                                <div className="flex items-center gap-0.5 shrink-0">
                                    <button
                                        type="button"
                                        disabled={index === 0}
                                        onClick={() =>
                                            handleMoveItem(index, "up")
                                        }
                                        className="rounded p-1 text-gray-500 transition hover:bg-gray-800 hover:text-white disabled:opacity-30"
                                        title="Move up"
                                    >
                                        <ChevronUp size={13} />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={index === tl.items.length - 1}
                                        onClick={() =>
                                            handleMoveItem(index, "down")
                                        }
                                        className="rounded p-1 text-gray-500 transition hover:bg-gray-800 hover:text-white disabled:opacity-30"
                                        title="Move down"
                                    >
                                        <ChevronDown size={13} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteItem(item.id)
                                        }
                                        className="rounded p-1 text-gray-500 transition hover:bg-red-950/50 hover:text-red-400"
                                        title="Delete milestone"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Edit Form */}
                            {isExpanded && (
                                <div className="w-full max-w-full mt-2.5 space-y-2 border-t border-gray-800 pt-2 text-xs overflow-hidden">
                                    {/* Title */}
                                    <div>
                                        <label className="mb-1 block text-[10px] uppercase text-gray-400">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) =>
                                                updateItem(item.id, {
                                                    title: e.target.value,
                                                })
                                            }
                                            className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-white outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Subtitle & Date */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="mb-1 block text-[10px] uppercase text-gray-400">
                                                Subtitle / Org
                                            </label>
                                            <input
                                                type="text"
                                                value={item.subtitle}
                                                onChange={(e) =>
                                                    updateItem(item.id, {
                                                        subtitle:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-white outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[10px] uppercase text-gray-400">
                                                Date / Period
                                            </label>
                                            <input
                                                type="text"
                                                value={item.date}
                                                onChange={(e) =>
                                                    updateItem(item.id, {
                                                        date: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-white outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Tag */}
                                    <div>
                                        <label className="mb-1 block text-[10px] uppercase text-gray-400">
                                            Tag / Badge
                                        </label>
                                        <input
                                            type="text"
                                            value={item.tag || ""}
                                            onChange={(e) =>
                                                updateItem(item.id, {
                                                    tag: e.target.value,
                                                })
                                            }
                                            placeholder="e.g. Degree / Full-Time"
                                            className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-white outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Icon Picker */}
                                    <div>
                                        <label className="mb-1 block text-[10px] uppercase text-gray-400">
                                            Icon
                                        </label>
                                        <div className="flex flex-wrap gap-1">
                                            {iconsList.map((ic) => (
                                                <button
                                                    key={ic}
                                                    type="button"
                                                    onClick={() =>
                                                        updateItem(item.id, {
                                                            icon: ic,
                                                        })
                                                    }
                                                    className={`flex h-6 w-6 items-center justify-center rounded border transition ${
                                                        (item.icon ||
                                                            "circle") === ic
                                                            ? "border-blue-500 bg-blue-950/60 text-blue-300"
                                                            : "border-gray-800 bg-gray-800 text-gray-400 hover:text-white"
                                                    }`}
                                                    title={ic}
                                                >
                                                    {ic === "graduation" && (
                                                        <GraduationCap
                                                            size={12}
                                                        />
                                                    )}
                                                    {ic === "briefcase" && (
                                                        <Briefcase size={12} />
                                                    )}
                                                    {ic === "trophy" && (
                                                        <Trophy size={12} />
                                                    )}
                                                    {ic === "star" && (
                                                        <Star size={12} />
                                                    )}
                                                    {ic === "code" && (
                                                        <Code size={12} />
                                                    )}
                                                    {ic === "rocket" && (
                                                        <Rocket size={12} />
                                                    )}
                                                    {ic === "check" && (
                                                        <CheckCircle2
                                                            size={12}
                                                        />
                                                    )}
                                                    {ic === "circle" && (
                                                        <Circle size={12} />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="mb-1 block text-[10px] uppercase text-gray-400">
                                            Description
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={item.description}
                                            onChange={(e) =>
                                                updateItem(item.id, {
                                                    description:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
