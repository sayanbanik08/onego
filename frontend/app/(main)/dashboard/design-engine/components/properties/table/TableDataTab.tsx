import { Sparkles, Trash2 } from "lucide-react";
import type { TableElement } from "../../../types/elements";

type TableDataTabProps = {
    element: TableElement;
    updateElement: (id: string, updates: Partial<TableElement>) => void;
    onFillSampleData: () => void;
    onClearAllData: () => void;
};

export function TableDataTab({
    element,
    updateElement,
    onFillSampleData,
    onClearAllData,
}: TableDataTabProps) {
    return (
        <div className="space-y-4">
            {/* Actions */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={onFillSampleData}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-700/50 bg-blue-900/20 px-3 py-2 text-xs font-medium text-blue-300 transition hover:bg-blue-900/40"
                >
                    <Sparkles size={12} /> Sample Data
                </button>
                <button
                    type="button"
                    onClick={onClearAllData}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-700/50 bg-red-900/20 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-900/40"
                >
                    <Trash2 size={12} /> Clear All
                </button>
            </div>

            {/* Header Labels */}
            {element.hasHeader && (
                <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Header Labels
                    </label>
                    {element.headers.map((hdr, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-2">
                            <span className="w-10 text-[10px] text-gray-500">
                                C{cIdx + 1}
                            </span>
                            <input
                                type="text"
                                value={hdr}
                                onChange={(e) => {
                                    const newHeaders = [...element.headers];
                                    newHeaders[cIdx] = e.target.value;
                                    updateElement(element.id, {
                                        headers: newHeaders,
                                    });
                                }}
                                className="flex-1 rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
                                placeholder={`Header ${cIdx + 1}`}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Cell Values Editor */}
            <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Row Data Cells
                </label>
                {Array.from({ length: element.rows }).map((_, rIdx) => (
                    <div
                        key={rIdx}
                        className="rounded-lg border border-gray-800 bg-gray-900/50 p-2.5 space-y-1.5"
                    >
                        <span className="block text-[11px] font-semibold text-gray-400">
                            Row {rIdx + 1}
                        </span>
                        <div className="space-y-1">
                            {Array.from({ length: element.cols }).map(
                                (__, cIdx) => (
                                    <div
                                        key={cIdx}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="w-12 text-[10px] text-gray-500">
                                            {element.headers[cIdx] ||
                                                `C${cIdx + 1}`}
                                        </span>
                                        <input
                                            type="text"
                                            value={
                                                element.data?.[rIdx]?.[cIdx] ??
                                                ""
                                            }
                                            onChange={(e) => {
                                                const newData = element.data.map(
                                                    (r) => [...r]
                                                );
                                                if (!newData[rIdx])
                                                    newData[rIdx] = [];
                                                newData[rIdx][cIdx] =
                                                    e.target.value;
                                                updateElement(element.id, {
                                                    data: newData,
                                                });
                                            }}
                                            className="flex-1 rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
                                            placeholder={`Cell (${
                                                rIdx + 1
                                            }, ${cIdx + 1})`}
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
