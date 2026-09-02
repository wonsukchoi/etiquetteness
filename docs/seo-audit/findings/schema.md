# Schema.org Audit — etiquetteness.com

**Score: 53/100** (up from 40/100 on 2026-09-02 baseline)

Re-fetched live via `curl` (Astro static site, JSON-LD is server-rendered, no JS needed): homepage `/`, entry page `/etiquette/japan/dining-slurping-noodles/`, a second entry `/etiquette/france/social-la-bise-cheek-kiss/`, country hub `/country/japan/`, category hub `/category/dining/`, `/about/`, and `/search/`. Cross-checked against source (`src/pages/**/*.astro`, `src/lib/publishedDates.ts`) to confirm the template, not just one sample.

## 0. Changes Since Last Audit (2026-09-02, 40/100)

| Item | Status | Detail |
|---|---|---|
| `image` on Article | ✅ **Fixed** | Real per-entry OG image now wired in: `image: new URL('/og/${entry.id}.png', Astro.site)`. Verified live — `https://etiquetteness.com/og/japan/dining-slurping-noodles.png` and `.../og/france/social-la-bise-cheek-kiss.png` both return `HTTP/2 200`, `content-type: image/png`; downloaded and confirmed a genuine 1200×630 RGBA PNG (28.8 KB, not a blank/placeholder). |
| `og:image`/`twitter:image` | ✅ **Fixed** | Both meta tags now point at the same real per-entry PNG and resolve with 200. Homepage still correctly falls back to the static `/og-image.jpg` (also verified 200, `cf-cache-status: HIT`). |
| `datePublished` missing | ✅ **Fixed** | Now populated site-wide via `getPublishedDates()` (`src/lib/publishedDates.ts`), which derives it from `git log --diff-filter=A` — the commit that first added each `.mdx` file — with a real ISO timestamp (e.g. `2026-09-02T19:18:19+09:00`, i.e. includes actual time-of-day, not just a date). This is exactly the git-history-based fix recommended in the prior audit. |
| `dateModified` = "now" bug | ✅ **Fixed** | No longer computed at request time. Now sourced from `entry.data.updatedAt` frontmatter (author-maintained, coerced to a `Date` by the content schema). Mechanism is correct. |
| Breadcrumb name casing (Low) | ✅ **Fixed** | Middle breadcrumb now renders `"Japan"` (via `COUNTRY_META` label lookup), not the raw slug `"japan"`. |
| `about` type mismatch (High) | ❌ **Still open** | `about` is still a bare string (`"about":"japan"`) in the live JSON-LD. Unchanged from baseline — same fix from the prior report (wrap in `Country`/`Place`) was never applied. |
| `author` missing (High) | ❌ **Still open** | No `author` property on Article, no byline anywhere in rendered HTML. |
| `publisher` / `Organization` (Medium) | ❌ **Still open** | No `Organization` entity exists anywhere on the site to reference. |
| `mainEntityOfPage`, `@id` (Low) | ❌ **Still open** | Not added. |
| Homepage `SearchAction` (Medium) | ❌ **Still open** | Homepage `WebSite` block is unchanged — still no `potentialAction`. |
| Category hub pages — zero JSON-LD (High) | ❌ **Still open** | Confirmed live: `curl -s https://etiquetteness.com/category/dining/ | grep -c 'application/ld+json'` → `0`. Source (`src/pages/category/[category].astro`) has no `<script type="application/ld+json">` at all. |
| Country hub pages — zero JSON-LD | ⚠️ **New finding, same class of issue** | Not explicitly sampled in the prior audit, but confirmed now: `src/pages/country/[country].astro` also ships zero structured data (`curl ... /country/japan/ | grep -c 'application/ld+json'` → `0`). This roughly **doubles** the surface area of the "hub pages have no schema" gap — 16 country pages + 3 category pages, all unmarked. |
| `/about/` page | ⚠️ **New page, thin schema** | Didn't exist in the prior audit. Now ships `@type: AboutPage` — valid, but minimal (no `mainEntity` linking to an `Organization`/`Person`, despite the page now naming a real maintainer via GitHub/email and the site being publicly identified). |
| Content license (CC BY-NC 4.0) | ⚠️ **New opportunity** | Site went public with dual licensing (`LICENSE` = MIT for code, `src/content/etiquette/LICENSE` = CC BY-NC 4.0 for entries), confirmed via `README.md`. This is not reflected anywhere in schema — no `license` property on `Article`/`CreativeWork`. Not required for Google rich results, but increasingly relevant for AI/LLM content-reuse and licensing-aware crawlers (GEO signal), and it's a one-line addition now that the license is finalized. |

