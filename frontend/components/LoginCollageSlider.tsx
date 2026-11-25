"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

interface CardItem {
  id: string;
  type: "dope" | "poster_a" | "cyan_aero" | "face_3d" | "hands";
  src: string;
  alt: string;
}

const baseCards: CardItem[] = [
  {
    id: "poster_a",
    type: "poster_a",
    src: "/collage/1.png",
    alt: "Create Typography Poster",
  },
  {
    id: "hands",
    type: "hands",
    src: "/collage/2.png",
    alt: "Your Typography Poster",
  },
  {
    id: "face_3d",
    type: "face_3d",
    src: "/collage/3.png",
    alt: "Portfolio Typography Poster",
  },
  {
    id: "dope",
    type: "dope",
    src: "/collage/4.png",
    alt: "In Typography Poster",
  },
  {
    id: "cyan_aero",
    type: "cyan_aero",
    src: "/collage/5.png",
    alt: "OneGo Typography Poster",
  },
];

// Repeat 6 times to ensure seamless infinite coverage across all screen sizes
const repeatedCards = Array.from({ length: 6 }, (_, setIdx) =>
  baseCards.map((card) => ({
    ...card,
    uniqueKey: `${card.id}-set-${setIdx}`,
  }))
).flat();

export default function LoginCollageSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Physics & Animation state refs
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartCoordRef = useRef({ x: 0, y: 0 });
  const lastCoordRef = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);
  const [isClient, setIsClient] = useState(false);

  // Angle in degrees: 35 degrees diagonal tilt from top-left to bottom-right
  const TILT_ANGLE = 35;
  const angleRad = (TILT_ANGLE * Math.PI) / 180;
  const cosA = Math.cos(angleRad);
  const sinA = Math.sin(angleRad);

  // Measure unrotated layout width and gap from DOM for 100% pixel-perfect wrapping
  const getCardStep = useCallback(() => {
    if (!trackRef.current || !trackRef.current.firstElementChild) {
      if (typeof window === "undefined") return 422;
      if (window.innerWidth < 640) return 290;
      if (window.innerWidth < 1024) return 360;
      return 422;
    }
    const firstCard = trackRef.current.firstElementChild as HTMLElement;
    const cardWidth = firstCard.offsetWidth || 380;
    const style = window.getComputedStyle(trackRef.current);
    const gap = parseFloat(style.columnGap || style.gap) || 40;
    return cardWidth + gap;
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const cardStep = getCardStep();
      const singleSetWidth = cardStep * baseCards.length;

      // Base auto-scroll speed: 1 full cycle of 5 cards every 10 seconds (exact reference video timing)
      const baseSpeed = singleSetWidth / 10.0; // ~211 px/sec 

      if (!isDraggingRef.current) {
        // Natural speed target (slows slightly on hover for smooth reading)
        const targetSpeed = isHoveredRef.current ? baseSpeed * 0.35 : baseSpeed;

        // Smoothly blend extra drag/wheel velocity back to target speed
        velocityRef.current += (targetSpeed - velocityRef.current) * 0.06;
        offsetRef.current += velocityRef.current * dt;
      }

      // Mathematical seamless infinite wrapping:
      // Keep offset within [0, singleSetWidth)
      offsetRef.current =
        ((offsetRef.current % singleSetWidth) + singleSetWidth) %
        singleSetWidth;

      if (trackRef.current) {
        // Centered diagonal track translation
        trackRef.current.style.transform = `translate(-50%, -50%) rotate(${TILT_ANGLE}deg) translate3d(${offsetRef.current}px, 0, 0)`;
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [getCardStep]);

  // Pointer drag interactions (Touch & Mouse)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartCoordRef.current = { x: e.clientX, y: e.clientY };
    lastCoordRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastCoordRef.current.x;
    const dy = e.clientY - lastCoordRef.current.y;
    lastCoordRef.current = { x: e.clientX, y: e.clientY };

    // Project 2D pointer movement onto the diagonal axis vector (cosA, sinA)
    const projectedDelta = dx * cosA + dy * sinA;

    offsetRef.current += projectedDelta * 1.15;
    // Velocity estimation in px/s
    velocityRef.current = projectedDelta * 60;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  // Wheel interaction (mouse scroll accelerates track)
  const handleWheel = (e: React.WheelEvent) => {
    const wheelDelta = e.deltaY * 0.45;
    offsetRef.current += wheelDelta;
    velocityRef.current = wheelDelta * 15;
  };

  return (
    <section
      ref={containerRef}
      className="relative isolate z-20 -mt-9 h-[100dvh] min-h-[640px] w-full overflow-hidden bg-transparent text-white cursor-grab active:cursor-grabbing select-none"
      aria-label="OneGo Diagonal Collage Slider"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        isDraggingRef.current = false;
      }}
      onWheel={handleWheel}
    >
      {/* Diagonal Infinite Track */}
      <div
        ref={trackRef}
        className="absolute left-1/2 top-1/2 flex items-center will-change-transform"
        style={{
          transform: `translate(-50%, -50%) rotate(${TILT_ANGLE}deg) translate3d(0, 0, 0)`,
          gap: "clamp(24px, 3.2vw, 42px)",
        }}
      >
        {isClient &&
          repeatedCards.map((card) => (
            <article
              key={card.uniqueKey}
              className="relative shrink-0 overflow-hidden rounded-none transition-transform duration-200"
              style={{
                width: "clamp(260px, 26vw, 380px)",
                aspectRatio: "600 / 840",
              }}
            >
              {/* Inner card rendering */}
              <div className="relative size-full overflow-hidden bg-transparent">
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 640px) 260px, (max-width: 1024px) 340px, 380px"
                  className="object-contain pointer-events-none"
                  priority={card.uniqueKey.includes("-set-0") || card.uniqueKey.includes("-set-1")}
                />
              </div>
            </article>
          ))}
      </div>

    </section>
  );
}
