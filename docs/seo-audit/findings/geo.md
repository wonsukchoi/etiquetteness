# GEO / AI-Search Readiness Audit — etiquetteness.com
Audited: 2026-09-02
Method: raw HTTP fetch (curl, multiple UAs) of robots.txt, llms.txt, sitemap, homepage, and 3 sample article pages (JP business cards, UK queueing, FR dining hands).

## GEO Health Score: 45 / 100

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 55/100 | 13.8 |
| Structural Readability | 20% | 40/100 | 8.0 |
| Multi-Modal Content | 15% | 20/100 | 3.0 |
| Authority & Brand Signals | 20% | 25/100 | 5.0 |
| Technical Accessibility | 20% | 75/100 | 15.0 |
| **Total** | | | **44.8 ≈ 45** |

Platform-specific estimate (directional, not measured live via DataForSEO — no MCP access in this session):
- Google AI Overviews: Low-Medium (concise direct answers help, but thin authority/no dates hurts)
- ChatGPT (browsing/search): Low (no llms.txt, no author/org schema, no third-party mentions)
- Perplexity: Low-Medium (source citation habit is a plus, but short passages and no lists limit extraction quality)
- Bing Copilot: Low-Medium (SSR content is fully crawlable, sitemap present)

---

## 1. AI Crawler Access — [OK]
`robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://etiquetteness.com/sitemap-index.xml
```
- No disallow rules of any kind. All AI crawlers are allowed by default: **GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, CCBot, Google-Extended, anthropic-ai, cohere-ai — all effectively ALLOWED.**
- Live UA spot-check (fetched `/` with spoofed User-Agent headers) confirms no edge/WAF-level blocking either — all returned HTTP 200: GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, CCBot, Google-Extended.
- **Severity: Info / No action required for crawl access.** Optional: explicitly block `CCBot`, `anthropic-ai`, `cohere-ai` if the goal is to prevent training-data scraping while still allowing citation-oriented bots (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot) — current blanket-allow already satisfies the citation goal, so this is a policy choice, not a defect.
- **Severity: Medium.** Cloudflare (used for hosting per project deploy config) has a dashboard-level "Block AI Bots" toggle that operates independently of robots.txt and would return 403s invisibly to robots.txt inspection. Confirmed NOT currently blocking via live UA test, but recommend verifying this toggle stays OFF (or intentionally configured) since a future Cloudflare setting change could silently cut off AI visibility without touching robots.txt.

## 2. llms.txt — [MISSING — Severity: Medium]
`https://etiquetteness.com/llms.txt` → **HTTP 404**.
- No `llms.txt` file, therefore no RSL 1.0 licensing declaration either.
- Site has clean, structured, machine-legible content (37 short etiquette entries, consistent template) that would benefit from an llms.txt index of canonical pages/categories.
- **Recommendation:** Add `/llms.txt` with site summary, links to the 6 category pages, and top article URLs. Effort: Low (single static file, ~30 min).

## 3. Citability (Passage-Level) — Severity: Medium-High
Sampled 3 article pages (`/etiquette/japan/business-card-two-hands/`, `/etiquette/united-kingdom/social-always-queue/`, `/etiquette/france/dining-hands-on-table/`).

**Strengths:**
- Each page has ONE unambiguous topic, a clear H1 stating the rule, and a self-contained answer paragraph — good for single-fact extraction.
- Direct, imperative "how to" language ("Offer your card with both hands...") — no fluff/intro paragraphs to wade through.
- Source attribution present and linked (e.g., "Source: Meishi Koukan — Coto Academy" linking to `cotoacademy.com`, `rel="noopener noreferrer"`, opens in new tab). This is a real positive for trustworthiness/citability.

**Gaps:**
- **Passage length is too short.** Body text measured at ~71–90 words per article vs. the 134–167 word optimum for AI citation. Answers are correct but thin — AI systems often prefer passages with enough context to stand alone (a "why," a counter-example, or a consequence) rather than a single sentence-cluster.
- **No structured lists.** `grep` for `<ul>`/`<ol>` returned **0 matches on all 3 sampled pages.** A "Do / Don't" bullet format (or short 2-3 item list of do's/don'ts, or a mini FAQ) would materially improve extractability — LLMs disproportionately lift list items and Q&A pairs.
- **No question-based headings.** The only H2 on each article page is boilerplate ("More from Japan" / "More from France") — there are no in-content H2/H3s like "Why do you exchange business cards with two hands in Japan?" that would let an AI system map a natural-language query directly to a heading + short answer.
- **Recommendation:** Expand each entry to ~140-160 words by adding a 1-sentence "why this matters" / cultural-context line, convert the core guidance into a 3-4 item do/don't list, and add one FAQ-style H2 ("Why does this etiquette rule exist?"). Effort: Medium (content work across 37 existing entries; template change is Low, content rewrite is the bulk of effort).

