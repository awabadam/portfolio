"use client";

import { useRef, useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { motion, useScroll, useTransform, useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowRight, Layout, Search, Code, Bot, Quote, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { testimonials } from "@/data/testimonials";
import ProjectCard from "@/components/cards/ProjectCard";
import { ScrollReveal, StaggerContainer, StaggerItem, MagneticElement, TiltCard, TextReveal, LineReveal, ClipReveal, PerspectiveSection, ScrollVelocityText, DepthFloat } from "@/components/effects";
import { trackCTAClick } from "@/lib/analytics/gtm";

// Local project thumbnails powering the hero collage. Static webp assets in
// /public — no DB round-trip and no Three.js bundle, so the hero paints
// instantly and leads with the actual work.
const HERO_COLLAGE = [
  "jouvence",
  "esteexpert",
  "saphiredent",
  "prestij-emlak",
  "omar-marketing",
  "quran-app",
].map((id) => `/img/projects/${id}-thumbnail.webp`);

// Per-tile mouse-travel in px. Varied so the collage reads as layered depth.
// Kept within the image's overscan (see CollageTile scale) so panning never
// exposes a seam between cells.
const COLLAGE_DEPTHS = [8, 12, 6, 10, 7, 12];

// A single collage cell. The cell is fixed and clips; the image inside is
// slightly larger than the tile (scale) and translated by the mouse, so each
// tile pans individually without gaps opening up between them.
function CollageTile({
  src,
  mx,
  my,
  depth,
  eager,
}: {
  src: string;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  eager: boolean;
}) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <div className="relative overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={src}
        alt=""
        aria-hidden="true"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        style={{ x, y, scale: 1.1 }}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </div>
  );
}

// Real clients. Image logos are pulled from their live sites; brands without a
// usable logo asset render as a styled wordmark. Per-logo height balances the
// very different aspect ratios (wide wordmarks vs. square marks) so none looks
// oversized or tiny next to the others. Jouvence's source PNG has generous
// transparent padding, so it needs extra height to read at a similar size.
type ClientLogo = { name: string; src?: string; heightClass?: string };
const CLIENT_LOGOS: ClientLogo[] = [
  { name: "SaphireDent", src: "/img/clients/saphiredent.png", heightClass: "h-7 md:h-8" },
  { name: "EsteExpert", src: "/img/clients/esteexpert.svg", heightClass: "h-5 md:h-6" },
  { name: "Jouvence", src: "/img/clients/jouvence.png", heightClass: "h-24 md:h-28" },
  { name: "Omar Marketing" },
  { name: "Prestij Emlak" },
];

// One client logo — image (unified grayscale in light / white silhouette in
// dark, colour on hover) or a styled wordmark fallback.
function ClientLogoItem({ logo }: { logo: ClientLogo }) {
  if (logo.src) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={logo.src}
        alt={logo.name}
        loading="lazy"
        decoding="async"
        className={`${logo.heightClass ?? "h-8"} w-auto object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 dark:opacity-70 dark:brightness-0 dark:invert dark:hover:opacity-100`}
      />
    );
  }
  return (
    <span className="whitespace-nowrap font-display text-xl font-semibold tracking-tight text-foreground/50 transition-colors duration-300 hover:text-foreground/90 md:text-2xl">
      {logo.name}
    </span>
  );
}

// Infinite marquee: two identical groups translated -50% for a seamless loop.
// Each group must be at least as wide as the viewport, or the -50% shift opens
// a gap on the trailing edge — so the logos are repeated within a group until
// it comfortably exceeds any screen width. `reverse` scrolls the opposite way
// (used on the closing strip for variety).
function ClientMarquee({ logos, reverse = false }: { logos: ClientLogo[]; reverse?: boolean }) {
  const REPEAT = 3;
  const groupLogos = Array.from({ length: REPEAT }).flatMap(() => logos);
  const Group = (
    <div className="flex shrink-0 items-center gap-x-14 pe-14 md:gap-x-24 md:pe-24">
      {groupLogos.map((logo, i) => (
        <ClientLogoItem key={`${logo.name}-${i}`} logo={logo} />
      ))}
    </div>
  );
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
      <motion.div
        className="flex w-max"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 45, ease: "linear", repeat: Infinity }}
      >
        {Group}
        {Group}
      </motion.div>
    </div>
  );
}

