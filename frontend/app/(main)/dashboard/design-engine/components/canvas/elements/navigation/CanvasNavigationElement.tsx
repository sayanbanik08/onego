import { X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { NavigationElement } from "../../../../types/navigation";
import type { CanvasElement } from "../../../../types/elements";
import { getElementShadow } from "../image/imageHelpers";
import styles from "./NavigationMenu.module.css";

type CanvasNavigationElementProps = {
    element: NavigationElement;
    isSelected: boolean;
    isEraserMode: boolean;
    handlePointerDown: (
        event: ReactPointerEvent,
        element: CanvasElement
    ) => void;
    deleteElement: (id: string) => void;
    onNavigateCanvas: (canvasId: string) => void;
};

export function CanvasNavigationElement({
    element,
    isSelected,
    isEraserMode,
    handlePointerDown,
    deleteElement,
    onNavigateCanvas,
}: CanvasNavigationElementProps) {
    const scale = (element.size ?? 100) / 100;
    const hasEraserMask = Boolean(element.eraserPaths?.length);
    const width = element.widthUnit === "%"
        ? `${element.width ?? 520}%`
        : `${element.width ?? 520}px`;
    const height = element.heightUnit === "%"
        ? `${element.height ?? 78}%`
        : `${element.height ?? 78}px`;

    return (
        <nav
            data-element-id={element.id}
            onPointerDown={(event) => handlePointerDown(event, element)}
            aria-label="Canvas navigation preview"
            className={`${styles.menu} absolute select-none ${
                isEraserMode
                    ? "pointer-events-none cursor-none"
                    : isSelected
                    ? "cursor-move outline outline-2 outline-blue-500"
                    : "cursor-move"
            }`}
            style={{
                left: element.x,
                top: element.y,
                width,
                height,
                transform: `rotate(${element.rotation}deg) scale(${scale})`,
                transformOrigin: "top left",
                opacity: element.opacity,
                boxShadow: getElementShadow(element),
                color: element.textColor,
                "--menu-background": element.backgroundColor,
                mask: hasEraserMask ? `url(#eraser-mask-${element.id})` : undefined,
                WebkitMask: hasEraserMask
                    ? `url(#eraser-mask-${element.id})`
                    : undefined,
            } as React.CSSProperties}
        >
            {hasEraserMask && (
                <svg className="pointer-events-none absolute inset-0 h-full w-full">
                    <defs>
                        <mask id={`eraser-mask-${element.id}`} maskUnits="userSpaceOnUse">
                            <rect x="-5000" y="-5000" width="10000" height="10000" fill="white" />
                            {element.eraserPaths?.map((path, index) => (
                                <path
                                    key={index}
                                    d={path.d}
                                    stroke="black"
                                    strokeWidth={path.strokeWidth}
                                    strokeOpacity={path.opacity}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                />
                            ))}
                        </mask>
                    </defs>
                </svg>
            )}
            <div className={styles.items}>
                {element.links.map((link, index) => {
                    return (
                        <a
                            key={link.id}
                            href={link.canvasId
                                ? `/dashboard/design-engine/${encodeURIComponent(link.canvasId)}`
                                : link.href || "#"}
                            target={link.canvasId ? undefined : "_blank"}
                            rel={link.canvasId ? undefined : "noreferrer"}
                            onClick={(event) => {
                                event.stopPropagation();
                                if (link.canvasId) {
                                    event.preventDefault();
                                    onNavigateCanvas(link.canvasId);
                                }
                            }}
                            aria-current={index === 0 ? "page" : undefined}
                            className={`${styles.link} ${index === 0 ? styles.active : ""}`}
                            style={index === 0 ? { color: element.accentColor } : undefined}
                        >
                            <span
                                className={styles.iconPlaceholder}
                                title="Icon placeholder"
                                aria-label="Icon placeholder"
                            />
                            <span className={styles.label}>{link.label}</span>
                        </a>
                    );
                })}
            </div>
            {isSelected && !isEraserMode && (
                <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => deleteElement(element.id)}
                    className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                    title="Delete element"
                >
                    <X size={13} />
                </button>
            )}
        </nav>
    );
}