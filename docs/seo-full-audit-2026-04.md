# Full SEO Audit & Recommendations
## Awab Design | awab.design
**Date:** 2026-04-16
**Sources:** Google Search Central docs, Neil Patel (blog + video), site codebase audit

---

## Table of Contents

1. [Current Implementation Status](#1-current-implementation-status)
2. [Gaps vs Google Requirements](#2-gaps-vs-google-requirements)
3. [Neil Patel Blog Recommendations](#3-neil-patel-blog-recommendations)
4. [Neil Patel Video — "The New Google Playbook" (2026-04-16)](#4-neil-patel-video--the-new-google-playbook)
5. [Consolidated Action Plan](#5-consolidated-action-plan)

---

## 1. Current Implementation Status

### What's Already Strong

| Area | Coverage | Key Files |
|------|----------|-----------|
| **Structured Data (8 types)** | Person, WebSite, SiteNav, Article, Breadcrumb, FAQ, CreativeWork, Service/OfferCatalog | `layout.tsx`, `src/components/seo/*` |
| **Metadata** | All 16+ pages with generateMetadata, title templates, descriptions, keywords | Per-page `page.tsx` and `layout.tsx` |
| **OpenGraph + Twitter** | All pages with OG images (4 dynamic via next/og), twitter cards | Root + per-page metadata |
| **Sitemap** | Dynamic XML with hreflang for 4 locales, static + blog + projects | `src/app/sitemap.ts` |
| **Robots.txt** | Environment-aware (blocks preview deploys) | `src/app/robots.ts` |
| **Canonical URLs** | Every page + hreflang alternates (en/ar/tr/fr) | Metadata `alternates` |
| **Favicons** | SVG with dark mode support + manifest.json | `src/app/icon.svg`, `public/manifest.json` |
| **Performance** | Font swap, next/image, tree-shaking (lucide/framer/radix), critical CSS inlining, preconnect, compression | `next.config.js`, `layout.tsx` |
| **Mobile** | Viewport + viewportFit cover, responsive Tailwind, dark mode | `layout.tsx` viewport config |
| **Internal Linking** | Navbar (6 links), footer, breadcrumbs, CTAs, related posts | `Navbar.tsx`, `Footer.tsx` |
| **Analytics** | GTM + GA4 with custom event tracking | `layout.tsx`, `src/lib/analytics/gtm.ts` |
| **i18n SEO** | 4 locales with hreflang, per-locale metadata, canonical tracking | `src/i18n/routing.ts` |
| **Security** | HTTPS enforced, poweredByHeader disabled, robots blocks admin/api | `next.config.js`, `robots.ts` |

### Structured Data Detail

- **Root layout** (`layout.tsx:194-310`): Person+ProfessionalService (name, jobTitle, email, phone, image, sameAs, address, areaServed, knowsLanguage, knowsAbout, priceRange, makesOffer x3 tiers, aggregateRating 5.0/4 reviews, speakable), WebSite (multilingual), SiteNavigationElement (6 links)
- **ArticleSchema** (`src/components/seo/ArticleSchema.tsx`): headline, description, url, image, dates, wordCount, author, publisher, keywords
- **Breadcrumbs** (`src/components/seo/Breadcrumbs.tsx`): On contact, about, blog posts, project details, clinic-websites
- **FAQSchema** (`src/components/seo/FAQSchema.tsx`): On services, pricing, clinic-websites
- **CreativeWorkSchema** (`src/components/seo/CreativeWorkSchema.tsx`): On project detail pages
- **Service/OfferCatalog**: On pricing layout, rate-calculator layout, clinic-websites page

### Page Inventory (16 unique routes, all x4 locales)

Home, About, Blog Index, Blog Post (dynamic), Blog Category (dynamic), Projects, Project Detail (dynamic), Services, 5 Service Sub-pages (webdesign-istanbul, ai-chatbot-integration, brand-identity, website-maintenance, clinic-websites), Pricing, Rate Calculator, Contact, Thank You

---

## 2. Gaps vs Google Requirements

### HIGH IMPACT

#### 2a. LocalBusiness Schema (dedicated entity)
**Problem:** ProfessionalService exists on Person entity, but Google requires a dedicated LocalBusiness entity with full address, geo coordinates (5+ decimal lat/lng), openingHoursSpecification, and telephone for rich business results.
**Why:** Directly connects to GBP listing. Triggers rich results with hours, directions, ratings.
**Action:** Add dedicated LocalBusiness/ProfessionalService JSON-LD with complete address + geo + hours.

#### 2b. ProfilePage Schema on About Page
**Problem:** About page has metadata but no ProfilePage JSON-LD.
**Why:** Google supports ProfilePage for creator profiles — enhances how your profile appears in search and "Discussions and Forums" features.
**Required:** `mainEntity` -> Person with name, image, sameAs, description.

#### 2c. Missing Breadcrumbs on Several Pages
**Problem:** Breadcrumbs exist on contact, about, blog posts, project details, clinic-websites. Missing on: services index, pricing, rate-calculator, projects index, blog index, other service sub-pages.
**Why:** Google shows breadcrumb trails in search results — more coverage = better CTR.

#### 2d. Manifest Icons May Not Exist
**Problem:** `manifest.json` references `/icon-192x192.png` and `/icon-512x512.png` — may not exist in `/public/`.
**Why:** Google requires stable, crawlable favicon files. Missing icons = missed branding in search.

### MEDIUM IMPACT

#### 2e. Privacy Policy & Terms Pages Missing
**Problem:** No privacy policy or terms of service pages visible.
**Why:** Trust signal for E-E-A-T. Google Quality Raters check for these on commercial sites.

#### 2f. Blog Author -> ProfilePage Chain
**Problem:** ArticleSchema has author as Person with name/url, but author URL should link to a page with ProfilePage schema.
**Why:** Creates a chain of trust that Google uses for E-E-A-T assessment.

#### 2g. Image Creator Metadata
**Problem:** No ImageObject schema with creator, creditText, copyrightNotice on portfolio images.
**Why:** Establishes ownership in Google Image Search results.

#### 2h. `alternateName` on WebSite Schema
**Problem:** No fallback site names configured.
**Action:** Add `["Awab Elkhalil", "awab.design"]` as alternateName.

### LOW IMPACT / CLEANUP

#### 2i. FAQ Rich Results Limited
**Reality:** FAQ rich results now restricted to government/health sites. Keep schema for semantic value but don't expect visual results.

#### 2j. Speakable Schema Ineffective
**Reality:** Only supported for news publishers. Consider removing to keep schema clean.

#### 2k. Security Headers Missing
**Problem:** No CSP, X-Frame-Options, or HSTS visible in next.config.
**Note:** Not a direct ranking factor, but contributes to trust signals.

---

## 3. Neil Patel Blog Recommendations

### PRIORITY 1: High-Impact Opportunities

#### 3a. "Striking Distance" Keywords
Mine Google Search Console for queries ranking positions 11-20. These are low-hanging fruit — minor content updates can push them to page 1. Do this for all 4 languages.

#### 3b. "People Also Ask" Mining
Search target keywords in each language, capture PAA questions. Use as H2s in existing content or standalone blog posts. Tool: AlsoAsked.com.

#### 3c. E-E-A-T Signal Strengthening
- Add detailed author bios with credentials on every blog post
- Link to authoritative sources from content
- Display certifications, media mentions, endorsements
- Visible contact info, privacy policy, terms of use

#### 3d. Unlinked Brand Mention Outreach
Use Google Alerts / Brand24 to find mentions of "Awab Design" or "Awab Elkhalil" without backlinks. Request link additions.

#### 3e. Original Visual Content & Infographics
Create original infographics: "Cost of Web Design in Turkey", "Website ROI Calculator", "Web Design Process Timeline". Use WebP, add image sitemaps, descriptive alt text and filenames.

### PRIORITY 2: Content & On-Page

#### 3f. Keyword Cannibalization Audit
Map every URL to its primary keyword. Ensure no two pages compete for the same term. Consolidate overlapping pages into pillar content. Risk area: `/services` vs `/services/webdesign-istanbul`.

#### 3g. "Time to Value" Optimization
Inverted pyramid style — key takeaways at top of blog posts. Clear scannable headings + bullets. FAQ sections at bottom.

#### 3h. Search Intent Alignment
Map pages to intent types:
- **Transactional:** Service pages (lead with pricing, portfolio, CTAs)
- **Informational:** Blog posts
- **Commercial investigation:** Portfolio/projects page

#### 3i. Internal Linking Strategy
Audit for orphaned content. Link blog posts to service pages with keyword-rich anchors ("web design services in Istanbul" not "click here"). Hub-and-spoke model: service pages as hubs, blog posts as spokes.

### PRIORITY 3: Technical

#### 3j. Crawl Budget Optimization
Already handled: robots.txt blocks /admin, /login, /api, /thank-you. Verify no other low-value pages waste crawl budget.

#### 3k. URL Parameter Management
Audit for query parameter variations that create duplicate content. Use canonical tags where variants exist.

#### 3l. Quarterly Technical Audits
Schedule: crawlability, broken links, Core Web Vitals, duplicate content, schema validation, mobile check.

### PRIORITY 4: Link Building

#### 3m. Directory Submissions
Clutch, DesignRush, GoodFirms, UpCity, Turkish business directories. Consistent NAP across all. (Details in `docs/seo-checklist.md`)

#### 3n. Guest Blogging
Pitch articles on web design/tech blogs and Istanbul business publications. Topics: Next.js development, multilingual web design, clinic websites, AI chatbot integration.

#### 3o. Original Research & Case Studies
Publish detailed case studies with real metrics. Conduct original research (e.g., web design pricing survey in Turkey). Natural backlink magnets.

#### 3p. Testimonial Writing for Backlinks
Write testimonials for tools you use (Vercel, design tools). Published testimonials include your name + hyperlink.

#### 3q. Fix Broken Backlinks
Use Ahrefs or GSC to find broken external links to your site. Set up 301 redirects for moved/deleted pages.

### PRIORITY 5: Local SEO

#### 3r. GBP Optimization
Complete all fields, regular Google Posts, respond to all reviews, enable Q&A, services list, booking links. (Details in `docs/seo-checklist.md`)

#### 3s. NAP Consistency
Audit all directories, social profiles, website pages for identical Name, Address, Phone formatting.

#### 3t. Localized Content
Istanbul-specific blog content: "Why Istanbul businesses need bilingual websites", "Web design trends in Turkey 2026". Geo-keywords in content and metadata.

#### 3u. Reviews Campaign
Target 1-2 reviews per month on GBP. Currently have 4 in structured data — need more.

### PRIORITY 6: Emerging

#### 3v. AI Search Optimization
Structure content in Q&A format for AI extraction. Comprehensive structured data. Monitor brand appearance in ChatGPT, Perplexity, Google AI Overviews.

#### 3w. Search Everywhere Optimization
Optimize for Bing, YouTube, social media search. Keyword-optimize social profiles.

#### 3x. Content Pruning
Audit blog posts with minimal traffic. Substantially improve or remove/consolidate underperformers.

---

## 4. Neil Patel Video — "The New Google Playbook" (2026-04-16)

**Source:** https://www.youtube.com/watch?v=5Vk0pUUcVJI (11m23s)

### Core Thesis
Google broke the wall between SEO and paid ads. Google's AI (Performance Max, AI Max, AI Overviews) uses your **entire website** as raw material to generate ads, summaries, and search results. Website quality now impacts both organic rankings AND paid ad performance.

### The 8 Things You Must Fix

#### Fix 1: Website Speed
- All pages through PageSpeed Insights, fix slow performers
- Target: under 2 seconds load time
- Core Web Vitals are a direct ranking AND bidding signal
- Conversion rates influence Smart Bidding algorithm — slow pages = higher ad costs
- **Our status:** Good foundation (font swap, image optimization, critical CSS, tree-shaking). Need to verify actual field data in PSI/GSC.

#### Fix 2: Headline and Copy Clarity
- Rewrite vague headlines ("Our Solutions") into specific, conversion-focused messaging
- Google's AI literally pulls page text to generate ad copy — poor headlines produce bad auto-generated ads
- AI Max's Text Customization uses site content as direct source material
- Cover different angles: benefits, offers, urgency, brand authority, social proof
- **Our status:** Need to audit all page headlines for specificity and conversion focus.

#### Fix 3: Real Images and Video Assets
- Add authentic 15-32 second videos and genuine product photos
- Without quality visuals, Performance Max auto-generates low-quality replacements branded with your name
- Need: brand logo (square + landscape), 15-20 high-res product/lifestyle images, 2-5 videos (even 15-second clips)
- **Our status:** Have hero image and project screenshots. Missing: short video content, more authentic lifestyle/process images.

#### Fix 4: Product Feed Optimization
- Complete ALL product data fields: brand, color, size, materials, GTINs
- **Our status:** Not e-commerce — less relevant. But service offerings in structured data should be complete with all fields.

#### Fix 5: Schema Markup Implementation
- Add structured data to top 5 conversion pages minimum
- Enables richer ad extensions (ratings, pricing, FAQs, sitelinks)
- Implement: Product, Service, FAQ, HowTo, Review
- Schema feeds Performance Max with text for auto-generated headlines/descriptions
- **Our status:** Strong — 8 schema types already. Gaps: LocalBusiness, ProfilePage, broader breadcrumb coverage.

#### Fix 6: Pillar Page Strategy (Content Consolidation)
- Consolidate 20-30 similar thin posts into one comprehensive deep-dive page
- One strong pillar page outperforms 15+ scattered posts
- Prevents Google's AI from selecting wrong landing page (Final URL Expansion)
- Build with clear sections, table of contents, cover every angle
- **Topical authority is now the strongest on-page ranking factor**
- **Our status:** Blog is still young. As content grows, consolidate into pillar pages per topic. Service pages should each be comprehensive pillar content.

#### Fix 7: Trust and Authority Signals (E-E-A-T)
- Real reviews, expertise demonstrations, authentic credentials
- Even unlinked brand mentions strengthen authority
- AI platforms prioritize content from recognized authorities
- Show credentials, earn media mentions, consistent author presence across platforms
- **Our status:** Have aggregateRating + reviews in schema. Need: visible author credentials on blog, privacy/terms pages, more reviews on GBP.

#### Fix 8: SEO-Paid Team Alignment
- Monthly cross-team meetings sharing conversion + search data
- Organic insights inform ad copy; ad data informs content strategy
- **Our status:** Solo operation — but principle applies: use GSC data to inform content decisions, use any future ad data to identify high-converting topics.

### Key Insights from Video

- **AI platforms drive <1% of traffic but 9.7% of B2B revenue and 11.4% of B2C revenue** — much higher conversion rates. Getting cited by AI is high-value.
- **Structure content for AI citation:** Q&A format, short paragraphs, bullet points. AI quotes rather than links.
- **Track AI citations, not just rankings:** Monitor presence in ChatGPT, Perplexity, Google AI Overviews.

---

## 5. Consolidated Action Plan

### Tier 1 — Code Changes (Can Implement Now)

| # | Action | Impact | Effort | Source |
|---|--------|--------|--------|--------|
| 1 | Add LocalBusiness schema with full address + geo + hours | High | Low | Google docs |
| 2 | Add ProfilePage schema on About page | High | Low | Google docs |
| 3 | Add breadcrumbs to all remaining pages (services, pricing, rate-calc, projects index, blog index, service sub-pages) | High | Medium | Google docs |
| 4 | Verify/create manifest icons (192x192, 512x512) in /public/ | Medium | Low | Google docs |
| 5 | Add `alternateName` to WebSite schema | Low | Low | Google docs |
| 6 | Remove speakable schema (ineffective for non-news) | Low | Low | Google docs |
| 7 | Add security headers (CSP, X-Frame-Options, HSTS) to next.config | Low | Low | Google docs |
| 8 | Verify Core Web Vitals with PageSpeed Insights | High | Low | Both |

### Tier 2 — Content & Pages (Manual Work)

| # | Action | Impact | Effort | Source |
|---|--------|--------|--------|--------|
| 9 | Create privacy policy + terms of service pages | Medium | Medium | Both |
| 10 | Audit all headlines for specificity and conversion focus | High | Medium | Patel video |
| 11 | Mine GSC for striking distance keywords (pos 11-20) | High | Low | Patel blog |
| 12 | Mine "People Also Ask" for content ideas in all 4 languages | High | Medium | Patel blog |
| 13 | Add author bios with credentials to blog posts | Medium | Low | Both |
| 14 | Create Istanbul-specific localized blog content | Medium | High | Patel blog |
| 15 | Structure all content for AI citation (Q&A, short paragraphs, bullets) | Medium | Medium | Patel video |
| 16 | Add real video content (even 15-sec clips) | Medium | Medium | Patel video |
| 17 | Build case studies with measurable results | High | High | Both |

### Tier 3 — Outreach & Off-Site (Ongoing)

| # | Action | Impact | Effort | Source |
|---|--------|--------|--------|--------|
| 18 | Complete GBP optimization (all fields, photos, posts) | High | Medium | Both |
| 19 | Directory submissions (Clutch, DesignRush, etc.) | Medium | Low | Patel blog |
| 20 | Unlinked brand mention outreach | Medium | Low | Patel blog |
| 21 | Guest blogging on web design/tech publications | High | High | Patel blog |
| 22 | Testimonial writing for tools (Vercel, etc.) | Low | Low | Patel blog |
| 23 | Reviews campaign — target 1-2/month on GBP | Medium | Low | Both |
| 24 | NAP consistency audit across all online presences | Medium | Low | Patel blog |
| 25 | Monitor AI citations (ChatGPT, Perplexity, AI Overviews) | Medium | Low | Patel video |

### Tier 4 — Ongoing Maintenance

| # | Action | Frequency | Source |
|---|--------|-----------|--------|
| 26 | Quarterly technical SEO audit | Every 3 months | Patel blog |
| 27 | Content pruning — remove/consolidate underperformers | Every 3 months | Patel blog |
| 28 | Keyword cannibalization check | Every 3 months | Patel blog |
| 29 | Broken backlink audit + 301 redirects | Monthly | Patel blog |
| 30 | Pillar page consolidation as blog grows | As needed | Patel video |
