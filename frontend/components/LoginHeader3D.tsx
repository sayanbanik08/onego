"use client";

import Link from "next/link";

export default function LoginHeader3D() {
  return (
    <header
      className="sticky top-0 z-30 h-9 w-full -translate-y-2 select-none bg-transparent"
    >
      <div
        className="relative z-10 flex h-9 w-full items-center justify-between"
      >
        <div aria-hidden="true" className="flex items-center gap-0.5">
          <span className="size-2.5 rounded-full bg-[#E04F46]" />
          <span className="size-2.5 rounded-full bg-[#E6A91A]" />
          <span className="size-2.5 rounded-full bg-[#1FB833]" />
        </div>

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
      </div>
    </header>
  );
}
