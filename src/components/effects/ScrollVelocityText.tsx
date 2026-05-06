"use client";

import { ReactNode } from "react";
import { motion, useScroll, useVelocity, useSpring, useTransform } from "framer-motion";

interface ScrollVelocityTextProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

/**
 * Makes its children react to scroll velocity — the content skews
 * along the Y axis when the user scrolls fast, then springs back
 * to rest when scrolling stops. Gives text a subtle "alive" feeling.
 */
export default function ScrollVelocityText({
  children,
  className = "",
  intensity = 1,
}: ScrollVelocityTextProps) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);

  const skewYRaw = useTransform(
    velocity,
    [-1000, 0, 1000],
    [-3 * intensity, 0, 3 * intensity]
  );

  const skewY = useSpring(skewYRaw, { stiffness: 150, damping: 20 });

  return (
    <motion.div className={className} style={{ skewY }}>
      {children}
    </motion.div>
  );
}
