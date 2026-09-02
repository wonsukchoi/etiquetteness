# SEO Audit — etiquetteness.com
Date: 2026-09-02
Method: Live site (curl/WebFetch-based; no Lighthouse/Playwright/CrUX/DataForSEO in this environment — flagged per-section where lab/proxy only). 7 specialist passes: Technical, Content/E-E-A-T, Schema, Sitemap, Performance, GEO/AI-search, SXO.

## Overall SEO Health Score: 49 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 70 | 15.4 |
| Content Quality | 23% | 34 | 7.8 |
| On-Page SEO | 20% | 50 | 10.0 |
| Schema / Structured Data | 10% | 40 | 4.0 |
| Performance (proxy/lab) | 10% | 65 | 6.5 |
| AI Search Readiness (GEO) | 10% | 45 | 4.5 |
| Images | 5% | 10 | 0.5 |
| **Total** | | | **48.7 ≈ 49** |

Business type: editorial/reference site (programmatically-structured country × category etiquette-rule database, Astro static site on Cloudflare).

## Top 5 Critical Issues
1. **No About, Contact, Privacy, or Terms pages exist anywhere (all 404).** Zero author attribution site-wide. This is the single biggest gap — Trustworthiness is the highest-weighted E-E-A-T factor and currently sits near zero.
2. **`dateModified` is fabricated-looking**: identical to the crawl/build date on every single page sampled across all 3 specialist passes that checked it (content, schema, GEO). No `datePublished` exists at all. Reads as freshness manipulation even if unintentional.
3. **Article body copy is extremely thin**: 50–90 words per page, single fact + one citation, no context/exceptions/"why." Category and country hub pages have ~0 unique words — pure link lists.
4. **Every internal link on the site triggers an unnecessary 307 redirect** (missing trailing slash vs. canonical URLs) — confirmed independently by the technical, performance, and sitemap passes. Hits 100% of internal navigation and crawl paths.
5. **Zero images anywhere on the site**, despite the content being inherently visual/gestural (bowing, cheek-kissing, hand placement). No `og:image`, no `<img>`, no alt text possible — kills social previews, Discover/rich-result image eligibility, and AI Overview image citation.

## Top 5 Quick Wins
1. Fix `astro.config.mjs` → `trailingSlash: 'always'` (or emit trailing-slash hrefs in templates). Removes the redirect on every internal link and breadcrumb URL in one change. (Technical/Performance/Sitemap)
2. Add a `_headers` rule: `Cache-Control: public, max-age=31536000, immutable` for `/_astro/*`. One-line caching fix. (Performance/Technical)
3. Add security headers via Cloudflare `_headers`/Worker (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, CSP). (Technical)
4. Add `/llms.txt` indexing the 6 categories + top articles. Single static file. (GEO)
5. Differentiate the duplicate meta description shared by every category/country page (currently all say "Unwritten etiquette rules from around the world."). Template it per category/country name. (Technical/Content)

---

## Technical SEO (Score: 70/100)

**What works:** Fully static/SSR Astro site — zero JS dependency for indexable content (excellent crawlability foundation). robots.txt valid, correctly points to the real sitemap. Sitemap: 57/57 URLs verified 200, zero redirects. Correct self-referencing canonicals everywhere, no accidental noindex. HTTP→HTTPS redirect works. Brotli compression enabled. Clean, human-readable URL taxonomy.

