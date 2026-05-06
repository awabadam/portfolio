"use client";

import { useRef, useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, ArrowRight, Layout, Search, Code, Bot, Globe, Shield, Server, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import ProjectCard from "@/components/cards/ProjectCard";
import StickyMobileCTA from "@/components/ui/StickyMobileCTA";
import { ScrollReveal, StaggerContainer, StaggerItem, MagneticElement, TiltCard, TextReveal, LineReveal, ClipReveal, PerspectiveSection, ScrollVelocityText, DepthFloat } from "@/components/effects";
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

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);

  // Multi-layer scroll parallax for hero depth
  const heroBgY = useTransform(scrollYProgress, [0, 0.2], ["0%", "15%"]);     // Background (slowest)
  const heroContentY = useTransform(scrollYProgress, [0, 0.2], ["0%", "30%"]); // Content (medium)
  const heroScrollY = useTransform(scrollYProgress, [0, 0.2], ["0%", "50%"]);  // Scroll indicator (fastest)

  // Parallax layers for hero text — move opposite to mouse for depth
  const headingParallax = useParallaxMouse(15);
  const subtitleParallax = useParallaxMouse(8);
  const scrollIndicatorParallax = useParallaxMouse(4);

  const [projects, setProjects] = useState<Project[]>([]);
  const [cubesReady, setCubesReady] = useState(false);

  useEffect(() => {
    // Fetch via the API route instead of importing getFeaturedProjects
    // directly — calling it here would pull the entire Supabase client
    // (~176 KB) into the homepage bundle. The API route runs
    // server-side, so Supabase stays off the client.
    const controller = new AbortController();
    fetch("/api/projects?featured=true&limit=3", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : { projects: [] }))
      .then((data) => setProjects(data.projects ?? []))
      .catch(() => {
        /* silent — fallback is empty state with placeholder cards */
      });
    return () => controller.abort();
  }, []);

  // Defer loading the heavy Three.js cubes until the browser is idle so
  // they don't block LCP / TBT on the initial page load. Skip entirely
  // on mobile / low-power devices to save ~883KB of JS.
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const isLowPower = navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 2;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMobile || isLowPower || prefersReduced) return;

    const schedule = (cb: () => void) => {
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) return ric(cb, { timeout: 2000 });
      return window.setTimeout(cb, 1000);
    };
    const handle = schedule(() => setCubesReady(true));
    return () => {
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
        <motion.div className="absolute inset-0 bg-black" style={{ y: heroBgY }}>
          {cubesReady && <InteractiveCubes cubeCount={40} isDark={true} />}
        </motion.div>

        <motion.div className="absolute inset-0 flex flex-col items-center justify-center p-4" style={{ y: heroContentY }}>
          {/*
            Heading renders at final state on first paint — no initial
            opacity:0 animation — so it becomes the LCP element
            immediately. The mouse parallax still applies via style once
            framer-motion hydrates.
          */}
          <motion.h1
            style={{ x: headingParallax.x, y: headingParallax.y }}
            className="text-center font-display text-[12vw] font-bold leading-none tracking-tighter text-neutral-300 md:text-[10vw]"
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
            className="mt-8 max-w-xl text-center text-lg text-neutral-400 font-medium md:text-xl"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          style={{ x: scrollIndicatorParallax.x, y: heroScrollY }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-neutral-500"
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
      <PerspectiveSection className="relative z-10 bg-background py-32 md:py-48">
        {/* Floating depth decorations */}
        <DepthFloat depth={0.3} maxOffset={20} className="pointer-events-none absolute -top-20 right-[10%] hidden h-64 w-64 rounded-full bg-primary/[0.03] blur-3xl md:block" />
        <DepthFloat depth={0.6} maxOffset={35} className="pointer-events-none absolute bottom-0 left-[5%] hidden h-48 w-48 rounded-full bg-primary/[0.04] blur-2xl md:block" />
        <div className="container mx-auto px-4">
          <div className="mb-16 md:mb-32">
            <ScrollVelocityText>
              <ScrollReveal animation="blurUp">
                <h2 className="mb-4 font-mono text-sm uppercase text-muted-foreground">{t('servicesHeading')}</h2>
              </ScrollReveal>
            </ScrollVelocityText>
            <TextReveal
              as="p"
              className="max-w-4xl font-display text-4xl font-medium leading-tight md:text-6xl"
              delay={0.1}
            >
              {t('servicesDescription')}
            </TextReveal>
            <LineReveal className="mt-8" delay={0.3} />
          </div>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.05}>
            {capabilities.map((cap, i) => (
              <StaggerItem key={i} animation="liftUp">
                <div className="rounded-xl border border-border/40 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1">
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
      </PerspectiveSection>

      {/* Selected Work Preview */}
      <PerspectiveSection className="relative z-10 bg-background py-32 text-foreground md:py-48">
        <DepthFloat depth={0.4} maxOffset={25} className="pointer-events-none absolute top-20 left-[8%] hidden h-40 w-40 rounded-full bg-primary/[0.03] blur-3xl md:block" />
        <div className="container mx-auto px-4">
          <ScrollVelocityText>
            <ScrollReveal animation="zoomIn" className="mb-16 flex items-end justify-between md:mb-32">
              <h2 className="font-display text-[10vw] font-bold leading-none tracking-tighter text-foreground/10 md:text-[8vw]">
                {t('workHeading')}
              </h2>
              <Button asChild variant="outline" className="hidden border-border bg-transparent hover:bg-primary hover:text-primary-foreground md:flex">
                <Link href="/projects">{t('viewAllProjects')}</Link>
              </Button>
            </ScrollReveal>
          </ScrollVelocityText>

          <StaggerContainer className="flex flex-col gap-8 md:flex-row" staggerDelay={0.2}>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <StaggerItem key={project.id} animation="liftUp" className="w-full flex-1">
                  <ClipReveal mode="center-x">
                    <TiltCard className="relative overflow-hidden rounded-2xl" tiltStrength={8}>
                      <ProjectCard project={project} index={index} inverse />
                    </TiltCard>
                  </ClipReveal>
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
      </PerspectiveSection>

      {/* About Snippet */}
      <section className="relative z-10 bg-background py-24">
        <LineReveal className="container mx-auto px-4 mb-16" direction="center" />
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal animation="zoomIn">
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
        <DepthFloat depth={0.5} maxOffset={40} className="pointer-events-none absolute top-1/4 right-[15%] hidden h-72 w-72 rounded-full bg-primary/[0.03] blur-3xl md:block" />
        <DepthFloat depth={0.3} maxOffset={20} className="pointer-events-none absolute bottom-1/4 left-[10%] hidden h-56 w-56 rounded-full bg-primary/[0.02] blur-3xl md:block" />
        <div className="container mx-auto px-4">
          <ScrollReveal animation="zoomIn">
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
