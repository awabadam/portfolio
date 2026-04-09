# SEO & Growth Strategic Plan
## Awab Design | Istanbul Web Designer

**Created:** April 2026
**Last updated:** 2026-04-09 (Phase 1 shipped, moving into Phase 2)
**Goal:** Improve CTR and impressions on Google Search
**Approach:** Go narrow first (medical clinic niche), then expand

---

## Strategic Overview

### The Core Insight
The biggest opportunity isn't competing for "web design Istanbul" (too competitive). It's owning a specific niche where no quality competitor exists: **medical clinics needing Next.js + multilingual + AI chatbots**.

### The Four Phases
| Phase | Timeframe | Focus | Status |
|-------|-----------|-------|--------|
| **1. Foundation Fixes** | Week 1 | Quick wins on existing pages | ✅ **SHIPPED** |
| **2. Clinic Niche Domination** | Week 2-3 | New landing page + case studies | ⏳ **IN PROGRESS** |
| **3. Turkish Expansion** | Week 4-6 | Localize for the local market | 🔲 Pending |
| **4. Content Engine** | Month 2-3 | Blog + ongoing publishing | 🔲 Pending |

---

## Phase 1 — Foundation Fixes ✅ COMPLETE

**Status:** Shipped across commits `85eb8d4` → `1a26090` on 2026-04-09
**Duration:** 1 day (originally planned 7 days)

### What we shipped

#### Code (shipped commits)
- ✅ **Per-page metadata** — Home, About, Contact pages now have unique `generateMetadata()` — no more duplicate titles in GSC (`f235887` — also fixes mobile indexation suppression via deletion of `LocaleHtmlAttributes`, 307→308 redirect, bot-skip Supabase auth)
- ✅ **SEO-optimized titles/descriptions** — All rewritten in EN/TR/AR/FR with target keywords (`a16cab6`)
- ✅ **FAQ schema component** — `src/components/seo/FAQSchema.tsx`, reusable across pages
- ✅ **Services FAQ expanded** — 8 → 15 questions with high-intent queries, all translated to 4 locales (`a16cab6`)
- ✅ **Pricing landing page** — `/pricing` route with tier cards, comparison table, FAQ, testimonial placeholder, OfferCatalog + FAQPage + Breadcrumbs schema (`a16cab6`)
- ✅ **Single pricing source of truth** — Unified `src/lib/pricing.ts` drives pricing page, rate-calculator, services page, chat assistant, and JSON-LD schemas (`398bc6b`)
- ✅ **Navigation updates** — Pricing link added to navbar, footer `/#services` fragment fixed to `/services`, pricing points to `/pricing` (`a16cab6`)
- ✅ **Contact email** — `hello@awab.design` → `awabe.adam@gmail.com` everywhere (`185d88e`)
- ✅ **Canonical URLs** — Everything points to `https://www.awab.design` instead of `https://awab.design` — fixed the hreflang/canonical SEO warning (`d8a824b`)
- ✅ **Screenshot API caching** — `Cache-Control: max-age=86400, s-maxage=2592000` headers + 800x600 dimensions — saves ~1.5 MB per homepage load (`d8a824b`)
- ✅ **Hero LCP fix** — Removed `initial={{ opacity: 0 }}` animation on h1, deferred InteractiveCubes via `requestIdleCallback` (`d8a824b`)
- ✅ **Modern browserslist** — `.browserslistrc` with Chrome 111+ / Safari 16.4+ targets (`65ce4c5`)
- ✅ **Robots + preview noindex** — Dynamic `robots.ts`, `middleware.ts` → `proxy.ts` rename, `X-Robots-Tag: noindex` on preview deploys (`72cb6ea`)
- ✅ **Font `display: swap`** — Inter/Space Grotesk/Tajawal all render fallback fonts immediately (`65ce4c5`)
- ✅ **`optimizePackageImports`** — Tree-shakes lucide-react, framer-motion, all radix packages (`65ce4c5`)
- ✅ **Lazy ChatWidget** — Dynamic import, 400+ lines of WebSocket code deferred (`65ce4c5`)
- ✅ **Touch-aware effects** — MagneticElement and TiltCard no-op on phones (`65ce4c5`)
- ✅ **Desktop-only NoiseOverlay** — SVG feTurbulence hidden below md breakpoint (`65ce4c5`)
- ✅ **Preconnect hints** — GTM, GA, fonts.gstatic.com (`65ce4c5`)
- ✅ **experimental.optimizeCss** — Inlines critical CSS into HTML head (`65ce4c5`)
- ✅ **Dead code cleanup** — ScrollReveal unused exports removed, react-icons → inline WhatsApp SVG, react-dropzone removed, ProjectCard width/height added (`52ba911`)
- ✅ **Three.js eviction from homepage bundle** — Deleted dead barrel files that were causing Turbopack to hoist three.js into the main chunk (`1a26090`)
- ✅ **Supabase eviction from homepage bundle** — `HomePageContent` now fetches via `/api/projects?featured=true&limit=3` instead of importing `getFeaturedProjects` directly (`1a26090`)

