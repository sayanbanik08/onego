"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface OneGo3DLogoProps {
  text?: string;
  className?: string;
}

export default function OneGo3DLogo({
  text = "onego",
  className = "",
}: OneGo3DLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // View dimensions
    const width = 415;
    const height = 110;

    // Three.js Scene
    const scene = new THREE.Scene();

    // Orthographic Camera
    const camera = new THREE.OrthographicCamera(
      0,
      width,
      height,
      0,
      -100,
      300
    );
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    // High performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "auto";
    renderer.domElement.style.display = "block";

    // Clay Physical Material (Rich Burgundy with soft satin sheen)
    const clayMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#6A2231"),
      roughness: 0.34,
      metalness: 0.02,
      clearcoat: 0.35,
      clearcoatRoughness: 0.32,
      sheen: 0.45,
      sheenColor: new THREE.Color("#C45870"),
      sheenRoughness: 0.28,
    });

    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // Helpers
    const createTube = (points: THREE.Vector3[], radius: number, closed = false) => {
      const curve = new THREE.CatmullRomCurve3(points, closed, "centripetal", 0.1);
      const geom = new THREE.TubeGeometry(curve, 96, radius, 32, closed);
      return new THREE.Mesh(geom, clayMaterial);
    };

    const createCap = (pos: THREE.Vector3, radius: number) => {
      const geom = new THREE.SphereGeometry(radius, 32, 24);
      const mesh = new THREE.Mesh(geom, clayMaterial);
      mesh.position.copy(pos);
      return mesh;
    };

    const createTorus = (cx: number, cy: number, radius: number, tubeRadius: number) => {
      const geom = new THREE.TorusGeometry(radius, tubeRadius, 32, 64);
      const mesh = new THREE.Mesh(geom, clayMaterial);
      mesh.position.set(cx, cy, tubeRadius);
      return mesh;
    };

    // =========================================================================
    // LEVEL COMFORTAA 3D GEOMETRY
    // =========================================================================
    // LEVEL COMFORTAA 3D GEOMETRY - SCALED UP & PLUMP
    // Top = 78.5, Bottom = 17.5 (Center = 48.0, Height = 61px)
    // =========================================================================
    // Scale factor ~1.15x from original 360x96 layout
    const S = 1.153;
    const yCenter = 48 * S;
    const r = 18.5 * S;
    const t = 12.0 * S;

    // 1. 'o' (First Lowercase Torus)
    const xo1 = 44 * S;
    logoGroup.add(createTorus(xo1, yCenter, r, t));

    // 2. 'n' (Comfortaa Lowercase n)
    const xnL = 94 * S;
    const xnR = 134 * S;
    const ynBot = 17.5 * S + t;
    const ynArchBase = 48 * S;
    const nRad = (xnR - xnL) / 2;
    const nMidX = (xnL + xnR) / 2;

    const nPts: THREE.Vector3[] = [
      new THREE.Vector3(xnL, ynBot, t),
      new THREE.Vector3(xnL, ynArchBase, t),
    ];
    for (let i = 0; i <= 16; i++) {
      const ang = Math.PI - (i / 16) * Math.PI;
      nPts.push(new THREE.Vector3(nMidX + Math.cos(ang) * nRad, ynArchBase + Math.sin(ang) * r, t));
    }
    nPts.push(new THREE.Vector3(xnR, ynArchBase, t));
    nPts.push(new THREE.Vector3(xnR, ynBot, t));

    logoGroup.add(createTube(nPts, t, false));
    logoGroup.add(createCap(new THREE.Vector3(xnL, ynBot, t), t));
    logoGroup.add(createCap(new THREE.Vector3(xnR, ynBot, t), t));

    // 3. 'e' (Comfortaa Lowercase e)
    const xe = 180 * S;
    const barY = yCenter - 1 * S;
    logoGroup.add(createTube([
      new THREE.Vector3(xe - r + 0.5 * S, barY, t),
      new THREE.Vector3(xe + r - 0.5 * S, barY, t),
    ], t * 0.9, false));

    const ePts: THREE.Vector3[] = [];
    const eEndAngle = 1.74 * Math.PI;
    for (let i = 0; i <= 28; i++) {
      const ang = (i / 28) * eEndAngle;
      ePts.push(new THREE.Vector3(xe + Math.cos(ang) * r, yCenter + Math.sin(ang) * r, t));
    }
    logoGroup.add(createTube(ePts, t, false));
    logoGroup.add(createCap(new THREE.Vector3(xe + Math.cos(eEndAngle) * r, yCenter + Math.sin(eEndAngle) * r, t), t));

    // 4. 'g' (Level Comfortaa g: Upper Bowl + Hook)
    const xg = 244 * S;
    const ygBowl = 57.0 * S;
    const rBowl = 12.0 * S;
    const tBowl = 9.5 * S;
    logoGroup.add(createTorus(xg, ygBowl, rBowl, tBowl));

    const gStemX = xg + rBowl;
    const gHookRadius = 13.5 * S;
    const gHookCenterY = 17.5 * S + tBowl + gHookRadius;
    const gPts: THREE.Vector3[] = [
      new THREE.Vector3(gStemX, ygBowl + 7 * S, tBowl),
      new THREE.Vector3(gStemX, gHookCenterY, tBowl),
    ];
    for (let i = 0; i <= 16; i++) {
      const ang = (i / 16) * (Math.PI * 0.95);
      const hx = (gStemX - gHookRadius) + Math.cos(-ang) * gHookRadius;
      const hy = gHookCenterY + Math.sin(-ang) * gHookRadius;
      gPts.push(new THREE.Vector3(hx, hy, tBowl));
    }
    logoGroup.add(createTube(gPts, tBowl, false));
    const gLastPt = gPts[gPts.length - 1];
    logoGroup.add(createCap(gLastPt, tBowl));

    // 5. 'o' (Second Lowercase Torus)
    const xo2 = 308 * S;
    logoGroup.add(createTorus(xo2, yCenter, r, t));

    // =========================================================================
    // STUDIO 3D CLAY LIGHTING
    // =========================================================================
    const ambientLight = new THREE.AmbientLight(0xfff7ee, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.9);
    keyLight.position.set(width * 0.45, height * 2.5, 150);
    scene.add(keyLight);

    const sheenLight = new THREE.DirectionalLight(0xffdbe3, 1.4);
    sheenLight.position.set(width * 0.28, height * 2.1, 110);
    scene.add(sheenLight);

    const fillLight = new THREE.DirectionalLight(0x942d40, 0.7);
    fillLight.position.set(width * 0.75, -height * 0.8, 90);
    scene.add(fillLight);

    // Render pristine static frame
    renderer.render(scene, camera);

    return () => {
      renderer.dispose();
      clayMaterial.dispose();
    };
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[380px] select-none ${className}`}
      style={{
        aspectRatio: "415 / 110",
        // Shadow: offset-x 4px, offset-y 7px, tight 4px blur
        filter: "drop-shadow(4px 7px 4px rgba(12, 12, 12, 0.99))",
      }}
    />
  );
}
