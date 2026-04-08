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

export async function generateBlogPost(topic: TopicInput): Promise<GeneratedPost> {
  const apiKey = process.env.OPENROUTER_KEY;
  if (!apiKey) throw new Error("OPENROUTER_KEY not configured");

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
- End with a CTA linking to the rate calculator: "Get an instant quote at [awab.design/rate-calculator](/rate-calculator)"
- Start the post with: "*This article was drafted by AI and reviewed by the Awab Design team.*"

RESPOND IN THIS EXACT JSON FORMAT (no markdown wrapping):
{
  "excerpt": "150-character summary for previews",
  "content": "full markdown content here",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "meta_title": "SEO title under 60 chars",
  "meta_description": "SEO description under 155 chars",
  "reading_time": 7
}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://awab.design",
      "X-Title": "Awab Design Blog Generator",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional web design blog writer. Always respond with valid JSON only, no markdown code blocks." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content?.trim();

  if (!rawContent) throw new Error("No content returned from AI");

  // Parse JSON — handle potential markdown wrapping
  let cleaned = rawContent;
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(cleaned);

  // Fetch cover image from Pexels (allows automated use)
  let featured_image_url: string | undefined;
  const pexelsKey = process.env.PEXELS_API_KEY;
  if (pexelsKey) {
    try {
      const imgRes = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(topic.keywords[0])}&per_page=1&orientation=landscape`,
        { headers: { Authorization: pexelsKey } }
      );
      if (imgRes.ok) {
        const imgData = await imgRes.json();
        if (imgData.photos?.[0]?.src?.large2x) {
          featured_image_url = imgData.photos[0].src.large2x;
        }
      }
    } catch {
      // Skip image if Pexels fails
    }
  }

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

export async function saveBlogPost(post: GeneratedPost): Promise<void> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

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
  });

  if (error) throw new Error(`Supabase insert error: ${error.message}`);
}
