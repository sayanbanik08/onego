"use client";

import type { FormDimensionUnit, FormElement, FormField, FormFieldType } from "../../../types/form";
import { FORM_THEME_PRESETS } from "../../../constants/formThemes";

type Props = {
    element: FormElement;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
};

const controlClass = "min-w-0 rounded-md border border-gray-700 bg-gray-950 px-2 py-1.5 text-xs text-white outline-none focus:border-teal-400";
const shadowPresets = ["none", "sm", "md", "lg", "xl", "neon", "3d-offset", "layered-steps", "custom"] as const;

function UnitControl({
    label,
    value,
    unit,
    onValue,
    onUnit,
    min = 0,
    max = 1000,
}: {
    label: string;
    value: number;
    unit: FormDimensionUnit;
    onValue: (value: number) => void;
    onUnit: (unit: FormDimensionUnit) => void;
    min?: number;
    max?: number;
}) {
    const activeMin = unit === "%" ? 1 : min;
    const activeMax = unit === "%" ? 100 : max;
    return (
        <label className="flex min-w-0 flex-col gap-1 text-[11px] text-gray-400">
            {label}
            <span className="flex min-w-0 gap-1">
                <input className={`${controlClass} w-full`} type="number" min={activeMin} max={activeMax} value={value} onChange={(event) => onValue(Math.min(activeMax, Math.max(activeMin, Number(event.target.value))))} />
                <select className={`${controlClass} w-14 shrink-0`} value={unit} onChange={(event) => onUnit(event.target.value as FormDimensionUnit)}>
                    <option value="px">px</option>
                    <option value="%">%</option>
                </select>
            </span>
            <input aria-label={`${label} slider`} className="w-full accent-teal-400" type="range" min={activeMin} max={activeMax} step={1} value={Math.min(activeMax, Math.max(activeMin, value))} onChange={(event) => onValue(Number(event.target.value))} />
        </label>
    );
}

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
    return (
        <label className="flex min-w-0 items-center justify-between gap-2 text-[11px] text-gray-400">
            <span className="truncate">{label}</span>
            <input aria-label={label} type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-7 w-9 shrink-0 cursor-pointer rounded border border-gray-700 bg-gray-950 p-0.5" />
        </label>
    );
}

