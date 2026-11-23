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
import MobileBottomBar from "@/components/MobileBottomBar/App";

export default async function Home() {
  const { isAuthenticated } = await auth();

  // agar mera user already logged in hain tab dashboard pr bhej dena.
  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <>
      <LoginSmoothScroll>
        <div className="w-full bg-[#808080]">
          <div id="top" className="mx-auto w-full max-w-[1831px] bg-[#000000] pb-[85px] text-[#F5F5F5] max-[249px]:pb-0 lg:pb-0">
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
        </div>
      </LoginSmoothScroll>
      <MobileBottomBar />
    </>
  );
}


// app/(auth)/login/page.tsx ← Login/Create Account(login page ka sara code0