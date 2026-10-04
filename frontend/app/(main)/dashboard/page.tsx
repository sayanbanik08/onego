import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import accDetailsGetter from "@/lib/clerkUser";;
import SettingsMenu from "@/components/SettingsMenu";
import SearchBox from "@/components/SearchBox";

export default async function Dashboard() {
    const { isAuthenticated, getToken } = await auth();

    // agar mera user logged in nhi hain tab login page pr bhej dena.
    if (!isAuthenticated) {
        redirect("/login");
    }

    // Clerk se account details get karo
    const accDetails = await accDetailsGetter();

    if (!accDetails) {
        redirect("/login");
    }

    // Clerk authentication token lo
    const token = await getToken();

    if (!token) {
        redirect("/login");
    }

    // Account details Java backend ko bhejo
    let response;
    try {
        response = await fetch(
            "http://localhost:8080/api/account",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Clerk session token
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(accDetails)
            }
        );
    } catch (error) {
        redirect("/backend-error");
    }

    // Agar backend se response ok nhi aata to login page pr bhej dena.
    if (!response.ok) {
        redirect("/login");
    }

    // Java backend ka response object
    const accountResult = await response.json();


    return (
        <div className="min-h-screen p-4">

            {/* Top Bar */}
            <div className="relative flex items-center justify-between">

                {/* Search - Top Middle */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <SearchBox profilePhoto={accountResult.photo} />
                </div>

                {/* Right Side */}
                <div className="ml-auto flex items-center gap-2">
                    <SettingsMenu accountResult={accountResult} />
                    <UserButton />
                </div>

            </div>

        </div>
    );
}

// // app/(main)/dashboard/page.tsx ← Dashboard(Dashboard page ka sara code)
