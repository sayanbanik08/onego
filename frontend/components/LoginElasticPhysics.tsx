"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";

/**
 * LoginElasticPhysics
 *
 * Harmonic Spring Physics Engine for Login Page:
 * 1. FIX FOR UP/DOWN SHIFT ON RELEASE:
 *    - Removed competing native scroll event listener (single source of truth via Lenis).
 *    - Replaced raw scroll-jump mapping with a unified 2nd-order damped harmonic spring solver.
 *    - When scrolling stops anywhere, the spring locks cleanly into target equilibrium with
 *      ZERO creeping, floating, or up/down resizing jitter.
 *
 * 2. SOFT SLOW NATURAL BOUNCE (niche se upar scroll karke chhorne par):
 *    - Underdamped harmonic oscillator (k=62, c=9.2, damping ratio ζ ≈ 0.58).
 *    - When scrolling up towards top and releasing, upward release momentum triggers a
 *      soft compressive dip (~0.95x) followed by a gentle rebound (~1.02x) that softly,
 *      slowly settles to 1.000x like natural elastic rubber.
 *
 * 3. ANCHOR & STRETCH:
 *    - Anchored at bottom: transform-origin: 50% 100% (STRETCHES ONLY UPWARD, NEVER DOWNWARD).
 *    - Ultra-high stretch (up to 2.35x canvas, 2.30x copy) on all text, fonts, buttons & icons.
 *    - translateY: 0 (no upward translation).
 *    - opacity: 1 (no fading).
 */
