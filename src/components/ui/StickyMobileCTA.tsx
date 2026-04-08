"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/lib/analytics/gtm";

interface StickyMobileCTAProps {
  label: string;
}

export default function StickyMobileCTA({ label }: StickyMobileCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show when hero spacer is out of view (user scrolled past hero)
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    // Observe the hero spacer div (the one right after the fixed hero)
    const heroSpacer = document.querySelector("[data-hero-spacer]");
    if (heroSpacer) {
      observer.observe(heroSpacer);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 inset-x-0 z-40 border-t border-border/50 bg-background/80 p-3 backdrop-blur-lg md:hidden"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <Button asChild size="lg" className="w-full h-12 rounded-full text-base font-semibold">
            <Link
              href="/rate-calculator"
              onClick={() => trackCTAClick("free_quote", "sticky_mobile")}
            >
              {label}
            </Link>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
