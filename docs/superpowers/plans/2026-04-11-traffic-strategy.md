# Traffic Strategy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the "Awab Traffic Engine v1" operational infrastructure — profile copy, outbound templates, directory sprint checklist, content idea log, and metrics tracking — so that the user can execute week 1 of multichannel traffic work against clear artifacts.

**Architecture:** All traffic assets live in a new `docs/traffic/` folder as markdown files (zero new code, zero new infra, zero new Supabase tables). This matches the spec's deferred-email-infra decision and keeps the v1 launch friction minimal. Manual operational tasks (directory sprints, profile updates, outbound sends) are broken into bite-sized checklist items so the user can pick them up in any order.

**Tech Stack:** Markdown files in the existing portfolio repo. No code, no dependencies, no build changes. UTM-tagged URLs are generated manually (4 URLs total — script would be overkill).

**Spec reference:** `docs/superpowers/specs/2026-04-11-traffic-strategy-design.md`

**Design decisions locked in by this plan (resolving spec open questions):**
1. **Metrics storage:** Markdown file (`docs/traffic/metrics-log.md`), not Supabase. Zero infra, migrate later if needed.
2. **Content idea log:** Markdown file (`docs/traffic/content-ideas.md`) in the repo.
3. **Newsletter/leads Supabase table check:** Deferred — not needed in v1 (lead magnet shipped month 2).
4. **UTM link generation:** Manual one-time pass. Only 4 bio links total (LinkedIn, Twitter, IG, TikTok).
5. **Outbound source list:** User-maintained Google Sheet, linked from `docs/traffic/outbound-log.md`. Programmatic Google Places fetch is out of scope.

---

## File Structure

New files created by this plan, all under `docs/traffic/`:

| File | Responsibility |
|---|---|
| `docs/traffic/README.md` | Index of all traffic docs + the weekly loop |
| `docs/traffic/bio-copy.md` | Shared profile bio + UTM-tagged bio links (per platform) |
| `docs/traffic/content-ideas.md` | Running log of content ideas + pillar tagging + status |
| `docs/traffic/content-templates.md` | Per-channel post templates (LinkedIn, Twitter, IG, TikTok) |
| `docs/traffic/outbound-templates.md` | Clinic + SMB outreach message templates |
| `docs/traffic/outbound-log.md` | Weekly outbound tracking table + link to source-list sheet |
| `docs/traffic/directory-checklist.md` | One-time directory sprint (8 directories + review requests) |
| `docs/traffic/metrics-log.md` | Weekly metrics table (baseline + week-by-week) |

No source code is modified. No Supabase tables added. No routes added.

---

## Task 1: Create the traffic docs folder + README index

**Files:**
- Create: `docs/traffic/README.md`

- [ ] **Step 1: Create the README that indexes everything in this folder**

Write to `docs/traffic/README.md`:

```markdown
# Traffic Engine v1 — Operational Assets

This folder holds the week-by-week operational artifacts for the "Awab Traffic Engine v1" traffic strategy. The strategic design lives in `docs/superpowers/specs/2026-04-11-traffic-strategy-design.md`.

## Files

| File | Purpose |
|---|---|
| [`bio-copy.md`](./bio-copy.md) | Shared profile bio + UTM-tagged bio links for each platform |
| [`content-ideas.md`](./content-ideas.md) | Running idea log — one row per idea, tagged by pillar + status |
| [`content-templates.md`](./content-templates.md) | Per-channel post structures (LinkedIn, Twitter, IG, TikTok) |
| [`outbound-templates.md`](./outbound-templates.md) | Outreach messages — clinic LinkedIn DM, clinic cold email, SMB audit-led email |
| [`outbound-log.md`](./outbound-log.md) | Weekly outbound tracking — who was contacted, channel, response, outcome |
| [`directory-checklist.md`](./directory-checklist.md) | One-time directory sprint — 8 directories + review requests |
| [`metrics-log.md`](./metrics-log.md) | Weekly growth metrics — followers, impressions, DMs, paid clients |

## The Weekly Loop

Every week, in order:

1. **Monday (30min):** Pick or write 1 new idea in `content-ideas.md`. Set status = `drafting`.
2. **Tuesday (45min):** Draft the LinkedIn post from the idea using `content-templates.md`.
3. **Wednesday (20min):** Fork LinkedIn draft → Twitter thread.
4. **Thursday (25min):** Fork → Instagram 6-slide carousel.
5. **Friday morning (20min):** Fork → TikTok slideshow.
6. **Friday afternoon (1hr):** Send 5 clinic outbound + 3 SMB outbound per templates, log each in `outbound-log.md`.
7. **Friday evening (15min):** Update `metrics-log.md` with this week's numbers.

**Total:** ~3.5hrs/week core. Can stretch to ~6.5hrs/week with 2 ideas instead of 1.

## 90-Day Kill Criteria

Reviewed at day 90:
- Kill TikTok if avg views < 300 and zero DMs attributed.
- Kill any content pillar if engagement < 50% of best pillar.
- Kill broad-SMB outbound if 0 paid clients (keep clinic outbound longer).
- Double down on whichever single channel produced >60% of inbound DMs.
```

- [ ] **Step 2: Verify the file exists**

Run: `ls -la docs/traffic/README.md`
Expected: file exists, size > 1000 bytes.

- [ ] **Step 3: Commit**

```bash
git add docs/traffic/README.md
git commit -m "Add traffic engine docs folder + README index"
```

---

## Task 2: Write shared profile bio + UTM-tagged bio links

**Files:**
- Create: `docs/traffic/bio-copy.md`

**Context:** Every social profile needs a consistent bio matching the portfolio positioning. UTM tags let us attribute traffic from each platform in GA4 (GA4 is already wired up per Phase 1 — preconnect to GTM was added in commit `65ce4c5`).

- [ ] **Step 1: Write the bio copy file with full platform variants**

Write to `docs/traffic/bio-copy.md`:

