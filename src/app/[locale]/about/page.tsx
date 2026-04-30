"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/effects";

// Dynamic import for Three.js component (no SSR)
const InteractiveTetrahedrons = dynamic(
  () => import("@/components/three/InteractiveTetrahedrons"),
  { ssr: false }
);

export default function AboutPage() {
  const t = useTranslations('about');
  const containerRef = useRef<HTMLDivElement>(null!);
  const { scrollYProgress } = useScroll({
    target: containerRef as any,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const skills = [
    "React", "Next.js", "TypeScript", "Generative AI", "Motion",
    "LLMs", "Strategy", "UI/UX", "Development",
    "Prompt Engineering", "AI Integration", "Tailwind", "Three.js"
  ];

  return (
    <div ref={containerRef} className="relative bg-background">
      {/* Cinematic Hero */}
      <motion.section
        className="relative h-screen w-full overflow-hidden"
        style={{ scale: heroScale, opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-black">
          <InteractiveTetrahedrons shapeCount={70} isDark={true} />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center font-display text-[15vw] font-bold leading-none tracking-tighter text-neutral-300 md:text-[12vw]"
          >
            {t('heroLine1')}
            <br />
            {t('heroLine2')}
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-neutral-500"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-widest">{t('scroll')}</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
        </motion.div>
      </motion.section>

      {/* The Story - Big Typography */}
      <section className="relative z-10 bg-background py-32 md:py-64">
        <div className="container mx-auto px-4">
          <StaggerContainer className="space-y-32 md:space-y-64" staggerDelay={0.3}>
            <StaggerItem animation="fadeUp">
              <p className="font-display text-4xl font-medium leading-tight md:text-7xl lg:text-8xl">
                {t('storyLine1')}
              </p>
            </StaggerItem>

            <StaggerItem animation="fadeUp">
              <p className="ml-auto rtl:mr-auto rtl:ml-0 max-w-5xl text-right rtl:text-left font-display text-4xl font-medium leading-tight md:text-7xl lg:text-8xl">
                {t('storyLine2')}
              </p>
            </StaggerItem>

            <StaggerItem animation="fadeUp">
              <p className="font-display text-4xl font-medium leading-tight md:text-7xl lg:text-8xl">
                {t('storyLine3')}
              </p>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Skills Marquee */}
      <section className="overflow-hidden bg-black py-24 text-white dark:bg-zinc-950 dark:text-zinc-100">
        <div className="flex whitespace-nowrap">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 pr-16 font-display text-6xl font-bold uppercase tracking-tight md:text-9xl"
          >
            {[...skills, ...skills].map((skill, i) => (
              <span key={i} className="flex items-center gap-16">
                {skill} <span className="text-primary">•</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32 md:py-48">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-2">
            <ScrollReveal animation="fadeUp">
              <h2 className="mb-8 font-mono text-sm uppercase text-muted-foreground">{t('philosophyHeading')}</h2>
              <p className="text-2xl leading-relaxed md:text-4xl">
                {t('philosophyContent')}
              </p>
            </ScrollReveal>

            <ScrollReveal animation="scale" delay={0.2}>
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl grayscale transition-all duration-500 hover:grayscale-0">
                <Image
                  src="/img/hero-image.jpg"
                  alt={t('portraitAlt')}
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
