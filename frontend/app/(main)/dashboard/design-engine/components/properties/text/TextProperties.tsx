import type { TextElement } from "../../../types/elements";

type Props = {
    element: TextElement;
    updateElement: (id: string, updates: Partial<TextElement>) => void;
};

export default function TextProperties({ element, updateElement }: Props) {
    return (
        <div className="mt-6 space-y-5">

            {/* Element Information */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">
                    Element {element.serialNumber}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                    Type: Text
                </div>
            </div>

            {/* Text */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Text
                </label>

                <input
                    type="text"
                    value={element.text}
                    onChange={(event) =>
                        updateElement(element.id, {
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
                    value={element.fontSize}
                    onChange={(event) =>
                        updateElement(element.id, {
                            fontSize: Number(event.target.value),
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
                        {element.fontWeight}
                    </span>
                </div>

                <input
                    type="range"
                    min="300"
                    max="900"
                    step="100"
                    value={element.fontWeight}
                    onChange={(event) =>
                        updateElement(element.id, {
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
                    value={element.fontFamily}
                    onChange={(event) =>
                        updateElement(element.id, {
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

                <select
                    value={
                        element.fontStyle === "italic-underline" ||
                        (element.fontStyle === "italic" && element.underline)
                            ? "italic-underline"
                            : element.underline || element.fontStyle === "underline"
                            ? "underline"
                            : element.fontStyle === "italic"
                            ? "italic"
                            : "normal"
                    }
                    onChange={(event) => {
                        const value = event.target.value;
                        if (value === "italic") {
                            updateElement(element.id, { fontStyle: "italic", underline: false });
                        } else if (value === "underline") {
                            updateElement(element.id, { fontStyle: "underline", underline: true });
                        } else if (value === "italic-underline") {
                            updateElement(element.id, { fontStyle: "italic-underline", underline: true });
                        } else {
                            updateElement(element.id, { fontStyle: "normal", underline: false });
                        }
                    }}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-gray-500"
                >
                    <option value="normal">Normal</option>
                    <option value="italic">Italic</option>
                    <option value="underline">Underline</option>
                    <option value="italic-underline">Italic & Underline</option>
                </select>
            </div>

            {/* Color */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Color
                </label>

                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={element.color}
                        onChange={(event) =>
                            updateElement(element.id, {
                                color: event.target.value,
                            })
                        }
                        className="h-9 w-12 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />

                    <span className="text-sm text-gray-300">
                        {element.color}
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
                            element.backgroundColor &&
                            element.backgroundColor !== "transparent"
                                ? element.backgroundColor
                                : "#ffffff"
                        }
                        onChange={(event) =>
                            updateElement(element.id, {
                                backgroundColor: event.target.value,
                            })
                        }
                        className="h-9 w-12 cursor-pointer rounded border border-gray-700 bg-gray-900"
                    />

                    <span className="text-sm text-gray-300">
                        {element.backgroundColor &&
                        element.backgroundColor !== "transparent"
                            ? element.backgroundColor
                            : "Transparent"}
                    </span>

                    {element.backgroundColor &&
                        element.backgroundColor !== "transparent" && (
                            <button
                                type="button"
                                onClick={() =>
                                    updateElement(element.id, {
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
                        {element.rotation}°
                    </span>
                </div>

                <input
                    type="range"
                    min="-360"
                    max="360"
                    step="1"
                    value={element.rotation}
                    onChange={(event) =>
                        updateElement(element.id, {
                            rotation: Number(event.target.value),
                        })
                    }
                    className="w-full"
                />
            </div>
        </div>
    );
}
