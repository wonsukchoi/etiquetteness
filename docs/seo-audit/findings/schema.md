# Schema.org Audit — etiquetteness.com

Fetched via curl (raw HTML, no JS rendering needed — Astro site, JSON-LD is server-rendered): homepage, 3 category pages, 10 article pages across 9 countries, and `/search`. Raw HTML saved under `raw/` for reference.

## 1. Detection Results

| Page type | Sample | JSON-LD blocks | Types found |
|---|---|---|---|
| Homepage `/` | 1 page | 1 | `WebSite` |
| Article `/etiquette/{country}/{slug}/` | 10 pages | 1 each (`@graph`) | `Article` + `BreadcrumbList` |
| Category `/category/{name}/` | 3 pages (dining, business, social) | **0** | none |
| `/search/` | 1 page | **0** | none |

No Microdata or RDFa found anywhere. All existing markup correctly uses `@context: "https://schema.org"` (not http) and JSON-LD format — good baseline.

Example of current Article block (from `/etiquette/japan/business-card-two-hands/`):
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Exchange business cards with two hands",
      "description": "Present and receive meishi (business cards) with both hands, and read the card before putting it away.",
      "articleSection": "Business",
      "about": "japan",
      "dateModified": "2026-09-02T00:00:00.000Z",
      "url": "https://etiquetteness.com/etiquette/japan/business-card-two-hands/",
      "isPartOf": { "@type": "WebSite", "name": "Etiquetteness", "url": "https://etiquetteness.com/" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://etiquetteness.com/" },
        { "@type": "ListItem", "position": 2, "name": "japan", "item": "https://etiquetteness.com/country/japan" },
        { "@type": "ListItem", "position": 3, "name": "Exchange business cards with two hands", "item": "https://etiquetteness.com/etiquette/japan/business-card-two-hands/" }
      ]
    }
  ]
}
```
This exact shape (only `about` value and content fields change) was confirmed identical across all 10 sampled articles across Japan, France, Korea, India, Italy, Germany, Saudi Arabia, UK, and global — it's a shared template, so every fix below should be made once at the template level.

## 2. Validation Results

### Homepage `WebSite` — PASS (minimal)
- ✅ Valid `@type`, `@context: https://schema.org`, absolute URL.
- Info: no `potentialAction` (SearchAction) despite the site having a working `/search/` page — missed sitelinks-search opportunity (see §4).

### Article — FAIL (multiple issues)

| Check | Result | Detail |
|---|---|---|
| `@context` https | ✅ Pass | |
| `@type` not deprecated | ✅ Pass | |
| `headline`/`description` present | ✅ Pass | |
| **`about` value type** | ❌ **Error (High)** | `about` is a bare string (`"japan"`, `"france"`, `"global"`...). Schema.org's `about` property range is `Thing`, not `Text`. A plain string is invalid against the spec and Google's Rich Results Test will show a "value could not be parsed" / type-mismatch warning. Fix: wrap in a `Country`/`Place` entity (see §4). |
| `image` | ❌ **Missing (High)** | No `image` field, and no `og:image` meta tag or `<img>` anywhere on the sampled pages either — the site currently ships **zero images**. Google's Article guidelines list `image` as required for image-based rich result eligibility (large thumbnail in Search/Discover). Without a real image asset, don't add a placeholder URL — flag this as a content gap first (see §3), then wire it into schema once art exists. |
| `author` | ❌ **Missing (High)** | No `author` property, and no visible byline in the rendered HTML either. Google lists `author` (name, and ideally a `url`/`sameAs`) as required for Article eligibility and it's a core E-E-A-T signal, especially valuable for an editorial trust site like this. |
| `datePublished` | ❌ **Missing (Medium)** | Only `dateModified` is present. `datePublished` is recommended by Google and useful for both SERP freshness display and LLM citation dating. |
| `dateModified` accuracy | ⚠️ **Error (High)** | All 10 sampled articles — spanning wildly different countries/topics — return the exact same `dateModified`: `2026-09-02T00:00:00.000Z`, matching **today's date at request time**. This strongly indicates the value is generated dynamically (`new Date()` truncated to midnight) rather than pulled from real content-edit history. A `dateModified` that always equals "now" is a misleading freshness signal to Google and to LLMs doing recency-weighted citation, and can look manipulative if detected. Fix: derive from actual last-git-commit-date or CMS `updatedAt` per content file, not request time. |
| `publisher` | ❌ **Missing (Medium)** | No `publisher` (Organization + logo) on the Article, and no standalone `Organization` schema exists anywhere on the site to point to. |
| `mainEntityOfPage` | ❌ **Missing (Low)** | Recommended for Article/BlogPosting canonicalization; currently relies solely on `url`. |
| `@id` | ❌ **Missing (Low)** | Not required but recommended for entity de-duplication across the `@graph`. |
| No placeholder text | ✅ Pass | Content is real, no `[Business Name]`-style placeholders. |

### Article `BreadcrumbList` — PASS
- ✅ Correct `ListItem` structure, absolute URLs, sequential `position`.
- ✅ Verified breadcrumb target URLs resolve: `https://etiquetteness.com/country/france/` etc. return HTTP 200 (not broken links).
- Info (Low): breadcrumb `name` for the middle level is the raw slug (`"japan"`, `"united-kingdom"`), not title-cased (`"Japan"`, `"United Kingdom"`). Cosmetic but worth fixing for display consistency in SERP breadcrumb trails.

