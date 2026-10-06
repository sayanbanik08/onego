export type TimelineTheme =
    | "modern-vertical"
    | "alternating-zigzag"
    | "horizontal-stepper"
    | "neon-cyber"
    | "glass-cards"
    | "bullet-compact"
    | "circular-milestones"
    | "gradient-metro";

export type TimelineIconType =
    | "briefcase"
    | "graduation"
    | "trophy"
    | "star"
    | "code"
    | "rocket"
    | "check"
    | "circle";

export type TimelineItem = {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    description: string;
    tag?: string;
    icon?: TimelineIconType;
    accentColor?: string;
};

export type TimelineHoverEffect = "lift" | "scale" | "glow" | "none";

export type TimelineShadow = "none" | "sm" | "md" | "lg" | "neon";

export type EraserPath = {
    d: string;
    strokeWidth: number;
    opacity: number;
};

export type TimelineElement = {
    id: string;
    type: "timeline";
    serialNumber: number;
    x: number;
    y: number;

    // Theme & Layout
    theme: TimelineTheme;
    items: TimelineItem[];
    spacing: number;
    nodeShape: "circle" | "square" | "hexagon" | "diamond";
    nodeSize: number;

    // Card Dimensions
    cardWidth?: number;
    cardMinHeight?: number;

    // Line & Connector
    lineWidth: number;
    lineColor: string;
    animatedLine?: boolean;

    // Colors & Theme Styling
    accentColor: string;
    cardBg: string;
    cardBorderColor: string;
    cardBorderWidth: number;
    borderRadius: number;

    // Typography
    fontFamily: string;
    titleColor: string;
    titleFontSize: number;
    titleFontWeight: number;
    subtitleColor: string;
    subtitleFontSize: number;
    dateColor: string;
    dateFontSize: number;
    tagColor?: string;
    tagFontSize?: number;
    textColor: string;
    bodyFontSize: number;

    // Shadow
    shadow: TimelineShadow;

    // Hover Interaction
    hoverEffect: TimelineHoverEffect;

    // Transform & Standard Element Props
    size: number;
    rotation: number;
    opacity?: number;
    eraserPaths?: EraserPath[];
};
