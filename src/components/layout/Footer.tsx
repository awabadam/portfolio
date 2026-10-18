"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { useWhatsApp } from "@/components/chat/WhatsAppContext";
import { GlassPill } from "@/components/ui/glass-pill";
import {
  trackContactClick,
  trackNavigationClick,
  trackSocialClick,
} from "@/lib/analytics/gtm";

const SOCIAL_LINKS = [
  { id: "linkedin", href: "https://www.linkedin.com/in/awab-adam/" },
  { id: "instagram", href: "https://www.instagram.com/awabeladam/" },
  // TODO: add the Google Business Profile link ("Awab Elkhalil - Web Designer &
  // Developer") once the public URL is known, plus a `footer.googleBusiness`
  // label in all four message files.
] as const;

const Footer = () => {
  const t = useTranslations("footer");
  const { openWhatsApp } = useWhatsApp();
  const reduceMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();

  const sitemapLinks = [
    { id: "about", href: "/about", label: t("about") },
    { id: "work", href: "/projects", label: t("work") },
    { id: "services", href: "/services", label: t("services") },
    { id: "pricing", href: "/pricing", label: t("pricing") },
    { id: "blog", href: "/blog", label: t("blog") },
  ] as const;

  return (
    <footer className="relative z-10 w-full bg-black pb-8 pt-20 text-white">
      <div className="container mx-auto px-5 md:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Brand + CTA */}
          <div className="flex flex-col gap-8 lg:col-span-6">
            <p className="font-display text-[28px] font-medium tracking-tight">
              {t("brandName")}
            </p>
            <p className="max-w-xl font-display text-heading">
              {t("haveSomething")}
              <br />
              {t("makeItHappen")}
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <GlassPill
                href="/contact"
                arrow
                onClick={() => trackNavigationClick("contact", "footer")}
              >
                {t("getInTouch")}
              </GlassPill>
              <button
                type="button"
                className="text-sm text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                onClick={() => {
                  trackContactClick("whatsapp", "footer");
                  openWhatsApp();
                }}
              >
                WhatsApp
              </button>
            </div>
          </div>

          {/* Sitemap + Social */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-5 lg:col-start-8">
            <div>
              <h3 className="mb-4 text-label text-white/50">{t("sitemapHeading")}</h3>
              <ul className="flex flex-col gap-3">
                {sitemapLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-sm text-white transition-colors hover:text-white/70"
                      onClick={() => trackNavigationClick(link.id, "footer")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-label text-white/50">{t("socialsHeading")}</h3>
              <ul className="flex flex-col gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white transition-colors hover:text-white/70"
                      onClick={() => trackSocialClick(social.id, "footer")}
                    >
                      {t(social.id)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider that draws in from the start edge */}
        <motion.div
          aria-hidden="true"
          className="mt-20 h-px w-full bg-white/15 origin-left rtl:origin-right"
          initial={{ scaleX: reduceMotion ? 1 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="flex flex-col gap-3 pt-6 text-label text-white/50 md:flex-row md:items-center md:justify-between">
          <p>{t("copyright", { year: currentYear })}</p>
          <p>
            {t("location")} {t("timezone")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
