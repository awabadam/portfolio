"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { ArrowUpRight, Check, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { GlassPill } from "@/components/ui/glass-pill";
import { cn } from "@/lib/utils";
import { trackCTAClick, trackContactClick, trackEvent, trackFormSubmission, trackLeadGeneration } from "@/lib/analytics";
import { CAL_BOOKING_URL, calEmbedUrl } from "@/lib/contactLinks";
import { normalizeWebsite, type Answer, type AuditResult, type ClinicProfile, type QuestionId } from "@/lib/audit";
import type { ScanChecks } from "@/lib/auditScan";
import { PLAYBOOK_KEY_STORAGE, playbookHref } from "@/lib/playbookMeta";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905541759945";

interface AuditLeadFormProps {
  answers: Record<QuestionId, Answer>;
  result: AuditResult;
  /** Website from the scan step; the field starts filled so the clinic does not type it twice. */
  initialWebsite?: string;
  /** Scan checks, sent with the submission so the written audit starts informed. */
  scan?: ScanChecks | null;
  /** Lead question answers (role, treatments, markets, volume, channel, timeline, budgetFit). */
  profile?: Partial<ClinicProfile>;
  /** Email from the first step; shown as a line, editable on demand. */
  initialEmail?: string;
  /** Token of the partial lead from the email step, so the server completes that row. */
  partialToken?: string | null;
  onSubmitted?: () => void;
}

