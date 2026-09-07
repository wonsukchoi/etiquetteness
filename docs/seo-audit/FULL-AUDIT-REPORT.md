# SEO Audit — etiquetteness.com

Date: 2026-09-02 (rerun — post-fix verification pass, same day as baseline)
Baseline: this file's prior version (2026-09-02, health score 49/100), superseded by this rewrite. Individual findings files under `findings/` were rewritten in place by 7 specialist passes: Technical, Content/E-E-A-T, Schema, Sitemap, Performance, GEO/AI-search, SXO.
Method: Live site (curl/WebFetch-based; still no Lighthouse/Playwright/CrUX/DataForSEO in this environment — same constraint as baseline, flagged per-section). On-Page and Images scores below are synthesized from cross-cutting evidence in the other 5 weighted passes (same methodology as the baseline — there is no dedicated on-page/image specialist in this environment).

## Overall SEO Health Score: 67 / 100 (up from 49)

| Category | Weight | Score | Prior | Weighted |
|---|---|---|---|---|
| Technical SEO | 22% | 83 | 70 | 18.3 |
| Content Quality | 23% | 57 | 34 | 13.1 |
| On-Page SEO | 20% | 74 | 50 | 14.8 |
| Schema / Structured Data | 10% | 53 | 40 | 5.3 |
| Performance (proxy/lab) | 10% | 72 | 65 | 7.2 |
| AI Search Readiness (GEO) | 10% | 61 | 45 | 6.1 |
| Images | 5% | 35 | 10 | 1.75 |
| **Total** | | | | **66.5 ≈ 67** |

Not weighted into the health score (informational, same as baseline): SXO Gap Score **46/100** (up from 31) — see `findings/sxo.md`.

Business type: unchanged — editorial/reference site (programmatically-structured country × category etiquette-rule database, Astro static site on Cloudflare Workers).

Scope note: the live site currently has 13 countries / 84 entries. Brazil and Vietnam (5 entries each, 10 total) exist locally, fully drafted and wired into `src/lib/countries.ts`, but are not yet deployed — every pass here audited the **live** site as-is; Brazil/Vietnam readiness was spot-checked separately and confirmed content-complete (`findings/sitemap.md` §"Brazil / Vietnam Readiness Check").

## What Actually Moved the Score

The session between audits shipped a real batch of fixes, and nearly all of them verified as working, not just claimed:

- **Security headers** — HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy all confirmed live via `_headers`. Baseline's single biggest technical FAIL, now fully resolved.
- **Trailing-slash redirect eliminated for internal navigation** — `trailingSlash: 'always'` confirmed threaded through canonical tags, internal links, breadcrumbs, and the sitemap. This was hitting 100% of internal crawl paths at baseline.
- **`/about/` page shipped** — substantive, ~280 words, states sourcing/verification methodology and a corrections path. Single largest driver of the Content/E-E-A-T score jump (Trustworthiness sub-score +33).
- **Article bodies deepened 3-4x** — 200-320 words now (was 50-90), with a new "Why it matters" section and Do/Don't lists on most entries.
- **Real per-entry OG images** — 1200×630 PNGs generated at build time (satori+resvg), verified live and wired into `og:image`/`twitter:image`/Article JSON-LD `image`. Verified zero runtime performance cost.
- **Sitemap and meta descriptions** — `<lastmod>` now present on all 107 URLs, `/sitemap.xml` conventional path fixed, category/country meta descriptions de-duplicated.
- **Content grew 58 → 84 entries**, every live country now has 5+.

## Top 5 Critical Issues (this pass)

