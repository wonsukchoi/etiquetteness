# Technical SEO Audit — etiquetteness.com

Date: 2026-09-02 (rerun, same day as baseline — post-fix verification pass)
Baseline compared against: this file's prior version (2026-09-02, health score 70/100), superseded by this rewrite.
Method: curl-based fetch/header inspection (no Playwright/Lighthouse/CrUX available in this environment — same limitation as baseline). Sample: homepage, robots.txt, sitemap-index.xml, sitemap-0.xml (107 URLs), 3 category pages, 2 country pages, 6+ article pages across 4 countries, `/search/`, `/about/`, `/contact/`, `/privacy/`, `/terms/`, 404 page, DNS TXT records. Cross-referenced production JSON-LD output against local git history to verify the new `datePublished` feature.

**Technical Score: 83 / 100** (up from 70)

## Category Pass/Fail Summary

| Category | Status | Notes |
|---|---|---|
| Crawlability | PASS | robots.txt + sitemap correct, no noindex anywhere — but see Critical #1 (indexing status unconfirmed) |
| Indexability | PASS (minor) | Canonicals correct; meta descriptions now unique; thin content resolved; `datePublished` bug found |
| Security | **PASS** (was FAIL) | HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy all confirmed live |
| URL Structure | PASS (minor) | Internal-link redirect defect **fixed**; edge-level 307 + legacy 2-hop chain remain for external/typed URLs only |
| Mobile | PASS | Unchanged — viewport meta present, no images to cause layout shift |
| Core Web Vitals (estimated) | PASS (lab caveats) | Static SSR, Brotli confirmed; hashed-asset caching still misconfigured (unchanged defect, now also affects OG images) |
| Structured Data | PASS (minor) | `image` added to Article schema; `author` still missing; `datePublished` is live but **producing fabricated data** (see Critical #2) |
| JavaScript Rendering | PASS | Unchanged — fully SSR/static, zero JS dependency for content |
| IndexNow | FAIL (not implemented) | Unchanged — no key file found |

---

## Fixed Since Last Audit

These were the baseline's Critical/High/Medium findings — verified resolved via live curl checks:

1. **Security headers (baseline Critical #1) — FIXED.** `curl -I` against homepage, article pages, and even the 404 page now shows `strict-transport-security`, `content-security-policy`, `x-content-type-options: nosniff`, `x-frame-options: DENY`, `referrer-policy: strict-origin-when-cross-origin`, and `permissions-policy` on every response checked. Source: `public/_headers`, applied via Cloudflare. This was the single biggest FAIL in the baseline and is now fully resolved.
2. **Internal-link redirect defect (baseline Critical #2) — FIXED for crawl-time impact.** Every internal `href` sampled on the homepage and an article page (132 links checked on homepage, 17 on article) now emits the trailing-slash form directly — zero non-trailing-slash internal links found. `astro.config.mjs` confirms `trailingSlash: 'always'`. This eliminates the 307 redirect for every internal navigation and crawl-follow path. (Note: the edge-level redirect for *externally typed* non-slash URLs still exists — see High #3, reduced blast radius, not eliminated.)
3. **BreadcrumbList JSON-LD non-canonical URLs (baseline Medium #7) — FIXED.** Same root cause as #2; breadcrumb `item` URLs now use the trailing-slash canonical form (verified on `/etiquette/japan/dining-chopstick-rules/`).
4. **Duplicate meta descriptions (baseline Medium #5) — FIXED.** Category pages (`business`, `dining`, `social`) and country pages (`japan`, `korea`) now each have unique, content-specific descriptions instead of shared boilerplate.
5. **Thin content on article pages (baseline Medium #6) — substantially improved.** Unique body text on the sampled article grew from ~560 characters (baseline) to ~2,200 characters. Not flagging as an open issue anymore; downgraded to a Low/monitor note.
6. **No `og:image` / `twitter:image` (baseline Medium #8) — FIXED.** Per-entry OG images are live and unique (e.g. `https://etiquetteness.com/og/japan/dining-chopstick-rules.png`, confirmed `200`, `image/png`). `twitter:card` is now `summary_large_image` (was `summary`). Homepage uses a shared `og-image.jpg`; article pages use per-entry generated PNGs.
7. **Sitemap missing `<lastmod>` (baseline Low #13) — FIXED.** `sitemap-0.xml` now emits `<lastmod>` for all 107 URLs, sourced from each entry's `updatedAt` frontmatter via a custom `serialize()` hook in `astro.config.mjs`.
8. **`/about/` now exists and 200s** (was presumably 404 or absent) — confirmed live, in the sitemap.

---

## Critical Issues

### 1. Site indexing status unconfirmed — `site:etiquetteness.com` reportedly returns zero results
Flagged by the SXO pass; verified from the technical side. **No technical blocker was found**: `robots.txt` is `Allow: /` with no disallow rules; no `<meta name="robots">` noindex tag on any sampled page (home, article, `/search/`, `/about/`, 404); no `X-Robots-Tag` header on any response checked; canonical tags are correct and self-referential everywhere; sitemap is valid, reachable, and referenced from `robots.txt`. A `google-site-verification` DNS TXT record **does** exist (`google-site-verification=E2P7x8Fwo11oablxLxWzgF9ptQOFniV_MUoasXoRSKk`), confirming Search Console ownership was verified at some point.

**What this means:** since no blocking signal exists, the most likely explanations are (a) the sitemap was verified-but-never-submitted inside GSC, or discovery/crawl simply hasn't caught up yet on a low-authority new domain, or (b) `site:` is a known-unreliable indicator of true index status in current Google Search behavior and can under-report even indexed sites. This cannot be fully resolved without GSC API/dashboard access (not available in this environment).
**Recommendation (highest priority action item on this audit):**
- Log into Search Console with the already-verified property.
- Submit `https://etiquetteness.com/sitemap-index.xml` explicitly under Sitemaps (don't rely on robots.txt discovery alone).
- Run URL Inspection on 5-10 representative URLs (homepage, one country page, one article) and use "Request Indexing" if they show "Discovered — not indexed" or aren't indexed.
- Check the Page Indexing report for exclusion reasons across the other ~100 URLs before assuming this is purely a discovery-speed problem.

### 2. `datePublished` in Article structured data is fabricated — all articles show the same timestamp
The task brief that shipped since baseline claims "real datePublished added." The implementation (`src/lib/publishedDates.ts`) is sound in principle — it derives each article's true first-commit date via `git log --diff-filter=A`. **But in production it is broken**: every article sampled across 4 different countries (Japan, Germany, Guam, Mexico, Thailand, UK) returns the **identical** value `"datePublished":"2026-09-02T19:18:19+09:00"`.

Cross-checked against local git history: this timestamp exactly matches commit `5358ca2` ("Expand Guam etiquette entries") — the HEAD commit the current production build was deployed from. Running the same `git log --diff-filter=A` command against the full local history correctly returns *different* dates per file (e.g. `dining-chopstick-rules.mdx` → `2026-09-02T12:48:08+09:00`, `gifts-avoid-marigolds.mdx` → `2026-09-02T12:56:25+09:00`). This strongly indicates **Cloudflare Workers Builds is doing a shallow git clone** at build time, so `git log --diff-filter=A` only sees one commit in its history and stamps every file's "first added" date with that single commit's timestamp.

**Impact:** 107 pages currently emit structured data claiming they were all published within the same second — an inaccurate freshness/provenance signal in Article rich-result eligibility, and the opposite of what the feature was built to do.
**Recommendation:** Either (a) configure the Cloudflare Workers Builds git checkout to use full history (`fetch-depth: 0` equivalent, if configurable in the Workers Builds UI/settings), or (b) since CI git history can't always be trusted, persist real publish dates a different way — e.g. write a `publishedAt` frontmatter field once per entry (set-and-forget, doesn't require backfilling if defaulted to `updatedAt` on first write) instead of depending on CI clone depth. Until fixed, `getPublishedDates()` is effectively a no-op that silently degrades to "everything published at deploy time" rather than falling back to `undefined` (which would have correctly fallen through to `updatedAtISO` per-file and avoided the uniform fake date).

---

## High Priority

### 3. Redirect for non-canonical URLs still `307`, and still a 2-hop chain when combined with `http://`
Unchanged from baseline. Internal links no longer trigger this (see Fixed #2 above), but any external backlink, bookmark, or typed URL using the pre-fix link format still pays the cost:
```
GET /category/business             -> 307 -> /category/business/
GET http://.../category/business   -> 301 -> https://.../category/business (still no slash) -> 307 -> https://.../category/business/  (2 hops)
```
**Impact:** Reduced blast radius vs. baseline (no longer hit by internal navigation or crawl-follow of the site's own links), but still an inefficiency for any inbound link using the old format, and still signals impermanence via `307` instead of `301`/`308`.
**Recommendation:** Same as baseline — override with an explicit `301`/`308` Worker rule, and ideally collapse the `http` + non-slash case into a single hop.

### 4. Hashed/versioned static assets still not cached long-term — now also affects OG images
Confirmed unchanged for `/_astro/*.css` and `/pagefind/pagefind-ui.js`, and **newly confirmed to also apply to the per-entry OG images**:
```
/_astro/Layout.Bp36PgcS.css           -> cache-control: public, max-age=0, must-revalidate
/pagefind/pagefind-ui.js              -> cache-control: public, max-age=0, must-revalidate
/og/japan/dining-chopstick-rules.png  -> cache-control: public, max-age=0, must-revalidate
```
**Impact:** All three are safe to cache for a year (content-hashed filenames, or effectively immutable per-entry images), but every repeat visit and every social-platform crawler refetch pays a full revalidation round trip. This directly works against LCP/INP on return visits and adds unnecessary load when social platforms (Slack, X, iMessage) refetch OG images for link previews.
**Recommendation:** Add to `public/_headers`:
```
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
/pagefind/*
  Cache-Control: public, max-age=31536000, immutable
/og/*
  Cache-Control: public, max-age=31536000, immutable
```
Leave HTML on the current `max-age=0, must-revalidate` (correct as-is).

---

## Medium Priority

### 5. `/search/` still thin, still unindexed-content-in-disguise, still in sitemap
Unchanged from baseline. `/search/` returns `200`, is listed in `sitemap-0.xml`, but its raw HTML contains only "Find a rule by country, category, or keyword." plus the Pagefind bootstrap script — actual results render client-side after `DOMContentLoaded`. No `<meta name="robots">` or `X-Robots-Tag` noindex directive present.
**Recommendation:** Same as baseline — add `noindex,follow` and drop from the sitemap.

### 6. `Article` structured data still missing `author`
`image`, `datePublished`, and `dateModified` are now present (image/dateModified are correct; datePublished is currently wrong per Critical #2), but `author` is still absent from every sampled Article block.
**Recommendation:** Add an `Organization` author (e.g. `{"@type":"Organization","name":"Etiquetteness"}`) — no bylines needed for eligibility.

### 7. CSP relies on `'unsafe-inline'` for `script-src`
The live CSP is well-configured overall (`default-src 'self'`, explicit allowlists for fonts/analytics, `frame-ancestors 'none'`, `object-src 'none'`), but `script-src 'self' 'unsafe-inline' https://analytics.wonsukchoi.com` includes `'unsafe-inline'`, which significantly weakens CSP's core XSS-mitigation value (its main job is blocking injected inline `<script>` execution). Likely required today for the inline Pagefind bootstrap script on `/search/`.
**Recommendation:** Not urgent given the site has no user-generated content/comment surface, but consider migrating the inline script to a nonce- or hash-based CSP entry (Astro can inject a per-build nonce) to close this gap without breaking Pagefind.

---

## Low Priority

### 8. Empty 404 page body — unchanged
`GET /this-page-does-not-exist-xyz/` still returns `404` with `content-length: 0`. Security headers are now correctly present even on this response, but there's still no HTML body, nav, or search box.
**Recommendation:** Unchanged from baseline — ship a real 404 page.

### 9. `/contact/`, `/privacy/`, `/terms/` confirmed still 404
Re-verified this pass: `/about/` is `200`; `/contact/`, `/privacy/`, `/terms/` all still return `404`. Not inherently an SEO defect (no internal links point to them in the sampled pages), but worth flagging since the site is now a public repo under MIT/CC-BY-NC — a Privacy and Terms page (or at minimum a license/attribution page) is increasingly expected, and any external link using these paths will hard-404 rather than resolve.
**Recommendation:** Low priority technically; flag to content/legal owner given the public-repo/licensing change.

### 10. `www.etiquetteness.com` — not re-verified this pass, presumed unchanged
Baseline reported no DNS record for the `www` subdomain. Not retested this pass (out of scope for the delta); carrying forward as open/low priority unless already addressed.

### 11. Thin-content risk — downgraded, monitor only
Article body copy is now materially longer (~2,200 chars sampled vs. ~560 at baseline) following the recent country-expansion commits (Guam, UK, Saudi Arabia, Thailand, Italy). No longer flagging as an open issue; note for future passes if new entries regress toward the old shorter format.

---

## Info

### 12. IndexNow protocol — still not implemented
No IndexNow key file found (`/indexnow.txt` guess returns `404`; no evidence of an alternate key path). Unchanged from baseline — still a cheap, optional add given the static build/deploy pipeline.

### 13. `robots.txt` still allows all crawlers via wildcard, including AI crawlers
Unchanged — `User-agent: * / Allow: /`. Business decision, not a defect; flagged for awareness only.

### 14. Page weight has grown notably since baseline
Homepage: 46,296 bytes → 120,965 bytes (+~2.6x). Article page: ~9,500 bytes → 21,284 bytes (+~2.2x). Expected given the recent country-expansion commits plus added OG/meta/breadcrumb markup — still small in absolute terms for a static HTML site and unlikely to hurt LCP today, but worth watching as more countries are added.

### 15. Brotli compression, HTTP/3, and TTFB all confirmed unchanged/healthy
`content-encoding: br` confirmed when the client offers it (preferred over gzip); `alt-svc: h3=":443"` present; TTFB 452-476ms across 3 runs from this environment — directional only, same caveat as baseline (no Lighthouse/Playwright/CrUX available here).

---

## Sample Data

- Sitemap URL count: 107 (verified via `<loc>` count in `sitemap-0.xml`), all with `<lastmod>` populated
- Homepage size: 120,965 bytes (raw HTML, up from 46,296 at baseline)
- Article page size: 21,284 bytes (raw HTML, up from ~9,500 at baseline)
- Article unique body text: ~2,200 characters (up from ~560 at baseline)
- TTFB (homepage, 3 runs from this environment): 452-476ms — directional only
- Compression: Brotli confirmed via `content-encoding: br` (gzip fallback also available)
- Security headers confirmed present on: homepage, article pages, category pages, and even the 404 response
- `datePublished` cross-check: production value `2026-09-02T19:18:19+09:00` (uniform across all 6 sampled articles) matches deployed HEAD commit `5358ca2` timestamp exactly; local full-history git log correctly returns per-file dates (e.g. `12:48:08+09:00` vs `12:56:25+09:00` for two different files) — confirms shallow-clone bug in CI, not a logic bug in `src/lib/publishedDates.ts`
