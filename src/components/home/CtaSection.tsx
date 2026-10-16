"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { GlassPill } from "@/components/ui/glass-pill";
import { trackCTAClick } from "@/lib/analytics/gtm";

export default function CtaSection() {
  const t = useTranslations("home");
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-black text-white">
      <Image
        src="/img/hero-image.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70"
      />

      <div className="container relative z-10 mx-auto w-full px-5 pb-16 md:px-8 md:pb-24">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-5 text-label text-white/70">{t("ctaKicker")}</p>
          <h2 className="font-display text-heading text-white">{t("ctaHeading")}</h2>
          <div className="mt-8">
            <GlassPill
              href="/contact"
              arrow
              onClick={() => trackCTAClick("free_quote", "bottom_cta")}
            >
              {t("ctaButton")}
            </GlassPill>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