#### Docs (shipped)
- ✅ `docs/market-research-master.md` — 19-section consolidated market research
- ✅ `docs/market-research-web-design-buyers.md` — Buyer psychology deep dive
- ✅ `research/istanbul-web-design-keyword-research-2026.md` — Keyword data EN+TR
- ✅ `research/content-competitor-analysis-2026.md` — Competitor + YouTube analysis
- ✅ `docs/gbp-checklist.md` — Google Business Profile optimization checklist
- ✅ `docs/gsc-baseline-2026-04.md` — GSC baseline filled with real 28-day data
- ✅ `docs/seo-strategic-plan.md` — this file

### PageSpeed impact (mobile)
| Metric | Baseline | After Phase 1 | Change |
|---|---|---|---|
| Performance Score | 38 | **80** | +42 🔥 |
| LCP | 64.2s | **3.0s** | −95% 🔥 |
| FCP | 3.1s | 0.9s | −71% |
| TBT | 990ms | 240ms | −76% |
| SEO Score | 92 | **100** | Perfect |
| Best Practices | 96 | **100** | Perfect |

### Manual tasks remaining (user-side)
These are NOT blockers for Phase 2 but should be done in parallel:
- 🔲 Execute `docs/gbp-checklist.md` (Google Business Profile optimization) — ~1 hour manual work in the GBP dashboard
- 🔲 Request reviews from past clients (Jouvence, EsteExpert, Omar Marketing) using the templates in the GBP checklist
- 🔲 Submit updated sitemap + request re-indexing in GSC for home, about, contact, services, pricing, all locale roots
- 🔲 Set calendar reminders: +14 days (2026-04-23) and +30 days (2026-05-09) to fill in the follow-up snapshots in `docs/gsc-baseline-2026-04.md`

---

## Phase 2 — Medical Clinic Niche Domination (Week 2-3) ⏳ NEXT

**Goal:** Own the medical clinic / health tourism keyword space before competitors notice.

### Why This Bet
- **$3.97B** Turkey medical tourism market growing 15.6%/year (from market research)
- **2M+ international patients annually** from 120+ countries
- Istanbul is the "Hair Transplant Capital of the World"
- **Only ONE** specialized competitor (HelloKlinik) and they use templates, not custom Next.js
- **NO Istanbul competitor** specifically advertises Next.js or multilingual (EN/AR/TR/FR) clinic websites
- You already have 2 clinic case studies (Jouvence, EsteExpert) — just need to elevate them
- Highest budgets in the market: $3,000-$15,000 per project

