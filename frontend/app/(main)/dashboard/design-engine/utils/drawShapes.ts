import type {
    DrawShapeCategory,
    DrawShapeType,
} from "../types/elements";

export type DrawShapeOption = {
    type: DrawShapeType;
    label: string;
    category: DrawShapeCategory;
    closed: boolean;
};

export const DRAW_SHAPE_CATEGORIES: {
    id: DrawShapeCategory;
    label: string;
}[] = [
    { id: "lines", label: "Lines" },
    { id: "basic", label: "Basic" },
    { id: "polygons", label: "Polygons" },
    { id: "stars", label: "Stars & Bursts" },
    { id: "arrows", label: "Arrows" },
    { id: "callouts", label: "Callouts" },
    { id: "symbols", label: "Symbols" },
];

const option = (
    category: DrawShapeCategory,
    type: string,
    label: string,
    closed = true
): DrawShapeOption => ({ category, type, label, closed });

const lineOptions = [
    ["line-horizontal", "Horizontal Line"],
    ["line-vertical", "Vertical Line"],
    ["line-diagonal-down", "Diagonal Down"],
    ["line-diagonal-up", "Diagonal Up"],
    ["line-arrow-right", "Right Arrow Line"],
    ["line-arrow-left", "Left Arrow Line"],
    ["line-arrow-up", "Up Arrow Line"],
    ["line-arrow-down", "Down Arrow Line"],
    ["line-arrow-both", "Double Arrow Line"],
    ["line-zigzag", "Zigzag Line"],
    ["line-wave", "Wave Line"],
    ["line-curve", "Curve"],
    ["line-arc", "Arc"],
    ["line-elbow", "Elbow Line"],
    ["line-polyline", "Polyline"],
    ["line-loop", "Loop"],
    ["line-scribble", "Scribble"],
].map(([type, label]) => option("lines", type, label, false));

const basicOptions = [
    ["rectangle", "Rectangle"],
    ["rounded-rectangle", "Rounded Rectangle"],
    ["square", "Square"],
    ["circle", "Circle"],
    ["ellipse", "Ellipse"],
    ["oval", "Oval"],
    ["triangle", "Triangle"],
    ["right-triangle", "Right Triangle"],
    ["inverted-triangle", "Inverted Triangle"],
    ["diamond", "Diamond"],
    ["parallelogram", "Parallelogram"],
    ["trapezoid", "Trapezoid"],
    ["rounded-trapezoid", "Rounded Trapezoid"],
    ["pentagon", "Pentagon"],
    ["hexagon", "Hexagon"],
    ["heptagon", "Heptagon"],
    ["octagon", "Octagon"],
    ["nonagon", "Nonagon"],
    ["decagon", "Decagon"],
    ["dodecagon", "Dodecagon"],
    ["capsule", "Capsule"],
    ["bevelled-rectangle", "Bevelled Rectangle"],
    ["cross", "Cross"],
    ["cylinder", "Cylinder"],
].map(([type, label]) => option("basic", type, label));

const polygonOptions = Array.from({ length: 30 }, (_, index) => {
    const sides = index + 3;
    return option("polygons", `polygon-${sides}`, `${sides}-Sided Polygon`);
});

const starOptions = [
    ...Array.from({ length: 22 }, (_, index) => {
        const points = index + 3;
        return option("stars", `star-${points}`, `${points}-Point Star`);
    }),
    ...[8, 12, 16, 24].map((points) =>
        option("stars", `burst-${points}`, `${points}-Point Burst`)
    ),
    ...[8, 12, 16].map((teeth) =>
        option("stars", `gear-${teeth}`, `${teeth}-Tooth Gear`)
    ),
];

const arrowOptions = [
    ["arrow-right", "Right Arrow"],
    ["arrow-left", "Left Arrow"],
    ["arrow-up", "Up Arrow"],
    ["arrow-down", "Down Arrow"],
    ["arrow-up-right", "Up-Right Arrow"],
    ["arrow-up-left", "Up-Left Arrow"],
    ["arrow-down-right", "Down-Right Arrow"],
    ["arrow-down-left", "Down-Left Arrow"],
    ["arrow-left-right", "Left-Right Arrow"],
    ["arrow-up-down", "Up-Down Arrow"],
    ["arrow-four-way", "Four-Way Arrow"],
    ["arrow-notched", "Notched Arrow"],
    ["arrow-striped", "Striped Arrow"],
    ["arrow-chevron", "Chevron Arrow"],
    ["arrow-bent-right", "Bent Right Arrow"],
    ["arrow-bent-left", "Bent Left Arrow"],
    ["arrow-bent-up", "Bent Up Arrow"],
    ["arrow-bent-down", "Bent Down Arrow"],
    ["arrow-u-turn", "U-Turn Arrow"],
    ["arrow-circular", "Circular Arrow"],
    ["arrow-pentagon", "Pentagon Arrow"],
    ["arrow-down-up", "Up-Down Reversible Arrow"],
].map(([type, label]) => option("arrows", type, label));

