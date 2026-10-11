import type { EraserPath } from "./common";
import type { ButtonShadowPreset } from "./button";

export type FormTheme =
    | "aurora-glass"
    | "midnight-chrome"
    | "paper-atelier"
    | "citrus-pop"
    | "rose-chrome"
    | "mono-brutalist"
    | "cobalt-launch"
    | "solar-flare"
    | "custom";
export type FormFieldType = "text" | "email" | "tel" | "number" | "date" | "textarea";
export type FormDimensionUnit = "px" | "%";

export type FormField = {
    id: string;
    type: FormFieldType;
    label: string;
    placeholder: string;
    required: boolean;
    locked?: boolean;
};

export type FormElement = {
    id: string;
    type: "form";
    serialNumber: number;
    x: number;
    y: number;
    title: string;
    description: string;
        headingColor: string;
        descriptionColor: string;
        fieldLabelColor: string;
    receiverEmail: string;
    fields: FormField[];
    submitText: string;
    theme: FormTheme;
    width: number;
    widthUnit: FormDimensionUnit;
    height: number;
    heightUnit: FormDimensionUnit;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderWidthUnit: FormDimensionUnit;
    borderStyle: "solid" | "dashed" | "dotted" | "none";
    borderRadius: number;
    borderRadiusUnit: FormDimensionUnit;
    buttonTextColor: string;
    buttonBackgroundColor: string;
    buttonBorderColor: string;
    buttonWidth: number;
    buttonWidthUnit: FormDimensionUnit;
    buttonHeight: number;
    buttonHeightUnit: FormDimensionUnit;
    buttonBorderRadius: number;
    buttonBorderRadiusUnit: FormDimensionUnit;
    buttonBorderWidth: number;
    buttonBorderStyle: "solid" | "dashed" | "dotted" | "none";
    buttonStyle: "solid" | "outline" | "gradient" | "glass" | "pill";
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