"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HOLD = 2200; // ms to hold after letters land

export default function LoadingScreen() {
  const [phase, setPhase] = useState("idle"); // idle | intro | exit | done

  useEffect(() => {
    const cover = document.getElementById("intro-cover");

    if (sessionStorage.getItem("intro-shown")) {
      // Returning visitor — remove cover instantly
      cover?.remove();
      setPhase("done");
      return;
    }
    sessionStorage.setItem("intro-shown", "1");

    // New visitor — remove the static cover (React takes over) and animate
    cover?.remove();
    document.body.style.overflow = "hidden";
    setPhase("intro");
  }, []);

  // After hold, trigger exit
  useEffect(() => {
    if (phase !== "intro") return;
    const timer = setTimeout(() => setPhase("exit"), HOLD);
    return () => clearTimeout(timer);
  }, [phase]);

  const onExitComplete = useCallback(() => {
    setPhase("done");
    document.body.style.overflow = "";
  }, []);

  if (phase === "done" || phase === "idle") return null;

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {phase !== "exit" && (
        <div key="loader" className="fixed inset-0 z-[9999]">
          {/* Solid background — matches the inline cover so no flicker */}
          <motion.div
            className="absolute inset-0 bg-[#0a0a0a]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Curtain panels — split open on exit */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-[#0a0a0a]"
            exit={{ x: "-100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-[#0a0a0a]"
            exit={{ x: "100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* Content */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative flex flex-col items-center">
              {/* Logo letters */}
              <div className="flex overflow-hidden">
                {"AWAB".split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    className="font-display text-[22vw] font-bold leading-[0.85] tracking-tighter text-white md:text-[14vw]"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: 0.9,
                      delay: 0.15 + i * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              {/* Tagline */}
              <div className="overflow-hidden">
                <motion.p
                  className="mt-3 font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500 md:text-xs"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  Digital Artisan
                </motion.p>
              </div>

              {/* Accent line */}
              <motion.div
                className="mt-6 h-px bg-white/20"
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{
                  duration: 1.2,
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