```markdown
# Profile Bio Copy

Shared copy for LinkedIn, Twitter/X, Instagram, TikTok. Paste into each profile on week 1.

**Naming rule:** Use the same display name everywhere → matches existing Google Business Profile name: **"Awab Elkhalil — Web Designer & Developer"**.

---

## Tagline (for headline fields)

> Web designer in Istanbul. Fast, multilingual sites for clinics & SMBs. From $150.

## Long bio (~500 chars, for "About" fields)

> I'm Awab — a freelance web designer & developer based in Istanbul. I build fast, multilingual Next.js websites for medical clinics and SMBs, with a specialty in the medical tourism market. Projects start at $150. I care about Core Web Vitals, SEO from day one, and conversion-focused design that actually turns visitors into customers. Languages: English, Turkish, Arabic, French. Portfolio at awab.design.

## Short bio (for Twitter/IG 160-char limit)

> Web designer in Istanbul 🇹🇷 · Fast, multilingual sites for clinics & SMBs · From $150 · awab.design/pricing

*(Remove the emoji if you prefer no emoji — this is the only place I'm adding one.)*

## Plain short bio (no emoji)

> Web designer in Istanbul. Fast, multilingual sites for clinics and SMBs. From $150. awab.design/pricing

---

## UTM-tagged bio links

Each platform gets its own UTM tag so GA4 can attribute traffic correctly. Campaign = `traffic-engine-v1`.

| Platform | Link URL |
|---|---|
| LinkedIn | `https://www.awab.design/pricing?utm_source=linkedin&utm_medium=bio&utm_campaign=traffic-engine-v1` |
| Twitter/X | `https://www.awab.design/pricing?utm_source=twitter&utm_medium=bio&utm_campaign=traffic-engine-v1` |
| Instagram | `https://www.awab.design/pricing?utm_source=instagram&utm_medium=bio&utm_campaign=traffic-engine-v1` |
| TikTok | `https://www.awab.design/pricing?utm_source=tiktok&utm_medium=bio&utm_campaign=traffic-engine-v1` |

**Secondary link (contact, use for LinkedIn contact info field):**

`https://www.awab.design/contact?utm_source=linkedin&utm_medium=profile&utm_campaign=traffic-engine-v1`

---

## Per-platform paste instructions

### LinkedIn
- **Headline:** "Freelance Web Designer & Developer | Fast multilingual sites for clinics & SMBs | Istanbul"
- **About:** use Long bio above
- **Featured section:** pin 3 items — `/services/clinic-websites`, `/projects/jouvence`, `/projects/esteexpert`
- **Contact info → Website:** LinkedIn link from UTM table above
- **Location:** Istanbul, Türkiye
- **Open to work:** enable "Freelance — Web Design"

### Twitter/X
- **Name:** Awab Elkhalil
- **Bio:** use Short bio above (160 chars max — check after pasting)
- **Location:** Istanbul
- **Website:** Twitter link from UTM table above

### Instagram
- **Name:** Awab Elkhalil
- **Bio:** use Short bio above
- **Link in bio:** Instagram link from UTM table above
- **Category:** Web Designer
- **Contact options:** enable email + DM

### TikTok
- **Name:** Awab Elkhalil
- **Bio:** use Plain short bio (TikTok bio field is 80 chars only — may need to trim)
- **Link in bio:** TikTok link from UTM table above
  - *Note: TikTok requires 1000 followers for clickable website link — until then, paste the URL as plain text in bio and mention "link in next post"*
```

- [ ] **Step 2: Verify the file**

Run: `ls -la docs/traffic/bio-copy.md && wc -l docs/traffic/bio-copy.md`
Expected: file exists, >60 lines.

- [ ] **Step 3: Commit**

```bash
git add docs/traffic/bio-copy.md
git commit -m "Add profile bio copy + UTM-tagged bio links per platform"
```

---

## Task 3: Write content idea log with 4 seed ideas

**Files:**
- Create: `docs/traffic/content-ideas.md`

**Context:** Spec says ~2 ideas/week at stretch, 1/week core. Seeding 4 ideas = ~4 weeks of runway so user can start executing without immediately needing to brainstorm.

- [ ] **Step 1: Write the idea log**

Write to `docs/traffic/content-ideas.md`:

```markdown
# Content Ideas

Running log of content ideas for the traffic engine. Pick one per week, follow the pipeline in `README.md`, drop results + metrics back here.

**Pillars** (from the spec):
- **T** = Teardown (40%)
- **B** = Build-in-public (35%)
- **C** = Case study recap (25%)

**Status values:** `idea`, `drafting`, `scheduled`, `published`, `archived`

---

## Seed ideas (week 1–4)

### Idea 1 — "95% LCP drop" build-in-public

- **Pillar:** B
- **Status:** idea
- **Hook:** "I dropped my own site's mobile LCP from 64 seconds to 3 seconds. Here's the 7 things that actually moved the needle."
- **Content source:** `docs/seo-strategic-plan.md` Phase 1 PageSpeed impact table (mobile perf went 38 → 80, LCP 64.2s → 3.0s, TBT 990ms → 240ms)
- **Angle:** pain-point → 7 concrete fixes → results. Each fix = 1 carousel slide.
- **CTA:** "Want a free 5-min teardown of YOUR site's LCP? DM me 'AUDIT'."
- **Pillar notes:** perfect build-in-public because it's your actual data, verifiable, universally interesting to anyone with a slow site.

### Idea 2 — Teardown of an anonymized Istanbul restaurant

- **Pillar:** T
- **Status:** idea
- **Hook:** "I audited 10 Istanbul restaurant websites. 9 were losing customers before the first page load."
- **Content source:** pick 1 real restaurant site (Kadıköy area, Bebek, Nişantaşı), screenshot, blur the name, annotate 5 problems: slow LCP, broken mobile, no online order button, ugly hero image, no WhatsApp link.
- **Safety:** MUST blur the business name. Use location only ("a restaurant in Kadıköy").
- **CTA:** "Free teardown of YOUR site — DM me 'AUDIT'."

### Idea 3 — Clinic case study: Jouvence

