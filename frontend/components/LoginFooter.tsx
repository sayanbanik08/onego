"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const footerPillars = [
  {
    number: "01",
    title: "Build your space",
    description: "Bring your work, story and ambitions together in one home.",
  },
  {
    number: "02",
    title: "Make it yours",
    description: "Shape every detail until your portfolio feels unmistakably you.",
  },
  {
    number: "03",
    title: "Put it out there",
    description: "Share a thoughtful first impression with the people who matter.",
  },
  {
    number: "04",
    title: "Bring it all together",
    description: "Gather your projects, experience, and education in one thoughtful profile.",
  },
  {
    number: "05",
    title: "Make a strong first impression",
    description: "Give visitors a clear, considered view of what you do best.",
  },
  {
    number: "06",
    title: "Choose your look",
    description: "Use color, imagery, and layouts that feel unmistakably like you.",
  },
  {
    number: "07",
    title: "Keep it organized",
    description: "Arrange the details that matter so your story is easy to follow.",
  },
  {
    number: "08",
    title: "Make it easy to connect",
    description: "Keep your profile and contact details ready to share.",
  },
  {
    number: "09",
    title: "Share your next chapter",
    description: "Publish your work and let new opportunities find their way to you.",
  },
];

export default function LoginFooter() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      setActiveSlideIndex((index) => index + 1);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (activeSlideIndex !== footerPillars.length) return;

    const reset = window.setTimeout(() => {
      setTransitionEnabled(false);
      setActiveSlideIndex(0);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setTransitionEnabled(true));
      });
    }, 500);

    return () => window.clearTimeout(reset);
  }, [activeSlideIndex]);

  return (
    <footer
      className="relative z-20 isolate w-full overflow-hidden bg-[#000000] pt-[2cm] text-white"
      style={{ fontFamily: "var(--font-comfortaa)" }}
    >
      {/* Decorative ambient background rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 -top-52 size-[32rem] rounded-full border border-white/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-28 size-[21rem] rounded-full border border-white/8"
      />

      {/* Full-width container touching left and right edges */}
      <div className="relative z-10 w-full px-4 pb-8 pt-0 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/70">
          <span>Your next chapter starts here</span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-16">
          <h2 className="max-w-4xl text-5xl font-light leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
            Give your work
            <br />
            its own place.
          </h2>
          <p className="max-w-md pb-2 text-base leading-relaxed text-white/70 sm:text-lg">
            A little space to show what you do, what you care about, and where
            you are headed next.
          </p>
        </div>

        {/* Carousel touching full width edge-to-edge */}
        <div
          className="mt-16 sm:mt-24"
          role="region"
          aria-roledescription="carousel"
          aria-label="OneGo highlights"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setIsPaused(false);
            }
          }}
        >
          <div className="relative -mx-4 overflow-hidden border-y border-white/20 sm:-mx-8 lg:-mx-12">
            <div
              className={`flex w-[1800%] md:w-[900%] lg:w-[600%] ${transitionEnabled ? "transition-transform duration-500 ease-in-out" : ""
                } motion-reduce:transition-none`}
              style={{ transform: `translateX(-${activeSlideIndex * (100 / (footerPillars.length * 2))}%)` }}
            >
              {[...footerPillars, ...footerPillars].map((pillar, index) => {
                const pillarIndex = index % footerPillars.length;
                const columnIndex = (pillarIndex - activeSlideIndex + footerPillars.length) % footerPillars.length;

                return (
                  <article
                    key={`${pillar.number}-${index}`}
                    className={`basis-[5.555556%] min-h-[220px] shrink-0 px-4 py-6 sm:min-h-[248px] sm:px-8 sm:py-7 md:pr-8 ${columnIndex > 0 ? "md:pl-8" : ""
                      }`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${pillarIndex + 1} of ${footerPillars.length}`}
                    aria-hidden={index >= footerPillars.length}
                  >
                    <div>
                      <p className="font-mono text-xs font-medium text-white/60">{pillar.number}</p>
                      <h3 className="mt-5 text-xl font-semibold sm:text-2xl">
                        {pillar.title}
                      </h3>
                      <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60 sm:text-base">
                        {pillar.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 hidden border-l border-white/20 md:block lg:hidden" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/3 hidden border-l border-white/20 lg:block" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-2/3 hidden border-l border-white/20 lg:block" />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <p aria-live="polite" className="font-mono text-xs font-medium text-white/60">
              {String((activeSlideIndex % footerPillars.length) + 1).padStart(2, "0")} / {String(footerPillars.length).padStart(2, "0")}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous highlight"
                disabled={activeSlideIndex === 0 || activeSlideIndex === footerPillars.length}
                onClick={() => setActiveSlideIndex((index) => Math.max(0, index - 1))}
                className="grid size-10 place-items-center border border-white/25 text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Next highlight"
                disabled={activeSlideIndex === footerPillars.length}
                onClick={() => setActiveSlideIndex((index) => index + 1)}
                className="grid size-10 place-items-center border border-white/25 text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer bottom bar touching left and right */}
        <div className="flex flex-col gap-5 pt-8 sm:flex-row sm:items-end sm:justify-between sm:pt-10">
          <div>
            <p className="text-3xl font-bold tracking-tight">onego</p>
            <p className="mt-2 text-sm text-white/60">
              Your story, beautifully told.
            </p>
          </div>
          <p className="flex items-center gap-2 text-sm text-white/60">
            Made for what you make
          </p>
        </div>
      </div>
    </footer>
  );
}
