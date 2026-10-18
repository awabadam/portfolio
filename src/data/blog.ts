import { BlogPost, BlogCategory } from "../types";
import { and, asc, desc, eq, ilike, ne, or, arrayContains } from "drizzle-orm";
import { blogPosts, blogCategories } from "@/db/schema";

// The database client is imported lazily so builds without DATABASE_URL
// (where `@/db` throws on import) fall back to the static data below.
const getDb = async () => (await import("@/db")).db;

// Drizzle returns timestamps as Date objects; consumers expect ISO strings.
function serializeRow<T>(row: Record<string, unknown>): T {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, value instanceof Date ? value.toISOString() : value])
  ) as T;
}

const toBlogPosts = (rows: Record<string, unknown>[]): BlogPost[] => rows.map((row) => serializeRow<BlogPost>(row));

// Fallback blog posts data if the database is not available
export const fallbackBlogPosts: BlogPost[] = [
  {
    id: "medical-clinic-website-istanbul",
    title: "Why Your Istanbul Clinic Is Losing International Patients to Outdated Websites",
    slug: "medical-clinic-website-istanbul",
    excerpt: "Turkey's medical tourism market is worth $3.97 billion — but most Istanbul clinics are losing patients because of slow, monolingual WordPress sites. Here's what the 2M+ international patients actually look for in a clinic website, and how to build one that converts.",
    content: `
# Why Your Istanbul Clinic Is Losing International Patients to Outdated Websites

Istanbul is the medical tourism capital of the world. Turkey attracted over **2 million international patients** in 2025 across more than 120 countries. The market is worth **$3.97 billion** and growing at 15.6% per year. Istanbul alone is home to over 50 JCI-accredited clinics competing for this traffic.

And most of them are losing patients because of their websites.

I'm a freelance web designer in Istanbul, and I've worked with clinics like [Jouvence](/projects/jouvence) and [EsteExpert](/projects/esteexpert) to rebuild their sites into lead-generating machines. This article is the practical guide I wish every clinic owner in Istanbul had read before investing in their first (or fifth) website.

## The Problem: Your Website Is Judged in 3 Seconds

When a patient from Saudi Arabia, Germany, or Russia searches "rhinoplasty Istanbul" at 2am and lands on your clinic's website, they make a judgment in about 3 seconds:

1. **Does it load fast?** (Most clinics: no — 5 to 8 seconds on mobile)
2. **Does it speak my language?** (Most clinics: English only, or machine-translated Turkish)
3. **Can I contact the clinic right now?** (Most clinics: an email form buried three scrolls deep)
4. **Do the doctors look credentialed?** (Most clinics: blurry stock photos and vague bios)

If any of these answers is "no," the patient closes the tab and clicks the next result — which is usually a competitor clinic that did the basics right.

## What International Patients Actually Want

The biggest mistake Istanbul clinics make is treating their website like an English-language brochure. It's not. It's a **first appointment**. Here's what patients actually judge you on, based on research I did for the [clinic websites service page](/services):

### 1. Speed on Mobile

Over 70% of medical tourism searches happen on mobile phones — often on slow 4G connections in the patient's home country. If your site takes more than 3 seconds to show something meaningful, Google penalizes your mobile ranking AND the patient leaves before the page finishes loading.

The fastest clinic websites in Istanbul load in **under 1 second** on mobile. The slowest take **6 to 10 seconds**. Most clinics don't even know which category they're in because they only test on desktop broadband.

### 2. Their Actual Language (Not Google Translate)

A Saudi patient searching for hair transplants does not want to read a Google-translated paragraph in broken Arabic with left-to-right text flow. They want:

- Proper Arabic typography
- Right-to-left (RTL) layout
- Numbers and prices in their local format
- Doctor bios translated by a human, not a machine

The same goes for Russian, German, and French. **Machine translation is an insult** in medical contexts where trust is everything.

**What most clinics do:** Install a Google Translate widget. It shows broken text, breaks the layout, and signals "we don't care enough to hire a translator."

**What the top clinics do:** Build the site from scratch with proper multilingual infrastructure (like Next.js with \`next-intl\`), use professional medical translators, and maintain parallel content in each language with proper \`hreflang\` tags so Google knows which version to show to which user.

### 3. WhatsApp-First Contact

In the Middle East, WhatsApp is how business happens. Not email. Not contact forms. **WhatsApp.**

A clinic website with a prominent WhatsApp button on every treatment page will get 3 to 5 times more inquiries than one with a generic contact form. The best setup:

- WhatsApp button in the navigation (always visible)
- WhatsApp CTA on every treatment page, pre-filled with the treatment name
- WhatsApp sticky button on mobile scroll
- Response time commitment visible (e.g., "We reply in under 30 minutes")

I've seen clinics get more than 50% of their total inquiries through WhatsApp after switching from forms. The trick is making the button impossible to miss.

### 4. Before/After Galleries (With Privacy Controls)

For cosmetic and aesthetic clinics, before/after photos are the #1 conversion driver. But they're also legally sensitive — Turkish KVKK law has strict patient consent rules.

A good clinic website:

- Has a dedicated gallery page per treatment
- Blurs or greys out sensitive results by default, with a "click to view" reveal
- Watermarks images to prevent theft
- Tracks which galleries convert best with analytics

A bad clinic website uses stock photos or no photos at all — and loses patients to the competitor who invested in real results.

### 5. Doctor Credentials, Up Front

International patients don't trust clinics they've never heard of. They trust **doctors**. Your homepage should introduce the lead doctor in the first scroll, with:

- Full name and title
- Medical school and specialty training
- Years of experience
- Professional memberships (ISAPS, EAFPS, etc.)
- A photo that looks professional, not a selfie

This is also where **Schema.org Physician markup** matters: when Google sees structured doctor credentials in your HTML, it can surface them in rich search results — giving you a visual advantage over competitors in the search listing itself.

### 6. KVKK Compliance (Yes, It Actually Matters)

Turkey's data protection law (KVKK) has teeth. If your clinic website collects patient information without proper consent, cookie handling, and data processing notices, you're exposed to real legal risk — especially when treating international patients who might complain to their own data regulators.

The baseline every clinic website should have:

- Cookie consent banner with explicit opt-in
- Privacy policy in every supported language
- Data retention policy for contact form submissions
- Clear "who we share your data with" statement
- Patient consent checkbox on contact forms

This is not optional, and it's not a lawyer problem — it's a **web designer** problem. A clinic website that doesn't meet KVKK requirements was built by someone who didn't know what they were doing.

### 7. SEO Built for Treatment Keywords

Most clinic websites target terrible keywords like "best clinic in Istanbul." International patients don't search for that. They search for very specific treatments with very specific intent:

- "rhinoplasty Istanbul cost"
- "hair transplant Turkey recovery time"
- "dental implants Istanbul vs Antalya"
- "liposuction Istanbul reviews"

Each of these is a separate page on your website with:

- A title tag matching the query
- Pricing information (yes, put it on the page)
- Recovery time and aftercare
- What's included in the package (accommodation, translator, airport pickup)
- Real patient reviews
- A WhatsApp CTA at the top and bottom
- FAQ schema for common questions

A clinic that does this for 30 treatments — one page each — dominates the Istanbul medical tourism search space. A clinic that stuffs everything into a single "treatments" page gets nothing.

## Real Examples: Jouvence and EsteExpert

Both of these clinics are real case studies of clinic websites I built. They're not the same clinic, they're not the same size, and they took different approaches — but both illustrate what "building a clinic website correctly" looks like.

### [Jouvence](/projects/jouvence) — Premium Luxury Market

Jouvence is a high-end aesthetics clinic targeting international patients from the Middle East and Europe. The site is built with Next.js, fully multilingual (English, Turkish, Arabic), and uses WhatsApp as the primary contact channel.

**What makes it work:**

- Sub-1-second mobile load time (compared to 4-6 seconds for competitor clinics)
- Proper Arabic RTL support — not a retrofitted English site with a translate widget
- WhatsApp button on every treatment page with the treatment name pre-filled
- Doctor credentials prominently displayed on the homepage
- KVKK-compliant consent and analytics

### [EsteExpert](/projects/esteexpert) — Trust-First Medical Aesthetics

EsteExpert is a medical aesthetics clinic that needed to rebuild trust from zero with every new visitor. The site is built around credentials, before/after proof, and a consultation CTA that never leaves the viewport.

**What makes it work:**

- Hero designed around trust signals (certifications, doctor profiles, testimonials)
- Consultation CTA on every page, one tap away on mobile
- Treatment pages structured around patient search intent
- Schema markup so Google shows doctor info directly in search results
- Next.js for instant page transitions between treatments

You can see both sites on the [clinic websites service page](/services) and read the full case studies.

## What a Clinic Website Actually Costs

The biggest question clinic owners ask me is "how much?" Here's the honest answer based on what I charge and what competitors charge in Istanbul (as of 2026):

- **Basic clinic site (1-2 languages, 5-10 pages, WhatsApp + simple contact form):** $1,500-$2,500
- **Multilingual clinic site with booking (3-4 languages, 15+ treatment pages, consultation booking, doctor profiles):** $3,000-$5,000
- **Full multilingual clinic platform (4+ languages, custom booking, patient portal, CMS, AI chatbot):** $5,000-$10,000

These numbers are for custom Next.js sites — not WordPress templates. WordPress clinic themes cost $50-$200 but you'll spend the next two years fighting plugin conflicts, slow load times, and SEO issues. Every clinic I've worked with that had a WordPress template site ended up rebuilding from scratch within 18 months.

See the [full pricing breakdown](/pricing) for what's included at each tier.

## How to Pick a Web Designer for Your Clinic

If you're going to invest $3,000+ in a clinic website, here's the checklist I'd give my own family:

1. **Ask to see their last 3 clinic builds.** If they can't show you live, working clinic websites, they don't specialize in this.
2. **Check mobile speed on their own portfolio.** Open their designer's website on your phone. If it takes more than 3 seconds, run.
3. **Ask how they handle KVKK.** If they look confused, they'll leave you exposed.
4. **Ask about their multilingual approach.** If the answer involves Google Translate or WPML, walk away.
5. **Ask about ongoing maintenance.** A good designer stays for updates and security; a bad one disappears after launch.
6. **Ask for a fixed price.** Avoid "we'll see how it goes" quotes — they always go up.

I built the [clinic websites service](/services) specifically because most Istanbul clinics can't find a designer who gets all of this right. If you want to see if we're a fit, [get in touch](/contact) — the first audit is always free.

## The Bottom Line

Turkey's medical tourism market is massive and growing. The patients are there. The treatments are world-class. The competition is fierce.

The thing holding most Istanbul clinics back is not their doctors or their prices or their reviews. **It's their website.**

A fast, multilingual, WhatsApp-first clinic website built on modern technology like Next.js is no longer a nice-to-have — it's the minimum entry fee to compete for international patients in 2026. Clinics that invest in this now will own their search niche for the next 5 years. Clinics that don't will keep losing patients to competitors who did.

Ready to see what your current clinic website is actually costing you in lost patients? [Book a free audit](/contact) and I'll show you exactly where you're bleeding leads — and what it would cost to fix.
    `,
    featured_image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2070&auto=format&fit=crop",
    category: "Web Design",
    tags: ["medical clinic website", "clinic website design istanbul", "medical tourism", "multilingual website", "health tourism turkey", "next.js clinic", "aesthetic clinic website", "hair transplant clinic"],
    published: true,
    published_at: "2026-04-09T18:00:00Z",
    created_at: "2026-04-09T18:00:00Z",
    updated_at: "2026-04-09T18:00:00Z",
    meta_title: "Medical Clinic Website Design Istanbul: The Complete Guide (2026)",
    meta_description: "Istanbul clinics are losing millions in international patients to slow, monolingual websites. Here's what a clinic website needs in 2026 to rank on Google and convert — with real case studies.",
    reading_time: 14,
    view_count: 0
  }
];

