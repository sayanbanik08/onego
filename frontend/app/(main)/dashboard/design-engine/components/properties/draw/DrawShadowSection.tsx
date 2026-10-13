import type { DrawElement } from "../../../types/elements";
import type { ButtonShadowPreset } from "../../../types/button";

type ShadowSettings = Pick<
    DrawElement,
    | "shadow"
    | "shadowColor"
    | "shadowBlur"
    | "shadowOffsetX"
    | "shadowOffsetY"
    | "shadowSpread"
>;

type DrawShadowSectionProps = {
    settings: ShadowSettings;
    updateShadow: (updates: Partial<ShadowSettings>) => void;
    title?: string;
};

const SHADOW_PRESETS: { label: string; value: ButtonShadowPreset }[] = [
    { label: "None", value: "none" },
    { label: "Subtle", value: "sm" },
    { label: "Medium", value: "md" },
    { label: "Large", value: "lg" },
    { label: "Deep", value: "xl" },
    { label: "Neon", value: "neon" },
    { label: "3D Offset", value: "3d-offset" },
    { label: "Steps", value: "layered-steps" },
    { label: "Custom", value: "custom" },
];

export default function DrawShadowSection({
    settings,
    updateShadow,
    title = "Shadow Effects",
}: DrawShadowSectionProps) {
    const isCustom = settings.shadow === "custom";

    return (
        <div className="w-full min-w-0 max-w-full space-y-3 overflow-hidden rounded-lg border border-gray-800 bg-gray-900/50 p-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {title}
            </span>

            <div className="grid grid-cols-3 gap-1.5">
                {SHADOW_PRESETS.map((preset) => {
                    const isSelected = (settings.shadow ?? "none") === preset.value;
                    return (
                        <button
                            key={preset.value}
                            type="button"
                            onClick={() => updateShadow({ shadow: preset.value })}
                            className={`rounded-lg border px-2 py-1.5 text-center text-xs transition ${
                                isSelected
                                    ? "border-blue-500 bg-blue-600/30 font-semibold text-blue-300"
                                    : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700 hover:text-white"
                            }`}
                        >
                            {preset.label}
                        </button>
                    );
                })}
            </div>

            {isCustom && (
                <div className="space-y-2.5 border-t border-gray-800/80 pt-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-300">Shadow Color</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={settings.shadowColor ?? "#000000"}
                                onChange={(event) =>
                                    updateShadow({ shadowColor: event.target.value })
                                }
                                className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900"
                            />
                            <span className="max-w-[70px] truncate font-mono text-xs text-gray-400">
                                {settings.shadowColor ?? "#000000"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Blur</span>
                            <span className="font-mono text-gray-400">
                                {settings.shadowBlur ?? 12}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={50}
                            step={1}
                            value={settings.shadowBlur ?? 12}
                            onChange={(event) =>
                                updateShadow({
                                    shadowBlur: Number(event.target.value),
                                })
                            }
                            className="w-full cursor-pointer accent-blue-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Offset X</span>
                            <span className="font-mono text-gray-400">
                                {settings.shadowOffsetX ?? 0}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min={-30}
                            max={30}
                            step={1}
                            value={settings.shadowOffsetX ?? 0}
                            onChange={(event) =>
                                updateShadow({
                                    shadowOffsetX: Number(event.target.value),
                                })
                            }
                            className="w-full cursor-pointer accent-blue-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Offset Y</span>
                            <span className="font-mono text-gray-400">
                                {settings.shadowOffsetY ?? 4}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min={-30}
                            max={30}
                            step={1}
                            value={settings.shadowOffsetY ?? 4}
                            onChange={(event) =>
                                updateShadow({
                                    shadowOffsetY: Number(event.target.value),
                                })
                            }
                            className="w-full cursor-pointer accent-blue-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Spread</span>
                            <span className="font-mono text-gray-400">
                                {settings.shadowSpread ?? 0}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min={-20}
                            max={30}
                            step={1}
                            value={settings.shadowSpread ?? 0}
                            onChange={(event) =>
                                updateShadow({
                                    shadowSpread: Number(event.target.value),
                                })
                            }
                            className="w-full cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}