import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { isAnswer, isComplete, isQuestionId, type Answers } from "@/lib/audit";

/**
 * The answers from the reader's latest finished /audit, looked up by the email
 * in their playbook key, so /audit/playbook can mark their gaps even when it
 * is opened from the email link on another device. Null when they only used
 * the playbook form, never finished the check, or the database is unreachable.
 *
 * Server only (database). Never import from a client component.
 */
export async function getAuditAnswersForEmail(email: string): Promise<Answers | null> {
  try {
    const rows = await db
      .select({ metadata: leads.metadata })
      .from(leads)
      .where(and(eq(leads.source, "clinic_audit"), eq(sql`lower(${leads.email})`, email.trim().toLowerCase())))
      .orderBy(desc(sql`coalesce(${leads.updated_at}, ${leads.created_at})`))
      .limit(5);

    for (const { metadata } of rows) {
      const meta = metadata as { partial?: boolean; answers?: Record<string, unknown> } | null;
      if (!meta?.answers || meta.partial === true) continue;
      const answers: Answers = {};
      for (const [k, v] of Object.entries(meta.answers)) {
        if (isQuestionId(k) && isAnswer(v)) answers[k] = v;
      }
      if (isComplete(answers)) return answers;
    }
    return null;
  } catch (error) {
    console.error("[playbook] audit lookup failed:", error);
    return null;
  }
}
