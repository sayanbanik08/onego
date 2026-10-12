import type { EraserPath } from "./common";
import type { ButtonShadowPreset } from "./button";

export type GridLayoutPreset =
    | "pinterest-masonry"
    | "bento-modern"
    | "featured-split"
    | "editorial-magazine"
    | "classic-uniform"
    | "custom";

export type GridDimensionUnit = "px" | "%";

export type GridCustomCell = {
    id: string;
    colSpan?: number;
    rowSpan?: number;
    heightRatio?: number;
    label?: string;
};

export type GridElement = {
    id: string;
    type: "grid";
    serialNumber: number;
    x: number;
    y: number;

    // Layout configuration
    layoutPreset: GridLayoutPreset;
    columns: number; // 1 to 12
    rows: number; // 1 to 12
    gap: number; // gap between cells in px (0 - 48)
    cellCount: number; // number of cells to render

    // Overall Grid Dimensions (like Image element)
    width: number;
    widthUnit: GridDimensionUnit;
    height: number;
    heightUnit: GridDimensionUnit;

    // Base Cell Height in px
    cellHeight: number;

    // Cell Styling (like Image element)
    cellBgColor: string;
    cellBorderColor: string;
    cellBorderWidth: number;
    cellBorderStyle: "solid" | "dashed" | "dotted" | "none";
    cellBorderRadius: number;
    cellBorderRadiusUnit: "px" | "%";

    // Visual options
    showCellNumbers: boolean;
    showPlusIcon: boolean;
    skeletonPulse: boolean;

    // Shadow (Exact same structure as Button/Image)
    shadow: ButtonShadowPreset;
    shadowColor: string;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowSpread: number;

    // Transform & Scale (Exact same structure as Image)
    size: number;
    rotation: number;
    opacity: number;

    // Eraser mask paths
    eraserPaths?: EraserPath[];
};