## 1. Detection Results

| Page type | Sample | JSON-LD blocks | Types found |
|---|---|---|---|
| Homepage `/` | 1 page | 1 | `WebSite` |
| Article `/etiquette/{country}/{slug}/` | 2 pages sampled (japan, france) + template review | 1 each (`@graph`) | `Article` + `BreadcrumbList` |
| Country hub `/country/{country}/` | 1 page (japan) | **0** | none |
| Category hub `/category/{name}/` | 1 page (dining) | **0** | none |
| `/about/` | 1 page | 1 | `AboutPage` (new) |
| `/search/` | 1 page | **0** | none (fine — utility page) |

No Microdata or RDFa found anywhere. All existing markup correctly uses `@context: "https://schema.org"` and JSON-LD — good baseline, unchanged.

Live Article block (`/etiquette/japan/dining-slurping-noodles/`, fetched via `curl`):
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Slurping noodles is polite, not rude",
      "description": "Slurp hot noodle dishes like ramen, soba, and udon audibly — it's read as enjoying the food, not as bad manners.",
      "articleSection": "Dining",
      "about": "japan",
      "datePublished": "2026-09-02T19:18:19+09:00",
      "dateModified": "2026-09-02T00:00:00.000Z",
      "image": "https://etiquetteness.com/og/japan/dining-slurping-noodles.png",
      "url": "https://etiquetteness.com/etiquette/japan/dining-slurping-noodles/",
      "isPartOf": { "@type": "WebSite", "name": "Etiquetteness", "url": "https://etiquetteness.com/" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://etiquetteness.com/" },
        { "@type": "ListItem", "position": 2, "name": "Japan", "item": "https://etiquetteness.com/country/japan/" },
        { "@type": "ListItem", "position": 3, "name": "Slurping noodles is polite, not rude", "item": "https://etiquetteness.com/etiquette/japan/dining-slurping-noodles/" }
      ]
    }
  ]
}
```
Confirmed identical shape on the France sample and by reading the shared template (`src/pages/etiquette/[...slug].astro`) — one fix at the template level still fixes all ~94 entries.

## 2. Validation Results

### Homepage `WebSite` — PASS (minimal, unchanged)
- ✅ Valid `@type`, `https` context, absolute URL.
- Info: still no `potentialAction` (SearchAction) despite a working `/search/` page.

### Article — PARTIAL PASS (improved, but core issues remain)

| Check | Result | Detail |
|---|---|---|
| `@context` https | ✅ Pass | |
| `@type` not deprecated | ✅ Pass | |
| `headline`/`description` present | ✅ Pass | |
| `about` value type | ❌ **Error (High, unresolved)** | Still a bare string (`"japan"`). Schema.org's `about` range is `Thing`, not `Text` — invalid against spec, will trip Google's Rich Results Test as a type mismatch. |
| `image` | ✅ **Pass (newly fixed)** | Real, verified-live 1200×630 PNG per entry, generated at build time via `scripts/generate-og-images.ts` (satori + resvg). Meets Google's Article image requirement. |
| `author` | ❌ **Missing (High, unresolved)** | Still no `author` property and no visible byline. This remains the most consequential open gap for both Google's Article eligibility and general E-E-A-T. |
| `datePublished` | ✅ **Pass (newly fixed)** | Present, ISO 8601, sourced from real git first-commit timestamp per file (not a placeholder or "now"). |
| `dateModified` accuracy | ✅ **Pass, mechanism fixed — one caveat** | No longer derived from request time; now pulled from frontmatter `updatedAt`. **Caveat (Info, not a bug):** all 94 content files currently carry `updatedAt: 2026-09-02` because the whole repo's commit history was authored in a single day (`git log` shows every commit — from "Initial Astro site" through "Expand Guam etiquette entries" — dated 2026-09-02). This is a property of the repo's current age, not a code defect; the fix itself is correct and will produce genuinely differentiated dates as real edits land over subsequent days/weeks. Recommend authors only bump `updatedAt` on substantive content edits going forward (not on unrelated commits) so the signal stays trustworthy. |
| `publisher` | ❌ **Missing (Medium, unresolved)** | No `publisher`, and no `Organization` entity anywhere on the site to reference. |
| `mainEntityOfPage` | ❌ **Missing (Low, unresolved)** | |
| `@id` | ❌ **Missing (Low, unresolved)** | |
| `license` | ⚠️ **New opportunity (Low)** | Content is now formally CC BY-NC 4.0 (`src/content/etiquette/LICENSE`, referenced from `README.md`); schema doesn't reflect this yet. |
| No placeholder text | ✅ Pass | |

### Article `BreadcrumbList` — PASS (improved)
- ✅ Correct `ListItem` structure, absolute URLs, sequential `position`.
- ✅ **Fixed since last audit:** middle-level breadcrumb name is now title-cased via `COUNTRY_META` (`"Japan"`, not raw slug `"japan"`). Also now links to a trailing-slash URL (`/country/japan/`) consistently.

### Country hub pages (`/country/{country}/`) — FAIL (new finding)
- ❌ **No JSON-LD at all (High).** Confirmed live and in source (`src/pages/country/[country].astro`): no `<script type="application/ld+json">` anywhere in the template. 16 country pages, each aggregating multiple articles, ship zero structured data — no `BreadcrumbList`, no `CollectionPage`. Not explicitly called out in the prior audit (which sampled only category pages) but is the same defect, doubling the total affected hub-page count.

### Category hub pages (`/category/{name}/`) — FAIL (unchanged)
- ❌ **No JSON-LD at all (High).** Confirmed unchanged from baseline via live `curl` and source review (`src/pages/category/[category].astro`). Still the largest single structured-data gap by page count and content volume.

### `/about/` — PASS (new page, room to strengthen)
- ✅ Valid `AboutPage`, correct context, absolute URL, real description (no placeholders).
- Info: no `mainEntity` pointing at an `Organization`/`Person`. The page now names a real maintainer (GitHub `wonsukchoi`, email) and the project is public — a good opportunity to add an `Organization` (or `Person`) entity here and reuse it site-wide as `publisher`/`author`.

### `/search/` — PASS (no schema needed, unchanged)

## 3. Non-schema notes (context for §2)
- OG image pipeline is confirmed working end-to-end in production: build-time satori/resvg generation → real files under `/og/{country}/{slug}.png` → correctly referenced in both `og:image`/`twitter:image` meta and Article `image` JSON-LD → verified to return HTTP 200 with real (non-empty, correctly-sized) image bytes for two independently sampled entries (Japan, France).
- Site is now public with a dual license (MIT code / CC BY-NC 4.0 content) — no license metadata in HTML `<head>` (e.g. no `<link rel="license">`) or schema yet. Low priority, but cheap to add now that it's finalized.

## 4. Missing Opportunities & Ready-to-Use JSON-LD

### A. Organization schema (still not implemented — add once, e.g. homepage/global)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://etiquetteness.com/#organization",
  "name": "Etiquetteness",
  "url": "https://etiquetteness.com/",
  "logo": {
    "@type": "ImageObject",
    "url": "https://etiquetteness.com/og-image.jpg",
    "width": 1200,
    "height": 630
  },
  "description": "The etiquette nobody writes down: unwritten cultural and social rules, by country and situation.",
  "sameAs": ["https://github.com/wonsukchoi/etiquetteness"]
}
```
Note: prefer a dedicated square/near-square logo (min 112×112px) over the 1200×630 OG image if one gets made; `og-image.jpg` is at least a real, live asset today so it's an acceptable interim `logo` value (better than the previously-suggested nonexistent `favicon.svg`).

