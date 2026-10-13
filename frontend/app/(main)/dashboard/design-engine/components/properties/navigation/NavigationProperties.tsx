import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { NavigationElement } from "../../../types/navigation";
import type { CanvasDocument } from "../../../types/workspace";
import ImageDimensionsSection from "../image/ImageDimensionsSection";
import ImageTransformSection from "../image/ImageTransformSection";
import ImageShadowSection from "../image/ImageShadowSection";

type NavigationPropertiesProps = {
    element: NavigationElement;
    canvases: CanvasDocument[];
    updateElement: (id: string, updates: Partial<NavigationElement>) => void;
    onCreateCanvas: (name: string) => void;
};

export default function NavigationProperties({
    element,
    canvases,
    updateElement,
    onCreateCanvas,
}: NavigationPropertiesProps) {
    const [newCanvasName, setNewCanvasName] = useState("");

    const updateLink = (
        linkId: string,
        updates: Partial<NavigationElement["links"][number]>
    ) => {
        const links = element.links.map((link) =>
            link.id === linkId ? { ...link, ...updates } : link
        );
        updateElement(element.id, { links });
    };

    const updateNavigation = (updates: Partial<NavigationElement>) => {
        updateElement(element.id, updates);
    };

    const dimensionElement = {
        ...element,
        width: element.width ?? 520,
        widthUnit: element.widthUnit ?? "px",
        height: element.height ?? 78,
        heightUnit: element.heightUnit ?? "px",
    };

    return (
        <div className="space-y-5 py-4">
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-200">Links</h3>
                    <button
                        type="button"
                        onClick={() => updateElement(element.id, {
                            links: [...element.links, {
                                id: crypto.randomUUID(),
                                label: "New link",
                                href: "#",
                            }],
                        })}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-800 hover:text-white"
                        title="Add link"
                    >
                        <Plus size={16} />
                    </button>
                </div>
                {element.links.map((link, index) => (
                    <div key={link.id} className="space-y-3 rounded-md border border-gray-800 p-3">
                        <div className="flex items-end gap-2">
                            <div className="shrink-0 space-y-1.5">
                                <span className="block text-xs text-gray-400">Icon</span>
                                <div
                                    aria-label={`Icon placeholder for ${link.label}`}
                                    title="Place an Icon element here on the canvas"
                                    className="h-9 w-9 rounded-md border border-dashed border-gray-600"
                                />
                            </div>
                            <label className="min-w-0 flex-1 space-y-1.5 text-xs text-gray-400">
                                Name
                                <input
                                    aria-label={`Link ${index + 1} name`}
                                    value={link.label}
                                    onChange={(event) => updateLink(link.id, { label: event.target.value })}
                                    className="w-full rounded-md border border-gray-700 bg-gray-900 px-2.5 py-2 text-sm text-white outline-none focus:border-teal-500"
                                />
                            </label>
                            <button
                                type="button"
                                onClick={() => updateElement(element.id, {
                                    links: element.links.filter((item) => item.id !== link.id),
                                })}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 transition hover:bg-rose-950 hover:text-rose-300"
                                title={`Remove ${link.label || "link"}`}
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                        <label className="block space-y-1.5 text-xs text-gray-400">
                            Link
                            <select
                                aria-label={`Link ${index + 1} destination`}
                                value={link.canvasId ?? ""}
                                onChange={(event) => updateLink(link.id, {
                                    canvasId: event.target.value || undefined,
                                })}
                                className="w-full rounded-md border border-gray-700 bg-gray-900 px-2.5 py-2 text-xs text-white outline-none focus:border-teal-500"
                            >
                                <option value="">External URL</option>
                                {canvases.map((canvas) => (
                                    <option key={canvas.id} value={canvas.id}>
                                        Canvas: {canvas.name}
                                    </option>
                                ))}
                            </select>
                            {!link.canvasId && (
                                <input
                                    aria-label={`Link ${index + 1} URL`}
                                    value={link.href}
                                    onChange={(event) => updateLink(link.id, {
                                        href: event.target.value,
                                        canvasId: undefined,
                                    })}
                                    placeholder="#section or https://example.com"
                                    className="w-full rounded-md border border-gray-700 bg-gray-900 px-2.5 py-2 text-xs text-gray-300 outline-none focus:border-teal-500"
                                />
                            )}
                        </label>
                    </div>
                ))}
            </section>

            <section className="space-y-3 border-t border-gray-800 pt-4">
                <h3 className="text-sm font-medium text-gray-200">Create a canvas</h3>
                <label className="block space-y-1.5 text-xs text-gray-400">
                    Canvas name
                    <input
                        value={newCanvasName}
                        onChange={(event) => setNewCanvasName(event.target.value)}
                        placeholder={`Canvas ${canvases.length + 1}`}
                        className="w-full rounded-md border border-gray-700 bg-gray-900 px-2.5 py-2 text-sm text-white outline-none focus:border-teal-500"
                    />
                </label>
                <button
                    type="button"
                    disabled={!newCanvasName.trim()}
                    onClick={() => {
                        onCreateCanvas(newCanvasName.trim());
                        setNewCanvasName("");
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-200 transition hover:border-gray-500 hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Plus size={16} />
                    Create and link canvas
                </button>
            </section>

            <section className="space-y-3 border-t border-gray-800 pt-4">
                <h3 className="text-sm font-medium text-gray-200">Colors</h3>
                {([
                    ["Background", "backgroundColor"],
                    ["Link text", "textColor"],
                    ["Accent", "accentColor"],
                ] as const).map(([label, key]) => (
                    <label key={key} className="flex items-center justify-between text-sm text-gray-400">
                        {label}
                        <input
                            type="color"
                            value={element[key]}
                            onChange={(event) => updateElement(element.id, { [key]: event.target.value })}
                            className="h-8 w-10 cursor-pointer rounded border border-gray-700 bg-transparent p-0.5"
                        />
                    </label>
                ))}
            </section>

            <ImageDimensionsSection
                element={dimensionElement}
                updateElement={updateNavigation}
                defaultWidth={520}
                defaultHeight={78}
            />
            <ImageTransformSection
                element={element}
                updateElement={updateNavigation}
            />
            <ImageShadowSection
                element={element}
                updateElement={updateNavigation}
            />
        </div>
    );
}