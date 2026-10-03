import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import accDetailsGetter from "@/lib/clerkUser";
import ProfileVisibilityToggle from "@/components/ProfileVisibilityToggle";
import Image from "next/image";

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
        <div className="p-4">

            <div className="flex justify-end">
                <UserButton />
            </div>


            <div className="mt-4">
                <p>Search By ID: {accountResult.search_by_id}</p>
                <p>Email ID: {accountResult.email_id}</p>
                <p>Full Name: {accountResult.full_name}</p>
                {accountResult.photo ? (
                    <Image
                        src={accountResult.photo}
                        alt="Profile photo"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                    />
                ) : (
                    <p>No photo</p>
                )}
            </div>

            <ProfileVisibilityToggle />

        </div>
    );
}

// // app/(main)/dashboard/page.tsx ← Dashboard(Dashboard page ka sara code)
