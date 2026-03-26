"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { trackNavigationClick, trackContactClick } from "@/lib/analytics/gtm";
import { useWhatsApp } from "@/components/chat/WhatsAppContext";
import { fadeIn, staggerContainer } from "@/lib/animations";

// Pages with dark hero sections where white text is needed
const DARK_HERO_PAGES = ["/", "/about"];

const Navbar = () => {
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
    { href: "/about", label: "About" },
    { href: "/projects", label: "Work" },
    { href: "/services", label: "Services" },
    { href: "/blog", label: "Journal" },
    { href: "/contact", label: "Contact" },
  ];

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
          <Link
            href="/"
            className={`group relative z-50 font-display text-2xl font-bold tracking-tighter transition-colors duration-300 ${
              isScrolled || !hasDarkHero ? "text-foreground" : "text-white"
            }`}
            onClick={() => handleNavClick("home")}
          >
            <span className="relative inline-block overflow-hidden">
              <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">AWAB</span>
              <span className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-500 group-hover:translate-y-0">AWAB</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-12 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative text-sm font-medium uppercase tracking-widest transition-colors duration-300 ${
                  isScrolled || !hasDarkHero
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/80 hover:text-white"
                }`}
                onClick={() => handleNavClick(item.label)}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full ${
                  isScrolled || !hasDarkHero ? "bg-foreground" : "bg-white"
                }`} />
              </Link>
            ))}
            
            <div className={`flex items-center gap-4 border-l pl-8 transition-colors duration-300 ${
              isScrolled || !hasDarkHero ? "border-border/20" : "border-white/20"
            }`}>
              <ModeToggle />
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
                Let's Talk
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <ModeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
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
                <span className="font-mono text-sm uppercase text-muted-foreground">Get in touch</span>
                <a href="mailto:hello@awab.design" className="text-xl">hello@awab.design</a>
                <Button
                  size="lg"
                  className="mt-4 w-full rounded-full"
                  onClick={() => {
                    trackContactClick("whatsapp", "navbar-mobile");
                    openWhatsApp();
                    setIsMenuOpen(false);
                  }}
                >
                  Start a Project
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
