import { createClient } from "@supabase/supabase-js";

interface GeneratedPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  meta_title: string;
  meta_description: string;
  reading_time: number;
  featured_image_url?: string;
}

interface TopicInput {
  title: string;
  slug: string;
  keywords: string[];
  category: string;
}

const LOCALES_TO_TRANSLATE = [
  { code: "tr", name: "Turkish", slug_prefix: "tr-" },
  { code: "ar", name: "Arabic", slug_prefix: "ar-" },
  { code: "fr", name: "French", slug_prefix: "fr-" },
];

async function callAI(system: string, user: string, maxTokens = 4000): Promise<string> {
  const apiKey = process.env.OPENROUTER_KEY;
  if (!apiKey) throw new Error("OPENROUTER_KEY not configured");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://www.awab.design",
      "X-Title": "Awab Design Blog Generator",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) throw new Error(`OpenRouter API error: ${response.status}`);

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content?.trim();
  if (!raw) throw new Error("No content returned from AI");
  return raw;
}

function parseJSON(raw: string): any {
  let cleaned = raw;
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  return JSON.parse(cleaned);
}

async function fetchCoverImage(keyword: string): Promise<string | undefined> {
  const pexelsKey = process.env.PEXELS_API_KEY;
  if (!pexelsKey) return undefined;

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: pexelsKey } }
    );
    if (res.ok) {
      const data = await res.json();
      return data.photos?.[0]?.src?.large2x;
    }
  } catch {}
  return undefined;
}

export async function generateBlogPost(topic: TopicInput): Promise<GeneratedPost> {
  const prompt = `Write a blog post for Awab Design, a web design studio in Istanbul, Turkey.

TOPIC: ${topic.title}
TARGET KEYWORDS: ${topic.keywords.join(", ")}
CATEGORY: ${topic.category}

REQUIREMENTS:
- Write 1,200-1,500 words in a professional but conversational tone
- Structure: engaging intro, 4-5 sections with H2 headings, conclusion with CTA
- Use markdown formatting (## for headings, **bold**, bullet points)
- Include practical, actionable advice — not generic filler
- Mention Istanbul and Awab Design naturally where relevant (don't force it)
- End with a CTA: "Ready to get started? [Get an instant quote](/rate-calculator) and see what your project would cost."
- Start the post with: "*This article was drafted by AI and reviewed by the Awab Design team.*"
- For links, use plain markdown: [link text](/path) — no domain name in display text

RESPOND IN THIS EXACT JSON FORMAT (no markdown wrapping):
{
  "excerpt": "150-character summary for previews",
  "content": "full markdown content here",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "meta_title": "SEO title under 60 chars",
  "meta_description": "SEO description under 155 chars",
  "reading_time": 7
}`;

  const raw = await callAI(
    "You are a professional web design blog writer. Always respond with valid JSON only, no markdown code blocks.",
    prompt
  );

  const parsed = parseJSON(raw);
  const featured_image_url = await fetchCoverImage(topic.keywords[0]);

  return {
    title: topic.title,
    slug: topic.slug,
    excerpt: parsed.excerpt,
    content: parsed.content,
    category: topic.category,
    tags: parsed.tags || topic.keywords,
    meta_title: parsed.meta_title || topic.title,
    meta_description: parsed.meta_description || parsed.excerpt,
    reading_time: parsed.reading_time || 7,
    featured_image_url,
  };
}

export async function translateBlogPost(
  post: GeneratedPost,
  targetLang: string,
  targetName: string
): Promise<GeneratedPost> {
  const prompt = `Translate this blog post to ${targetName}. Keep markdown formatting, links, and technical terms (HTML, CSS, SEO, etc.) in English. Translate naturally — not word-for-word.

TITLE: ${post.title}
EXCERPT: ${post.excerpt}
META_TITLE: ${post.meta_title}
META_DESCRIPTION: ${post.meta_description}
TAGS: ${post.tags.join(", ")}

CONTENT:
${post.content}

RESPOND IN THIS EXACT JSON FORMAT (no markdown wrapping):
{
  "title": "translated title",
  "excerpt": "translated excerpt",
  "content": "translated full content in markdown",
  "meta_title": "translated meta title under 60 chars",
  "meta_description": "translated meta description under 155 chars",
  "tags": ["translated", "tags", "keep-english-tech-terms"]
}`;

  const raw = await callAI(
    `You are a professional translator. Translate to ${targetName}. Respond with valid JSON only.`,
    prompt,
    5000
  );

  const parsed = parseJSON(raw);

  return {
    ...post,
    title: parsed.title,
    excerpt: parsed.excerpt,
    content: parsed.content,
    meta_title: parsed.meta_title,
    meta_description: parsed.meta_description,
    tags: parsed.tags || post.tags,
  };
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function saveBlogPost(post: GeneratedPost, locale: string = "en"): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("blog_posts").insert({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featured_image_url: post.featured_image_url,
    category: post.category,
    tags: post.tags,
    published: false,
    meta_title: post.meta_title,
    meta_description: post.meta_description,
    reading_time: post.reading_time,
    view_count: 0,
    locale,
  });

  if (error) throw new Error(`Supabase insert error (${locale}): ${error.message}`);
}

export async function generateAndSaveAllLocales(topic: TopicInput): Promise<string[]> {
  const saved: string[] = [];

  // 1. Generate English version
  const enPost = await generateBlogPost(topic);
  await saveBlogPost(enPost, "en");
  saved.push(`en: ${enPost.title}`);

  // 2. Translate and save each locale — same slug, different locale column
  for (const locale of LOCALES_TO_TRANSLATE) {
    try {
      const translated = await translateBlogPost(enPost, locale.code, locale.name);
      translated.slug = topic.slug; // same slug as English
      translated.featured_image_url = enPost.featured_image_url;
      await saveBlogPost(translated, locale.code);
      saved.push(`${locale.code}: ${translated.title}`);
    } catch (error) {
      console.error(`Failed to translate to ${locale.name}:`, error);
    }
  }

  return saved;
}
