import type { ProgressElement } from "../../../../types/progress";

export function getProgressShadow(
    element: ProgressElement,
    itemColor?: string
): string {
    if (element.shadow === "none") return "none";
    if (element.shadow === "sm") return "0 2px 6px rgba(0, 0, 0, 0.25)";
    if (element.shadow === "md") return "0 6px 16px rgba(0, 0, 0, 0.35)";
    if (element.shadow === "lg") return "0 12px 28px rgba(0, 0, 0, 0.45)";
    if (element.shadow === "xl") return "0 20px 48px rgba(0, 0, 0, 0.55)";
    if (element.shadow === "neon") {
        const glow = itemColor || element.barColor || "#ffff00";
        return `0 0 16px ${glow}aa, 0 0 32px ${glow}55`;
    }
    if (element.shadow === "3d-offset") {
        return "4px 4px 0px rgba(0, 0, 0, 0.85)";
    }
    if (element.shadow === "layered-steps") {
        return [
            "2px 2px 0px rgba(255, 255, 255, 0.9)",
            "4px 4px 0px rgba(255, 255, 255, 0.75)",
            "6px 6px 0px rgba(255, 255, 255, 0.6)",
            "8px 8px 0px rgba(255, 255, 255, 0.45)",
            "10px 10px 0px rgba(255, 255, 255, 0.3)",
        ].join(", ");
    }
    if (element.shadow === "custom") {
        return `${element.shadowOffsetX ?? 0}px ${element.shadowOffsetY ?? 4}px ${element.shadowBlur ?? 12}px ${element.shadowSpread ?? 0}px ${element.shadowColor ?? "rgba(0,0,0,0.35)"}`;
    }
    return "none";
}

export function getProgressDropShadowFilter(
    element: ProgressElement,
    itemColor?: string
): string {
    if (element.shadow === "none") return "none";
    if (element.shadow === "sm") return "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25))";
    if (element.shadow === "md") return "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.35))";
    if (element.shadow === "lg") return "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.45))";
    if (element.shadow === "xl") return "drop-shadow(0 12px 24px rgba(0, 0, 0, 0.55))";
    if (element.shadow === "neon") {
        const glow = itemColor || element.barColor || "#ffff00";
        return `drop-shadow(0 0 8px ${glow}aa) drop-shadow(0 0 16px ${glow}55)`;
    }
    if (element.shadow === "3d-offset") {
        return "drop-shadow(4px 4px 0px rgba(0, 0, 0, 0.85))";
    }
    if (element.shadow === "layered-steps") {
        return "drop-shadow(3px 3px 0px rgba(255, 255, 255, 0.7))";
    }
    if (element.shadow === "custom") {
        return `drop-shadow(${element.shadowOffsetX ?? 0}px ${element.shadowOffsetY ?? 4}px ${element.shadowBlur ?? 8}px ${element.shadowColor ?? "rgba(0,0,0,0.35)"})`;
    }
    return "none";
}
