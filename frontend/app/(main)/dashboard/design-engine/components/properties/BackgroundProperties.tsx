import { useState } from "react";
import type { DashboardBackgroundSettings, BackgroundType } from "../../types/elements";

const DEFAULT_BG: DashboardBackgroundSettings = {
    type: "solid",
    color: "#ffffff",
    gradientType: "linear",
    gradientAngle: 135,
    gradientColor1: "#0f172a",
    gradientColor2: "#1e1b4b",
    imageUrl: "",
    imageFit: "cover",
    imageOpacity: 1,
    imageBlur: 0,
    imageOverlayColor: "#000000",
    imageOverlayOpacity: 0.2,
    showGridDots: true,
    gridDotsColor: "#b8b8b8",
    gridDotsSize: 20,
};

type Props = {
    backgroundSettings?: DashboardBackgroundSettings;
    updateBackgroundSettings: (updates: Partial<DashboardBackgroundSettings>) => void;
};

export default function BackgroundProperties({ backgroundSettings, updateBackgroundSettings }: Props) {
    const [bgImageTab, setBgImageTab] = useState<"url" | "upload">("upload");
    const bg = backgroundSettings ?? DEFAULT_BG;
    const upBg = updateBackgroundSettings;

    return (
        <div className="mt-4 space-y-5">

            {/* Header */}
            <div className="rounded-lg border border-purple-800/50 bg-purple-900/20 px-3 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🎨</span>
                    <div>
                        <div className="text-sm font-medium text-white">Dashboard Background</div>
                        <div className="text-xs text-gray-400">Canvas-wide background settings</div>
                    </div>
                </div>
            </div>

            {/* Background Type */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Background Type</label>
                <div className="grid grid-cols-3 gap-1 rounded-lg border border-gray-700 bg-gray-900 p-1">
                    {(["solid", "gradient", "image"] as BackgroundType[]).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => upBg({ type: t })}
                            className={`rounded-md py-1.5 text-xs font-medium capitalize transition ${
                                bg.type === t
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* ─── SOLID ─── */}
            {bg.type === "solid" && (
                <div>
                    <label className="mb-2 block text-xs font-medium text-gray-400">Color</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={bg.color}
                            onChange={(e) => upBg({ color: e.target.value })}
                            className="h-9 w-12 cursor-pointer rounded border border-gray-700 bg-gray-900"
                        />
                        <span className="text-sm text-gray-300">{bg.color}</span>
                    </div>
                </div>
            )}

            {/* ─── GRADIENT ─── */}
            {bg.type === "gradient" && (
                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-xs font-medium text-gray-400">Gradient Style</label>
                        <div className="flex gap-2">
                            {(["linear", "radial"] as const).map((gt) => (
                                <button
                                    key={gt}
                                    type="button"
                                    onClick={() => upBg({ gradientType: gt })}
                                    className={`flex-1 rounded-md border py-1.5 text-xs capitalize transition ${
                                        bg.gradientType === gt
                                            ? "border-purple-500 bg-purple-600/20 text-purple-300"
                                            : "border-gray-700 text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {gt}
                                </button>
                            ))}
                        </div>
                    </div>
                    {bg.gradientType === "linear" && (
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-xs font-medium text-gray-400">Angle</label>
                                <span className="text-xs text-gray-500">{bg.gradientAngle}°</span>
                            </div>
                            <input
                                type="range" min="0" max="360" step="1"
                                value={bg.gradientAngle}
                                onChange={(e) => upBg({ gradientAngle: Number(e.target.value) })}
                                className="w-full"
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs text-gray-400">Color 1</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={bg.gradientColor1}
                                    onChange={(e) => upBg({ gradientColor1: e.target.value })}
                                    className="h-8 w-10 cursor-pointer rounded border border-gray-700 bg-gray-900" />
                                <span className="text-xs text-gray-400">{bg.gradientColor1}</span>
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-gray-400">Color 2</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={bg.gradientColor2}
                                    onChange={(e) => upBg({ gradientColor2: e.target.value })}
                                    className="h-8 w-10 cursor-pointer rounded border border-gray-700 bg-gray-900" />
                                <span className="text-xs text-gray-400">{bg.gradientColor2}</span>
                            </div>
                        </div>
                    </div>
                    {/* Preview swatch */}
                    <div
                        className="h-10 w-full rounded-lg border border-gray-700"
                        style={{
                            background: bg.gradientType === "radial"
                                ? `radial-gradient(circle, ${bg.gradientColor1}, ${bg.gradientColor2})`
                                : `linear-gradient(${bg.gradientAngle}deg, ${bg.gradientColor1}, ${bg.gradientColor2})`,
                        }}
                    />
                </div>
            )}

            {/* ─── IMAGE ─── */}
            {bg.type === "image" && (
                <div className="space-y-4">
                    {/* Tab: upload vs URL */}
                    <div className="flex gap-1 rounded-lg border border-gray-700 bg-gray-900 p-1">
                        {(["upload", "url"] as const).map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setBgImageTab(tab)}
                                className={`flex-1 rounded-md py-1 text-xs capitalize transition ${
                                    bgImageTab === tab
                                        ? "bg-purple-600 text-white"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                {tab === "upload" ? "Upload File" : "Image URL"}
                            </button>
                        ))}
                    </div>
                    {bgImageTab === "upload" ? (
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-400">Upload Image</label>
                            <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-600 bg-gray-900 py-5 transition hover:border-purple-500">
                                <span className="text-2xl">🖼️</span>
                                <span className="text-xs text-gray-400">Click to choose image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const url = URL.createObjectURL(file);
                                        upBg({ imageUrl: url });
                                    }}
                                />
                            </label>
                            {bg.imageUrl && (
                                <div className="mt-2 overflow-hidden rounded-lg border border-gray-700">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={bg.imageUrl} alt="bg preview" className="h-20 w-full object-cover" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-400">Image URL</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={bg.imageUrl}
                                onChange={(e) => upBg({ imageUrl: e.target.value })}
                                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                            />
                        </div>
                    )}

                    {/* Image Fit */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-gray-400">Fit</label>
                        <div className="grid grid-cols-3 gap-1 rounded-lg border border-gray-700 bg-gray-900 p-1">
                            {(["cover", "contain", "tile"] as const).map((f) => (
                                <button key={f} type="button"
                                    onClick={() => upBg({ imageFit: f })}
                                    className={`rounded-md py-1 text-xs capitalize transition ${
                                        bg.imageFit === f
                                            ? "bg-purple-600 text-white"
                                            : "text-gray-400 hover:text-white"
                                    }`}
                                >{f}</button>
                            ))}
                        </div>
                    </div>

                    {/* Image Opacity */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-400">Image Opacity</label>
                            <span className="text-xs text-gray-500">{Math.round(bg.imageOpacity * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.05" value={bg.imageOpacity}
                            onChange={(e) => upBg({ imageOpacity: Number(e.target.value) })}
                            className="w-full" />
                    </div>

                    {/* Blur */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-400">Blur</label>
                            <span className="text-xs text-gray-500">{bg.imageBlur}px</span>
                        </div>
                        <input type="range" min="0" max="30" step="1" value={bg.imageBlur}
                            onChange={(e) => upBg({ imageBlur: Number(e.target.value) })}
                            className="w-full" />
                    </div>

                    {/* Overlay */}
                    <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                        <div className="text-xs font-medium text-gray-400">Color Overlay</div>
                        <div className="flex items-center gap-2">
                            <input type="color" value={bg.imageOverlayColor}
                                onChange={(e) => upBg({ imageOverlayColor: e.target.value })}
                                className="h-8 w-10 cursor-pointer rounded border border-gray-700 bg-gray-900" />
                            <span className="text-xs text-gray-400">{bg.imageOverlayColor}</span>
                        </div>
                        <div>
                            <div className="mb-1 flex items-center justify-between">
                                <label className="text-xs text-gray-400">Overlay Opacity</label>
                                <span className="text-xs text-gray-500">{Math.round(bg.imageOverlayOpacity * 100)}%</span>
                            </div>
                            <input type="range" min="0" max="1" step="0.05" value={bg.imageOverlayOpacity}
                                onChange={(e) => upBg({ imageOverlayOpacity: Number(e.target.value) })}
                                className="w-full" />
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Grid Dots ─── */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">Grid Dots</span>
                    <button
                        type="button"
                        onClick={() => upBg({ showGridDots: !bg.showGridDots })}
                        className={`relative h-5 w-9 rounded-full transition-colors ${
                            bg.showGridDots ? "bg-purple-600" : "bg-gray-700"
                        }`}
                    >
                        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                            bg.showGridDots ? "left-4" : "left-0.5"
                        }`} />
                    </button>
                </div>
                {bg.showGridDots && (
                    <>
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-400">Dot Color</label>
                            <input type="color" value={bg.gridDotsColor}
                                onChange={(e) => upBg({ gridDotsColor: e.target.value })}
                                className="h-7 w-9 cursor-pointer rounded border border-gray-700 bg-gray-900" />
                        </div>
                        <div>
                            <div className="mb-1 flex items-center justify-between">
                                <label className="text-xs text-gray-400">Dot Spacing</label>
                                <span className="text-xs text-gray-500">{bg.gridDotsSize}px</span>
                            </div>
                            <input type="range" min="10" max="50" step="2" value={bg.gridDotsSize}
                                onChange={(e) => upBg({ gridDotsSize: Number(e.target.value) })}
                                className="w-full" />
                        </div>
                    </>
                )}
            </div>

            {/* Reset button */}
            <button
                type="button"
                onClick={() => upBg(DEFAULT_BG)}
                className="w-full rounded-lg border border-gray-700 py-2 text-xs text-gray-400 transition hover:border-red-700 hover:bg-red-900/20 hover:text-red-400"
            >
                Reset to Default
            </button>
        </div>
    );
}
