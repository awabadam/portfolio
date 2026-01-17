"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="relative bg-background">
      {/* Cinematic Hero */}
      <motion.section
        className="relative h-screen w-full overflow-hidden"
        style={{ scale: heroScale, opacity: heroOpacity }}
      >
        <Image
          src="/img/hero-image.jpg"
          alt="Awab Elkhalil"
          fill
          className="object-cover grayscale"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center font-display text-[15vw] font-bold leading-none tracking-tighter text-white/90 drop-shadow-2xl mix-blend-normal"
          >
            CREATIVE
            <br />
            DEVELOPER
          </motion.h1>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50"
        >
          <ArrowDown className="h-6 w-6 animate-bounce" />
        </motion.div>
      </motion.section>

      {/* The Story - Big Typography */}
      <section className="relative z-10 bg-background py-32 md:py-64">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20%" }}
            variants={staggerContainer}
            className="space-y-32 md:space-y-64"
          >
            <motion.p 
              variants={fadeInUp}
              className="font-display text-4xl font-medium leading-tight md:text-7xl lg:text-8xl"
            >
              I am Awab Elkhalil.
            </motion.p>
            
            <motion.p 
              variants={fadeInUp}
              className="ml-auto max-w-5xl text-right font-display text-4xl font-medium leading-tight md:text-7xl lg:text-8xl"
            >
              I craft digital experiences that merge art with engineering.
            </motion.p>
            
            <motion.p 
              variants={fadeInUp}
              className="font-display text-4xl font-medium leading-tight md:text-7xl lg:text-8xl"
            >
              Based in Istanbul, working with brands worldwide.
            </motion.p>
          </motion.div>
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
            {[
              "React", "Next.js", "TypeScript", "Tailwind", "Motion", 
              "Design", "Strategy", "UI/UX", "Development", 
              "React", "Next.js", "TypeScript", "Tailwind", "Motion"
            ].map((skill, i) => (
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
            <div>
              <h2 className="mb-8 font-mono text-sm uppercase text-muted-foreground">Philosophy</h2>
              <p className="text-2xl leading-relaxed md:text-4xl">
                I believe that good design is invisible. It&apos;s about creating intuitive 
                pathways that guide users effortlessly to their destination. Every pixel, 
                every interaction, and every line of code serves a purpose.
              </p>
            </div>
            <div className="relative aspect-square w-full overflow-hidden grayscale transition-all duration-500 hover:grayscale-0">
              <Image
                src="/img/hero-image.jpg"
                alt="Portrait"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
