import { Plus, Minus } from "lucide-react";
import type { TableElement, TablePreset } from "../../../types/elements";
import { TABLE_PRESETS } from "./tablePresets";

type TableStyleTabProps = {
    element: TableElement;
    updateElement: (id: string, updates: Partial<TableElement>) => void;
    onSetRows: (rows: number) => void;
    onSetCols: (cols: number) => void;
};

export function TableStyleTab({
    element,
    updateElement,
    onSetRows,
    onSetCols,
}: TableStyleTabProps) {
    return (
        <div className="space-y-5">
            {/* Presets */}
            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Presets
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                    {(Object.keys(TABLE_PRESETS) as TablePreset[]).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() =>
                                updateElement(element.id, TABLE_PRESETS[p])
                            }
                            className={`rounded-md border px-2 py-1.5 text-xs capitalize transition ${
                                element.preset === p
                                    ? "border-blue-500 bg-blue-950/40 text-blue-200"
                                    : "border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-800"
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dimensions */}
            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Dimensions
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="mb-1 block text-xs text-gray-400">
                            Rows
                        </label>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => onSetRows(element.rows - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700"
                            >
                                <Minus size={12} />
                            </button>
                            <span className="flex-1 text-center text-sm text-white">
                                {element.rows}
                            </span>
                            <button
                                type="button"
                                onClick={() => onSetRows(element.rows + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs text-gray-400">
                            Cols
                        </label>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => onSetCols(element.cols - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700"
                            >
                                <Minus size={12} />
                            </button>
                            <span className="flex-1 text-center text-sm text-white">
                                {element.cols}
                            </span>
                            <button
                                type="button"
                                onClick={() => onSetCols(element.cols + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Has Header */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Show Header Row</span>
                <button
                    type="button"
                    onClick={() =>
                        updateElement(element.id, {
                            hasHeader: !element.hasHeader,
                        })
                    }
                    className={`relative h-5 w-9 rounded-full transition-colors ${
                        element.hasHeader ? "bg-blue-600" : "bg-gray-700"
                    }`}
                >
                    <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                            element.hasHeader ? "left-4" : "left-0.5"
                        }`}
                    />
                </button>
            </div>

            {/* Header Styles */}
            {element.hasHeader && (
                <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Header Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="mb-1 block text-[10px] text-gray-500">
                                Background
                            </label>
                            <input
                                type="color"
                                value={element.headerBg}
                                onChange={(e) =>
                                    updateElement(element.id, {
                                        headerBg: e.target.value,
                                    })
                                }
                                className="h-8 w-full cursor-pointer rounded border border-gray-700 bg-gray-900"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[10px] text-gray-500">
                                Text Color
                            </label>
                            <input
                                type="color"
                                value={element.headerColor}
                                onChange={(e) =>
                                    updateElement(element.id, {
                                        headerColor: e.target.value,
                                    })
                                }
                                className="h-8 w-full cursor-pointer rounded border border-gray-700 bg-gray-900"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-[10px] text-gray-500">
                            Alignment
                        </label>
                        <div className="flex gap-1">
                            {(["left", "center", "right"] as const).map((a) => (
                                <button
                                    key={a}
                                    type="button"
                                    onClick={() =>
                                        updateElement(element.id, {
                                            headerAlign: a,
                                        })
                                    }
                                    className={`flex-1 rounded border py-1 text-xs capitalize transition ${
                                        element.headerAlign === a
                                            ? "border-blue-500 bg-blue-950/40 text-blue-300"
                                            : "border-gray-700 text-gray-500 hover:border-gray-500"
                                    }`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Body Styles */}
            <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Cell Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label className="mb-1 block text-[10px] text-gray-500">
                            Row BG
                        </label>
                        <input
                            type="color"
                            value={element.rowBg}
                            onChange={(e) =>
                                updateElement(element.id, {
                                    rowBg: e.target.value,
                                })
                            }
                            className="h-8 w-full cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-[10px] text-gray-500">
                            Alt BG
                        </label>
                        <input
                            type="color"
                            value={element.altRowBg}
                            onChange={(e) =>
                                updateElement(element.id, {
                                    altRowBg: e.target.value,
                                })
                            }
                            className="h-8 w-full cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-[10px] text-gray-500">
                            Text
                        </label>
                        <input
                            type="color"
                            value={element.cellColor}
                            onChange={(e) =>
                                updateElement(element.id, {
                                    cellColor: e.target.value,
                                })
                            }
                            className="h-8 w-full cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                    </div>
                </div>
                <div>
                    <label className="mb-1 block text-[10px] text-gray-500">
                        Alignment
                    </label>
                    <div className="flex gap-1">
                        {(["left", "center", "right"] as const).map((a) => (
                            <button
                                key={a}
                                type="button"
                                onClick={() =>
                                    updateElement(element.id, {
                                        cellAlign: a,
                                    })
                                }
                                className={`flex-1 rounded border py-1 text-xs capitalize transition ${
                                    element.cellAlign === a
                                        ? "border-blue-500 bg-blue-950/40 text-blue-300"
                                        : "border-gray-700 text-gray-500 hover:border-gray-500"
                                }}`}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Borders */}
            <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Borders
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="mb-1 block text-[10px] text-gray-500">
                            Color
                        </label>
                        <input
                            type="color"
                            value={element.borderColor}
                            onChange={(e) =>
                                updateElement(element.id, {
                                    borderColor: e.target.value,
                                })
                            }
                            className="h-8 w-full cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-[10px] text-gray-500">
                            Style
                        </label>
                        <select
                            value={element.borderStyle}
                            onChange={(e) =>
                                updateElement(element.id, {
                                    borderStyle: e.target
                                        .value as TableElement["borderStyle"],
                                })
                            }
                            className="h-8 w-full rounded border border-gray-700 bg-gray-900 px-2 text-xs text-white outline-none"
                        >
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-[10px] text-gray-500">
                            Width
                        </label>
                        <span className="text-[10px] text-gray-600">
                            {element.borderWidth}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        value={element.borderWidth}
                        onChange={(e) =>
                            updateElement(element.id, {
                                borderWidth: Number(e.target.value),
                            })
                        }
                        className="w-full"
                    />
                </div>
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-[10px] text-gray-500">
                            Radius
                        </label>
                        <span className="text-[10px] text-gray-600">
                            {element.borderRadius}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="24"
                        step="1"
                        value={element.borderRadius}
                        onChange={(e) =>
                            updateElement(element.id, {
                                borderRadius: Number(e.target.value),
                            })
                        }
                        className="w-full"
                    />
                </div>
            </div>

            {/* Shadow */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Shadow
                </label>
                <div className="flex gap-1.5">
                    {(["none", "sm", "md", "lg"] as const).map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() =>
                                updateElement(element.id, { shadow: s })
                            }
                            className={`flex-1 rounded border px-2 py-1.5 text-xs transition ${
                                element.shadow === s
                                    ? "border-blue-500 bg-blue-950/40 text-blue-200"
                                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transform */}
            <div className="space-y-3">
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-xs text-gray-400">
                            Font Size
                        </label>
                        <span className="text-[10px] text-gray-600">
                            {element.fontSize}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min="8"
                        max="24"
                        step="1"
                        value={element.fontSize}
                        onChange={(e) =>
                            updateElement(element.id, {
                                fontSize: Number(e.target.value),
                            })
                        }
                        className="w-full"
                    />
                </div>
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-xs text-gray-400">
                            Cell Padding
                        </label>
                        <span className="text-[10px] text-gray-600">
                            {element.cellPadding}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min="2"
                        max="20"
                        step="1"
                        value={element.cellPadding}
                        onChange={(e) =>
                            updateElement(element.id, {
                                cellPadding: Number(e.target.value),
                            })
                        }
                        className="w-full"
                    />
                </div>
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-xs text-gray-400">Size</label>
                        <span className="text-[10px] text-gray-600">
                            {element.size}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="20"
                        max="200"
                        step="5"
                        value={element.size}
                        onChange={(e) =>
                            updateElement(element.id, {
                                size: Number(e.target.value),
                            })
                        }
                        className="w-full"
                    />
                </div>
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-xs text-gray-400">Rotation</label>
                        <span className="text-[10px] text-gray-600">
                            {element.rotation}°
                        </span>
                    </div>
                    <input
                        type="range"
                        min="-360"
                        max="360"
                        step="1"
                        value={element.rotation}
                        onChange={(e) =>
                            updateElement(element.id, {
                                rotation: Number(e.target.value),
                            })
                        }
                        className="w-full"
                    />
                </div>
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-xs text-gray-400">Opacity</label>
                        <span className="text-[10px] text-gray-600">
                            {Math.round((element.opacity ?? 1) * 100)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={element.opacity ?? 1}
                        onChange={(e) =>
                            updateElement(element.id, {
                                opacity: Number(e.target.value),
                            })
                        }
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
}
