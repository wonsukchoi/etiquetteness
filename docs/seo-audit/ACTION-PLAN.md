# Action Plan — etiquetteness.com

Rerun 2026-09-02. Health score 49 → 67. Items below reflect what's newly found or still open this pass — see `FULL-AUDIT-REPORT.md` for what's already fixed since baseline.

## Phase 1: Critical Fixes (Week 1)

1. **[Technical] Submit sitemap to Search Console, request indexing.** `site:etiquetteness.com` returns zero results. No technical blocker found (robots.txt/noindex/canonicals all clean, GSC ownership already verified via DNS TXT record) — most likely never submitted. Log in, submit `sitemap-index.xml` under Sitemaps, run URL Inspection + Request Indexing on 5-10 representative URLs. **Nothing else on this list moves organic traffic until this is done.**
2. **[Technical/Content/Schema] Fix `datePublished` — production serves an identical timestamp on all 84 pages.** Root cause: Cloudflare Workers Builds likely does a shallow git clone, so `git log --diff-filter=A` (in `src/lib/publishedDates.ts`) only sees one commit. Check the Workers Builds git-checkout depth setting; if it can't be deepened, fall back to a frontmatter `publishedAt` field written once per entry.
3. **[Schema] Add `Organization` + `publisher`/`author` schema site-wide**, referenced from every `Article`. Source content already exists in prose on `/about/` — copy-paste job, ready-to-use JSON-LD in `findings/schema.md` §4A/C.
4. **[Schema] Fix `about` type mismatch on Article schema** — still a bare string (`"about":"japan"`), invalid against schema.org's `Thing` range. Swap for `{ "@type": "Country", "name": countryLabel }` — 2-line template change (`countryLabel` already computed).
5. **[Schema] Add JSON-LD to country AND category hub pages** — confirmed zero structured data on both (20 pages total, doubled scope vs. baseline's category-only finding). `CollectionPage` + `BreadcrumbList` + `ItemList`, snippet in `findings/schema.md` §4E.

## Phase 2: High-Impact Improvements (Weeks 2-3)

6. **[Performance/Technical] Long-lived caching for hashed assets and OG images.** `Cache-Control: public, max-age=31536000, immutable` for `/_astro/*`; separate `max-age=86400` for `/og/*` (not content-hashed). Recommended at baseline, still not live — second consecutive audit flagging this.
7. **[GEO] Add `/llms.txt`** indexing 6 categories, 14 countries, 84 entries, mirroring the CC BY-NC 4.0 terms already on `/about/`. ~30-45 min.
8. **[Content] Stop overwriting `updatedAt` to today's date on every build for every entry.** All 84 files currently carry the same date regardless of whether they were actually touched — only bump it on real content edits going forward, so `dateModified`/sitemap `<lastmod>` start carrying real signal.
9. **[SXO] Build real guide-depth content at the hub layer** — turn `/country/[country]/` and `/category/[category]/` from link directories into synthesized guides (or add a new `/country/[country]/[category]/` intersection page). This is the core unresolved page-type mismatch for broad "[country] [category] etiquette" queries.
10. **[GEO/SXO] Roll the Do/Don't list pattern out to the ~1/3 of entries that don't have one yet**, and add question-phrased H2s alongside/instead of the generic "Why it matters" label (e.g., "Why do Japanese people slurp noodles loudly?") — highest-leverage remaining AI-citability change, template already proven on 2/3 of entries.
11. **[Multi-Modal] Add `<image:image>` sitemap entries for the existing per-entry OG images** — data already exists, needs sitemap-generation logic only. Low effort, currently zero entries despite the `xmlns:image` namespace being declared.
12. **[Technical] Add Contact and Privacy pages.** Downgraded from Critical since `/about/` now covers most of the same trust ground, but both still hard-404, and the site does load third-party analytics (privacy-page hygiene expectation).

## Phase 3: Content & Authority (Month 2)

13. **[Images] Add at least one illustrative in-body image per article** for physically-demonstrated customs (bowing, wai, cheek-kiss, chopstick placement) with descriptive alt text. Flagged independently by Content, GEO, and SXO — zero `<img>` tags in any article body despite the OG-image generation pipeline (`scripts/generate-og-images.ts`) already existing and being adaptable.
14. **[Content] Add a second corroborating source per entry** where feasible, or favor higher-authority sources (embassy/cultural-institute guides, academic sources) over the current single travel-blog-tier citation per fact.
15. **[Content] Put a name (even just "maintained by [handle]") and a one-line credibility statement visible on-site** — GitHub handle + email is progress over full anonymity but still requires the reader to infer who's behind the site.
16. **[Content] Add a 1-2 sentence legend for the strict/casual severity tag** — natural home is the About page's "How an entry gets made" section.
17. **[Technical] Fix residual `307` redirect + 2-hop chain for non-canonical/external-linked URLs** — no longer hit by internal navigation, but still affects inbound backlinks/bookmarks using the pre-fix URL format. Override with an explicit `301`/`308`.
18. **[Technical] De-index `/search/`** — still thin (client-side rendered results), still in the sitemap. Add `noindex,follow`, drop from sitemap.
19. **[Follow-up] Run `seo-programmatic` skill** on the country×category matrix now that the corpus is 84+ entries across 13-15 countries — thin-page-ratio and indexation-at-scale questions are better suited to that skill.
20. **[Content] When Brazil/Vietnam deploy**, re-run a scoped content/schema pass on the 10 new entries — they're drafted and wired but weren't live for this audit.

## Phase 4: Monitoring & Iteration (Ongoing)

21. **[Technical] Ship a real 404 page body** — still returns `content-length: 0`, headers now correct but no HTML/nav/search.
22. **[Technical] Self-host Google Fonts woff2 files** with `preload`, paired with the caching fix in #6 — still render-blocking on every page, unchanged since baseline.
23. **[Technical] Add `defer` to `/pagefind/pagefind-ui.js`** on `/search/` — unchanged since baseline.
24. **[Technical] Add `www` DNS record + redirect to apex** — not re-verified this pass, carried forward from baseline as open.
25. **[Technical] Add IndexNow protocol** — cheap given the Workers deploy pipeline, unimplemented both passes.
26. **[Validate] Re-run Performance and SXO with real Lighthouse/CrUX/PageSpeed and a full SERP sweep** once available — both remain proxy/limited-sample estimates across two consecutive audits.
27. **[GEO] Begin off-site brand-mention building** (a YouTube short or Reddit thread per top category) — still the single largest AI-citation lever outside on-page control, unchanged from baseline.
28. **[Build hygiene] Confirm whether the orphaned React client bundle (`@astrojs/react`, `client.B3v6l__6.js`) is intentional scaffolding or dead weight** — not referenced by any current page, zero measured cost today, but worth a decision before it's forgotten.
