# SEO Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every SEO gap identified from Google's SEO Starter Guide audit — structured data, metadata, alt text, sitemap accuracy, and internal linking.

**Architecture:** 8 independent tasks, each targeting one specific SEO gap. Tasks 1-6 are pure code changes. Task 7 is a sitemap data fix. Task 8 adds a new component (RelatedPosts). No new dependencies needed.

**Tech Stack:** Next.js (App Router), TypeScript, next-intl, schema.org JSON-LD

---

## File Map

| Task | Files | Action |
|------|-------|--------|
| 1 | `src/components/seo/ArticleSchema.tsx` | Create |
| 1 | `src/app/[locale]/blog/[slug]/page.tsx` | Modify |
| 2 | `src/app/[locale]/services/page.tsx` | Modify (extract metadata) |
| 2 | `src/app/[locale]/services/layout.tsx` | Create (server layout with metadata) |
| 3 | `src/components/seo/CreativeWorkSchema.tsx` | Create |
| 3 | `src/app/[locale]/projects/[project]/page.tsx` | Modify |
| 4 | `src/components/layout/BackgroundHero.tsx` | Modify |
| 4 | `src/components/layout/PageHero.tsx` | Modify |
| 4 | `src/components/Header.tsx` | Modify |
| 5 | `src/components/blog/RelatedPosts.tsx` | Create |
| 5 | `src/app/[locale]/blog/[slug]/page.tsx` | Modify |
| 5 | `src/data/blog.ts` | Modify (add getRelatedPosts) |
| 6 | `src/app/[locale]/rate-calculator/layout.tsx` | Modify |
| 7 | `src/app/sitemap.ts` | Modify |

---

### Task 1: Article JSON-LD for Blog Posts

Blog posts have OG article metadata but no `Article` structured data. This is the highest-impact gap — enables rich results with author, date, and reading time in Google Search.

**Files:**
- Create: `src/components/seo/ArticleSchema.tsx`
- Modify: `src/app/[locale]/blog/[slug]/page.tsx:102-108`

- [ ] **Step 1: Create ArticleSchema component**

```tsx
// src/components/seo/ArticleSchema.tsx
interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedTime: string;
  modifiedTime: string;
  authorName: string;
  tags: string[];
  wordCount?: number;
}

export default function ArticleSchema({
  title,
  description,
  url,
  imageUrl,
  publishedTime,
  modifiedTime,
  authorName,
  tags,
  wordCount,
}: ArticleSchemaProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `https://www.awab.design${url}`,
    image: imageUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    wordCount,
    author: {
      "@type": "Person",
      name: authorName,
      url: "https://www.awab.design",
    },
    publisher: {
      "@type": "Person",
      name: "Awab Design",
      url: "https://www.awab.design",
      logo: {
        "@type": "ImageObject",
        url: "https://www.awab.design/img/hero-image.jpg",
      },
    },
    keywords: tags.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.awab.design${url}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

- [ ] **Step 2: Add ArticleSchema to blog post page**

In `src/app/[locale]/blog/[slug]/page.tsx`, add the import and render the component right after `<Breadcrumbs>`:

```tsx
import ArticleSchema from "@/components/seo/ArticleSchema";
```

Then inside the return, after the `<Breadcrumbs>` component (line ~108):

```tsx
<ArticleSchema
  title={post.title}
  description={post.meta_description || post.excerpt}
  url={`/blog/${post.slug}`}
  imageUrl={post.featured_image_url}
  publishedTime={post.published_at || post.created_at}
  modifiedTime={post.updated_at}
  authorName="Awab Elkhalil"
  tags={post.tags}
/>
```

- [ ] **Step 3: Verify JSON-LD renders**

Run: `npm run dev`

Open a blog post in browser, view page source, search for `"@type":"Article"`. Confirm the JSON-LD script tag is present with correct data.

- [ ] **Step 4: Commit**

```bash
git add src/components/seo/ArticleSchema.tsx src/app/\[locale\]/blog/\[slug\]/page.tsx
git commit -m "feat(seo): add Article JSON-LD schema to blog posts"
```

---

### Task 2: Services Page Metadata

