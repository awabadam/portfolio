"use server";

import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { blogPosts, type BlogPost } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/server";
import { blogPostSchema } from "@/lib/validation/schemas";

/** Blog post row with timestamps serialized for the client. */
export type AdminBlogPost = Omit<
  BlogPost,
  "created_at" | "updated_at" | "published_at" | "tags" | "published"
> & {
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string | null;
  published_at: string | null;
};

export type ActionResult = { ok: true } | { ok: false; error: string };

function serialize(row: BlogPost): AdminBlogPost {
  return {
    ...row,
    tags: row.tags ?? [],
    published: row.published ?? false,
    created_at: row.created_at?.toISOString() ?? "",
    updated_at: row.updated_at?.toISOString() ?? null,
    published_at: row.published_at?.toISOString() ?? null,
  };
}

// Thrown server-action errors are redacted in production, so mutations return
// their error message instead of throwing it.
function failure(err: unknown, fallback: string): ActionResult {
  return { ok: false, error: err instanceof Error ? err.message : fallback };
}

const postIdSchema = z.string().uuid();

const postInputSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().max(500),
  content: z.string(),
  category: z.string().max(100),
  tags: z.string().max(1000),
  featured_image_url: z.string().max(2000),
  meta_title: z.string().max(300),
  meta_description: z.string().max(1000),
  reading_time: z.number().int().min(1).max(600),
  published: z.boolean(),
});

export type BlogPostInput = z.infer<typeof postInputSchema>;

export async function listBlogPosts(): Promise<AdminBlogPost[]> {
  await requireAdmin();
  const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.created_at));
  return rows.map(serialize);
}

/**
 * Creates a post, or updates `existingId` when given. The author is always
 * taken from the session.
 */
export async function saveBlogPost(input: BlogPostInput, existingId?: string): Promise<ActionResult> {
  const session = await requireAdmin();

  const parsed = postInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid post data" };
  }
  const data = parsed.data;
  const tags = data.tags.split(",").map((t) => t.trim()).filter(Boolean);

  // Same rules the editor validates client-side.
  const checked = blogPostSchema.safeParse({
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || undefined,
    content: data.content,
    coverImage: data.featured_image_url || undefined,
    published: data.published,
    tags: tags.length ? tags : undefined,
  });
  if (!checked.success) {
    return { ok: false, error: checked.error.issues[0]?.message || "Validation failed" };
  }

  const postData = {
    ...data,
    tags,
    published_at: data.published ? new Date() : null,
    author_id: session.user.id,
  };

  try {
    if (existingId) {
      await db.update(blogPosts).set(postData).where(eq(blogPosts.id, postIdSchema.parse(existingId)));
    } else {
      await db.insert(blogPosts).values(postData);
    }
    return { ok: true };
  } catch (err) {
    return failure(err, "Failed to save");
  }
}

export async function setBlogPostPublished(id: string, published: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db
      .update(blogPosts)
      .set({ published: published === true, published_at: published === true ? new Date() : null })
      .where(eq(blogPosts.id, postIdSchema.parse(id)));
    return { ok: true };
  } catch (err) {
    return failure(err, "Failed to update post");
  }
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, postIdSchema.parse(id)));
    return { ok: true };
  } catch (err) {
    return failure(err, "Failed to delete");
  }
}