- **Pillar:** C
- **Status:** idea
- **Hook:** "How I built a 3-language website for an Istanbul aesthetic clinic in 2 weeks — and the one decision that made or broke the project."
- **Content source:** `src/data/projects.ts` Jouvence entry (enriched in commit `1dcc38c`), `/projects/jouvence` live case study, `/services/clinic-websites` landing page
- **Angle:** the "one decision" = prioritizing multilingual + WhatsApp over booking system on v1. Keeps the post punchy.
- **CTA:** "Need a clinic site that actually converts international patients? awab.design/services/clinic-websites"

### Idea 4 — Teardown of an anonymized Istanbul dental clinic

- **Pillar:** T
- **Status:** idea
- **Hook:** "This Istanbul dentist pays $500/mo for Google Ads. Their site converts at 0.3%. Here's why."
- **Content source:** pick 1 real dental clinic site (there are dozens in Şişli/Levent), screenshot, blur the name, annotate: no trust signals, no before/after gallery, no EN translation, slow form, no WhatsApp.
- **Safety:** MUST blur the name.
- **CTA:** "If you're a clinic owner burning money on ads with a bad site, DM me 'AUDIT'."

---

## Idea backlog

*(New ideas go here. Move to "Seed ideas" section when you start drafting.)*

---

## Published log

*(When an idea ships on all 4 channels, move its entry here and add metrics after 7 days.)*

**Entry template:**

- **Idea N — Title**
- **Published:** YYYY-MM-DD
- **Channels:** LinkedIn ✅ | Twitter ✅ | IG ✅ | TikTok ✅
- **LinkedIn URL:**
- **Twitter URL:**
- **IG URL:**
- **TikTok URL:**
- **7-day metrics:** LinkedIn _ impressions, _ reactions | Twitter _ impressions | IG _ reach | TikTok _ views
- **DMs attributed:** _
```

- [ ] **Step 2: Verify**

Run: `ls -la docs/traffic/content-ideas.md && wc -l docs/traffic/content-ideas.md`
Expected: file exists, >70 lines.

- [ ] **Step 3: Commit**

```bash
git add docs/traffic/content-ideas.md
git commit -m "Add content idea log with 4 seed ideas for weeks 1-4"
```

---

## Task 4: Write per-channel content templates

**Files:**
- Create: `docs/traffic/content-templates.md`

**Context:** The repurposing pipeline in the spec says one idea → 4 outputs. Each channel has different character limits, format conventions, and algorithm quirks. Templates make the fork process mechanical.

- [ ] **Step 1: Write the template file**

Write to `docs/traffic/content-templates.md`:

```markdown
# Content Templates

Per-channel post structure for the repurposing pipeline. Each template takes the same underlying idea and reshapes it to fit the channel.

---

## LinkedIn template (primary draft)

**Character target:** 800–1500 chars (LinkedIn hard cap is 3000, but 1500 is the sweet spot for engagement).

**Format:**

```
[Hook line — 1 sentence, must stop the scroll]

[1 line of whitespace]

[Context — 2–3 sentences setting up the problem]

[1 line of whitespace]

[Body — 3–7 short bullets, each 1 line:
• Point 1
• Point 2
• Point 3]

[1 line of whitespace]

[Payoff — 1–2 sentences with the insight or takeaway]

[1 line of whitespace]

[CTA: "Want a free 5-min teardown of YOUR site? DM me 'AUDIT' — I'll send a Loom within 48h."]

[1 line of whitespace]

[1–3 hashtags max: #WebDesign #Istanbul #SMB]
```

**Visual:** Upload 3–6 screenshot slides as a PDF carousel. LinkedIn strongly favors carousels over plain text posts in 2026.

**Post time:** Tuesday 08:00 Istanbul (matches LinkedIn peak EU working hours).

---

## Twitter/X thread template

**Character target per tweet:** 250 chars (under the 280 cap leaves room for quote retweet).

**Format (6–10 tweets):**

```
Tweet 1 (hook):
[Same hook as LinkedIn, tightened to 250 chars]

🧵

Tweet 2:
[Context — problem statement]

Tweet 3–8:
[One bullet point per tweet, expanded to 1–2 sentences]

Tweet 9:
[Payoff / insight]

Tweet 10 (CTA):
[CTA with bio link: "DM me 'AUDIT' for a free Loom teardown of your site. First 3 replies this week get it free."]
```

**Visual:** Attach the same screenshots from the LinkedIn carousel as individual images (up to 4 per tweet).

**Post time:** Wednesday 15:00 Istanbul (matches US morning scroll).

---

## Instagram carousel template

**Slides:** Exactly 6 slides (IG algorithm sweet spot in 2026).

**Format:**

```
Slide 1 — COVER:
[Hook text in large bold font over solid color background]
[Small "swipe →" indicator bottom right]

Slide 2 — CONTEXT:
[Problem statement in 2 lines + 1 supporting screenshot]

Slides 3–5 — BODY:
[One bullet per slide, each with its own screenshot or annotation]

Slide 6 — CTA:
[Big text: "DM me 'AUDIT' for a free site teardown"]
[Your handle + awab.design]
```

**Caption:** 100–200 chars. First line must stop the scroll on mobile. End with: "Link in bio → awab.design/pricing"

