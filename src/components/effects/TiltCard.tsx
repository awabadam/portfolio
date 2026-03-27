"use client";

import { useRef, useCallback, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltStrength?: number;
  glare?: boolean;
}

/**
 * Wraps content in a 3D tilt effect that follows cursor on hover.
 */
export default function TiltCard({
  children,
  className = "",
  tiltStrength = 10,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);

  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });
  const springGlareOpacity = useSpring(glareOpacity, { stiffness: 200, damping: 20 });

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, transparent 60%)`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      rotateX.set((y - 0.5) * -tiltStrength);
      rotateY.set((x - 0.5) * tiltStrength);

      if (glare) {
        glareX.set(x * 100);
        glareY.set(y * 100);
        glareOpacity.set(0.15);
      }
    },
    [tiltStrength, glare, rotateX, rotateY, glareX, glareY, glareOpacity]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  }, [rotateX, rotateY, glareOpacity]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            opacity: springGlareOpacity,
            background: glareBackground,
          }}
        />
      )}
    </motion.div>
  );
}
