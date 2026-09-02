# Technical SEO Audit — etiquetteness.com

Date: 2026-09-02
Method: curl-based fetch/header inspection (no Playwright/Lighthouse available). Sample: homepage, robots.txt, sitemap-index.xml, sitemap-0.xml (57 URLs, all fetched/verified 200), 3 category pages, 10 article pages, /search/.

**Technical Score: 70 / 100**

## Category Pass/Fail Summary

| Category | Status | Notes |
|---|---|---|
| Crawlability | PASS (minor) | robots.txt + sitemap correct; systemic redirect on internal links |
| Indexability | PASS (minor) | Canonicals correct everywhere; duplicate meta descriptions; thin content risk |
| Security | **FAIL** | Zero security headers present (HSTS, CSP, X-Frame-Options, etc.) |
| URL Structure | FAIL (redirect defect) | Clean, consistent URLs but every internal link forces a redirect |
| Mobile | PASS | Viewport meta present, no images to cause layout issues |
| Core Web Vitals (estimated) | PASS (lab caveats) | Static SSR, small payloads, Brotli enabled; asset caching misconfigured |
| Structured Data | PASS (minor) | WebSite/Article/BreadcrumbList JSON-LD present; missing recommended fields |
| JavaScript Rendering | PASS | Fully SSR/static; zero JS dependency for content (excellent) |
| IndexNow | FAIL (not implemented) | No key file, no evidence of ping integration |

---

## What Works Well

- **Fully static/SSR site (Astro v7.2.10)** — all content (homepage, category, country, article pages) is present in raw HTML with zero client-side JS dependency for indexable content. This is the strongest possible foundation for crawlability.
- `robots.txt` is valid and correctly points to `https://etiquetteness.com/sitemap-index.xml`.
- Sitemap index → `sitemap-0.xml` → 57 URLs, all verified returning `200` with no redirects when fetched with their canonical (trailing-slash) form.
- Every page checked has a correct, self-referencing `<link rel="canonical">` tag pointing to the trailing-slash HTTPS URL.
- No `meta name="robots"` or `X-Robots-Tag` noindex directives found anywhere — nothing accidentally deindexed.
- HTTP → HTTPS redirect works correctly (`301` from `http://etiquetteness.com/` → `https://etiquetteness.com/`).
- Brotli compression enabled (`content-encoding: br`).
- Cloudflare edge caching active (`cf-cache-status: HIT`) with reasonable global TTFB (~450-480ms measured from this environment; treat as directional only, not a substitute for CrUX/Lighthouse field data).
- JSON-LD structured data present: `WebSite` on homepage, `Article` + `BreadcrumbList` (`@graph`) on article pages.
- Consistent, clean, human-readable URL taxonomy (`/etiquette/{country}/{slug}/`, `/category/{name}/`, `/country/{name}/`), no query-string or uppercase inconsistencies, no parameter pollution.
- Viewport meta tag (`width=device-width, initial-scale=1.0`) present on all pages checked.

---

## Critical Issues

### 1. No security headers on any page or asset
`curl -I` against the homepage, article pages, and the CSS bundle shows **only** default Cloudflare headers (`server`, `cf-ray`, `nel`, `alt-svc`). None of the following are present anywhere:
- `Strict-Transport-Security` (HSTS)
- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`

**Impact:** No clickjacking/MIME-sniffing protection, no HSTS preload eligibility, weaker trust signal. Not a direct ranking factor but is part of Google's holistic "safe browsing" quality signals and is trivial to fix given the stack.
**Recommendation:** Add a `_headers` file (Cloudflare Pages) or a Cloudflare Transform Rule / lightweight Worker middleware to set at minimum:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data:; script-src 'self'
```
(CSP needs to explicitly allow the Google Fonts and Pagefind script origins already in use — test on `/search/` before enforcing.)

### 2. Every internal link on the site triggers an unnecessary redirect
All internal `href` values in the rendered HTML (nav, category pills, cross-links, breadcrumb schema) point to **non-trailing-slash** paths, e.g. `href="/category/business"`, while the site's canonical/actual URLs all have a trailing slash (`/category/business/`). Cloudflare/Astro responds to the no-slash form with a `307` redirect:
```
GET /category/business        -> 307 -> /category/business/
GET /etiquette/japan/dining-chopstick-rules -> 307 -> /etiquette/japan/dining-chopstick-rules/
```
This is **not a one-off** — it is the link format used site-wide (homepage nav, category chips, "More from {country}" cross-links, and even the `BreadcrumbList` JSON-LD `item` URLs, e.g. `"item":"https://etiquetteness.com/country/japan"` with no trailing slash).

