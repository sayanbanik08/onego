import { currentUser, auth } from "@clerk/nextjs/server";


export default async function accDetailsGetter() {

    try {
        const { isAuthenticated } = await auth();
        // Clerk se currently logged-in user ko get karo
        const user = await currentUser();

        // User login nahi hai ya authenticated nahi hai to null return karo
        if (!user || !isAuthenticated) {
            return null;
        }

        // Account details ka object
        const accDetails = {
            // Profile photo
            photo: user.imageUrl ?? null,

            // Full name
            fullName: user.fullName ?? null,

            // Primary email
            emailId: user.primaryEmailAddress?.emailAddress ?? null,

            // External provider
            provider: user.externalAccounts?.[0]?.provider ?? null,

            // Clerk User ID
            clerkUserId: user.id,
        };

        return accDetails;

    } catch (error) {

        // Account details fetch karte waqt error aaye
        console.error("Account details fetch failed:", error);

        return null;
    }
}
// app/lib/clerkUser.ts ← accDetails obj banake transfer ka kaam krta h.




