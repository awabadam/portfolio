"use client";

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useWhatsApp } from "@/components/chat/WhatsAppContext";
import {
  trackSocialClick,
  trackContactClick,
  trackNavigationClick,
} from "@/lib/analytics/gtm";

const Footer = () => {
  const t = useTranslations('footer');
  const { openWhatsApp } = useWhatsApp();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: t('about'), href: "/about" },
    { name: t('work'), href: "/projects" },
    { name: t('services'), href: "/#services" },
    { name: t('pricing'), href: "/rate-calculator" },
    { name: t('blog'), href: "/blog" },
  ];

  const socialLinks = [
    { name: t('linkedin'), href: "https://linkedin.com/in/awabelkhalil" },
    { name: t('github'), href: "https://github.com/awabelkhalil" },
    { name: t('instagram'), href: "https://instagram.com/awabelkhalil" },
    { name: t('twitter'), href: "https://twitter.com/awabelkhalil" },
  ];

  return (
    <footer className="relative z-10 w-full overflow-hidden bg-background text-foreground pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Brand & CTA */}
          <div className="flex flex-col justify-between space-y-12">
            <div>
              <h2 className="font-display text-[12vw] leading-none tracking-tighter md:text-[8vw]">
                {t('brandName')}
              </h2>
            </div>
            
            <div className="max-w-md space-y-6">
              <p className="text-xl opacity-80">
                {t('tagline')}
              </p>
              <Button 
                className="h-14 rounded-full bg-primary px-8 text-lg text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  trackContactClick("whatsapp", "footer");
                  openWhatsApp();
                }}
              >
                {t('startProject')}
              </Button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-12 md:grid-cols-2 lg:ps-24">
            <div className="space-y-6">
              <h3 className="font-mono text-sm uppercase opacity-50">{t('sitemapHeading')}</h3>
              <ul className="space-y-4">
                {footerLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="group flex items-center gap-2 text-lg transition-colors hover:opacity-70"
                      onClick={() => trackNavigationClick(link.name.toLowerCase(), "footer")}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="font-mono text-sm uppercase opacity-50">{t('socialsHeading')}</h3>
              <ul className="space-y-4">
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      target="_blank"
                      className="group flex items-center gap-2 text-lg transition-colors hover:opacity-70"
                      onClick={() => trackSocialClick(link.name.toLowerCase(), "footer")}
                    >
                      {link.name}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 flex flex-col items-center justify-between gap-6 border-t border-current/10 pt-8 text-sm opacity-40 md:flex-row">
          <p>{t('copyright', { year: currentYear })}</p>
          <div className="flex gap-8">
            <span className="hidden md:inline">{t('location')}</span>
            <span>{t('timezone')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
