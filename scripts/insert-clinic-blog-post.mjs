#!/usr/bin/env node
/**
 * One-off script to insert the clinic pillar blog post into Supabase.
 *
 * Reads the post from src/data/blog.ts fallback (the fallback contains
 * the canonical copy) and upserts it into the blog_posts table using
 * the service role key so we can bypass RLS.
 *
 * Usage: node scripts/insert-clinic-blog-post.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually (Node doesn't do this automatically)
const envPath = resolve(__dirname, "..", ".env.local");
const envText = readFileSync(envPath, "utf8");
const env = Object.fromEntries(
  envText
    .split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      const key = l.slice(0, i).trim();
      let value = l.slice(i + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      return [key, value];
    })
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Read the post content from the fallback file so we keep one source of truth
const blogFile = readFileSync(
  resolve(__dirname, "..", "src", "data", "blog.ts"),
  "utf8"
);

// Extract the clinic post object boundaries using a marker-based approach
const slug = "medical-clinic-website-istanbul";
const postStart = blogFile.indexOf(`id: "${slug}"`);
if (postStart === -1) {
  console.error(`Could not find post "${slug}" in src/data/blog.ts`);
  process.exit(1);
}

// Find the object start (preceding `{`) and object end (closing `}` before next `,` or `]`)
let objStart = blogFile.lastIndexOf("{", postStart);
let depth = 0;
let objEnd = -1;
for (let i = objStart; i < blogFile.length; i++) {
  if (blogFile[i] === "{") depth++;
  else if (blogFile[i] === "}") {
    depth--;
    if (depth === 0) {
      objEnd = i;
      break;
    }
  }
}
if (objEnd === -1) {
  console.error("Could not find matching closing brace for post object");
  process.exit(1);
}

const postSrc = blogFile.slice(objStart, objEnd + 1);

// Extract individual fields
function extractString(field) {
  const re = new RegExp(`${field}:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
  const m = postSrc.match(re);
  if (!m) return null;
  return m[1].replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
}

function extractTemplateString(field) {
  // The content field in blog.ts ends with a literal `\n    `,\n` sequence
  // (newline, 4 spaces, closing backtick, comma, newline). This is a stable
  // sentinel we can use to find the real end, avoiding truncation at inline
  // `backticks` inside the markdown content.
  const startPattern = new RegExp(`${field}:\\s*\``);
  const startMatch = postSrc.match(startPattern);
  if (!startMatch) return null;
  const contentStart = startMatch.index + startMatch[0].length;
  const endSentinel = "\n    `,";
  const contentEnd = postSrc.indexOf(endSentinel, contentStart);
  if (contentEnd === -1) return null;
  return postSrc.slice(contentStart, contentEnd);
}

function extractNumber(field) {
  const re = new RegExp(`${field}:\\s*(\\d+)`);
  const m = postSrc.match(re);
  return m ? Number(m[1]) : null;
}

function extractStringArray(field) {
  const re = new RegExp(`${field}:\\s*\\[([\\s\\S]*?)\\]`);
  const m = postSrc.match(re);
  if (!m) return null;
  return m[1]
    .split(",")
    .map((s) => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function extractBool(field) {
  const re = new RegExp(`${field}:\\s*(true|false)`);
  const m = postSrc.match(re);
  return m ? m[1] === "true" : null;
}

const post = {
  slug,
  title: extractString("title"),
  excerpt: extractString("excerpt"),
  content: extractTemplateString("content"),
  featured_image_url: extractString("featured_image_url"),
  category: extractString("category"),
  tags: extractStringArray("tags"),
  published: extractBool("published"),
  published_at: extractString("published_at"),
  meta_title: extractString("meta_title"),
  meta_description: extractString("meta_description"),
  reading_time: extractNumber("reading_time"),
  view_count: 0,
  locale: "en",
};

console.log("Parsed post:");
console.log({
  slug: post.slug,
  title: post.title,
  category: post.category,
  tags: post.tags,
  content_length: post.content?.length,
  reading_time: post.reading_time,
});

if (!post.title || !post.content || !post.excerpt) {
  console.error("Failed to extract required fields from src/data/blog.ts");
  process.exit(1);
}

// Check if the post already exists (by slug + locale) so we can choose
// insert vs update — the table may not have a unique constraint on slug.
const { data: existing, error: lookupError } = await supabase
  .from("blog_posts")
  .select("id")
  .eq("slug", slug)
  .eq("locale", "en")
  .maybeSingle();

if (lookupError) {
  console.error("Lookup error:", lookupError);
  process.exit(1);
}

let result;
if (existing) {
  console.log(`Existing post found (id=${existing.id}) — updating.`);
  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featured_image_url: post.featured_image_url,
      category: post.category,
      tags: post.tags,
      published: post.published,
      published_at: post.published_at,
      meta_title: post.meta_title,
      meta_description: post.meta_description,
      reading_time: post.reading_time,
    })
    .eq("id", existing.id)
    .select("id, slug, title, published");
  if (error) {
    console.error("Update error:", error);
    process.exit(1);
  }
  result = data;
} else {
  console.log("No existing post — inserting new.");
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(post)
    .select("id, slug, title, published");
  if (error) {
    console.error("Insert error:", error);
    process.exit(1);
  }
  result = data;
}

console.log("\n✅ Done:", result);
console.log("\nVisit: https://www.awab.design/blog/medical-clinic-website-istanbul");
