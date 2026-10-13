import type { DrawElement, DrawShapeType, PencilSettings } from "../../../types/elements";
import { PaintBucket } from "lucide-react";
import DrawShadowSection from "./DrawShadowSection";
import DrawShapesSection from "./DrawShapesSection";
import { DRAW_SHAPE_OPTIONS } from "../../../utils/drawShapes";

type Props = {
    element: DrawElement;
    updateElement: (id: string, updates: Partial<DrawElement>) => void;
    updatePencilSettings: (updates: Partial<PencilSettings>) => void;
    isFillMode: boolean;
    onToggleFillMode: () => void;
    onAddShape: (shape: DrawShapeType) => void;
};

export default function DrawProperties({
    element,
    updateElement,
    updatePencilSettings,
    isFillMode,
    onToggleFillMode,
    onAddShape,
}: Props) {
    const shapeLabel = DRAW_SHAPE_OPTIONS.find(
        (shape) => shape.type === element.shapeType
    )?.label;

    return (
        <div className="mt-6 space-y-5">

            {/* Element Information */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">
                    Element {element.serialNumber}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                    Type: {shapeLabel ?? "Draw"}
                </div>
            </div>

            <DrawShapesSection
                onAddShape={onAddShape}
            />

            <section className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {element.shapeType ? "Shape Transform & Scale" : "Transform & Scale"}
                </span>

                {/* Size */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Size</span>
                        <span className="font-mono text-gray-400">
                            {element.size ?? 100}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="250"
                        step="1"
                        value={element.size ?? 100}
                        onChange={(event) => {
                            const val = Number(event.target.value);
                            updateElement(element.id, { size: val });
                            updatePencilSettings({ size: val });
                        }}
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Width */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Width</span>
                        <span className="font-mono text-gray-400">
                            {Math.round(element.width)}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min="24"
                        max={Math.max(1200, Math.ceil(element.width))}
                        step="1"
                        value={element.width}
                        onChange={(event) =>
                            updateElement(element.id, {
                                width: Number(event.target.value),
                                pathWidth: element.pathWidth ?? element.width,
                            })
                        }
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Height */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Height</span>
                        <span className="font-mono text-gray-400">
                            {Math.round(element.height)}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min="24"
                        max={Math.max(1120, Math.ceil(element.height))}
                        step="1"
                        value={element.height}
                        onChange={(event) =>
                            updateElement(element.id, {
                                height: Number(event.target.value),
                                pathHeight: element.pathHeight ?? element.height,
                            })
                        }
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Stroke Width */}
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-400">
                            Stroke Width
                        </label>

                        <span className="text-xs text-gray-500">
                            {element.strokeWidth}px
                        </span>
                    </div>

                    <input
                        type="range"
                        min="1"
                        max="24"
                        step="1"
                        value={element.strokeWidth}
                        onChange={(event) => {
                            const val = Number(event.target.value);
                            updateElement(element.id, { strokeWidth: val });
                            updatePencilSettings({ strokeWidth: val });
                        }}
                        className="w-full cursor-pointer accent-blue-500"
                    />

                    <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                        <span>Thin</span>
                        <span>Thick</span>
                    </div>
                </div>

                {/* Opacity */}
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-400">
                            Opacity
                        </label>

                        <span className="text-xs text-gray-500">
                            {Math.round(element.opacity * 100)}%
                        </span>
                    </div>

                    <input
                        type="range"
                        min="0.05"
                        max="1"
                        step="0.05"
                        value={element.opacity}
                        onChange={(event) => {
                            const val = Number(event.target.value);
                            updateElement(element.id, { opacity: val });
                            updatePencilSettings({ opacity: val });
                        }}
                        className="w-full cursor-pointer accent-blue-500"
                    />

                    <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                        <span>Transparent</span>
                        <span>Opaque</span>
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
                        onChange={(event) => {
                            const val = Number(event.target.value);
                            updateElement(element.id, { rotation: val });
                            updatePencilSettings({ rotation: val });
                        }}
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>
            </section>

            <section className="space-y-3.5 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {element.shapeType ? "Shape Colors" : "Colors"}
                </span>

                {/* Stroke Color */}
                <div>
                    <label className="mb-2 block text-xs font-medium text-gray-400">
                        Color
                    </label>

                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={element.color}
                            onChange={(event) => {
                                const val = event.target.value;
                                updateElement(element.id, { color: val });
                                updatePencilSettings({ color: val });
                            }}
                            className="h-9 w-12 cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />

                        <span className="text-sm text-gray-300">
                            {element.color}
                        </span>
                    </div>
                </div>

                {/* Fill Color */}
                <div>
                    <label className="mb-2 block text-xs font-medium text-gray-400">
                        Fill Color
                    </label>

                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={element.fillColor ?? "#ff0000"}
                            onChange={(event) =>
                                (() => {
                                    const color = event.target.value;
                                    updateElement(element.id, { fillColor: color });
                                    updatePencilSettings({ fillColor: color });
                                })()
                            }
                            className="h-9 w-12 cursor-pointer rounded border border-gray-700 bg-gray-900"
                            title="Choose fill color"
                        />

                        <button
                            type="button"
                            onClick={onToggleFillMode}
                            aria-pressed={isFillMode}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                                isFillMode
                                    ? "border-blue-500 bg-blue-950/40 text-blue-200"
                                    : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500"
                            }`}
                        >
                            <PaintBucket size={16} />
                            {isFillMode ? "Bucket Active" : "Fill Area"}
                        </button>
                    </div>
                </div>
            </section>

            <DrawShadowSection
                settings={element}
                updateShadow={(updates) => updateElement(element.id, updates)}
                title={element.shapeType ? "Shape Shadow Effects" : "Shadow Effects"}
            />

        </div>
    );
}
