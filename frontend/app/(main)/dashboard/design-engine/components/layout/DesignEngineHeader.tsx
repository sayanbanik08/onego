"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

type DesignEngineHeaderProps = {
    canvasName?: string;
    canvases: { id: string; name: string }[];
    activeCanvasId: string;
    onSelectCanvas: (canvasId: string) => void;
    onDeleteCanvas: () => void;
    onSave?: () => void;
    saveStatus: "saved" | "error";
};

export default function DesignEngineHeader({
    canvasName,
    canvases,
    activeCanvasId,
    onSelectCanvas,
    onDeleteCanvas,
    onSave,
    saveStatus,
}: DesignEngineHeaderProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const canDeleteCanvas = canvases.length > 1;

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-800 px-6">
            <div className="flex min-w-0 items-center gap-3">
                <h1 className="shrink-0 text-lg font-semibold">Design Engine</h1>
                <label className="sr-only" htmlFor="active-canvas-select">
                    Current canvas
                </label>
                <select
                    id="active-canvas-select"
                    value={activeCanvasId}
                    onChange={(event) => onSelectCanvas(event.target.value)}
                    className="min-w-0 max-w-56 rounded-md border border-gray-700 bg-gray-900 px-2.5 py-1.5 text-sm text-gray-200 outline-none focus:border-blue-500"
                >
                    {canvases.map((canvas) => (
                        <option key={canvas.id} value={canvas.id}>
                            {canvas.name || canvasName}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={!canDeleteCanvas}
                    aria-label="Delete current canvas"
                    title={canDeleteCanvas ? "Delete current canvas" : "At least one canvas is required"}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-rose-950 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-35"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="flex shrink-0 items-center gap-3">
                {saveStatus === "error" ? (
                    <span className="text-xs text-rose-400" role="status">
                        Local save failed
                    </span>
                ) : (
                    <span className="text-xs text-gray-500" role="status">
                        Saved locally
                    </span>
                )}
                <button
                    type="button"
                    onClick={onSave}
                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm transition hover:border-white"
                >
                    Save
                </button>
            </div>
            {isDeleteDialogOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
                    <section
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-canvas-title"
                        aria-describedby="delete-canvas-description"
                        className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-950 p-5 shadow-2xl"
                    >
                        <h2 id="delete-canvas-title" className="text-base font-semibold text-white">
                            Delete {canvasName || "canvas"}?
                        </h2>
                        <p id="delete-canvas-description" className="mt-2 text-sm leading-5 text-gray-400">
                            This permanently removes the canvas and its elements. Its shared navigation link will also be removed.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                autoFocus
                                onClick={() => setIsDeleteDialogOpen(false)}
                                className="rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onDeleteCanvas();
                                    setIsDeleteDialogOpen(false);
                                }}
                                className="rounded-md bg-rose-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
                            >
                                Delete canvas
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </header>
    );
}