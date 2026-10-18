"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { GlassPill } from "@/components/ui/glass-pill";
import { trackCTAClick } from "@/lib/analytics/gtm";
import { IMAGE_CREDITS } from "@/data/image-credits";
import BookCallLink from "@/components/cta/BookCallLink";

export default function CtaSection() {
  const t = useTranslations("home");
  const reduceMotion = useReducedMotion();

  return (
    <section className="container mx-auto px-5 py-16 md:px-8 md:py-24">
      <div className="relative flex min-h-[60vh] items-end overflow-hidden rounded-[10px] bg-black text-white">
        {/* Bosphorus at dusk: Istanbul, not a generic code-on-screen shot. The
          services hero uses consultation-alt, so the two never repeat. */}
        <Image
          src={IMAGE_CREDITS["istanbul-bosphorus-alt"].src}
          alt=""
          fill
          sizes="(min-width: 1312px) 1248px, 100vw"
          quality={85}
          className="object-cover opacity-75"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/80"
        />

        <div className="relative z-10 w-full p-8 md:p-12 lg:p-14">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-5 text-label text-white/70">{t("ctaKicker")}</p>
            <h2 className="font-display text-heading text-white">
              {t("ctaHeading")}
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <GlassPill
                href="/contact"
                arrow
                onClick={() => trackCTAClick("free_quote", "bottom_cta")}
              >
                {t("ctaButton")}
              </GlassPill>
              <BookCallLink location="bottom_cta" onDark />
              <p className="flex items-center gap-3 text-sm text-white/80">
                <Image
                  src="/img/awab-portrait.webp"
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-white/30"
                />
                {t("ctaNote")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
