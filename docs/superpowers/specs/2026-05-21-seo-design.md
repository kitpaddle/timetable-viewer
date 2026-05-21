# SEO Optimisation — avgangar.se

**Date:** 2026-05-21  
**Scope:** Approach B — quick wins + content signals  
**Site:** https://avgangar.se (Vue 3 + Vite SPA, deployed to GitHub Pages)

---

## Goals

- Maximise visibility for Swedish searches: "avgångar", "realtidsavgångar", "kollektivtrafik Sverige"
- Fix the hash-routing SEO blind spot so sub-pages are indexable
- Add a proper social sharing image
- Strengthen on-page signals without changing any user-facing features

---

## 1. Routing — HTML5 History

**Problem:** `createWebHashHistory` produces URLs like `avgangar.se/#/about`. Google treats everything after `#` as the same URL, so `/about` and `/privacy` are invisible to search engines.

**Fix:**
- `src/router.js`: change `createWebHashHistory` → `createWebHistory` (update import accordingly)
- Add `public/404.html`: GitHub Pages serves this on any unknown path. It encodes the path into a query string and redirects to `/`. `index.html` reads the query string on load and routes to the correct page. This is the standard GitHub Pages SPA workaround.
- Add the path-redirect script to `index.html` `<head>`

**Result:** Clean URLs — `avgangar.se/about`, `avgangar.se/privacy`. In-app navigation is unaffected. Old hash-based bookmarks still resolve.

---

## 2. Meta Tags & Title

All changes in `index.html`.

**Title:** `Avgångar – Realtidsavgångar för kollektivtrafik i Sverige`
- Leads with the exact keyword users type ("avgångar" with å)
- Domain (`avgangar.se`) already visible in the URL bar in search results — not repeated in title

**OG/Twitter titles:** Same as page title.

**Meta description:** Minor tweak to lead with the keyword more strongly. Keep existing content, ensure "avgångar" appears early.

**og:image:** `/og-image.png` (1200×630, option 4 banner — dark background, clock icon left with cyan separator, AVGANGAR.SE bold, monospace subtitle)

**twitter:card:** Upgrade from `summary` to `summary_large_image` to display the full banner.

**hreflang:**
```html
<link rel="alternate" hreflang="sv" href="https://avgangar.se/" />
<link rel="alternate" hreflang="x-default" href="https://avgangar.se/" />
```

---

## 3. OG Banner Image

**File:** `public/og-image.png` (1200×630px)  
**Generator:** `build-tools/generate-og-images.js` (already written, uses `sharp`)  
**Design (option 4):**
- Dark background (`#1a1a1a`), cyan 5px bottom bar
- Clock icon (260px, rendered from `favicon.svg` with corrected viewBox `-1 -1 34 34`) on the left
- Thin cyan vertical separator line
- `AVGANGAR.SE` in large bold Arial, white
- Subtitle and transport modes list in Courier New monospace, muted

The generator script will be updated to also output the chosen design directly as `public/og-image.png`. Both the generator script and the output PNG are committed to the repo.

---

## 4. Per-Route Titles & Noscript

**Per-route titles:** Each view sets `document.title` on mount:
- `HomePage`: `Avgångar – Realtidsavgångar för kollektivtrafik i Sverige`
- `AboutPage`: `Om Avgangar.se – Realtidsavgångar för kollektivtrafik i Sverige`
- `PrivacyPage`: `Integritetspolicy – Avgangar.se`

**Noscript fallback** in `index.html` `<body>`:
```html
<noscript>
  <p>Avgångar.se – Gratis realtidsavgångar och tidtabeller för kollektivtrafik i Sverige.
  Se nästa avgångar för bussar, tåg, tunnelbana, spårvagn och färjor. Inget konto behövs.</p>
</noscript>
```

---

## 5. JSON-LD Structured Data

Enhanced `WebApplication` schema in `index.html`:

```json
{
  "@context": "https://schema.org",
  "@type": ["WebApplication", "SoftwareApplication"],
  "name": "Avgangar.se",
  "url": "https://avgangar.se/",
  "description": "Realtidsavgångar och tidtabeller för kollektivtrafik i Sverige",
  "applicationCategory": "TravelApplication",
  "operatingSystem": "Any",
  "inLanguage": "sv-SE",
  "keywords": "avgångar, realtid, kollektivtrafik, buss, tåg, tunnelbana, spårvagn, färja, Sverige",
  "areaServed": {
    "@type": "Country",
    "name": "Sweden"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Avgangar.se",
    "url": "https://avgangar.se/"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "SEK"
  }
}
```

---

## 6. Sitemap

Update `public/sitemap.xml` to include all indexable routes:

| URL | Priority | Change frequency |
|-----|----------|-----------------|
| `https://avgangar.se/` | 1.0 | weekly |
| `https://avgangar.se/about` | 0.6 | monthly |
| `https://avgangar.se/privacy` | 0.3 | yearly |

---

## 7. Content Fixes

- `useLang.js`: the `sv` strings object — check `welcomeHero`, `welcomeMain`, `welcomeStep2`, `welcomeStep3` for any occurrence of the unaccented string `avgangar` (case-insensitive) and replace with `avgångar`
- `AboutPage.vue`: the `sv` content object — verify `intro` text and tile descriptions use "avgångar" not "avgangar" in body copy
- Domain references (`avgangar.se`, `Avgangar.se`) remain unchanged throughout

---

## Files Changed

| File | Change |
|------|--------|
| `src/router.js` | Switch to `createWebHistory` |
| `index.html` | Title, meta, OG, hreflang, JSON-LD, noscript, path-redirect script |
| `public/404.html` | New — GitHub Pages SPA redirect |
| `public/og-image.png` | New — 1200×630 social banner |
| `public/sitemap.xml` | Add `/about` and `/privacy` |
| `src/views/AboutPage.vue` | Add `document.title` on mount |
| `src/views/HomePage.vue` | Add `document.title` on mount |
| `src/views/PrivacyPage.vue` | Add `document.title` on mount |
| `src/composables/useLang.js` | Fix any unaccented "avgangar" in Swedish body strings |
| `build-tools/generate-og-images.js` | Already written — generates banner options |

---

## Out of Scope

- Server-side rendering / prerendering (not worthwhile for a real-time data app)
- Core Web Vitals / performance audit (Approach C)
- Backlink strategy (not a code change)
