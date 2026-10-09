"use client";

import React from "react";
import type { IconElement } from "../../../../types/icon";
import {
    SOCIAL_MEDIA_ICONS,
    AVATAR_ICONS,
    getIconShadow,
} from "./iconLibraries";

type IconRendererProps = {
    element: IconElement;
    isInteractive?: boolean;
    onIconClick?: (e: React.MouseEvent) => void;
};

export function IconRenderer({
    element,
    isInteractive = false,
    onIconClick,
}: IconRendererProps) {
    const {
        iconType,
        socialIconId,
        avatarIconId,
        emoji,
        customImageUrl,
        customImageCrop,
        theme,
        removeBackground,
        width,
        widthUnit,
        height,
        heightUnit,
        iconColor,
        useOriginalBrandColor,
        bgColor,
        borderColor,
        borderWidth,
        borderStyle,
        borderRadius,
        borderRadiusUnit,
        padding,
    } = element;

    const w = widthUnit === "%" ? `${width}%` : `${width}px`;
    const h = heightUnit === "%" ? `${height}px` : `${height}px`;
    const radius = `${borderRadius}${borderRadiusUnit || "%"}`;
    const shadowStyle = getIconShadow(element);

    const isCustom = iconType === "custom";

    // ── 1. Determine Container Theme Classes & Inline Styles ─────────────
    // Fix 2: All themes respect element.bgColor
    let themeBg = bgColor || "#18181b";
    let themeBorderColor = borderColor || "#3f3f46";
    let themeBorderWidth = borderWidth;
    let themeExtraClass = "";

    if (!removeBackground) {
        if (theme === "glassmorphic") {
            // Semi-transparent frosted glass using user's bgColor
            themeBg = bgColor
                ? bgColor.startsWith("#") && bgColor.length === 7
                    ? `${bgColor}33`
                    : bgColor
                : "rgba(255, 255, 255, 0.12)";
            themeBorderColor = borderColor || "rgba(255, 255, 255, 0.25)";
            themeBorderWidth = Math.max(1, themeBorderWidth ?? 1);
            themeExtraClass = "backdrop-blur-md";
        } else if (theme === "neon-glow") {
            themeBg = bgColor || "#050510";
            themeBorderColor = borderColor || iconColor || "#06b6d4";
            themeBorderWidth = Math.max(1.5, themeBorderWidth ?? 1.5);
        } else if (theme === "neo-brutalist") {
            themeBg = bgColor || "#fbbf24";
            themeBorderColor = borderColor || "#000000";
            themeBorderWidth = Math.max(2.5, themeBorderWidth ?? 2.5);
        } else if (theme === "gradient-badge") {
            themeBg = bgColor
                ? bgColor.includes("gradient")
                    ? bgColor
                    : `linear-gradient(135deg, ${bgColor} 0%, #ec4899 100%)`
                : "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)";
            themeBorderColor = borderColor || "transparent";
            themeBorderWidth = 0;
        } else if (theme === "minimal-outline") {
            themeBg = bgColor || "transparent";
            themeBorderColor = borderColor || iconColor || "#a1a1aa";
            themeBorderWidth = Math.max(1.5, themeBorderWidth ?? 1.5);
        } else if (theme === "3d-skeuo") {
            themeBg = bgColor
                ? bgColor.includes("gradient")
                    ? bgColor
                    : `linear-gradient(145deg, ${bgColor}, #09090b)`
                : "linear-gradient(145deg, #27272a, #18181b)";
            themeBorderColor = borderColor || "rgba(255,255,255,0.2)";
            themeBorderWidth = Math.max(1, themeBorderWidth ?? 1);
        } else if (theme === "dark-pill") {
            themeBg = bgColor || "#09090b";
            themeBorderColor = borderColor || "#27272a";
            themeBorderWidth = Math.max(1, themeBorderWidth ?? 1);
        } else {
            // flat / custom
            themeBg = bgColor || "#18181b";
            themeBorderColor = borderColor || "#3f3f46";
        }
    }

    // Fix 1: Custom images have 0 padding so they properly cover the circle
    const effectivePadding = removeBackground || isCustom ? 0 : (padding ?? 0);

    const containerStyle: React.CSSProperties = {
        width: w,
        height: h,
        padding: `${effectivePadding}px`,
        borderRadius: radius,
        background: removeBackground ? "transparent" : themeBg,
        border: removeBackground
            ? "none"
            : borderStyle === "none" || themeBorderWidth === 0
            ? "none"
            : `${themeBorderWidth}px ${borderStyle} ${themeBorderColor}`,
        boxShadow: removeBackground ? "none" : shadowStyle,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        transition: "all 0.15s ease",
        cursor: element.enableLink && isInteractive ? "pointer" : "default",
    };

    // ── 2. Render Icon Glyph / Image based on iconType ───────────────────
    const renderContent = () => {
        // ── Custom Image Upload ──
        if (iconType === "custom") {
            if (!customImageUrl) {
                return (
                    <div className="flex h-full w-full flex-col items-center justify-center p-2 text-center text-gray-500">
                        <span className="text-xl">📷</span>
                        <span className="text-[10px] text-gray-400">No Image</span>
                    </div>
                );
            }

            const crop = customImageCrop || { x: 0, y: 0, scale: 1.2 };
            // Supports both percentage (0-100) and legacy pixels
            const panX = typeof crop.x === "number" ? crop.x : 0;
            const panY = typeof crop.y === "number" ? crop.y : 0;
            const scale = typeof crop.scale === "number" ? crop.scale : 1;

            return (
                <img
                    src={customImageUrl}
                    alt="Custom Icon"
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none transition-transform duration-75 ease-out"
                    style={{
                        transform: `translate(${panX}%, ${panY}%) scale(${scale})`,
                        transformOrigin: "center center",
                    }}
                    draggable={false}
                />
            );
        }

        // ── Social Media Library ──
        if (iconType === "social") {
            const socialDef =
                SOCIAL_MEDIA_ICONS.find((s) => s.id === socialIconId) ||
                SOCIAL_MEDIA_ICONS[0];

            const colorToUse = useOriginalBrandColor
                ? socialDef.brandColor
                : iconColor || "#ffffff";

            // Determine render size to fill nicely inside container padding
            const baseSize = Math.max(
                16,
                Math.min(
                    typeof width === "number" ? width : 64,
                    typeof height === "number" ? height : 64
                ) - (removeBackground ? 0 : (padding ?? 12) * 2)
            );

            return socialDef.svg({
                size: Math.max(16, baseSize),
                color: colorToUse,
                className: "transition-colors",
            });
        }

        // ── Avatar Icons Library ──
        if (iconType === "avatar") {
            const avatarDef =
                AVATAR_ICONS.find((a) => a.id === avatarIconId) ||
                AVATAR_ICONS[0];

            const baseSize = Math.max(
                18,
                Math.min(
                    typeof width === "number" ? width : 64,
                    typeof height === "number" ? height : 64
                ) - (removeBackground ? 0 : (padding ?? 8) * 2)
            );

            return avatarDef.svg({
                size: Math.max(18, baseSize),
                className: "w-full h-full object-contain",
            });
        }

        // ── Emoji Picker Library ──
        if (iconType === "emoji") {
            const baseFontSize = Math.max(
                16,
                Math.min(
                    typeof width === "number" ? width : 64,
                    typeof height === "number" ? height : 64
                ) - (removeBackground ? 0 : (padding ?? 10) * 2)
            );

            return (
                <span
                    className="select-none leading-none flex items-center justify-center"
                    style={{ fontSize: `${baseFontSize}px` }}
                >
                    {emoji || "🚀"}
                </span>
            );
        }

        return null;
    };

    return (
        <div
            style={containerStyle}
            className={`${themeExtraClass} ${
                element.enableLink && isInteractive
                    ? "hover:opacity-95 active:scale-[0.98]"
                    : ""
            }`}
            onClick={onIconClick}
        >
            {renderContent()}
        </div>
    );
}

export default IconRenderer;
