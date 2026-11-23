"use client";

import { useClerk } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const HANDLE_SIZE = 52; // px — diameter of the draggable circle
const TRACK_PAD = 8;    // px — inner padding
const THRESHOLD = 0.82; // drag past 82% → trigger login

function checkIsClerkModalOpen(): boolean {
  if (typeof document === "undefined") return false;
  const selectors = [
    ".cl-modalBackdrop",
    ".cl-modalContent",
    "[class*='cl-modal']",
    "[class*='modalBackdrop']",
    "[role='dialog']",
    "[aria-modal='true']",
    ".cl-card",
    ".cl-signIn-root",
    ".cl-signIn-start",
  ];
  for (const s of selectors) {
    const el = document.querySelector(s);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return true;
      }
    }
  }
  return false;
}

export default function LoginActions() {
  const { openSignIn } = useClerk();
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const isDragging = useRef(false);

  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [maxTravel, setMaxTravel] = useState(280);
  const [handleSize, setHandleSize] = useState(HANDLE_SIZE);
  const [trackPaddingSize, setTrackPaddingSize] = useState(TRACK_PAD);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const handle = handleRef.current;
    if (!container || !track || !handle) return;

    const updateDimensions = () => {
      const currentHandleSize = Math.max(1, container.clientHeight - 16);
      const trackPadding = parseFloat(window.getComputedStyle(track).paddingLeft) || TRACK_PAD;

      setHandleSize(currentHandleSize);
      setTrackPaddingSize(trackPadding);
      setContainerWidth(container.offsetWidth);
      setContainerHeight(container.clientHeight);
      setMaxTravel(
        Math.max(60, container.offsetWidth - currentHandleSize - trackPadding * 2),
      );
    };

    const observer = new ResizeObserver(updateDimensions);
    observer.observe(container);
    observer.observe(track);
    observer.observe(handle);
    updateDimensions();

    return () => observer.disconnect();
  }, []);

  /* Max travel distance of the handle */
  const getMaxX = useCallback(() => {
    if (!containerRef.current) return 280;
    const handleSize = handleRef.current?.offsetWidth ?? HANDLE_SIZE;
    const trackPadding = trackRef.current
      ? parseFloat(window.getComputedStyle(trackRef.current).paddingLeft) || TRACK_PAD
      : TRACK_PAD;

    return Math.max(
      60,
      containerRef.current.offsetWidth - handleSize - trackPadding * 2,
    );
  }, []);

  /* ── Pointer start ── */
  const onStart = useCallback((clientX: number) => {
    if (triggered) return;
    isDragging.current = true;
    startXRef.current = clientX - dragX;
    setDragging(true);
  }, [triggered, dragX]);

  /* ── Pointer move ── */
  const onMove = useCallback((clientX: number) => {
    if (!isDragging.current || triggered) return;
    const max = getMaxX();
    const newX = Math.max(0, Math.min(clientX - startXRef.current, max));
    setDragX(newX);

    if (newX / max >= THRESHOLD) {
      isDragging.current = false;
      setTriggered(true);
      setDragging(false);
      setDragX(max); // snap to end
      setTimeout(() => {
        try {
          openSignIn();
        } catch {
          // fallback
        }
      }, 300);
    }
  }, [triggered, getMaxX, openSignIn]);

  /* ── Pointer end ── */
  const onEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setDragging(false);
    if (!triggered) {
      setDragX(0); // spring back
    }
  }, [triggered]);

  /* ── Global mouse/touch drag listeners ── */
  useEffect(() => {
    if (!dragging) return;
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) onMove(e.touches[0].clientX);
    };
    const onUp = () => onEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, onMove, onEnd]);

  /* ── Clerk modal close detection → 100% bulletproof spring back ── */
  useEffect(() => {
    if (!triggered) return;

    let modalHasOpened = false;

    const resetSlider = () => {
      setTriggered(false);
      setDragX(0);
    };

    const inspectModal = () => {
      const isOpen = checkIsClerkModalOpen();
      if (isOpen) {
        modalHasOpened = true;
      } else if (modalHasOpened) {
        // Modal was open, but is now closed!
        resetSlider();
      }
    };

    // 1. Polling interval (every 120ms)
    const interval = setInterval(inspectModal, 120);

    // 2. Full DOM mutation observer (subtree: true)
    const observer = new MutationObserver(inspectModal);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // 3. Escape key dismiss
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTimeout(inspectModal, 150);
        setTimeout(inspectModal, 400);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    // 4. Click event on window (close button or backdrop click)
    const onWindowClick = () => {
      setTimeout(inspectModal, 150);
      setTimeout(inspectModal, 400);
    };
    window.addEventListener("click", onWindowClick, true);

    // 5. Window focus returns
    const onFocus = () => {
      setTimeout(inspectModal, 200);
    };
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      observer.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onWindowClick, true);
      window.removeEventListener("focus", onFocus);
    };
  }, [triggered]);

  const max = maxTravel;
  const progress = max > 0 ? dragX / max : 0;

  // Track shrinks from left edge: leftOffset accelerates with progress
  const leftOffset = Math.pow(progress, 1.4) * max;
  // Handle translation inside the shrinking track to keep 1:1 sync with cursor
  const handleInsideX = dragX - leftOffset;
  const iconSize = Math.round(handleSize * 0.68);

  const springTransition = "all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)";
  const dragTransition = "none";

  return (
    <div className="@container flex w-full flex-col items-center gap-[clamp(1.25rem,5cqi,2.5rem)]">

      {/* ════════ Outer bounds wrapper ════════ */}
      <div
        ref={containerRef}
        className="relative h-[clamp(82px,22.7cqi,124px)] w-full select-none"
      >
        {/*
          ════════ Dynamic Shrinking Pill Track ════════
          As you slide left to right, leftOffset increases,
          causing the track's left edge to shrink towards the right!
        */}
        <div
          ref={trackRef}
          className="absolute inset-y-0 right-0 flex items-center overflow-hidden rounded-full border border-white/15 backdrop-blur-xl p-[clamp(8px,2.2cqi,16px)] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.18),0_12px_32px_rgba(0,0,0,0.5)]"
          style={{
            left: triggered
              ? `${Math.max(0, containerWidth - containerHeight)}px`
              : `${leftOffset}px`,
            background:
              "linear-gradient(180deg, rgba(125, 125, 125, 0.52) 0%, rgba(68, 68, 68, 0.62) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            transition: dragging ? dragTransition : springTransition,
          }}
        >
          {/* Green progress glow fill */}
          <div
            className="pointer-events-none absolute bottom-[clamp(8px,2.2cqi,16px)] left-[clamp(8px,2.2cqi,16px)] top-[clamp(8px,2.2cqi,16px)] rounded-full"
            style={{
              width: dragging
                ? `${Math.max(0, handleInsideX + handleSize + 6 - trackPaddingSize)}px`
                : "0px",
              background: "rgba(40,212,100,0.22)",
              transition: dragging ? dragTransition : springTransition,
            }}
          />

          {/* Draggable Circle Handle */}
          <div
            ref={handleRef}
            className="relative z-10 flex h-full aspect-square w-auto shrink-0 cursor-grab touch-none items-center justify-center rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.6)] active:cursor-grabbing"
            style={{
              width: `${handleSize}px`,
              height: `${handleSize}px`,
              marginLeft: "calc(6px - clamp(8px, 2.2cqi, 16px))",
              background: triggered
                ? "#28d464"
                : `hsl(141deg 68% ${44 + progress * 8}%)`,
              transform: `translateX(${triggered ? 2 : handleInsideX}px)`,
              transition: dragging ? dragTransition : springTransition,
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              onStart(e.clientX);
            }}
            onTouchStart={(e) => {
              if (e.touches[0]) onStart(e.touches[0].clientX);
            }}
          >
            {triggered ? (
              /* Success checkmark */
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              /* Arrow login icon */
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            )}
          </div>

          {/* "slide to login" text — fades out cleanly as track shrinks */}
          <span
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center whitespace-nowrap text-[clamp(1rem,5.87vw,3.75rem)] max-lg:text-[clamp(1rem,6.2vw,3.75rem)] font-light text-white/50 lg:text-[clamp(1.3rem,6.45cqi,2.35rem)] lg:pr-4 lg:pl-2"
            style={{
              left: `${handleInsideX + handleSize + 6}px`,
              opacity: Math.max(0, 1 - progress * 2.2),
              fontFamily: "var(--font-comfortaa)",
            }}
          >
            {triggered ? "opening…" : "Slide to log in"}
          </span>
        </div>
      </div>

      {/* ════════ Continue as guest ════════ */}
      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="text-[clamp(1rem,4.5cqi,1.375rem)] max-lg:text-[clamp(1rem,4.8cqi,1.5rem)] font-medium italic transition-opacity hover:opacity-75"
        style={{ fontFamily: "var(--font-comfortaa)" }}
      >
        <span className="text-cyan-400">Continue</span>
        <span className="text-white/60"> as guest</span>
      </button>
    </div>
  );
}
