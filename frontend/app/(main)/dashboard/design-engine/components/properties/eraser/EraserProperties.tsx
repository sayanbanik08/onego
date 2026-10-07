import type { EraserSettings } from "../../../types/elements";

type Props = {
    eraserSettings: EraserSettings;
    updateEraserSettings: (updates: Partial<EraserSettings>) => void;
};

export default function EraserProperties({ eraserSettings, updateEraserSettings }: Props) {
    return (
        <div className="mt-6 space-y-5">

            {/* Eraser Tool Info */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">
                    Eraser
                </div>

                <div className="mt-1 text-xs text-gray-500">
                    Type: Eraser
                </div>
            </div>

            {/* Size */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">
                        Size
                    </label>

                    <span className="text-xs text-gray-500">
                        {eraserSettings.size}px
                    </span>
                </div>

                <input
                    type="range"
                    min="10"
                    max="100"
                    step="2"
                    value={eraserSettings.size}
                    onChange={(event) =>
                        updateEraserSettings({
                            size: Number(event.target.value),
                        })
                    }
                    className="w-full"
                />

                <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                    <span>Small</span>
                    <span>Large</span>
                </div>
            </div>

            {/* Opacity */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">
                        Opacity
                    </label>

                    <span className="text-xs text-gray-500">
                        {Math.round(eraserSettings.opacity * 100)}%
                    </span>
                </div>

                <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={eraserSettings.opacity}
                    onChange={(event) =>
                        updateEraserSettings({
                            opacity: Number(event.target.value),
                        })
                    }
                    className="w-full"
                />

                <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                    <span>Soft</span>
                    <span>Hard (100%)</span>
                </div>
            </div>

        </div>
    );
}
