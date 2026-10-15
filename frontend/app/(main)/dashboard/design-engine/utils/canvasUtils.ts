import type {
    CanvasElement,
    DrawElement,
    TextElement,
    TableElement,
    ClockElement,
} from "../types/elements";
import type { TimelineElement } from "../types/timeline";
import type { CardElement } from "../types/card";
import type { ButtonElement } from "../types/button";
import type { IconElement } from "../types/icon-types";
import type { ImageElement } from "../types/image";
import type { FormElement } from "../types/form";
import type { GridElement } from "../types/grid";
import type { ProgressElement } from "../types/progress";
import type { NavigationElement } from "../types/navigation";

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

function getDrawElementToCanvasMatrix(element: DrawElement): DOMMatrix {
    const pathWidth = element.pathWidth ?? element.width;
    const pathHeight = element.pathHeight ?? element.height;
    return new DOMMatrix()
        .translate(element.x + element.width / 2, element.y + element.height / 2)
        .rotate(element.rotation)
        .scale((element.size ?? 100) / 100 || 1)
        .translate(-element.width / 2, -element.height / 2)
        .scale(element.width / pathWidth, element.height / pathHeight);
}

export function createDrawFillLayer(
    element: DrawElement,
    seed: { x: number; y: number },
    color: string,
    boundaryElements: DrawElement[] = [element]
): { dataUrl: string; reachesBounds: boolean } | null {
    const width = Math.max(1, Math.ceil(element.pathWidth ?? element.width));
    const height = Math.max(1, Math.ceil(element.pathHeight ?? element.height));
    const pixelCount = width * height;
    const colorMatch = color.match(/^#([0-9a-f]{6})$/i);
    if (!colorMatch || pixelCount > 4_000_000) return null;

    const boundaryCanvas = document.createElement("canvas");
    boundaryCanvas.width = width;
    boundaryCanvas.height = height;
    const boundaryContext = boundaryCanvas.getContext("2d");
    if (!boundaryContext) return null;

    const outlineCanvas = document.createElement("canvas");
    outlineCanvas.width = width;
    outlineCanvas.height = height;
    const outlineContext = outlineCanvas.getContext("2d");
    if (!outlineContext) return null;

    try {
        const canvasToTarget = getDrawElementToCanvasMatrix(element).inverse();

        for (const boundaryElement of boundaryElements) {
            const path = new Path2D(boundaryElement.pathData);
            outlineContext.setTransform(1, 0, 0, 1, 0, 0);
            outlineContext.clearRect(0, 0, width, height);
            outlineContext.setTransform(
                canvasToTarget.multiply(
                    getDrawElementToCanvasMatrix(boundaryElement)
                )
            );
            outlineContext.globalCompositeOperation = "source-over";
            outlineContext.globalAlpha = boundaryElement.opacity;
            outlineContext.strokeStyle = boundaryElement.color;
            outlineContext.lineWidth =
                boundaryElement.strokeWidth +
                (boundaryElement.id === element.id
                    ? 0
                    : Math.max(2, element.strokeWidth / 2));
            outlineContext.lineCap = "round";
            outlineContext.lineJoin = "round";
            outlineContext.stroke(path);

            for (const eraserPath of boundaryElement.eraserPaths ?? []) {
                outlineContext.globalCompositeOperation = "destination-out";
                outlineContext.globalAlpha = eraserPath.opacity;
                outlineContext.lineWidth = eraserPath.strokeWidth;
                outlineContext.stroke(new Path2D(eraserPath.d));
            }

            outlineContext.setTransform(1, 0, 0, 1, 0, 0);
            boundaryContext.drawImage(outlineCanvas, 0, 0);
        }
    } catch {
        return null;
    }

    const boundaryPixels = boundaryContext.getImageData(0, 0, width, height);
    const startX = Math.floor(seed.x);
    const startY = Math.floor(seed.y);
    if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
        return null;
    }

    const outsideVisited = new Uint8Array(pixelCount);
    const outsideStack = new Int32Array(pixelCount);
    let outsideStackSize = 0;
    const enqueueOutside = (index: number) => {
        if (
            !outsideVisited[index] &&
            boundaryPixels.data[index * 4 + 3] <= 8
        ) {
            outsideVisited[index] = 1;
            outsideStack[outsideStackSize++] = index;
        }
    };

    for (let x = 0; x < width; x++) {
        enqueueOutside(x);
        enqueueOutside((height - 1) * width + x);
    }
    for (let y = 1; y < height - 1; y++) {
        enqueueOutside(y * width);
        enqueueOutside(y * width + width - 1);
    }

    while (outsideStackSize > 0) {
        const index = outsideStack[--outsideStackSize];
        const x = index % width;
        if (x > 0) enqueueOutside(index - 1);
        if (x < width - 1) enqueueOutside(index + 1);
        if (index >= width) enqueueOutside(index - width);
        if (index < pixelCount - width) enqueueOutside(index + width);
    }

    let hasEnclosedArea = false;
    for (let index = 0; index < pixelCount; index++) {
        if (!outsideVisited[index] && boundaryPixels.data[index * 4 + 3] <= 8) {
            hasEnclosedArea = true;
            break;
        }
    }

    const startIndex = startY * width + startX;
    if (hasEnclosedArea && outsideVisited[startIndex]) return null;

    const fillCanvas = document.createElement("canvas");
    fillCanvas.width = width;
    fillCanvas.height = height;
    const fillContext = fillCanvas.getContext("2d");
    if (!fillContext) return null;

    const fillPixels = fillContext.createImageData(width, height);
    const colorValue = Number.parseInt(colorMatch[1], 16);
    const red = (colorValue >> 16) & 255;
    const green = (colorValue >> 8) & 255;
    const blue = colorValue & 255;
    const visited = new Uint8Array(pixelCount);
    const stack = new Int32Array(pixelCount);
    let stackSize = 1;
    let filledPixels = 0;
    let reachesBounds = false;
    stack[0] = startIndex;
    visited[startIndex] = 1;

    while (stackSize > 0) {
        const index = stack[--stackSize];
        const offset = index * 4;

        if (boundaryPixels.data[offset + 3] > 8) continue;

        const x = index % width;
        const y = Math.floor(index / width);
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
            reachesBounds = true;
        }
        fillPixels.data[offset] = red;
        fillPixels.data[offset + 1] = green;
        fillPixels.data[offset + 2] = blue;
        fillPixels.data[offset + 3] = 255;
        filledPixels++;

        if (x > 0 && !visited[index - 1]) {
            visited[index - 1] = 1;
            stack[stackSize++] = index - 1;
        }
        if (x < width - 1 && !visited[index + 1]) {
            visited[index + 1] = 1;
            stack[stackSize++] = index + 1;
        }
        if (index >= width && !visited[index - width]) {
            visited[index - width] = 1;
            stack[stackSize++] = index - width;
        }
        if (index < pixelCount - width && !visited[index + width]) {
            visited[index + width] = 1;
            stack[stackSize++] = index + width;
        }
    }

    if (!filledPixels) return null;
    fillContext.putImageData(fillPixels, 0, 0);
    return { dataUrl: fillCanvas.toDataURL("image/png"), reachesBounds };
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

