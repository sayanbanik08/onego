"use client";

import { useClerk } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const HANDLE_SIZE = 52; // px — diameter of the draggable circle
const TRACK_PAD  = 8;  // px — inner padding of the pill
const THRESHOLD  = 0.78; // drag past 78% → trigger login

export default function LoginActions() {
  const { openSignIn } = useClerk();
  const router = useRouter();

  const trackRef    = useRef<HTMLDivElement>(null);
  const startXRef   = useRef(0);
  const isDragging  = useRef(false);

  const [dragX,     setDragX]     = useState(0);
  const [dragging,  setDragging]  = useState(false); // for disabling CSS transition
  const [triggered, setTriggered] = useState(false);  // lock after success

  /* max pixels the handle can travel */
  const maxX = useCallback(() => {
    if (!trackRef.current) return 280;
    return trackRef.current.offsetWidth - HANDLE_SIZE - TRACK_PAD * 2;
  }, []);

  /* ── Pointer start ── */
  const onStart = useCallback((clientX: number) => {
    if (triggered) return;
    isDragging.current = true;
    startXRef.current  = clientX - dragX; // account for current position
    setDragging(true);
  }, [triggered, dragX]);

  /* ── Pointer move ── */
  const onMove = useCallback((clientX: number) => {
    if (!isDragging.current || triggered) return;
    const max  = maxX();
    const newX = Math.max(0, Math.min(clientX - startXRef.current, max));
    setDragX(newX);

    if (newX / max >= THRESHOLD) {
      isDragging.current = false;
      setTriggered(true);
      setDragging(false);
      setDragX(max); // snap to end
      setTimeout(() => openSignIn(), 350); // slight delay so animation settles
    }
  }, [triggered, maxX, openSignIn]);

  /* ── Pointer end ── */
  const onEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setDragging(false);
    if (!triggered) setDragX(0); // spring back
  }, [triggered]);

  /* ── Global mouse/touch listeners while dragging ── */
  useEffect(() => {
    if (!dragging) return;
    const onMouseMove = (e: MouseEvent)  => onMove(e.clientX);
    const onTouchMove = (e: TouchEvent)  => { e.preventDefault(); onMove(e.touches[0].clientX); };
    const onUp        = ()               => onEnd();

    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("mouseup",    onUp);
    window.addEventListener("touchmove",  onTouchMove, { passive: false });
    window.addEventListener("touchend",   onUp);
    return () => {
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mouseup",    onUp);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("touchend",   onUp);
    };
  }, [dragging, onMove, onEnd]);

  /* ── Clerk modal close → spring slider back ── */
  useEffect(() => {
    if (!triggered) return;

    let modalSeen = false;

    // Watch direct children of <body> — Clerk mounts its portal there
    const observer = new MutationObserver(() => {
      // Clerk's modal portal has cl- prefixed classes or a known id
      const clerkPortal = document.querySelector(
        ".cl-modalBackdrop, [class*='cl-modal'], #clerk-components, [data-clerk-id]"
      );

      if (!modalSeen && clerkPortal) {
        modalSeen = true; // modal appeared → note it
      }

      if (modalSeen && !clerkPortal) {
        // Modal was shown and is now GONE.
        // If user signed in, Clerk would have redirected away; since we're
        // still here the modal was dismissed → spring the slider back.
        observer.disconnect();
        setTriggered(false);
        setDragX(0);
      }
    });

    observer.observe(document.body, { childList: true, subtree: false });
    return () => observer.disconnect();
  }, [triggered]);

  const max      = maxX();
  const progress = max > 0 ? dragX / max : 0;
  const spring   = "transform 0.42s cubic-bezier(0.34,1.56,0.64,1)";

  return (
    <div className="flex w-full flex-col items-center gap-5">

      {/* ════════════════ Slide-to-login track ════════════════ */}
      <div
        ref={trackRef}
        className="relative flex h-[68px] w-full max-w-[360px] select-none items-center overflow-hidden rounded-full border border-white/10 p-[8px] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_28px_rgba(0,0,0,0.55)]"
        style={{ background: "linear-gradient(180deg,#575757 0%,#2b2b2b 100%)" }}
      >
        {/* Green progress fill */}
        <div
          className="pointer-events-none absolute bottom-[8px] left-[8px] top-[8px] rounded-full"
          style={{
            width: `${dragX + HANDLE_SIZE}px`,
            background: "rgba(40,212,100,0.18)",
            transition: dragging ? "none" : spring,
          }}
        />

        {/* Draggable handle */}
        <div
          className="relative z-10 flex h-[52px] w-[52px] shrink-0 cursor-grab touch-none items-center justify-center rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.5)] active:cursor-grabbing"
          style={{
            background:  triggered ? "#28d464" : `hsl(${141 + progress * 0}deg 68% ${44 + progress * 8}%)`,
            transform:   `translateX(${dragX}px)`,
            transition:  dragging ? "none" : spring,
          }}
          onMouseDown={(e) => { e.preventDefault(); onStart(e.clientX); }}
          onTouchStart={(e) => onStart(e.touches[0].clientX)}
        >
          {triggered ? (
            /* Checkmark on success */
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            /* Login arrow icon */
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
                 strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          )}
        </div>

        {/* "slide to login" text — fades out as handle moves right */}
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-[21px] font-light text-white/50"
          style={{
            opacity:    Math.max(0, 1 - progress * 2),
            fontFamily: "var(--font-comfortaa)",
          }}
        >
          {triggered ? "opening…" : "slide to login"}
        </span>
      </div>

      {/* ════════════════ Continue as guest ════════════════ */}
      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="text-base font-medium transition-opacity hover:opacity-75"
        style={{ fontFamily: "var(--font-comfortaa)" }}
      >
        <span className="text-cyan-400">Continue</span>
        <span className="text-white/60"> as guest</span>
      </button>
    </div>
  );
}
