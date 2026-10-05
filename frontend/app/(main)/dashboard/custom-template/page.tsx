"use client";
import { useRouter } from "next/navigation";
export default function CustomTemplatePage() {
    const router = useRouter();
    return (
        <main className="min-h-screen bg-black p-8 text-white">
            <h1 className="text-2xl font-semibold">
                Custom Template
            </h1>

            <div className="mt-8">
                <button
                    type="button"
                    onClick={() => router.push("/dashboard/design-engine")}
                    className="flex h-40 w-40 items-center justify-center rounded-2xl border-4 border-dashed border-gray-700
                    text-gray-400 transition-all duration-300
                    hover:border-white hover:text-white
                    hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]"
                >
                    <span className="text-4xl font-light">+</span>
                </button>

                <p className="mt-3 text-sm text-white">
                    Create Custom Template
                </p>
            </div>
        </main>
    );
}
