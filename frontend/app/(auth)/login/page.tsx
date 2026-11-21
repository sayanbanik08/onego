import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LoginFooter from "@/components/LoginFooter";
import LoginHeader3D from "@/components/LoginHeader3D";
import LoginSmoothScroll from "@/components/LoginSmoothScroll";
import LoginCursor from "@/components/LoginCursor";
import LoginCollageSlider from "@/components/LoginCollageSlider";
import LoginAboutSection from "@/components/LoginAboutSection";
import LoginHeroSection from "@/components/LoginHeroSection";
import LoginToolsSection from "@/components/LoginToolsSection";

export default async function Home() {
  const { isAuthenticated } = await auth();

  // agar mera user already logged in hain tab dashboard pr bhej dena.
  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <LoginSmoothScroll>
      <div className="min-h-screen w-full bg-[#000000] text-[#F5F5F5]">
        {/* 3D Realistic Header Shelf */}
        <LoginHeader3D />
        <LoginCollageSlider />
        <LoginAboutSection />

        {/* ── New sticker login hero — replaces old 3D logo + leather buttons ── */}
        <LoginHeroSection />

        {/* ── Tools & Shortcuts Section ── */}
        <LoginToolsSection />

        <LoginFooter />
        <LoginCursor />
      </div>
    </LoginSmoothScroll>
  );
}


// app/(auth)/login/page.tsx ← Login/Create Account(login page ka sara code0