**Impact:** Every single user click and every crawler follow of an internal link costs one extra round trip before reaching the final page. At scale this wastes crawl budget, adds latency to every navigation (hurts INP/perceived responsiveness), and creates a redirect hop in structured data references (search engines generally resolve this fine, but it's an avoidable inefficiency and a sign the internal linking and canonicalization logic are out of sync).
**Recommendation:** Fix at the source — the Astro templates/components generating internal `href` and JSON-LD `item` values should emit the trailing-slash form directly (matching `trailingSlash` config), eliminating the redirect entirely rather than relying on the edge to paper over it.

---

## High Priority

### 3. Redirect uses `307` instead of `301`/`308` for a permanent URL normalization
The non-trailing-slash → trailing-slash redirect returns `HTTP/2 307` (Temporary Redirect). Since this is a permanent, structural URL decision (Astro's static trailing-slash behavior, not something that will change per-request), it should be a permanent redirect.
**Impact:** `307` signals impermanence to crawlers and browsers, so link equity consolidation and cache behavior are less optimal than with `301`/`308`.
**Recommendation:** If this redirect is coming from Cloudflare Pages' default static-asset trailing-slash handling, override it with an explicit `301` (or `308` to preserve method semantics) via a Worker/redirect rule. Combined with fix #2, ideally this redirect is never hit at all for internal navigation.

### 4. Hashed static assets are not cached long-term
`/_astro/Layout.Cne0tRfE.css` (Astro's content-hashed filename — safe to cache forever) is served with:
```
cache-control: public, max-age=0, must-revalidate
```
**Impact:** Despite the filename changing on every content change (making it safe for a 1-year immutable cache), the browser must revalidate this asset on every single page load. This adds a network round trip on every repeat visit and directly works against LCP/INP on return visits.
**Recommendation:** Add a Cloudflare Pages `_headers` rule for the `/_astro/*` path:
```
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```
Leave HTML responses on the current `max-age=0, must-revalidate` (correct for HTML that changes).

---

## Medium Priority

### 5. Duplicate meta descriptions across taxonomy pages
All category pages checked (`/category/business/`, `/category/dining/`, `/category/social/`) share the exact same meta description: *"Unwritten etiquette rules from around the world."* Titles are unique and good ("Business etiquette · Etiquetteness"), but descriptions are boilerplate. Country pages likely share the same pattern (not all individually verified, but templates appear shared).
**Recommendation:** Template the description to include the category/country name, e.g. `"Business etiquette rules from around the world — {count} unwritten rules covering handshakes, cards, punctuality, and more."`

### 6. Thin content on article (detail) pages
Unique body copy on article pages (after stripping nav/footer boilerplate) runs roughly 500-700 characters — typically one or two short paragraphs plus a source citation (e.g. `/etiquette/japan/dining-chopstick-rules/` ≈ 560 chars of unique text). With 37 such pages in the sitemap, this is a legitimate "thin content at scale" pattern search engines can flag, even though each page is individually accurate and useful.
**Recommendation:** Not a technical blocker, but flag to content team: consider adding more depth per rule (context, regional variation, "why," related do's/don'ts) or consolidating very short entries into fewer, richer pages.

### 7. `BreadcrumbList` structured data references non-canonical URLs
JSON-LD `BreadcrumbList` items use URLs without the trailing slash (e.g. `"item":"https://etiquetteness.com/country/japan"`), which do not match the page's own canonical URL format and will 307-redirect if followed. Same root cause as #2.
**Recommendation:** Fix alongside #2 — generate breadcrumb `item` URLs from the same canonical-URL helper used for `<link rel="canonical">`.

### 8. No `og:image` / `twitter:image`; Twitter card is `summary` not `summary_large_image`
No page checked (home, category, article, search) includes an `og:image` or `twitter:image` tag. `twitter:card` is set to `summary`. Site has no images at all (confirmed via `<img>` scan on homepage and article pages).
**Impact:** Link previews shared on Slack, Twitter/X, Facebook, iMessage, Discord, etc. will show no image, reducing click-through from social shares.
**Recommendation:** Generate a static or per-article OG image (even a simple branded template with the headline) and add `og:image` + switch to `twitter:card=summary_large_image`.

### 9. `/search/` is in the sitemap but has no indexable content
`/search/` returns `200` and is listed in `sitemap-0.xml`, but its raw HTML body contains only "Find a rule by country, category, or keyword." — actual results are rendered client-side via Pagefind (`/pagefind/pagefind-ui.js`) after `DOMContentLoaded`. Googlebot can execute JS and may eventually render results, but the *indexed* raw content is essentially empty, and this page doesn't represent unique topical content anyway.
**Recommendation:** Add `<meta name="robots" content="noindex,follow">` to `/search/` and exclude it from the sitemap. This isn't hurting anything today but is a common source of "thin content" flags Google Search Console likes to surface.

### 10. `Article` structured data missing recommended fields
The `Article` JSON-LD block includes `headline`, `description`, `articleSection`, `about`, `dateModified`, and `url`, but omits `image`, `author`, and `datePublished` — all recommended by Google for full Article rich-result eligibility (image is close to required in practice for the enhanced treatment).
**Recommendation:** Add `datePublished` (distinct from `dateModified`) and an `author` (`Organization` is acceptable for a site without bylines). `image` is blocked on fix #8 (no images exist yet).

---

## Low Priority

### 11. Empty 404 page body
`GET /this-page-does-not-exist-xyz/` correctly returns HTTP `404`, but with `content-length: 0` — no HTML body, no navigation, no search box, no suggested pages.
**Recommendation:** Ship a real 404 page with a link back to the homepage/category index and the search box, while keeping the `404` status code.

### 12. `www.etiquetteness.com` has no DNS record at all
`www.etiquetteness.com` fails to resolve (`Could not resolve host`) rather than redirecting to the apex domain. Not currently causing any known harm since nothing appears to link to the `www` form, but if any external link, old bookmark, or backlink ever uses `www.`, it will hard-fail instead of redirecting.
**Recommendation:** Low priority; optionally add a DNS record + redirect rule for `www` → apex for defense-in-depth, not urgent.

### 13. Sitemap has no `<lastmod>` dates
`sitemap-0.xml` includes `<loc>` only, no `<lastmod>` for any of the 57 URLs (confirmed 0 occurrences of "lastmod" in the file).
**Recommendation:** Optional but useful — emitting `lastmod` (Astro can source this from the `dateModified` already used in the Article schema) helps search engines prioritize recrawls of recently changed pages.

---

## Info

### 14. IndexNow protocol not implemented
No IndexNow key file found at the conventional location (`/{key}.txt` guesses returned 404) and no other evidence of IndexNow integration. Given this is a static Astro site rebuilt/deployed via Cloudflare Workers on every content change, IndexNow is a low-effort addition: generate a key file at build time, host it at the site root, and call the IndexNow API (single shared endpoint fans out to Bing, Yandex, Naver, Seznam) from the deploy pipeline for any new/changed URLs. This is optional (not required for Google) but cheap to add and speeds up discovery on Bing-powered surfaces (including Copilot).

### 15. `robots.txt` allows all crawlers, including AI crawlers, via wildcard
`User-agent: * / Allow: /` permits GPTBot, ClaudeBot, Google-Extended, PerplexityBot, etc. by default (no explicit blocks or allows). This is a content/business decision, not a technical defect — flagging for awareness only in case the site owner wants to make an explicit choice either way (e.g. for AI-answer-engine visibility vs. content-scraping concerns) rather than relying on the implicit wildcard default.

---

## Sample Data

- Sitemap URL count: 57 (all `200`, 0 redirects, verified via HEAD-equivalent fetch of every URL)
- Homepage size: 46,296 bytes (raw HTML)
- Article page size: ~9,500 bytes (raw HTML)
- Shared CSS bundle: 30,226 bytes (`/_astro/Layout.Cne0tRfE.css`)
- TTFB (homepage, 3 runs from this environment): 449-480ms — directional only, not a substitute for field/lab CWV data (no Lighthouse/Playwright available in this environment)
- Compression: Brotli confirmed via `content-encoding: br`
