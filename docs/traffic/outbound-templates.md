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
