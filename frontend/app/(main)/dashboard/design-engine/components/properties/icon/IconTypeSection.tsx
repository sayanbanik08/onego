"use client";

import React from "react";
import { Share2, UserCircle2, Smile, UploadCloud } from "lucide-react";
import type { IconElement, IconType } from "../../../types/icon";

type IconTypeSectionProps = {
    element: IconElement;
    updateElement: (updates: Partial<IconElement>) => void;
};

const ICON_TYPES: { id: IconType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
        id: "social",
        label: "Social Media",
        icon: <Share2 size={15} />,
        desc: "30+ platforms with official brand colors",
    },
    {
        id: "avatar",
        label: "Avatar",
        icon: <UserCircle2 size={15} />,
        desc: "Illustrated 3D, dev & creative personas",
    },
    {
        id: "emoji",
        label: "Emoji",
        icon: <Smile size={15} />,
        desc: "Rich categorized emoji picker library",
    },
    {
        id: "custom",
        label: "Custom",
        icon: <UploadCloud size={15} />,
        desc: "Upload photo with Move & Scale framing",
    },
];

export default function IconTypeSection({
    element,
    updateElement,
}: IconTypeSectionProps) {
    return (
        <div className="space-y-2 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Icon Type
            </span>
            <div className="grid grid-cols-2 gap-1.5">
                {ICON_TYPES.map((type) => {
                    const isSelected = element.iconType === type.id;
                    return (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => updateElement({ iconType: type.id })}
                            className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-2.5 text-center text-xs transition ${
                                isSelected
                                    ? "border-blue-500 bg-blue-600/20 text-blue-300 font-semibold shadow-sm"
                                    : "border-gray-800 bg-gray-900/80 text-gray-400 hover:border-gray-700 hover:text-white"
                            }`}
                        >
                            <span className={isSelected ? "text-blue-400" : "text-gray-400"}>
                                {type.icon}
                            </span>
                            <span className="font-medium">{type.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