`/services` is a `"use client"` component with no `generateMetadata`. Google sees no title/description for this page. Fix: add a server-side layout that provides metadata.

**Files:**
- Create: `src/app/[locale]/services/layout.tsx`

- [ ] **Step 1: Create services layout with metadata**

```tsx
// src/app/[locale]/services/layout.tsx
import { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.services");
  const locale = await getLocale();
  const ogLocale =
    locale === "ar" ? "ar_SA" : locale === "tr" ? "tr_TR" : locale === "fr" ? "fr_FR" : "en_US";

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://www.awab.design/services",
      locale: ogLocale,
    },
    alternates: {
      canonical: "/services",
      languages: {
        en: "/services",
        ar: "/ar/services",
        tr: "/tr/services",
        fr: "/fr/services",
      },
    },
  };
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

- [ ] **Step 2: Verify translations key exists**

Check that `metadata.services.title` and `metadata.services.description` exist in translation files. If not, add them:

```json
{
  "metadata": {
    "services": {
      "title": "Services",
      "description": "Web design, development, brand identity, SEO, and AI chatbot integration services by Awab Design in Istanbul."
    }
  }
}
```

Check all 4 locale files: `messages/en.json`, `messages/ar.json`, `messages/tr.json`, `messages/fr.json`.

- [ ] **Step 3: Verify metadata renders**

Run: `npm run dev`

Navigate to `/services`, view page source. Confirm `<title>` contains the services title and `<meta name="description">` is present.

- [ ] **Step 4: Commit**

```bash
git add src/app/\[locale\]/services/layout.tsx messages/
git commit -m "feat(seo): add metadata to services page via layout"
```

---

### Task 3: CreativeWork JSON-LD for Project Pages

Project detail pages have no structured data. Add `CreativeWork` schema to help Google understand portfolio pieces.

**Files:**
- Create: `src/components/seo/CreativeWorkSchema.tsx`
- Modify: `src/app/[locale]/projects/[project]/page.tsx:66-75`

- [ ] **Step 1: Create CreativeWorkSchema component**

```tsx
// src/components/seo/CreativeWorkSchema.tsx
interface CreativeWorkSchemaProps {
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  technologies?: string[];
  category?: string;
}

