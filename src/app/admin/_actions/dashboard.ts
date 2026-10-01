"use server";

import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts, leads } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/server";

export async function getDashboardStats() {
  await requireAdmin();

  const [totalLeads, newLeads, whatsappLeads, contactFormLeads] = await Promise.all([
    db.$count(leads),
    db.$count(leads, eq(leads.status, "new")),
    db.$count(leads, eq(leads.source, "whatsapp")),
    db.$count(leads, eq(leads.source, "contact_form")),
  ]);

  return { totalLeads, newLeads, whatsappLeads, contactFormLeads };
}

/** Latest leads for the activity feed (timestamps as ISO strings). */
export async function getRecentLeads(limit = 5) {
  await requireAdmin();

  const rows = await db
    .select({ name: leads.name, source: leads.source, created_at: leads.created_at })
    .from(leads)
    .orderBy(desc(leads.created_at))
    .limit(clampLimit(limit));

  return rows.map((r) => ({ ...r, created_at: r.created_at?.toISOString() ?? "" }));
}

/** Latest English blog posts for the activity feed (timestamps as ISO strings). */
export async function getRecentBlogPosts(limit = 5) {
  await requireAdmin();

  const rows = await db
    .select({
      title: blogPosts.title,
      created_at: blogPosts.created_at,
      published: blogPosts.published,
      locale: blogPosts.locale,
    })
    .from(blogPosts)
    .where(eq(blogPosts.locale, "en"))
    .orderBy(desc(blogPosts.created_at))
    .limit(clampLimit(limit));

  return rows.map((r) => ({ ...r, created_at: r.created_at?.toISOString() ?? "" }));
}

function clampLimit(limit: number) {
  return Number.isInteger(limit) ? Math.min(Math.max(limit, 1), 50) : 5;
}
