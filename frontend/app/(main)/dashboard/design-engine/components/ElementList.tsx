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
};

export default function ElementList({
    onAddText,
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
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800 font-semibold">
                    ✏️
                </span>
                <span>Draw</span>
            </button>

            {/* Eraser */}
            <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    <Eraser size={17} />
                </span>
                <span>Eraser</span>
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
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    🔗
                </span>
                <span>Button / Link</span>
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
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    🎨
                </span>
                <span>Dashboard Background</span>
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
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    <CreditCard size={17} />
                </span>
                <span>Card</span>
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
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    <Clock size={17} />
                </span>
                <span>Clock counter</span>
            </button>

            {/* Timeline */}
            <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    <GitBranch size={17} />
                </span>
                <span>Timeline</span>
            </button>

            {/* Table */}
            <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 px-4 py-3 text-left text-sm transition hover:border-gray-500 hover:bg-gray-900"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                    <Table size={17} />
                </span>
                <span>Table</span>
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