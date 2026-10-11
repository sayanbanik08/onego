import type { EraserPath } from "./common";
import type { ButtonShadowPreset } from "./button";

export type ImageFrameShape = "circle" | "square" | "rounded" | "hexagon" | "diamond" | "blob";

export type ImageFrameTheme =
    | "minimal-clean"
    | "polaroid"
    | "film-strip"
    | "neon-border"
    | "gradient-glow"
    | "glassmorphic"
    | "shadow-lift"
    | "double-border"
    | "rustic-wood"
    | "custom";

export type ImageDimensionUnit = "px" | "%";

export type ImageCustomCrop = {
    x: number;
    y: number;
    scale: number;
};

export type ImageElement = {
    id: string;
    type: "image";
    serialNumber: number;
    x: number;
    y: number;

    // Image source
    imageUrl: string;
    imageCrop: ImageCustomCrop;

    // Frame shape (user controlled: circle, square, etc.)
    frameShape: ImageFrameShape;

    // Frame Theme preset
    theme: ImageFrameTheme;

    // Map To (Redirect Link)
    enableLink: boolean;
    linkUrl: string;

    // Dimensions
    width: number;
    widthUnit: ImageDimensionUnit;
    height: number;
    heightUnit: ImageDimensionUnit;

    // Frame Styling
    frameColor: string;
    borderColor: string;
    borderWidth: number;
    borderStyle: "solid" | "dashed" | "dotted" | "none";
    borderRadius: number;
    borderRadiusUnit: "px" | "%";

    // Shadow (Exact same structure as Button/Link)
    shadow: ButtonShadowPreset;
    shadowColor: string;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowSpread: number;

    // Transform
    size: number;
    rotation: number;
    opacity: number;

    // Eraser mask paths
    eraserPaths?: EraserPath[];
};