export function canvasPointsToDrawLocal(
    points: { x: number; y: number }[],
    element: DrawElement
): { x: number; y: number }[] {
    const localPoints = canvasPointsToElementLocal(points, {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotation: element.rotation,
        size: element.size,
    });

    const widthScale = (element.pathWidth ?? element.width) / element.width;
    const heightScale = (element.pathHeight ?? element.height) / element.height;

    return localPoints.map((point) => ({
        x: point.x * widthScale,
        y: point.y * heightScale,
    }));
}

export function getElementDimensions(
    el: CanvasElement,
    canvasSize?: { width: number; height: number }
): {
    width: number;
    height: number;
    scale: number;
    origin: "center" | "top-left";
} {
        if (el.type === "form") {
            const form = el as FormElement;
            return {
                width: form.widthUnit === "%"
                    ? ((canvasSize?.width ?? 1200) * form.width) / 100
                    : form.width,
                height: form.heightUnit === "%"
                    ? ((canvasSize?.height ?? 1120) * form.height) / 100
                    : form.height,
                scale: (form.size ?? 100) / 100 || 1,
                origin: "top-left",
            };
        }

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

    if (el.type === "button") {
        const btn = el as ButtonElement;
        if (btn.drawnShape?.hasDrawnShape && btn.drawnShape.width) {
            return {
                width: btn.drawnShape.width,
                height: btn.drawnShape.height,
                scale: (btn.size ?? 100) / 100 || 1,
                origin: "top-left",
            };
        }
        if (btn.theme === "button-1" || btn.theme === "gamepad-3d") {
            return {
                width: 200,
                height: 200,
                scale: (btn.size ?? 100) / 100 || 1,
                origin: "top-left",
            };
        }
        if (btn.theme === "button-7" || btn.theme === "jelly-pill") {
            return {
                width: 160,
                height: 60,
                scale: (btn.size ?? 100) / 100 || 1,
                origin: "top-left",
            };
        }
        const textLen = (btn.text || "Button").length;
        const estTextW = textLen * btn.fontSize * 0.7;
        const width = Math.max(120, Math.round(estTextW + btn.paddingX * 2 + 30));
        const height = Math.max(42, Math.round(btn.fontSize * 1.5 + btn.paddingY * 2));
        return {
            width,
            height,
            scale: (btn.size ?? 100) / 100 || 1,
            origin: "top-left",
        };
    }

    if (el.type === "navigation") {
        const navigation = el as NavigationElement;
        return {
            width: navigation.widthUnit === "%"
                ? ((canvasSize?.width ?? 1200) * (navigation.width ?? 520)) / 100
                : navigation.width ?? 520,
            height: navigation.heightUnit === "%"
                ? ((canvasSize?.height ?? 1120) * (navigation.height ?? 78)) / 100
                : navigation.height ?? 78,
            scale: (navigation.size ?? 100) / 100 || 1,
            origin: "top-left",
        };
    }

    if (el.type === "icon") {
        const icon = el as IconElement;
        const width =
            icon.widthUnit === "%"
                ? Math.max(20, Math.round(((icon.width ?? 64) / 100) * 100))
                : (icon.width ?? 64);
        const height =
            icon.heightUnit === "%"
                ? Math.max(20, Math.round(((icon.height ?? 64) / 100) * 100))
                : (icon.height ?? 64);
        return {
            width,
            height,
            scale: (icon.size ?? 100) / 100 || 1,
            origin: "top-left",
        };
    }

    if (el.type === "image") {
        const img = el as ImageElement;
        const width =
            img.widthUnit === "%"
                ? Math.max(20, Math.round(((img.width ?? 140) / 100) * 140))
                : (img.width ?? 140);
        const height =
            img.heightUnit === "%"
                ? Math.max(20, Math.round(((img.height ?? 140) / 100) * 140))
                : (img.height ?? 140);
        return {
            width,
            height,
            scale: (img.size ?? 100) / 100 || 1,
            origin: "top-left",
        };
    }

    if (el.type === "grid") {
        const grid = el as GridElement;
        const width =
            grid.widthUnit === "%"
                ? Math.max(40, Math.round(((grid.width ?? 380) / 100) * (canvasSize?.width ?? 1200)))
                : (grid.width ?? 380);
        const height =
            grid.heightUnit === "%"
                ? Math.max(40, Math.round(((grid.height ?? 440) / 100) * (canvasSize?.height ?? 1120)))
                : (grid.height ?? 440);
        return {
            width,
            height,
            scale: (grid.size ?? 100) / 100 || 1,
            origin: "top-left",
        };
    }

    if (el.type === "progress") {
        const progress = el as ProgressElement;
        const width =
            progress.widthUnit === "%"
                ? Math.max(40, Math.round(((progress.width ?? 580) / 100) * (canvasSize?.width ?? 1200)))
                : (progress.width ?? 580);
        const height =
            progress.heightUnit === "%"
                ? Math.max(40, Math.round(((progress.height ?? 250) / 100) * (canvasSize?.height ?? 1120)))
                : (progress.height ?? 250);
        return {
            width,
            height,
            scale: (progress.size ?? 100) / 100 || 1,
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