export default function CreativeWorkSchema({
  name,
  description,
  url,
  imageUrl,
  technologies,
  category,
}: CreativeWorkSchemaProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url: `https://www.awab.design${url}`,
    image: imageUrl,
    creator: {
      "@type": "Person",
      name: "Awab Elkhalil",
      url: "https://www.awab.design",
    },
    genre: category,
    keywords: technologies?.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

- [ ] **Step 2: Add CreativeWorkSchema to project detail page**

In `src/app/[locale]/projects/[project]/page.tsx`, add import and render after `<Breadcrumbs>`:

```tsx
import CreativeWorkSchema from "@/components/seo/CreativeWorkSchema";
```

Inside the return (after `<Breadcrumbs>` at ~line 72):

```tsx
<CreativeWorkSchema
  name={project.title}
  description={project.description}
  url={`/projects/${project.id}`}
  imageUrl={project.featured_image_url}
  technologies={project.technologies}
  category={project.category}
/>
```

Note: Check if the `Project` type has `featured_image_url`. If not, use the first image from `project.images` or omit.

- [ ] **Step 3: Verify JSON-LD renders**

Run: `npm run dev`

Open a project page, view source, search for `"@type":"CreativeWork"`.

- [ ] **Step 4: Commit**

```bash
git add src/components/seo/CreativeWorkSchema.tsx src/app/\[locale\]/projects/\[project\]/page.tsx
git commit -m "feat(seo): add CreativeWork JSON-LD schema to project pages"
```

---

### Task 4: Fix Generic Alt Text

Google's guide: alt text should describe the image content, not be generic. Current offenders:
- `BackgroundHero.tsx`: `alt="Background"` 
- `PageHero.tsx`: `alt="Hero Image"`
- `Header.tsx`: `alt="hero-img"`

**Files:**
- Modify: `src/components/layout/BackgroundHero.tsx:48`
- Modify: `src/components/layout/PageHero.tsx:220`
- Modify: `src/components/Header.tsx:37`

- [ ] **Step 1: Fix BackgroundHero alt text**

In `src/components/layout/BackgroundHero.tsx`, the `alt` prop should use the `title` prop that's already available:

Change line 48 from:
```tsx
alt="Background"
```
to:
```tsx
alt={`Background for ${title}`}
```

- [ ] **Step 2: Fix PageHero alt text**

In `src/components/layout/PageHero.tsx`, line 220:

Change from:
```tsx
alt="Hero Image"
```
to:
```tsx
alt={`${title} — Awab Design`}
```

- [ ] **Step 3: Fix Header alt text**

In `src/components/Header.tsx`, line 37:

Change from:
```tsx
alt="hero-img"
```
to:
```tsx
alt="Awab Elkhalil — Web Designer & Developer"
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/BackgroundHero.tsx src/components/layout/PageHero.tsx src/components/Header.tsx
git commit -m "fix(seo): replace generic image alt text with descriptive alternatives"
```

---

### Task 5: Related Posts for Blog Internal Linking

Google's guide emphasizes linking to relevant resources. Blog posts currently don't link to related content. Add a RelatedPosts section below each post.

**Files:**
- Modify: `src/data/blog.ts` (add `getRelatedPosts` function)
- Create: `src/components/blog/RelatedPosts.tsx`
- Modify: `src/app/[locale]/blog/[slug]/page.tsx`

- [ ] **Step 1: Add getRelatedPosts to data layer**

In `src/data/blog.ts`, add this function (place it after `getBlogPostBySlug`):

```typescript
export async function getRelatedPosts(
  currentSlug: string,
  category: string,
  limit: number = 3
): Promise<BlogPost[]> {
  const supabase = createStaticSupabaseClient();
  if (!supabase) {
    return fallbackBlogPosts
      .filter((p) => p.slug !== currentSlug && p.category === category)
      .slice(0, limit);
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .neq("slug", currentSlug)
    .eq("category", category)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return fallbackBlogPosts
      .filter((p) => p.slug !== currentSlug && p.category === category)
      .slice(0, limit);
  }

  return data;
}
```

- [ ] **Step 2: Create RelatedPosts component**

```tsx
// src/components/blog/RelatedPosts.tsx
import { Link } from "@/i18n/routing";
import { BlogPost } from "@/types";
import Image from "next/image";

interface RelatedPostsProps {
  posts: BlogPost[];
  heading: string;
}

export default function RelatedPosts({ posts, heading }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-16">
      <h2 className="mb-8 font-display text-2xl font-bold">{heading}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-xl border border-border/40 overflow-hidden transition-all hover:border-primary/30 hover:shadow-md"
          >
            {post.featured_image_url && (
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={post.featured_image_url}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-display font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire RelatedPosts into blog post page**

In `src/app/[locale]/blog/[slug]/page.tsx`:

Add imports:
```tsx
import { getBlogPostBySlug, getAllBlogPosts, getRelatedPosts } from "@/data/blog";
import RelatedPosts from "@/components/blog/RelatedPosts";
```

Inside `BlogPostPage`, after fetching the post (around line 88):
```tsx
const relatedPosts = await getRelatedPosts(post.slug, post.category, 3);
```

Then place the component inside the content container, after the share button section (after `<BlogCTA />`):
```tsx
<RelatedPosts posts={relatedPosts} heading={t('relatedPosts')} />
```

- [ ] **Step 4: Add translation key**

Add `"relatedPosts": "Related Articles"` to the `blog` namespace in all 4 locale files.

- [ ] **Step 5: Verify**

Run: `npm run dev`

Open a blog post. Confirm related posts section appears below the CTA with clickable links.

- [ ] **Step 6: Commit**

```bash
git add src/data/blog.ts src/components/blog/RelatedPosts.tsx src/app/\[locale\]/blog/\[slug\]/page.tsx messages/
git commit -m "feat(seo): add related posts section to blog for internal linking"
```

---

### Task 6: Add OG Image to Rate Calculator

The rate-calculator layout has JSON-LD but no OG image configured. Every shareable page should have one.

**Files:**
- Modify: `src/app/[locale]/rate-calculator/layout.tsx:7-13`

- [ ] **Step 1: Extend rate-calculator metadata**

In `src/app/[locale]/rate-calculator/layout.tsx`, expand the `generateMetadata` return:

```tsx
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.rateCalculator");
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://www.awab.design/rate-calculator",
      images: [
        {
          url: "/img/hero-image.jpg",
          width: 1200,
          height: 630,
          alt: "Awab Design — Rate Calculator",
        },
      ],
    },
    alternates: {
      canonical: "/rate-calculator",
      languages: {
        en: "/rate-calculator",
        ar: "/ar/rate-calculator",
        tr: "/tr/rate-calculator",
        fr: "/fr/rate-calculator",
      },
    },
  };
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`

View page source on `/rate-calculator`, confirm `og:image` meta tag is present.

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/rate-calculator/layout.tsx
git commit -m "feat(seo): add OG image and canonical to rate-calculator page"
```

