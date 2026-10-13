import type { DrawShapeType, PencilSettings } from "../../../types/elements";
import DrawShadowSection from "./DrawShadowSection";
import DrawShapesSection from "./DrawShapesSection";

type Props = {
    elementsCount: number;
    pencilSettings: PencilSettings;
    updatePencilSettings: (updates: Partial<PencilSettings>) => void;
    onAddShape: (shape: DrawShapeType) => void;
};

export default function PencilProperties({
    elementsCount,
    pencilSettings,
    updatePencilSettings,
    onAddShape,
}: Props) {
    return (
        <div className="mt-6 space-y-5">

            {/* Element Information */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">
                    Element {elementsCount + 1}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                    Type: Draw
                </div>
            </div>

            <DrawShapesSection
                onAddShape={onAddShape}
            />

            <section className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Transform &amp; Scale
                </span>

                {/* Size */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Size</span>
                        <span className="font-mono text-gray-400">
                            {pencilSettings.size ?? 100}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="250"
                        step="1"
                        value={pencilSettings.size ?? 100}
                        onChange={(event) =>
                            updatePencilSettings({
                                size: Number(event.target.value),
                            })
                        }
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Width Scale */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Width</span>
                        <span className="font-mono text-gray-400">
                            {pencilSettings.widthScale ?? 100}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="250"
                        step="1"
                        value={pencilSettings.widthScale ?? 100}
                        onChange={(event) =>
                            updatePencilSettings({
                                widthScale: Number(event.target.value),
                            })
                        }
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Height Scale */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Height</span>
                        <span className="font-mono text-gray-400">
                            {pencilSettings.heightScale ?? 100}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="250"
                        step="1"
                        value={pencilSettings.heightScale ?? 100}
                        onChange={(event) =>
                            updatePencilSettings({
                                heightScale: Number(event.target.value),
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
                            {pencilSettings.strokeWidth}px
                        </span>
                    </div>

                    <input
                        type="range"
                        min="1"
                        max="24"
                        step="1"
                        value={pencilSettings.strokeWidth}
                        onChange={(event) =>
                            updatePencilSettings({
                                strokeWidth: Number(event.target.value),
                            })
                        }
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
                            {Math.round(pencilSettings.opacity * 100)}%
                        </span>
                    </div>

                    <input
                        type="range"
                        min="0.05"
                        max="1"
                        step="0.05"
                        value={pencilSettings.opacity}
                        onChange={(event) =>
                            updatePencilSettings({
                                opacity: Number(event.target.value),
                            })
                        }
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
                            {pencilSettings.rotation ?? 0}°
                        </span>
                    </div>

                    <input
                        type="range"
                        min="-360"
                        max="360"
                        step="1"
                        value={pencilSettings.rotation ?? 0}
                        onChange={(event) =>
                            updatePencilSettings({
                                rotation: Number(event.target.value),
                            })
                        }
                        className="w-full cursor-pointer accent-blue-500"
                    />
                </div>
            </section>

            <section className="space-y-3.5 rounded-lg border border-gray-800 bg-gray-900/50 p-3 w-full min-w-0 max-w-full overflow-hidden">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Colors
                </span>

                {/* Stroke Color */}
                <div>
                    <label className="mb-2 block text-xs font-medium text-gray-400">
                        Color
                    </label>

                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={pencilSettings.color}
                            onChange={(event) =>
                                updatePencilSettings({
                                    color: event.target.value,
                                })
                            }
                            className="h-9 w-12 cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />

                        <span className="text-sm text-gray-300">
                            {pencilSettings.color}
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
                            value={pencilSettings.fillColor ?? "#ff0000"}
                            onChange={(event) =>
                                updatePencilSettings({ fillColor: event.target.value })
                            }
                            className="h-9 w-12 cursor-pointer rounded border border-gray-700 bg-gray-900"
                            title="Choose fill color for new drawings"
                        />
                        <span className="text-sm text-gray-300">
                            {pencilSettings.fillColor ?? "#ff0000"}
                        </span>
                    </div>
                </div>
            </section>

            <DrawShadowSection
                settings={pencilSettings}
                updateShadow={updatePencilSettings}
            />

        </div>
    );
}
