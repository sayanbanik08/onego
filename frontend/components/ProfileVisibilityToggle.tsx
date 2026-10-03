"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ProfileVisibilityToggle() {
    const router = useRouter();
    const { getToken } = useAuth();
    const { user } = useUser();
    const [isPublic, setIsPublic] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getPrivacyStatus = async () => {

            if (!user) {
                router.push("/login");
                return;
            }

            try {
                const token = await getToken();

                if (!token) {
                    router.push("/login");
                    return;
                }

                const response = await fetch(
                    "http://localhost:8080/api/privacy",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,

                            // Added: backend ko current Clerk user ID bhejne ke liye
                            "X-Clerk-User-Id": user.id
                        }
                    }
                );

                if (!response.ok) {
                    setError("Unable to load profile visibility.");
                    return;
                }

                const result = await response.json();
                setIsPublic(result.account_status === "PUBLIC");
                setError(null);

            } catch (error) {
                router.push("/backend-error");
            }
        };

        getPrivacyStatus();
    }, [user, getToken, router]);

    const handleToggle = async () => {
        const newIsPublic = !isPublic;

        setIsUpdating(true);
        setError(null);

        try {
            const token = await getToken();

            if (!token || !user) {
                router.push("/login");
                return;
            }

            const response = await fetch(
                "http://localhost:8080/api/privacy",
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,

                        // Added: backend ko current Clerk user ID bhejne ke liye
                        "X-Clerk-User-Id": user.id,

                        "X-Account-Status": newIsPublic
                            ? "PUBLIC"
                            : "PRIVATE"
                    }
                }
            );


            if (!response.ok) {
                setError("Unable to update profile visibility.");
                return;
            }

            const result = await response.json();

            setIsPublic(result.account_status === "PUBLIC");

        } catch (error) {
            router.push("/backend-error");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="mt-6">
            <p className="mb-2 font-medium">Profile Visibility</p>

            <button
                type="button"
                onClick={handleToggle}
                disabled={isUpdating}
                className="relative flex h-10 w-20 items-center rounded-full bg-gray-300 p-1 cursor-pointer disabled:cursor-not-allowed"
            >
                <span
                    className={`h-8 w-8 rounded-full bg-white shadow-md transition-transform duration-200 ${isPublic
                        ? "translate-x-10"
                        : "translate-x-0"
                        }`}
                />
            </button>

            <p className="mt-2 text-sm">
                {isPublic ? "Public" : "Private"}
            </p>

            {error && (
                <p className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}