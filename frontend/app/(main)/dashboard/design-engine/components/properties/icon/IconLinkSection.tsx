"use client";

import React, { useState } from "react";
import { Link2, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react";
import type { IconElement } from "../../../types/icon";

type IconLinkSectionProps = {
    element: IconElement;
    updateElement: (updates: Partial<IconElement>) => void;
};

export default function IconLinkSection({
    element,
    updateElement,
}: IconLinkSectionProps) {
    const [testClicked, setTestClicked] = useState(false);

    const isValidUrl = (url: string) => {
        if (!url || !url.trim()) return false;
        try {
            const trimmed = url.trim();
            const toTest =
                trimmed.startsWith("http://") || trimmed.startsWith("https://")
                    ? trimmed
                    : `https://${trimmed}`;
            new URL(toTest);
            return true;
        } catch {
            return false;
        }
    };

    const handleTestRedirect = () => {
        if (!element.linkUrl) return;
        let url = element.linkUrl.trim();
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = `https://${url}`;
        }
        window.open(url, "_blank", "noopener,noreferrer");
        setTestClicked(true);
        setTimeout(() => setTestClicked(false), 2000);
    };

    const isUrlValid = isValidUrl(element.linkUrl);

    return (
        <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                    <Link2 size={14} className="text-blue-400 shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">
                        Map To (Redirect Link)
                    </span>
                </div>

                {/* ON / OFF Toggle */}
                <button
                    type="button"
                    onClick={() =>
                        updateElement({ enableLink: !element.enableLink })
                    }
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        element.enableLink ? "bg-blue-600" : "bg-gray-700"
                    }`}
                >
                    <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            element.enableLink ? "translate-x-4" : "translate-x-0"
                        }`}
                    />
                </button>
            </div>

            {/* When Map To is ON: Display URL input field & validation */}
            {element.enableLink && (
                <div className="space-y-2 border-t border-gray-800/80 pt-2.5 w-full min-w-0">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Destination URL</span>
                        {element.linkUrl && (
                            <span
                                className={`flex items-center gap-1 text-[10px] shrink-0 ${
                                    isUrlValid
                                        ? "text-emerald-400"
                                        : "text-amber-400"
                                }`}
                            >
                                {isUrlValid ? (
                                    <>
                                        <CheckCircle2 size={11} /> Valid
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle size={11} /> Check Format
                                    </>
                                )}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 w-full min-w-0">
                        <input
                            type="text"
                            placeholder="https://example.com"
                            value={element.linkUrl || ""}
                            onChange={(e) =>
                                updateElement({ linkUrl: e.target.value })
                            }
                            className="min-w-0 flex-1 w-full rounded-md border border-gray-700 bg-gray-950 px-2 py-1.5 font-mono text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleTestRedirect}
                            disabled={!element.linkUrl}
                            className="shrink-0 flex items-center gap-1 rounded-md border border-gray-700 bg-gray-800 px-2 py-1.5 text-xs text-gray-300 hover:border-gray-500 hover:text-white disabled:opacity-40 transition"
                            title="Test open destination"
                        >
                            <ExternalLink size={12} />
                            <span className="text-[10px]">
                                {testClicked ? "Opened" : "Test"}
                            </span>
                        </button>
                    </div>

                    <p className="text-[10px] text-gray-500 break-words leading-relaxed">
                        When enabled, clicking this icon on the canvas opens the destination in a new tab.
                    </p>
                </div>
            )}
        </div>
    );
}
