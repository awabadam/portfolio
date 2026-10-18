"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import PlaybookForm from "@/components/audit/PlaybookForm";
import { PLAYBOOK_KEY_STORAGE, PLAYBOOK_META, playbookHref } from "@/lib/playbookMeta";

interface PlaybookGateProps {
  /** True when ?k= was present but did not verify: never redirect again, and forget a matching stored key. */
  rejectedKey?: string | null;
}

/**
 * Shown on /audit/playbook without a valid key. If this browser saved a key
 * after a successful submission, reopen the page with it; otherwise show the
 * one-step playbook form (email + optional website), with the check as the
 * alternative.
 */
export default function PlaybookGate({ rejectedKey = null }: PlaybookGateProps) {
  const t = useTranslations("audit.playbook.gate");
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(PLAYBOOK_KEY_STORAGE);
      if (!stored) return;
      if (rejectedKey) {
        if (stored === rejectedKey) window.localStorage.removeItem(PLAYBOOK_KEY_STORAGE);
        return;
      }
      router.replace(playbookHref(stored));
    } catch {
      // Storage blocked: the gate stays.
    }
  }, [rejectedKey, router]);

  return (
    <main className="min-h-screen bg-background pt-32">
      <section className="container mx-auto px-5 pb-20 md:px-8 md:pb-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="mb-5 font-mono text-label text-muted-foreground">{t("eyebrow")}</p>
            <h1 className="max-w-3xl font-display text-hero text-balance">{t("heading")}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("text", { templates: PLAYBOOK_META.templates })}
            </p>
          </div>
          <div className="lg:col-span-5 lg:pt-10">
            <PlaybookForm location="playbook_gate" />
            <Link
              href="/audit"
              className="mt-6 inline-flex min-h-11 items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
            >
              {t("orCheck")}
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("haveKey")}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
