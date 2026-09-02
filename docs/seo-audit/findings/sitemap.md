# Sitemap Audit — etiquetteness.com
Date: 2026-09-02 (re-run, second pass)
Source: https://etiquetteness.com/sitemap-index.xml (child: https://etiquetteness.com/sitemap-0.xml)
Baseline compared: docs/seo-audit/findings/sitemap.md (first pass, same day, 57 URLs)

## Score: 97 / 100

## Summary
Sitemap is clean, structurally valid, and now 107 URLs (up from 57), with 100% of
URLs returning `200` and zero redirects. The two prior fixable issues — missing
`lastmod` and the 404 on the conventional `/sitemap.xml` path — are both resolved.
`trailingSlash: 'always'` is correctly wired through canonical tags, internal
`<a href>` links, and sitemap `<loc>` entries with no mixed slash/no-slash
inconsistency anywhere. Sitemap URL count reconciles exactly against the live page
inventory (84 entry pages + 14 country hubs + 6 category hubs + 3 static pages =
107), with Brazil and Vietnam content present in the repo but correctly excluded
from the live sitemap since those countries aren't deployed yet.

## What Changed Since Baseline
| Item | Baseline (first pass) | This pass | Status |
|---|---|---|---|
| Total sitemap URLs | 57 | 107 | Grew with content (+50) |
| `/sitemap.xml` conventional path | 404 | **200**, identical content to `/sitemap-index.xml` | **Fixed** |
| `lastmod` | Missing on all 57 URLs | Present on all 107 URLs, sourced from real per-file `updatedAt` frontmatter via `serialize()` in `astro.config.mjs` | **Fixed** |
| Trailing slash consistency (sitemap vs canonical vs internal links) | Sitemap used trailing slash; internal `<a href>` links did not (307 redirect on click) | `trailingSlash: 'always'` set; sitemap, canonical `<link>` tags, and internal `<a href>` links all consistently use trailing slash | **Fixed** |
| Country/location hub pages | 12 | 14 (added Guam, Philippines; +2) | Still well under 30-page WARNING gate |
| priority/changefreq | Absent | Absent | Unchanged — correct |

## Validation Checks

| Check | Result | Severity | Notes |
|---|---|---|---|
| `sitemap.xml` (conventional path) | **Pass — 200** | — | Now returns 200 and is byte-identical to `sitemap-index.xml`. Prior 404 finding resolved. |
| `robots.txt` sitemap directive | Pass | — | `Sitemap: https://etiquetteness.com/sitemap-index.xml` present and correct. |
| Sitemap index XML validity | Pass (`xmllint --noout`) | — | Well-formed `sitemapindex`, single child sitemap referenced. |
| Child sitemap XML validity | Pass (`xmllint --noout`) | — | Well-formed `urlset`, correct `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`. |
| URL count vs 50,000 limit | Pass | — | 107 URLs, far under limit. No splitting needed for the foreseeable future (would need ~470x growth). |
| HTTP status of all URLs | Pass — 107/107 return `200`, 0 redirects | — | Verified via curl `%{http_code}` + `%{num_redirects}` (with `-L` follow) for every `<loc>`. |
| Duplicate URLs | Pass | — | `sort \| uniq -d` on all 107 `<loc>` values returns empty — no duplicates. |
| Canonical (non-redirecting) URLs | Pass | — | All sitemap URLs are the final destination (trailing-slash form); `<link rel="canonical">` on every spot-checked page matches its own sitemap `<loc>` exactly. |
| Noindex on sitemap URLs | Pass (spot-check) | — | Checked homepage, `/about/`, `/country/guam/`, `/category/travel/`, an etiquette detail page, `/search/` — no `<meta name="robots">` noindex tags found on any. |
| `lastmod` usage | **Present on all 107 URLs** | Info | Sourced from real `updatedAt` frontmatter per content file via a custom `serialize()` callback in `astro.config.mjs` — this is a legitimate, non-fake freshness signal. See note below on current uniformity. |
| `lastmod` — all identical | All 107 URLs currently show `2026-09-02T00:00:00.000Z` | Low | Cross-checked against `git log` for 5 sample files across different countries/categories — every content file genuinely has `updatedAt: 2026-09-02` in frontmatter, and git history confirms all 94 `.mdx` files were in fact last touched today (bulk "Deepen 36 etiquette entries" / "Fact-check Guam entries" / etc. commits). So the uniformity is **accurate, not a bug or placeholder** — but it means `lastmod` currently carries zero differentiation signal to Google. Going forward, only actually-edited files should get their `updatedAt` bumped, so future re-crawls see a realistic mix of dates rather than a wall of identical timestamps. |
| `priority` / `changefreq` | Not present | Info | Correctly omitted — both are ignored by Google. Nothing to remove. |
| Sitemap coverage vs internal linking | Pass | — | Spot-checked homepage nav and a category page — every internal `<a href>` uses the canonical trailing-slash form and resolves to a sitemap entry; no orphans. |
| Sitemap URL count vs actual page inventory | **Pass — exact reconciliation** | — | 107 sitemap URLs = 84 etiquette entry pages + 14 country hub pages (13 countries + `/country/global/`) + 6 category hub pages + 3 static pages (`/`, `/about/`, `/search/`). Matches `src/pages` route structure (`[...slug].astro`, `[country].astro`, `[category].astro`, `index.astro`, `about.astro`, `search.astro`) exactly — no missing, no extra, no orphaned routes. |

