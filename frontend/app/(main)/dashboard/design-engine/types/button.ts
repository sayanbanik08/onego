import type { EraserPath } from "./common";

export type ButtonTheme =
    | "button-1"
    | "button-2"
    | "button-3"
    | "button-4"
    | "button-5"
    | "button-6"
    | "button-7"
    | "button-8"
    | "custom"
    | "gamepad-3d"
    | "jello-squeeze"
    | "skew-slide"
    | "neo-brutalist"
    | "stacked-3d"
    | "letter-slide"
    | "jelly-pill"
    | "cyber-cut";

export type ButtonRadiusUnit = "px" | "%";

export type ButtonShadowPreset =
    | "none"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "neon"
    | "3d-offset"
    | "layered-steps"
    | "custom";

export type ButtonImageFit = "cover" | "contain" | "fill" | "repeat";
export type ButtonImagePosition =
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top left"
    | "top right"
    | "bottom left"
    | "bottom right"
    | (string & {});

export type ButtonDrawnShape = {
    dataUrl: string;
    width: number;
    height: number;
    hasDrawnShape: boolean;
};

export type ButtonElement = {
    id: string;
    type: "button";
    serialNumber: number;
    x: number;
    y: number;

    // Theme Preset (Button 1, Button 2, ... Button 8, Custom)
    theme: ButtonTheme;

    // 1. Button Text
    text: string;

    // 2. Map To (Redirect Link)
    link: string;

    // 3. Font Size
    fontSize: number;

    // 4. Button Radius
    borderRadius: number;
    borderRadiusUnit: ButtonRadiusUnit;

    // 5. Font Family
    fontFamily: string;

    // 6. Padding (X / Y)
    paddingX: number;
    paddingY: number;

    // 7. Button Background
    bgColor: string;

    // 8. Button Background Image
    bgImage: string;
    bgImageFit: ButtonImageFit;
    bgImagePosition: ButtonImagePosition;
    bgImageOpacity: number;

    // 9. Button Text Color
    textColor: string;

    // Border
    borderColor: string;
    borderWidth: number;
    borderStyle: "solid" | "dashed" | "dotted" | "none";

    // Shadow
    shadow: ButtonShadowPreset;
    shadowColor: string;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowSpread: number;

    // 13. Draw (Custom drawn shape)
    drawnShape?: ButtonDrawnShape;

    // Transform & canvas properties
    size: number;
    rotation: number;
    opacity: number;
    eraserPaths?: EraserPath[];
};
