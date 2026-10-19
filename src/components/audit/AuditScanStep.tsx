"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GlassPill } from "@/components/ui/glass-pill";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { normalizeWebsite } from "@/lib/audit";
import type { ScanResult, ScanSuccess } from "@/lib/auditScan";

export interface ScanOutcome {
  website: string;
  result: ScanResult;
  elapsedMs: number;
}

/** Same loose check as the result form; the server validates again. */
export function isEmailLike(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

interface AuditScanStepProps {
  /** Last website the user entered (restored from the draft). */
  website: string;
  /** The last successful scan, or null. Lets the user go back to its review instead of scanning again. */
  scan: ScanSuccess | null;
  /** True when the last scan failed and the user has not retried yet. */
  scanFailed: boolean;
  elapsedMs: number;
  onOutcome: (outcome: ScanOutcome) => void;
  /** Back to the review of the last scan. */
  onContinue: () => void;
  /** Skip the scan; carries the website typed so far (may be ""). */
  onSkip: (typed: { website: string }) => void;
  onBack: () => void;
}

const CLIENT_TIMEOUT_MS = 12_000;

export function hostOf(website: string): string {
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return website.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}

export default function AuditScanStep({
  website,
  scan,
  scanFailed,
  elapsedMs,
  onOutcome,
  onContinue,
  onSkip,
  onBack,
}: AuditScanStepProps) {
  const t = useTranslations("audit.scan");
  const tAudit = useTranslations("audit");
  const reduceMotion = useReducedMotion();

  const [value, setValue] = useState(website);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [running, setRunning] = useState<string | null>(null); // host being checked
  const [stepIndex, setStepIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const steps = t.raw("progressSteps") as string[];

  // Cycle the progress words while the scan runs.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setStepIndex((i) => (i + 1) % steps.length), 900);
    return () => window.clearInterval(id);
  }, [running, steps.length]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const normalized = normalizeWebsite(value);
    setFieldError(normalized ? null : tAudit("errors.website"));
    if (!normalized) {
      inputRef.current?.focus();
      return;
    }
    const host = hostOf(normalized);
    setRunning(host);
    setStepIndex(0);
    const started = performance.now();
    let result: ScanResult;
    try {
      const res = await fetch("/api/audit/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: normalized }),
        signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
      });
      const data = (await res.json().catch(() => null)) as ScanResult | null;
      if (res.status === 429) result = { ok: false, error: "unreachable" };
      else if (data && typeof data === "object" && "ok" in data) result = data;
      else result = { ok: false, error: "unreachable" };
      if (res.status === 400 && data && !data.ok && data.error === "blocked_host") {
        // Keep the form: a private or unreachable address needs a different input.
        setRunning(null);
        setFieldError(t("failedBlocked"));
        return;
      }
    } catch (err) {
      result = { ok: false, error: (err as Error)?.name === "TimeoutError" ? "timeout" : "unreachable" };
    }
    const elapsed = Math.round(performance.now() - started);
    trackEvent("audit_scan", { ok: result.ok, error: result.ok ? undefined : result.error, ms: elapsed });
    setRunning(null);
    onOutcome({ website: normalized, result, elapsedMs: elapsed });
  };

  const skip = () => onSkip({ website: normalizeWebsite(value) ?? "" });

  const lastHost = scan ? hostOf(scan.finalUrl) : null;

  return (
    <div className="mx-auto max-w-2xl pt-4 md:pt-8">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">{t("eyebrow")}</p>

      <h2 className="font-display text-heading text-balance">{t("heading")}</h2>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">{t("text")}</p>

      {scanFailed && !running && (
        <p
          role="status"
          className="mt-6 border-s-2 border-foreground/30 ps-4 text-sm leading-relaxed text-muted-foreground"
        >
          {t("failed", { host: hostOf(website) })}
        </p>
      )}

      {running ? (
        <div className="mt-8" role="status" aria-live="polite">
          <p className="text-base font-medium">
            {t("progress", { host: running })}
            <span className="text-muted-foreground">
              {" "}
              {steps[stepIndex]}
            </span>
          </p>
          <div className="mt-4 h-px w-full overflow-hidden bg-border">
            <motion.div
              className="h-px w-1/3 bg-foreground"
              initial={{ x: "-100%" }}
              animate={{ x: reduceMotion ? "0%" : "300%" }}
              transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
            />
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-8">
          <label htmlFor="audit-scan-website" className="mb-2 block text-sm font-medium">
            {t("label")}
          </label>
          <Input
            ref={inputRef}
            id="audit-scan-website"
            name="website"
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            dir="ltr"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t("placeholder")}
            aria-invalid={Boolean(fieldError)}
            aria-describedby={fieldError ? "audit-scan-website-error" : undefined}
            className={cn(
              "h-12 w-full rounded-[8px] border-border bg-background text-start text-base",
              fieldError && "border-red-500",
            )}
          />
          {fieldError && (
            <p id="audit-scan-website-error" className="mt-2 text-sm text-red-600" role="alert">
              {fieldError}
            </p>
          )}

          <GlassPill tone="dark" arrow type="submit" className="mt-6 h-12 px-6 text-base">
            {t("submit")}
          </GlassPill>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            {lastHost && (
              <button
                type="button"
                onClick={onContinue}
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                {t("useLast", { host: lastHost })}
              </button>
            )}
            <button
              type="button"
              onClick={skip}
              className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {scanFailed ? t("continueManual") : t("skip")}
            </button>
          </div>
        </form>
      )}

      <div className="mt-10 flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          {tAudit("back")}
        </button>
      </div>
    </div>
  );
}
