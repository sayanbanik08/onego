import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function BackendError() {
    const { isAuthenticated } = await auth();

    // User verified/authenticated nahi hai
    if (!isAuthenticated) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="w-full max-w-md text-center">

                {/* Error Icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m0 3.75h.008M10.29 3.86l-8.1 14.04A1.5 1.5 0 003.49 20h17.02a1.5 1.5 0 001.3-2.1l-8.1-14.04a1.5 1.5 0 00-2.6 0z"
                        />
                    </svg>
                </div>

                {/* Error Code */}
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-red-500">
                    Error 503
                </p>

                {/* Heading */}
                <h1 className="text-3xl font-bold text-gray-900">
                    Server Unavailable
                </h1>

                {/* Description */}
                <p className="mt-4 text-gray-600 leading-6">
                    We&apos;re unable to connect to the OneGo server right now.
                    The server may be temporarily offline or unavailable.
                </p>

                {/* Status Box */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>

                        <span className="text-sm font-medium text-gray-700">
                            Backend Server Offline
                        </span>
                    </div>
                </div>

                {/* Retry Message */}
                <p className="mt-6 text-sm text-gray-500">
                    Please try again once the server is running.
                </p>

            </div>
        </div>
    );
}
// ye page tab hi run hoga jab backend server unavailable hoga.
// ye page dashboard se redirect hoke aayega.
// agr mera fetch fail ho jata hai to ye page show hoga.
// ye page sirf tab hi show hoga jab mera backend server unavailable hoga.