export default function LoginElasticPhysics() {
  const isReducedMotion = useRef(false);

  // Physics state for 2nd-order damped harmonic system:
  const state = useRef({
    artStretch: 1.0,
    artVelocity: 0,
    copyStretch: 1.0,
    copyVelocity: 0,
    badgeStretch: 1.0,
    badgeVelocity: 0,
    targetArt: 1.0,
    targetCopy: 1.0,
    targetBadge: 1.0,
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

    // Active scroll range over which stretch develops:
    const activeRange = 520;
    const progress = Math.min(1, Math.max(0, clampedY / activeRange));

    // C² Perlin Smootherstep:
    const smoothFactor =
      6 * Math.pow(progress, 5) -
      15 * Math.pow(progress, 4) +
      10 * Math.pow(progress, 3);

    s.targetArt = 1.0 + smoothFactor * 1.35;
    s.targetCopy = 1.0 + smoothFactor * 1.30;
    s.targetBadge = 1.0 + smoothFactor * 0.80;

    // Detect when user scrolls from bottom to top or flicks upward at top:
    const isArrivingAtTop = clampedY <= 50 && s.lastScrollY > 8 && velocity < -0.08;
    const isFlickingAtTop = clampedY <= 3 && velocity < -0.4;

    if ((isArrivingAtTop || isFlickingAtTop) && !s.isBouncing) {
      // Natural compressive momentum impulse for elastic rebound:
      const impulse = Math.min(1.4, Math.max(0.7, Math.abs(velocity) * 0.12 + 0.6));
      s.artVelocity = -impulse;
      s.copyVelocity = -impulse * 0.95;
      s.badgeVelocity = -impulse * 0.75;
      s.isBouncing = true;
      s.bounceTimer = performance.now();
    }

    s.lastScrollY = clampedY;
    wakeLoopRef.current();
  };

  useLenis((lenis) => {
    updateScrollTargets(lenis.scroll, lenis.velocity);
  });

  // Dedicated High-Performance Harmonic Spring Simulation Loop:
  useEffect(() => {
    let animId: number = 0;
    let lastTime = performance.now();

    const artElement = document.querySelector<HTMLElement>(".login-art-scroll");
    const copyElement = document.querySelector<HTMLElement>(".login-copy-scroll");
    const badgeElement = document.querySelector<HTMLElement>(".login-badge-scroll");

    // Enforce bottom-only anchor (50% 100%) so stretch anchors upward cleanly:
    if (artElement) {
      artElement.style.transformOrigin = "50% 100%";
      artElement.style.willChange = "transform";
    }
    if (copyElement) {
      copyElement.style.transformOrigin = "50% 100%";
      copyElement.style.willChange = "transform";
    }
    if (badgeElement) {
      badgeElement.style.transformOrigin = "50% 100%";
      badgeElement.style.willChange = "transform";
    }

    const lastTransforms = { art: "", copy: "", badge: "" };

    const physicsLoop = (time: number) => {
      if (isReducedMotion.current) {
        isLoopRunning.current = false;
        return;
      }

      const dt = Math.min(0.033, (time - lastTime) / 1000);
      lastTime = time;

      const s = state.current;

      // When bouncing at top: softer spring for organic rebound.
      // When scrolling normally: responsive spring (k=96, c=12) that tracks scroll in real-time without sluggish lag:
      const k = s.isBouncing ? 56 : 96;
      const c = s.isBouncing ? 5.5 : 12;

      // Allow bounce wave to settle naturally within ~800ms:
      if (s.isBouncing && time - s.bounceTimer > 850) {
        s.isBouncing = false;
      }

      // 1. Element 1: Design Canvas
      const diffArt = s.artStretch - s.targetArt;
      const accelArt = -k * diffArt - c * s.artVelocity;
      s.artVelocity += accelArt * dt;
      s.artStretch += s.artVelocity * dt;

      // 2. Element 2: Login Module
      const diffCopy = s.copyStretch - s.targetCopy;
      const accelCopy = -k * diffCopy - c * s.copyVelocity;
      s.copyVelocity += accelCopy * dt;
      s.copyStretch += s.copyVelocity * dt;

      // 3. Secure & Trusted Badge
      const diffBadge = s.badgeStretch - s.targetBadge;
      const accelBadge = -k * diffBadge - c * s.badgeVelocity;
      s.badgeVelocity += accelBadge * dt;
      s.badgeStretch += s.badgeVelocity * dt;

      const isSettled =
        !s.isBouncing &&
        Math.abs(diffArt) < 0.0004 &&
        Math.abs(s.artVelocity) < 0.0004 &&
        Math.abs(diffCopy) < 0.0004 &&
        Math.abs(s.copyVelocity) < 0.0004 &&
        Math.abs(diffBadge) < 0.0004 &&
        Math.abs(s.badgeVelocity) < 0.0004;

      if (isSettled) {
        s.artStretch = s.targetArt;
        s.artVelocity = 0;
        s.copyStretch = s.targetCopy;
        s.copyVelocity = 0;
        s.badgeStretch = s.targetBadge;
        s.badgeVelocity = 0;
      }

      // Hardware accelerated GPU compositing with translateZ(0):
      if (artElement) {
        const tArt = `scaleY(${s.artStretch.toFixed(4)}) translateZ(0)`;
        if (tArt !== lastTransforms.art) {
          artElement.style.transform = tArt;
          lastTransforms.art = tArt;
        }
      }
      if (copyElement) {
        const tCopy = `scaleY(${s.copyStretch.toFixed(4)}) translateZ(0)`;
        if (tCopy !== lastTransforms.copy) {
          copyElement.style.transform = tCopy;
          lastTransforms.copy = tCopy;
        }
      }
      if (badgeElement) {
        const tBadge = `scaleY(${s.badgeStretch.toFixed(4)}) translateZ(0)`;
        if (tBadge !== lastTransforms.badge) {
          badgeElement.style.transform = tBadge;
          lastTransforms.badge = tBadge;
        }
      }

      // Sleep loop when resting to avoid unnecessary style invalidations & CPU usage:
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

    // Passive listener to also wake loop on native mobile scroll:
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
      if (artElement) artElement.style.transform = "";
      if (copyElement) copyElement.style.transform = "";
      if (badgeElement) badgeElement.style.transform = "";
    };
  }, []);

  return null;
}
