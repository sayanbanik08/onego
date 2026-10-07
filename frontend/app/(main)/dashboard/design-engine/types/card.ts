export type CardStyle =
    | "neon-glow"
    | "corner-fold"
    | "neumorphic"
    | "social-marquee";

export type CardShadow = "none" | "sm" | "md" | "lg" | "neon" | "neumorphic";

export type SocialPlatformKey =
    | "vimeo"
    | "threads"
    | "instagram"
    | "whatsapp"
    | "linkedin"
    | "soundcloud"
    | "twitch"
    | "discord"
    | "twitter"
    | "vk"
    | "snapchat"
    | "dribbble"
    | "behance"
    | "reddit"
    | "youtube"
    | "github";

export type SocialHandleItem = {
    id: string;
    platform: SocialPlatformKey;
    label: string;
    url: string;
    customColor?: string;
};
import type { EraserPath } from "./common";

export type CardElement = {
    id: string;
    type: "card";
    serialNumber: number;
    x: number;
    y: number;

    // Design Preset
    design: CardStyle;

    // Dimensions & Container
    cardWidth: number;
    cardMinHeight: number;
    cardBg: string;
    cardBorderWidth: number;
    cardBorderColor: string;
    borderRadius: number;
    shadow: CardShadow;
    accentColor: string;

    // Section 1: Heading
    heading: string;
    headingColor: string;
    headingFontSize: number;
    headingFontWeight: number;

    // Section 2: Body Text
    bodyText: string;
    bodyColor: string;
    bodyFontSize: number;

    // Section 3: Button (Optional / Toggleable)
    showButton: boolean;
    buttonText: string;
    buttonBgColor: string;
    buttonTextColor: string;
    buttonBorderRadius: number;
    buttonFontSize: number;
    buttonPaddingX: number;
    buttonPaddingY: number;
    buttonLink: string; // "map to" redirection field

    // Special: Social Marquee Handles
    socialHandles: SocialHandleItem[];
    socialMarqueeSpeed: number; // in seconds

    // Transform & Element Props
    size: number;
    rotation: number;
    opacity?: number;
    eraserPaths?: EraserPath[];
};