export const fallbackBlogCategories: BlogCategory[] = [
  {
    id: "web-design",
    name: "Web Design",
    slug: "web-design",
    description: "Articles about web design principles, trends, and best practices",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    slug: "ui-ux-design",
    description: "User interface and user experience design insights",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    slug: "graphic-design",
    description: "Graphic design tips, tutorials, and inspiration",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "seo",
    name: "SEO",
    slug: "seo",
    description: "Search engine optimization guides and tips",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "freelancing",
    name: "Freelancing",
    slug: "freelancing",
    description: "Freelance design and development advice",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

export const getBlogPostBySlug = async (slug: string, locale: string = 'en'): Promise<BlogPost | undefined> => {
  try {
    const db = await getDb();
    const findPost = (postLocale: string) =>
      db
        .select()
        .from(blogPosts)
        .where(and(eq(blogPosts.slug, slug), eq(blogPosts.locale, postLocale), eq(blogPosts.published, true)))
        .limit(1);

    // Try locale-specific version first, fall back to English
    let [data] = await findPost(locale);

    if (!data && locale !== 'en') {
      // Fall back to English version
      [data] = await findPost('en');
    }
    
    if (!data) {
      console.log(`⚠️ No published post found for slug "${slug}", checking fallback data`);
      return fallbackBlogPosts.find(post => post.slug === slug);
    }
    
    console.log(`✅ Successfully fetched blog post: ${data.title}`);
    return serializeRow<BlogPost>(data);
  } catch (error) {
    console.error(`❌ Error in getBlogPostBySlug for slug "${slug}":`, error);
    console.log('🔄 Falling back to static data');
    return fallbackBlogPosts.find(post => post.slug === slug);
  }
};

export const getAllBlogPosts = async (locale: string = 'en'): Promise<BlogPost[]> => {
  try {
    const db = await getDb();
    const findPosts = (postLocale: string) =>
      db
        .select()
        .from(blogPosts)
        .where(and(eq(blogPosts.published, true), eq(blogPosts.locale, postLocale)))
        .orderBy(desc(blogPosts.published_at));

    // Get posts for locale, fall back to English posts that don't have a translation
    let data = await findPosts(locale);

    if (data.length === 0 && locale !== 'en') {
      // Fall back to English posts
      data = await findPosts('en');
    }
    
    if (data.length === 0) {
      console.log('⚠️ No published posts found in database, using fallback data');
      return fallbackBlogPosts;
    }
    
    console.log(`✅ Successfully fetched ${data.length} blog posts from the database`);
    return toBlogPosts(data);
  } catch (error) {
    console.error('❌ Error in getAllBlogPosts:', error);
    console.log('🔄 Falling back to static data');
    return fallbackBlogPosts;
  }
};

export const getFeaturedBlogPosts = async (count: number = 3, locale: string = 'en'): Promise<BlogPost[]> => {
  try {
    const db = await getDb();
    const data = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.published, true), eq(blogPosts.locale, locale)))
      .orderBy(desc(blogPosts.view_count))
      .limit(count);
    
    if (data.length === 0) {
      console.log('⚠️ No featured posts found in database, using fallback data');
      return fallbackBlogPosts.slice(0, count);
    }
    
    console.log(`✅ Successfully fetched ${data.length} featured blog posts from the database`);
    return toBlogPosts(data);
  } catch (error) {
    console.error('❌ Error in getFeaturedBlogPosts:', error);
    console.log('🔄 Falling back to static data');
    return fallbackBlogPosts.slice(0, count);
  }
};

