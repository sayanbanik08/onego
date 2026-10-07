import type { DrawElement, PencilSettings } from "../../../types/elements";

type Props = {
    element: DrawElement;
    updateElement: (id: string, updates: Partial<DrawElement>) => void;
    updatePencilSettings: (updates: Partial<PencilSettings>) => void;
};

export default function DrawProperties({ element, updateElement, updatePencilSettings }: Props) {
    return (
        <div className="mt-6 space-y-5">

            {/* Element Information */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">
                    Element {element.serialNumber}
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
                    value={element.size ?? 100}
                    onChange={(event) => {
                        const val = Math.max(1, Number(event.target.value));
                        updateElement(element.id, { size: val });
                        updatePencilSettings({ size: val });
                    }}
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
                    className="w-full"
                />
            </div>

        </div>
    );
}
