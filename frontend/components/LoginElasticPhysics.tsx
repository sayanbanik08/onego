"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";

/**
 * LoginElasticPhysics
 *
 * Dedicated Harmonic Spring Physics Engine for Login Page:
 * 1. DESIGN PAD (#showcase):
 *    - Preserved in original layout (lg:translate-y-20) without shifting upwards at rest.
 *    - Anchored at bottom (origin: 50% 100%), stretches purely in HEIGHT (scaleY) on scroll.
 *
 * 2. SECURE & TRUSTED BADGE (#login-trust-badge):
 *    - Laptop view: Anchored at base (origin: 50% 100%), stretches purely UPWARDS into the gap.
 *      Never stretches downwards, completely preventing footer collisions.
 *    - Mobile view: Does NOT move upwards (translateY = 0), stretches in place in HEIGHT (scaleY).
 *
 * 3. LOGIN MODULE (#login-module-content):
 *    - Laptop view: Full elastic height stretch upwards.
 *    - Mobile view: Increased, tactile elastic height stretch (up to 1.75x) with preserved clearance.
 *
 * 4. PAINTBRUSH (#login-paintbrush):
 *    - Laptop view: Shares the same elastic height stretch as the design pad.
 *    - Mobile view: Stretches with the unified layout container.
 *
 * 5. SPRING PHYSICS ENGINE:
 *    - Underdamped harmonic oscillator (k=56, c=5.5) on flick/top arrival for organic rebound.
 *    - Responsive scroll tracking (k=96, c=12).
 *    - Sleeping RAF loop: 0% CPU/GPU overhead when at rest.
 */