## Missing Pages (in crawl but not sitemap)
None. Route structure (`src/pages/**`) and sitemap URL count reconcile exactly (107 = 107); every static route and every dynamic route's generated paths are present.

## Extra Pages (in sitemap but 404/redirected)
None. All 107 URLs return clean `200` with zero redirects.

## Brazil / Vietnam Readiness Check
- `src/content/etiquette/brazil/` (5 entries) and `src/content/etiquette/vietnam/` (5 entries) exist in the repo with complete, well-formed frontmatter (`updatedAt: 2026-09-02` on all 10 files) but are **correctly absent** from the live sitemap and live `/country/brazil/` / `/country/vietnam/` hub pages — confirms these countries are content-complete locally but genuinely not yet deployed, matching the stated status.
- When Brazil and Vietnam go live: sitemap URL count should jump from 107 to 107 + 10 (entries) + 2 (country hubs) = **119**, still trivially under the 50k limit and country-hub count would rise from 14 to **16** — still well under the 30-page WARNING gate.

## Quality Gate Check — Location/Programmatic Pages
- Country hub pages in sitemap: **14** (`/country/{china,france,germany,global,guam,india,italy,japan,korea,mexico,philippines,saudi-arabia,thailand,united-kingdom}/`) — up from 12 at baseline (added Guam, Philippines).
- Threshold status: **Below 30-page WARNING gate** (14/30). No unique-content percentage check required yet. Adding Brazil + Vietnam brings this to 16 — still below the gate.
- Etiquette detail pages: 84 (up from 37 at baseline), each a distinct rule (dining/business/gifts/home/social/travel) per country, not template-swapped city/location pages — this remains "Safe at Scale" territory, not doorway-page risk. Country hub pages aggregate real, differentiated per-topic content rather than boilerplate with a swapped place name.
- **Monitor recommendation unchanged**: if the country roster approaches 30, re-run the 60%+ unique-content check per `/country/*` page before scaling further. At the current pace (+2 countries since last audit), this is not an imminent concern but should be re-checked periodically as country count grows.

## Recommendations (priority order)
1. **Low** — Going forward, only bump a content file's `updatedAt` frontmatter when it is actually edited (not on unrelated bulk commits), so `lastmod` values in the sitemap naturally differentiate over time instead of showing a wall of identical dates. No code change needed — this is a content-workflow discipline item, since the `serialize()` mechanism itself is already correct.
2. **Monitor** — Re-run the location-page quality gate check when country count approaches 30 (currently 14, soon 16 with Brazil/Vietnam); hard-stop justification required at 50+.
3. **Info** — No other action items. Both prior recommendations (`/sitemap.xml` 404, missing `lastmod`) are resolved; internal trailing-slash redirect issue is also resolved as a side effect of `trailingSlash: 'always'`.

## Raw Data
- Full sitemap URL list, per-URL status codes, and lastmod extraction from this audit are available at:
  `/private/tmp/claude-501/-Users-wonsukchoi-Developer-etiquetteness/340a1b47-9407-4816-966d-1c31a6aa95aa/scratchpad/sitemap-audit/` (`all_urls.txt`, `status_report.csv`, `sitemap-0.xml`, `sitemap-index.xml`)
