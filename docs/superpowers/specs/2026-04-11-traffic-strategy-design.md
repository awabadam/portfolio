# Traffic Strategy Design — "Awab Traffic Engine v1"

**Created:** 2026-04-11
**Status:** Approved design, pending implementation plan
**Owner:** awab
**Related:** `docs/seo-strategic-plan.md` (Phases 1+2 shipped), `docs/seo-checklist.md`, `docs/gsc-baseline-2026-04.md`

---

## Context

SEO Phases 1+2 are shipped (foundation + medical clinic niche). GSC baseline: 178 impressions, 1 click in 28 days ending 2026-04-07. The portfolio now has `/services/clinic-websites`, enriched Jouvence + EsteExpert case studies, and a pillar blog post live at `/blog/medical-clinic-website-istanbul`.

This spec covers **non-SEO traffic acquisition**: social media, outbound, and directories. SEO Phases 3 (Turkish expansion) and 4 (content engine) continue in parallel under `docs/seo-strategic-plan.md` — this spec does not replace them.

## Goals

1. Drive qualified traffic to `awab.design/pricing` and `awab.design/contact` via channels that compound faster than pure SEO.
2. Build a repeatable content pipeline that fits within a ~3hr/week budget.
3. Generate at least 3 paid clients from social + outbound within 90 days.
4. Establish directory presence on high-authority platforms in week 1 (one-time sprint).

## Constraints (locked in during brainstorm)

- **Audience:** Broad Istanbul/Turkey SMB owners, expat founders, international clients (not clinic-only — clinics stay in SEO funnel).
- **Format capacity:** Text + screenshots only. No camera, no talking-head video.
- **Time budget:** ~3hrs/week core, up to 6hrs/week stretch weeks.
- **Language:** English only.
- **Lead capture:** Bio links to `/pricing` + DM CTA funnel. Lead magnet deferred to month 2.
- **Outbound:** Prioritize clinics (high-ticket $3-15k), fallback to broad SMBs.

## Non-Goals

- YouTube / long-form video (deferred, needs camera)
- Paid ads (organic first)
- Turkish / Arabic / French social content (English only in v1)
- Email newsletter / lead magnet infra (revisit month 2)
- Competing for "web design istanbul" head term (SEO plan handles this)

---

## Section 1 — Channel Strategy + Repurposing Pipeline

### Channels

| Channel | Role | Posts/wk (core) | Posts/wk (stretch) |
|---|---|---|---|
| LinkedIn | Primary (draft home, DM funnel) | 1 | 2 |
| Twitter/X | Authority (dev peers, referrals) | 1 | 2 |
| Instagram | Discovery (algo reach) | 1 | 2 |
| TikTok | Discovery (slideshow posts, no video) | 1 | 2 |

### Repurposing pipeline (one idea → 4 outputs)

```
Monday — 30min — pick idea, collect screenshots
Tuesday — 45min — draft native LinkedIn post (800-1500 chars + carousel)
Wednesday — 20min — fork to Twitter thread (6-10 tweets)
Thursday — 25min — fork to Instagram carousel (6 slides)
Friday — 20min — fork to TikTok slideshow (text overlays, trending audio)
```

**Core cadence:** 1 original idea per week → 4 posts (one per channel). ~2.3hrs/wk content.
**Stretch cadence:** 2 original ideas per week → 8 posts. ~4.7hrs/wk content. Use when a topic has natural follow-up or when outbound feeds a teardown.

**Weekly time budget breakdown (core):**
- Content pipeline: ~2.3hrs
- Outbound (Section 4): ~1hr
- Metrics log (Section 6): ~15min
- **Total: ~3.5hrs/wk** (fits within stated 3hr core, slight overflow on busy weeks)

**Weekly time budget breakdown (stretch):**
- Content pipeline: ~4.7hrs
- Outbound: ~1.5hrs
- Metrics + monthly review: ~30min
- **Total: ~6.5hrs/wk** (matches stated 6hr stretch ceiling)

