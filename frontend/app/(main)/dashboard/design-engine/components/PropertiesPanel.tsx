import { MoreVertical, PanelRightOpen } from "lucide-react";
import type {
    Dispatch,
    SetStateAction,
    PointerEvent as ReactPointerEvent,
} from "react";
import { useRef } from "react";

type PropertiesPanelProps = {
    isMenuOpen: boolean;
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
    isPropertiesMinimised: boolean;
    setIsPropertiesMinimised: Dispatch<SetStateAction<boolean>>;
    isPropertiesFloating: boolean;
    setIsPropertiesFloating: Dispatch<SetStateAction<boolean>>;
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

export default function PropertiesPanel({
    isMenuOpen,
    setIsMenuOpen,
    isPropertiesMinimised,
    setIsPropertiesMinimised,
    isPropertiesFloating,
    setIsPropertiesFloating,
    floatingPosition,
    setFloatingPosition,
}: PropertiesPanelProps) {
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

        setIsPropertiesFloating(true);
        setIsMenuOpen(false);
    };
    const handlePointerDown = (
        event: ReactPointerEvent<HTMLDivElement>
    ) => {
        if (!isPropertiesFloating) {
            return;
        }

        const startX = event.clientX;
        const startY = event.clientY;

        const initialX = floatingPosition.x;
        const initialY = floatingPosition.y;

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const panelWidth = 288;
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
            {/* Right Panel */}
            {!isPropertiesMinimised && !isPropertiesFloating && (
                <aside
                    ref={panelRef}
                    className="relative w-72 shrink-0 border-l border-gray-800 p-5"
                >

                    <div className="relative flex items-center justify-center">

                        <h2 className="text-sm font-semibold text-gray-300">
                            Properties
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                setIsMenuOpen((prev) => !prev)
                            }
                            className="absolute right-0 flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-800 hover:text-white"
                        >
                            <MoreVertical size={18} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-10 z-50 w-32 rounded-lg border border-gray-700 bg-gray-900 p-1 shadow-lg">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsPropertiesMinimised(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                                >
                                    Minimise
                                </button>

                                <button
                                    type="button"
                                    onClick={handleFloat}
                                    className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                                >
                                    Float
                                </button>

                            </div>
                        )}

                    </div>

                </aside>
            )}

            {/* Floating Properties Panel */}
            {!isPropertiesMinimised && isPropertiesFloating && (
                <aside
                    className="fixed z-50 h-[500px] w-72 rounded-xl border border-gray-700 bg-black p-5 shadow-2xl"
                    style={{
                        left: floatingPosition.x,
                        top: floatingPosition.y,
                    }}
                >
                    <div
                        onPointerDown={handlePointerDown}
                        className="relative mb-4 flex shrink-0 cursor-move touch-none items-center justify-center select-none"
                    >

                        <h2 className="text-sm font-semibold text-gray-300">
                            Properties
                        </h2>

                        <button
                            type="button"
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={() =>
                                setIsMenuOpen((prev) => !prev)
                            }
                            className="absolute right-0 flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-800 hover:text-white"
                        >
                            <MoreVertical size={18} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-10 z-50 w-32 rounded-lg border border-gray-700 bg-gray-900 p-1 shadow-lg">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsPropertiesMinimised(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                                >
                                    Minimise
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsPropertiesFloating(false);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                                >
                                    Dock
                                </button>

                            </div>
                        )}

                    </div>

                </aside>
            )}

            {/* Restore Properties Panel */}
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