import type { FormTheme } from "../types/form";

export const FORM_THEME_PRESETS: Record<
    FormTheme,
    {
        label: string;
        backgroundColor: string;
        borderColor: string;
        buttonBackgroundColor: string;
        buttonTextColor: string;
        backgroundImage?: string;
    }
> = {
    "aurora-glass": {
        label: "Aurora Glass",
        backgroundColor: "#102629",
        borderColor: "#5eead4",
        buttonBackgroundColor: "#14b8a6",
        buttonTextColor: "#042f2e",
        backgroundImage: "radial-gradient(ellipse at top right, #1d5963 0%, transparent 55%)",
    },
    "midnight-chrome": {
        label: "Midnight Chrome",
        backgroundColor: "#151922",
        borderColor: "#6f829f",
        buttonBackgroundColor: "#d4e0f0",
        buttonTextColor: "#172033",
        backgroundImage: "linear-gradient(145deg, #222c3c, #10131b 65%)",
    },
    "paper-atelier": {
        label: "Paper Atelier",
        backgroundColor: "#f4f0e8",
        borderColor: "#b8a68b",
        buttonBackgroundColor: "#253d36",
        buttonTextColor: "#f6f2e9",
        backgroundImage: "linear-gradient(135deg, #fbf8f1, #e9e2d5)",
    },
    "citrus-pop": {
        label: "Citrus Pop",
        backgroundColor: "#f0f4dc",
        borderColor: "#829531",
        buttonBackgroundColor: "#d4f044",
        buttonTextColor: "#26300b",
        backgroundImage: "radial-gradient(circle at 100% 0%, #dceea0 0%, transparent 48%)",
    },
    "rose-chrome": {
        label: "Rose Chrome",
        backgroundColor: "#2a2024",
        borderColor: "#d89aa9",
        buttonBackgroundColor: "#e3a5b4",
        buttonTextColor: "#321c25",
        backgroundImage: "linear-gradient(145deg, #48333d, #211a20 68%)",
    },
    "mono-brutalist": {
        label: "Mono Brutalist",
        backgroundColor: "#f5f4ef",
        borderColor: "#111111",
        buttonBackgroundColor: "#f5f4ef",
        buttonTextColor: "#111111",
        backgroundImage: "linear-gradient(135deg, #fffefa, #e7e5df)",
    },
    "cobalt-launch": {
        label: "Cobalt Launch",
        backgroundColor: "#172942",
        borderColor: "#68c8ed",
        buttonBackgroundColor: "#66c7e8",
        buttonTextColor: "#102336",
        backgroundImage: "radial-gradient(ellipse at 0% 100%, #284b70 0%, transparent 58%)",
    },
    "solar-flare": {
        label: "Solar Flare",
        backgroundColor: "#2b2520",
        borderColor: "#eea457",
        buttonBackgroundColor: "#f2a24d",
        buttonTextColor: "#342012",
        backgroundImage: "linear-gradient(145deg, #463224, #211e1b 70%)",
    },
    custom: {
        label: "Custom",
        backgroundColor: "#102629",
        borderColor: "#5eead4",
        buttonBackgroundColor: "#14b8a6",
        buttonTextColor: "#042f2e",
    },
};