const calloutOptions = [
    ["callout-rectangle", "Rectangular Callout"],
    ["callout-rounded", "Rounded Callout"],
    ["callout-oval", "Oval Callout"],
    ["callout-left", "Left-Tail Callout"],
    ["callout-right", "Right-Tail Callout"],
    ["callout-top", "Top-Tail Callout"],
    ["callout-bottom", "Bottom-Tail Callout"],
    ["callout-cloud", "Cloud Callout"],
    ["callout-thought", "Thought Callout"],
    ["callout-thought-small", "Small Thought Bubble"],
    ["callout-thought-large", "Large Thought Bubble"],
    ["callout-caption", "Caption Callout"],
    ["callout-bracket", "Bracket Callout"],
    ["callout-wedge", "Wedge Callout"],
    ["callout-cloud-burst", "Burst Callout"],
    ["callout-label", "Label Callout"],
].map(([type, label]) => option("callouts", type, label));

const symbolOptions = [
    ["symbol-heart", "Heart"],
    ["symbol-lightning", "Lightning"],
    ["symbol-moon", "Moon"],
    ["symbol-cloud", "Cloud"],
    ["symbol-droplet", "Droplet"],
    ["symbol-teardrop", "Teardrop"],
    ["symbol-smiley", "Smiley Face"],
    ["symbol-sad-face", "Sad Face"],
    ["symbol-face", "Face"],
    ["symbol-ring", "Ring"],
    ["symbol-plus", "Plus"],
    ["symbol-x", "X Mark"],
    ["symbol-check", "Check Mark"],
    ["symbol-flag", "Flag"],
    ["symbol-home", "Home"],
    ["symbol-shield", "Shield"],
    ["symbol-leaf", "Leaf"],
    ["symbol-magnifier", "Magnifier"],
    ["symbol-music-note", "Music Note"],
    ["symbol-lightning-bolt", "Lightning Bolt"],
    ["symbol-infinity", "Infinity"],
    ["symbol-puzzle", "Puzzle Piece"],
    ["symbol-stop", "Stop Sign"],
    ["symbol-play", "Play Button"],
    ["symbol-pause", "Pause Button"],
    ["symbol-record", "Record Button"],
].map(([type, label]) =>
    option("symbols", type, label, type !== "symbol-check" && type !== "symbol-x")
);

export const DRAW_SHAPE_OPTIONS: DrawShapeOption[] = [
    ...lineOptions,
    ...basicOptions,
    ...polygonOptions,
    ...starOptions,
    ...arrowOptions,
    ...calloutOptions,
    ...symbolOptions,
];

export function isClosedDrawShape(type: DrawShapeType): boolean {
    return DRAW_SHAPE_OPTIONS.find((shape) => shape.type === type)?.closed ?? true;
}

function polygonPath(points: { x: number; y: number }[]): string {
    return `${points
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
        .join(" ")} Z`;
}

function regularPolygonPath(
    sides: number,
    width: number,
    height: number,
    rotation = -Math.PI / 2
): string {
    return polygonPath(
        Array.from({ length: sides }, (_, index) => {
            const angle = rotation + (index * Math.PI * 2) / sides;
            return {
                x: width / 2 + Math.cos(angle) * width * 0.46,
                y: height / 2 + Math.sin(angle) * height * 0.46,
            };
        })
    );
}

function starPath(
    points: number,
    width: number,
    height: number,
    innerRadius = 0.48
): string {
    return polygonPath(
        Array.from({ length: points * 2 }, (_, index) => {
            const angle = -Math.PI / 2 + (index * Math.PI) / points;
            const radius = index % 2 === 0 ? 0.46 : innerRadius * 0.46;
            return {
                x: width / 2 + Math.cos(angle) * width * radius,
                y: height / 2 + Math.sin(angle) * height * radius,
            };
        })
    );
}

