import { Search, Settings, Eraser } from "lucide-react";

export default function DesignEnginePage() {
    return (
        <main className="h-screen overflow-hidden bg-black text-white">

            {/* Header */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-800 px-6">
                <h1 className="text-lg font-semibold">
                    Design Engine
                </h1>

                <button
                    type="button"
                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm transition hover:border-white"
                >
                    Save
                </button>
            </header>

            {/* Editor Area */}
            <div className="flex h-[calc(100vh-4rem)] min-h-0">

                {/* Left Panel */}
                <aside className="w-66 shrink-0 min-h-0 border-r border-gray-800 p-5">
                    <div
                        className="h-full overflow-y-auto"
                        style={{
                            direction: "rtl",
                            scrollbarWidth: "thin",
                            scrollbarColor: "white transparent",
                        }}
                    >
                        <div style={{ direction: "ltr" }}>

                            <h2 className="mb-4 text-center text-sm font-semibold text-gray-300">
                                Elements
                            </h2>

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

                                {/* Text */}
                                <button
                                    type="button"
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

                            </div>
                        </div>
                    </div>
                </aside>

                {/* Canvas */}
                <section className="min-h-0 flex-1 overflow-y-auto">

                    {/* White Portfolio Canvas */}
                    <div
                        className="min-h-[1200px] w-full bg-white"
                        style={{
                            backgroundImage: "radial-gradient(#b8b8b8 1px, transparent 1px)",
                            backgroundSize: "20px 20px",
                        }}
                    >

                        {/* Demo Fixed Dashboard Header */}
                        <div className="pointer-events-none relative flex h-20 items-center px-6">

                            {/* Left side + Search */}
                            <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3">

                                {/* Generic Demo Profile */}
                                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-100 text-2xl">
                                    👨🏻‍💻
                                </div>

                                {/* Search Box */}
                                <div className="flex h-10 w-80 items-center rounded-full border border-gray-300 bg-white px-4 shadow-sm">

                                    <Search
                                        size={18}
                                        className="mr-3 shrink-0 text-gray-400"
                                    />

                                    <span className="text-sm text-gray-400">
                                        Search by ID
                                    </span>

                                </div>

                            </div>

                            {/* Right Side */}
                            <div className="ml-auto flex items-center gap-4">

                                {/* Demo Settings */}
                                <div className="flex h-10 w-10 items-center justify-center text-gray-800">
                                    <Settings size={30} strokeWidth={1.8} />
                                </div>
                            </div>

                        </div>

                        {/* EDITABLE DESIGN AREA */}
                        <div className="min-h-[1120px]">
                            {/* User's custom design will be built here */}
                        </div>

                    </div>

                </section>

                {/* Right Panel */}
                <aside className="w-72 shrink-0 border-l border-gray-800 p-5">
                    <h2 className="text-sm font-semibold text-gray-300">
                        Properties
                    </h2>
                </aside>

            </div>
        </main >
    );
}