export default function LoginElasticPhysics() {
  const isReducedMotion = useRef(false);
  const topBlurElement = useRef<HTMLElement | null>(null);
  const topBlurTimeout = useRef<number | null>(null);

  // Physics state for harmonic spring system:
  const state = useRef({
    stretch: 1.0,
    velocity: 0,
    target: 1.0,
    lastScrollY: 0,
    isBouncing: false,
    bounceTimer: 0,
  });

  useEffect(() => {
    isReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const isLoopRunning = useRef(false);
  const wakeLoopRef = useRef<() => void>(() => {});

  // Update target stretch from scroll position:
  const updateScrollTargets = (scrollY: number, velocity: number) => {
    const s = state.current;
    const clampedY = Math.max(0, scrollY);
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    const scrollDelta = clampedY - s.lastScrollY;

    if (Math.abs(scrollDelta) > 0.1 || Math.abs(velocity) > 0.02) {
      if (topBlurElement.current) {
        topBlurElement.current.style.opacity = "1";
      }
      if (topBlurTimeout.current !== null) {
        window.clearTimeout(topBlurTimeout.current);
      }
      topBlurTimeout.current = window.setTimeout(() => {
        if (topBlurElement.current) {
          topBlurElement.current.style.opacity = "0";
        }
        topBlurTimeout.current = null;
      }, 220);
    }

    // Mobile has shorter scroll distance, so responsive active range makes height stretch responsive immediately:
    const activeRange = isDesktop ? 500 : 360;
    const progress = Math.min(1, Math.max(0, clampedY / activeRange));

    // C² Perlin Smootherstep:
    const smoothFactor =
      6 * Math.pow(progress, 5) -
      15 * Math.pow(progress, 4) +
      10 * Math.pow(progress, 3);

    // Enhanced height stretch on mobile (up to 2.45x peak height stretch):
    const maxStretch = isDesktop ? 1.20 : 1.45;
    s.target = 1.0 + smoothFactor * maxStretch;

    // Detect when user arrives at top or flicks upward at top:
    const isArrivingAtTop = clampedY <= 50 && s.lastScrollY > 8 && velocity < -0.08;
    const isFlickingAtTop = clampedY <= 3 && velocity < -0.4;

    if ((isArrivingAtTop || isFlickingAtTop) && !s.isBouncing) {
      // Natural compressive momentum impulse for elastic rebound:
      const impulse = Math.min(1.4, Math.max(0.7, Math.abs(velocity) * 0.12 + 0.6));
      s.velocity = -impulse;
      s.isBouncing = true;
      s.bounceTimer = performance.now();
    }

    s.lastScrollY = clampedY;
    wakeLoopRef.current();
  };

  useLenis((lenis) => {
    updateScrollTargets(lenis.scroll, lenis.velocity);
  });

  // Dedicated High-Performance Simulation Loop:
  useEffect(() => {
    let animId: number = 0;
    let lastTime = performance.now();

    const showcaseElement = document.querySelector<HTMLElement>("#showcase");
    const loginModuleElement = document.querySelector<HTMLElement>("#login-module-content");
    const paintbrushElement = document.querySelector<HTMLElement>("#login-paintbrush");
    const unifiedElement = document.querySelector<HTMLElement>(".login-unified-scroll");
    topBlurElement.current = document.querySelector<HTMLElement>("#login-section-top-blur");

    // Anchor setup:
    if (showcaseElement) {
      showcaseElement.style.transformOrigin = "50% 100%";
      showcaseElement.style.willChange = "transform";
    }
    if (loginModuleElement) {
      loginModuleElement.style.transformOrigin = "50% 100%";
      loginModuleElement.style.willChange = "transform";
    }
    if (paintbrushElement) {
      paintbrushElement.style.transformOrigin = "50% 100%";
      paintbrushElement.style.willChange = "transform";
    }
    if (unifiedElement) {
      unifiedElement.style.transformOrigin = "50% 100%";
      unifiedElement.style.willChange = "transform";
    }

    let lastShowcaseTransform = "";
    let lastModuleTransform = "";
    let lastPaintbrushTransform = "";
    let lastUnifiedTransform = "";

    const physicsLoop = (time: number) => {
      if (isReducedMotion.current) {
        isLoopRunning.current = false;
        return;
      }

      const dt = Math.min(0.033, (time - lastTime) / 1000);
      lastTime = time;

      const s = state.current;

      // Spring parameters:
      // - Soft bounce at top (k=56, c=5.5)
      // - Responsive scroll tracking (k=96, c=12)
      const k = s.isBouncing ? 56 : 96;
      const c = s.isBouncing ? 5.5 : 12;

      // Settle bounce wave within ~850ms:
      if (s.isBouncing && time - s.bounceTimer > 850) {
        s.isBouncing = false;
      }

      const diff = s.stretch - s.target;
      const accel = -k * diff - c * s.velocity;
      s.velocity += accel * dt;
      s.stretch += s.velocity * dt;

      const isSettled =
        !s.isBouncing &&
        Math.abs(diff) < 0.0004 &&
        Math.abs(s.velocity) < 0.0004;

      if (isSettled) {
        s.stretch = s.target;
        s.velocity = 0;
      }

      const isDesktop = window.innerWidth >= 1024;
      const stretchVal = s.stretch;

      if (isDesktop) {
        // Laptop view (2-column layout):
        // Each column stretches individually with upward anchor
        if (showcaseElement) {
          const showcaseT = `scaleY(${stretchVal.toFixed(4)}) translateZ(0)`;
          if (showcaseT !== lastShowcaseTransform) {
            showcaseElement.style.transform = showcaseT;
            lastShowcaseTransform = showcaseT;
          }
        }

        if (loginModuleElement) {
          const moduleT = `scaleY(${stretchVal.toFixed(4)}) translateZ(0)`;
          if (moduleT !== lastModuleTransform) {
            loginModuleElement.style.transform = moduleT;
            lastModuleTransform = moduleT;
          }
        }

        if (paintbrushElement) {
          const paintbrushT = `scaleY(${stretchVal.toFixed(4)}) translateZ(0)`;
          if (paintbrushT !== lastPaintbrushTransform) {
            paintbrushElement.style.transform = paintbrushT;
            lastPaintbrushTransform = paintbrushT;
          }
        }

        if (unifiedElement && lastUnifiedTransform !== "") {
          unifiedElement.style.transform = "";
          lastUnifiedTransform = "";
        }
      } else {
        // Mobile view (stacked layout):
        // Stretch the 2 elements TOGETHER via their shared container (.login-unified-scroll)
        // so that Element 2 (login module) never climbs over Element 1 (design canvas).
        if (showcaseElement && lastShowcaseTransform !== "") {
          showcaseElement.style.transform = "";
          lastShowcaseTransform = "";
        }
        if (loginModuleElement && lastModuleTransform !== "") {
          loginModuleElement.style.transform = "";
          lastModuleTransform = "";
        }
        if (paintbrushElement && lastPaintbrushTransform !== "") {
          paintbrushElement.style.transform = "";
          lastPaintbrushTransform = "";
        }
        if (unifiedElement) {
          const unifiedT = `scaleY(${stretchVal.toFixed(4)}) translateZ(0)`;
          if (unifiedT !== lastUnifiedTransform) {
            unifiedElement.style.transform = unifiedT;
            lastUnifiedTransform = unifiedT;
          }
        }
      }

      // Sleep loop when resting:
      if (isSettled) {
        isLoopRunning.current = false;
        return;
      }

      animId = requestAnimationFrame(physicsLoop);
    };

    const wakeLoop = () => {
      if (!isLoopRunning.current) {
        isLoopRunning.current = true;
        lastTime = performance.now();
        animId = requestAnimationFrame(physicsLoop);
      }
    };

    wakeLoopRef.current = wakeLoop;
    wakeLoop();

    // Passive listener to also wake loop on native mobile touch scroll:
    const handleNativeScroll = () => {
      if (window.scrollY !== state.current.lastScrollY) {
        updateScrollTargets(window.scrollY, 0);
      }
    };
    window.addEventListener("scroll", handleNativeScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      isLoopRunning.current = false;
      wakeLoopRef.current = () => {};
      window.removeEventListener("scroll", handleNativeScroll);
      if (topBlurTimeout.current !== null) {
        window.clearTimeout(topBlurTimeout.current);
        topBlurTimeout.current = null;
      }
      topBlurElement.current = null;
      if (showcaseElement) showcaseElement.style.transform = "";
      if (loginModuleElement) loginModuleElement.style.transform = "";
      if (paintbrushElement) paintbrushElement.style.transform = "";
      if (unifiedElement) unifiedElement.style.transform = "";
    };
  }, []);

  return null;
}
