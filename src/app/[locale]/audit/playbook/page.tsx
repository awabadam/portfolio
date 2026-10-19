import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { getPlaybook } from "@/lib/playbook";
import { verifyPlaybookKey } from "@/lib/playbookKey";
import { getAuditAnswersForEmail } from "@/lib/playbookAudit";
import PlaybookReader from "@/components/playbook/PlaybookReader";
import PlaybookGate from "@/components/playbook/PlaybookGate";

/**
 * /audit/playbook?k=<key>: the playbook. The key is a stateless HMAC issued
 * by POST /api/audit or POST /api/playbook (src/lib/playbookKey.ts); without
 * a valid one the page shows a gate with the one-step playbook form.
 * Private by design: noindex, no OG image, not in the sitemap.
 */

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<{ k?: string | string[] }>;

function keyFrom(k: string | string[] | undefined): string | null {
  const v = Array.isArray(k) ? k[0] : k;
  return typeof v === "string" && v.length > 0 ? v : null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const playbook = await getPlaybook(locale as Locale);
  return {
    title: { absolute: playbook.title },
    description: playbook.subtitle,
    robots: { index: false, follow: true },
  };
}

export default async function PlaybookPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { k } = await searchParams;
  const key = keyFrom(k);
  const email = verifyPlaybookKey(key);

  if (!email) return <PlaybookGate rejectedKey={key} />;

  const [playbook, auditAnswers] = await Promise.all([
    getPlaybook(locale as Locale),
    getAuditAnswersForEmail(email),
  ]);
  return <PlaybookReader playbook={playbook} auditAnswers={auditAnswers} />;
}
