"use client";

import { useState } from "react";
import type {
    DrawShapeCategory,
    DrawShapeType,
} from "../../../types/elements";
import {
    createDrawShapePath,
    DRAW_SHAPE_CATEGORIES,
    DRAW_SHAPE_OPTIONS,
} from "../../../utils/drawShapes";

type DrawShapesSectionProps = {
    onAddShape: (shape: DrawShapeType) => void;
};

export default function DrawShapesSection({
    onAddShape,
}: DrawShapesSectionProps) {
    const [activeCategory, setActiveCategory] = useState<DrawShapeCategory>("lines");
    const shapes = DRAW_SHAPE_OPTIONS.filter(
        (shape) => shape.category === activeCategory
    );

    return (
        <section className="w-full min-w-0 max-w-full space-y-3.5 overflow-hidden rounded-lg border border-gray-800 bg-gray-900/50 p-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Shapes
            </span>

            <div className="flex gap-1 overflow-x-auto pb-1" role="tablist" aria-label="Shape categories">
                {DRAW_SHAPE_CATEGORIES.map((category) => {
                    const count = DRAW_SHAPE_OPTIONS.filter(
                        (shape) => shape.category === category.id
                    ).length;
                    return (
                        <button
                            key={category.id}
                            type="button"
                            role="tab"
                            aria-selected={activeCategory === category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`shrink-0 rounded-md border px-2 py-1.5 text-[10px] transition ${
                                activeCategory === category.id
                                    ? "border-blue-500 bg-blue-600/30 font-semibold text-blue-300"
                                    : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700 hover:text-white"
                            }`}
                        >
                            {category.label} {count}
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-3 gap-1.5">
                {shapes.map(({ type, label }) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => onAddShape(type)}
                        title={`Add ${label}`}
                        aria-label={`Add ${label}`}
                        className="flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-md border border-gray-800 bg-gray-950/70 px-1.5 py-1.5 text-[10px] text-gray-300 transition hover:border-blue-500 hover:bg-blue-950/30 hover:text-white"
                    >
                        <svg
                            aria-hidden="true"
                            width="34"
                            height="25"
                            viewBox="0 0 180 140"
                            className="shrink-0"
                        >
                            <path
                                d={createDrawShapePath(type, 180, 140)}
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="7"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="w-full truncate text-center">{label}</span>
                    </button>
                ))}
            </div>
        </section>
    );
}