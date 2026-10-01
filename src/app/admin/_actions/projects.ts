"use server";

import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { projects, type Project } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/server";

/** Project row with timestamps serialized for the client. */
export type AdminProject = Omit<Project, "created_at" | "updated_at"> & {
  created_at: string | null;
  updated_at: string | null;
};

function serialize(row: Project): AdminProject {
  return {
    ...row,
    created_at: row.created_at?.toISOString() ?? null,
    updated_at: row.updated_at?.toISOString() ?? null,
  };
}

const projectIdSchema = z.string().trim().min(1).max(200);

const projectInputSchema = z.object({
  id: projectIdSchema,
  title: z.string().trim().min(1, "Title, category, and description are required").max(200),
  category: z.string().trim().min(1, "Title, category, and description are required").max(100),
  description: z.string().trim().min(1, "Title, category, and description are required").max(5000),
  live_url: z.string().max(2000).nullable(),
  featured: z.boolean(),
  iframe_blocked: z.boolean(),
  technologies: z.array(z.string().max(100)).max(50),
  results: z.array(z.string().max(500)).max(50),
  overview: z.string().max(20000).nullable(),
  objectives: z.array(z.string().max(1000)).max(50).nullable(),
  role: z.string().max(200).nullable(),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;

export async function listProjects(): Promise<AdminProject[]> {
  await requireAdmin();
  const rows = await db.select().from(projects).orderBy(desc(projects.created_at));
  return rows.map(serialize);
}

/** Returns the project, or null when it doesn't exist. */
export async function getProject(id: string): Promise<AdminProject | null> {
  await requireAdmin();
  const projectId = projectIdSchema.parse(id);
  const [row] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  return row ? serialize(row) : null;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

// Thrown server-action errors are redacted in production, so mutations return
// their error message instead of throwing it.
function failure(err: unknown): ActionResult {
  return { ok: false, error: err instanceof Error ? err.message : "An unexpected error occurred" };
}

/**
 * Creates a project, or updates `existingId` when given. The owner (user_id)
 * is always taken from the session.
 */
export async function saveProject(input: ProjectInput, existingId?: string): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = projectInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid project data" };
  }
  const { id, ...data } = parsed.data;
  const values = { ...data, user_id: session.user.id };

  try {
    if (existingId) {
      await db.update(projects).set(values).where(eq(projects.id, projectIdSchema.parse(existingId)));
    } else {
      await db.insert(projects).values({ id, ...values });
    }
    return { ok: true };
  } catch (err) {
    return failure(err);
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.delete(projects).where(eq(projects.id, projectIdSchema.parse(id)));
    return { ok: true };
  } catch (err) {
    return failure(err);
  }
}
