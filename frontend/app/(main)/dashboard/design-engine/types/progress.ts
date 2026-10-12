import type { EraserPath } from "./common";
import type { ButtonShadowPreset } from "./button";

export type ProgressDesignPreset =
    | "vertical-pill"
    | "horizontal-bar"
    | "circular-donut"
    | "histogram"
    | "capsule-gauge";

export type ProgressDimensionUnit = "px" | "%";

export type ProgressItem = {
    id: string;
    label: string;
    value: number; // 0 to 100 percentage
    color?: string; // Optional custom bar color for this item
    trackColor?: string; // Optional custom track color for this item
};

export type ProgressElement = {
    id: string;
    type: "progress";
    serialNumber: number;
    x: number;
    y: number;

    // Design Preset
    designPreset: ProgressDesignPreset;

    // Data Items
    items: ProgressItem[];

    // Overall Dimensions
    width: number;
    widthUnit: ProgressDimensionUnit;
    height: number;
    heightUnit: ProgressDimensionUnit;

    // Item & Bar Geometry
    itemSpacing: number; // px gap between items (0 - 48)
    barWidth: number; // thickness/width of each bar (10 - 80)
    borderRadius: number; // corner radius of the bar/pill
    borderRadiusUnit: "px" | "%";

    // Colors
    barColor: string; // primary fill color (e.g. #ffff00)
    trackColor: string; // pill background track (e.g. #f0f0f2)
    cardBgColor: string; // container background (transparent or card)
    cardBorderColor: string;
    cardBorderWidth: number;
    cardBorderStyle: "solid" | "dashed" | "dotted" | "none";
    cardBorderRadius: number;

    // Toggles & Labels
    showValues: boolean; // Show % text e.g. "74%"
    showLabels: boolean; // Show label text e.g. "Java"
    showXAxis: boolean; // Optional baseline X line
    showYAxis: boolean; // Optional Y axis ticks / line
    showGridLines: boolean; // Optional background guideline markers

    // Typography & Axes Colors
    valueColor: string;
    labelColor: string;
    axisColor: string;
    fontSize: number;

    // Shadow Effects
    shadow: ButtonShadowPreset;
    shadowColor: string;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowSpread: number;

    // Transform & Scale
    size: number;
    rotation: number;
    opacity: number;

    // Eraser mask paths
    eraserPaths?: EraserPath[];
};
