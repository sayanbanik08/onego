import React from "react";
import type { DashboardBackgroundSettings } from "../../../../types/elements";

export type CanvasDashboardBackgroundProps = {
    backgroundSettings?: DashboardBackgroundSettings;
    isDrawMode: boolean;
    isEraserMode: boolean;
    onSelectBackground?: () => void;
    children: React.ReactNode;
};

export type CanvasBackgroundProps = CanvasDashboardBackgroundProps;

export function CanvasDashboardBackground({
    backgroundSettings: bg,
    isDrawMode,
    isEraserMode,
    onSelectBackground,
    children,
}: CanvasDashboardBackgroundProps) {
    const getCanvasBg = () => {
        if (!bg || bg.type === "solid") {
            return {
                backgroundColor: bg?.color ?? "#ffffff",
                backgroundImage: (bg?.showGridDots ?? true)
                    ? `radial-gradient(${bg?.gridDotsColor ?? "#b8b8b8"} 1px, transparent 1px)`
                    : "none",
                backgroundSize: (bg?.showGridDots ?? true)
                    ? `${bg?.gridDotsSize ?? 20}px ${bg?.gridDotsSize ?? 20}px`
                    : undefined,
            };
        }
        if (bg.type === "gradient") {
            const grad =
                bg.gradientType === "radial"
                    ? `radial-gradient(circle, ${bg.gradientColor1}, ${bg.gradientColor2})`
                    : `linear-gradient(${bg.gradientAngle}deg, ${bg.gradientColor1}, ${bg.gradientColor2})`;
            return {
                backgroundImage: bg.showGridDots
                    ? `radial-gradient(${bg.gridDotsColor} 1px, transparent 1px), ${grad}`
                    : grad,
                backgroundSize: bg.showGridDots
                    ? `${bg.gridDotsSize}px ${bg.gridDotsSize}px, 100% 100%`
                    : "100% 100%",
            };
        }
        // image mode: handled via child divs
        return {
            backgroundColor: bg.color,
            backgroundImage: bg.showGridDots
                ? `radial-gradient(${bg.gridDotsColor} 1px, transparent 1px)`
                : "none",
            backgroundSize: bg.showGridDots
                ? `${bg.gridDotsSize}px ${bg.gridDotsSize}px`
                : undefined,
        };
    };

    return (
        <div
            className="relative min-h-[1200px] w-full"
            style={getCanvasBg()}
        >
            {/* Background image layer */}
            {bg?.type === "image" && bg.imageUrl && (
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage: `url(${bg.imageUrl})`,
                        backgroundSize:
                            bg.imageFit === "tile" ? "auto" : bg.imageFit,
                        backgroundRepeat:
                            bg.imageFit === "tile" ? "repeat" : "no-repeat",
                        backgroundPosition: "center",
                        opacity: bg.imageOpacity,
                        filter:
                            bg.imageBlur > 0
                                ? `blur(${bg.imageBlur}px)`
                                : undefined,
                    }}
                />
            )}
            {/* Overlay for image background */}
            {bg?.type === "image" &&
                bg.imageUrl &&
                bg.imageOverlayOpacity > 0 && (
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            backgroundColor: bg.imageOverlayColor,
                            opacity: bg.imageOverlayOpacity,
                        }}
                    />
                )}
            {/* Transparent "click background to edit" zone – sits below elements */}
            <div
                className="absolute inset-0"
                style={{ zIndex: 0 }}
                onClick={() => {
                    if (!isDrawMode && !isEraserMode && onSelectBackground) {
                        onSelectBackground();
                    }
                }}
            />

            {children}
        </div>
    );
}

export default CanvasDashboardBackground;

