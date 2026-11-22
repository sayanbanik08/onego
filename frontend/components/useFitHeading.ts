"use client";

import { useEffect, useRef, type RefObject } from "react";

export function useFitHeading(): RefObject<HTMLSpanElement | null> {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const fit = () => {
      const container = element.parentElement;
      if (!container) return;

      const availableWidth = container.clientWidth;
      if (!availableWidth) return;

      let low = 16;
      let high = 1200;

      for (let i = 0; i < 24; i += 1) {
        const nextSize = (low + high) / 2;
        element.style.fontSize = `${nextSize}px`;

        if (element.scrollWidth <= availableWidth) {
          low = nextSize;
        } else {
          high = nextSize;
        }
      }

      element.style.fontSize = `${low}px`;
    };

    fit();
    void document.fonts?.ready.then(fit);

    const observer = new ResizeObserver(fit);
    if (element.parentElement) observer.observe(element.parentElement);

    return () => observer.disconnect();
  }, []);

  return textRef;
}