1. **`datePublished` is fabricated in production — every one of 84 pages shows the identical timestamp.** The fix that shipped is well-designed (derives real per-file first-commit date via `git log --diff-filter=A`), but Cloudflare Workers Builds appears to do a shallow git clone, so every file resolves to the same HEAD-commit timestamp. Confirmed independently by Technical, Content, and Schema passes by cross-referencing the live value against full local git history. This is arguably a *more convincing-looking* but equally fabricated freshness signal than baseline's. **Fix:** deepen the CI git checkout, or fall back to a frontmatter `publishedAt` field set once per entry.
2. **Site may not be indexed by Google at all — `site:etiquetteness.com` returns zero results.** Flagged by SXO, independently verified from the technical side: no robots.txt block, no noindex meta/header anywhere, canonicals correct, sitemap valid and referenced — no technical blocker found. A `google-site-verification` DNS record confirms GSC ownership was verified at some point, but nothing indicates the sitemap was ever submitted inside the console. **This is the actual reason no format/content fix will move rankings yet** — it has to be resolved before anything else on this list matters for organic traffic.
3. **`dateModified`/sitemap `<lastmod>` are uniformly today's date across all 84-107 URLs.** Verified as *accurate* (all content genuinely was touched today, this is a repo-age artifact, not a bug) but currently carries zero differentiation signal. Combined with #1, the site currently ships two freshness signals and neither is trustworthy yet.
4. **Schema gaps widened rather than closed.** `author`/`publisher`/`Organization` are still completely absent (unchanged from baseline), the `about` field is still an invalid bare string instead of a `Country` entity (unchanged), and — newly confirmed this pass — **both country and category hub pages ship zero JSON-LD at all** (20 pages total, double the previously-scoped category-only gap). All the source content needed (name, methodology, GitHub link) already exists in prose on `/about/`; this is a wiring gap, not a content gap.
5. **Hub pages remain link directories, not synthesized guides — the core page-type mismatch for broad queries is unresolved.** For narrow "is it rude to X in Y" queries, the upgraded article format is now a close SERP match. For broad "[country] [category] etiquette" queries, competitors win with single-page guides synthesizing 5-10 rules; etiquetteness's country/category hubs still hand off to a bare list of links rather than an inline synthesized read.

## Top 5 Quick Wins (this pass)

1. **Submit the sitemap in Search Console and request indexing on 5-10 URLs.** Zero code change, directly addresses Critical #2, and nothing else on this list matters for organic traffic until this is done.
2. **Add `Organization` + `publisher`/`author` schema site-wide**, referenced from every Article. The source content already exists in prose on `/about/` — this is copy-paste JSON-LD, not new research (ready-to-use snippet in `findings/schema.md` §4A).
3. **Add long-lived immutable caching for `/_astro/*` and `/og/*`** via `public/_headers` — recommended at baseline, still not live, now also covers the new hero image and OG images. One `_headers` block.
4. **Add `/llms.txt`** indexing the 6 categories, 14 countries, and 84 entries, mirroring the CC BY-NC 4.0 terms already stated on `/about/`. ~30-45 min, single static file.
5. **Investigate the Cloudflare Workers Build git-clone depth** to fix Critical #1 — check the Workers Builds UI for a shallow-clone setting; if unavailable, ship a frontmatter `publishedAt` fallback instead.

## Category Detail

See per-category findings for full evidence and ready-to-use snippets:
- [`findings/technical.md`](findings/technical.md) — 83/100
- [`findings/content.md`](findings/content.md) — 57/100
- [`findings/schema.md`](findings/schema.md) — 53/100
- [`findings/sitemap.md`](findings/sitemap.md) — 97/100 (rolled into Technical for the overall score; not separately weighted)
- [`findings/performance.md`](findings/performance.md) — 72/100
- [`findings/geo.md`](findings/geo.md) — 61/100
- [`findings/sxo.md`](findings/sxo.md) — 46/100 (informational, not weighted)

## Limitations (unchanged from baseline)

No Lighthouse, PageSpeed Insights API, CrUX API, DataForSEO, or Playwright/browser rendering available in this environment — Performance findings remain `curl`/header-based lab/proxy estimates, not field data. Live WebSearch for SERP analysis worked this pass (used by SXO) but was blocked by a CAPTCHA for the GEO pass's brand-mention check.