**Hashtags:** 8–15 hashtags in the first comment, mix of broad (#webdesign #smallbusiness) and niche (#istanbulbusiness #webdesignerturkey #freelancewebdesigner).

**Post time:** Thursday 19:00 Istanbul (evening scroll hour).

---

## TikTok slideshow template

**Note:** This is a slideshow (still images with text overlays), NOT a video. TikTok supports slideshow posts.

**Slides:** 6–8 slides, each 3 seconds.

**Format:**

```
Slide 1 — HOOK:
[Hook text white-on-black, large font, center screen]

Slides 2–7 — BODY:
[Same screenshots + bullets from the IG carousel]
[Add text overlay on each slide]

Slide 8 — CTA:
[White-on-black "DM me 'AUDIT' for a free site audit"]
[Your handle]
```

**Audio:** Pick a trending sound from TikTok's discover page — ideally something clinical/tech/minimal, not trendy dance audio. Length: 20–24 seconds matching the slideshow total.

**Caption:** 1 sentence hook + 3 hashtags max. Example: "Your slow website is killing your Istanbul business 💀 #webdesign #istanbul #smallbusiness"

**Post time:** Friday 18:00 Istanbul.

---

## Cross-channel CTA canonical string

Use this verbatim across all 4 channels so attribution is clean:

> Want a free 5-min teardown of YOUR site? DM me "AUDIT" — I'll send a Loom within 48h. Capped at 3 per week.

The "capped at 3 per week" line creates scarcity and matches the weekly capacity limit from the spec.
```

- [ ] **Step 2: Verify**

Run: `ls -la docs/traffic/content-templates.md && wc -l docs/traffic/content-templates.md`
Expected: file exists, >100 lines.

- [ ] **Step 3: Commit**

```bash
git add docs/traffic/content-templates.md
git commit -m "Add per-channel content templates (LinkedIn/Twitter/IG/TikTok)"
```

---

## Task 5: Write outbound message templates

**Files:**
- Create: `docs/traffic/outbound-templates.md`

**Context:** Spec specifies 5 clinic + 3 SMB touches per week. Each needs a different pitch angle. Clinic outreach OFFERS the audit (warmer, higher ticket). SMB outreach LEADS with the audit pre-recorded (more friction, lower ticket, volume play).

- [ ] **Step 1: Write the outbound templates file**

Write to `docs/traffic/outbound-templates.md`:

```markdown
# Outbound Message Templates

Weekly target: 5 clinic touches + 3 broad SMB touches.

Every outbound message must be logged in `outbound-log.md` on send.

---

## Clinic template 1 — LinkedIn DM (preferred)

**When to use:** Clinic has a LinkedIn company page OR the owner has a LinkedIn profile you can reach. LinkedIn is higher-trust than cold email.

```
Hi [First Name],

I came across [Clinic Name] — your aesthetic/dental/hair restoration work looks strong, and the English patient section shows you're serious about international bookings.

One thing I noticed: your website takes ~[X] seconds to load on mobile (I tested it this morning). For international patients searching from Dubai or London, anything above 3 seconds bleeds bookings. Google's own data says 53% of mobile users bounce when a site takes more than 3 seconds.

I specialize in fast, multilingual websites for Istanbul clinics. Two recent ones:
- Jouvence: https://www.awab.design/projects/jouvence
- EsteExpert: https://www.awab.design/projects/esteexpert

I'm happy to send a free 5-minute Loom teardown of [Clinic Name]'s site — no strings, no pitch. Just the 5 things I'd fix first.

Would that be useful?

— Awab
```

**Per-message customization (2 min):**
1. Replace `[First Name]`, `[Clinic Name]`
2. Test the mobile load time at https://pagespeed.web.dev — replace `[X]` with the actual LCP value
3. Pick "aesthetic/dental/hair restoration" based on the clinic's specialty

---

## Clinic template 2 — Cold email (fallback if no LinkedIn)

**Subject:** `Free 5-min audit for [Clinic Name]`

```
Hi [First Name],

I just tested [Clinic Name]'s website on mobile — it takes ~[X] seconds to load. For international patients, every second above 3 costs bookings (Google's own data: 53% bounce rate at 3s+).

I build fast multilingual sites for Istanbul clinics. Examples:
- Jouvence — https://www.awab.design/projects/jouvence
- EsteExpert — https://www.awab.design/projects/esteexpert

Want me to record a free 5-minute Loom teardown? Just the top 5 fixes. No strings.

Reply "Yes" and I'll send it in 48 hours.

— Awab
awab.design/services/clinic-websites
```

---

## Broad SMB template — Audit-led cold email

**When to use:** Restaurants, dentists (non-medical-tourism), lawyers, small retail, boutique hotels in Istanbul. Lower ticket ($150–$1500) so higher friction is justified.

**Subject:** `Free teardown of your site (Loom, 4 min)`

**Workflow:** Record the Loom FIRST, then send the email with the video attached. This is the opposite of the clinic flow — you're pre-investing to earn the reply.

```
Hi [First Name],

I built a free teardown of [Business Name]'s website. Loom, 4 minutes, no signup needed:

[Loom link]

TL;DR — 3 fixes would roughly double your mobile speed and probably add a noticeable lift to contact form submissions:
1. [Fix 1, e.g., "lazy-load the hero image"]
2. [Fix 2, e.g., "compress the menu PDF"]
3. [Fix 3, e.g., "add a sticky WhatsApp button"]

If you want these fixed, I do it for $150 flat (one-time, no retainer, no lock-in). Full site rebuilds start at $500.

Either way, the teardown is yours to keep.

— Awab
awab.design/pricing
```

**Per-message customization (5 min, includes Loom recording):**
1. Record the Loom — open the site, screen-record, narrate the 3 fixes
2. Fill in `[First Name]`, `[Business Name]`, and the 3 concrete fixes
3. Send

---

## Response handling

### When they reply "Yes" (clinic, template 1 or 2)

Within 48 hours, record the audit Loom and reply with:

```
Here's the teardown: [Loom link]

TL;DR — [top 3 fixes].

If any of these are worth fixing, I can handle them. Starting prices on awab.design/pricing.

Happy to jump on a 15-min call if useful — calendly link: [your cal link, if you have one]

— Awab
```

### When they don't reply within 5 days

Send one follow-up:

```
Hi [First Name] — just circling back. The audit offer still stands, no pressure. If you're not the right person, who should I send it to?

— Awab
```

### When they still don't reply after the follow-up

- Log the outcome as `no-reply` in `outbound-log.md`
- Do NOT send a third message
- Do NOT add to any email list (no lead magnet infra in v1)

---

## Boundaries

- **Max 1 follow-up per contact.** After that, stop.
- **No buying lists.** All sourcing is manual from Google Maps / LinkedIn / healthturkiye.com.
- **No misleading subject lines.** If it's not actually a free audit, don't say it is.
- **Always blur business names in teardown content posts** unless the owner consents in writing.
```

- [ ] **Step 2: Verify**

Run: `ls -la docs/traffic/outbound-templates.md && wc -l docs/traffic/outbound-templates.md`
Expected: file exists, >110 lines.

- [ ] **Step 3: Commit**

```bash
git add docs/traffic/outbound-templates.md
git commit -m "Add outbound templates (clinic LinkedIn/email + SMB audit-led)"
```

---

## Task 6: Write outbound log template

**Files:**
- Create: `docs/traffic/outbound-log.md`

**Context:** Tracks every outbound touch. Spec targets 8/week (5 clinic + 3 SMB), so ~32/month, ~400/year. Simple append-only markdown table. Migrate to Supabase later if volume justifies.

- [ ] **Step 1: Write the outbound log**

Write to `docs/traffic/outbound-log.md`:

```markdown
# Outbound Log

Every outbound touch gets one row. Log on send. Update the `Response` and `Outcome` columns as they come in.

## Source list

User-maintained Google Sheet (update link below when created):

**Source sheet link:** _TBD — create a Google Sheet named "Awab traffic — outbound source list" with two tabs: "clinics" and "smbs". Columns: Business name, Location, Contact name, Channel (LinkedIn / email / IG DM), URL, Qualified (Y/N), Notes._

## Weekly target

- 5 clinic touches (priority)
- 3 broad SMB touches (fallback)
- **Total: 8 per week**

## Log

| Date | Target type | Business | Contact | Channel | Template | Response | Outcome | Notes |
|---|---|---|---|---|---|---|---|---|
| YYYY-MM-DD | clinic | _example Clinic_ | Dr. _ | LinkedIn DM | clinic-1 | — | pending | _PageSpeed LCP 8.4s_ |

**Template column values:** `clinic-1` (LinkedIn DM), `clinic-2` (cold email), `smb-1` (audit-led email).

**Response column values:** `—` (no reply yet), `replied` (any reply), `bounced` (email bounced), `unsub` (asked to stop).

**Outcome column values:** `pending`, `audit-sent`, `call-booked`, `paid-client`, `no-reply`, `not-interested`, `declined`.

## Weekly summary

Append a row each Friday:

| Week | Clinic touches | SMB touches | Replies | Audits sent | Paid clients |
|---|---|---|---|---|---|
| YYYY-WW | 5 | 3 | 0 | 0 | 0 |

## Rules

- Log the touch **on send**, not later
- One follow-up max per contact (see outbound-templates.md)
- If a target is `paid-client`, move the row to the Success Cases section below AND note the revenue

## Success Cases

*(Move rows here when a target becomes a paid client. Include revenue for ROI tracking.)*
```

- [ ] **Step 2: Verify**

Run: `ls -la docs/traffic/outbound-log.md`
Expected: file exists.

- [ ] **Step 3: Commit**

```bash
git add docs/traffic/outbound-log.md
git commit -m "Add outbound log template + weekly summary schema"
```

---

## Task 7: Write directory sprint checklist

**Files:**
- Create: `docs/traffic/directory-checklist.md`

**Context:** One-time Saturday sprint, ~4 hours, 8 directories + review requests. The spec is explicit about which directories to do and skip, and references existing assets in the portfolio (case studies, services page).

- [ ] **Step 1: Write the directory sprint checklist**

Write to `docs/traffic/directory-checklist.md`:

```markdown
# Directory Sprint Checklist

**One-time sprint.** Target: one Saturday, ~4 hours total. Do NOT recur — directories are a one-shot indexing play.

## Shared assets (prep once, paste everywhere)

Copy these from `bio-copy.md` and keep the tab open the whole sprint.

- **Business name:** Awab Elkhalil — Web Designer & Developer (matches Google Business Profile)
- **Tagline:** Fast, multilingual websites for clinics & SMBs in Istanbul
- **Long bio (500 chars):** [paste from bio-copy.md]
- **Services list** (match `/services` page):
  - Landing Page Design — from $150
  - Business Website Design — from $500
  - Custom Website Development — from $1,500
  - UI/UX Design
  - SEO Setup
  - AI Chatbot Integration
  - Brand Identity Design
  - Website Maintenance
- **Portfolio screenshots** (3 featured projects from `src/data/projects.ts`, download from your live site):
  - Jouvence — https://www.awab.design/projects/jouvence (clinic)
  - EsteExpert — https://www.awab.design/projects/esteexpert (clinic)
  - Omar Marketing — https://www.awab.design/projects/omar-marketing (agency)
- **Pricing:** from $150
- **Contact email:** awabe.adam@gmail.com
- **Website:** https://www.awab.design
- **Location:** Istanbul, Türkiye
- **Languages:** English, Turkish, Arabic, French

---

## High-priority directories (~2 hours)

- [ ] **1. Clutch.co** — https://clutch.co
  - Create company profile
  - Upload 3 case studies: Jouvence, EsteExpert, Omar Marketing
  - Category: "Web Designers" → "Web Design Companies"
  - Location: Turkey → Istanbul
  - Hourly rate: your choice (public)
  - **Request 1 verified review** via Clutch's verification flow — send to Jouvence team or EsteExpert team
  - Verify profile is LIVE before closing the tab

- [ ] **2. Sortlist** — https://www.sortlist.com
  - Create provider profile
  - Same 3 projects uploaded
  - Regions: Istanbul + Turkey
  - Primary service: "Web Design"
  - Secondary: "SEO", "UX Design"
  - Verify profile is LIVE

- [ ] **3. DesignRush** — https://www.designrush.com
  - Create agency profile (free tier, no paid upgrade)
  - Same 3 projects
  - Category: "Web Design"
  - Specialty: "Medical"
  - Verify profile is LIVE

- [ ] **4. LinkedIn Services Page** — https://www.linkedin.com/services/
  - Enable "Services" on your LinkedIn profile
  - Add services: Web Design, Web Development, UX Design, SEO Consulting
  - Location: Istanbul
  - "Open to work" mode → Freelance
  - Upload 3 portfolio items from your profile's Featured section

---

## Medium-priority directories (~1 hour)

- [ ] **5. TechBehemoths** — https://techbehemoths.com
  - Create listing
  - Tags: Next.js, Medical, Multilingual, Istanbul, Web Design
  - Upload 3 projects
  - Verify profile is LIVE

- [ ] **6. Upwork** — https://www.upwork.com
  - Create/update freelancer profile
  - Title: "Freelance Web Designer | Fast Multilingual Sites for Istanbul Clinics & SMBs"
  - Upload 3 portfolio pieces
  - Skills: Next.js, React, Web Design, SEO, UI/UX, Multilingual, Shopify (if applicable), WordPress
  - Hourly rate: your choice
  - **Do NOT bid on jobs** — we're here to be found, not to compete on price
  - Verify profile is LIVE

- [ ] **7. GoodFirms** — https://www.goodfirms.co
  - Create company profile
  - Same 3 projects
  - Category: Web Design → Istanbul
  - Verify profile is LIVE

- [ ] **8. The Manifest** — https://themanifest.com
  - B2B directory, Clutch sister site (often auto-populated from Clutch — check first)
  - Create profile if not auto-populated
  - Verify profile is LIVE

---

## Skipped (do NOT do these — see spec)

- ❌ Fiverr (race to bottom, commodity pricing)
- ❌ Bionluk (Turkish only, mismatches EN social strategy)
- ❌ Bark (low lead quality)

---

## Review seeding (~30 min, parallel to the sprint)

Send the review request template to 4 past clients. Template is in `docs/seo-checklist.md` — copy it, personalize each, send.

- [ ] **Jouvence team**
  - Channel: WhatsApp or email (whichever you used for the project)
  - Link: Google Business Profile review link
  - Also ask about Clutch review

- [ ] **EsteExpert team**
  - Channel: WhatsApp or email
  - Same asks

- [ ] **Saphiredent (Dr. Ahmed Hassan)**
  - Channel: Direct contact
  - Google review + Clutch review

- [ ] **Estetikworld (Sarah Johnson)**
  - Channel: Direct contact
  - Google review

**Target:** 2 Google reviews + 1 Clutch review within the first 2 weeks of the sprint.

---

## Sprint complete checklist

Before closing the laptop on Saturday:

- [ ] All 8 directory profiles are LIVE (not drafts)
- [ ] NAP (Name, Address, Phone) is consistent across all 8
- [ ] All 8 link to `https://www.awab.design`
- [ ] All 4 review request messages are sent
- [ ] One row added to `metrics-log.md` under "Week 1 — directory sprint done"
```

- [ ] **Step 2: Verify**

Run: `ls -la docs/traffic/directory-checklist.md && wc -l docs/traffic/directory-checklist.md`
Expected: file exists, >100 lines.

- [ ] **Step 3: Commit**

```bash
git add docs/traffic/directory-checklist.md
git commit -m "Add one-time directory sprint checklist + review seeding"
```

---

## Task 8: Write metrics log template with baseline

**Files:**
- Create: `docs/traffic/metrics-log.md`

**Context:** Spec says track weekly, review monthly, hard kill criteria at 90 days. Baseline uses the GSC numbers from `docs/gsc-baseline-2026-04.md` (178 impressions, 1 click, 28-day window ending 2026-04-07).

- [ ] **Step 1: Write the metrics log**

Write to `docs/traffic/metrics-log.md`:

```markdown
# Metrics Log

Weekly numbers tracked by hand every Friday. Monthly review on the last Friday. Hard kill/scale review at day 90.

## Baseline (pre-launch — 2026-04-11)

Captured before traffic engine v1 starts, for delta measurement.

| Metric | Baseline value | Source |
|---|---|---|
| LinkedIn followers | ? | manual count on profile |
| Twitter/X followers | ? | manual count on profile |
| Instagram followers | ? | manual count on profile |
| TikTok followers | ? | manual count on profile |
| GSC impressions (28d) | 178 | `docs/gsc-baseline-2026-04.md` |
| GSC clicks (28d) | 1 | `docs/gsc-baseline-2026-04.md` |
| `/pricing` traffic from social | 0 | GA4 |
| `/contact` submissions from social | 0 | manual + GA4 |
| Paid clients from social/outbound | 0 | manual |

**Action:** On week 1 Friday, fill in the `?` values by checking each profile once.

---

## Weekly log

Append one row per week. Format `YYYY-WW` for the week column (ISO week number).

| Week | LI followers | LI avg impressions | X followers | IG followers | TikTok avg views | DMs 'AUDIT' | Audits sent | Outbound sent | Outbound replies | /pricing social traffic | /contact submissions | Paid clients |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-15 | | | | | | | | | | | | |
| 2026-16 | | | | | | | | | | | | |

**Week 4 targets (from spec):** LI +20 followers, LI avg 500 impressions, 1 DM/wk, 1 audit/wk, 8 outbound/wk, 10 /pricing hits from social, 0 paid clients (leading indicator).

**Week 12 targets:** LI +150 followers, LI avg 2000 impressions, 5 DMs/wk, 3 audits/wk, 8 outbound/wk, 80 /pricing hits from social, 1 paid client.

---

## Monthly review — last Friday of month

Copy this template each month:

### 2026-MM monthly review

- **Followers delta (all platforms):**
- **Best-performing post:** [title / URL / metrics]
- **Best-performing pillar this month:** T / B / C
- **Worst-performing pillar:** T / B / C
- **DMs received:**
- **Audits delivered:**
- **Paid clients sourced:**
- **Outbound reply rate:** X% (replies / sends)
- **Qualitative notes:**
- **Action for next month:** [tweak one thing — pillar mix, cadence, cta, channel]

---

## 90-day hard review

**Scheduled:** approximately 2026-07-10 (day 90 from 2026-04-11)

### Kill criteria (from spec)

Run this against the metrics above:

- [ ] **TikTok:** avg views ≥ 300 AND ≥1 DM attributed? If no → kill TikTok, reclaim 20min/wk
- [ ] **Pillars:** is any pillar's engagement < 50% of the best pillar's engagement over the past 4 weeks? If yes → kill that pillar, redistribute to top 2
- [ ] **Broad-SMB outbound:** ≥1 paid client from SMB outbound? If no → kill SMB outbound, keep clinic outbound
- [ ] **Channel double-down:** which single channel produced >60% of inbound DMs? → increase cadence there by 50%

### 90-day success criteria (from spec)

- [ ] 3+ paid clients sourced from social or outbound
- [ ] LinkedIn followers 400+
- [ ] ≥1 post broke 5000 impressions
- [ ] `/pricing` traffic from social > 300/mo
- [ ] 2+ net new Google reviews
- [ ] 1+ Clutch review

### 90-day escalation triggers

- [ ] Zero paid clients → rethink offer/positioning, not channels
- [ ] Plenty of views, zero DMs → CTA problem
- [ ] DMs but no conversions → audit quality or pricing objection
```

- [ ] **Step 2: Verify**

Run: `ls -la docs/traffic/metrics-log.md && wc -l docs/traffic/metrics-log.md`
Expected: file exists, >70 lines.

- [ ] **Step 3: Commit**

```bash
git add docs/traffic/metrics-log.md
git commit -m "Add metrics log template with baseline + 90-day kill criteria"
```

---

## Task 9: Update the top-level SEO strategic plan to reference this work

**Files:**
- Modify: `docs/seo-strategic-plan.md`

**Context:** The SEO plan is the current source of truth for growth strategy. Traffic engine v1 is a parallel workstream — it deserves a cross-reference so the two plans don't drift apart.

- [ ] **Step 1: Read the current SEO plan header to find a good insertion point**

Run: `head -30 docs/seo-strategic-plan.md`

- [ ] **Step 2: Add a reference to the traffic engine spec + plan right after the "Strategic Overview" section**

Open `docs/seo-strategic-plan.md` and find this section:

```markdown
### The Four Phases
| Phase | Timeframe | Focus | Status |
|-------|-----------|-------|--------|
| **1. Foundation Fixes** | Week 1 | Quick wins on existing pages | ✅ **SHIPPED** |
| **2. Clinic Niche Domination** | Week 2-3 | New landing page + case studies | ✅ **SHIPPED** |
| **3. Turkish Expansion** | Week 4-6 | Localize for the local market | 🔲 **NEXT** |
| **4. Content Engine** | Month 2-3 | Blog + ongoing publishing | 🔲 Pending |
```

Immediately after the closing of this section (before `## Phase 1 — Foundation Fixes ✅ COMPLETE`), add:

```markdown
### Parallel workstream — Traffic Engine v1 (non-SEO)

Social + outbound + directories are tracked separately in a dedicated spec and implementation plan:
- **Spec:** `docs/superpowers/specs/2026-04-11-traffic-strategy-design.md`
- **Plan:** `docs/superpowers/plans/2026-04-11-traffic-strategy.md`
- **Operational artifacts:** `docs/traffic/` (bio copy, templates, logs, metrics)

The traffic engine complements but does not replace the 4-phase SEO plan above. SEO is the compounding moat; traffic engine is the faster-feedback pipeline for direct leads.

---
```

- [ ] **Step 3: Verify the edit rendered**

Run: `grep -n "Traffic Engine v1" docs/seo-strategic-plan.md`
Expected: at least one match.

- [ ] **Step 4: Commit**

```bash
git add docs/seo-strategic-plan.md
git commit -m "Cross-reference traffic engine v1 from SEO strategic plan"
```

---

## Task 10 (manual): Profile updates across all 4 platforms

**Not a code task.** This is the first non-code task the user executes, following `docs/traffic/bio-copy.md` verbatim.

- [ ] **Step 1: Open `docs/traffic/bio-copy.md`** in your editor

- [ ] **Step 2: Update LinkedIn**
  - Headline, About, Contact info website, Location, Open to work — all per the "LinkedIn" section of bio-copy.md
  - Pin 3 Featured items: `/services/clinic-websites`, `/projects/jouvence`, `/projects/esteexpert`

- [ ] **Step 3: Update Twitter/X**
  - Name, Bio, Location, Website — all per the "Twitter/X" section of bio-copy.md

- [ ] **Step 4: Update Instagram**
  - Name, Bio, Link in bio, Category, Contact options — all per the "Instagram" section of bio-copy.md

- [ ] **Step 5: Update TikTok**
  - Name, Bio, Link in bio (or plain-text URL if under 1000 followers) — all per the "TikTok" section of bio-copy.md

- [ ] **Step 6: Capture baseline follower counts**
  - Open `docs/traffic/metrics-log.md` → Baseline table
  - Fill in the `?` cells for each platform's current follower count
  - Commit:
    ```bash
    git add docs/traffic/metrics-log.md
    git commit -m "Capture week 0 follower baseline across 4 platforms"
    ```

---

## Task 11 (manual): Directory sprint execution

**Not a code task.** Execute `docs/traffic/directory-checklist.md` end-to-end in one Saturday session. Tick each checkbox in the file as you go (edit the file, commit after each top-level section to preserve progress).

- [ ] **Step 1: Execute the high-priority directories section** (items 1–4 in the checklist)
  - Commit after completing: `git commit -am "Directory sprint: complete high-priority (Clutch, Sortlist, DesignRush, LinkedIn)"`

- [ ] **Step 2: Execute the medium-priority directories section** (items 5–8)
  - Commit: `git commit -am "Directory sprint: complete medium-priority (TechBehemoths, Upwork, GoodFirms, The Manifest)"`

- [ ] **Step 3: Send the 4 review request messages** (Jouvence, EsteExpert, Saphiredent, Estetikworld)
  - Commit: `git commit -am "Directory sprint: send 4 review requests to past clients"`

---

## Task 12 (manual): Build outbound source list (one-time)

**Not a code task.** Spec calls for 5 clinic + 3 SMB touches per week. Source list needs ~20 clinics + 10 SMBs queued to cover week 1 + 2.

- [ ] **Step 1: Create the Google Sheet** named "Awab traffic — outbound source list" with 2 tabs ("clinics", "smbs") and the columns specified in `docs/traffic/outbound-log.md` (Business name, Location, Contact name, Channel, URL, Qualified, Notes)

- [ ] **Step 2: Populate the "clinics" tab with 20 qualified Istanbul clinics**
  - Use Google Maps: search "aesthetic clinic Istanbul", "hair transplant Istanbul", "dental clinic Istanbul"
  - Use healthturkiye.com directory
  - Qualification filter: has a live website that is slow (PageSpeed LCP > 3s) OR single-language OR WordPress OR no online booking
  - Spend ~2 min per clinic testing with https://pagespeed.web.dev

- [ ] **Step 3: Populate the "smbs" tab with 10 qualified Istanbul SMBs**
  - Google Maps: restaurants, lawyers, small retailers, boutique hotels
  - Same qualification filter

- [ ] **Step 4: Copy the sheet's share link into `docs/traffic/outbound-log.md`** (replace the "TBD" placeholder under "Source list")

- [ ] **Step 5: Commit**
  ```bash
  git add docs/traffic/outbound-log.md
  git commit -m "Wire outbound source list sheet link into outbound log"
  ```

---

## Task 13 (manual): Week 1 content batch

**Not a code task.** Execute 1 full content cycle end-to-end using the seed idea #1 from `content-ideas.md` ("95% LCP drop" build-in-public).

- [ ] **Step 1: Monday — open `content-ideas.md`** and mark idea #1 status as `drafting`

- [ ] **Step 2: Tuesday — draft the LinkedIn post**
  - Use the LinkedIn template from `content-templates.md`
  - Hook: "I dropped my own site's mobile LCP from 64 seconds to 3 seconds. Here's the 7 things that actually moved the needle."
  - Body bullets from the Phase 1 fixes in `seo-strategic-plan.md`
  - Create 3–6 screenshot slides as a PDF carousel (use the PageSpeed report + your own site)
  - CTA: the canonical "DM me 'AUDIT'" string
  - Schedule or post at Tuesday 08:00 Istanbul

- [ ] **Step 3: Wednesday — fork to Twitter thread**
  - 6–10 tweets, 250 chars each
  - Use the same screenshots as individual images
  - Schedule or post at Wednesday 15:00 Istanbul

- [ ] **Step 4: Thursday — fork to Instagram 6-slide carousel**
  - Recompose the same screenshots for 1080×1350 vertical
  - Post Thursday 19:00 Istanbul
  - First comment: 8–15 hashtags

- [ ] **Step 5: Friday morning — fork to TikTok slideshow**
  - 6–8 slides, 3 seconds each
  - Pick a trending minimal/tech audio
  - Post Friday 18:00 Istanbul

- [ ] **Step 6: Friday evening — log the publish**
  - Open `content-ideas.md`
  - Move idea #1 from "Seed ideas" to "Published log"
  - Fill in URLs for all 4 channels
  - Commit:
    ```bash
    git add docs/traffic/content-ideas.md
    git commit -m "Week 1 content ship: Idea 1 (LCP drop) live on 4 channels"
    ```

---

## Task 14 (manual): Week 1 outbound batch

**Not a code task.** Execute first 8 outbound touches per spec.

- [ ] **Step 1: Pick the first 5 clinics** from the source sheet's "clinics" tab (highest-slowness first)

- [ ] **Step 2: Send clinic DM/email #1** using `outbound-templates.md` → clinic template 1 or 2
  - Personalize (2 min): first name, clinic name, actual PageSpeed LCP value, specialty
  - Log immediately in `outbound-log.md`

- [ ] **Step 3: Repeat for clinic contacts #2–5** (4 more touches)

- [ ] **Step 4: Pick the first 3 SMBs** from the source sheet's "smbs" tab

- [ ] **Step 5: Record the first SMB Loom audit** (Loom or equivalent screen recorder, ~5 min)
  - Open their site, narrate 3 concrete fixes, save, get the share link

- [ ] **Step 6: Send SMB email #1** using `outbound-templates.md` → broad SMB template
  - Paste the Loom link, fill in the 3 fixes from the recording
  - Log in `outbound-log.md`

- [ ] **Step 7: Repeat for SMB contacts #2–3** (2 more Loom recordings + 2 more emails)

- [ ] **Step 8: Friday — update `outbound-log.md` weekly summary row** for the current ISO week
  - Commit:
    ```bash
    git add docs/traffic/outbound-log.md
    git commit -m "Week 1 outbound batch complete: 5 clinic + 3 SMB touches logged"
    ```

---

## Task 15 (manual): Week 1 Friday retro + metrics log

**Not a code task.** 15-minute weekly loop close.

- [ ] **Step 1: Open `docs/traffic/metrics-log.md`**

- [ ] **Step 2: Append a row to the Weekly Log table** with current ISO week number and all metric values:
  - LinkedIn followers (count vs baseline)
  - LinkedIn avg impressions (from LinkedIn analytics, past 7 days)
  - Twitter/X, IG, TikTok follower counts
  - TikTok avg views
  - DMs received with "AUDIT"
  - Audits delivered this week
  - Outbound sent (should be 8)
  - Outbound replies (probably 0 in week 1)
  - `/pricing` social traffic (GA4 → query string `utm_campaign=traffic-engine-v1`)
  - `/contact` submissions from social
  - Paid clients (probably 0 in week 1)

- [ ] **Step 3: Commit**

```bash
git add docs/traffic/metrics-log.md
git commit -m "Week 1 metrics logged"
```

---

## Post-plan handoff

When all 15 tasks are complete:

1. The operational infrastructure is shipped (tasks 1–9) — markdown-only, fully versioned in git
2. The user has executed week 1 end-to-end (tasks 10–15) — profile updates, directory sprint, first content batch, first outbound batch, first metrics log entry
3. The weekly loop in `docs/traffic/README.md` is self-sustaining after week 1 — no further planning needed until the day-90 hard review

**Day 90 checkpoint** is pre-scheduled in `metrics-log.md` and pulls from the spec's kill criteria — does not need a new plan.

**Month 2 lead magnet work** (deferred email infra, `/free-checklist` route, 5-email sequence) will need its own spec + plan when the user decides to activate it. Trigger condition: DM funnel saturation (>3 audit requests/wk sustained for 2 weeks).
