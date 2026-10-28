"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GlassPill } from "@/components/ui/glass-pill";
import { cn } from "@/lib/utils";

/** Same loose check as the result form; the server validates again. */
export function isEmailLike(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

interface AuditEmailStepProps {
  /** Last email the user entered (restored from the draft). */
  email: string;
  /** Continue with the email, trimmed and checked. */
  onContinue: (email: string) => void;
  onBack: () => void;
}

/**
 * The first step of the check, and required: the email comes before the
 * website so the owner can follow up with anyone who stops partway (a partial
 * lead, see /api/audit/start). Only for the report, never for marketing.
 */
export default function AuditEmailStep({ email, onContinue, onBack }: AuditEmailStepProps) {
  const t = useTranslations("audit.emailStep");
  const tAudit = useTranslations("audit");

  const [value, setValue] = useState(email);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // The field is the only thing to do here: focus it on arrival.
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!isEmailLike(trimmed)) {
      setFieldError(tAudit("errors.email"));
      inputRef.current?.focus();
      return;
    }
    onContinue(trimmed);
  };

  return (
    <div className="mx-auto max-w-2xl pt-4 md:pt-8">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">{t("eyebrow")}</p>

      <h2 className="font-display text-heading text-balance">{t("heading")}</h2>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">{t("text")}</p>

      <form onSubmit={submit} noValidate className="mt-8">
        <label htmlFor="audit-step-email" className="mb-2 block text-sm font-medium">
          {t("label")}
        </label>
        <Input
          ref={inputRef}
          id="audit-step-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          dir="ltr"
          required
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (fieldError) setFieldError(null);
          }}
          placeholder={tAudit("form.emailPlaceholder")}
          aria-invalid={Boolean(fieldError)}
          aria-describedby={fieldError ? "audit-step-email-error" : undefined}
          className={cn(
            "h-12 w-full rounded-[8px] border-border bg-background text-start text-base",
            fieldError && "border-red-500",
          )}
        />
        {fieldError && (
          <p id="audit-step-email-error" className="mt-2 text-sm text-red-600" role="alert">
            {fieldError}
          </p>
        )}

        <GlassPill tone="dark" arrow type="submit" className="mt-6 h-12 px-6 text-base">
          {t("submit")}
        </GlassPill>
      </form>

      <div className="mt-10 flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          {tAudit("back")}
        </button>
      </div>
    </div>
  );
}