type FieldErrors = Partial<Record<"website" | "email", string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuditLeadForm({
  answers,
  result,
  initialWebsite = "",
  scan = null,
  profile = {},
  initialEmail = "",
  partialToken = null,
  onSubmitted,
}: AuditLeadFormProps) {
  const t = useTranslations("audit");
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const bookHeadingRef = useRef<HTMLHeadingElement>(null);

  const initial = initialWebsite.replace(/^https?:\/\//, "");
  const websiteKnown = Boolean(initial && normalizeWebsite(initial));
  const [website, setWebsite] = useState(initial);
  const [editWebsite, setEditWebsite] = useState(false);
  const emailKnown = EMAIL_PATTERN.test(initialEmail.trim());
  const [email, setEmail] = useState(initialEmail);
  const [editEmail, setEditEmail] = useState(false);
  const [phone, setPhone] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{
    website: string;
    email: string;
    playbookKey: string | null;
    /** The server judged the lead a good fit: offer the booking calendar. */
    book: boolean;
  } | null>(null);

  // The booking state replaces the form far down the page: move focus to its heading.
  useEffect(() => {
    if (submitted?.book) bookHeadingRef.current?.focus({ preventScroll: true });
  }, [submitted]);

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Awab, my clinic site scored ${result.score}/100 on your free check. I would like the written audit. ${website ? `Site: ${website}` : ""}`.trim(),
  )}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const errors: FieldErrors = {};
    const normalized = normalizeWebsite(website);
    if (!normalized) errors.website = t("errors.website");
    if (!EMAIL_PATTERN.test(email.trim())) errors.email = t("errors.email");
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: normalized,
          email: email.trim(),
          phone,
          answers,
          locale,
          company_website: honeypot,
          scan: scan ?? undefined,
          role: profile.role,
          treatments: profile.treatments,
          markets: profile.markets,
          volume: profile.volume,
          channel: profile.channel,
          timeline: profile.timeline,
          budgetFit: profile.budgetFit,
          partialToken: partialToken ?? undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        field?: string;
        playbookKey?: string;
        book?: boolean;
      };
      if (!res.ok) {
        if (res.status === 429) throw new Error(t("errors.rateLimited"));
        if (data.field === "website") {
          setEditWebsite(true);
          setFieldErrors({ website: t("errors.website") });
          return;
        }
        if (data.field === "email") {
          setFieldErrors({ email: t("errors.email") });
          return;
        }
        throw new Error(t("errors.generic"));
      }
      trackFormSubmission("clinic_audit", "audit");
      trackLeadGeneration("clinic_audit", "audit");
      const playbookKey = typeof data.playbookKey === "string" && data.playbookKey ? data.playbookKey : null;
      if (playbookKey) {
        try {
          window.localStorage.setItem(PLAYBOOK_KEY_STORAGE, playbookKey);
        } catch {
          // Blocked storage: the link in the email still works.
        }
      }
      const book = data.book === true;
      if (book) trackEvent("audit_book_shown");
      setSubmitted({ website: normalized!, email: email.trim(), playbookKey, book });
      onSubmitted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const successText = t("successText", {
      website: submitted.website.replace(/^https?:\/\//, ""),
      email: submitted.email,
    });
    const theme = resolvedTheme === "dark" ? "dark" : "light";

    if (submitted.book) {
      return (
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[10px] border border-border bg-card p-5 md:p-8"
          role="status"
        >
          <h3 ref={bookHeadingRef} tabIndex={-1} className="font-display text-card-title text-balance outline-none">
            {t("book.heading")}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("book.text")}</p>
          <div className="mt-6 overflow-hidden rounded-[10px] border border-border bg-background">
            <iframe
              key={theme}
              src={calEmbedUrl(theme)}
              title={t("book.heading")}
              className="block h-[720px] w-full md:h-[580px]"
            />
          </div>
          <a
            href={CAL_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTAClick("book_call", "audit_book_newtab")}
            className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            {t("book.open")}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          {/* The report and the playbook still went out: say so, and keep the playbook one tap away. */}
          <div className="mt-6 border-t border-border pt-6">
            <p className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                <Check className="h-3 w-3" aria-hidden="true" />
              </span>
              {successText}
            </p>
            <GlassPill href={playbookHref(submitted.playbookKey)} tone="dark" arrow className="mt-5 h-12 px-6 text-base">
              {t("playbook.open")}
            </GlassPill>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[10px] border border-border bg-card p-8 md:p-10"
        role="status"
      >
        <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background">
          <Check className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="font-display text-card-title text-balance">{t("successHeading")}</h3>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{successText}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <GlassPill href={playbookHref(submitted.playbookKey)} tone="dark" arrow className="h-12 px-6 text-base">
            {t("playbook.open")}
          </GlassPill>
          <Link href="/projects" className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">
            {t("successLink")}
            <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContactClick("whatsapp", "audit_success")}
            className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
          >
            {t("orWhatsapp")}
            <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
          </a>
        </div>
      </motion.div>
    );
  }

  const inputClass = "h-12 rounded-[8px] border-border bg-background text-base text-start";

  return (
    <form onSubmit={handleSubmit} noValidate className="relative rounded-[10px] border border-border bg-card p-5 md:p-8">
      <div className="grid gap-5">
        {/* The first step already asked for the email: show it as a line, editable on demand. */}
        {emailKnown && !editEmail && !fieldErrors.email ? (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{t("form.emailKnown", { email: email.trim() })}</span>
            <button
              type="button"
              onClick={() => setEditEmail(true)}
              className="inline-flex min-h-11 items-center font-medium text-foreground underline underline-offset-4"
            >
              {t("form.change")}
            </button>
          </p>
        ) : (
          <Field label={t("form.email")} htmlFor="audit-email" error={fieldErrors.email}>
            <Input
              id="audit-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("form.emailPlaceholder")}
              autoComplete="email"
              dir="ltr"
              required
              autoFocus={editEmail}
              aria-invalid={Boolean(fieldErrors.email)}
              className={cn(inputClass, fieldErrors.email && "border-red-500")}
            />
          </Field>
        )}

        {/* The scan step already asked for the site: show it as a line, editable on demand. */}
        {websiteKnown && !editWebsite && !fieldErrors.website ? (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {t("form.websiteKnown", { website: website.replace(/^https?:\/\//, "").replace(/\/$/, "") })}
            </span>
            <button
              type="button"
              onClick={() => setEditWebsite(true)}
              className="inline-flex min-h-11 items-center font-medium text-foreground underline underline-offset-4"
            >
              {t("form.change")}
            </button>
          </p>
        ) : (
          <Field label={t("form.website")} htmlFor="audit-website" error={fieldErrors.website}>
            <Input
              id="audit-website"
              name="website"
              type="text"
              inputMode="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder={t("form.websitePlaceholder")}
              autoComplete="url"
              dir="ltr"
              required
              autoFocus={editWebsite}
              aria-invalid={Boolean(fieldErrors.website)}
              className={cn(inputClass, fieldErrors.website && "border-red-500")}
            />
          </Field>
        )}

        {showPhone ? (
          <Field label={t("form.phone")} htmlFor="audit-phone" optional={t("form.optional")}>
            <Input
              id="audit-phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("form.phonePlaceholder")}
              autoComplete="tel"
              dir="ltr"
              autoFocus
              className={inputClass}
            />
          </Field>
        ) : (
          <button
            type="button"
            onClick={() => setShowPhone(true)}
            className="inline-flex min-h-11 items-center justify-self-start text-sm font-medium underline underline-offset-4"
          >
            + {t("form.addPhone")}
          </button>
        )}
      </div>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="absolute -start-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="audit-company-website">Company website</label>
        <input
          id="audit-company-website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <GlassPill
        type="submit"
        tone="dark"
        arrow
        className={cn("mt-6 h-12 w-full px-6 text-base", submitting && "pointer-events-none opacity-60")}
      >
        {submitting ? t("form.submitting") : t("form.submit")}
      </GlassPill>

      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      <p className="mt-4 text-xs text-muted-foreground">{t("form.privacy")}</p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {optional ? <span className="font-normal text-muted-foreground"> ({optional})</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
