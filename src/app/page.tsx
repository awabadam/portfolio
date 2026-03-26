"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { getFeaturedProjects } from "@/data/projects";
import ProjectCard from "@/components/cards/ProjectCard";

// Dynamic import for Three.js component (no SSR)
const InteractiveCubes = dynamic(
  () => import("@/components/three/InteractiveCubes"),
  { ssr: false }
);

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getFeaturedProjects(2); // Fetch 2 projects for the layout
      setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-background">
      {/* Cinematic Hero */}
      <motion.section
        className="relative h-screen w-full overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="absolute inset-0 bg-black">
          {/* Interactive 3D Cubes Background */}
          <InteractiveCubes cubeCount={70} isDark={true} />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center font-display text-[12vw] font-bold leading-none tracking-tighter text-white/70 md:text-[10vw]"
          >
            DIGITAL
            <br />
            ARTISAN
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-8 max-w-xl text-center text-lg text-white/60 font-medium md:text-xl"
          >
            Crafting immersive digital experiences that merge art, AI, and strategy.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
        </motion.div>
      </motion.section>

      {/* Services Reveal */}
      <section className="relative z-10 bg-background py-32 md:py-48">
        <div className="container mx-auto px-4">
          <div className="mb-16 md:mb-32">
            <h2 className="mb-4 font-mono text-sm uppercase text-muted-foreground">What I Do</h2>
            <p className="max-w-4xl font-display text-4xl font-medium leading-tight md:text-6xl">
              I help brands stand out in the digital noise through strategic design and cutting-edge development.
            </p>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {[
              { title: "Web Design & Development", desc: <>Immersive, conversion-focused websites built with React, Next.js, WebGL, and <span className="text-foreground font-medium">AI-driven optimization</span></>, link: "/services/webdesign-istanbul" },
              { title: "Graphic Design", desc: <>User-centered UI/UX design enhanced by <span className="text-foreground font-medium">Generative AI</span> for unique, rapid visual concepts</>, link: "/services/graphic-design-istanbul" },
              { title: "AI Chatbot Integration", desc: "Custom chatbots & automation solutions for 24/7 customer support", link: "/services/ai-chatbot-integration" },
            ].map((service, i) => (
              <Link
                key={i}
                href={service.link}
                className="group flex flex-col justify-between gap-4 py-12 transition-colors hover:bg-muted/30 md:flex-row md:items-center md:py-16"
              >
                <h3 className="font-display text-3xl font-bold transition-transform duration-500 group-hover:translate-x-4 md:text-5xl">
                  {service.title}
                </h3>
                <div className="flex items-center gap-8 md:gap-16">
                  <p className="max-w-xs text-muted-foreground">{service.desc}</p>
                  <ArrowRight className="hidden h-6 w-6 -rotate-45 transition-transform duration-500 group-hover:rotate-0 md:block" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Work Preview */}
      <section className="bg-background py-32 text-foreground md:py-48">
        <div className="container mx-auto px-4">
          <div className="mb-16 flex items-end justify-between md:mb-32">
            <h2 className="font-display text-[10vw] font-bold leading-none tracking-tighter opacity-10 md:text-[8vw]">
              WORK
            </h2>
            <Button asChild variant="outline" className="hidden border-border bg-transparent hover:bg-primary hover:text-primary-foreground md:flex">
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>

          <div className="flex flex-col gap-8 md:flex-row">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <div key={project.id} className="w-full flex-1">
                  <ProjectCard project={project} index={index} inverse />
                </div>
              ))
            ) : (
              // Loading/Fallback State
              <>
                <div className="group relative aspect-[4/3] w-full flex-1 animate-pulse overflow-hidden rounded-2xl border border-border bg-muted" />
                <div className="group relative aspect-[4/3] w-full flex-1 animate-pulse overflow-hidden rounded-2xl border border-border bg-muted" />
              </>
            )}
          </div>
          
          <div className="mt-8 md:hidden">
            <Button asChild variant="outline" className="w-full border-border bg-transparent hover:bg-primary hover:text-primary-foreground">
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex min-h-[80vh] items-center justify-center py-32 text-center">
        <div className="container mx-auto px-4">
          <p className="mb-8 font-mono text-sm uppercase text-muted-foreground">Ready to start?</p>
          <Link 
            href="/contact"
            className="group relative inline-block"
          >
            <h2 className="font-display text-[12vw] font-bold leading-none tracking-tighter transition-colors hover:text-primary md:text-[10vw]">
              LET&apos;S TALK
            </h2>
            <div className="absolute bottom-4 right-0 h-4 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
          </Link>
        </div>
      </section>
    </div>
  );
}
