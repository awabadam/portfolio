"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface DepthFloatProps {
  children?: React.ReactNode;
  className?: string;
  depth?: number;
  maxOffset?: number;
}

/**
 * Floating decorative wrapper that responds to mouse movement with
 * depth-based parallax. Elements with higher `depth` values move more,
 * creating a diorama / layered-depth effect.
 *
 * On touch-only devices this is a no-op passthrough — there's no
 * persistent cursor to track, so the listeners would add pointless overhead.
 */
export default function DepthFloat({
  children,
  className = "",
  depth = 0.5,
  maxOffset = 30,
}: DepthFloatProps) {
  const [isTouchOnly, setIsTouchOnly] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const x = useTransform(springX, (v) => v * depth * maxOffset);
  const y = useTransform(springY, (v) => v * depth * maxOffset);

  useEffect(() => {
    setIsTouchOnly(
      window.matchMedia("(hover: none) and (pointer: coarse)").matches
    );
  }, []);

  useEffect(() => {
    if (isTouchOnly) return;

    function handleMouseMove(e: MouseEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(nx);
      mouseY.set(ny);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTouchOnly, mouseX, mouseY]);

  if (isTouchOnly) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} style={{ x, y }}>
      {children}
    </motion.div>
  );
}
