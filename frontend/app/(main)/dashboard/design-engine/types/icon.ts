import type { EraserPath } from "./common";
import type { ButtonShadowPreset } from "./button";

export type IconType = "social" | "avatar" | "emoji" | "custom";

export type IconTheme =
    | "flat"
    | "glassmorphic"
    | "neon-glow"
    | "neo-brutalist"
    | "gradient-badge"
    | "minimal-outline"
    | "3d-skeuo"
    | "dark-pill"
    | "custom";

export type IconDimensionUnit = "px" | "%";

export type IconCustomCrop = {
    x: number; // pan X in percentage/offset
    y: number; // pan Y in percentage/offset
    scale: number; // zoom scale multiplier (1 to 4)
};

export type IconElement = {
    id: string;
    type: "icon";
    serialNumber: number;
    x: number;
    y: number;

    // 1. Icon Type
    iconType: IconType;

    // Selected icon identifiers
    socialIconId: string; // e.g. "instagram", "linkedin", "github", etc.
    avatarIconId: string; // e.g. "avatar-1", "dev-coder", etc.
    emoji: string; // e.g. "🚀", "🔥", etc.
    customImageUrl: string;
    customImageCrop: IconCustomCrop;

    // Theme preset
    theme: IconTheme;

    // Map To (Redirect Link)
    enableLink: boolean;
    linkUrl: string;

    // Remove Background
    removeBackground: boolean;

    // Dimensions
    width: number;
    widthUnit: IconDimensionUnit;
    height: number;
    heightUnit: IconDimensionUnit;

    // Styling
    iconColor: string;
    useOriginalBrandColor: boolean;
    bgColor: string;
    borderColor: string;
    borderWidth: number;
    borderStyle: "solid" | "dashed" | "dotted" | "none";
    borderRadius: number;
    borderRadiusUnit: "px" | "%";
    padding: number;

    // Shadow (Exact same structure as Button/Link)
    shadow: ButtonShadowPreset;
    shadowColor: string;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowSpread: number;

    // Transform
    size: number; // scale percentage (maintain proportions)
    rotation: number;
    opacity: number;

    // Eraser mask paths
    eraserPaths?: EraserPath[];
};