// Default spring is snappy (text parallax). Pass a softer, heavier config for
// slow, delayed, ease-out motion (the hero collage).

function useParallaxMouse(
  strength = 20,
  spring: { stiffness: number; damping: number; mass: number } = { stiffness: 150, damping: 15, mass: 0.1 },
) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);

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

  useEffect(() => {
    // Fetch via the API route instead of importing getFeaturedProjects
    // directly — calling it here would pull the entire Supabase client
    // (~176 KB) into the homepage bundle. The API route runs
    // server-side, so Supabase stays off the client.
    const controller = new AbortController();
    fetch("/api/projects?limit=6", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : { projects: [] }))
      .then((data) => setProjects(data.projects ?? []))
      .catch(() => {
        /* silent — fallback is empty state with placeholder cards */
      });
    return () => controller.abort();
  }, []);

  // Normalized (-1..1) sprung mouse position; each collage tile multiplies it
  // by its own depth for a layered parallax. Soft/overdamped spring → slow,
  // delayed, ease-out drift with no overshoot.
  const collageMouse = useParallaxMouse(1, { stiffness: 18, damping: 22, mass: 1.6 });

  const tServices = useTranslations('services');
  // Trimmed to the four core offers — the rest live on /services.
  const capabilities = [
    { icon: <Layout className="h-5 w-5" />, title: tServices('capWebDesign'), desc: tServices('capWebDesignDesc') },
    { icon: <Search className="h-5 w-5" />, title: tServices('capSeo'), desc: tServices('capSeoDesc') },
    { icon: <Code className="h-5 w-5" />, title: tServices('capCms'), desc: tServices('capCmsDesc') },
    { icon: <Bot className="h-5 w-5" />, title: tServices('capChatbot'), desc: tServices('capChatbotDesc') },
  ];

  // Headline proof stats — impact + breadth over raw counts: a real client
  // result, the languages delivered (EN/AR/FR/TR), and years active.
  const stats = [
    { value: "+40%", label: t('statInquiriesLabel') },
    { value: "4", label: t('statLanguagesLabel') },
    { value: "5+", label: t('statYearsLabel') },
  ];

  // Featured client review — Omar Karra (most recent), from the shared source.
  const featuredReview = testimonials[0];

  return (
    <div ref={containerRef} className="relative bg-background">
      {/* Cinematic Hero */}
      <motion.section
        className="fixed inset-0 h-screen w-full overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Project collage background — leads with the actual work */}
        <motion.div className="absolute inset-0 bg-background" style={{ y: heroBgY }}>
          <div className="grid h-full w-full grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2">
            {HERO_COLLAGE.map((src, i) => (
              <CollageTile
                key={src}
                src={src}
                mx={collageMouse.x}
                my={collageMouse.y}
                depth={COLLAGE_DEPTHS[i]}
                eager={i < 3}
              />
            ))}
          </div>

          {/* Legibility overlays — keyed to the theme background so the hero
              reads as a dark scrim in dark mode and a light scrim in light
              mode. The blur turns the collage into a soft texture instead of
              competing, fully-readable websites, so the headline + CTAs own
              the foreground. */}
          <div className="absolute inset-0 bg-background/45 backdrop-blur-[3px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/25 to-background/80" />
          <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.55)_120%)]" />
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
            className="text-center font-display text-[12vw] font-bold leading-none tracking-tighter text-foreground/90 md:text-[10vw]"
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
            className="mt-8 max-w-xl text-center text-lg text-foreground/80 font-medium md:text-xl"
          >
            {t('heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="h-14 rounded-full bg-foreground px-8 text-base font-semibold text-background hover:bg-foreground/90">
              <Link href="/rate-calculator" onClick={() => trackCTAClick("free_quote", "hero")}>
                {t('heroCTAPrimary')}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 rounded-full border-foreground/30 bg-transparent px-8 text-base font-semibold text-foreground hover:bg-foreground/10 hover:text-foreground">
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
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-foreground/50"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-widest">{t('scroll')}</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
        </motion.div>
      </motion.section>

      {/* Spacer for fixed hero */}
      <div data-hero-spacer className="h-screen" />

      {/* Client logos — marquee trust bar leading into the work */}
      <section className="relative z-10 border-b border-border/50 bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeUp">
            <p className="mb-8 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground md:mb-10">
              {t('clientsHeading')}
            </p>
          </ScrollReveal>
        </div>
        <ClientMarquee logos={CLIENT_LOGOS} />
      </section>

      {/* Selected Work Preview — lead with the work */}
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

          <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.15}>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <StaggerItem key={project.id} animation="liftUp" className="w-full">
                  <ClipReveal mode="center-x">
                    <TiltCard className="relative overflow-hidden rounded-2xl" tiltStrength={8}>
                      <ProjectCard project={project} index={index} inverse />
                    </TiltCard>
                  </ClipReveal>
                </StaggerItem>
              ))
            ) : (
              <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <StaggerItem key={i} animation="fadeUp" className="w-full">
                    <div className="group relative aspect-[19/10] w-full animate-pulse overflow-hidden rounded-2xl border border-border bg-muted" />
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

      {/* Proof — results + client voices */}
      <section className="relative z-10 bg-background py-24 md:py-32">
        <DepthFloat depth={0.4} maxOffset={25} className="pointer-events-none absolute top-10 right-[8%] hidden h-56 w-56 rounded-full bg-primary/[0.03] blur-3xl md:block" />
        <div className="container mx-auto px-4">
          <ScrollReveal animation="blurUp">
            <h2 className="mb-4 font-mono text-sm uppercase text-muted-foreground">{t('proofKicker')}</h2>
          </ScrollReveal>
          <TextReveal
            as="p"
            className="max-w-3xl font-display text-3xl font-medium leading-tight md:text-5xl"
            delay={0.1}
          >
            {t('proofHeading')}
          </TextReveal>

          <div className="mt-12 grid items-stretch gap-10 md:mt-16 md:grid-cols-5 md:gap-14">
            {/* Stats — vertical list on the left */}
            <StaggerContainer className="flex flex-col justify-center gap-6 md:col-span-2 md:gap-2" staggerDelay={0.08}>
              {stats.map((s, i) => (
                <StaggerItem key={i} animation="liftUp">
                  <div className="flex items-center gap-5 border-border/40 py-4 md:border-b md:[&:last-child]:border-b-0">
                    <div className="min-w-[4.5rem] font-display text-5xl font-bold leading-none tracking-tight text-primary md:text-6xl">{s.value}</div>
                    <div className="text-sm text-muted-foreground md:text-base">{s.label}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Featured review — right */}
            <StaggerContainer className="md:col-span-3" staggerDelay={0.12}>
              <StaggerItem animation="fadeUp">
                <figure className="flex h-full flex-col rounded-2xl border border-border/40 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),0_12px_40px_rgba(0,0,0,0.1)] md:p-10">
                  <div className="flex items-center gap-1 text-primary">
                    {Array.from({ length: featuredReview.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                    <Quote className="ms-3 h-7 w-7 text-primary/30" />
                  </div>
                  <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-foreground/90 md:text-2xl md:leading-relaxed">
                    {featuredReview.content}
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {featuredReview.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{featuredReview.name}</div>
                      <div className="text-xs text-muted-foreground">{featuredReview.role} · {featuredReview.company}</div>
                    </div>
                  </figcaption>
              </figure>
            </StaggerItem>
          </StaggerContainer>
          </div>
        </div>
      </section>

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

      {/* Client logos — marquee reprise before the closing CTA */}
      <section className="relative z-10 border-y border-border/50 bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeUp">
            <p className="mb-8 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground md:mb-10">
              {t('clientsHeading')}
            </p>
          </ScrollReveal>
        </div>
        <ClientMarquee logos={CLIENT_LOGOS} reverse />
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
    </div>
  );
}
