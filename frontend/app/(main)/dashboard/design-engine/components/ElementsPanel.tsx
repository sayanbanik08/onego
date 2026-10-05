import { PanelLeftOpen } from "lucide-react";
import type {
    Dispatch,
    SetStateAction,
    PointerEvent as ReactPointerEvent,
} from "react";
import { useRef } from "react";

import ElementsMenu from "./ElementsMenu";
import ElementList from "./ElementList";

type ElementsPanelProps = {
    isMenuOpen: boolean;
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
    isElementsMinimised: boolean;
    setIsElementsMinimised: Dispatch<SetStateAction<boolean>>;
    isElementsFloating: boolean;
    setIsElementsFloating: Dispatch<SetStateAction<boolean>>;
    floatingPosition: {
        x: number;
        y: number;
    };
    setFloatingPosition: Dispatch<
        SetStateAction<{
            x: number;
            y: number;
        }>
    >;
};

export default function ElementsPanel({
    isMenuOpen,
    setIsMenuOpen,
    isElementsMinimised,
    setIsElementsMinimised,
    isElementsFloating,
    setIsElementsFloating,
    floatingPosition,
    setFloatingPosition,
}: ElementsPanelProps) {
    const panelRef = useRef<HTMLElement | null>(null);
    const handleFloat = () => {
        if (!panelRef.current) {
            return;
        }

        const rect = panelRef.current.getBoundingClientRect();

        setFloatingPosition({
            x: rect.left,
            y: rect.top,
        });

        setIsElementsFloating(true);
        setIsMenuOpen(false);
    };
    const handlePointerDown = (
        event: ReactPointerEvent<HTMLDivElement>
    ) => {
        if (!isElementsFloating) {
            return;
        }

        const startX = event.clientX;
        const startY = event.clientY;

        const initialX = floatingPosition.x;
        const initialY = floatingPosition.y;

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const panelWidth = 264;
            const panelHeight = 500;

            const newX = Math.min(
                Math.max(0, initialX + moveEvent.clientX - startX),
                window.innerWidth - panelWidth
            );

            const newY = Math.min(
                Math.max(64, initialY + moveEvent.clientY - startY),
                window.innerHeight - panelHeight
            );

            setFloatingPosition({
                x: newX,
                y: newY,
            });
        };

        const handlePointerUp = () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
    };

    return (
        <>
            {/* Left Panel */}
            {!isElementsMinimised && !isElementsFloating && (
                <aside
                    ref={panelRef}
                    className="w-66 shrink-0 min-h-0 border-r border-gray-800 p-5"
                >
                    <div
                        className="h-full overflow-y-auto"
                        style={{
                            direction: "rtl",
                            scrollbarWidth: "thin",
                            scrollbarColor: "white transparent",
                        }}
                    >
                        <div style={{ direction: "ltr" }}>

                            <div className="relative mb-4 flex items-center justify-center">

                                <h2 className="text-sm font-semibold text-gray-300">
                                    Elements
                                </h2>

                                <ElementsMenu
                                    isMenuOpen={isMenuOpen}
                                    setIsMenuOpen={setIsMenuOpen}
                                    setIsElementsMinimised={setIsElementsMinimised}
                                    setIsElementsFloating={handleFloat}
                                    isElementsFloating={isElementsFloating}
                                />

                            </div>

                            <ElementList />

                        </div>
                    </div>
                </aside>
            )}

            {/* Floating Elements Panel */}
            {!isElementsMinimised && isElementsFloating && (
                <aside
                    className="fixed z-50 flex h-[500px] w-66 flex-col rounded-xl border border-gray-700 bg-black p-5 shadow-2xl"
                    style={{
                        left: floatingPosition.x,
                        top: floatingPosition.y,
                    }}
                >
                    {/* Drag Area */}
                    <div
                        onPointerDown={handlePointerDown}
                        className="relative mb-4 flex shrink-0 cursor-move touch-none items-center justify-center select-none"
                    >
                        <h2 className="text-sm font-semibold text-gray-300">
                            Elements
                        </h2>

                        <ElementsMenu
                            isMenuOpen={isMenuOpen}
                            setIsMenuOpen={setIsMenuOpen}
                            setIsElementsMinimised={setIsElementsMinimised}
                            setIsElementsFloating={() => setIsElementsFloating(false)}
                            isElementsFloating={isElementsFloating}
                        />
                    </div>

                    {/* Elements */}
                    <div
                        className="min-h-0 flex-1 overflow-y-auto"
                        style={{
                            direction: "rtl",
                            scrollbarWidth: "thin",
                            scrollbarColor: "white transparent",
                        }}
                    >
                        <div style={{ direction: "ltr" }}>
                            <ElementList />
                        </div>
                    </div>
                </aside>
            )}

            {/* Restore Elements Panel */}
            {isElementsMinimised && (
                <button
                    type="button"
                    onClick={() => setIsElementsMinimised(false)}
                    className="absolute left-2 top-20 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 bg-gray-900 text-gray-400 shadow-lg transition hover:border-gray-500 hover:bg-gray-800 hover:text-white"
                    title="Show Elements"
                >
                    <PanelLeftOpen size={18} />
                </button>
            )}
        </>
    );
}