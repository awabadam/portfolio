"use client";

import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowUpRight, Copy, Mail, MapPin, Phone, MessageSquare,
  Check, Send, Clock,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/routing";
import {
  ScrollReveal, StaggerContainer, StaggerItem,
  PerspectiveSection, DepthFloat, ScrollVelocityText,
} from "@/components/effects";
import { useWhatsApp } from "@/components/chat/WhatsAppContext";
import {
  trackFormSubmission,
  trackContactAction,
  trackLeadGeneration,
  trackContactClick,
} from "@/lib/analytics/gtm";

const email = "awabe.adam@gmail.com";
const phone = "+90 554 175 9945";

export default function ContactPage() {
  const t = useTranslations("contact");
  const containerRef = useRef<HTMLDivElement>(null!);
  const { openWhatsApp } = useWhatsApp();
  const [copied, setCopied] = useState(false);

  // Hero parallax
  const { scrollYProgress } = useScroll({
    target: containerRef as any,
    offset: ["start start", "end end"],
  });
  const heroContentY = useTransform(scrollYProgress, [0, 0.15], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // Form state
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    projectType: "website",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send message");

      setIsSubmitted(true);
      trackFormSubmission("contact_form", formState.projectType);
      trackLeadGeneration("contact_page", formState.projectType);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({ name: "", email: "", phone: "", message: "", projectType: "website" });
      }, 5000);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError(t("errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const socials = [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/awab-adam/" },
    { name: "Instagram", href: "https://www.instagram.com/awabeladam/" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <motion.section
        className="relative flex min-h-[60vh] items-end overflow-hidden pb-16 pt-32 md:min-h-[70vh] md:pb-24"
        style={{ opacity: heroOpacity }}
      >
        <DepthFloat depth={0.4} maxOffset={30} className="pointer-events-none absolute -top-20 right-[10%] hidden h-72 w-72 rounded-full bg-primary/[0.04] blur-3xl md:block" />
        <DepthFloat depth={0.2} maxOffset={20} className="pointer-events-none absolute bottom-10 left-[5%] hidden h-48 w-48 rounded-full bg-primary/[0.03] blur-3xl md:block" />

        <motion.div className="container mx-auto px-4" style={{ y: heroContentY }}>
          <ScrollVelocityText>
            <ScrollReveal animation="blurUp">
              <h1 className="font-display text-[15vw] font-bold leading-none tracking-tighter md:text-[12vw]">
                {t("heading")}
              </h1>
            </ScrollReveal>
          </ScrollVelocityText>

          <ScrollReveal animation="blurUp" delay={0.15}>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground md:mt-8 md:text-2xl">
              {t("description")}
            </p>
          </ScrollReveal>

          {/* Quick email copy */}
          <ScrollReveal animation="fadeUp" delay={0.25}>
            <div
              onClick={handleCopy}
              className="mt-8 inline-flex cursor-pointer items-center gap-4 rounded-full border border-border/60 bg-card/40 px-6 py-3 backdrop-blur-lg transition-all duration-300 hover:border-primary/40 hover:bg-card/60 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
            >
              <Mail className="h-5 w-5 text-primary" />
              <span className="font-mono text-sm md:text-base">{email}</span>
              <div className="relative h-5 w-5">
                <motion.div
                  animate={{ opacity: copied ? 0 : 1, scale: copied ? 0.5 : 1 }}
                  className="absolute inset-0"
                >
                  <Copy className="h-5 w-5 text-muted-foreground" />
                </motion.div>
                <motion.div
                  animate={{ opacity: copied ? 1 : 0, scale: copied ? 1 : 0.5 }}
                  className="absolute inset-0 text-primary"
                >
                  <Check className="h-5 w-5" />
                </motion.div>
              </div>
              <span className="text-xs text-muted-foreground">
                {copied ? t("copied") : ""}
              </span>
            </div>
          </ScrollReveal>
        </motion.div>
      </motion.section>

      {/* ── Main: Form + Info split ── */}
      <PerspectiveSection className="border-t border-border py-20 md:py-32">
        <DepthFloat depth={0.3} maxOffset={18} className="pointer-events-none absolute -top-16 left-[60%] hidden h-56 w-56 rounded-full bg-primary/[0.03] blur-3xl md:block" />

        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            {/* ── Form (3 cols) ── */}
            <ScrollReveal animation="fadeUp" delay={0.1} className="lg:col-span-3">
              <div className="rounded-2xl border border-border/40 bg-card/30 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl md:p-10">
                <h2 className="mb-1 font-display text-2xl font-bold md:text-3xl">
                  {t("formHeading")}
                </h2>
                <p className="mb-8 text-sm text-muted-foreground">
                  {t("formDescription")}
                </p>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold">{t("successHeading")}</h3>
                    <p className="mt-2 max-w-sm text-muted-foreground">{t("successDescription")}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-sm font-medium">
                          {t("nameLabel")} <span className="text-primary">*</span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder={t("namePlaceholder")}
                          required
                          className="border-border/50 bg-background/60 backdrop-blur-sm transition-colors focus-visible:border-primary/40"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-medium">
                          {t("emailLabel")} <span className="text-primary">*</span>
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          placeholder={t("emailPlaceholder")}
                          required
                          className="border-border/50 bg-background/60 backdrop-blur-sm transition-colors focus-visible:border-primary/40"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label htmlFor="phone" className="text-sm font-medium">
                          {t("phoneLabel")}
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formState.phone}
                          onChange={handleChange}
                          placeholder={t("phonePlaceholder")}
                          className="border-border/50 bg-background/60 backdrop-blur-sm transition-colors focus-visible:border-primary/40"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="projectType" className="text-sm font-medium">
                          {t("projectTypeLabel")} <span className="text-primary">*</span>
                        </label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={formState.projectType}
                          onChange={handleChange}
                          required
                          className="flex h-10 w-full rounded-md border border-border/50 bg-background/60 px-3 py-2 text-sm backdrop-blur-sm ring-offset-background transition-colors focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="website">{t("projectWebsite")}</option>
                          <option value="branding">{t("projectBranding")}</option>
                          <option value="ui-ux">{t("projectUiUx")}</option>
                          <option value="other">{t("projectOther")}</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-sm font-medium">
                        {t("messageLabel")} <span className="text-primary">*</span>
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder={t("messagePlaceholder")}
                        rows={5}
                        required
                        className="border-border/50 bg-background/60 backdrop-blur-sm transition-colors focus-visible:border-primary/40"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full rounded-full text-base"
                    >
                      {isSubmitting ? t("submitting") : t("submitButton")}
                      <Send className="ml-2 rtl:ml-0 rtl:mr-2 h-4 w-4" />
                    </Button>

                    {error && (
                      <p className="text-center text-sm text-red-500">{error}</p>
                    )}

                    <p className="text-center text-xs text-muted-foreground">
                      {t("privacyNote")}
                    </p>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* ── Info sidebar (2 cols) ── */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Availability badge */}
              <ScrollReveal animation="fadeUp" delay={0.15}>
                <div className="rounded-2xl border border-border/40 bg-card/30 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                    </span>
                    <span className="text-sm font-medium">{t("availableStatus")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {t("responseTime")}
                  </div>
                </div>
              </ScrollReveal>

              {/* Contact methods */}
              <ScrollReveal animation="fadeUp" delay={0.2}>
                <div className="rounded-2xl border border-border/40 bg-card/30 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl">
                  <StaggerContainer className="space-y-5" staggerDelay={0.08}>
                    {/* Email */}
                    <StaggerItem animation="fadeUp">
                      <h3 className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        {t("emailHeading")}
                      </h3>
                      <Link
                        href={`mailto:${email}`}
                        className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                        onClick={() => {
                          trackContactAction("email_click", "email");
                          trackContactClick("email", "contact_sidebar");
                        }}
                      >
                        {email}
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0" />
                      </Link>
                    </StaggerItem>

                    <div className="border-t border-border/30" />

                    {/* Phone */}
                    <StaggerItem animation="fadeUp">
                      <h3 className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        {t("phoneHeading")}
                      </h3>
                      <Link
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                        onClick={() => {
                          trackContactAction("phone_click", "phone");
                          trackContactClick("phone", "contact_sidebar");
                        }}
                      >
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        {phone}
                      </Link>
                    </StaggerItem>

                    <div className="border-t border-border/30" />

                    {/* WhatsApp */}
                    <StaggerItem animation="fadeUp">
                      <h3 className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        {t("whatsappHeading")}
                      </h3>
                      <button
                        onClick={() => {
                          trackContactAction("whatsapp_click", "whatsapp");
                          trackContactClick("whatsapp", "contact_sidebar");
                          openWhatsApp();
                        }}
                        className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-primary" />
                        {t("whatsappLabel")}
                      </button>
                    </StaggerItem>
                  </StaggerContainer>
                </div>
              </ScrollReveal>

              {/* Location */}
              <ScrollReveal animation="fadeUp" delay={0.25}>
                <div className="rounded-2xl border border-border/40 bg-card/30 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl">
                  <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {t("locationHeading")}
                  </h3>
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    {t("city")}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{t("timezone")}</p>
                </div>
              </ScrollReveal>

              {/* Socials */}
              <ScrollReveal animation="fadeUp" delay={0.3}>
                <div className="rounded-2xl border border-border/40 bg-card/30 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl">
                  <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {t("socialsHeading")}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {socials.map((social) => (
                      <Link
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                      >
                        {social.name}
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* CTA */}
              <ScrollReveal animation="fadeUp" delay={0.35}>
                <Button asChild size="lg" className="w-full rounded-full text-base">
                  <Link href="/rate-calculator">
                    {t("cta")}
                    <ArrowUpRight className="ml-2 rtl:ml-0 rtl:mr-2 h-4 w-4" />
                  </Link>
                </Button>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </PerspectiveSection>
    </div>
  );
}
