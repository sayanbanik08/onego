"use client";

import { ReactLenis } from "lenis/react";
import { useSyncExternalStore, type ReactNode } from "react";

const subscribeToReducedMotion = (onChange: () => void) => {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", onChange);

  return () => mediaQuery.removeEventListener("change", onChange);
};

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function LoginSmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    prefersReducedMotion,
    () => true,
  );

  if (reduceMotion) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{ lerp: 0.06, wheelMultiplier: 0.75, syncTouch: true }}
    >
      {children}
    </ReactLenis>
  );
}