### Current State (verified in codebase)
- ✅ `/services/webdesign-istanbul` page exists (generic web design, position 33 in GSC)
- ✅ Jouvence + EsteExpert exist in `src/data/projects.ts` with `featured: true`
- ✅ `/projects/[project]` dynamic route exists
- 🔲 NO dedicated `/clinic-website-design` or `/medical-clinic-websites` landing page yet
- 🔲 Project pages are minimal — no full case study content, no metrics, no before/after
- 🔲 NO pillar blog post targeting medical clinic keywords

### Phase 2 Task Breakdown

#### 2.1 Clinic-specific service landing page

**New route:** `/src/app/[locale]/services/clinic-websites/page.tsx` (following existing pattern of `services/ai-chatbot-integration`, `services/webdesign-istanbul`, etc.)

**Target primary keywords:**
- "clinic website design istanbul"
- "medical tourism website turkey"
- "aesthetic clinic web design"
- "klinik web sitesi tasarımı" (Turkish)
- "estetik klinik web sitesi" (Turkish)

**Page structure:**
1. **Hero** — H1 targeting "Medical Clinic Website Design Istanbul" + subtitle about multilingual / international patients
2. **The Problem section** — "Istanbul has 50+ JCI-accredited clinics competing for international patients. Most have slow WordPress sites that don't convert."
3. **What clinics need from us** — 6 feature cards:
   - Multilingual (EN/AR/TR/RU) with proper hreflang
   - WhatsApp integration for instant patient contact
   - Online appointment/consultation booking
   - Before/after photo galleries
   - Doctor profiles with credentials
   - KVKK (Turkish GDPR) compliance
   - Sub-1s page loads for Core Web Vitals
4. **Featured clinic projects** — Jouvence + EsteExpert case study cards with metrics
5. **Our process for clinics** — 4-step clinic-specific process
6. **Pricing for clinics** — Tiered (reuse from `/pricing` but clinic-framed)
7. **FAQ** — 10 clinic-specific questions (different from main FAQ):
   - "How many languages can you support?"
   - "Do you integrate with HealthTurkiye portal?"
   - "Is the site KVKK compliant?"
   - "Can you build a booking system for consultations?"
   - "How do you handle before/after photo galleries with privacy?"
   - etc.
8. **Primary CTA** — "Get a free clinic website audit" (links to contact form with pre-filled subject)
9. **Testimonial placeholder** — structured for clinic testimonials

**Schema:**
- `Service` JSON-LD with `serviceType: "Medical Clinic Website Design"` and `areaServed: ["Istanbul", "Turkey", "Worldwide"]`
- `FAQPage` with the 10 clinic FAQs
- `BreadcrumbList`

**Metadata:** Add `metadata.clinicWebsites` to all 4 locale files with keyword-dense titles.

**Files to create:**
- `src/app/[locale]/services/clinic-websites/page.tsx`
- `src/app/[locale]/services/clinic-websites/layout.tsx` (metadata + schema)
- `src/app/[locale]/services/clinic-websites/opengraph-image.tsx` (optional)
- Add `metadata.clinicWebsites` + `clinicWebsites` namespace to `src/messages/{en,tr,ar,fr}.json`

#### 2.2 Full case study pages for Jouvence + EsteExpert

**Goal:** Turn the minimal project entries into full-fledged case studies with narrative, metrics, and images.

**Current state:** `src/data/projects.ts` has them as `featured: true` with one-line descriptions. The `/projects/[project]` dynamic route renders generic project details.

**Approach options:**
- **Option A:** Expand `projects.ts` schema to include case study fields (problem, approach, metrics, images gallery, results, testimonial) and render all that data on `/projects/[project]` — scales cleanly to future projects
- **Option B:** Create dedicated `/case-studies/jouvence/page.tsx` and `/case-studies/esteexpert/page.tsx` with hand-written content — faster for 2 specific cases, doesn't scale
- **Option C (recommended):** Add a `caseStudy` JSON field to the projects Supabase table; migrate Jouvence + EsteExpert first. Render enriched content on `/projects/[id]` when `caseStudy` exists, fall back to current layout otherwise.

