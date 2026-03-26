"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Cinematic page transition with reveal effect
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Transition overlay */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key="transition-overlay"
            className="fixed inset-0 z-[100] pointer-events-none"
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* First layer - fast */}
            <motion.div
              className="absolute inset-0 bg-foreground origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0, 1, 1, 0] }}
              transition={{
                duration: 0.8,
                times: [0, 0.4, 0.6, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: "left" }}
            />
            {/* Second layer - slightly delayed */}
            <motion.div
              className="absolute inset-0 bg-primary origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0, 1, 1, 0] }}
              transition={{
                duration: 0.8,
                times: [0, 0.4, 0.6, 1],
                ease: [0.22, 1, 0.36, 1],
                delay: 0.05,
              }}
              style={{ transformOrigin: "left" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content with fade */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        className="flex min-h-screen w-full flex-col"
      >
        {children}
      </motion.div>
    </>
  );
}
