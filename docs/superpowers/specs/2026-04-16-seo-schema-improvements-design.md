# SEO Schema & Structured Data Improvements
**Date:** 2026-04-16
**Scope:** Code-shippable structured data gaps identified in full SEO audit
**Approach:** A (Schema & Structured Data Focus)

---

## Summary

Six targeted changes to close gaps between current implementation and Google Search Central requirements. All additive — no breaking changes to existing functionality.

---

## 1. LocalBusiness Schema (New)

**File:** `src/app/layout.tsx`
**What:** Add a dedicated `LocalBusiness` (subtype `ProfessionalService`) JSON-LD `<script>` tag.

**Properties:**
- `@type`: `"ProfessionalService"` (subtype of LocalBusiness)
- `@id`: `"https://www.awab.design/#business"`
- `name`: `"Awab Design"`
- `url`: `"https://www.awab.design"`
- `telephone`: `"+905541759945"`
- `email`: `"awabe.adam@gmail.com"`
- `image`: `"https://www.awab.design/img/hero-image.jpg"`
- `address`: PostalAddress with `addressLocality: "Istanbul"`, `addressCountry: "TR"`
- `geo`: GeoCoordinates with Istanbul city-center lat/lng (5+ decimal places)
- `openingHoursSpecification`: Mon-Fri, 09:00-18:00
- `priceRange`: `"$150 - $1500+"`
- `areaServed`: `["Worldwide", "Turkey", "France", "Middle East"]`
- `founder`: `{ "@id": "https://www.awab.design/#person" }` (links to existing Person entity)
- `aggregateRating`: mirrors existing Person entity rating (5.0, 4 reviews)
- `sameAs`: LinkedIn, Instagram URLs

**Why:** Google requires a dedicated LocalBusiness entity for rich business results (hours, directions, ratings). Reinforces GBP connection. Currently only exists as a type annotation on the Person entity.

---

## 2. ProfilePage Schema on About Page (New)

**File:** `src/app/[locale]/about/layout.tsx`
**What:** Add `ProfilePage` JSON-LD `<script>` tag.

**Properties:**
- `@type`: `"ProfilePage"`
- `dateCreated`: `"2024-01-01"` (site launch approximate)
- `dateModified`: `"2026-04-16"`
- `mainEntity`:
  - `@type`: `"Person"`
  - `@id`: `"https://www.awab.design/#person"` (references root entity)
  - `name`: `"Awab Elkhalil"`
  - `jobTitle`: `"Web Designer & Developer"`
  - `description`: brief professional description
  - `image`: `"https://www.awab.design/img/hero-image.jpg"`
  - `sameAs`: LinkedIn, Instagram
  - `knowsAbout`: key skills array
  - `url`: `"https://www.awab.design"`

**Why:** Google supports ProfilePage for creator profiles. Enhances author identity signals for E-E-A-T and "Discussions and Forums" features.

---

## 3. Breadcrumbs on Rate Calculator (New)

**File:** `src/app/[locale]/rate-calculator/layout.tsx`
**What:** Add `<Breadcrumbs>` component (already exists at `src/components/seo/Breadcrumbs.tsx`).

**Items:**
1. Home → `/`
2. Rate Calculator → `/rate-calculator`

**Why:** Only remaining page without breadcrumb schema. All other pages already have it.

---

## 4. WebSite Schema — `alternateName` (Edit)

**File:** `src/app/layout.tsx` (WebSite JSON-LD block, ~line 288)
**What:** Add `alternateName` property to existing WebSite schema.

**Value:** `["Awab Elkhalil", "awab.design"]`

**Why:** Provides Google fallback site names. Helps correct site name display in search results.

---

## 5. Remove Speakable (Edit)

**File:** `src/app/layout.tsx` (Person JSON-LD block, ~line 274-277)
**What:** Delete the `speakable` block.

```json
// DELETE THIS:
"speakable": {
  "@type": "SpeakableSpecification",
  "cssSelector": [".hero-subtitle", ".services-description"]
}
```

**Why:** Speakable is only supported for news publishers. No effect on portfolio/business sites. Removing keeps schema clean and prevents validation warnings.

---

## 6. Generate Manifest Icons (New files)

**Files:** `public/icon-192x192.png`, `public/icon-512x512.png`
**What:** Generate both PNG files from existing `src/app/icon.svg` (the "A" logo with gradient background).

**Specs:**
- 192x192px PNG, square
- 512x512px PNG, square
- Match the SVG's visual design (gradient background, white "A" letterform)

**Why:** `manifest.json` already references these files but they don't exist. Broken icon references hurt PWA install prompts and Google's favicon discovery.

---

## Files Changed

| File | Change Type |
|------|-------------|
| `src/app/layout.tsx` | Edit: add LocalBusiness JSON-LD, add alternateName to WebSite, remove speakable |
| `src/app/[locale]/about/layout.tsx` | Edit: add ProfilePage JSON-LD |
| `src/app/[locale]/rate-calculator/layout.tsx` | Edit: add Breadcrumbs import + component |
| `public/icon-192x192.png` | New file |
| `public/icon-512x512.png` | New file |

## Validation

After implementation, verify all JSON-LD with Google's Rich Results Test: https://search.google.com/test/rich-results
