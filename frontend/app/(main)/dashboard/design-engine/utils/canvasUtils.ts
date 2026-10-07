import type {
    CanvasElement,
    TextElement,
    TableElement,
    ClockElement,
} from "../types/elements";
import type { TimelineElement } from "../types/timeline";
import type { CardElement } from "../types/card";

export function pointsToSvgPath(
    points: { x: number; y: number }[]
): string {
    if (!points || points.length === 0) return "";

    if (points.length === 1) {
        return `M ${points[0].x} ${points[0].y} L ${points[0].x + 0.1} ${points[0].y + 0.1}`;
    }

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        d += ` Q ${p1.x} ${p1.y}, ${midX} ${midY}`;
    }

    const last = points[points.length - 1];
    d += ` L ${last.x} ${last.y}`;

    return d;
}

export function canvasPointsToElementLocal(
    pts: { x: number; y: number }[],
    el: {
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
        size?: number;
    },
    origin: "center" | "top-left" = "center"
): { x: number; y: number }[] {
    const scale = (el.size ?? 100) / 100 || 1;
    const rad = (-el.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    if (origin === "top-left") {
        return pts.map((p) => {
            const relX = p.x - el.x;
            const relY = p.y - el.y;
            const unrotX = (relX * cos - relY * sin) / scale;
            const unrotY = (relX * sin + relY * cos) / scale;
            return {
                x: Math.round(unrotX),
                y: Math.round(unrotY),
            };
        });
    }

    const centerX = el.width / 2;
    const centerY = el.height / 2;

    return pts.map((p) => {
        const relX = p.x - el.x;
        const relY = p.y - el.y;
        const dx = (relX - centerX) / scale;
        const dy = (relY - centerY) / scale;
        const unrotX = dx * cos - dy * sin;
        const unrotY = dx * sin + dy * cos;
        return {
            x: Math.round(unrotX + centerX),
            y: Math.round(unrotY + centerY),
        };
    });
}

export function doesStrokeIntersectElement(
    localPoints: { x: number; y: number }[],
    width: number,
    height: number,
    eraserRadiusLocal: number
): boolean {
    const pad = eraserRadiusLocal + 12;
    return localPoints.some(
        (p) =>
            p.x >= -pad &&
            p.x <= width + pad &&
            p.y >= -pad &&
            p.y <= height + pad
    );
}

export function getElementDimensions(el: CanvasElement): {
    width: number;
    height: number;
    scale: number;
    origin: "center" | "top-left";
} {
    if (el.type === "draw") {
        return {
            width: el.width,
            height: el.height,
            scale: (el.size ?? 100) / 100 || 1,
            origin: "center",
        };
    }

    if (el.type === "text") {
        const textEl = el as TextElement;
        return {
            width: Math.max(80, textEl.text.length * textEl.fontSize * 0.7 + 20),
            height: Math.max(40, textEl.fontSize * 1.5 + 10),
            scale: 1,
            origin: "center",
        };
    }

    if (el.type === "table") {
        const tbl = el as TableElement;
        return {
            width: Math.max(160, tbl.cols * 120),
            height: Math.max(
                80,
                (tbl.rows + (tbl.hasHeader ? 1 : 0)) *
                    (tbl.fontSize * 1.5 + tbl.cellPadding * 2 + 4)
            ),
            scale: (tbl.size ?? 100) / 100 || 1,
            origin: "center",
        };
    }

    if (el.type === "clock") {
        const clk = el as ClockElement;
        return {
            width: 300,
            height: 190,
            scale: (clk.size ?? 100) / 100 || 1,
            origin: "center",
        };
    }

    if (el.type === "timeline") {
        const tl = el as TimelineElement;
        const tlCardW = tl.cardWidth ?? 480;
        const tlCardMH = tl.cardMinHeight ?? 60;
        const width =
            tl.theme === "horizontal-stepper"
                ? Math.max(
                      tlCardW + 60,
                      tl.items.length *
                          (Math.min(tlCardW, 260) + (tl.spacing + 16)) +
                          40
                  )
                : tlCardW + (tl.nodeSize ?? 32) + 32;
        const height =
            tl.theme === "horizontal-stepper"
                ? tlCardMH + (tl.nodeSize ?? 32) + 80
                : Math.max(
                      220,
                      tl.items.length *
                          ((tl.spacing ?? 24) +
                              tlCardMH +
                              (tl.nodeSize ?? 32) * 0.5) +
                          40
                  );
        return {
            width,
            height,
            scale: (tl.size ?? 100) / 100 || 1,
            origin: "top-left",
        };
    }

    if (el.type === "card") {
        const card = el as CardElement;
        return {
            width: card.cardWidth ?? 320,
            height: card.cardMinHeight ?? 220,
            scale: (card.size ?? 100) / 100 || 1,
            origin: "top-left",
        };
    }

    return {
        width: 100,
        height: 100,
        scale: 1,
        origin: "center",
    };
}