### Channel conflict note

TikTok is a video-first platform. Slideshow posts work but are estimated ~30% of video Reel reach. Accepted constraint. Kill criterion at 90 days if underperforms (see Section 6).

---

## Section 2 — Content Pillars

Three pillars, alternating weekly.

### Pillar 1 — Site Teardowns (40%)

**Format:** Screenshot a real Istanbul SMB site (restaurant, dentist, boutique, law firm), annotate problems (slow LCP, no mobile, broken WhatsApp, etc.), show the fix mockup.

**Safety rule:** Always anonymize the business name ("a restaurant in Kadıköy", not the real name) unless the owner explicitly consents. Avoids defamation risk while preserving the lesson.

**Example hooks:**
- "I audited 10 Istanbul restaurant websites. 9 were losing customers before page load."
- "This Istanbul dentist pays $500/mo for Google Ads. Their site converts at 0.3%. Here's why."

### Pillar 2 — Build-in-Public (35%)

**Format:** Work-in-progress screenshots from real projects (client or self). Code, Figma, or browser. Tell the story: what, why, tradeoffs.

**Content sources:** Phase 3/4 SEO work, clinic site builds, `/services/clinic-websites` launch, perf wins (95% LCP drop is viral-able).

**Example hooks:**
- "Dropped mobile LCP from 64s to 3s on my own site. The 7 things that mattered."
- "Building a booking system for an Istanbul clinic in Next.js. Day 3: the KVKK compliance problem."

### Pillar 3 — Case Study Recaps (25%)

**Format:** Mini case study — one project, one problem, one outcome. Screenshots + narrative + link to full portfolio case study.

**Content sources:** Jouvence, EsteExpert, Saphiredent, past work.

**Example hooks:**
- "How I built a 3-language site for an Istanbul aesthetic clinic in 2 weeks."
- "This clinic needed WhatsApp + booking + before/after gallery. Here's how it shipped."

### Rotation example

- Week 1: Teardown + Build-in-public
- Week 2: Teardown + Case study
- Week 3: Build-in-public + Teardown
- Week 4: Case study + Build-in-public

---

## Section 3 — Lead Capture Funnel

### Layer 1 — Bio links (passive)

All profiles (LinkedIn, Twitter, IG, TikTok):

- **Primary CTA:** `awab.design/pricing` (cold traffic self-qualifies)
- **Secondary CTA:** `awab.design/contact`
- **UTM tagged:** `?utm_source={channel}&utm_medium=bio&utm_campaign=traffic-engine-v1`

**Profile bio (same everywhere):**
> Web designer in Istanbul. I build fast, multilingual sites for clinics & SMBs. From $150. → awab.design/pricing

### Layer 2 — DM audit funnel (active)

**Per-post CTA:**
> "Want a free 5-min teardown of YOUR site? DM me 'AUDIT' — I'll send a Loom within 48h."

**Delivery format:** Loom screen recording (no camera required, matches format-A constraint).

**Capacity cap:** Max 3 audits per week. If demand exceeds cap, queue them: "You're in the queue, ~1 week wait" — creates scarcity.

**Follow-up sequence after audit delivery:**
1. Audit sent → "Want me to fix the top 3 issues? Starts at $150."
2. No reply in 3 days → "Quick check-in, any questions on the audit?"
3. Still no reply → drop from active pipeline, do NOT add to any list (no email infra in v1).

### Layer 3 — Lead magnet (deferred)

Email-gated "Istanbul SMB Website Checklist PDF" is deferred to month 2 pending DM funnel saturation. See "Deferred work" at bottom.

---

## Section 4 — Outbound Cadence

**Weekly total:** 8 touches (5 clinic + 3 broad SMB). ~1-1.5hrs/wk.

### Target 1 — Clinics (priority, 5/wk)

