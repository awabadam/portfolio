"use client";

import { useEffect, useRef } from "react";

const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrolled = document.documentElement.scrollTop;
        const total =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        if (barRef.current) {
          barRef.current.style.width = `${(scrolled / total) * 100}%`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 z-50 h-1 bg-primary/20"
      style={{ width: 0 }}
    />
  );
};

export default ScrollProgress;