**Content to gather (user-side, in parallel with code work):**

For **Jouvence**:
- [ ] The problem: "Competing in Istanbul's crowded aesthetic clinic market, needed to attract international patients (Middle East, Europe)"
- [ ] Your approach: What you built technically (Next.js, 3 locales, booking, WhatsApp, etc.)
- [ ] Metrics (if available): traffic before/after, leads, conversion rate, page speed scores
- [ ] 3-5 screenshots (hero, booking flow, multilingual switcher, mobile, before/after gallery)
- [ ] 1 testimonial quote from the Jouvence team
- [ ] Launch date

For **EsteExpert**:
- [ ] Same structure as above
- [ ] Specifically what made this clinic different (trust signals, before/after, consultation CTA)

**If metrics don't exist yet:** Use qualitative story. "Multilingual site serving 3 markets" is still compelling. Case studies with before/after screenshots + the story work even without numbers.

#### 2.3 Pillar blog post — English

**Title options:**
- "How Medical Clinics in Istanbul Can Attract International Patients with a Multilingual Website" (long-tail, high intent)
- "The Complete Guide to Building a Medical Clinic Website in Turkey" (broader)
- "Why Your Istanbul Clinic Is Losing International Patients to Outdated Websites" (pain-point focused — probably highest CTR)

**Target keywords:**
- "medical clinic website istanbul"
- "clinic website design turkey"
- "multilingual clinic website"
- "health tourism website"
- "attract international patients clinic"

**Structure (1500-2500 words):**
1. Opening hook — the $3.97B medical tourism market
2. The current state — most clinics have outdated WordPress, poor mobile, no multilingual
3. What international patients actually look for (by country — Middle East patients want Arabic + WhatsApp, Russian patients want RU + visa info, etc.)
4. The 7 must-haves for a clinic website in 2026 (link to the service page for each)
5. Case studies — Jouvence and EsteExpert with screenshots and results
6. Technical stack matters: why Next.js beats WordPress for clinics (speed, SEO, security)
7. How to pick a web designer for your clinic
8. CTA — link to `/services/clinic-websites` with "Get a free audit"

**Implementation:** Use existing blog infrastructure (`src/app/[locale]/blog/[slug]`). This will likely involve:
- [ ] Writing the content (EN)
- [ ] Generating via the blog generator (`src/lib/blog/generator.ts`) or manually inserting into the blog Supabase table
- [ ] Adding hero image
- [ ] Internal links to `/services/clinic-websites`, `/pricing`, project case studies

#### 2.4 Navigation updates