export default function FormProperties({ element, updateElement }: Props) {
    const update = (updates: Partial<FormElement>) => updateElement(element.id, updates);
    const updateField = (fieldId: string, changes: Partial<FormField>) => {
        update({ fields: element.fields.map((field) => field.id === fieldId ? { ...field, ...changes } : field) });
    };

    const selectTheme = (theme: FormElement["theme"]) => {
        const preset = FORM_THEME_PRESETS[theme];
        const isLight = ["paper-atelier", "citrus-pop", "mono-brutalist"].includes(theme);
        update({
            theme,
            backgroundColor: preset.backgroundColor,
            borderColor: preset.borderColor,
            buttonBackgroundColor: preset.buttonBackgroundColor,
            buttonTextColor: preset.buttonTextColor,
            headingColor: isLight ? "#202721" : "#f4f7f8",
            descriptionColor: isLight ? "#53605a" : "#a9bbc0",
            fieldLabelColor: isLight ? "#202721" : "#f4f7f8",
        });
    };

    return (
        <div className="space-y-4 pb-8 text-white w-full min-w-0 overflow-x-hidden">
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-3">
                <div className="text-sm font-medium text-white">Element {element.serialNumber}</div>
                <div className="mt-1 text-xs text-gray-500">Type: Form</div>
            </div>

            <label className="block space-y-1 text-[11px] text-gray-400">
                Receiver email
                <input className={`${controlClass} w-full`} type="email" value={element.receiverEmail} placeholder="owner@example.com" onChange={(event) => update({ receiverEmail: event.target.value })} />
                <span className="block text-[10px] leading-relaxed text-gray-600">Responses open as a Gmail draft addressed here.</span>
            </label>

            <section className="rounded-lg border border-gray-800 bg-gray-900/30 p-3">
                <h3 className="text-xs font-semibold text-gray-200">Design presets</h3>
                <div className="mt-3 grid grid-cols-3 justify-items-center gap-x-1 gap-y-3">
                    {(Object.keys(FORM_THEME_PRESETS) as FormElement["theme"][]).map((theme) => {
                        const preset = FORM_THEME_PRESETS[theme];
                        const active = element.theme === theme;
                        return (
                            <div key={theme} className="flex flex-col items-center gap-1">
                                <button
                                    type="button"
                                    title={preset.label}
                                    aria-label={`Use ${preset.label} form design`}
                                    aria-pressed={active}
                                    onClick={() => selectTheme(theme)}
                                    className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${active ? "border-teal-200 ring-2 ring-teal-400/50 ring-offset-2 ring-offset-gray-950" : "border-gray-600 hover:scale-105 hover:border-white"}`}
                                    style={{ backgroundColor: preset.backgroundColor, backgroundImage: preset.backgroundImage }}
                                >
                                    <span className="flex h-7 w-8 flex-col justify-center gap-1 rounded-md border border-white/25 bg-black/15 px-1">
                                        <span className="h-0.5 w-5 rounded-full" style={{ backgroundColor: preset.buttonTextColor }} />
                                        <span className="h-1.5 w-5 rounded-full" style={{ backgroundColor: preset.buttonBackgroundColor }} />
                                    </span>
                                </button>
                                <span className="max-w-16 text-center text-[9px] leading-tight text-gray-400">{preset.label}</span>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="rounded-lg border border-gray-800 bg-gray-900/30 p-3">
                <h3 className="text-xs font-semibold text-gray-200">Content & fields</h3>
                <div className="mt-3 space-y-2.5">
                    <ColorControl label="Heading color" value={element.headingColor} onChange={(headingColor) => update({ headingColor })} />
                    <label className="block space-y-1 text-[11px] text-gray-400">Heading<input className={`${controlClass} w-full`} value={element.title} onChange={(event) => update({ title: event.target.value })} /></label>
                    <ColorControl label="Description color" value={element.descriptionColor} onChange={(descriptionColor) => update({ descriptionColor })} />
                    <label className="block space-y-1 text-[11px] text-gray-400">Description<textarea className={`${controlClass} w-full resize-y`} rows={2} value={element.description} onChange={(event) => update({ description: event.target.value })} /></label>
                    <ColorControl label="Field label color" value={element.fieldLabelColor} onChange={(fieldLabelColor) => update({ fieldLabelColor })} />
                    {element.fields.map((field, index) => (
                        <div key={field.id} className="space-y-2 rounded-md border border-gray-800 bg-black/25 p-2.5">
                            <div className="flex items-center justify-between text-[11px] font-medium text-gray-300">
                                <span>{field.locked ? (index === 0 ? "Required · Name" : "Required · Email") : `Field ${index - 1}`}</span>
                                {!field.locked && <button type="button" onClick={() => update({ fields: element.fields.filter((item) => item.id !== field.id) })} className="text-rose-400 hover:text-rose-300" aria-label={`Remove ${field.label}`}>Remove</button>}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <label className="space-y-1 text-[10px] text-gray-500">Label<input className={`${controlClass} w-full`} value={field.label} onChange={(event) => updateField(field.id, { label: event.target.value })} /></label>
                                <label className="space-y-1 text-[10px] text-gray-500">Placeholder<input className={`${controlClass} w-full`} value={field.placeholder} onChange={(event) => updateField(field.id, { placeholder: event.target.value })} /></label>
                            </div>
                            {!field.locked && (
                                <div className="flex items-center gap-2">
                                    <select aria-label="Field type" className={`${controlClass} min-w-0 flex-1`} value={field.type} onChange={(event) => updateField(field.id, { type: event.target.value as FormFieldType })}>
                                        <option value="text">Short text</option><option value="textarea">Long text</option><option value="email">Email</option><option value="tel">Phone</option><option value="number">Number</option><option value="date">Date</option>
                                    </select>
                                    <label className="flex shrink-0 items-center gap-1 text-[10px] text-gray-400"><input type="checkbox" checked={field.required} onChange={(event) => updateField(field.id, { required: event.target.checked })} />Required</label>
                                </div>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={() => update({ fields: [...element.fields, { id: crypto.randomUUID(), type: "text", label: "New field", placeholder: "Your answer", required: false }] })} className="w-full rounded-md border border-dashed border-gray-700 py-2 text-xs text-gray-300 hover:border-teal-400 hover:text-white">+ Add field</button>
                </div>
            </section>

            <section className="rounded-lg border border-gray-800 bg-gray-900/30 p-3">
                <h3 className="text-xs font-semibold text-gray-200">Form frame</h3>
                <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <UnitControl label="Width" value={element.width} unit={element.widthUnit} onValue={(width) => update({ width })} onUnit={(widthUnit) => update({ widthUnit })} min={10} />
                        <UnitControl label="Height" value={element.height} unit={element.heightUnit} onValue={(height) => update({ height })} onUnit={(heightUnit) => update({ heightUnit })} min={100} />
                        <UnitControl label="Corner radius" value={element.borderRadius} unit={element.borderRadiusUnit} onValue={(borderRadius) => update({ borderRadius })} onUnit={(borderRadiusUnit) => update({ borderRadiusUnit })} />
                        <UnitControl label="Border width" value={element.borderWidth} unit={element.borderWidthUnit} onValue={(borderWidth) => update({ borderWidth })} onUnit={(borderWidthUnit) => update({ borderWidthUnit })} max={100} />
                    </div>
                    <label className="block space-y-1 text-[11px] text-gray-400">Border style<select className={`${controlClass} w-full`} value={element.borderStyle} onChange={(event) => update({ borderStyle: event.target.value as FormElement["borderStyle"] })}><option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option><option value="none">None</option></select></label>
                        <div className="grid grid-cols-2 gap-3"><ColorControl label="Background" value={element.backgroundColor} onChange={(backgroundColor) => update({ backgroundColor, theme: "custom" })} /><ColorControl label="Border color" value={element.borderColor} onChange={(borderColor) => update({ borderColor })} /></div>
                </div>
                    </section>

            <section className="rounded-lg border border-gray-800 bg-gray-900/30 p-3">
                <h3 className="text-xs font-semibold text-gray-200">Submit button</h3>
                <div className="mt-3 space-y-2.5">
                    <label className="block space-y-1 text-[11px] text-gray-400">Button text<input className={`${controlClass} w-full`} value={element.submitText} onChange={(event) => update({ submitText: event.target.value })} /></label>
                    <label className="block space-y-1 text-[11px] text-gray-400">Button style<select className={`${controlClass} w-full`} value={element.buttonStyle} onChange={(event) => update({ buttonStyle: event.target.value as FormElement["buttonStyle"] })}><option value="solid">Solid</option><option value="outline">Outline</option><option value="gradient">Gradient</option><option value="glass">Glass</option><option value="pill">Pill</option></select></label>
                    <div className="grid grid-cols-2 gap-2">
                        <UnitControl label="Width" value={element.buttonWidth} unit={element.buttonWidthUnit} onValue={(buttonWidth) => update({ buttonWidth })} onUnit={(buttonWidthUnit) => update({ buttonWidthUnit })} min={10} />
                        <UnitControl label="Height" value={element.buttonHeight} unit={element.buttonHeightUnit} onValue={(buttonHeight) => update({ buttonHeight })} onUnit={(buttonHeightUnit) => update({ buttonHeightUnit })} min={20} />
                        <UnitControl label="Corner radius" value={element.buttonBorderRadius} unit={element.buttonBorderRadiusUnit} onValue={(buttonBorderRadius) => update({ buttonBorderRadius })} onUnit={(buttonBorderRadiusUnit) => update({ buttonBorderRadiusUnit })} />
                        <label className="flex min-w-0 flex-col gap-1 text-[11px] text-gray-400">Border width <span className="text-right">{element.buttonBorderWidth}px</span><input className="w-full accent-teal-400" type="range" min={0} max={20} value={element.buttonBorderWidth} onChange={(event) => update({ buttonBorderWidth: Number(event.target.value) })} /></label>
                    </div>
                    <label className="block space-y-1 text-[11px] text-gray-400">Border style<select className={`${controlClass} w-full`} value={element.buttonBorderStyle} onChange={(event) => update({ buttonBorderStyle: event.target.value as FormElement["buttonBorderStyle"] })}><option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option><option value="none">None</option></select></label>
                    <div className="grid grid-cols-3 gap-2"><ColorControl label="Fill" value={element.buttonBackgroundColor} onChange={(buttonBackgroundColor) => update({ buttonBackgroundColor })} /><ColorControl label="Text" value={element.buttonTextColor} onChange={(buttonTextColor) => update({ buttonTextColor })} /><ColorControl label="Border" value={element.buttonBorderColor} onChange={(buttonBorderColor) => update({ buttonBorderColor })} /></div>
                </div>
            </section>

            <section className="rounded-lg border border-gray-800 bg-gray-900/30 p-3">
                <h3 className="text-xs font-semibold text-gray-200">Transform & scale</h3>
                <div className="mt-3 space-y-3">
                    <label className="block text-[11px] text-gray-400">Scale <span className="float-right">{element.size}%</span><input className="mt-2 w-full accent-teal-400" type="range" min={10} max={250} value={element.size} onChange={(event) => update({ size: Number(event.target.value) })} /></label>
                    <label className="block text-[11px] text-gray-400">Rotation <span className="float-right">{element.rotation}°</span><input className="mt-2 w-full accent-teal-400" type="range" min={-180} max={180} value={element.rotation} onChange={(event) => update({ rotation: Number(event.target.value) })} /></label>
                    <label className="block text-[11px] text-gray-400">Opacity <span className="float-right">{Math.round(element.opacity * 100)}%</span><input className="mt-2 w-full accent-teal-400" type="range" min={0} max={1} step={0.01} value={element.opacity} onChange={(event) => update({ opacity: Number(event.target.value) })} /></label>
                </div>
            </section>

            <section className="rounded-lg border border-gray-800 bg-gray-900/30 p-3">
                <h3 className="text-xs font-semibold text-gray-200">Shadow effects</h3>
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {shadowPresets.map((shadow) => <button key={shadow} type="button" onClick={() => update({ shadow })} className={`rounded border px-1 py-1.5 text-[10px] capitalize ${element.shadow === shadow ? "border-teal-400 bg-teal-950/50 text-teal-200" : "border-gray-700 text-gray-400 hover:text-white"}`}>{shadow.replace("3d-offset", "3D offset").replace("layered-steps", "Steps")}</button>)}
                </div>
                {element.shadow === "custom" && (
                    <div className="mt-3 space-y-2.5">
                        <ColorControl label="Shadow color" value={element.shadowColor} onChange={(shadowColor) => update({ shadowColor })} />
                        {(["shadowBlur", "shadowOffsetX", "shadowOffsetY", "shadowSpread"] as const).map((property) => (
                            <label key={property} className="block text-[11px] capitalize text-gray-400">{property.replace("shadow", "").replace("Offset", " offset ")} <span className="float-right">{element[property]}px</span><input className="mt-1 w-full accent-teal-400" type="range" min={property === "shadowBlur" ? 0 : -30} max={property === "shadowBlur" ? 50 : 30} value={element[property]} onChange={(event) => update({ [property]: Number(event.target.value) })} /></label>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}