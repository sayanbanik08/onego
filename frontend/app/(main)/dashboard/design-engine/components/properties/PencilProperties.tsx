import type { PencilSettings } from "../../types/elements";

type Props = {
    elementsCount: number;
    pencilSettings: PencilSettings;
    updatePencilSettings: (updates: Partial<PencilSettings>) => void;
};

export default function PencilProperties({ elementsCount, pencilSettings, updatePencilSettings }: Props) {
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

            {/* Size */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Size
                </label>

                <input
                    type="number"
                    min="1"
                    value={pencilSettings.size ?? 100}
                    onChange={(event) =>
                        updatePencilSettings({
                            size: Math.max(1, Number(event.target.value)),
                        })
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-gray-500"
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
                    className="w-full"
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
                    className="w-full"
                />

                <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                    <span>Transparent</span>
                    <span>Opaque</span>
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
                    className="w-full"
                />
            </div>

        </div>
    );
}
