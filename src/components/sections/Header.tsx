"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import {
  trackCTAClick,
  trackButtonClick,
  trackNavigationClick,
} from "@/lib/analytics/gtm";
import { fadeInUp, staggerContainer, textReveal, staggerText } from "@/lib/animations";

// Dynamic import for Three.js component (no SSR)
const InteractiveCubes = dynamic(
  () => import("@/components/three/InteractiveCubes"),
  { ssr: false }
);

const Header = () => {
  const scrollToNext = () => {
    const nextSection = document.getElementById("services");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-24 md:pt-32 md:pb-32">
      {/* Background decorative elements */}
      <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -right-40 bottom-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>

      <motion.div
        className="container relative z-10 mx-auto"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Content */}
          <motion.div
            className="flex flex-col justify-center space-y-8"
            variants={staggerContainer}
          >
            <motion.div className="space-y-4" variants={staggerText}>
              <motion.p
                className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground"
                variants={textReveal}
              >
                Webdesign & Graphic Design Istanbul
              </motion.p>
              <motion.h1
                className="font-display text-display-1 leading-none tracking-tight"
                variants={textReveal}
              >
                Creating{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">Digital</span>
                  <span className="absolute bottom-2 left-0 z-0 h-4 w-full bg-primary/20"></span>
                </span>{" "}
                Experiences
              </motion.h1>
            </motion.div>

            <motion.p
              className="text-xl leading-relaxed text-muted-foreground md:text-2xl"
              variants={fadeInUp}
            >
              Professional webdesign and graphic design services in Istanbul.
              I craft modern, conversion-focused websites and branding that
              help businesses stand out and grow.
            </motion.p>

            <motion.div
              className="flex flex-col gap-4 sm:flex-row"
              variants={fadeInUp}
            >
              <Button
                asChild
                size="lg"
                className="group h-14 px-8 text-lg font-medium"
                onClick={() => {
                  trackCTAClick("view_portfolio", "hero_section");
                  trackButtonClick(
                    "view_portfolio",
                    "hero_section",
                    "primary_cta",
                  );
                }}
              >
                <Link href="/projects" className="flex items-center gap-2">
                  View Work
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg font-medium"
                onClick={() => {
                  trackCTAClick("contact", "hero_section");
                  trackButtonClick("contact", "hero_section", "secondary_cta");
                }}
              >
                <Link href="#contact">Get in Touch</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Interactive 3D Cubes */}
          <motion.div
            className="relative flex items-center justify-center"
            variants={fadeInUp}
          >
            <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-2xl bg-black">
              <InteractiveCubes cubeCount={50} isDark={true} />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        aria-label="Scroll to next section"
      >
        <span className="text-xs uppercase tracking-wider">Scroll</span>
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </motion.button>

      {/* Trust Indicators - Simplified */}
      <motion.div
        className="container mx-auto mt-24 flex flex-wrap items-center justify-center gap-8 border-t border-border/40 pt-12 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <span className="font-medium">Trusted by innovative brands</span>
        <span className="hidden sm:inline">•</span>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {["Saphiredent", "Estetikworld", "Sari Dental", "Boost Sudan"].map(
            (brand) => (
              <span key={brand} className="font-medium">
                {brand}
              </span>
            ),
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default Header;
