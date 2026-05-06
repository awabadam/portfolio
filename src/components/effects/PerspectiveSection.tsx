"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface PerspectiveSectionProps {
  children: ReactNode;
  className?: string;
  /** Controls how dramatic the effect is (default 1) */
  intensity?: number;
}

export default function PerspectiveSection({
  children,
  className = "",
  intensity = 1,
}: PerspectiveSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Apply effects only in the second half of scroll progress (0.5 to 1).
  // First half keeps all values at their defaults.
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, -8 * intensity]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.6]);

  return (
    <div ref={ref} className={className} style={{ perspective: 1200 }}>
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          transformOrigin: "center bottom",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
