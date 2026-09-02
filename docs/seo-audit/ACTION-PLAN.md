# Action Plan — etiquetteness.com

## Phase 1: Critical Fixes (Week 1)

1. **[Technical/Perf] Fix trailing-slash redirect on every internal link.** Set `trailingSlash: 'always'` in `astro.config.mjs` so templates emit `/category/dining/` not `/category/dining`. Also fix `BreadcrumbList` JSON-LD `item` URLs (same helper). Eliminates a 307 hop on ~100% of internal navigation/crawl paths.
2. **[Technical] Add security headers.** Cloudflare `_headers` file or Worker middleware: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Content-Security-Policy` (allow-list Google Fonts + Pagefind origins — test `/search/` before enforcing).
3. **[Content/Trust] Publish About + Contact pages.** State who runs the site, why, how to reach them / report a correction. Highest-leverage single fix — Trustworthiness is the highest-weighted E-E-A-T factor and is currently at zero.
4. **[Schema/Content] Fix `dateModified`/`datePublished`.** Derive from real content history (frontmatter or git commit date), not build/request time. Add `<lastmod>` to the sitemap from the same source. Currently reads as a fabricated freshness signal across every page.
5. **[Schema] Fix `about` type mismatch on Article schema.** Wrap country string in a `Country`/`Place` entity instead of a bare string (currently invalid against schema.org).

## Phase 2: High-Impact Improvements (Weeks 2-3)

6. **[Performance/Technical] Long-lived caching for hashed assets.** `Cache-Control: public, max-age=31536000, immutable` for `/_astro/*` via Cloudflare `_headers`.
7. **[Schema] Add `Organization` + `publisher` schema site-wide**, referenced from every Article and from the homepage `WebSite` block. Add author (`Organization` type until real bylines exist).
8. **[Schema] Add JSON-LD to category pages** (`CollectionPage` + `BreadcrumbList`) — currently zero structured data on 6 substantial hub pages.
9. **[Technical/Content] Differentiate meta descriptions** across all category/country pages — currently identical ("Unwritten etiquette rules from around the world.") on every one.
10. **[GEO] Add `/llms.txt`** indexing the 6 categories + top articles. Single static file, ~30 min effort.
11. **[Technical] Fix redirect status code + asset**: change trailing-slash redirect from `307` to `301`/`308` if any residual redirect remains after fix #1 (e.g. from external backlinks).
12. **[Technical] De-index or fix `/search/`**: add `noindex,follow` and drop from sitemap (Pagefind renders client-side only — raw indexed content is empty).

## Phase 3: Content & Authority (Month 2)

13. **[Content/GEO] Deepen every article to ~140-160 words**: add a "why this matters" line, a 3-4 item Do/Don't list, and one FAQ-style H2 ("Why does this etiquette rule exist?"). Directly improves AI citability, SXO Content Depth, and E-E-A-T Expertise.
14. **[Content] Add a second corroborating source per fact** where feasible, or favor higher-authority primary sources over generic aggregators.
15. **[Images] Add at least one illustrative image per article** (photo or simple graphic of the etiquette action) with descriptive alt text — flagged as a gap by Technical, Schema, GEO, and SXO independently. Wire into `Article.image` and `og:image` once real assets exist.
16. **[SXO] Build real guide-depth content at the category/country hub level** (e.g., "France Dining Etiquette: The Complete Guide") synthesizing the existing one-liners — addresses the CRITICAL page-type mismatch flagged by SXO before optimizing individual micro-cards further.
17. **[Schema/SXO] Add FAQPage/HowTo/ItemList schema** where genuine Q&A/how-to content exists, and `ItemList` for the category/homepage card grids.
18. **[Content] Add a methodology page** explaining the undefined "strict/casual" severity tag and how facts are sourced/verified.
19. **[Follow-up] Run `seo-programmatic` skill** on the country×category matrix for a dedicated thin-page-ratio / indexation-at-scale review (flagged by the content specialist as out of this skill's scope).

## Phase 4: Monitoring & Iteration (Ongoing)

20. **[Technical] Add `www` DNS record + redirect to apex** for defense-in-depth (currently hard-fails with no record).
21. **[Technical] Ship a real 404 page** with navigation/search box instead of an empty body.
22. **[Technical] Add IndexNow protocol** — low-effort given the Cloudflare Workers deploy pipeline; speeds up discovery on Bing-powered surfaces.
23. **[Validate] Re-run Performance and SXO with real Lighthouse/CrUX/PageSpeed and live SERP data** once available — current findings in those two categories are lab/proxy estimates or structure-inferred, not field-verified.
24. **[GEO] Begin off-site brand-mention building** (YouTube short or Reddit thread per top category) — the single largest AI-citation lever available, per provided correlation data, and entirely outside on-page control.
25. **[Technical] Decide explicitly on AI crawler policy** (currently allow-all via wildcard) rather than relying on the implicit default — confirm Cloudflare's "Block AI Bots" dashboard toggle stays off/intentional.
