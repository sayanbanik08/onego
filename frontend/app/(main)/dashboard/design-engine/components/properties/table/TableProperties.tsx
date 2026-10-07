import { useState } from "react";
import { Table as TableIcon } from "lucide-react";
import type { TableElement } from "../../../types/elements";
import { TableStyleTab } from "./TableStyleTab";
import { TableDataTab } from "./TableDataTab";

type Props = {
    element: TableElement;
    updateElement: (id: string, updates: Partial<TableElement>) => void;
};

export default function TableProperties({ element, updateElement }: Props) {
    const [tableTab, setTableTab] = useState<"style" | "data">("style");

    const handleSetRows = (newRows: number) => {
        const targetRows = Math.max(1, Math.min(25, newRows));
        let newData = [...element.data];
        if (targetRows > element.rows) {
            for (let i = element.rows; i < targetRows; i++) {
                const newRow: string[] = [];
                for (let j = 0; j < element.cols; j++) {
                    newRow.push(`Data ${i + 1}-${j + 1}`);
                }
                newData.push(newRow);
            }
        } else {
            newData = newData.slice(0, targetRows);
        }
        updateElement(element.id, { rows: targetRows, data: newData });
    };

    const handleSetCols = (newCols: number) => {
        const targetCols = Math.max(1, Math.min(10, newCols));
        let newHeaders = [...element.headers];
        if (targetCols > element.cols) {
            for (let j = element.cols; j < targetCols; j++) {
                newHeaders.push(`Col ${j + 1}`);
            }
        } else {
            newHeaders = newHeaders.slice(0, targetCols);
        }
        const newData = element.data.map((row, rIdx) => {
            let nextRow = [...row];
            if (targetCols > element.cols) {
                for (let j = element.cols; j < targetCols; j++) {
                    nextRow.push(`Data ${rIdx + 1}-${j + 1}`);
                }
            } else {
                nextRow = nextRow.slice(0, targetCols);
            }
            return nextRow;
        });
        updateElement(element.id, {
            cols: targetCols,
            headers: newHeaders,
            data: newData,
        });
    };

    const handleFillSampleData = () => {
        const sampleHeaders = [
            "Product",
            "Category",
            "Price",
            "Stock",
            "Rating",
        ];
        const samples = [
            ["MacBook Air", "Laptop", "$999", "18", "4.8"],
            ["iPhone 15", "Phone", "$799", "45", "4.9"],
            ["AirPods Pro", "Audio", "$249", "60", "4.7"],
            ["iPad Pro", "Tablet", "$899", "22", "4.8"],
            ["Magic Mouse", "Accessory", "$79", "35", "4.4"],
        ];
        const newHeaders = element.headers.map(
            (h, i) => sampleHeaders[i % sampleHeaders.length]
        );
        const newData = element.data.map((row, rIdx) =>
            row.map((_, cIdx) => {
                const sampleRow = samples[rIdx % samples.length];
                return sampleRow[cIdx % sampleRow.length];
            })
        );
        updateElement(element.id, { headers: newHeaders, data: newData });
    };

    const handleClearAllData = () => {
        const clearedData = element.data.map((row) => row.map(() => ""));
        updateElement(element.id, { data: clearedData });
    };

    return (
        <div className="space-y-4 text-xs text-gray-300">
            {/* Header info */}
            <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 p-2.5">
                <TableIcon size={16} className="text-blue-400" />
                <div>
                    <span className="font-semibold text-white">Table</span>
                    <span className="ml-1 text-[10px] text-gray-500">
                        #{element.serialNumber} • {element.rows}x{element.cols}
                    </span>
                </div>
            </div>

            {/* Sub-tabs: Style vs Data */}
            <div className="flex rounded-lg border border-gray-800 bg-gray-900 p-0.5">
                {(["style", "data"] as const).map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setTableTab(tab)}
                        className={`flex-1 rounded py-1.5 text-center text-xs font-medium capitalize transition ${
                            tableTab === tab
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        {tab === "style" ? "Style & Layout" : "Data & Cells"}
                    </button>
                ))}
            </div>

            {tableTab === "style" && (
                <TableStyleTab
                    element={element}
                    updateElement={updateElement}
                    onSetRows={handleSetRows}
                    onSetCols={handleSetCols}
                />
            )}

            {tableTab === "data" && (
                <TableDataTab
                    element={element}
                    updateElement={updateElement}
                    onFillSampleData={handleFillSampleData}
                    onClearAllData={handleClearAllData}
                />
            )}
        </div>
    );
}
