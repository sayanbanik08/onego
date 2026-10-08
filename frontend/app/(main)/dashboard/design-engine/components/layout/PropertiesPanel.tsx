import { MoreVertical, PanelRightOpen } from "lucide-react";
import type {
    Dispatch,
    SetStateAction,
    PointerEvent as ReactPointerEvent,
} from "react";
import { useRef } from "react";
import type { TimelineElement } from "../../types/timeline";
import TimelineProperties from "../properties/timeline/TimelineProperties";
import type { CardElement } from "../../types/card";
import CardProperties from "../properties/card/CardProperties";
import type { ButtonElement } from "../../types/button";
import ButtonProperties from "../properties/button/ButtonProperties";
import type {
    CanvasElement,
    TextElement,
    DrawElement,
    TableElement,
    ClockElement,
    PencilSettings,
    EraserSettings,
    DashboardBackgroundSettings,
} from "../../types/elements";

// ── Sub-panel imports ─────────────────────────────────────────────────────────
import EraserProperties from "../properties/eraser/EraserProperties";
import PencilProperties from "../properties/draw/PencilProperties";
import DrawProperties from "../properties/draw/DrawProperties";
import TextProperties from "../properties/text/TextProperties";
import TableProperties from "../properties/table/TableProperties";
import ClockProperties from "../properties/clock/ClockProperties";
import BackgroundProperties from "../properties/background/BackgroundProperties";

// ── Prop types ────────────────────────────────────────────────────────────────

