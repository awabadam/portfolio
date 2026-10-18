"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { GlassPill } from "@/components/ui/glass-pill";
import {
  trackContactClick,
  trackNavigationClick,
  trackSocialClick,
} from "@/lib/analytics/gtm";
import { useWhatsApp } from "@/components/chat/WhatsAppContext";

// Pages whose hero is always black (white nav text needed until scrolled).
// `usePathname` from next-intl returns the locale-stripped path.
const DARK_HERO_PAGES = ["/", "/about"];
const SCROLL_THRESHOLD = 40;

const SOCIAL_LINKS = [
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/awab-adam/" },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/awabeladam/" },
] as const;

const Navbar = () => {
  const t = useTranslations("nav");
  const { openWhatsApp } = useWhatsApp();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close the overlay whenever the route changes (derived during render,
  // no effect needed).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
  }

  const hasDarkHero = DARK_HERO_PAGES.includes(pathname || "");
  // Transparent + white text over a dark hero before scrolling, and while
  // the black mobile overlay is open (the nav sits above it).
  const isTransparent = (hasDarkHero && !isScrolled) || isMenuOpen;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll while the mobile overlay is open.
  useEffect(() => {
    if (!isMenuOpen) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [isMenuOpen]);

  const desktopItems = [
    { id: "work", href: "/projects", label: t("work") },
    { id: "services", href: "/services", label: t("services") },
    { id: "audit", href: "/audit", label: t("audit") },
    { id: "about", href: "/about", label: t("about") },
    { id: "journal", href: "/blog", label: t("journal") },
  ] as const;

  const mobileItems = [
    { id: "work", href: "/projects", label: t("work") },
    { id: "services", href: "/services", label: t("services") },
    { id: "pricing", href: "/pricing", label: t("pricing") },
    { id: "audit", href: "/audit", label: t("audit") },
    { id: "about", href: "/about", label: t("about") },
    { id: "journal", href: "/blog", label: t("journal") },
    { id: "contact", href: "/contact", label: t("contact") },
  ] as const;

  const handleNavClick = (id: string, location: string) => {
    trackNavigationClick(id, location);
    setIsMenuOpen(false);
  };

  const navTone = isTransparent ? "text-white" : "text-foreground";
  const navSurface = isTransparent
    ? "bg-transparent border-b border-transparent"
    : "bg-background/80 backdrop-blur-md border-b border-border/40";

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
  } as const;

  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.05, delayChildren: 0.1 } },
    exit: {},
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  } as const;

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-colors duration-300 ${navSurface} ${navTone}`}
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-5 md:px-8">
          <Link
            href="/"
            className="font-display text-xl font-medium tracking-tight"
            onClick={() => handleNavClick("home", "navbar")}
          >
            {t("logo")}
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-8">
              {desktopItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium transition-opacity hover:opacity-70"
                    onClick={() => handleNavClick(item.id, "navbar")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <span aria-hidden="true" className="h-5 w-px bg-current opacity-20" />

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ModeToggle />
              <GlassPill
                href="/contact"
                tone={isTransparent ? "glass" : "dark"}
                className="ms-2 h-10"
                onClick={() => handleNavClick("contact", "navbar")}
              >
                {t("contact")}
              </GlassPill>
            </div>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <ModeToggle />
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="ms-2 font-mono text-label uppercase"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? t("close") : t("menu")}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            id="mobile-menu"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-black text-white md:hidden"
          >
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="container mx-auto flex h-full flex-col justify-between px-5 pb-8 pt-28"
            >
              <ul className="flex flex-col gap-4">
                {mobileItems.map((item) => (
                  <motion.li key={item.id} variants={itemVariants}>
                    <Link
                      href={item.href}
                      className="font-display text-[40px] leading-none tracking-tight"
                      onClick={() => handleNavClick(item.id, "navbar-mobile")}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div variants={itemVariants} className="flex flex-col gap-3">
                <span className="text-label text-white/50">{t("getInTouch")}</span>
                <a
                  href={`mailto:${t("email")}`}
                  className="text-sm text-white hover:text-white/70"
                  onClick={() => trackContactClick("email", "navbar-mobile")}
                >
                  {t("email")}
                </a>
                <div className="flex items-center gap-5 text-sm">
                  <button
                    type="button"
                    className="text-white hover:text-white/70"
                    onClick={() => {
                      trackContactClick("whatsapp", "navbar-mobile");
                      setIsMenuOpen(false);
                      openWhatsApp();
                    }}
                  >
                    WhatsApp
                  </button>
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-white/70"
                      onClick={() => trackSocialClick(social.id, "navbar-mobile")}
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
