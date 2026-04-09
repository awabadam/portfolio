"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    // Skip Lenis on touch-only devices (phones, tablets). Native mobile
    // scroll is already smooth; Lenis adds a heavy continuous RAF loop
    // that drains battery and inflates TBT without any visual benefit.
    const isTouchOnly =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (isTouchOnly) return;

    let lenisInstance: { destroy: () => void } | null = null;
    let rafId = 0;
    let cancelled = false;

    // Defer Lenis init until the browser is idle so it doesn't compete
    // with LCP / hydration work on the critical path.
    const startLenis = async () => {
      if (cancelled) return;
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });
      lenisInstance = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    };

    const idleHandle = (() => {
      const ric = (window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }).requestIdleCallback;
      if (ric) return ric(() => void startLenis(), { timeout: 2000 });
      return window.setTimeout(() => void startLenis(), 1500);
    })();

    return () => {
      cancelled = true;
      const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (cic) cic(idleHandle);
      else window.clearTimeout(idleHandle);
      if (rafId) cancelAnimationFrame(rafId);
      if (lenisInstance) lenisInstance.destroy();
    };
  }, []);

  return null;
}