- [ ] Add "Clinic Websites" to services dropdown in Navbar (if there's a services dropdown), or add to footer
- [ ] Internal link from home page to the new clinic services page
- [ ] Internal link from existing `/services/webdesign-istanbul` page to `/services/clinic-websites` (and vice versa)
- [ ] Update `/services` page to feature clinic services prominently
- [ ] Update `/services/ai-chatbot-integration` to mention clinic use cases with a link

#### 2.5 Sitemap + re-indexing

- [ ] New pages auto-added to sitemap via existing `src/app/sitemap.ts` logic (verify it picks up new service routes)
- [ ] After deploy: request indexing in GSC for the new pages
- [ ] Monitor `/services/clinic-websites` and blog post in GSC Performance report weekly

### Phase 2 Success Metrics

Track in `docs/gsc-baseline-2026-04.md` (+30 day snapshot):

| Metric | Baseline | Phase 2 Target |
|---|---|---|
| "clinic website design istanbul" impressions | 0 | 20+ |
| "medical tourism website" impressions | 0 | 15+ |
| "estetik klinik web sitesi" impressions | 0 | 10+ |
| `/services/clinic-websites` page impressions | N/A | 30+ |
| Total clicks to clinic-themed content | 0 | 5+ |
| Leads mentioning "clinic" or "medical" | 0 | 1+ |

### Phase 2 Open Questions (for user)

Before I start coding, I need you to decide:

1. **Case study depth**: Do you have metrics from Jouvence/EsteExpert (traffic, leads, conversions)? Or should we build them as visual-story case studies without numbers?
2. **Approach for case studies**: Option A (expand projects.ts schema), B (dedicated /case-studies/ routes), or C (Supabase caseStudy JSON field)?
3. **Testimonials**: Can you get even one quote from Jouvence or EsteExpert owners this week? Even "Awab built us a great multilingual site, we love it" is enough.
4. **Pillar blog post**: Do you want to write the draft yourself (I'll edit + optimize), or should I generate a draft for you to review?
5. **Screenshots**: Can you provide 3-5 screenshots of each project (hero, key features, mobile view)? Or should we use the `/api/screenshot` endpoint on the live URLs?

---

## Phase 3 — Turkish-Language Expansion (Week 4-6)

**Goal:** Capture the massively underserved Turkish search volume.

### Tasks
1. Turkish service pages — proper translation (not Google Translate) of clinic-websites, ai-chatbot-integration, webdesign-istanbul, pricing
2. Turkish pillar post: "2026'da Klinik Web Sitesi Yaptırmak: Eksiksiz Rehber" (targeting "klinik web sitesi yaptırmak")
3. Turkish comparison post: "Freelancer mi Ajans mı? Web Sitesi Yaptırmak İçin Hangisi Daha İyi?"
4. Turkish pricing keywords content: "Web Tasarım Fiyatları İstanbul 2026"

**Expected impact:** Rank for high-volume Turkish terms with minimal Turkish-language competition (YouTube research confirmed there's a huge content gap).

---

## Phase 4 — Content Engine (Month 2-3)

**Goal:** Build long-term compounding organic traffic.

### Publishing Cadence
- 2 posts/month minimum, alternating EN and TR
- Each post targets a specific long-tail keyword from market research

### Priority Post Order
1. "How Much Does a Clinic Website Cost in Istanbul in 2026?" (EN)
2. "Next.js vs WordPress for Medical Clinics" (positions as modern-tech expert)
3. "Complete Guide to AI Chatbots for Clinics" (second-biggest differentiator)
4. More case studies as projects complete
5. Turkish versions of the above

---

## What We Are Deliberately SKIPPING

| Skip | Why |
|------|-----|
| YouTube | High effort, delayed ROI — revisit at month 3-6 |
| Competing for "web design istanbul" head term | Too expensive, agencies dominate |
| General SMB content | Too broad, low conversion |
| Paid ads | Organic foundation isn't ready yet |
| Further perf optimization (below 80 mobile / 60 desktop) | Diminishing returns — business value now comes from content, not score points |

---

## Success Metrics

Track these monthly in Google Search Console:

| Metric | Baseline (28d to 2026-04-07) | 3-Month Target | 6-Month Target |
|--------|---------------|----------------|----------------|
| Total impressions | 178 | 700+ | 2000+ |
| Total clicks | 1 | 20+ | 80+ |
| Avg CTR | 0.56% | 2.5% | 4% |
| Avg position | 11.2 | 8 | 6 |
| Mobile impression share | 11.5% | 60%+ | 75%+ |
| Target keywords ranking top 10 | 0 | 5+ | 15+ |

**Target keywords to monitor:**
- clinic website design istanbul
- medical tourism website turkey
- freelance web designer istanbul
- next.js developer istanbul
- web tasarım istanbul
- klinik web sitesi tasarımı
- estetik klinik web sitesi
- web sitesi yaptırmak
- web tasarım fiyatları

---

## Notes

- **Commitment needed:** 5-10 hours/week consistently
- **Content language:** Comfortable writing EN + TR (with AI assist for polish)
- **Niche commitment:** Medical clinics as primary focus for next 3-6 months ✅ locked in
- **Review cadence:** Weekly check-in on metrics, monthly deeper review
