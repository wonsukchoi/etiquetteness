# Sitemap Audit — etiquetteness.com
Date: 2026-09-02
Source: https://etiquetteness.com/sitemap-index.xml (child: https://etiquetteness.com/sitemap-0.xml)

## Summary
Sitemap is small (57 URLs), structurally valid, fully covered by 200-status canonical
URLs with zero redirects. Location-page quality gate does NOT trigger (only 12 country
pages, well under the 30-page warning threshold). Main gaps are missing `lastmod` and
a broken top-level `/sitemap.xml` convention path.

## Validation Checks

| Check | Result | Severity | Notes |
|---|---|---|---|
| `sitemap.xml` (conventional path) | 404 | Medium | `/sitemap.xml` returns 404; only `/sitemap-index.xml` resolves. Many crawlers/tools (and some SEO auditors) probe `/sitemap.xml` by default and will report it missing. `robots.txt` does correctly declare the real path. |
| `robots.txt` sitemap directive | Pass | — | `Sitemap: https://etiquetteness.com/sitemap-index.xml` present and correct. |
| Sitemap index XML validity | Pass (`xmllint --noout`) | — | Well-formed `sitemapindex`. |
| Child sitemap XML validity | Pass (`xmllint --noout`) | — | Well-formed `urlset`, correct namespace. |
| URL count vs 50,000 limit | Pass | — | 57 URLs, far under limit. No splitting needed. |
| HTTP status of all URLs | Pass — 57/57 return `200`, 0 redirects | — | Verified via curl `%{http_code}` + `%{num_redirects}` for every `<loc>`. |
| Canonical (non-redirecting) URLs | Pass | — | All sitemap URLs are the final destination (trailing-slash form), no redirect hops. |
| Noindex on sitemap URLs | Pass (spot-check) | — | Checked homepage, category, etiquette detail, `/search/`, `/country/global/` — no `<meta name="robots">` noindex tags found. |
| `lastmod` usage | **Missing on all 57 URLs** | Low | No `lastmod` field anywhere in `sitemap-0.xml`. Google uses this as a (weak) freshness/recrawl signal; absence isn't fatal but is a missed, low-cost improvement. |
| `priority` / `changefreq` | Not present | Info | Good — these are deprecated/ignored by Google and correctly omitted. Nothing to remove. |
| Sitemap coverage vs internal linking | Pass | — | Spot-checked homepage nav + an etiquette detail page + a category page. All 57 sitemap URLs are reachable via internal links (categories/countries linked from nav or from etiquette detail pages); no orphaned sitemap entries or missing pages found. |

## Missing Pages (in crawl but not sitemap)
None found. All internally-linked pages discovered during spot-check (homepage, one category page, one etiquette detail page) map onto sitemap entries.

## Extra Pages (in sitemap but 404/redirected)
None. All 57 URLs return clean `200`.

## Quality Gate Check — Location/Programmatic Pages
- Country pages in sitemap: **12** (`/country/{china,france,germany,global,india,italy,japan,korea,mexico,saudi-arabia,thailand,united-kingdom}/`)
- Threshold status: **Below 30-page WARNING gate** — no unique-content percentage check required at this time.
- Etiquette detail pages: 37, each a distinct rule (not template-swapped city pages) — content is inherently differentiated by topic (dining/business/gifts/social) per country, not just a swapped placeholder, so this reads as "Safe at Scale" territory rather than doorway-page risk. No action needed now, but if the country roster grows toward 30+, re-run the 60%+ unique-content check per `/country/*` page before scaling further.

## Additional Observation (Low severity, adjacent to sitemap scope)
- Internal `<a href>` links throughout the site (nav, category pages, etiquette detail pages) point to **non-trailing-slash** paths (e.g. `href="/category/business"`), which the server 307-redirects to the trailing-slash canonical (`/category/business/`) — the same form already used correctly in the sitemap. This costs crawlers/users an extra redirect hop on every internal click even though the sitemap itself is clean. Recommend updating internal link generation to emit trailing-slash URLs directly to eliminate the redirect hop site-wide.

## Recommendations (priority order)
1. **Medium** — Add a `/sitemap.xml` that either 200s (redirect or alias to the index) or is intentionally excluded, to avoid false "missing sitemap" flags from tools/crawlers that probe the default path. `robots.txt` already points crawlers correctly, so this is a convenience/compatibility fix, not a discovery blocker.
2. **Low** — Add real per-page `lastmod` values (build/content timestamps) to `sitemap-0.xml` instead of omitting the field, to give Google an accurate freshness signal.
3. **Low** — Fix internal links to use canonical trailing-slash URLs directly, removing the unnecessary 307 redirect hop on every internal navigation click.
4. **Monitor** — If country/location pages grow past ~30, apply the 60%+ unique-content-per-page check before adding more; hard-stop justification required at 50+.

## Raw Data
- Full sitemap URL list and per-URL status codes captured during this audit are available at:
  `/private/tmp/claude-501/-Users-wonsukchoi-Developer-etiquetteness/bbe06e56-1064-405a-988d-cc39fe84a41f/scratchpad/etiquetteness-audit/status_report.csv`