export const getBlogPostsByCategory = async (category: string, locale: string = 'en'): Promise<BlogPost[]> => {
  try {
    const db = await getDb();
    const findPosts = (postLocale: string) =>
      db
        .select()
        .from(blogPosts)
        .where(and(eq(blogPosts.published, true), eq(blogPosts.category, category), eq(blogPosts.locale, postLocale)))
        .orderBy(desc(blogPosts.published_at));

    let data = await findPosts(locale);

    if (data.length === 0 && locale !== 'en') {
      data = await findPosts('en');
    }

    return toBlogPosts(data);
  } catch (error) {
    console.error('Error in getBlogPostsByCategory:', error);
    return fallbackBlogPosts.filter(post => post.category === category);
  }
};

export const getAllBlogCategories = async (): Promise<BlogCategory[]> => {
  try {
    const db = await getDb();
    const data = await db
      .select()
      .from(blogCategories)
      .orderBy(asc(blogCategories.name));
    
    return data.map((row) => serializeRow<BlogCategory>(row));
  } catch (error) {
    console.error('Error in getAllBlogCategories:', error);
    return fallbackBlogCategories;
  }
};

export async function getRelatedPosts(
  currentSlug: string,
  category: string,
  limit: number = 3
): Promise<BlogPost[]> {
  try {
    const db = await getDb();
    const data = await db
      .select()
      .from(blogPosts)
      .where(and(ne(blogPosts.slug, currentSlug), eq(blogPosts.category, category), eq(blogPosts.published, true)))
      .orderBy(desc(blogPosts.published_at))
      .limit(limit);

    return toBlogPosts(data);
  } catch {
    return fallbackBlogPosts
      .filter((p) => p.slug !== currentSlug && p.category === category)
      .slice(0, limit);
  }
}

export const searchBlogPosts = async (query: string, locale: string = 'en'): Promise<BlogPost[]> => {
  try {
    const db = await getDb();
    const data = await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.published, true),
          eq(blogPosts.locale, locale),
          or(
            ilike(blogPosts.title, `%${query}%`),
            ilike(blogPosts.content, `%${query}%`),
            arrayContains(blogPosts.tags, [query])
          )
        )
      )
      .orderBy(desc(blogPosts.published_at));
    
    return toBlogPosts(data);
  } catch (error) {
    console.error('Error in searchBlogPosts:', error);
    return fallbackBlogPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
}; 
