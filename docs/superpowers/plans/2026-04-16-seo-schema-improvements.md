# SEO Schema & Structured Data Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the 6 structured data gaps identified in the full SEO audit to improve Google Search appearance and entity understanding.

**Architecture:** All changes are additive JSON-LD schema additions or minor edits in existing layout files. One new asset generation task (manifest icons). No new components, no new routes, no runtime behavior changes.

**Tech Stack:** Next.js App Router metadata, JSON-LD via `<script>` tags, SVG-to-PNG conversion

**Spec:** `docs/superpowers/specs/2026-04-16-seo-schema-improvements-design.md`

---

## File Map

| File | Change | Task |
|------|--------|------|
| `src/app/layout.tsx` | Add LocalBusiness JSON-LD, add `alternateName` to WebSite, remove `speakable` | 1, 3, 4 |
| `src/app/[locale]/about/layout.tsx` | Add ProfilePage JSON-LD | 2 |
| `src/app/[locale]/rate-calculator/layout.tsx` | Add Breadcrumbs import + component | 5 |
| `public/icon-192x192.png` | New file — generated from icon.svg | 6 |
| `public/icon-512x512.png` | New file — generated from icon.svg | 6 |

---

### Task 1: Add LocalBusiness Schema to Root Layout

**Files:**
- Modify: `src/app/layout.tsx:310` (insert new `<script>` block before closing `/>` of the WebSite/SiteNav script)

- [ ] **Step 1: Add LocalBusiness JSON-LD script tag**

Insert a new `<script type="application/ld+json">` block **after** the existing WebSite/SiteNav script tag (after line 310) and **before** `{children}` (line 312).

```tsx
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "@id": "https://www.awab.design/#business",
              name: "Awab Design",
              url: "https://www.awab.design",
              telephone: "+905541759945",
              email: "awabe.adam@gmail.com",
              image: "https://www.awab.design/img/hero-image.jpg",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Istanbul",
                addressCountry: "TR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 41.00824,
                longitude: 28.97836,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "18:00",
              },
              priceRange: "$150 - $1500+",
              areaServed: ["Worldwide", "Turkey", "France", "Middle East"],
              founder: { "@id": "https://www.awab.design/#person" },
              sameAs: [
                "https://www.linkedin.com/in/awab-adam/",
                "https://www.instagram.com/awabeladam/",
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5.0",
                reviewCount: "4",
                bestRating: "5",
              },
            }),
          }}
        />
```

- [ ] **Step 2: Verify the build**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(seo): add LocalBusiness/ProfessionalService JSON-LD schema"
```

---

### Task 2: Add ProfilePage Schema to About Layout

**Files:**
- Modify: `src/app/[locale]/about/layout.tsx:39-46` (add script tag inside the fragment)

- [ ] **Step 1: Add ProfilePage JSON-LD script tag**

In `src/app/[locale]/about/layout.tsx`, add a `<script>` tag inside the `<>` fragment, after the `<Breadcrumbs>` component and before `{children}`:

```tsx
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "About", url: "/about" },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            dateCreated: "2024-01-01",
            dateModified: "2026-04-16",
            mainEntity: {
              "@type": "Person",
              "@id": "https://www.awab.design/#person",
              name: "Awab Elkhalil",
              jobTitle: "Web Designer & Developer",
              description:
                "Professional web designer and developer in Istanbul specializing in modern, conversion-focused websites, UI/UX design, SEO, and AI chatbot integration.",
              image: "https://www.awab.design/img/hero-image.jpg",
              url: "https://www.awab.design",
              sameAs: [
                "https://www.linkedin.com/in/awab-adam/",
                "https://www.instagram.com/awabeladam/",
              ],
              knowsAbout: [
                "Web Design",
                "Web Development",
                "UI/UX Design",
                "SEO",
                "AI Chatbot Integration",
                "Next.js",
                "React",
                "TypeScript",
              ],
            },
          }),
        }}
      />
      {children}
    </>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/about/layout.tsx
git commit -m "feat(seo): add ProfilePage JSON-LD schema to about page"
```

---

### Task 3: Add `alternateName` to WebSite Schema

**Files:**
- Modify: `src/app/layout.tsx:289` (inside the WebSite JSON-LD object)

- [ ] **Step 1: Add alternateName property**

In `src/app/layout.tsx`, find the WebSite schema object (inside the array at ~line 286). Add `alternateName` after the `name` property:

Find:
```tsx
                name: "Awab Design",
                url: "https://www.awab.design",
```

Replace with:
```tsx
                name: "Awab Design",
                alternateName: ["Awab Elkhalil", "awab.design"],
                url: "https://www.awab.design",
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(seo): add alternateName to WebSite schema for site name fallbacks"
```

---

### Task 4: Remove Speakable from Person Schema

**Files:**
- Modify: `src/app/layout.tsx:274-277` (delete speakable block)

- [ ] **Step 1: Remove the speakable block**

In `src/app/layout.tsx`, find and delete the speakable property from the Person JSON-LD object (lines 274-277). Also remove the trailing comma on the line before it (the closing `]` of the last review at line 273 — ensure the JSON structure remains valid).

Find:
```tsx
              speakable: {
                "@type": "SpeakableSpecification",
                cssSelector: [".hero-subtitle", ".services-description"],
              },
