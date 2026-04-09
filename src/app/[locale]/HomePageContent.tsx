"use client";

import { useRef, useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, ArrowRight, Layout, Search, Code, Bot, Globe, Shield, Server, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { getFeaturedProjects } from "@/data/projects";
import ProjectCard from "@/components/cards/ProjectCard";
import StickyMobileCTA from "@/components/ui/StickyMobileCTA";
import { ScrollReveal, StaggerContainer, StaggerItem, MagneticElement, TiltCard } from "@/components/effects";
import { trackCTAClick } from "@/lib/analytics/gtm";

// Dynamic import for Three.js component (no SSR). We additionally defer
// mounting until after first paint to keep it out of the LCP / TBT window.
const InteractiveCubes = dynamic(
  () => import("@/components/three/InteractiveCubes"),
  { ssr: false, loading: () => null }
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

export default function HomePageContent() {
  const t = useTranslations('home');
  const tAbout = useTranslations('about');
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
  const [cubesReady, setCubesReady] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getFeaturedProjects(3);
      setProjects(data);
    };
    fetchProjects();
  }, []);

  // Defer loading the heavy Three.js cubes until the browser is idle so
  // they don't block LCP / TBT on the initial page load. Falls back to a
  // setTimeout on browsers without requestIdleCallback (Safari).
  useEffect(() => {
    const schedule = (cb: () => void) => {
      if (typeof window === "undefined") return 0;
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) return ric(cb, { timeout: 2000 });
      return window.setTimeout(cb, 1000);
    };
    const handle = schedule(() => setCubesReady(true));
    return () => {
      if (typeof window === "undefined") return;
      const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (cic) cic(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  const tServices = useTranslations('services');
  const capabilities = [
    { icon: <Layout className="h-5 w-5" />, title: tServices('capWebDesign'), desc: tServices('capWebDesignDesc') },
    { icon: <Search className="h-5 w-5" />, title: tServices('capSeo'), desc: tServices('capSeoDesc') },
    { icon: <Code className="h-5 w-5" />, title: tServices('capCms'), desc: tServices('capCmsDesc') },
    { icon: <Bot className="h-5 w-5" />, title: tServices('capChatbot'), desc: tServices('capChatbotDesc') },
    { icon: <Globe className="h-5 w-5" />, title: tServices('capMultilang'), desc: tServices('capMultilangDesc') },
    { icon: <FileText className="h-5 w-5" />, title: tServices('capBlog'), desc: tServices('capBlogDesc') },
    { icon: <Shield className="h-5 w-5" />, title: tServices('capDomain'), desc: tServices('capDomainDesc') },
    { icon: <Server className="h-5 w-5" />, title: tServices('capHosting'), desc: tServices('capHostingDesc') },
  ];

  return (
    <div ref={containerRef} className="relative bg-background">
      {/* Cinematic Hero */}
      <motion.section
        className="fixed inset-0 h-screen w-full overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="absolute inset-0 bg-black">
          {cubesReady && <InteractiveCubes cubeCount={70} isDark={true} />}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          {/*
            Heading renders at final state on first paint — no initial
            opacity:0 animation — so it becomes the LCP element
            immediately. The mouse parallax still applies via style once
            framer-motion hydrates.
          */}
          <motion.h1
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="h-14 rounded-full bg-white px-8 text-base font-semibold text-black hover:bg-white/90">
              <Link href="/rate-calculator" onClick={() => trackCTAClick("free_quote", "hero")}>
                {t('heroCTAPrimary')}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 rounded-full border-white/30 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white">
              <a href="#work" onClick={() => trackCTAClick("view_work", "hero")}>
                {t('heroCTASecondary')}
              </a>
            </Button>
          </motion.div>
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
      <div data-hero-spacer className="h-screen" />

      {/* Services Reveal */}
      <section className="relative z-10 bg-background py-32 md:py-48">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeUp" className="mb-16 md:mb-32">
            <h2 className="mb-4 font-mono text-sm uppercase text-muted-foreground">{t('servicesHeading')}</h2>
            <p className="max-w-4xl font-display text-4xl font-medium leading-tight md:text-6xl">
              {t('servicesDescription')}
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.05}>
            {capabilities.map((cap, i) => (
              <StaggerItem key={i} animation="fadeUp">
                <div className="rounded-xl border border-border/40 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-md">
                  <div className="mb-3 text-primary">{cap.icon}</div>
                  <h3 className="font-semibold">{cap.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{cap.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal animation="fadeUp" delay={0.2} className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {t('viewAllServices')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Selected Work Preview */}
      <section id="work" className="relative z-10 bg-background py-32 text-foreground md:py-48">
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

      {/* About Snippet */}
      <section className="relative z-10 bg-background py-24">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal animation="fadeUp">
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {tAbout('storyLine1')} {tAbout('storyLine2')} {tAbout('storyLine3')}
            </p>
            <Link
              href="/about"
              className="mt-4 inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {t('learnMore')}
              <ArrowRight className="h-4 w-4" />
            </Link>
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
                href="/rate-calculator"
                className="group relative inline-block"
                onClick={() => trackCTAClick("free_quote", "bottom_cta")}
              >
                <h2 className="font-display text-[10vw] font-bold leading-none tracking-tighter transition-colors hover:text-primary md:text-[8vw]">
                  {t('letsTalk')}
                </h2>
                <div className="absolute bottom-4 right-0 h-4 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </Link>
            </MagneticElement>
            <p className="mt-8">
              <Link
                href="/contact"
                className="font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {t('orGetInTouch')}
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </section>

      <StickyMobileCTA label={t('stickyGetQuote')} />
    </div>
  );
}
