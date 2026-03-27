"use client";

import { useEffect, useRef, useCallback } from "react";

interface MousePosition {
  x: number; // -1 to 1 (normalized to viewport)
  y: number; // -1 to 1 (normalized to viewport)
  clientX: number;
  clientY: number;
}

/**
 * Tracks mouse position with smooth interpolation.
 * Returns a ref that updates every frame without causing re-renders.
 */
export function useMousePosition(smoothing = 0.1) {
  const position = useRef<MousePosition>({ x: 0, y: 0, clientX: 0, clientY: 0 });
  const target = useRef<MousePosition>({ x: 0, y: 0, clientX: 0, clientY: 0 });
  const rafId = useRef<number>(0);

  const lerp = useCallback(() => {
    position.current.x += (target.current.x - position.current.x) * smoothing;
    position.current.y += (target.current.y - position.current.y) * smoothing;
    position.current.clientX += (target.current.clientX - position.current.clientX) * smoothing;
    position.current.clientY += (target.current.clientY - position.current.clientY) * smoothing;
    rafId.current = requestAnimationFrame(lerp);
  }, [smoothing]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
        clientX: e.clientX,
        clientY: e.clientY,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId.current = requestAnimationFrame(lerp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [lerp]);

  return position;
}
