import type { ButtonElement } from "../../../../types/button";

export function getButtonShadow(element: ButtonElement): string {
    if (element.shadow === "none") return "none";
    if (element.shadow === "sm") return "0 2px 6px rgba(0, 0, 0, 0.25)";
    if (element.shadow === "md") return "0 6px 16px rgba(0, 0, 0, 0.35)";
    if (element.shadow === "lg") return "0 12px 28px rgba(0, 0, 0, 0.45)";
    if (element.shadow === "xl") return "0 20px 48px rgba(0, 0, 0, 0.55)";
    if (element.shadow === "neon") {
        const glow = element.textColor || element.borderColor || "#3b82f6";
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
            "12px 12px 0px rgba(255, 255, 255, 0.2)",
            "14px 14px 0px rgba(255, 255, 255, 0.1)",
        ].join(", ");
    }
    if (element.shadow === "custom") {
        return `${element.shadowOffsetX ?? 0}px ${element.shadowOffsetY ?? 4}px ${element.shadowBlur ?? 12}px ${element.shadowSpread ?? 0}px ${element.shadowColor ?? "rgba(0,0,0,0.35)"}`;
    }
    return "none";
}

export function getButtonRadius(element: ButtonElement): string {
    const unit = element.borderRadiusUnit || "px";
    return `${element.borderRadius ?? 8}${unit}`;
}

export function handleButtonRedirect(link?: string) {
    if (!link) return;
    let url = link.trim();
    if (!url) return;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }
    window.open(url, "_blank", "noopener,noreferrer");
}

export const SAMPLE_BUTTON_IMAGES = [
    {
        label: "Cyber Glow",
        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    },
    {
        label: "Gradient Mesh",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    },
    {
        label: "Dark Carbon",
        url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80",
    },
    {
        label: "Fluid Hologram",
        url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
    },
];

export const BUTTON_FONT_FAMILIES = [
    { label: "Inter (Modern Sans)", value: "Inter, sans-serif" },
    { label: "Outfit (Futuristic)", value: "Outfit, sans-serif" },
    { label: "Roboto (Clean Geometric)", value: "Roboto, sans-serif" },
    { label: "Poppins (Soft Geometric)", value: "Poppins, sans-serif" },
    { label: "Montserrat (Bold Impact)", value: "Montserrat, sans-serif" },
    { label: "Playfair Display (Luxury Serif)", value: "'Playfair Display', serif" },
    { label: "Courier New (Tech Monospace)", value: "'Courier New', monospace" },
    { label: "Impact (Heavy Display)", value: "Impact, sans-serif" },
    { label: "Georgia (Classic Editorial)", value: "Georgia, serif" },
    { label: "Comic Sans (Playful Script)", value: "'Comic Sans MS', cursive" },
];