## 4. Structural Readability — Severity: Medium
- Single H1 + no in-content subheadings; article body is one dense paragraph.
- No tables, no numbered steps, no definition callouts for foreign/loanwords used (e.g., "meishi," "la bise," "bella figura" appear without a glossary-style `<dfn>`/bold-defined-term treatment, which hurts entity disambiguation for AI parsers).
- **Recommendation:** Add a lightweight glossary/definition pattern for the one foreign term per article (bold + short gloss inline), and split answers into a "The rule" / "Why it matters" / "What to avoid" 3-part structure with real headings. Effort: Medium.

## 5. Multi-Modal Content — Severity: High (gap)
- Zero `<img>`, `<figure>`, `<video>`, or `<table>` elements found on any sampled article page. Content is 100% text.
- No images means no image alt-text entity signals, no visual citation opportunities (e.g., Google AI Overview / Perplexity image carousels), and weaker engagement/dwell-time signals.
- **Recommendation:** Add at least one illustrative image per article (photo or simple graphic of the etiquette action) with descriptive alt text including country + etiquette topic. Effort: Medium-High (sourcing/creating 37 images).

## 6. Authority & Brand Signals — Severity: High
- **No About page.** Checked `/about/`, `/about-us/`, `/contact/`, `/privacy/`, `/terms/`, `/editorial-policy/` — **all return HTTP 404.** There is no page establishing who publishes this content, editorial process, or contact information. This is one of the largest gaps for AI trust/authority scoring (E-E-A-T-adjacent signals matter for citation selection).
- **No Organization schema.** Homepage JSON-LD only declares `WebSite`. Article pages only declare `Article` + `BreadcrumbList`. No `Organization` or `Person` (author) entity anywhere on the site, no `publisher` field on Article schema, no `sameAs` links to any social/brand profiles.
- **No author byline** on any article (no `author` field in schema, no visible byline in rendered HTML).
- **`dateModified` looks unreliable.** All 3 sampled articles returned `"dateModified":"2026-09-02T00:00:00.000Z"` — i.e., today's date on every single page, and `datePublished` is absent entirely. This strongly suggests the date is computed at build/request time rather than reflecting real content history. AI systems and search engines use freshness signals to weight trust/recency; a site where every page has an identical, seemingly-live-generated `dateModified` is a red flag (worse than having no date at all, since it could read as manipulation). Sitemap (`sitemap-0.xml`) also has **zero `<lastmod>` entries** across all 59 URLs.
- **Brand mention signals (Wikipedia / Reddit / YouTube / LinkedIn):** Not independently verifiable without live search/DataForSEO access in this session, but given the site has no About/contact page and appears to be a newer property, it is reasonable to assume near-zero third-party brand presence today. This is the single highest-leverage category per the provided correlation table (YouTube ~0.737, Reddit high, Wikipedia high) and is currently unaddressed.
- **Recommendation (highest priority):**
  1. Publish a real About page with founder/editorial info, mission statement, and contact method. Add `Organization` schema (name, logo, url, sameAs) site-wide and a `publisher` reference from every `Article`.
  2. Fix `dateModified`/add `datePublished` to reflect real content history, and add `<lastmod>` to the sitemap.
  3. Begin off-site presence building (a YouTube short or Reddit thread per top category performs disproportionately well per the correlation data) — this is outside on-page control but is the largest single lever available.
  Effort: About page + schema = Low-Medium; dates/sitemap fix = Low; off-site brand building = High (ongoing).

## Top 5 Highest-Impact Changes (prioritized)

| # | Change | Impact | Effort |
|---|---|---|---|
| 1 | Add About page + sitewide `Organization` schema (name, logo, sameAs, publisher on Article) | High | Low-Medium |
| 2 | Fix `datePublished`/`dateModified` (currently identical "today" timestamp on every page) + add `<lastmod>` to sitemap | High | Low |
| 3 | Add `/llms.txt` indexing categories + top articles | Medium | Low |
| 4 | Expand article body copy to ~140-160 words with a Do/Don't bullet list and one FAQ-style H2 per entry | High | Medium |
| 5 | Add one alt-texted image per article + begin off-site brand mentions (YouTube/Reddit) for top categories | Medium-High | Medium-High |

## AI Crawler Access Status
| Crawler | robots.txt | Edge/WAF (live UA test) |
|---|---|---|
| GPTBot | Allowed | 200 OK |
| OAI-SearchBot | Allowed | 200 OK |
| ClaudeBot | Allowed | 200 OK |
| PerplexityBot | Allowed | 200 OK |
| Google-Extended | Allowed | 200 OK |
| CCBot | Allowed (not blocked) | 200 OK |
| anthropic-ai / cohere-ai | Allowed (not blocked) | Not tested live |

## llms.txt Status: **Missing (404)**, RSL 1.0: Not applicable (no llms.txt to carry it)

## Technical Accessibility: SSR/Static (Astro-based, per repo commit history) — content fully present in raw pre-JS HTML for all pages checked (title, meta description, full article body, JSON-LD). No CSR/hydration gating detected. This is a genuine strength.