function linePath(type: string, width: number, height: number): string {
    const midX = width / 2;
    const midY = height / 2;
    const paths: Record<string, string> = {
        "line-horizontal": `M 0 ${midY} L ${width} ${midY}`,
        "line-vertical": `M ${midX} 0 L ${midX} ${height}`,
        "line-diagonal-down": `M 0 0 L ${width} ${height}`,
        "line-diagonal-up": `M 0 ${height} L ${width} 0`,
        "line-arrow-right": `M 0 ${midY} L ${width} ${midY} M ${width * 0.78} ${height * 0.25} L ${width} ${midY} L ${width * 0.78} ${height * 0.75}`,
        "line-arrow-left": `M ${width} ${midY} L 0 ${midY} M ${width * 0.22} ${height * 0.25} L 0 ${midY} L ${width * 0.22} ${height * 0.75}`,
        "line-arrow-up": `M ${midX} ${height} L ${midX} 0 M ${width * 0.28} ${height * 0.24} L ${midX} 0 L ${width * 0.72} ${height * 0.24}`,
        "line-arrow-down": `M ${midX} 0 L ${midX} ${height} M ${width * 0.28} ${height * 0.76} L ${midX} ${height} L ${width * 0.72} ${height * 0.76}`,
        "line-arrow-both": `M 0 ${midY} L ${width} ${midY} M ${width * 0.2} ${height * 0.25} L 0 ${midY} L ${width * 0.2} ${height * 0.75} M ${width * 0.8} ${height * 0.25} L ${width} ${midY} L ${width * 0.8} ${height * 0.75}`,
        "line-zigzag": `M 0 ${height * 0.8} L ${width * 0.2} ${height * 0.2} L ${width * 0.4} ${height * 0.8} L ${width * 0.6} ${height * 0.2} L ${width * 0.8} ${height * 0.8} L ${width} ${height * 0.2}`,
        "line-wave": `M 0 ${midY} C ${width * 0.18} 0 ${width * 0.32} 0 ${width * 0.5} ${midY} C ${width * 0.68} ${height} ${width * 0.82} ${height} ${width} ${midY}`,
        "line-curve": `M 0 ${height} Q ${width * 0.55} 0 ${width} ${height * 0.18}`,
        "line-arc": `M ${width * 0.05} ${height * 0.9} A ${width * 0.48} ${height * 0.85} 0 0 1 ${width * 0.95} ${height * 0.9}`,
        "line-elbow": `M 0 ${height} L 0 ${midY} L ${width} ${midY} L ${width} 0`,
        "line-polyline": `M 0 ${height * 0.8} L ${width * 0.25} ${height * 0.2} L ${width * 0.52} ${height * 0.65} L ${width * 0.76} ${height * 0.28} L ${width} ${height * 0.72}`,
        "line-loop": `M 0 ${height * 0.7} C ${width * 0.25} 0 ${width * 0.35} ${height} ${width * 0.55} ${height * 0.4} C ${width * 0.75} 0 ${width * 0.9} ${height} ${width} ${height * 0.25}`,
        "line-scribble": `M 0 ${height * 0.65} Q ${width * 0.15} 0 ${width * 0.3} ${height * 0.55} T ${width * 0.6} ${height * 0.48} T ${width} ${height * 0.4}`,
    };
    return paths[type] ?? `M 0 ${midY} L ${width} ${midY}`;
}

