"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function LoginHeader3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1315);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Responsive width
  const W = Math.max(320, width);

  // Vertical parameters matching design
  const H_bar = 36; // Front face bar height
  const D_bevel = 13; // 3D underside bevel thickness
  const H_bevel = H_bar + D_bevel; // Total shelf height = 49px

  // Exact 6rem (96px) curve matching LoginFooter rounded-t-[6rem] pixel-perfect
  const R = 96; // 6rem = 96px radius
  const curveW = R; // 96px width
  const swoopH = H_bar + R; // 36 + 96 = 132px vertical depth
  const bevelSwoopH = swoopH + D_bevel; // 132 + 13 = 145px total 3D depth

  // Front face canopy path (true circular quarter arcs of radius R=96px)
  const pathFront = [
    `M 0 0`,
    `L ${W} 0`,
    `L ${W} ${swoopH}`,
    `A ${R} ${R} 0 0 0 ${W - curveW} ${H_bar}`,
    `L ${curveW} ${H_bar}`,
    `A ${R} ${R} 0 0 0 0 ${swoopH}`,
    `Z`,
  ].join(" ");

  // Underside bevel extrusion (concentric circular quarter arcs of radius R=96px)
  const pathBevel = [
    `M 0 ${swoopH}`,
    `A ${R} ${R} 0 0 1 ${curveW} ${H_bar}`,
    `L ${W - curveW} ${H_bar}`,
    `A ${R} ${R} 0 0 1 ${W} ${swoopH}`,
    `L ${W} ${bevelSwoopH}`,
    `A ${R} ${R} 0 0 0 ${W - curveW} ${H_bevel}`,
    `L ${curveW} ${H_bevel}`,
    `A ${R} ${R} 0 0 0 0 ${bevelSwoopH}`,
    `Z`,
  ].join(" ");

  // Drop shadow path (casts downwards from the underside into the cream background)
  // Outer boundary extends beyond SVG bounds so only the bottom bevel edge casts shadow inside the screen
  const pathShadow = [
    `M -60 -20`,
    `L ${W + 60} -20`,
    `L ${W + 60} ${bevelSwoopH}`,
    `L ${W} ${bevelSwoopH}`,
    `A ${R} ${R} 0 0 0 ${W - curveW} ${H_bevel}`,
    `L ${curveW} ${H_bevel}`,
    `A ${R} ${R} 0 0 0 0 ${bevelSwoopH}`,
    `L -60 ${bevelSwoopH}`,
    `Z`,
  ].join(" ");

  return (
    <header
      ref={containerRef}
      className="sticky top-0 z-30 w-full select-none"
      style={{ height: `${H_bar}px` }}
    >
      {/* 3D Header Geometry SVG */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[210px] overflow-visible">
        <svg
          className="size-full overflow-visible"
          viewBox={`0 0 ${W} 210`}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Front face velvet burgundy gradient */}
            <linearGradient id="header-front-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6C2834" />
              <stop offset="45%" stopColor="#722F37" />
              <stop offset="100%" stopColor="#722F37" />
            </linearGradient>


            {/* 3D Underside bevel extrusion gradient (facing downward into shadow) */}
            <linearGradient id="header-bevel-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3C151A" />
              <stop offset="35%" stopColor="#2E0E12" />
              <stop offset="75%" stopColor="#1B0507" />
              <stop offset="100%" stopColor="#0B0002" />
            </linearGradient>

            {/* Precise 3D cast shadow: 5px blur and increased downward offset Y as requested */}
            <filter
              id="header-shelf-shadow"
              x="-20%"
              y="-10%"
              width="140%"
              height="300%"
            >
              {/* 1. Main cast shadow with 5px blur and increased offset Y downwards */}
              <feDropShadow
                in="SourceGraphic"
                dx="3"
                dy="22"
                stdDeviation="5"
                floodColor="#38170B"
                floodOpacity="0.65"
                result="main"
              />
              {/* 2. Mid body shadow to maintain smooth depth */}
              <feDropShadow
                in="SourceGraphic"
                dx="1.8"
                dy="11"
                stdDeviation="3.5"
                floodColor="#1F0903"
                floodOpacity="0.82"
                result="body"
              />
              {/* 3. Deep contact occlusion seam right along bevel rim */}
              <feDropShadow
                in="SourceGraphic"
                dx="0.8"
                dy="3"
                stdDeviation="1.5"
                floodColor="#0E0200"
                floodOpacity="0.95"
                result="contact"
              />
              <feMerge>
                <feMergeNode in="main" />
                <feMergeNode in="body" />
                <feMergeNode in="contact" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* LAYER 1: 3D Cast Shadow */}
          <path
            d={pathShadow}
            fill="#060001"
            filter="url(#header-shelf-shadow)"
          />

          {/* LAYER 2: 3D Underside Bevel (Down-facing 3D shelf) */}
          <path d={pathBevel} fill="url(#header-bevel-grad)" />

          {/* LAYER 3: 3D Front Face (Burgundy Shelf) */}
          <path d={pathFront} fill="url(#header-front-grad)" />

          {/* Crisp division edge between front face and underside */}
          <path
            d={`M 0 ${swoopH} A ${R} ${R} 0 0 1 ${curveW} ${H_bar} L ${W - curveW} ${H_bar} A ${R} ${R} 0 0 1 ${W} ${swoopH}`}
            fill="none"
            stroke="#200407"
            strokeWidth="0.8"
          />

          {/* Top edge specular catch line */}
          <line
            x1="0"
            y1="1"
            x2={W}
            y2="1"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
          />
        </svg>

      </div>

      {/* Front Face Content Bar (Simple flat dots on left, clean OneGo logo on right) */}
      <div
        className="relative z-10 flex w-full items-center justify-between px-6 sm:px-9 lg:px-11"
        style={{ height: `${H_bar}px` }}
      >
        {/* Simple Flat Window Dots */}
        <div aria-hidden="true" className="flex items-center gap-2">
          <span className="size-3 rounded-full border border-black/20 bg-[#FF5F57] shadow-sm" />
          <span className="size-3 rounded-full border border-black/20 bg-[#FEBC2E] shadow-sm" />
          <span className="size-3 rounded-full border border-black/20 bg-[#28C840] shadow-sm" />
        </div>

        {/* Simple OneGo Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[#E8DCC6] transition-opacity hover:opacity-85"
          aria-label="OneGo home"
        >
          <span className="text-[1.35rem] font-bold leading-none tracking-tight">
            OneGo
          </span>
        </Link>
      </div>
    </header>
  );
}
