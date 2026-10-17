"use client";

import { useEffect, useRef, useState } from "react";

export default function LoginCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateEnabled = () => setEnabled(finePointer.matches && !reduceMotion.matches);

    updateEnabled();
    finePointer.addEventListener("change", updateEnabled);
    reduceMotion.addEventListener("change", updateEnabled);

    return () => {
      finePointer.removeEventListener("change", updateEnabled);
      reduceMotion.removeEventListener("change", updateEnabled);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!enabled || !cursor) return;

    document.documentElement.classList.add("login-cursor-enabled");

    let hasPosition = false;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      const target = event.target;
      const isElement = target instanceof Element;
      const isTextField = isElement && target.closest("input, textarea, select, [contenteditable='true']");
      const isInteractive = isElement && target.closest("a, button, [role='button']");
      const ring = cursor.firstElementChild;

      cursor.dataset.visible = String(!isTextField);
      cursor.style.opacity = isTextField ? "0" : "1";
      if (ring instanceof HTMLElement) {
        ring.style.transform = `scale(${isInteractive ? 1.5 : 1})`;
      }

      if (!hasPosition) {
        hasPosition = true;
        window.requestAnimationFrame(() => cursor.classList.add("is-following"));
      }
    };

    const handleWindowBlur = () => {
        cursor.dataset.visible = "false";
        cursor.style.opacity = "0";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.documentElement.classList.remove("login-cursor-enabled");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="login-custom-cursor pointer-events-none fixed left-0 top-0 z-[100] [will-change:transform]"
    >
      <span className="login-custom-cursor__ring block size-9 rounded-full border border-[#722F37]/90 bg-[#E8DCC6]/45 shadow-[0_0_0_2px_rgba(232,220,198,0.75)]" />
    </div>
  );
}