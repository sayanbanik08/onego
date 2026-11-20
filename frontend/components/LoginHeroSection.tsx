"use client";

import Image from "next/image";
import LoginActions from "./LoginActions";

export default function LoginHeroSection() {
  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-black"
      aria-label="Login section"
    >
      {/*
       * ─────────────────────────────────────────────────────────
       *  MOBILE  → sticker image on top  / content on bottom
       *  DESKTOP → sticker image on left / content on right
       * ─────────────────────────────────────────────────────────
       */}
      <div className="flex h-full min-h-screen flex-col lg:flex-row">

        {/* ── Sticker / Illustration panel ── */}
        <div className="relative h-[52vw] min-h-[300px] w-full lg:h-screen lg:w-[55%] lg:min-h-screen">
          <Image
            src="/login-sticker-bg.jpg"
            alt="Colorful 3D creative stickers"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          {/* Bottom fade into black — blends into content on mobile */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-black lg:hidden" />
          {/* Right fade into black — blends into content on desktop */}
          <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-r from-transparent to-black hidden lg:block" />
        </div>

        {/* ── Content panel ── */}
        <div
          className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-16 pt-6 text-center lg:items-start lg:justify-center lg:px-14 lg:pb-0 lg:pt-0 lg:text-left"
          style={{ fontFamily: "var(--font-comfortaa)" }}
        >
          {/* Heading */}
          <h1 className="text-[clamp(2.4rem,7vw,4.5rem)] font-bold leading-[1.08] tracking-tight text-white">
            Log in to create
            <br />
            or continue
          </h1>

          {/* Subtitle */}
          <p className="max-w-[340px] text-[clamp(13px,2vw,15px)] leading-relaxed text-white/50">
            Build a profile that feels like you — showcase your work, tell your
            story, and connect with the people who matter.
          </p>

          {/* Buttons */}
          <div className="w-full max-w-[360px]">
            <LoginActions />
          </div>
        </div>
      </div>
    </section>
  );
}
