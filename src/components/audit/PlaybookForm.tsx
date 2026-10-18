"use client";

import { forwardRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { GlassPill } from "@/components/ui/glass-pill";
import { cn } from "@/lib/utils";
import { trackFormSubmission, trackLeadGeneration } from "@/lib/analytics";
import { normalizeWebsite } from "@/lib/audit";
import { PLAYBOOK_KEY_STORAGE, playbookHref } from "@/lib/playbookMeta";

interface PlaybookFormProps {
  /** Analytics location, e.g. "audit_hero" or "playbook_gate". */
  location: string;
  className?: string;
}

type FieldErrors = Partial<Record<"website" | "email", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The direct path to the playbook: email (required) + clinic website (optional).
 * POST /api/playbook returns the access key; the key is stored like the check
 * flow does and the browser goes straight to /audit/playbook?k=<key>.
 * The forwarded ref points at the email input so the opener can focus it.
 */
const PlaybookForm = forwardRef<HTMLInputElement, PlaybookFormProps>(function PlaybookForm(
  { location, className },
  emailRef,
) {
  const t = useTranslations("audit");
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ email: string; href: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const errors: FieldErrors = {};
    const site = website.trim();
    const normalized = site ? normalizeWebsite(site) : null;
    if (site && !normalized) errors.website = t("errors.website");
    if (!EMAIL_RE.test(email.trim())) errors.email = t("errors.email");
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/playbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          website: normalized ?? "",
          locale,
          company_website: honeypot,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { field?: string; playbookKey?: string };
      if (!res.ok) {
        if (res.status === 429) throw new Error(t("errors.rateLimited"));
        if (data.field === "website" || data.field === "email") {
          setFieldErrors({ [data.field]: t(`errors.${data.field}`) });
          return;
        }
        throw new Error(t("errors.generic"));
      }
      const key = typeof data.playbookKey === "string" && data.playbookKey ? data.playbookKey : null;
      if (!key) throw new Error(t("errors.generic"));
      trackFormSubmission("playbook", location);
      trackLeadGeneration("playbook", location);
      try {
        window.localStorage.setItem(PLAYBOOK_KEY_STORAGE, key);
      } catch {
        // Blocked storage: the link in the email still works.
      }
      const href = playbookHref(key);
      setDone({ email: email.trim(), href });
      router.push(href);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className={cn("rounded-[10px] border border-border bg-card p-6 md:p-8", className)} role="status">
        <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background">
          <Check className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="font-display text-card-title text-balance">{t("quick.successHeading")}</p>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {t("quick.successText", { email: done.email })}
        </p>
        <GlassPill href={done.href} tone="dark" arrow className="mt-6 h-12 px-6 text-base">
          {t("playbook.open")}
        </GlassPill>
      </div>
    );
  }

  const inputClass = "h-12 rounded-[8px] border-border bg-background text-base text-start";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn("relative rounded-[10px] border border-border bg-card p-5 md:p-6", className)}
    >
      <div className="grid gap-4">
        <div className="space-y-1.5">
          <label htmlFor={`${location}-email`} className="text-sm font-medium">
            {t("form.email")}
          </label>
          <Input
            ref={emailRef}
            id={`${location}-email`}
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("form.emailPlaceholder")}
            autoComplete="email"
            dir="ltr"
            required
            aria-invalid={Boolean(fieldErrors.email)}
            className={cn(inputClass, fieldErrors.email && "border-red-500")}
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-600 dark:text-red-400" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <label htmlFor={`${location}-website`} className="text-sm font-medium">
            {t("quick.website")}
            <span className="font-normal text-muted-foreground"> ({t("form.optional")})</span>
          </label>
          <Input
            id={`${location}-website`}
            name="website"
            type="text"
            inputMode="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder={t("form.websitePlaceholder")}
            autoComplete="url"
            dir="ltr"
            aria-invalid={Boolean(fieldErrors.website)}
            className={cn(inputClass, fieldErrors.website && "border-red-500")}
          />
          {fieldErrors.website && (
            <p className="text-xs text-red-600 dark:text-red-400" role="alert">
              {fieldErrors.website}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="absolute -start-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={`${location}-company-website`}>Company website</label>
        <input
          id={`${location}-company-website`}
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
        className={cn("mt-5 h-12 w-full px-6 text-base", submitting && "pointer-events-none opacity-60")}
      >
        {submitting ? t("form.submitting") : t("quick.submit")}
      </GlassPill>

      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      <p className="mt-3 text-xs text-muted-foreground">{t("quick.privacy")}</p>
    </form>
  );
});

export default PlaybookForm;