function arrowPath(type: string, width: number, height: number): string {
    if (type === "arrow-left-right") {
        return polygonPath([
            { x: 0, y: height / 2 }, { x: width * 0.2, y: 0 },
            { x: width * 0.2, y: height * 0.28 }, { x: width * 0.8, y: height * 0.28 },
            { x: width * 0.8, y: 0 }, { x: width, y: height / 2 },
            { x: width * 0.8, y: height }, { x: width * 0.8, y: height * 0.72 },
            { x: width * 0.2, y: height * 0.72 }, { x: width * 0.2, y: height },
        ]);
    }
    if (type === "arrow-up-down" || type === "arrow-down-up") {
        return polygonPath([
            { x: width / 2, y: 0 }, { x: width, y: height * 0.22 },
            { x: width * 0.67, y: height * 0.22 }, { x: width * 0.67, y: height * 0.78 },
            { x: width, y: height * 0.78 }, { x: width / 2, y: height },
            { x: 0, y: height * 0.78 }, { x: width * 0.33, y: height * 0.78 },
            { x: width * 0.33, y: height * 0.22 }, { x: 0, y: height * 0.22 },
        ]);
    }
    if (type === "arrow-four-way") {
        return polygonPath([
            { x: width * 0.4, y: 0 }, { x: width * 0.6, y: 0 },
            { x: width * 0.6, y: height * 0.4 }, { x: width, y: height * 0.4 },
            { x: width, y: height * 0.6 }, { x: width * 0.6, y: height * 0.6 },
            { x: width * 0.6, y: height }, { x: width * 0.4, y: height },
            { x: width * 0.4, y: height * 0.6 }, { x: 0, y: height * 0.6 },
            { x: 0, y: height * 0.4 }, { x: width * 0.4, y: height * 0.4 },
        ]);
    }

    const base = [
        { x: 0, y: height * 0.34 },
        { x: width * 0.62, y: height * 0.34 },
        { x: width * 0.62, y: 0 },
        { x: width, y: height / 2 },
        { x: width * 0.62, y: height },
        { x: width * 0.62, y: height * 0.66 },
        { x: 0, y: height * 0.66 },
    ];
    if (type === "arrow-notched") base[0].x = width * 0.12;
    if (type === "arrow-striped") base[1].x = width * 0.48;
    if (type === "arrow-chevron") base[0].y = height * 0.2;
    if (type === "arrow-pentagon") base[3].x = width * 0.88;

    const angles: Record<string, number> = {
        "arrow-right": 0,
        "arrow-left": Math.PI,
        "arrow-up": -Math.PI / 2,
        "arrow-down": Math.PI / 2,
        "arrow-up-right": -Math.PI / 4,
        "arrow-up-left": -3 * Math.PI / 4,
        "arrow-down-right": Math.PI / 4,
        "arrow-down-left": 3 * Math.PI / 4,
        "arrow-notched": 0,
        "arrow-striped": 0,
        "arrow-chevron": 0,
        "arrow-pentagon": 0,
        "arrow-bent-right": 0,
        "arrow-bent-left": Math.PI,
        "arrow-bent-up": -Math.PI / 2,
        "arrow-bent-down": Math.PI / 2,
        "arrow-u-turn": Math.PI,
        "arrow-circular": 0,
    };
    const angle = angles[type] ?? 0;
    const cx = width / 2;
    const cy = height / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const rotated = base.map((point) => {
        const x = point.x - cx;
        const y = point.y - cy;
        return {
            x: cx + x * cos - y * sin,
            y: cy + x * sin + y * cos,
        };
    });

    if (type === "arrow-u-turn") {
        return `M ${width * 0.72} ${height} V ${height * 0.4} Q ${width * 0.72} ${height * 0.18} ${width * 0.5} ${height * 0.18} H ${width * 0.24} M ${width * 0.44} ${height * 0.02} L ${width * 0.24} ${height * 0.18} L ${width * 0.44} ${height * 0.34} M ${width * 0.5} ${height * 0.18} L ${width * 0.66} ${height * 0.02} L ${width * 0.82} ${height * 0.18} L ${width * 0.66} ${height * 0.34} Z`;
    }
    if (type === "arrow-circular") {
        return `M ${width * 0.7} ${height * 0.28} A ${width * 0.34} ${height * 0.34} 0 1 0 ${width * 0.72} ${height * 0.72} L ${width * 0.58} ${height * 0.55} L ${width * 0.98} ${height * 0.53} L ${width * 0.86} ${height * 0.92} Z`;
    }
    return polygonPath(rotated);
}