### B. WebSite with SearchAction (still not implemented)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://etiquetteness.com/#website",
  "name": "Etiquetteness",
  "description": "The etiquette nobody writes down: unwritten cultural and social rules, by country and situation.",
  "url": "https://etiquetteness.com/",
  "publisher": { "@id": "https://etiquetteness.com/#organization" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://etiquetteness.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```
Confirm the real query-param name `/search/` reads before shipping.

### C. Fixed Article template (`src/pages/etiquette/[...slug].astro`) — targeted diff, not a rewrite
The `image`/`datePublished`/`dateModified` work is done; only these remain:
```json
{
  "@type": "Article",
  "@id": "https://etiquetteness.com/etiquette/japan/dining-slurping-noodles/#article",
  "headline": "Slurping noodles is polite, not rude",
  "description": "Slurp hot noodle dishes like ramen, soba, and udon audibly — it's read as enjoying the food, not as bad manners.",
  "articleSection": "Dining",
  "about": { "@type": "Country", "name": "Japan" },
  "datePublished": "2026-09-02T19:18:19+09:00",
  "dateModified": "2026-09-02T00:00:00.000Z",
  "image": "https://etiquetteness.com/og/japan/dining-slurping-noodles.png",
  "url": "https://etiquetteness.com/etiquette/japan/dining-slurping-noodles/",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://etiquetteness.com/etiquette/japan/dining-slurping-noodles/"
  },
  "isPartOf": { "@id": "https://etiquetteness.com/#website" },
  "publisher": { "@id": "https://etiquetteness.com/#organization" },
  "author": {
    "@type": "Organization",
    "@id": "https://etiquetteness.com/#organization",
    "name": "Etiquetteness"
  },
  "license": "https://creativecommons.org/licenses/by-nc/4.0/"
}
```
Implementation notes:
- `about`: swap `entry.data.country` (bare string) for `{ '@type': 'Country', name: countryLabel }` — `countryLabel` is already computed in the template from `COUNTRY_META`, so this is a ~2-line change, not new plumbing.
- `author`/`publisher`: point at the `Organization` `@id` proposed in §A — no fabricated `Person`, consistent with the prior audit's reasoning, since no real bylines exist site-wide.
- `license`: new since last audit — content is now formally CC BY-NC 4.0; this is a static string, safe to add immediately.

### D. Person schema — still deferred, unchanged guidance
Only add once real per-entry bylines exist; reference via `author: { "@id": ".../authors/x#person" }` at that point.

### E. Country + category hub pages — CollectionPage + BreadcrumbList + ItemList (both templates currently at zero)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://etiquetteness.com/country/japan/#webpage",
      "url": "https://etiquetteness.com/country/japan/",
      "name": "Etiquette in Japan",
      "description": "Unwritten etiquette rules for Japan, by category.",
      "isPartOf": { "@id": "https://etiquetteness.com/#website" },
      "about": { "@type": "Country", "name": "Japan" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://etiquetteness.com/" },
        { "@type": "ListItem", "position": 2, "name": "Japan", "item": "https://etiquetteness.com/country/japan/" }
      ]
    },
    {
      "@type": "ItemList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "url": "https://etiquetteness.com/etiquette/japan/dining-slurping-noodles/" }
      ]
    }
  ]
}
```
Same shape for `/category/{name}/`, swapping `about` to a generic `Thing` (e.g. `{ "@type": "Thing", "name": "Dining etiquette" }`) as in the prior audit's recommendation. `ItemList` is worth adding here specifically (upgraded from "optional" in the prior audit to "recommended") because both hub-page types now list a non-trivial, growing number of articles (94 entries across 16 countries / 3 categories) — enumerating them explicitly helps crawlers and LLMs resolve the full entry set even if pagination or client-side filtering is ever added to these list views. Cap `itemListElement` at the entries actually rendered per page (don't enumerate beyond what's visible).

### F. About page — strengthen with mainEntity
```json
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://etiquetteness.com/about/#webpage",
  "name": "About Etiquetteness",
  "description": "Why Etiquetteness exists, how entries get sourced and checked, and what to do if one of them is wrong.",
  "url": "https://etiquetteness.com/about",
  "isPartOf": { "@id": "https://etiquetteness.com/#website" },
  "mainEntity": { "@id": "https://etiquetteness.com/#organization" }
}
```
Depends on §A shipping first (needs the `Organization` `@id` to point to).

### G. FAQPage / QAPage — no change, still do not add speculatively
No FAQ-style content found on any sampled page. Per current guidance, FAQPage produces no Google SERP rich result (site-wide retirement effective May 7, 2026). No action needed unless genuine Q&A content is written for GEO/AI-citation purposes (use `QAPage` if it's user-submitted).

## 5. Priority Summary

- **High (unresolved from baseline):** Fix `about` type mismatch on every Article (§C); add `author` (§A + §C); add JSON-LD to category **and** country hub pages (§E) — this is now the single largest gap, roughly double the page count previously scoped.
- **Medium (unresolved from baseline):** Add `Organization` + `publisher` linkage (§A); add homepage `SearchAction` (§B).
- **Low:** Add `@id`/`mainEntityOfPage` (§C); add `license` reflecting the new CC BY-NC 4.0 status (§C); strengthen `/about/` with `mainEntity` (§F).
- **Resolved since last audit — no further action needed:** `image` on Article + `og:image`/`twitter:image` (verified live), `datePublished`, `dateModified` no-longer-computed-at-request-time, breadcrumb name title-casing.
- **Info only:** all `updatedAt` values currently coincide at `2026-09-02` because the repo's entire commit history is same-day (not a code defect — will self-correct as real edits accumulate over time; keep an eye on it in the next re-audit to confirm dates actually diverge).
