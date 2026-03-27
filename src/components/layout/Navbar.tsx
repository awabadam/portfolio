"use client";

import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Button } from "@/components/ui/button";
import { trackNavigationClick, trackContactClick } from "@/lib/analytics/gtm";
import { useWhatsApp } from "@/components/chat/WhatsAppContext";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { MagneticElement } from "@/components/effects";

// Pages with dark hero sections where white text is needed
const DARK_HERO_PAGES = ["/", "/about"];

const Navbar = () => {
  const t = useTranslations('nav');
  const { openWhatsApp } = useWhatsApp();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Check if current page has a dark hero
  const hasDarkHero = DARK_HERO_PAGES.includes(pathname || "");

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const navItems = [
    { href: "/about", label: t('about') },
    { href: "/projects", label: t('work') },
    { href: "/services", label: t('services') },
    { href: "/blog", label: t('journal') },
    { href: "/contact", label: t('contact') },
  ] as const;

  const handleNavClick = (label: string) => {
    trackNavigationClick(label.toLowerCase(), "navbar");
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.nav 
        className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/10" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container mx-auto flex h-24 items-center justify-between px-6">
          <MagneticElement strength={10}>
            <Link
              href="/"
              className={`group relative z-50 font-display text-2xl font-bold tracking-tighter transition-colors duration-300 ${
                isScrolled || !hasDarkHero ? "text-foreground" : "text-white"
              }`}
              onClick={() => handleNavClick("home")}
            >
              <span className="relative inline-block overflow-hidden">
                <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">{t('logo')}</span>
                <span className="absolute start-0 top-0 inline-block translate-y-full transition-transform duration-500 group-hover:translate-y-0">{t('logo')}</span>
              </span>
            </Link>
          </MagneticElement>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-12 md:flex">
            {navItems.map((item) => (
              <MagneticElement key={item.href} strength={12}>
                <Link
                  href={item.href}
                  className={`group relative text-sm font-medium uppercase tracking-widest transition-colors duration-300 ${
                    isScrolled || !hasDarkHero
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-white/80 hover:text-white"
                  }`}
                  onClick={() => handleNavClick(item.label)}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 start-0 h-px w-0 transition-all duration-300 group-hover:w-full ${
                    isScrolled || !hasDarkHero ? "bg-foreground" : "bg-white"
                  }`} />
                </Link>
              </MagneticElement>
            ))}
            
            <div className={`flex items-center gap-4 border-s ps-8 transition-colors duration-300 ${
              isScrolled || !hasDarkHero ? "border-border/20" : "border-white/20"
            }`}>
              <LanguageSwitcher />
              <ModeToggle />
              <MagneticElement strength={15}>
                <Button
                  variant="outline"
                  className={`rounded-full px-6 transition-all ${
                    isScrolled || !hasDarkHero
                      ? "hover:bg-foreground hover:text-background"
                      : "border-white/50 bg-transparent text-white hover:bg-white hover:text-black"
                  }`}
                  onClick={() => {
                    trackContactClick("whatsapp", "navbar");
                    openWhatsApp();
                  }}
                >
                  {t('cta')}
                </Button>
              </MagneticElement>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <LanguageSwitcher />
            <ModeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
              aria-label={t('toggleMenu')}
            >
              <span className={`h-0.5 w-6 transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""} ${
                isScrolled || !hasDarkHero ? "bg-foreground" : "bg-white"
              }`} />
              <span className={`h-0.5 w-6 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""} ${
                isScrolled || !hasDarkHero ? "bg-foreground" : "bg-white"
              }`} />
              <span className={`h-0.5 w-6 transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""} ${
                isScrolled || !hasDarkHero ? "bg-foreground" : "bg-white"
              }`} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Full-Screen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-background/95 backdrop-blur-xl md:hidden"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={staggerContainer}
              className="container mx-auto flex flex-col gap-8 px-6"
            >
              {navItems.map((item, index) => (
                <motion.div key={item.href} variants={fadeIn}>
                  <Link
                    href={item.href}
                    className="font-display text-5xl font-bold uppercase tracking-tight text-foreground transition-colors hover:text-muted-foreground"
                    onClick={() => handleNavClick(item.label)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div variants={fadeIn} className="mt-12 h-px w-full bg-border" />
              
              <motion.div variants={fadeIn} className="flex flex-col gap-4">
                <span className="font-mono text-sm uppercase text-muted-foreground">{t('getInTouch')}</span>
                <a href={`mailto:${t('email')}`} className="text-xl">{t('email')}</a>
                <Button
                  size="lg"
                  className="mt-4 w-full rounded-full"
                  onClick={() => {
                    trackContactClick("whatsapp", "navbar-mobile");
                    openWhatsApp();
                    setIsMenuOpen(false);
                  }}
                >
                  {t('startProject')}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