function calloutPath(type: string, width: number, height: number): string {
    const x1 = width * 0.08;
    const x2 = width * 0.92;
    const y1 = height * 0.08;
    const y2 = height * 0.72;
    const centerX = width / 2;
    const centerY = height / 2;

    if (type === "callout-oval") {
        return `M ${x1} ${centerY} A ${width * 0.42} ${height * 0.36} 0 1 0 ${x2} ${centerY} A ${width * 0.42} ${height * 0.36} 0 1 0 ${x1} ${centerY} Z M ${width * 0.3} ${height * 0.76} L ${width * 0.2} ${height} L ${width * 0.48} ${height * 0.75} Z`;
    }
    if (type === "callout-cloud" || type === "callout-cloud-burst") {
        return `M ${width * 0.2} ${y2} C ${width * 0.02} ${y2} ${width * 0.02} ${height * 0.42} ${width * 0.15} ${height * 0.36} C ${width * 0.08} ${height * 0.16} ${width * 0.3} ${height * 0.07} ${width * 0.4} ${height * 0.2} C ${width * 0.5} 0 ${width * 0.72} ${height * 0.12} ${width * 0.7} ${height * 0.27} C ${width * 0.92} ${height * 0.2} ${width} ${height * 0.42} ${width * 0.85} ${height * 0.54} C ${width * 0.98} ${height * 0.72} ${width * 0.78} ${height * 0.84} ${width * 0.64} ${height * 0.72} L ${width * 0.48} ${height} L ${width * 0.45} ${height * 0.73} C ${width * 0.32} ${height * 0.86} ${width * 0.18} ${height * 0.8} ${width * 0.2} ${y2} Z`;
    }
    if (type === "callout-thought" || type === "callout-thought-small" || type === "callout-thought-large") {
        const bubbleRadius = type === "callout-thought-large" ? 12 : 7;
        return `M ${width * 0.16} ${y2} Q ${x1} ${y2} ${x1} ${height * 0.4} Q ${x1} ${y1} ${width * 0.22} ${y1} H ${width * 0.78} Q ${x2} ${y1} ${x2} ${height * 0.4} V ${height * 0.55} Q ${x2} ${y2} ${width * 0.78} ${y2} H ${width * 0.45} L ${width * 0.34} ${height * 0.88} L ${width * 0.36} ${y2} Z M ${width * 0.32} ${height * 0.94} a ${bubbleRadius} ${bubbleRadius} 0 1 0 ${bubbleRadius * 2} 0 a ${bubbleRadius} ${bubbleRadius} 0 1 0 ${-bubbleRadius * 2} 0 Z M ${width * 0.22} ${height * 0.99} a ${bubbleRadius / 2} ${bubbleRadius / 2} 0 1 0 ${bubbleRadius} 0 a ${bubbleRadius / 2} ${bubbleRadius / 2} 0 1 0 ${-bubbleRadius} 0 Z`;
    }

    if (type === "callout-left") {
        return `M ${width * 0.2} ${height * 0.2} H ${x2} V ${y2} H ${width * 0.2} V ${height * 0.52} L 0 ${height * 0.7} L ${width * 0.2} ${height * 0.38} Z`;
    }
    if (type === "callout-right") {
        return `M ${x1} ${height * 0.2} H ${width * 0.8} V ${height * 0.38} L ${width} ${height * 0.7} L ${width * 0.8} ${height * 0.52} V ${y2} H ${x1} Z`;
    }
    if (type === "callout-top") {
        return `M ${x1} ${height * 0.3} H ${width * 0.38} L ${centerX} 0 L ${width * 0.62} ${height * 0.3} H ${x2} V ${y2} H ${x1} Z`;
    }
    if (type === "callout-bottom" || type === "callout-wedge") {
        return `M ${x1} ${y1} H ${x2} V ${height * 0.7} H ${width * 0.62} L ${centerX} ${height} L ${width * 0.4} ${height * 0.7} H ${x1} Z`;
    }
    if (type === "callout-caption" || type === "callout-label") {
        return `M ${x1} ${y1} H ${x2} V ${height * 0.62} H ${width * 0.63} L ${centerX} ${height} L ${width * 0.37} ${height * 0.62} H ${x1} Z`;
    }
    if (type === "callout-bracket" || type === "callout-brace") {
        return `M ${width * 0.2} ${y1} H ${x2} V ${y2} H ${width * 0.2} L ${width * 0.32} ${height * 0.55} L ${width * 0.2} ${y2} Z`;
    }

    const radius = type === "callout-rounded" ? 20 : 4;
    return `M ${x1 + radius} ${y1} H ${x2 - radius} Q ${x2} ${y1} ${x2} ${y1 + radius} V ${y2 - radius} Q ${x2} ${y2} ${x2 - radius} ${y2} H ${width * 0.44} L ${width * 0.34} ${height} L ${width * 0.36} ${y2} H ${x1 + radius} Q ${x1} ${y2} ${x1} ${y2 - radius} V ${y1 + radius} Q ${x1} ${y1} ${x1 + radius} ${y1} Z`;
}

