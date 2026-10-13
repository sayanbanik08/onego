import type { EraserPath } from "./common";
import type { ButtonShadowPreset } from "./button";
import type { ImageDimensionUnit } from "./image";

export type NavigationLink = {
    id: string;
    label: string;
    href: string;
    canvasId?: string;
};

export type NavigationElement = {
    id: string;
    type: "navigation";
    serialNumber: number;
    x: number;
    y: number;
    links: NavigationLink[];
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    width: number;
    widthUnit: ImageDimensionUnit;
    height: number;
    heightUnit: ImageDimensionUnit;
    size: number;
    rotation: number;
    opacity: number;
    shadow: ButtonShadowPreset;
    shadowColor: string;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowSpread: number;
    eraserPaths?: EraserPath[];
};