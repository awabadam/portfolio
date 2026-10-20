"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight, CalendarDays, Copy, Mail, MapPin, Phone, MessageSquare,
  Check, Send, Clock,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/routing";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/effects";
import { useWhatsApp } from "@/components/chat/WhatsAppContext";
import StockPhoto from "@/components/ui/stock-photo";
import AuditCta from "@/components/audit/AuditCta";
import BookingSection from "@/components/cta/BookingSection";
import {
  trackFormSubmission,
  trackContactAction,
  trackLeadGeneration,
  trackContactClick,
  trackCTAClick,
} from "@/lib/analytics/gtm";

// Values of the projectType <select>; /contact?plan=<value> pre-selects one
// (the pricing cards link here with their plan).
const PROJECT_TYPES = ["clinic-website", "growth-system", "site-care", "growth-retainer", "other"] as const;

const email = "hello@awab.design";
const phone = "+90 554 175 9945";

export default function ContactPage() {
  const t = useTranslations("contact");
  const tc = useTranslations("common");
  const { openWhatsApp } = useWhatsApp();
  const [copied, setCopied] = useState(false);

  // Form state
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    projectType: "clinic-website",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const plan = new URLSearchParams(window.location.search).get("plan");
    if (plan && (PROJECT_TYPES as readonly string[]).includes(plan)) {
      setFormState((prev) => ({ ...prev, projectType: plan }));
    }
  }, []);

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
        setFormState({ name: "", email: "", phone: "", message: "", projectType: "clinic-website" });
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
    <div className="min-h-screen bg-background">
      {/* Hero: short, clinic-framed, form sits in the first screen on desktop */}
      <section className="container mx-auto px-5 pb-10 pt-32 md:px-8 md:pb-12">
        <ScrollReveal animation="fadeUp">
          <p className="mb-5 font-mono text-label text-muted-foreground">
            {t("eyebrow")}
          </p>
          <h1 className="max-w-4xl font-display text-hero text-balance">{t("heading")}</h1>
        </ScrollReveal>
        <ScrollReveal animation="fadeUp" delay={0.1}>
          <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("description")}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  trackContactAction("whatsapp_click", "whatsapp");
                  trackContactClick("whatsapp", "contact_hero");
                  openWhatsApp();
                }}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
              >
                <MessageSquare className="h-4 w-4" />
                {t("whatsappLabel")}
              </button>
              <a
                href="#book"
                onClick={() => trackCTAClick("book_call", "contact_hero")}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:border-foreground/40"
              >
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                {tc("bookCall")}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-4 font-mono text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                aria-label={copied ? t("copied") : email}
              >
                <Mail className="h-4 w-4" />
                <span>{email}</span>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4 opacity-60" />}
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Form + sidebar */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
            {/* ── Form (3 cols) ── */}
            <ScrollReveal animation="fadeUp" className="lg:col-span-3">
              <div className="rounded-2xl border border-border/40 bg-card/30 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl md:p-10">
                <h2 className="mb-1 font-display text-card-title">
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
                          <option value="clinic-website">{t("projectClinicWebsite")}</option>
                          <option value="growth-system">{t("projectGrowthSystem")}</option>
                          <option value="site-care">{t("projectSiteCare")}</option>
                          <option value="growth-retainer">{t("projectGrowthRetainer")}</option>
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
                      <h3 className="mb-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">
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
                      <h3 className="mb-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">
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
                      <h3 className="mb-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">
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
                {/* Galata street photo with the location overlaid on a scrim */}
                <StockPhoto
                  slot="istanbul-street-alt"
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  className="aspect-[4/3] rounded-2xl bg-black text-white"
                  imageClassName="object-[50%_35%]"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="mb-3 font-mono text-xs uppercase tracking-wide text-white/70">
                      {t("locationHeading")}
                    </h3>
                    <div className="flex items-center gap-2 font-medium text-white">
                      <MapPin className="h-4 w-4" />
                      {t("city")}
                    </div>
                    <p className="mt-1 text-sm text-white/75">{t("timezone")}</p>
                  </div>
                </StockPhoto>
              </ScrollReveal>

              {/* Socials */}
              <ScrollReveal animation="fadeUp" delay={0.3}>
                <div className="rounded-2xl border border-border/40 bg-card/30 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl">
                  <h3 className="mb-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
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
            </div>
          </div>
        </div>
      </section>

      {/* Prefer to talk: the 15-minute call, booked inline via Cal.com */}
      <BookingSection />

      {/* Closing card: not ready to talk? start with the free playbook */}
      <AuditCta location="contact_footer" />
    </div>
  );
}