---

### Task 7: Fix Sitemap Accuracy

Two issues:
1. Static pages use `lastModified: new Date()` — this tells Google every page changed *right now* every time the sitemap is generated. Google recommends accurate dates.
2. `clinic-websites` service is missing from the sitemap service list.

**Files:**
- Modify: `src/app/sitemap.ts:17,36`

- [ ] **Step 1: Fix lastModified for static pages**

In `src/app/sitemap.ts`, change the `withAlternates` function. Replace `lastModified: new Date()` with a fixed date representing the last known deployment/update:

```typescript
function withAlternates(path: string, opts: { changeFrequency: 'weekly' | 'monthly' | 'daily'; priority: number; lastModified?: Date }) {
  return locales.map((locale) => ({
    url: localeUrl(path, locale),
    lastModified: opts.lastModified ?? new Date('2026-04-16'),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, localeUrl(path, l)])
      ),
    },
  }))
}
```

Note: `2026-04-16` is today's date. Update this value whenever significant content changes are deployed. For pages that update frequently (blog listing, home), you can pass a more recent date.

- [ ] **Step 2: Add clinic-websites to sitemap**

On line 36, add `'clinic-websites'` to the services slug array:

```typescript
...['webdesign-istanbul', 'ai-chatbot-integration', 'brand-identity', 'website-maintenance', 'clinic-websites'].flatMap(
```

- [ ] **Step 3: Verify**

Run: `npm run dev`

Open `http://localhost:3000/sitemap.xml`. Confirm:
- Static pages no longer show the current timestamp
- `clinic-websites` URLs appear in the sitemap

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "fix(seo): use stable lastModified dates in sitemap, add missing clinic-websites"
```

---

### Task 8: Add Breadcrumbs to Services Page

The main `/services` page has no breadcrumbs, unlike other pages. Add them for consistency and structured data.

**Files:**
- Modify: `src/app/[locale]/services/layout.tsx` (the layout created in Task 2)

- [ ] **Step 1: Add Breadcrumbs to services layout**

Update the layout created in Task 2:

```tsx
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
      ]} />
      {children}
    </>
  );
}
```

Note: This will also give breadcrumbs to sub-service pages, but those already have their own breadcrumbs. Check that this doesn't double-up. If sub-service pages have their own `<Breadcrumbs>`, remove them from the sub-service pages, OR only add breadcrumbs on the services `page.tsx` instead of the layout. The implementer should check for double breadcrumbs.

- [ ] **Step 2: Verify**

Run: `npm run dev`

Navigate to `/services`, view page source, confirm `BreadcrumbList` JSON-LD is present.

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/services/layout.tsx
git commit -m "feat(seo): add breadcrumb schema to services page"
```

---

## Execution Order

Tasks are independent and can be parallelized:
- **Parallel group A** (schema tasks): Task 1, Task 3 (no shared files)
- **Parallel group B** (metadata tasks): Task 2, Task 6 (no shared files)
- **Sequential**: Task 8 depends on Task 2 (uses the layout created in Task 2)
- **Independent**: Tasks 4, 5, 7 can run anytime

Recommended order: `[1, 2, 3, 4, 5, 6, 7, 8]` — Task 8 must follow Task 2.