```

Delete those 4 lines entirely. The `review` array's closing `],` on line 273 becomes the last property before the object closes.

- [ ] **Step 2: Verify the build**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "fix(seo): remove speakable schema (only supported for news publishers)"
```

---

### Task 5: Add Breadcrumbs to Rate Calculator Layout

**Files:**
- Modify: `src/app/[locale]/rate-calculator/layout.tsx:1` (add import) and `:128-136` (add component)

- [ ] **Step 1: Add Breadcrumbs import**

Add at line 2 of `src/app/[locale]/rate-calculator/layout.tsx` (after the existing `getTranslations` import):

```tsx
import Breadcrumbs from "@/components/seo/Breadcrumbs";
```

- [ ] **Step 2: Add Breadcrumbs component to the layout JSX**

In the return statement, add `<Breadcrumbs>` after the JSON-LD script tag and before `{children}`:

Find:
```tsx
      />
      {children}
    </>
```

Replace with:
```tsx
      />
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "Rate Calculator", url: "/rate-calculator" },
      ]} />
      {children}
    </>
```

- [ ] **Step 3: Verify the build**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/rate-calculator/layout.tsx
git commit -m "feat(seo): add breadcrumb schema to rate-calculator page"
```

---

### Task 6: Generate Manifest Icons

**Files:**
- Create: `public/icon-192x192.png`
- Create: `public/icon-512x512.png`

The existing SVG at `src/app/icon.svg` uses CSS `@media (prefers-color-scheme)` which won't render in a headless rasterizer. We need to generate static PNGs with the light-mode appearance (silver gradient background, black "A" letter).

- [ ] **Step 1: Generate both PNGs using a conversion script**

Run this from the project root. It creates simple light-mode SVGs (without media queries) and converts them via `sharp` (already a Next.js dependency):

```bash
node -e "
const sharp = require('sharp');
const svg = \`<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"512\" height=\"512\" viewBox=\"0 0 32 32\">
  <defs>
    <linearGradient id=\"silver-light\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">
      <stop offset=\"0%\" stop-color=\"#e8e8e8\"/>
      <stop offset=\"50%\" stop-color=\"#c0c0c0\"/>
      <stop offset=\"100%\" stop-color=\"#a0a0a0\"/>
    </linearGradient>
  </defs>
  <rect fill=\"url(#silver-light)\" width=\"32\" height=\"32\" rx=\"6\"/>
  <text fill=\"#000000\" x=\"16\" y=\"23\" text-anchor=\"middle\" font-family=\"system-ui, sans-serif\" font-weight=\"700\" font-size=\"24\" letter-spacing=\"-1.5\">A</text>
  <line stroke=\"#000000\" x1=\"8\" y1=\"26\" x2=\"24\" y2=\"26\" stroke-width=\"2\" stroke-linecap=\"round\"/>
</svg>\`;
const buf = Buffer.from(svg);
Promise.all([
  sharp(buf).resize(192, 192).png().toFile('public/icon-192x192.png'),
  sharp(buf).resize(512, 512).png().toFile('public/icon-512x512.png'),
]).then(() => console.log('Icons generated successfully'));
"
```

Expected output: `Icons generated successfully`

- [ ] **Step 2: Verify files exist and are reasonable size**

Run: `ls -la public/icon-192x192.png public/icon-512x512.png`
Expected: Both files exist, 192 is ~1-5KB, 512 is ~2-10KB.

- [ ] **Step 3: Commit**

```bash
git add public/icon-192x192.png public/icon-512x512.png
git commit -m "feat: generate manifest icons (192x192, 512x512) from SVG logo"
```

---

### Task 7: Final Verification

- [ ] **Step 1: Full build check**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds. All routes compile. No warnings about JSON-LD.

- [ ] **Step 2: Verify JSON-LD in rendered HTML**

Run: `npm run build && npm run start &` then after the server is up:

```bash
curl -s http://localhost:3000 | grep -o 'application/ld+json' | wc -l
```

Expected: `3` (Person, WebSite+SiteNav array, LocalBusiness — three script tags on the root layout)

```bash
curl -s http://localhost:3000/about | grep -o 'ProfilePage' | wc -l
```

Expected: `1`

```bash
curl -s http://localhost:3000/rate-calculator | grep -o 'BreadcrumbList' | wc -l
```

Expected: `1`

Then kill the server.

- [ ] **Step 3: Verify no speakable remains**

Run: `grep -r "speakable" src/app/layout.tsx`
Expected: No matches.

- [ ] **Step 4: Verify alternateName present**

Run: `grep -r "alternateName" src/app/layout.tsx`
Expected: One match containing `["Awab Elkhalil", "awab.design"]`.

- [ ] **Step 5: Verify manifest icons**

Run: `file public/icon-192x192.png public/icon-512x512.png`
Expected: Both are PNG image data, 192x192 and 512x512 respectively.
