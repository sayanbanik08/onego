"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LoginActions from "./LoginActions";
import { useFitHeading } from "./useFitHeading";

export default function LoginHeroSection() {
  const headingRef = useFitHeading();
  const firstLineRef = useRef<HTMLSpanElement>(null);
  const [headingLineWidth, setHeadingLineWidth] = useState<number | null>(null);

  useEffect(() => {
    const firstLine = firstLineRef.current;
    if (!firstLine) return;

    const updateWidth = () => {
      setHeadingLineWidth(firstLine.getBoundingClientRect().width);
    };

    updateWidth();
    void document.fonts?.ready.then(updateWidth);

    const observer = new ResizeObserver(updateWidth);
    observer.observe(firstLine);

    return () => observer.disconnect();
  }, []);

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
          Login
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
        <div className="@container relative z-10 flex min-w-0 flex-1 flex-col items-center justify-center gap-6 px-4 pb-0 pt-6 text-center lg:px-6 lg:-translate-x-[12px]">
          {/* Heading */}
          <h3 className="mb-2 w-full text-[clamp(1.75rem,11.5cqi,7rem)] max-lg:text-[clamp(1.75rem,12cqi,7rem)] font-bold leading-[1.08] tracking-tight text-white text-center lg:text-[clamp(1.75rem,13cqi,7rem)] lg:mb-5">
            <span ref={firstLineRef} className="inline-block whitespace-nowrap">
              Log in to create
            </span>
            <br />
            or continue
          </h3>

          {/* Subtitle from reference */}
          <p className="mb-2 w-full text-[clamp(0.25rem,3.1cqi,1.375rem)] max-lg:text-[clamp(0.25rem,3.4cqi,1.375rem)] leading-relaxed text-white/50 text-center lg:mb-5">
            <span className="block whitespace-nowrap">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </span>
            <span className="block whitespace-nowrap">Sed do eiusmod tempor</span>
          </p>

          {/* Slider button & guest */}
          <div
            className="max-w-full pb-0 mx-auto"
            style={{ width: headingLineWidth ?? "100%" }}
          >
            <LoginActions />
          </div>
        </div>
      </div>
    </section>
  );
}
