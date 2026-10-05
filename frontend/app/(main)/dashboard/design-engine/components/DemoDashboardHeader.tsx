import { Search, Settings } from "lucide-react";

export default function DemoDashboardHeader() {
    return (
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
    );
}