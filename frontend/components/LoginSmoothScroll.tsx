"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import LoginElasticPhysics from "./LoginElasticPhysics";

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

  useEffect(() => {
    document.documentElement.classList.add("login-page-scrollbar-hidden");

    return () => {
      document.documentElement.classList.remove("login-page-scrollbar-hidden");
    };
  }, []);

  if (reduceMotion) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.12,
        wheelMultiplier: 1.0,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      <LoginElasticPhysics />
      {children}
    </ReactLenis>
  );
}