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

    const modalSelector = [
      ".cl-modalBackdrop",
      ".cl-modalContent",
      "[class*='cl-modal']",
      "[role='dialog']",
      "[aria-modal='true']",
      ".cl-card",
      ".cl-signIn-root",
      ".cl-signIn-start",
    ].join(", ");

    const syncCursorMode = () => {
      const modalIsOpen = Array.from(document.querySelectorAll(modalSelector)).some((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });

      if (modalIsOpen) {
        document.documentElement.classList.remove("login-cursor-enabled");
        if (cursor.style.opacity !== "0") cursor.style.opacity = "0";
        return true;
      }

      document.documentElement.classList.add("login-cursor-enabled");
      return false;
    };

    syncCursorMode();

    let hasPosition = false;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (syncCursorMode()) return;

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

    const observer = new MutationObserver((mutations) => {
      const modalChanged = mutations.some(
        (mutation) =>
          mutation.type === "childList" ||
          (mutation.target instanceof Element &&
            (mutation.target.matches(modalSelector) ||
              mutation.target.closest(modalSelector) !== null)),
      );
      if (modalChanged) syncCursorMode();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    const handleWindowBlur = () => {
        cursor.dataset.visible = "false";
        cursor.style.opacity = "0";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      observer.disconnect();
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
      <span className="login-custom-cursor__ring block size-9 rounded-full border border-[#F5F5F5]/90 bg-[#F5F5F5]/45 shadow-[#F5F5F5]" />
    </div>
  );
}