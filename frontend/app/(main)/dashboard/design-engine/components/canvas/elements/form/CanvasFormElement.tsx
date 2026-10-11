"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { CanvasElement, EraserSettings } from "../../../../types/elements";
import type { FormElement } from "../../../../types/form";
import { FORM_THEME_PRESETS } from "../../../../constants/formThemes";
import {
    canvasPointsToElementLocal,
    getElementDimensions,
    pointsToSvgPath,
} from "../../../../utils/canvasUtils";

type Props = {
    element: FormElement;
    isSelected: boolean;
    isEraserMode: boolean;
    isErasing: boolean;
    currentEraserPoints: { x: number; y: number }[] | null;
    eraserSettings: EraserSettings;
    canvasWidth: number;
    canvasHeight: number;
    handlePointerDown: (event: ReactPointerEvent, element: CanvasElement) => void;
    deleteElement: (id: string) => void;
};

export function CanvasFormElement({
    element,
    isSelected,
    isEraserMode,
    isErasing,
    currentEraserPoints,
    eraserSettings,
    canvasWidth,
    canvasHeight,
    handlePointerDown,
    deleteElement,
}: Props) {
    const [values, setValues] = useState<Record<string, string>>({});
    const dimensions = getElementDimensions(element, {
        width: canvasWidth,
        height: canvasHeight,
    });
    const scale = (element.size ?? 100) / 100;
    const liveEraserPath =
        isEraserMode && isErasing && currentEraserPoints
            ? pointsToSvgPath(
                  canvasPointsToElementLocal(
                      currentEraserPoints,
                      {
                          x: element.x,
                          y: element.y,
                          width: dimensions.width,
                          height: dimensions.height,
                          rotation: element.rotation,
                          size: element.size,
                      },
                      "top-left"
                  )
              )
            : null;
    const hasEraserMask = Boolean(element.eraserPaths?.length || liveEraserPath);
    const theme = FORM_THEME_PRESETS[element.theme];
    const isLight = ["paper-atelier", "citrus-pop", "mono-brutalist"].includes(element.theme);
    const foreground = isLight ? "#202721" : "#f4f7f8";
    const fieldBackground = isLight ? "rgba(255,255,255,.72)" : "rgba(4,12,17,.32)";
    const fieldBorder = isLight ? "#c8c5bb" : "rgba(210,235,240,.22)";
    const radius = `${element.borderRadius}${element.borderRadiusUnit}`;
    const borderWidth = element.borderWidthUnit === "%"
        ? (Math.min(dimensions.width, dimensions.height) * element.borderWidth) / 100
        : element.borderWidth;
    const shadow = element.shadow === "none"
        ? "none"
        : element.shadow === "neon"
        ? `0 0 ${element.shadowBlur}px ${element.shadowColor}88, 0 ${element.shadowOffsetY}px ${element.shadowBlur * 1.5}px ${element.shadowColor}55`
        : `${element.shadowOffsetX}px ${element.shadowOffsetY}px ${element.shadowBlur}px ${element.shadowSpread}px ${element.shadowColor}66`;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!element.receiverEmail.trim()) {
            window.alert("The form owner has not set a receiver email yet.");
            return;
        }

        const body = element.fields
            .map((field) => `${field.label}: ${values[field.id] ?? ""}`)
            .join("\n");
        const query = new URLSearchParams({
            view: "cm",
            fs: "1",
            to: element.receiverEmail.trim(),
            su: `Form response: ${element.title}`,
            body,
        });
        window.open(`https://mail.google.com/mail/?${query.toString()}`, "_blank", "noopener,noreferrer");
    };

    const buttonRadius = `${element.buttonBorderRadius}${element.buttonBorderRadiusUnit}`;
    const buttonBackground = element.buttonStyle === "outline"
        ? "transparent"
        : element.buttonStyle === "gradient"
        ? `linear-gradient(110deg, ${element.buttonBackgroundColor}, ${element.borderColor})`
        : element.buttonStyle === "glass"
        ? `${element.buttonBackgroundColor}99`
        : element.buttonBackgroundColor;

    return (
        <div
            data-element-id={element.id}
            onPointerDown={(event) => handlePointerDown(event, element)}
            className={`absolute select-none ${isEraserMode ? "pointer-events-none cursor-none" : "cursor-move"} ${isSelected && !isEraserMode ? "outline outline-2 outline-blue-500" : ""}`}
            style={{
                left: element.x,
                top: element.y,
                width: `${element.width}${element.widthUnit}`,
                height: `${element.height}${element.heightUnit}`,
                transform: `rotate(${element.rotation}deg) scale(${scale})`,
                transformOrigin: "top left",
                opacity: element.opacity,
                borderRadius: radius,
                mask: hasEraserMask ? `url(#eraser-mask-${element.id})` : undefined,
                WebkitMask: hasEraserMask ? `url(#eraser-mask-${element.id})` : undefined,
            }}
        >
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
                <defs>
                    <mask id={`eraser-mask-${element.id}`} maskUnits="userSpaceOnUse">
                        <rect x="-5000" y="-5000" width="10000" height="10000" fill="white" />
                        {element.eraserPaths?.map((path, index) => (
                            <path key={index} d={path.d} stroke="black" strokeWidth={path.strokeWidth} strokeOpacity={path.opacity} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        ))}
                        {liveEraserPath && (
                            <path d={liveEraserPath} stroke="black" strokeWidth={eraserSettings.size / scale} strokeOpacity={eraserSettings.opacity} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        )}
                    </mask>
                </defs>
            </svg>

            {isSelected && !isEraserMode && (
                <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                        event.stopPropagation();
                        deleteElement(element.id);
                    }}
                    className="absolute -right-3 -top-3 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700"
                    title="Delete form"
                >
                    <X size={13} />
                </button>
            )}

            <form
                onSubmit={handleSubmit}
                className="relative flex h-full w-full flex-col gap-3 overflow-hidden p-5 sm:p-7"
                style={{
                    color: foreground,
                    backgroundColor: element.backgroundColor,
                    backgroundImage: theme.backgroundImage,
                    border: element.borderStyle === "none" || borderWidth === 0
                        ? "none"
                        : `${borderWidth}px ${element.borderStyle} ${element.borderColor}`,
                    borderRadius: radius,
                    boxShadow: shadow,
                    backdropFilter: element.theme === "aurora-glass" ? "blur(16px)" : undefined,
                }}
            >
                <header className="shrink-0">
                    <h2 className="text-xl font-semibold leading-tight" style={{ color: element.headingColor }}>{element.title}</h2>
                    {element.description && (
                        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: element.descriptionColor }}>{element.description}</p>
                    )}
                </header>

                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
                    {element.fields.map((field) => {
                        const controlStyle = {
                            backgroundColor: fieldBackground,
                            border: `1px solid ${fieldBorder}`,
                            color: foreground,
                            borderRadius: "10px",
                        };
                        return (
                            <label key={field.id} className="flex shrink-0 flex-col gap-1.5 text-xs font-medium" style={{ color: element.fieldLabelColor }}>
                                <span>{field.label}{field.required && <span className="ml-1 text-rose-500">*</span>}</span>
                                {field.type === "textarea" ? (
                                    <textarea
                                        required={field.required}
                                        placeholder={field.placeholder}
                                        value={values[field.id] ?? ""}
                                        onChange={(event) => setValues((previous) => ({ ...previous, [field.id]: event.target.value }))}
                                        className="min-h-24 w-full resize-y px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400/50"
                                        style={controlStyle}
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        required={field.required}
                                        placeholder={field.placeholder}
                                        value={values[field.id] ?? ""}
                                        onChange={(event) => setValues((previous) => ({ ...previous, [field.id]: event.target.value }))}
                                        className="min-h-11 w-full px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400/50"
                                        style={controlStyle}
                                    />
                                )}
                            </label>
                        );
                    })}
                </div>

                <button
                    type="submit"
                    className="shrink-0 px-4 text-sm font-semibold transition hover:brightness-110 active:scale-[.99]"
                    style={{
                        width: `${element.buttonWidth}${element.buttonWidthUnit}`,
                        height: `${element.buttonHeight}${element.buttonHeightUnit}`,
                        alignSelf: "center",
                        color: element.buttonTextColor,
                        background: buttonBackground,
                        border: `${element.buttonBorderWidth}px ${element.buttonBorderStyle} ${element.buttonBorderColor}`,
                        borderRadius: buttonRadius,
                        boxShadow: element.buttonStyle === "glass" ? "inset 0 1px 0 rgba(255,255,255,.22)" : undefined,
                    }}
                >
                    {element.submitText}
                </button>
            </form>
        </div>
    );
}