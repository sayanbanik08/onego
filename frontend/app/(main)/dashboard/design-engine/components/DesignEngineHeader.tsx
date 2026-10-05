type DesignEngineHeaderProps = {};

export default function DesignEngineHeader({}: DesignEngineHeaderProps) {
    return (
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
    );
}