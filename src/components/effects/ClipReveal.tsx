"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState, ReactNode } from "react";

type ClipRevealMode = "center-x" | "center-y" | "circle" | "diagonal";

interface ClipRevealProps {
  children: ReactNode;
  mode?: ClipRevealMode;
  className?: string;
  once?: boolean;
}

const clipPaths: Record<ClipRevealMode, [string, string]> = {
  "center-x": ["inset(0 50% 0 50%)", "inset(0 0% 0 0%)"],
  "center-y": ["inset(50% 0 50% 0)", "inset(0% 0 0% 0)"],
  circle: ["circle(0% at 50% 50%)", "circle(75% at 50% 50%)"],
  diagonal: ["polygon(0 0, 0 0, 0 0)", "polygon(0 0, 100% 0, 100% 100%, 0 100%)"],
};

export default function ClipReveal({
  children,
  mode = "center-x",
  className = "",
  once = true,
}: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasRevealed, setHasRevealed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (once && latest >= 1) {
      setHasRevealed(true);
    }
  });

  const [from, to] = clipPaths[mode];
  const clipPath = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <motion.div
      ref={ref}
      style={{ clipPath: hasRevealed ? to : clipPath }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