function symbolPath(type: string, width: number, height: number): string {
    const cx = width / 2;
    if (type === "symbol-heart") {
        return `M ${cx} ${height * 0.9} C ${width * 0.3} ${height * 0.72} 0 ${height * 0.52} 0 ${height * 0.28} C 0 ${height * 0.02} ${width * 0.35} 0 ${cx} ${height * 0.25} C ${width * 0.65} 0 ${width} ${height * 0.02} ${width} ${height * 0.28} C ${width} ${height * 0.52} ${width * 0.7} ${height * 0.72} ${cx} ${height * 0.9} Z`;
    }
    if (type === "symbol-lightning" || type === "symbol-lightning-bolt") {
        return polygonPath([
            { x: width * 0.58, y: 0 }, { x: width * 0.18, y: height * 0.55 },
            { x: width * 0.46, y: height * 0.55 }, { x: width * 0.34, y: height },
            { x: width * 0.84, y: height * 0.38 }, { x: width * 0.58, y: height * 0.38 },
        ]);
    }
    if (type === "symbol-moon") {
        return `M ${width * 0.78} ${height * 0.12} A ${width * 0.42} ${height * 0.42} 0 1 0 ${width * 0.84} ${height * 0.84} A ${width * 0.3} ${height * 0.3} 0 0 1 ${width * 0.78} ${height * 0.12} Z`;
    }
    if (type === "symbol-cloud") {
        return `M ${width * 0.18} ${height * 0.76} C 0 ${height * 0.76} 0 ${height * 0.48} ${width * 0.18} ${height * 0.43} C ${width * 0.18} ${height * 0.12} ${width * 0.5} ${height * 0.08} ${width * 0.62} ${height * 0.33} C ${width * 0.88} ${height * 0.22} ${width} ${height * 0.46} ${width * 0.88} ${height * 0.62} Q ${width * 0.85} ${height * 0.78} ${width * 0.68} ${height * 0.78} Z`;
    }
    if (type === "symbol-droplet" || type === "symbol-teardrop") {
        return `M ${cx} 0 C ${width * 0.35} ${height * 0.35} ${width * 0.08} ${height * 0.62} ${width * 0.18} ${height * 0.82} C ${width * 0.3} ${height * 1.05} ${width * 0.7} ${height * 1.05} ${width * 0.82} ${height * 0.82} C ${width * 0.92} ${height * 0.62} ${width * 0.65} ${height * 0.35} ${cx} 0 Z`;
    }
    if (type === "symbol-smiley" || type === "symbol-sad-face" || type === "symbol-face") {
        const mouthY = type === "symbol-sad-face" ? height * 0.82 : height * 0.78;
        const controlY = type === "symbol-sad-face" ? height * 0.55 : height * 0.98;
        return `M ${cx} ${height * 0.04} A ${width * 0.46} ${height * 0.46} 0 1 0 ${cx} ${height * 0.96} A ${width * 0.46} ${height * 0.46} 0 1 0 ${cx} ${height * 0.04} Z M ${width * 0.3} ${height * 0.38} a 2 2 0 1 0 0.1 0 Z M ${width * 0.68} ${height * 0.38} a 2 2 0 1 0 0.1 0 Z M ${width * 0.28} ${mouthY} Q ${cx} ${controlY} ${width * 0.72} ${mouthY}`;
    }
    if (type === "symbol-ring" || type === "symbol-record") {
        return `M ${cx} ${height * 0.04} A ${width * 0.46} ${height * 0.46} 0 1 0 ${cx} ${height * 0.96} A ${width * 0.46} ${height * 0.46} 0 1 0 ${cx} ${height * 0.04} Z M ${cx} ${height * 0.36} A ${width * 0.14} ${height * 0.14} 0 1 0 ${cx} ${height * 0.64} A ${width * 0.14} ${height * 0.14} 0 1 0 ${cx} ${height * 0.36} Z`;
    }
    if (type === "symbol-plus") {
        return polygonPath([
            { x: width * 0.4, y: 0 }, { x: width * 0.6, y: 0 },
            { x: width * 0.6, y: height * 0.4 }, { x: width, y: height * 0.4 },
            { x: width, y: height * 0.6 }, { x: width * 0.6, y: height * 0.6 },
            { x: width * 0.6, y: height }, { x: width * 0.4, y: height },
            { x: width * 0.4, y: height * 0.6 }, { x: 0, y: height * 0.6 },
            { x: 0, y: height * 0.4 }, { x: width * 0.4, y: height * 0.4 },
        ]);
    }
    if (type === "symbol-x") {
        return `M ${width * 0.15} ${height * 0.15} L ${width * 0.85} ${height * 0.85} M ${width * 0.85} ${height * 0.15} L ${width * 0.15} ${height * 0.85}`;
    }
    if (type === "symbol-check") {
        return `M ${width * 0.08} ${height * 0.56} L ${width * 0.38} ${height * 0.86} L ${width * 0.94} ${height * 0.14}`;
    }
    if (type === "symbol-flag") {
        return `M ${width * 0.25} ${height} V 0 H ${width * 0.82} L ${width * 0.67} ${height * 0.2} L ${width * 0.82} ${height * 0.4} H ${width * 0.25}`;
    }
    if (type === "symbol-home") {
        return polygonPath([
            { x: width * 0.05, y: height * 0.48 }, { x: cx, y: height * 0.06 },
            { x: width * 0.95, y: height * 0.48 }, { x: width * 0.82, y: height * 0.48 },
            { x: width * 0.82, y: height * 0.94 }, { x: width * 0.56, y: height * 0.94 },
            { x: width * 0.56, y: height * 0.66 }, { x: width * 0.4, y: height * 0.66 },
            { x: width * 0.4, y: height * 0.94 }, { x: width * 0.18, y: height * 0.94 },
            { x: width * 0.18, y: height * 0.48 },
        ]);
    }
    if (type === "symbol-shield") {
        return polygonPath([
            { x: width * 0.1, y: height * 0.08 }, { x: width * 0.9, y: height * 0.08 },
            { x: width * 0.84, y: height * 0.58 }, { x: cx, y: height * 0.96 },
            { x: width * 0.16, y: height * 0.58 },
        ]);
    }
    if (type === "symbol-leaf") {
        return `M ${width * 0.12} ${height * 0.86} C ${width * 0.18} ${height * 0.14} ${width * 0.62} 0 ${width * 0.92} ${height * 0.08} C ${width * 0.94} ${height * 0.62} ${width * 0.66} ${height * 0.95} ${width * 0.12} ${height * 0.86} Z M ${width * 0.16} ${height * 0.82} Q ${width * 0.45} ${height * 0.52} ${width * 0.82} ${height * 0.18}`;
    }
    if (type === "symbol-magnifier") {
        return `M ${width * 0.1} ${height * 0.43} A ${width * 0.32} ${height * 0.32} 0 1 0 ${width * 0.74} ${height * 0.43} A ${width * 0.32} ${height * 0.32} 0 1 0 ${width * 0.1} ${height * 0.43} Z M ${width * 0.67} ${height * 0.68} L ${width * 0.96} ${height * 0.96}`;
    }
    if (type === "symbol-music-note") {
        return `M ${width * 0.6} ${height * 0.12} V ${height * 0.68} A ${width * 0.18} ${height * 0.13} 0 1 1 ${width * 0.43} ${height * 0.56} V ${height * 0.2} L ${width * 0.9} ${height * 0.08} V ${height * 0.18} Z`;
    }
    if (type === "symbol-infinity") {
        return `M ${width * 0.5} ${height * 0.5} C ${width * 0.25} ${height * 0.08} ${width * 0.05} ${height * 0.18} ${width * 0.05} ${height * 0.5} C ${width * 0.05} ${height * 0.82} ${width * 0.28} ${height * 0.9} ${width * 0.5} ${height * 0.5} C ${width * 0.72} ${height * 0.1} ${width * 0.95} ${height * 0.18} ${width * 0.95} ${height * 0.5} C ${width * 0.95} ${height * 0.82} ${width * 0.75} ${height * 0.92} ${width * 0.5} ${height * 0.5}`;
    }
    if (type === "symbol-puzzle") {
        return `M ${width * 0.1} ${height * 0.1} H ${width * 0.4} C ${width * 0.36} ${height * 0.35} ${width * 0.62} ${height * 0.35} ${width * 0.58} ${height * 0.1} H ${width * 0.9} V ${height * 0.42} C ${width * 0.65} ${height * 0.38} ${width * 0.65} ${height * 0.64} ${width * 0.9} ${height * 0.6} V ${height * 0.9} H ${width * 0.1} Z`;
    }
    if (type === "symbol-stop") return regularPolygonPath(8, width, height, Math.PI / 8);
    if (type === "symbol-play") {
        return polygonPath([
            { x: width * 0.22, y: height * 0.08 },
            { x: width * 0.86, y: height / 2 },
            { x: width * 0.22, y: height * 0.92 },
        ]);
    }
    if (type === "symbol-pause") {
        return `M ${width * 0.2} ${height * 0.1} H ${width * 0.42} V ${height * 0.9} H ${width * 0.2} Z M ${width * 0.58} ${height * 0.1} H ${width * 0.8} V ${height * 0.9} H ${width * 0.58} Z`;
    }

    return regularPolygonPath(6, width, height);
}

