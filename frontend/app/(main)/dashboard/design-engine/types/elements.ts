import type { CardElement } from "./card";
import type { TimelineElement } from "./timeline";
import type { ButtonElement } from "./button";
import type { IconElement } from "./icon";
import type { EraserPath } from "./common";
export type { EraserPath, ButtonElement, IconElement };

export type TextElement = {
    id: string;
    type: "text";
    serialNumber: number;
    x: number;
    y: number;
    text: string;
    fontSize: number;
    color: string;
    backgroundColor?: string;
    fontWeight: number;
    fontFamily: string;
    fontStyle: "normal" | "italic" | "underline" | "italic-underline";
    underline?: boolean;
    rotation: number;
    opacity?: number;
    eraserPaths?: EraserPath[];
};

export type DrawElement = {
    id: string;
    type: "draw";
    serialNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;
    pathData: string;
    strokeWidth: number;
    opacity: number;
    color: string;
    rotation: number;
    size?: number;
    eraserPaths?: EraserPath[];
};

export type TablePreset =
    | "minimal"
    | "dark"
    | "ocean"
    | "emerald"
    | "sunset"
    | "classic";

export type TableElement = {
    id: string;
    type: "table";
    serialNumber: number;
    x: number;
    y: number;
    rows: number;
    cols: number;
    headers: string[];
    data: string[][];
    hasHeader: boolean;
    preset?: TablePreset;

    // Header Styles
    headerBg: string;
    headerColor: string;
    headerFontWeight: number;
    headerAlign: "left" | "center" | "right";

    // Body Styles
    rowBg: string;
    altRowBg: string;
    cellColor: string;
    cellAlign: "left" | "center" | "right";
    fontSize: number;

    // Borders & Container
    borderColor: string;
    borderWidth: number;
    borderStyle: "solid" | "dashed" | "dotted" | "none";
    cellPadding: number;
    borderRadius: number;
    shadow: "none" | "sm" | "md" | "lg";

    // Transform
    size: number;
    rotation: number;
    opacity?: number;
    eraserPaths?: EraserPath[];
};

export type ClockDesign =
    | "digital-minimal"
    | "analog-classic"
    | "digital-neon"
    | "analog-swiss"
    | "flip-card"
    | "smartwatch";

export type ClockTimeMode = "live" | "custom" | "static";

export type ClockDateMode = "live" | "custom";

export type ClockElement = {
    id: string;
    type: "clock";
    serialNumber: number;
    x: number;
    y: number;

    design: ClockDesign;
    timeMode: ClockTimeMode;

    // Custom / starting time values
    customHour: number; // 0-23
    customMinute: number; // 0-59
    customSecond: number; // 0-59
    startEpochMs: number; // reference point for custom running time

    is24Hour: boolean;
    showSeconds: boolean;

    // Date
    showDate: boolean;
    dateMode: "live" | "custom";
    customDateStr: string;

    // Visual styles
    bgColor: string;
    textColor: string;
    accentColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    shadow: "none" | "sm" | "md" | "lg";

    // Transform
    size: number;
    rotation: number;
    opacity?: number;
    eraserPaths?: EraserPath[];
};

export type CanvasElement =
    | TextElement
    | DrawElement
    | TableElement
    | ClockElement
    | TimelineElement
    | CardElement
    | ButtonElement
    | IconElement;

export type PencilSettings = {
    strokeWidth: number;
    opacity: number;
    color: string;
    rotation?: number;
    size?: number;
};

export type EraserSettings = {
    size: number;
    opacity: number;
};

export type BackgroundType = "solid" | "gradient" | "image";

export type DashboardBackgroundSettings = {
    type: BackgroundType;
    color: string;
    gradientType: "linear" | "radial";
    gradientAngle: number;
    gradientColor1: string;
    gradientColor2: string;
    imageUrl: string;
    imageFit: "cover" | "contain" | "tile";
    imageOpacity: number;
    imageBlur: number;
    imageOverlayColor: string;
    imageOverlayOpacity: number;
    showGridDots: boolean;
    gridDotsColor: string;
    gridDotsSize: number;
};