**Critical**
- Zero security headers site-wide (no HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- Every internal link (nav, category chips, cross-links, breadcrumb JSON-LD `item` URLs) omits the trailing slash and gets 307-redirected to the canonical trailing-slash URL — systemic, not a corner case.

**High**
- The redirect uses `307` (temporary) instead of `301`/`308` for what is a permanent URL-structure decision.
- Hashed `/_astro/*` assets served `max-age=0, must-revalidate` despite content-hashed filenames that are safe to cache forever.

**Medium**
- Duplicate meta descriptions across all category pages ("Unwritten etiquette rules from around the world.").
- Thin content at scale: ~500–700 unique characters per article page across 37 pages.
- `BreadcrumbList` JSON-LD references non-canonical (no-slash) URLs — same root cause as the redirect issue.
- No `og:image`/`twitter:image` anywhere; Twitter card is `summary` not `summary_large_image` (site has zero images).
- `/search/` is in the sitemap with no indexable raw content (Pagefind renders client-side only) — recommend `noindex,follow` + drop from sitemap.
- `Article` schema missing `image`, `author`, `datePublished`.

**Low**
- Empty-body 404 page (no nav, no search box).
- `www.etiquetteness.com` has no DNS record at all (hard fails instead of redirecting).
- Sitemap has no `<lastmod>` on any of 57 URLs.

**Info**
- IndexNow protocol not implemented — cheap add given the Cloudflare Workers deploy pipeline.
- robots.txt wildcard-allows all AI crawlers by default — a business decision, not a defect, but worth making explicit.

## Content Quality & E-E-A-T (Score: 34/100 | Weighted E-E-A-T ~19/100)

Site structure: 37 fact pages generated from a country × category matrix (6 categories × ~11 countries), one rule per page.

| E-E-A-T Factor | Weight | Score |
|---|---|---|
| Experience | 20% | 15/100 |
| Expertise | 25% | 20/100 |
| Authoritativeness | 25% | 25/100 |
| Trustworthiness | 30% | 15/100 |

**Critical**
- No About, Contact, Privacy, Terms, or methodology pages exist anywhere (all verified 404); none appear in the sitemap.
- No author attribution anywhere on the site.
- Article body copy averages 50–72 words (dek + 2 short paragraphs + 1 source citation) with no regional variation, exceptions, or "why" discussion. Category/country hub pages have effectively zero unique body copy — pure listing pages.

**High**
- `dateModified` equals the crawl date on every sampled article (no `datePublished` exists) — reads as a rolling build timestamp, a freshness-manipulation red flag per current quality-rater guidance.
- Duplicate meta descriptions across all 9 category/country pages checked.
- Single-source citation per fact with no cross-verification — consistent with a "summarize one article" pattern rather than demonstrated subject-matter expertise.

**Medium**
- Homogeneous template across all 37 pages with no differentiation signal for raters.
- No internal contextual linking within body copy beyond the same-country "More from X" footer block.
- Undefined "strict/casual" severity tag with no legend or methodology page.
- No user feedback/correction-reporting mechanism.

**AI Citation Readiness: 58/100** — strong bones (clean H1s, quotable definitive statements, valid JSON-LD, predictable template) undermined by no named authority, no real dates, and single-sentence depth with no supporting nuance.

**Recommendation to route separately:** the country×category matrix structure and per-page word count are exactly what the `seo-programmatic` skill audits (thin-page ratio, indexation strategy at scale) — worth a dedicated follow-up pass.

## Schema / Structured Data (Score estimate: 40/100)

| Page type | JSON-LD present |
|---|---|
| Homepage | `WebSite` only (no `SearchAction`) |
| Article (37 pages) | `Article` + `BreadcrumbList` (shared template, same defects on all 10 sampled) |
| Category pages (6) | **None** |
| `/search/` | None (fine — no content to mark up) |

**High**
- `about` property is a bare string (`"japan"`) — invalid; schema.org requires a `Thing`/`Place`/`Country` entity, not `Text`.
- No `author` property and no visible byline anywhere — blocks full Article rich-result eligibility and is a core E-E-A-T gap.
- No `image` property (site has zero images).
- `dateModified` identical across all 10 sampled articles, matching request date — looks computed at build/request time rather than pulled from real edit history.
- Category pages carry zero structured data despite being substantial, internally-linked hub pages.

**Medium**
- No `publisher`/`Organization` schema anywhere on the site to link from Articles.
- No `datePublished`.
- No homepage `SearchAction` despite a working `/search/` page.

**Low**
- No `@id`/`mainEntityOfPage` for entity de-duplication.
- Breadcrumb `name` values are raw slugs (`"japan"`), not title-cased (`"Japan"`).

Ready-to-use JSON-LD for Organization, WebSite+SearchAction, corrected Article template, Person (once bylines exist), and CollectionPage+BreadcrumbList for category pages are in `findings/schema.md`.

## Sitemap (No critical issues)

Sitemap index (`sitemap-index.xml` → `sitemap-0.xml`): 57 URLs, well-formed XML, all under the 50k limit. All 57 URLs verified 200 with zero redirects (fully canonical). No noindex tags found on spot-checked pages. Only 12 country pages — well under the 30-page doorway-risk quality gate. No orphaned pages found cross-checking nav/category/detail pages against sitemap coverage.

- Medium: conventional `/sitemap.xml` path 404s (only `/sitemap-index.xml` resolves) — robots.txt correctly points crawlers to the real path, but this trips up tools that probe the default location.
- Low: no `<lastmod>` on any of the 57 URLs.
- Low: internal links use non-trailing-slash URLs that 307-redirect to the sitemap's already-correct trailing-slash form (same issue as Technical #2).

## Performance (proxy/lab estimates only — no Lighthouse/CrUX/PageSpeed access in this environment)

- **High:** Every internal link (60+ on homepage alone) omits the trailing slash, forcing a 307 round trip before the destination page loads — doubles latency on effectively every navigation site-wide. Fix: `trailingSlash: 'always'` in `astro.config.mjs`.
- **Medium:** Render-blocking Google Fonts stylesheet on every page (preconnect + `font-display: swap` already correctly set, mitigating FOIT/CLS risk, but still a third-party round trip). Recommend self-hosting the two variable woff2 files (~115KB combined) with preload.
- **Medium:** Hashed `/_astro/*` assets served `max-age=0, must-revalidate` — same fix as Technical #4.
- **Low:** `pagefind-ui.js` (120KB) on `/search` loads without `defer`.
- **Positive:** No images anywhere → no LCP-image or CLS-image risk; lean DOM (~90–380 tags); no custom content-page JS.
- **Not measured:** Real INP, LCP timing, CLS score, field data — requires actual Lighthouse/CrUX/PageSpeed access to validate. TTFB (~440–570ms on cache HIT from this test environment) is flagged as a likely vantage-point artifact, not necessarily representative of real users.
- **Note:** an analytics script (`analytics.wonsukchoi.com/script.js`, commit `d3a50ae`, uses `defer`) exists in source but was not observed live on any sampled page — confirm deploy status.

## AI Search Readiness / GEO (Score: 45/100)

| Dimension | Weight | Score |
|---|---|---|
| Citability | 25% | 55/100 |
| Structural Readability | 20% | 40/100 |
| Multi-Modal Content | 15% | 20/100 |
| Authority & Brand Signals | 20% | 25/100 |
| Technical Accessibility | 20% | 75/100 |

- **AI crawler access: good.** robots.txt allows all (`Allow: /`); live UA spot-checks confirm GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, CCBot, Google-Extended all get 200 OK — no edge/WAF block detected. (Note: Cloudflare's dashboard "Block AI Bots" toggle operates independently of robots.txt — verify it stays off.)
- **llms.txt: missing (404).** Cheap, ~30-minute add given the clean, structured content.
- **Citability gaps:** passages run 71–90 words vs. the 134–167 word optimum; zero `<ul>/<ol>` lists found on any sampled page; no question-based in-content headings (only headings are boilerplate "More from X").
- **Multi-modal: weakest dimension.** Zero images/figures/video/tables anywhere.
- **Authority: weakest overall.** No About/Contact/Privacy page, no Organization/author schema, `dateModified` identical to today's date on every page (same red flag as Content/Schema findings), zero `<lastmod>` in the sitemap.
- Per-provided correlation data, off-site brand mentions (YouTube, Reddit) carry the strongest citation correlation and are currently unaddressed — outside on-page control but the single largest lever available long-term.

## Search Experience (SXO) — Gap Score: 31/100

*(Live SERP/PAA data was not pulled in this pass — findings below are inferred from site structure and domain knowledge, flagged as directional, not proven.)*

- **Page-type mismatch (HIGH-to-CRITICAL):** every article is a ~130-140 word single-fact micro-card. Etiquette/culture queries are typically won by comprehensive guide/listicle pages (800-1500+ words) covering the whole topic plus visuals — worst at the category hub level, which has no synthesized guide content at all (just a link list).
- **Persona scoring** (5 personas, weakest first): Cross-Culture Comparer 31/100, Trip-Prep Browser 36/100, Business Traveler 40/100, Snippet/Voice Searcher 43/100, Quick Rule-Checker 62/100 (the one persona the current format actually serves).
- Weakest gap dimensions: Media Richness 1/15 (zero images on inherently visual/gestural topics), Content Depth 3/15, Authority Signals 3/15.
- Missing FAQPage/HowTo/ItemList schema means the site isn't structurally positioned to win the SERP features (snippets, PAA) that its short-answer format would otherwise suit.

## Images (Score: 10/100)

No images exist anywhere on the site — zero `<img>`, `<picture>`, `<figure>`, or CSS background images across homepage, category, country, and all sampled article pages. This is flagged independently by Technical, Schema, GEO, and SXO as a cross-cutting gap: it blocks `og:image`/social previews, blocks Article schema `image` eligibility, removes AI Overview/Perplexity image-citation opportunities, and weakens engagement on topics that are inherently visual (bowing, cheek-kissing, hand placement, chopstick use).

---

## Confirmed cross-cutting patterns (flagged independently by 3+ specialists)
1. **Trailing-slash 307 redirect on every internal link** — Technical, Performance, Sitemap.
2. **`dateModified` = today's date on every page, no `datePublished`** — Content, Schema, GEO, SXO.
3. **No About/Contact/Privacy/Terms pages, no author, no Organization schema** — Content, Schema, GEO, SXO.
4. **Zero images site-wide** — Technical, Schema, GEO, SXO.
5. **Thin body copy (50-90 words/article, ~0 words on hub pages)** — Content, GEO, SXO.

## Caveats
- No Lighthouse, PageSpeed Insights, CrUX, or Playwright/browser access was available in this environment — all performance and visual findings are lab/proxy estimates from curl timing and static HTML inspection, not real field data. Re-validate before treating latency numbers as final.
- SXO findings did not include a live SERP/PAA pull — the page-type-mismatch severity should be confirmed with real search data before treating it as settled.
- Not run in this pass (no credentials/MCP access in this session): Google Search Console/GA4/CrUX field data (`seo-google`), DataForSEO live SERP/backlink data, visual/screenshot testing (`seo-visual`), local SEO (not applicable — this is not a local business).
