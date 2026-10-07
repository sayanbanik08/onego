import type { ClockElement, ClockDesign } from "../../../types/elements";

type Props = {
    element: ClockElement;
    updateElement: (id: string, updates: Partial<ClockElement>) => void;
};

const DESIGNS: { value: ClockDesign; label: string }[] = [
    { value: "digital-minimal", label: "Digital Minimal" },
    { value: "analog-classic",  label: "Analog Classic"  },
    { value: "digital-neon",    label: "Neon Digital"    },
    { value: "analog-swiss",    label: "Swiss Minimal"   },
    { value: "flip-card",       label: "Flip Card"       },
    { value: "smartwatch",      label: "Smartwatch"      },
];

const PALETTES: Record<ClockDesign, Partial<ClockElement>> = {
    "digital-minimal": { bgColor: "#0b0f19", textColor: "#f8fafc", accentColor: "#38bdf8", borderColor: "#1e293b", borderRadius: 20 },
    "analog-classic":  { bgColor: "#0b0f19", textColor: "#f8fafc", accentColor: "#f59e0b", borderColor: "#334155", borderRadius: 24 },
    "digital-neon":    { bgColor: "#06080e", textColor: "#38bdf8", accentColor: "#00f0ff", borderColor: "#0284c7", borderRadius: 16 },
    "analog-swiss":    { bgColor: "#ffffff", textColor: "#0f172a", accentColor: "#ef4444", borderColor: "#cbd5e1", borderRadius: 24 },
    "flip-card":       { bgColor: "#111317", textColor: "#ffffff", accentColor: "#f97316", borderColor: "#272a33", borderRadius: 16 },
    "smartwatch":      { bgColor: "#06080e", textColor: "#f8fafc", accentColor: "#38bdf8", borderColor: "#334155", borderRadius: 32 },
};

