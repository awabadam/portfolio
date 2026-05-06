"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  scrollMultiplier?: number;
}

export default function HorizontalScroll({
  children,
  className = "",
  scrollMultiplier = 3,
}: HorizontalScrollProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: outerRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <div ref={outerRef} style={{ height: `${scrollMultiplier * 100}vh` }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <motion.div
          style={{
            x,
            display: "flex",
            gap: "2rem",
            width: "fit-content",
          }}
          className={className}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
