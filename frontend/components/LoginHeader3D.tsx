"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LoginHeader3D() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 1024 ke niche jaate hi menu auto-close
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => {
      if (!e.matches) setIsMenuOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const el = document.querySelector(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className="sticky top-0 z-30 mx-auto h-5 w-full max-w-[1831px] select-none bg-[#171717]/85 px-0 shadow-[0_4px_18px_rgba(0,0,0,0.18)] backdrop-blur-sm backdrop-saturate-150"
      >
        <div
          className="relative z-10 flex h-5 w-full items-center justify-between"
        >
          <div aria-hidden="true" className="flex items-center gap-0.5">
            <span className="size-2.5 rounded-full bg-[#E04F46]" />
            <span className="size-2.5 rounded-full bg-[#E6A91A]" />
            <span className="size-2.5 rounded-full bg-[#1FB833]" />
          </div>

          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center text-[#E8E1D6] transition-opacity hover:opacity-70"
              aria-label="OneGo home"
            >
              <span
                style={{ fontFamily: "var(--font-comfortaa)", fontWeight: 300 }}
                className="text-base leading-none tracking-wide"
              >
                onego
              </span>
            </Link>

            <button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
              className="hidden h-5 w-6 flex-col items-center justify-center gap-1 mr-2 min-[1024px]:flex"
            >
              <span className="h-px w-10 bg-[#E8E1D6]" />
              <span className="h-[0.5px] w-10 bg-[#E8E1D6]" />
            </button>
          </div>
        </div>
      </header>

      {/* Menu Container locked strictly to the 1831px page max span */}
      <div
        className={`fixed inset-0 z-50 max-[1023px]:hidden pointer-events-none transition-all duration-500 ease-in-out ${
          isMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay — clicking outside closes menu */}
        <button
          type="button"
          aria-label="Close menu"
          className={`pointer-events-auto absolute inset-0 cursor-default bg-black/30 transition-opacity duration-500 ease-in-out ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* 1831px Max Span Boundary: Exact same mx-auto max-w-[1831px] as the page */}
        <div className="relative mx-auto h-full w-full max-w-[1831px] overflow-hidden pointer-events-none">
          {/* Aside: slides in directly from right-0 of the 1831px container */}
          <aside
            className={`pointer-events-auto absolute top-0 right-0 flex h-dvh w-1/2 flex-col items-center justify-center overflow-hidden bg-[#171717]/95 px-10 py-12 lg:py-16 text-[#E8E1D6] shadow-[-12px_0_30px_rgba(0,0,0,0.28)] backdrop-blur-md transition-transform duration-500 ease-in-out ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            aria-label="Main navigation"
            aria-hidden={!isMenuOpen}
          >
            <nav className="my-auto flex flex-col gap-[clamp(2rem,5vh,4.5rem)] text-[#E8E1D6]" style={{ fontFamily: "var(--font-comfortaa)" }}>
              <Link href="#top" onClick={(e) => handleNavClick(e, "#top")} className="text-[clamp(4.5rem,10.8vh,9.5rem)] font-light leading-none transition-opacity hover:opacity-60">Home</Link>
              <Link href="#login-about" onClick={(e) => handleNavClick(e, "#login-about")} className="text-[clamp(4.5rem,10.8vh,9.5rem)] font-light leading-none transition-opacity hover:opacity-60">About</Link>
              <Link href="#login-tools" onClick={(e) => handleNavClick(e, "#login-tools")} className="text-[clamp(4.5rem,10.8vh,9.5rem)] font-light leading-none transition-opacity hover:opacity-60">Tools</Link>
              <Link href="#login-section-title" onClick={(e) => handleNavClick(e, "#login-section-title")} className="text-[clamp(4.5rem,10.8vh,9.5rem)] font-light leading-none transition-opacity hover:opacity-60">Login</Link>
            </nav>
          </aside>
        </div>
      </div>
    </>
  );
}