export default function ClockProperties({ element: clk, updateElement }: Props) {
    const up = (updates: Partial<ClockElement>) => updateElement(clk.id, updates);

    return (
        <div className="mt-6 space-y-5">

            {/* Info */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">Element {clk.serialNumber}</div>
                <div className="mt-1 text-xs text-gray-500">Type: Clock</div>
            </div>

            {/* Design Presets */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Design</label>
                <div className="grid grid-cols-2 gap-1.5">
                    {DESIGNS.map((d) => (
                        <button
                            key={d.value}
                            type="button"
                            onClick={() => up({ design: d.value })}
                            className={`rounded-md border px-2 py-1.5 text-left text-xs transition ${
                                clk.design === d.value
                                    ? "border-blue-500 bg-blue-950/40 text-blue-200"
                                    : "border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-800"
                            }`}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
                {PALETTES[clk.design] && (
                    <button
                        type="button"
                        onClick={() => up(PALETTES[clk.design])}
                        className="mt-2 w-full rounded border border-gray-700/80 bg-gray-800/40 px-2 py-1.5 text-center text-[11px] font-medium text-gray-300 transition hover:border-gray-500 hover:bg-gray-800 hover:text-white"
                    >
                        ✨ Apply {DESIGNS.find((d) => d.value === clk.design)?.label} Curated Palette
                    </button>
                )}
            </div>

            {/* Time Mode */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Time Mode</label>
                <div className="flex gap-1.5">
                    {(["live", "custom", "static"] as const).map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => {
                                const updates: Partial<ClockElement> = { timeMode: m };
                                if (m === "custom" || m === "static") updates.startEpochMs = Date.now();
                                up(updates);
                            }}
                            className={`flex-1 rounded-md border px-2 py-1.5 text-xs capitalize transition ${
                                clk.timeMode === m
                                    ? "border-blue-500 bg-blue-950/40 text-blue-200"
                                    : "border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-800"
                            }`}
                        >
                            {m === "static" ? "Demo" : m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Time Inputs */}
            {(clk.timeMode === "custom" || clk.timeMode === "static") && (
                <div>
                    <label className="mb-2 block text-xs font-medium text-gray-400">
                        {clk.timeMode === "static" ? "Static Time (frozen)" : "Start Time (runs live from here)"}
                    </label>
                    <div className="flex gap-2">
                        {(["customHour", "customMinute", "customSecond"] as const).map((field, i) => (
                            <div key={field} className="flex flex-col items-center gap-1">
                                <input
                                    type="number"
                                    min="0"
                                    max={i === 0 ? 23 : 59}
                                    value={clk[field]}
                                    onChange={(e) => {
                                        const updates: Partial<ClockElement> = {
                                            [field]: Math.max(0, Math.min(i === 0 ? 23 : 59, Number(e.target.value))),
                                        };
                                        if (clk.timeMode === "custom") updates.startEpochMs = Date.now();
                                        up(updates);
                                    }}
                                    className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1.5 text-center text-sm text-white outline-none focus:border-blue-500"
                                />
                                <span className="text-[9px] text-gray-600">{["HH", "MM", "SS"][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 12h / 24h & Seconds */}
            <div className="flex gap-3">
                <button type="button"
                    onClick={() => up({ is24Hour: !clk.is24Hour })}
                    className={`flex-1 rounded-md border px-2 py-1.5 text-xs transition ${
                        clk.is24Hour ? "border-blue-500 bg-blue-950/40 text-blue-200" : "border-gray-700 text-gray-400 hover:border-gray-500"
                    }`}
                >
                    {clk.is24Hour ? "24h ✓" : "12h"}
                </button>
                <button type="button"
                    onClick={() => up({ showSeconds: !clk.showSeconds })}
                    className={`flex-1 rounded-md border px-2 py-1.5 text-xs transition ${
                        clk.showSeconds ? "border-blue-500 bg-blue-950/40 text-blue-200" : "border-gray-700 text-gray-400 hover:border-gray-500"
                    }`}
                >
                    {clk.showSeconds ? "Sec ✓" : "No Sec"}
                </button>
            </div>

            {/* Date */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">Date</label>
                    <button type="button"
                        onClick={() => up({ showDate: !clk.showDate })}
                        className={`rounded-md border px-2 py-0.5 text-[10px] transition ${
                            clk.showDate ? "border-blue-500 bg-blue-950/40 text-blue-200" : "border-gray-700 text-gray-500"
                        }`}
                    >
                        {clk.showDate ? "On" : "Off"}
                    </button>
                </div>
                {clk.showDate && (
                    <div className="space-y-2">
                        <div className="flex gap-1.5">
                            {(["live", "custom"] as const).map((m) => (
                                <button key={m} type="button"
                                    onClick={() => up({ dateMode: m })}
                                    className={`flex-1 rounded-md border px-2 py-1.5 text-xs capitalize transition ${
                                        clk.dateMode === m
                                            ? "border-blue-500 bg-blue-950/40 text-blue-200"
                                            : "border-gray-700 text-gray-400 hover:border-gray-500"
                                    }`}
                                >
                                    {m === "live" ? "Current" : "Custom"}
                                </button>
                            ))}
                        </div>
                        {clk.dateMode === "custom" && (
                            <input
                                type="text"
                                value={clk.customDateStr}
                                onChange={(e) => up({ customDateStr: e.target.value })}
                                placeholder="DD/MM/YYYY or any string"
                                className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500"
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Colors */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Colors</label>
                <div className="space-y-2">
                    {([
                        ["bgColor",     "Background"],
                        ["textColor",   "Text / Hands"],
                        ["accentColor", "Accent / Sec Hand"],
                        ["borderColor", "Border"],
                    ] as const).map(([field, label]) => (
                        <div key={field} className="flex items-center gap-3">
                            <input
                                type="color"
                                value={clk[field]}
                                onChange={(e) => up({ [field]: e.target.value })}
                                className="h-8 w-10 cursor-pointer rounded border border-gray-700 bg-gray-900"
                            />
                            <span className="text-xs text-gray-400">{label}</span>
                            <span className="ml-auto text-[10px] text-gray-600">{clk[field]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Border Width & Radius */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-xs text-gray-400">Border</label>
                        <span className="text-[10px] text-gray-600">{clk.borderWidth}px</span>
                    </div>
                    <input type="range" min="0" max="8" step="1" value={clk.borderWidth}
                        onChange={(e) => up({ borderWidth: Number(e.target.value) })}
                        className="w-full" />
                </div>
                <div>
                    <div className="mb-1 flex justify-between">
                        <label className="text-xs text-gray-400">Radius</label>
                        <span className="text-[10px] text-gray-600">{clk.borderRadius}px</span>
                    </div>
                    <input type="range" min="0" max="64" step="2" value={clk.borderRadius}
                        onChange={(e) => up({ borderRadius: Number(e.target.value) })}
                        className="w-full" />
                </div>
            </div>

            {/* Shadow */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Shadow</label>
                <div className="flex gap-1.5">
                    {(["none", "sm", "md", "lg"] as const).map((s) => (
                        <button key={s} type="button"
                            onClick={() => up({ shadow: s })}
                            className={`flex-1 rounded border px-2 py-1.5 text-xs transition ${
                                clk.shadow === s
                                    ? "border-blue-500 bg-blue-950/40 text-blue-200"
                                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                            }`}
                        >{s}</button>
                    ))}
                </div>
            </div>

            {/* Size */}
            <div>
                <div className="mb-2 flex justify-between">
                    <label className="text-xs font-medium text-gray-400">Size</label>
                    <span className="text-xs text-gray-500">{clk.size}%</span>
                </div>
                <input type="range" min="20" max="200" step="5" value={clk.size}
                    onChange={(e) => up({ size: Number(e.target.value) })}
                    className="w-full" />
            </div>

            {/* Rotation */}
            <div>
                <div className="mb-2 flex justify-between">
                    <label className="text-xs font-medium text-gray-400">Rotation</label>
                    <span className="text-xs text-gray-500">{clk.rotation}°</span>
                </div>
                <input type="range" min="-360" max="360" step="1" value={clk.rotation}
                    onChange={(e) => up({ rotation: Number(e.target.value) })}
                    className="w-full" />
            </div>

            {/* Opacity */}
            <div>
                <div className="mb-2 flex justify-between">
                    <label className="text-xs font-medium text-gray-400">Opacity</label>
                    <span className="text-xs text-gray-500">{Math.round((clk.opacity ?? 1) * 100)}%</span>
                </div>
                <input type="range" min="0" max="1" step="0.05" value={clk.opacity ?? 1}
                    onChange={(e) => up({ opacity: Number(e.target.value) })}
                    className="w-full" />
            </div>
        </div>
    );
}
