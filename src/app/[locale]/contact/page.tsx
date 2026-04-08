"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Copy, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ScrollReveal, StaggerContainer, StaggerItem, Parallax } from "@/components/effects";
import Contact from "@/components/sections/Contact";

export default function ContactPage() {
  const t = useTranslations('contact');
  const [copied, setCopied] = useState(false);
  const email = "hello@awab.design";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socials = [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/awab-adam/" },
    { name: "Instagram", href: "https://www.instagram.com/awabeladam/" },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background pt-32">
      <div className="container mx-auto flex flex-1 flex-col px-4 pb-16">
        <ScrollReveal animation="fadeUp" className="mb-16 md:mb-32">
          <Parallax speed={0.3}>
            <h1 className="font-display text-[15vw] font-bold leading-none tracking-tighter text-foreground md:text-[12vw]">
              {t('heading')}
            </h1>
          </Parallax>
        </ScrollReveal>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-32">
          {/* Main Action */}
          <div className="space-y-8">
            <ScrollReveal animation="fadeUp" delay={0.1}>
              <p className="max-w-xl text-2xl leading-relaxed text-muted-foreground md:text-3xl">
                {t('description')}
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.2}>
              <div
                onClick={handleCopy}
                className="group relative inline-flex cursor-pointer items-center gap-4 overflow-hidden rounded-full border border-border px-8 py-4 transition-colors hover:border-primary hover:bg-primary/5"
              >
                <Mail className="h-6 w-6 text-primary" />
                <span className="font-mono text-lg md:text-xl">{email}</span>
                <div className="relative h-6 w-6">
                  <AnimateCopy copied={copied} copiedLabel={t('copied')} />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Socials & Info */}
          <div className="flex flex-col justify-end gap-12">
            <div className="grid grid-cols-2 gap-8 md:gap-16">
              <ScrollReveal animation="fadeLeft" delay={0.2}>
                <h3 className="mb-6 font-mono text-sm uppercase text-muted-foreground">{t('socialsHeading')}</h3>
                <StaggerContainer className="flex flex-col gap-4" staggerDelay={0.1}>
                  {socials.map((social) => (
                    <StaggerItem key={social.name} animation="fadeLeft">
                      <Link
                        href={social.href}
                        target="_blank"
                        className="group flex items-center gap-2 text-xl font-medium transition-colors hover:text-primary"
                      >
                        {social.name}
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:group-hover:translate-x-0" />
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </ScrollReveal>

              <ScrollReveal animation="fadeRight" delay={0.3}>
                <h3 className="mb-6 font-mono text-sm uppercase text-muted-foreground">{t('locationHeading')}</h3>
                <div className="flex items-center gap-2 text-xl font-medium">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t('city')}
                </div>
                <div className="mt-2 text-muted-foreground">
                  {t('timezone')}
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal animation="fadeUp" delay={0.4}>
              <div className="pt-8 md:pt-16">
                <Button asChild size="lg" className="h-16 px-8 text-lg rounded-full">
                  <Link href="/rate-calculator">
                    {t('cta')}
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <Contact />
      </div>
    </div>
  );
}

function AnimateCopy({ copied, copiedLabel }: { copied: boolean; copiedLabel: string }) {
  return (
    <div className="relative h-full w-full">
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: copied ? 0 : 1, scale: copied ? 0.5 : 1 }}
        className="absolute inset-0"
      >
        <Copy className="h-6 w-6" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: copied ? 1 : 0, scale: copied ? 1 : 0.5 }}
        className="absolute inset-0 text-primary"
      >
        <span className="font-mono text-xs font-bold uppercase">{copiedLabel}</span>
      </motion.div>
    </div>
  );
}
