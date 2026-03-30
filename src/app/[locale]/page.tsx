"use client";

import { useRef, useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { getFeaturedProjects } from "@/data/projects";
import ProjectCard from "@/components/cards/ProjectCard";
import { ScrollReveal, StaggerContainer, StaggerItem, MagneticElement, TiltCard } from "@/components/effects";

// Dynamic import for Three.js component (no SSR)
const InteractiveCubes = dynamic(
  () => import("@/components/three/InteractiveCubes"),
  { ssr: false }
);

function useParallaxMouse(strength = 20) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      x.set(-nx * strength);
      y.set(-ny * strength);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [strength, x, y]);

  return { x: springX, y: springY };
}

export default function HomePage() {
  const t = useTranslations('home');
  const containerRef = useRef<HTMLDivElement>(null!);
  const { scrollYProgress } = useScroll({
    target: containerRef as any,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Parallax layers for hero text — move opposite to mouse for depth
  const headingParallax = useParallaxMouse(15);
  const subtitleParallax = useParallaxMouse(8);
  const scrollIndicatorParallax = useParallaxMouse(4);

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getFeaturedProjects(3);
      setProjects(data);
    };
    fetchProjects();
  }, []);

  const services = [
    { title: t('webDesignTitle'), desc: t('webDesignDesc'), link: "/services/webdesign-istanbul" },
    { title: t('aiChatbotTitle'), desc: t('aiChatbotDesc'), link: "/services/ai-chatbot-integration" },
  ];

  return (
    <div ref={containerRef} className="relative bg-background">
      {/* Cinematic Hero */}
      <motion.section
        className="fixed inset-0 h-screen w-full overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="absolute inset-0 bg-black">
          <InteractiveCubes cubeCount={70} isDark={true} />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          {/* Heading moves opposite to mouse — creates parallax depth with cubes */}
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ x: headingParallax.x, y: headingParallax.y }}
            className="text-center font-display text-[12vw] font-bold leading-none tracking-tighter text-white/70 md:text-[10vw]"
          >
            {t('heroLine1')}
            <br />
            {t('heroLine2')}
          </motion.h1>

          {/* Subtitle moves less — different parallax layer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{ x: subtitleParallax.x, y: subtitleParallax.y }}
            className="mt-8 max-w-xl text-center text-lg text-white/60 font-medium md:text-xl"
          >
            {t('heroSubtitle')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          style={{ x: scrollIndicatorParallax.x, y: scrollIndicatorParallax.y }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-widest">{t('scroll')}</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
        </motion.div>
      </motion.section>

      {/* Spacer for fixed hero */}
      <div className="h-screen" />

      {/* Services Reveal */}
      <section className="relative z-10 bg-background py-32 md:py-48">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeUp" className="mb-16 md:mb-32">
            <h2 className="mb-4 font-mono text-sm uppercase text-muted-foreground">{t('servicesHeading')}</h2>
            <p className="max-w-4xl font-display text-4xl font-medium leading-tight md:text-6xl">
              {t('servicesDescription')}
            </p>
          </ScrollReveal>

          <StaggerContainer className="divide-y divide-border border-y border-border" staggerDelay={0.15}>
            {services.map((service, i) => (
              <StaggerItem key={i} animation="fadeUp">
                <MagneticElement strength={20}>
                  <Link
                    href={service.link}
                    className="group flex flex-col justify-between gap-4 py-12 transition-colors hover:bg-muted/30 md:flex-row md:items-center md:py-16"
                  >
                    <h3 className="font-display text-3xl font-bold transition-transform duration-500 group-hover:translate-x-4 rtl:group-hover:-translate-x-4 md:text-5xl">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-8 md:gap-16">
                      <p className="max-w-xs text-muted-foreground">{service.desc}</p>
                      <ArrowRight className="hidden h-6 w-6 -rotate-45 transition-transform duration-500 group-hover:rotate-0 rtl:rotate-45 rtl:group-hover:rotate-0 md:block" />
                    </div>
                  </Link>
                </MagneticElement>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Selected Work Preview */}
      <section className="relative z-10 bg-background py-32 text-foreground md:py-48">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeUp" className="mb-16 flex items-end justify-between md:mb-32">
            <h2 className="font-display text-[10vw] font-bold leading-none tracking-tighter opacity-10 md:text-[8vw]">
              {t('workHeading')}
            </h2>
            <Button asChild variant="outline" className="hidden border-border bg-transparent hover:bg-primary hover:text-primary-foreground md:flex">
              <Link href="/projects">{t('viewAllProjects')}</Link>
            </Button>
          </ScrollReveal>

          <StaggerContainer className="flex flex-col gap-8 md:flex-row" staggerDelay={0.2}>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <StaggerItem key={project.id} animation="fadeUp" className="w-full flex-1">
                  <TiltCard className="relative overflow-hidden rounded-2xl" tiltStrength={8}>
                    <ProjectCard project={project} index={index} inverse />
                  </TiltCard>
                </StaggerItem>
              ))
            ) : (
              <>
                {[1, 2, 3].map((i) => (
                  <StaggerItem key={i} animation="fadeUp" className="w-full flex-1">
                    <div className="group relative aspect-[4/3] w-full animate-pulse overflow-hidden rounded-2xl border border-border bg-muted" />
                  </StaggerItem>
                ))}
              </>
            )}
          </StaggerContainer>

          <ScrollReveal animation="fadeUp" delay={0.3} className="mt-8 md:hidden">
            <Button asChild variant="outline" className="w-full border-border bg-transparent hover:bg-primary hover:text-primary-foreground">
              <Link href="/projects">{t('viewAllProjects')}</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 bg-background flex min-h-[80vh] items-center justify-center py-32 text-center">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeUp">
            <p className="mb-8 font-mono text-sm uppercase text-muted-foreground">{t('readyToStart')}</p>
            <MagneticElement strength={40}>
              <Link
                href="/contact"
                className="group relative inline-block"
              >
                <h2 className="font-display text-[12vw] font-bold leading-none tracking-tighter transition-colors hover:text-primary md:text-[10vw]">
                  {t('letsTalk')}
                </h2>
                <div className="absolute bottom-4 right-0 h-4 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </Link>
            </MagneticElement>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
