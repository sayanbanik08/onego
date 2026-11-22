"use client";

import Image from "next/image";
import LoginActions from "./LoginActions";
import { useFitHeading } from "./useFitHeading";

export default function LoginHeroSection() {
  const headingRef = useFitHeading();

  return (
    <section
      className="relative isolate flex w-full flex-col overflow-hidden bg-black px-4 pt-[2cm] pb-0 text-white sm:px-8"
      aria-labelledby="login-section-title"
      style={{ fontFamily: "var(--font-comfortaa)" }}
    >
      {/* ── Massive Heading: Exactly identical to "About us" ── */}
      <h2
        id="login-section-title"
        className="-mx-4 mt-0 w-[calc(100%+2rem)] whitespace-nowrap text-center font-light leading-[1.05] tracking-normal sm:-mx-8 sm:w-[calc(100%+4rem)]"
      >
        <span ref={headingRef} className="inline-block whitespace-nowrap">
          Login us
        </span>
      </h2>

      {/*
       * ─────────────────────────────────────────────────────────
       *  Split content area:
       *  MOBILE  → sticker image on top  / content on bottom
       *  DESKTOP → sticker image on left / content on right
       * ─────────────────────────────────────────────────────────
       */}
      <div className="-mx-4 mt-[2cm] flex w-[calc(100%+2rem)] flex-col sm:-mx-8 sm:w-[calc(100%+4rem)] lg:flex-row">

        {/* ── Sticker / 3D Characters panel ── */}
        <div className="relative h-[56vw] min-h-[300px] w-full lg:h-[620px] lg:w-[54%]">
          <Image
            src="/login-sticker-bg.jpg"
            alt="Colorful 3D creative characters and tools"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 54vw"
          />
          {/* Bottom fade into black on mobile */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-black lg:hidden" />
          {/* Right fade into black on desktop */}
          <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-r from-transparent to-black hidden lg:block" />
        </div>

        {/* ── Content & Controls panel ── */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-0 pt-6 text-center lg:items-start lg:justify-center lg:px-14 lg:py-0 lg:text-left">
          {/* Heading */}
          <h3 className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold leading-[1.08] tracking-tight text-white">
            Log in to create
            <br />
            or continue
          </h3>

          {/* Subtitle from reference */}
          <p className="max-w-[360px] text-[clamp(13px,1.8vw,15.5px)] leading-relaxed text-white/50">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor
          </p>

          {/* Slider button & guest */}
          <div className="w-full max-w-[360px] pb-0">
            <LoginActions />
          </div>
        </div>
      </div>
    </section>
  );
}