type PropertiesPanelProps = {
    isMenuOpen: boolean;
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
    isPropertiesMinimised: boolean;
    setIsPropertiesMinimised: Dispatch<SetStateAction<boolean>>;
    isPropertiesFloating: boolean;
    setIsPropertiesFloating: Dispatch<SetStateAction<boolean>>;
    floatingPosition: { x: number; y: number };
    setFloatingPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;

    selectedElement: CanvasElement | null;
    updateElement: (id: string, updates: Partial<CanvasElement>) => void;

    isDrawMode: boolean;
    pencilSettings: PencilSettings;
    updatePencilSettings: (updates: Partial<PencilSettings>) => void;
    elementsCount?: number;
    isEraserMode?: boolean;
    eraserSettings?: EraserSettings;
    updateEraserSettings?: (updates: Partial<EraserSettings>) => void;
    isBackgroundMode?: boolean;
    backgroundSettings?: DashboardBackgroundSettings;
    updateBackgroundSettings?: (updates: Partial<DashboardBackgroundSettings>) => void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function PropertiesPanel({
    isMenuOpen,
    setIsMenuOpen,
    isPropertiesMinimised,
    setIsPropertiesMinimised,
    isPropertiesFloating,
    setIsPropertiesFloating,
    floatingPosition,
    setFloatingPosition,
    selectedElement,
    updateElement,
    isDrawMode,
    pencilSettings,
    updatePencilSettings,
    elementsCount = 0,
    isEraserMode = false,
    eraserSettings = { size: 30, opacity: 1 },
    updateEraserSettings = () => {},
    isBackgroundMode = false,
    backgroundSettings,
    updateBackgroundSettings = () => {},
}: PropertiesPanelProps) {
    const panelRef = useRef<HTMLElement | null>(null);

    // ── Float / Dock helpers ──────────────────────────────────────────────────

    const handleFloat = () => {
        if (!panelRef.current) return;
        const rect = panelRef.current.getBoundingClientRect();
        setFloatingPosition({ x: rect.left, y: rect.top });
        setIsPropertiesFloating(true);
        setIsMenuOpen(false);
    };

    const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!isPropertiesFloating) return;

        const startX = event.clientX;
        const startY = event.clientY;
        const initialX = floatingPosition.x;
        const initialY = floatingPosition.y;

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const panelWidth = 288;
            const panelHeight = 500;
            const newX = Math.min(Math.max(0, initialX + moveEvent.clientX - startX), window.innerWidth - panelWidth);
            const newY = Math.min(Math.max(64, initialY + moveEvent.clientY - startY), window.innerHeight - panelHeight);
            setFloatingPosition({ x: newX, y: newY });
        };

        const handlePointerUp = () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
    };

    // ── Content dispatch ──────────────────────────────────────────────────────

    const propertiesContent = (() => {
        if (isBackgroundMode) {
            return (
                <BackgroundProperties
                    backgroundSettings={backgroundSettings}
                    updateBackgroundSettings={updateBackgroundSettings}
                />
            );
        }

        if (isEraserMode && !selectedElement) {
            return (
                <EraserProperties
                    eraserSettings={eraserSettings}
                    updateEraserSettings={updateEraserSettings}
                />
            );
        }

        if (isDrawMode && !selectedElement) {
            return (
                <PencilProperties
                    elementsCount={elementsCount}
                    pencilSettings={pencilSettings}
                    updatePencilSettings={updatePencilSettings}
                />
            );
        }

        if (selectedElement?.type === "draw") {
            return (
                <DrawProperties
                    element={selectedElement as DrawElement}
                    updateElement={updateElement as (id: string, u: Partial<DrawElement>) => void}
                    updatePencilSettings={updatePencilSettings}
                />
            );
        }

        if (selectedElement?.type === "table") {
            return (
                <TableProperties
                    element={selectedElement as TableElement}
                    updateElement={updateElement as (id: string, u: Partial<TableElement>) => void}
                />
            );
        }

        if (selectedElement?.type === "clock") {
            return (
                <ClockProperties
                    element={selectedElement as ClockElement}
                    updateElement={updateElement as (id: string, u: Partial<ClockElement>) => void}
                />
            );
        }

        if (selectedElement?.type === "timeline") {
            return (
                <TimelineProperties
                    selectedElement={selectedElement as TimelineElement}
                    updateElement={updateElement as any}
                />
            );
        }

        if (selectedElement?.type === "card") {
            return (
                <CardProperties
                    selectedElement={selectedElement as CardElement}
                    updateElement={updateElement as any}
                />
            );
        }

        if (selectedElement?.type === "button") {
            return (
                <ButtonProperties
                    selectedElement={selectedElement as ButtonElement}
                    updateElement={updateElement as any}
                />
            );
        }

        if (selectedElement?.type === "text") {
            return (
                <TextProperties
                    element={selectedElement as TextElement}
                    updateElement={updateElement as (id: string, u: Partial<TextElement>) => void}
                />
            );
        }

        return (
            <p className="mt-6 text-center text-sm text-gray-500">
                Select an element to edit its properties.
            </p>
        );
    })();

    // ── Panel shell (shared between docked + floating) ────────────────────────

    const panelMenu = (isDocked: boolean) => (
        <>
            <h2 className="text-sm font-semibold text-gray-300">Properties</h2>

            <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="absolute right-0 flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-800 hover:text-white"
            >
                <MoreVertical size={18} />
            </button>

            {isMenuOpen && (
                <div className="absolute right-0 top-10 z-50 w-32 rounded-lg border border-gray-700 bg-gray-900 p-1 shadow-lg">
                    <button
                        type="button"
                        onClick={() => { setIsPropertiesMinimised(true); setIsMenuOpen(false); }}
                        className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                    >
                        Minimise
                    </button>

                    {isDocked ? (
                        <button
                            type="button"
                            onClick={handleFloat}
                            className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                        >
                            Float
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => { setIsPropertiesFloating(false); setIsMenuOpen(false); }}
                            className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                        >
                            Dock
                        </button>
                    )}
                </div>
            )}
        </>
    );

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            {/* Docked Right Panel */}
            {!isPropertiesMinimised && !isPropertiesFloating && (
                <aside
                    ref={panelRef}
                    className="relative flex h-full w-72 shrink-0 flex-col border-l border-gray-800 p-5"
                >
                    <div className="relative flex shrink-0 items-center justify-center">
                        {panelMenu(true)}
                    </div>

                    <div
                        className="min-h-0 flex-1 overflow-y-auto pr-1"
                        style={{ scrollbarWidth: "thin", scrollbarColor: "white transparent" }}
                    >
                        {propertiesContent}
                    </div>
                </aside>
            )}

            {/* Floating Properties Panel */}
            {!isPropertiesMinimised && isPropertiesFloating && (
                <aside
                    className="fixed z-50 flex h-[500px] w-72 flex-col rounded-xl border border-gray-700 bg-black p-5 shadow-2xl"
                    style={{ left: floatingPosition.x, top: floatingPosition.y }}
                >
                    <div
                        onPointerDown={handlePointerDown}
                        className="relative mb-4 flex shrink-0 cursor-move touch-none items-center justify-center select-none"
                    >
                        {panelMenu(false)}
                    </div>

                    <div
                        className="min-h-0 flex-1 overflow-y-auto pr-1"
                        style={{ scrollbarWidth: "thin", scrollbarColor: "white transparent" }}
                    >
                        {propertiesContent}
                    </div>
                </aside>
            )}

            {/* Restore / Minimised Button */}
            {isPropertiesMinimised && (
                <button
                    type="button"
                    onClick={() => setIsPropertiesMinimised(false)}
                    className="absolute right-2 top-20 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 bg-gray-900 text-gray-400 shadow-lg transition hover:border-gray-500 hover:bg-gray-800 hover:text-white"
                    title="Show Properties"
                >
                    <PanelRightOpen size={18} />
                </button>
            )}
        </>
    );
}