export function createDrawShapePath(
    shape: DrawShapeType,
    width: number,
    height: number
): string {
    if (shape.startsWith("line-")) return linePath(shape, width, height);

    if (shape.startsWith("polygon-")) {
        const sides = Number(shape.slice("polygon-".length));
        return regularPolygonPath(Math.max(3, sides || 3), width, height);
    }
    if (shape.startsWith("star-")) {
        const points = Number(shape.slice("star-".length));
        return starPath(Math.max(3, points || 5), width, height);
    }
    if (shape.startsWith("burst-")) {
        const points = Number(shape.slice("burst-".length));
        return starPath(Math.max(4, points || 8), width, height, 0.78);
    }
    if (shape.startsWith("gear-")) {
        const teeth = Number(shape.slice("gear-".length));
        return starPath(Math.max(5, teeth || 8), width, height, 0.86);
    }
    if (shape.startsWith("arrow-")) return arrowPath(shape, width, height);
    if (shape.startsWith("callout-")) return calloutPath(shape, width, height);
    if (shape.startsWith("symbol-")) return symbolPath(shape, width, height);

    switch (shape) {
        case "rectangle":
            return `M 0 0 H ${width} V ${height} H 0 Z`;
        case "rounded-rectangle": {
            const radius = Math.min(18, width / 5, height / 5);
            return `M ${radius} 0 H ${width - radius} Q ${width} 0 ${width} ${radius} V ${height - radius} Q ${width} ${height} ${width - radius} ${height} H ${radius} Q 0 ${height} 0 ${height - radius} V ${radius} Q 0 0 ${radius} 0 Z`;
        }
        case "square":
        case "circle": {
            const diameter = Math.min(width, height);
            const radius = diameter / 2;
            const cx = width / 2;
            const cy = height / 2;
            return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 0 ${cx + radius} ${cy} A ${radius} ${radius} 0 1 0 ${cx - radius} ${cy} Z`;
        }
        case "ellipse":
        case "oval":
            return `M 0 ${height / 2} A ${width / 2} ${height / 2} 0 1 0 ${width} ${height / 2} A ${width / 2} ${height / 2} 0 1 0 0 ${height / 2} Z`;
        case "triangle":
            return polygonPath([{ x: width / 2, y: 0 }, { x: width, y: height }, { x: 0, y: height }]);
        case "right-triangle":
            return polygonPath([{ x: 0, y: 0 }, { x: width, y: height }, { x: 0, y: height }]);
        case "inverted-triangle":
            return polygonPath([{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width / 2, y: height }]);
        case "diamond":
            return polygonPath([{ x: width / 2, y: 0 }, { x: width, y: height / 2 }, { x: width / 2, y: height }, { x: 0, y: height / 2 }]);
        case "parallelogram":
            return polygonPath([{ x: width * 0.25, y: 0 }, { x: width, y: 0 }, { x: width * 0.75, y: height }, { x: 0, y: height }]);
        case "trapezoid":
        case "rounded-trapezoid":
            return polygonPath([{ x: width * 0.2, y: 0 }, { x: width * 0.8, y: 0 }, { x: width, y: height }, { x: 0, y: height }]);
        case "capsule": {
            const radius = height / 2;
            return `M ${radius} 0 H ${width - radius} A ${radius} ${radius} 0 0 1 ${width - radius} ${height} H ${radius} A ${radius} ${radius} 0 0 1 ${radius} 0 Z`;
        }
        case "bevelled-rectangle":
            return polygonPath([{ x: width * 0.12, y: 0 }, { x: width * 0.88, y: 0 }, { x: width, y: height * 0.18 }, { x: width, y: height * 0.82 }, { x: width * 0.88, y: height }, { x: width * 0.12, y: height }, { x: 0, y: height * 0.82 }, { x: 0, y: height * 0.18 }]);
        case "cross":
            return polygonPath([{ x: width * 0.35, y: 0 }, { x: width * 0.65, y: 0 }, { x: width * 0.65, y: height * 0.35 }, { x: width, y: height * 0.35 }, { x: width, y: height * 0.65 }, { x: width * 0.65, y: height * 0.65 }, { x: width * 0.65, y: height }, { x: width * 0.35, y: height }, { x: width * 0.35, y: height * 0.65 }, { x: 0, y: height * 0.65 }, { x: 0, y: height * 0.35 }, { x: width * 0.35, y: height * 0.35 }]);
        case "cylinder":
            return `M 0 ${height * 0.16} C 0 0 ${width} 0 ${width} ${height * 0.16} V ${height * 0.84} C ${width} ${height} 0 ${height} 0 ${height * 0.84} Z M 0 ${height * 0.16} C 0 ${height * 0.38} ${width} ${height * 0.38} ${width} ${height * 0.16}`;
        case "pentagon":
            return regularPolygonPath(5, width, height);
        case "hexagon":
            return regularPolygonPath(6, width, height, 0);
        case "heptagon":
            return regularPolygonPath(7, width, height);
        case "octagon":
            return regularPolygonPath(8, width, height, Math.PI / 8);
        case "nonagon":
            return regularPolygonPath(9, width, height);
        case "decagon":
            return regularPolygonPath(10, width, height, Math.PI / 10);
        case "dodecagon":
            return regularPolygonPath(12, width, height, Math.PI / 12);
        default:
            return `M 0 0 H ${width} V ${height} H 0 Z`;
    }
}