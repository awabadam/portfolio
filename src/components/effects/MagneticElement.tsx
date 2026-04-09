"use client";

import { useRef, useCallback, useState, useEffect, createElement } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticElementProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // How far it moves (px)
  as?: "div" | "span" | "a";
}

/**
 * Wraps any element to give it a magnetic cursor-follow effect on hover.
 * The element subtly pulls toward the mouse when hovered.
 *
 * On touch-only devices (phones/tablets) this is a no-op passthrough —
 * a magnetic cursor effect obviously makes no sense without a cursor
 * and attaching mousemove listeners on mobile just wastes battery and
 * adds TBT.
 */
export default function MagneticElement({
  children,
  className = "",
  strength = 30,
  as = "div",
}: MagneticElementProps) {
  const [isTouchOnly, setIsTouchOnly] = useState(false);

  useEffect(() => {
    setIsTouchOnly(
      window.matchMedia("(hover: none) and (pointer: coarse)").matches
    );
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  const [, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      x.set(deltaX * strength);
      y.set(deltaY * strength);
    },
    [strength, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }, [x, y]);

  // Touch-only short-circuit: skip framer-motion, listeners, springs.
  if (isTouchOnly) {
    return createElement(as, { className }, children);
  }

  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Component>
  );
}