**Source list:**
- Google Maps: "aesthetic clinic Istanbul", "hair transplant Istanbul", "dental clinic Istanbul"
- Healthturkiye.com directory
- Instagram hashtags (#istanbulaesthetics, #hairtransplantturkey)
- Competitor clinic follower scrapes

**Qualification filter:** Clinic has a live website BUT it's slow / single-language / WordPress / missing online booking. ~2min per clinic.

**LinkedIn DM template (preferred channel):**
> Hi [Name], I saw [Clinic] — your English patients section is solid. I noticed your site takes ~[X]s to load on mobile though, which might be costing int'l bookings. I specialize in fast multilingual clinic sites (built [Jouvence](link), [EsteExpert](link)). Happy to send a free Loom audit if useful — no strings. — Awab

**Cold email fallback (if no LinkedIn found):**
- Subject: "Free 5-min audit for [Clinic]"
- Body: same structure as LinkedIn

### Target 2 — Broad SMBs (fallback, 3/wk)

**Source list:** Istanbul restaurants, lawyers, boutique hotels, dentists, small retailers with bad websites. Google Maps filter.

**Template (audit-led, pre-recorded):**
> Hi [Name] — quick one. I built a free teardown of [Business] site (Loom, 4 min): [link]. 3 fixes would get you ~2x mobile speed. Fixed sites start at $150 if useful. — Awab

**Key difference from clinic outreach:** SMB outreach leads with the audit already recorded (higher friction justified by lower ticket). Clinic outreach offers the audit on request (preserves warmth for higher ticket).

### Tracking

Simple sheet (Google Sheets or Supabase `outbound_log` table):
- Name / Channel / Date / Template used / Response / Outcome

### Expected rates

- Reply rate: 10-15%
- Reply → audit conversion: 20-30%
- Audit → paid: 10-15%
- Net: ~1 paid client per 2-3 months from outbound alone

### Outbound → content feedback loop

Every audit recorded → anonymize → convert into a teardown pillar post. Outbound is content fuel.

---

## Section 5 — Directory Sprint (one-time, week 1)

**Goal:** ~4hrs one Saturday. Not recurring.

### High-priority (2hrs)

1. **Clutch.co** — company profile, 3 case studies (Jouvence, EsteExpert, Saphiredent), request 1 verified review
2. **Sortlist** — provider profile, same 3 projects, Istanbul + Turkey regions
3. **DesignRush** — agency profile, free tier
4. **LinkedIn Services page** — enable "Open to Work" as freelancer, add services, set location Istanbul

### Medium-priority (1hr)

5. **TechBehemoths** — listing with tags: Next.js, Medical, Multilingual
6. **Upwork** — profile with 3 portfolio pieces, target "web designer istanbul" + "medical website designer" niches (no bidding, indexing only)
7. **GoodFirms** — Clutch sister site
8. **The Manifest** — B2B directory

### Skipped

- Fiverr (race to bottom)
- Bionluk (Turkish only, EN content mismatch)
- Bark (low quality)

### Shared assets (prep once, paste everywhere)

- **Company name:** Awab Elkhalil — Web Designer & Developer (matches existing Google Business Profile)
- **Tagline:** Fast, multilingual websites for clinics & SMBs in Istanbul
- **Bio (~500 chars):** to be written during sprint
- **Services list:** match `/services` page
- **Portfolio:** 3 case studies + screenshots + live URLs
- **Pricing:** from $150
- **Contact:** `awabe.adam@gmail.com`
- **Website:** `https://www.awab.design`

### Review seeding (~30min, parallel to directory sprint)

Send review request template from `docs/seo-checklist.md` to:
1. Jouvence team
2. EsteExpert team
3. Saphiredent (Dr. Ahmed Hassan)
4. Estetikworld (Sarah Johnson)

**Week 1 target:** 2 Google reviews + 1 Clutch review.

---

## Section 6 — Metrics, Cadence, Kill Criteria

### Weekly metrics

Tracked in a simple sheet or Supabase `growth_log` table:

| Metric | Source | Wk 4 target | Wk 12 target |
|---|---|---|---|
| LinkedIn followers | manual | +20 | +150 |
| LinkedIn post impressions (avg) | native | 500 | 2000 |
| Twitter followers | manual | +10 | +80 |
| Instagram followers | manual | +15 | +100 |
| TikTok views (avg) | native | 200 | 1500 |
| DMs received "AUDIT" | manual | 1 | 5/wk |
| Audits delivered | manual | 1 | 3/wk |
| Outbound sent | sheet | 8 | 8/wk |
| Outbound replies | sheet | 1 | 2 |
| `/pricing` traffic from social | GA UTM | 10 | 80 |
| `/contact` submissions from social | GA UTM | 0 | 2 |
| Paid clients from social/outbound | manual | 0 | 1 |

### Review cadence

- **Weekly (Fri, 15min):** log numbers, flag what worked
- **Monthly (last Fri, 1hr):** review pillar mix, adjust channel effort
- **Quarter (90 days):** hard review vs kill criteria

### Kill criteria at 90 days

- **Kill TikTok** if avg views < 300 AND zero DMs sourced from it
- **Kill a pillar** if engagement < 50% of best pillar consistently
- **Kill broad-SMB outbound** if 0 paid clients from it (clinic outbound keeps longer runway — higher ticket)
- **Double down** on whichever single channel produced >60% of inbound DMs

### 90-day success criteria

- 3+ paid clients sourced from social or outbound
- LinkedIn followers 400+
- At least 1 post breaks 5000 impressions
- `/pricing` traffic from social > 300/mo (vs current ~0)
- 2+ net new Google reviews
- 1+ Clutch review

### Escalation triggers

- **Zero paid clients at 90 days** → rethink offer/positioning, not channels
- **Plenty of views, zero DMs** → CTA problem, revise Section 3
- **DMs but no conversions** → audit quality or pricing objection, revise offer pitch

---

## Implementation Scope (for the writing-plans handoff)

The implementation plan should cover:

1. **Profile setup task** — write the shared bio, standardize profiles across LinkedIn/Twitter/IG/TikTok, add UTM-tagged bio links
2. **Directory sprint task** — one-Saturday sprint checklist (Section 5) including review-request sends
3. **Content ops task** — define the 2-ideas-per-week workflow: idea log (could be a `content_ideas` table in Supabase, or a plain markdown file — decide in plan), repurposing templates, posting schedule
4. **Outbound ops task** — source list build, template file (EN), tracking sheet schema, first 8-touch batch
5. **Metrics infra task** — decide: Google Sheet vs Supabase `growth_log` table. Add GA4 UTM view or query for social traffic breakdown.
6. **Review seeding task** — send 4 client review requests in week 1

What the implementation plan should NOT cover (explicitly deferred):

- Email / newsletter infra (deferred to month 2)
- Lead magnet PDF + `/free-checklist` route (deferred to month 2)
- Any new code routes beyond UTM tracking
- Video production setup

---

## Deferred work (revisit month 2)

- **Lead magnet PDF** ("Istanbul SMB Website Checklist — 27 things your site must have in 2026") + `/free-checklist` route + email capture
- **Email infra** (Resend recommended when we reach it)
- **5-email nurture sequence** (days 0, 2, 5, 9, 14)
- **Turkish-language social** (gated on SEO Phase 3 completion)

Trigger for revisit: DM funnel saturates capacity (>3 audit requests/wk sustained for 2 weeks), OR 30 days with inbound count too low to justify current time spend.

---

## Open questions (for implementation plan)

1. Metrics storage: Google Sheet (zero code, zero lift) OR new Supabase `growth_log` table (queryable, future-proof)?
2. Content idea log: markdown file in repo OR Supabase table OR Notion/external?
3. Does a `newsletter` or `leads` Supabase table already exist (carried over from any earlier work)? If yes, can be reused when lead magnet ships in month 2. Needs verification during planning.
4. Should UTM link generation be a one-time manual pass, or a tiny `scripts/generate-bio-links.mjs` helper?
5. Outbound source list — build once in a spreadsheet, or fetch programmatically via Google Places API?
