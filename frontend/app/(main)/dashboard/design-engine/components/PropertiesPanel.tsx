import { MoreVertical, PanelRightOpen } from "lucide-react";
import type {
    Dispatch,
    SetStateAction,
    PointerEvent as ReactPointerEvent,
} from "react";
import { useRef } from "react";

type TextElement = {
    id: string;
    type: "text";
    serialNumber: number;
    x: number;
    y: number;
    text: string;
    fontSize: number;
    color: string;
    backgroundColor?: string;

    fontWeight: number;
    fontFamily: string;
    fontStyle: "normal" | "italic";
    rotation: number;
};

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

    selectedElement: TextElement | null;
    updateElement: (
        id: string,
        updates: Partial<TextElement>
    ) => void;
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
    selectedElement,
    updateElement,
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
                Math.max(
                    0,
                    initialX + moveEvent.clientX - startX
                ),
                window.innerWidth - panelWidth
            );

            const newY = Math.min(
                Math.max(
                    64,
                    initialY + moveEvent.clientY - startY
                ),
                window.innerHeight - panelHeight
            );

            setFloatingPosition({
                x: newX,
                y: newY,
            });
        };

        const handlePointerUp = () => {
            window.removeEventListener(
                "pointermove",
                handlePointerMove
            );

            window.removeEventListener(
                "pointerup",
                handlePointerUp
            );
        };

        window.addEventListener(
            "pointermove",
            handlePointerMove
        );

        window.addEventListener(
            "pointerup",
            handlePointerUp
        );
    };

    const propertiesContent = selectedElement ? (
        <div className="mt-6 space-y-5">

            {/* Element Information */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">
                    Element {selectedElement.serialNumber}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                    Type:{" "}
                    {selectedElement.type
                        .charAt(0)
                        .toUpperCase() +
                        selectedElement.type.slice(1)}
                </div>
            </div>

            {/* Text */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Text
                </label>

                <input
                    type="text"
                    value={selectedElement.text}
                    onChange={(event) =>
                        updateElement(selectedElement.id, {
                            text: event.target.value,
                        })
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-gray-500"
                />
            </div>

            {/* Font Size */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Font Size
                </label>

                <input
                    type="number"
                    min="1"
                    value={selectedElement.fontSize}
                    onChange={(event) =>
                        updateElement(selectedElement.id, {
                            fontSize: Number(
                                event.target.value
                            ),
                        })
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-gray-500"
                />
            </div>

            {/* Font Weight */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">
                        Font Weight
                    </label>

                    <span className="text-xs text-gray-500">
                        {selectedElement.fontWeight}
                    </span>
                </div>

                <input
                    type="range"
                    min="300"
                    max="900"
                    step="100"
                    value={selectedElement.fontWeight}
                    onChange={(event) =>
                        updateElement(selectedElement.id, {
                            fontWeight: Number(event.target.value),
                        })
                    }
                    className="w-full"
                />

                <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                    <span>Light</span>
                    <span>Normal</span>
                    <span>Bold</span>
                    <span>Black</span>
                </div>
            </div>

            {/* Font Family */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Font Family
                </label>

                <select
                    value={selectedElement.fontFamily}
                    onChange={(event) =>
                        updateElement(selectedElement.id, {
                            fontFamily: event.target.value,
                        })
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-gray-500"
                >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Tahoma">Tahoma</option>
                    <option value="Trebuchet MS">Trebuchet MS</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Garamond">Garamond</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Lucida Console">Lucida Console</option>
                    <option value="Impact">Impact</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                    <option value="Arial Black">Arial Black</option>
                    <option value="Palatino Linotype">Palatino Linotype</option>
                    <option value="Book Antiqua">Book Antiqua</option>
                </select>
            </div>

            {/* Font Style */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Font Style
                </label>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            updateElement(selectedElement.id, {
                                fontStyle: "normal",
                            })
                        }
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${selectedElement.fontStyle === "normal"
                            ? "border-gray-500 bg-gray-800 text-white"
                            : "border-gray-700 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`}
                    >
                        Normal
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            updateElement(selectedElement.id, {
                                fontStyle: "italic",
                            })
                        }
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm italic transition ${selectedElement.fontStyle === "italic"
                            ? "border-gray-500 bg-gray-800 text-white"
                            : "border-gray-700 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`}
                    >
                        Italic
                    </button>
                </div>
            </div>

            {/* Color */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Color
                </label>

                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={selectedElement.color}
                        onChange={(event) =>
                            updateElement(selectedElement.id, {
                                color: event.target.value,
                            })
                        }
                        className="h-9 w-12 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />

                    <span className="text-sm text-gray-300">
                        {selectedElement.color}
                    </span>
                </div>
            </div>

            {/* Background Color */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Background Color
                </label>

                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={
                            selectedElement.backgroundColor &&
                            selectedElement.backgroundColor !== "transparent"
                                ? selectedElement.backgroundColor
                                : "#ffffff"
                        }
                        onChange={(event) =>
                            updateElement(selectedElement.id, {
                                backgroundColor: event.target.value,
                            })
                        }
                        className="h-9 w-12 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />

                    <span className="text-sm text-gray-300">
                        {selectedElement.backgroundColor &&
                        selectedElement.backgroundColor !== "transparent"
                            ? selectedElement.backgroundColor
                            : "Transparent"}
                    </span>

                    {selectedElement.backgroundColor &&
                        selectedElement.backgroundColor !== "transparent" && (
                            <button
                                type="button"
                                onClick={() =>
                                    updateElement(selectedElement.id, {
                                        backgroundColor: "transparent",
                                    })
                                }
                                className="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-400 transition hover:bg-gray-700 hover:text-white"
                                title="Reset to transparent"
                            >
                                Clear
                            </button>
                        )}
                </div>
            </div>

            {/* Rotation */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">
                        Rotation
                    </label>

                    <span className="text-xs text-gray-500">
                        {selectedElement.rotation}°
                    </span>
                </div>

                <input
                    type="range"
                    min="-360"
                    max="360"
                    step="1"
                    value={selectedElement.rotation}
                    onChange={(event) =>
                        updateElement(selectedElement.id, {
                            rotation: Number(
                                event.target.value
                            ),
                        })
                    }
                    className="w-full"
                />
            </div>
        </div>
    ) : (
        <p className="mt-6 text-center text-sm text-gray-500">
            Select an element to edit its properties.
        </p>
    );

    return (
        <>
            {/* Right Panel */}
            {!isPropertiesMinimised &&
                !isPropertiesFloating && (
                    <aside
                        ref={panelRef}
                        className="relative flex h-full w-72 shrink-0 flex-col border-l border-gray-800 p-5"
                    >
                        <div className="relative flex shrink-0 items-center justify-center">

                            <h2 className="text-sm font-semibold text-gray-300">
                                Properties
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsMenuOpen(
                                        (prev) => !prev
                                    )
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
                                            setIsPropertiesMinimised(
                                                true
                                            );
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

                        {/* Scrollable Properties Content */}
                        <div
                            className="min-h-0 flex-1 overflow-y-auto pr-1"
                            style={{
                                scrollbarWidth: "thin",
                                scrollbarColor: "white transparent",
                            }}
                        >
                            {propertiesContent}
                        </div>
                    </aside>
                )}

            {/* Floating Properties Panel */}
            {!isPropertiesMinimised &&
                isPropertiesFloating && (
                    <aside
                        className="fixed z-50 flex h-[500px] w-72 flex-col rounded-xl border border-gray-700 bg-black p-5 shadow-2xl"
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
                                onPointerDown={(event) =>
                                    event.stopPropagation()
                                }
                                onClick={() =>
                                    setIsMenuOpen(
                                        (prev) => !prev
                                    )
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
                                            setIsPropertiesMinimised(
                                                true
                                            );
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                                    >
                                        Minimise
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsPropertiesFloating(
                                                false
                                            );
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                                    >
                                        Dock
                                    </button>

                                </div>
                            )}

                        </div>

                        {/* Scrollable Properties Content */}
                        <div
                            className="min-h-0 flex-1 overflow-y-auto pr-1"
                            style={{
                                scrollbarWidth: "thin",
                                scrollbarColor: "white transparent",
                            }}
                        >
                            {propertiesContent}
                        </div>
                    </aside>
                )}

            {/* Restore Properties Panel */}
            {isPropertiesMinimised && (
                <button
                    type="button"
                    onClick={() =>
                        setIsPropertiesMinimised(false)
                    }
                    className="absolute right-2 top-20 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 bg-gray-900 text-gray-400 shadow-lg transition hover:border-gray-500 hover:bg-gray-800 hover:text-white"
                    title="Show Properties"
                >
                    <PanelRightOpen size={18} />
                </button>
            )}
        </>
    );
}