### Category pages (`/category/dining/`, `/category/business/`, `/category/social/`) — FAIL
- ❌ **No JSON-LD at all (High).** These are indexable, internally-linked hub pages listing many articles each (17–22 KB of content) but carry zero structured data — no `BreadcrumbList`, no `CollectionPage`/`ItemList`, not even `WebPage`. This is the single largest structured-data gap on the site.

### `/search/` — PASS (no schema needed)
- No JSON-LD, which is fine for a search utility page. Just make sure it's the target of the homepage `SearchAction` (see §4).

## 3. Non-schema note (context for §2)
The site has no images anywhere in the sampled pages (no `og:image`, no `<img>` tags, favicon only). This blocks meaningful `image` properties in Article/Organization schema and forfeits Search/Discover thumbnail real estate and social-share previews. Worth flagging to the site owner even though it's outside pure markup scope.

## 4. Missing Opportunities & Ready-to-Use JSON-LD

### A. Organization schema (add once, e.g. in the global `<head>` or homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://etiquetteness.com/#organization",
  "name": "Etiquetteness",
  "url": "https://etiquetteness.com/",
  "logo": {
    "@type": "ImageObject",
    "url": "https://etiquetteness.com/favicon.svg"
  },
  "description": "The etiquette nobody writes down: unwritten cultural and social rules, by country and situation."
}
```
Note: `favicon.svg` is not an ideal `logo` (Google prefers a raster PNG/JPG, min 112x112px) — swap in a proper logo image once available.

### B. WebSite with SearchAction (update homepage block)
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
Confirm the actual query-param name your `/search/` page reads (`q` assumed above) before shipping.

### C. Fixed Article template (replaces current block; example uses the Japan business-card page)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://etiquetteness.com/etiquette/japan/business-card-two-hands/#article",
      "headline": "Exchange business cards with two hands",
      "description": "Present and receive meishi (business cards) with both hands, and read the card before putting it away.",
      "articleSection": "Business",
      "about": {
        "@type": "Country",
        "name": "Japan"
      },
      "datePublished": "2026-01-15T00:00:00.000Z",
      "dateModified": "2026-01-15T00:00:00.000Z",
      "url": "https://etiquetteness.com/etiquette/japan/business-card-two-hands/",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://etiquetteness.com/etiquette/japan/business-card-two-hands/"
      },
      "isPartOf": { "@id": "https://etiquetteness.com/#website" },
      "publisher": { "@id": "https://etiquetteness.com/#organization" },
      "author": {
        "@type": "Organization",
        "@id": "https://etiquetteness.com/#organization",
        "name": "Etiquetteness"
      },
      "image": "https://etiquetteness.com/og/japan-business-card-two-hands.jpg"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://etiquetteness.com/" },
        { "@type": "ListItem", "position": 2, "name": "Japan", "item": "https://etiquetteness.com/country/japan" },
        { "@type": "ListItem", "position": 3, "name": "Exchange business cards with two hands", "item": "https://etiquetteness.com/etiquette/japan/business-card-two-hands/" }
      ]
    }
  ]
}
```
Implementation notes:
- Replace `datePublished`/`dateModified` placeholders with **real** per-entry dates pulled from content frontmatter or git history — do not compute at request/build time.
- `author` is set to the `Organization` (not a fabricated `Person`) because no real bylines exist site-wide — this avoids inventing a placeholder person while still satisfying the `author` requirement. If/when individual writer bylines are introduced, switch to a `Person` type and add Person schema (see below).
- `image` is a placeholder path — do not ship until a real per-article image exists; omit the property entirely rather than pointing to a fake URL until then.

### D. Person schema (only once real bylines exist)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://etiquetteness.com/authors/jane-doe#person",
  "name": "Jane Doe",
  "url": "https://etiquetteness.com/authors/jane-doe",
  "jobTitle": "Etiquette Editor",
  "worksFor": { "@id": "https://etiquetteness.com/#organization" }
}
```
Then reference via `"author": { "@id": "https://etiquetteness.com/authors/jane-doe#person" }` on each Article.

### E. Category page — CollectionPage + BreadcrumbList (currently missing entirely)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://etiquetteness.com/category/dining/#webpage",
      "url": "https://etiquetteness.com/category/dining/",
      "name": "Dining Etiquette",
      "description": "Table manners and dining customs by country.",
      "isPartOf": { "@id": "https://etiquetteness.com/#website" },
      "about": { "@type": "Thing", "name": "Dining etiquette" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://etiquetteness.com/" },
        { "@type": "ListItem", "position": 2, "name": "Dining", "item": "https://etiquetteness.com/category/dining/" }
      ]
    }
  ]
}
```
An `ItemList` of the articles shown on the category page can be added inside the same `@graph` if you want to explicitly enumerate them for crawlers, but `CollectionPage` + real `<a>` links is sufficient — don't over-mark-up a page that's just a link list.

### F. FAQPage / QAPage — do not add speculatively
No FAQ-style content was found on sampled pages, and per current guidance FAQPage no longer produces a Google SERP rich result (site-wide retirement effective May 7, 2026). Only add `FAQPage` if genuine Q&A content is written and the goal is AI/LLM citation (GEO), not SERP appearance. If a genuine user-submitted Q&A section is ever built (e.g., "readers ask"), use `QAPage`, not `FAQPage`.

## 5. Priority Summary

- **High**: Fix `about` type mismatch on every Article; add `author`; stop generating `dateModified` as "now" on every request; add JSON-LD to all category pages.
- **Medium**: Add `Organization` + `publisher` linkage; add `datePublished`; add `image` once real images exist; add homepage `SearchAction`.
- **Low**: Add `@id`/`mainEntityOfPage`; title-case breadcrumb country names.
