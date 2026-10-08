import {
    Eraser,
    MousePointerClick,
    SlidersHorizontal,
    Minus,
    Grid3X3,
    CreditCard,
    List,
    Gauge,
    Clock,
    GitBranch,
    Table,
    ClipboardPenLine,
} from "lucide-react";

type ElementListProps = {
    onAddText: () => void;
    onToggleDraw: () => void;
    isDrawMode: boolean;
    onToggleEraser: () => void;
    isEraserMode: boolean;
    onAddTable: () => void;
    onAddClock: () => void;
    onAddTimeline?: () => void;
    onAddCard?: () => void;
    onAddButton?: () => void;
    onSelectBackground?: () => void;
    isBackgroundMode?: boolean;
};

export default function ElementList({
    onAddText,
    onToggleDraw,
    isDrawMode,
    onToggleEraser,
    isEraserMode,
    onAddTable,
    onAddClock,
    onAddTimeline,
    onAddCard,
    onAddButton,
    onSelectBackground,
    isBackgroundMode = false,
}: ElementListProps) {
    return (
        <div className="space-y-2">

            {/* Navigation */}
            <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800 font-semibold">
                    ⤹⤷
                </span>
                <span>Navigation</span>
            </button>

            {/* Draw */}
            <button
                type="button"
                onClick={onToggleDraw}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${
                    isDrawMode
                        ? "border-blue-500 bg-blue-950/40 text-blue-200 shadow-sm"
                        : "border-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-900"
                }`}
            >
                <span
                    className={`flex h-7 w-7 items-center justify-center rounded-md font-semibold ${
                        isDrawMode ? "bg-blue-600/30" : "bg-gray-800"
                    }`}
                >
                    ✏️
                </span>
                <span className="flex-1">Draw</span>
                {isDrawMode && (
                    <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                        Active
                    </span>
                )}
            </button>

            {/* Eraser */}
            <button
                type="button"
                onClick={onToggleEraser}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${
                    isEraserMode
                        ? "border-rose-500 bg-rose-950/40 text-rose-200 shadow-sm"
                        : "border-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-900"
                }`}
            >
                <span
                    className={`flex h-7 w-7 items-center justify-center rounded-md ${
                        isEraserMode ? "bg-rose-600/30 text-rose-300" : "bg-gray-800"
                    }`}
                >
                    <Eraser size={17} />
                </span>
                <span className="flex-1">Eraser</span>
                {isEraserMode && (
                    <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-medium text-rose-400">
                        Active
                    </span>
                )}
            </button>

            {/* Clickable Element */}
            <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    <MousePointerClick size={17} />
                </span>
                <span>Clickable Element</span>
            </button>

            {/* Sliders */}
            <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    <SlidersHorizontal size={17} />
                </span>
                <span>Sliders</span>
            </button>

            {/* Text */}
            <button
                type="button"
                onClick={onAddText}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800 font-semibold">
                    T
                </span>
                <span>Text</span>
            </button>

            {/* Image */}
            <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    🖼
                </span>
                <span>Image</span>
            </button>

            {/* Button / Link */}
            <button
                type="button"
                onClick={onAddButton}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm text-gray-300 transition hover:border-gray-500 hover:bg-gray-900 active:scale-[0.99]"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800 text-blue-400">
                    🔗
                </span>
                <span className="flex-1">Button / Link</span>
                <span className="rounded bg-gray-800/80 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                    + Add
                </span>
            </button>

            {/* Shape */}
            <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    □
                </span>
                <span>Shape</span>
            </button>

            {/* Icon */}
            <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    ★
                </span>
                <span>Icon</span>
            </button>

            {/* Dashboard Background */}
            <button
                type="button"
                onClick={onSelectBackground}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${
                    isBackgroundMode
                        ? "border-purple-500 bg-purple-950/40 text-purple-200 shadow-sm"
                        : "border-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-900"
                }`}
            >
                <span
                    className={`flex h-7 w-7 items-center justify-center rounded-md font-semibold ${
                        isBackgroundMode ? "bg-purple-600/30" : "bg-gray-800"
                    }`}
                >
                    🎨
                </span>
                <span className="flex-1">Dashboard Background</span>
                {isBackgroundMode ? (
                    <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-medium text-purple-400">
                        Active
                    </span>
                ) : (
                    <span className="rounded bg-gray-800/80 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                        Edit
                    </span>
                )}
            </button>

            {/* Divider / Line */}
            <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    <Minus size={17} />
                </span>
                <span>Divider Line</span>
            </button>

            {/* Grid */}
            <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    <Grid3X3 size={17} />
                </span>
                <span>Grid</span>
            </button>

            {/* Card */}
            <button
                type="button"
                onClick={onAddCard}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm text-gray-300 transition hover:border-gray-500 hover:bg-gray-900 active:scale-[0.99]"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800 text-blue-400">
                    <CreditCard size={17} />
                </span>
                <span className="flex-1">Card</span>
                <span className="rounded bg-gray-800/80 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                    + Add
                </span>
            </button>

            {/* List */}
            <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    <List size={17} />
                </span>
                <span>List</span>
            </button>

            {/* Progress */}
            <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    <Gauge size={17} />
                </span>
                <span>Progress</span>
            </button>

            {/* Counter */}
            <button
                type="button"
                onClick={onAddClock}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm text-gray-300 transition hover:border-gray-500 hover:bg-gray-900 active:scale-[0.99]"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800 text-blue-400">
                    <Clock size={17} />
                </span>
                <span className="flex-1">Clock counter</span>
                <span className="rounded bg-gray-800/80 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                    + Add
                </span>
            </button>

            {/* Timeline */}
            <button
                type="button"
                onClick={onAddTimeline}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm text-gray-300 transition hover:border-gray-500 hover:bg-gray-900 active:scale-[0.99]"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800 text-blue-400">
                    <GitBranch size={17} />
                </span>
                <span className="flex-1">Timeline</span>
                <span className="rounded bg-gray-800/80 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                    + Add
                </span>
            </button>

            {/* Table */}
            <button
                type="button"
                onClick={onAddTable}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm text-gray-300 transition hover:border-gray-500 hover:bg-gray-900 active:scale-[0.99]"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800 text-blue-400">
                    <Table size={17} />
                </span>
                <span className="flex-1">Table</span>
                <span className="rounded bg-gray-800/80 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                    + Add
                </span>
            </button>

            {/* Form */}
            <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    <ClipboardPenLine size={17} />
                </span>
                <span>Form</span>
            </button>

        </div>
    );
}