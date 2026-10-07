"use client";

import React from "react";
import type { CardStyleProps } from "../cardShared";
import { handleCardSocialClick } from "../cardShared";
import { SocialPlatformIcon } from "../SocialPlatformIcon";

export default function SocialMarqueeCard({
    element,
    cardMinHeight,
}: CardStyleProps) {
    return (
        <div
            className="relative flex flex-col justify-center overflow-hidden py-3 transition-all duration-300"
            style={{
                width: "100%",
                minHeight: `${cardMinHeight}px`,
                backgroundColor: "transparent",
            }}
        >
            {/* Marquee Rows Container */}
            <div className="flex flex-col gap-3 py-1">
                {/* Track 1: Scrolling Left */}
                <div
                    className="flex items-center gap-3"
                    style={{
                        width: "max-content",
                        animation: `card_marquee_left ${
                            element.socialMarqueeSpeed || 16
                        }s linear infinite`,
                    }}
                >
                    {/* Duplicate items for seamless continuous loop */}
                    {[
                        ...element.socialHandles,
                        ...element.socialHandles,
                        ...element.socialHandles,
                    ].map((item, idx) => (
                        <button
                            key={`${item.id}-1-${idx}`}
                            type="button"
                            onClick={(e) => handleCardSocialClick(e, item.url)}
                            className="group/icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 hover:scale-115 active:scale-95"
                            title={`${item.label} (Click to open ${
                                item.url || "link"
                            })`}
                            style={{
                                cursor: "pointer",
                            }}
                        >
                            <SocialPlatformIcon platform={item.platform} />
                        </button>
                    ))}
                </div>

                {/* Track 2: Scrolling Right */}
                <div
                    className="flex items-center gap-3"
                    style={{
                        width: "max-content",
                        animation: `card_marquee_right ${Math.round(
                            (element.socialMarqueeSpeed || 16) * 1.35
                        )}s linear infinite`,
                    }}
                >
                    {[
                        ...element.socialHandles,
                        ...element.socialHandles,
                        ...element.socialHandles,
                    ]
                        .reverse()
                        .map((item, idx) => (
                            <button
                                key={`${item.id}-2-${idx}`}
                                type="button"
                                onClick={(e) =>
                                    handleCardSocialClick(e, item.url)
                                }
                                className="group/icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 hover:scale-115 active:scale-95"
                                title={`${item.label} (Click to open ${
                                    item.url || "link"
                                })`}
                                style={{
                                    cursor: "pointer",
                                }}
                            >
                                <SocialPlatformIcon platform={item.platform} />
                            </button>
                        ))}
                </div>
            </div>
        </div>
    );
}
