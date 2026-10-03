import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";

export default async function Home() {
  const { isAuthenticated } = await auth();

  // agar mera user already logged in hain tab dashboard pr bhej dena.
  if (isAuthenticated) {
    redirect("/dashboard"); // dashboard pe bheja ja raha h.
  }

  // Not logged in ho to login page dikhaya jayga.
  return (
    //ye mera login page h vai.
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">Welcome to OneGo</h1>
        <p className="text-lg text-gray-600">Create or login to continue your journey!</p>
        <SignInButton mode="modal">
          <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
            Login / Create Account
          </button>
        </SignInButton>
        <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
          Guest
        </button>
      </div>
    </main>
  );
}


// app/(auth)/login/page.tsx ← Login/Create Account(login page ka sara code)