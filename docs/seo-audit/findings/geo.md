# GEO / AI-Search Readiness Audit — etiquetteness.com
Audited: 2026-09-02 (re-run — follow-up to prior 2026-09-02 pass, score 45/100)
Method: raw HTTP fetch (curl, multiple UAs) of robots.txt, llms.txt, sitemap, homepage, About page, and 6 sample article pages across old and newly-expanded countries (Japan slurping noodles + business cards, UK queueing, France dining-hands, Guam fiesta hospitality, Saudi Arabia gahwa coffee, Thailand wai greeting, Italy bella figura). Cross-checked GitHub API for repo visibility/license.

## GEO Health Score: 61 / 100 (up from 45)

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 73/100 | 18.25 |
| Structural Readability | 20% | 62/100 | 12.4 |
| Multi-Modal Content | 15% | 35/100 | 5.25 |
| Authority & Brand Signals | 20% | 45/100 | 9.0 |
| Technical Accessibility | 20% | 78/100 | 15.6 |
| **Total** | | | **60.5 ≈ 61** |

Platform-specific estimate (directional, not measured live via DataForSEO — no MCP access in this session; live web search also blocked by DuckDuckGo CAPTCHA):
- Google AI Overviews: Medium (rule + "why it matters" two-chunk structure and source links are well-suited to AIO's passage-extraction pattern; still capped by missing Organization/author schema)
- ChatGPT (browsing/search): Low-Medium (no llms.txt still hurts; but public MIT/CC-BY-NC licensing + About/editorial-policy page give ChatGPT's browsing tool clearer reuse signals than before)
- Perplexity: Medium (per-entry cited source links remain a strength; richer 130-215 word passages now give Perplexity more to quote verbatim)
- Bing Copilot: Medium (SSR content fully crawlable, sitemap present, About page adds a crawlable trust page)

---

## 1. AI Crawler Access — [OK], unchanged
`robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://etiquetteness.com/sitemap-index.xml
```
- No disallow rules of any kind — identical to prior audit. All AI crawlers effectively **ALLOWED**: GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, CCBot, Google-Extended, anthropic-ai, cohere-ai.
- **Severity: Info / No action required.** Same optional policy note as before: could explicitly block CCBot/anthropic-ai/cohere-ai (training-only bots) while keeping citation bots allowed, but current blanket-allow already covers the citation goal.
- **Severity: Medium (unchanged caveat).** Site is on Cloudflare; the dashboard "Block AI Bots" toggle operates independently of robots.txt. Not re-tested with live UA spoofing this pass (prior pass confirmed 200 OK across GPTBot/ClaudeBot/PerplexityBot/OAI-SearchBot/CCBot/Google-Extended) — recommend periodic re-verification since this setting is invisible to robots.txt inspection alone.

## 2. llms.txt — [STILL MISSING — Severity: Medium]
`https://etiquetteness.com/llms.txt` → **HTTP 404** (unchanged from prior audit).
- No RSL 1.0 licensing declaration via llms.txt either. However, the site now DOES have a real, machine-discoverable license statement: `LICENSE` (MIT, code) + `src/content/etiquette/LICENSE` (CC BY-NC 4.0, content) in the public GitHub repo, and the About page states "The code and content are open source" with a link to the repo. This is a genuine licensing-clarity improvement, just not surfaced via the AI-native `llms.txt`/RSL convention that LLM crawlers increasingly check first.
- Content is now even better suited to an llms.txt index than before: 84 short, consistently-templated entries across 14 countries and 6 categories (Dining, Business, Social, Travel, Gifts, Home), each with a stable URL pattern (`/etiquette/{country}/{slug}/`).
- **Recommendation (still open, now higher-value given content growth):** Add `/llms.txt` listing the site summary, CC BY-NC 4.0 reuse terms (mirroring the About page's licensing language), links to the 6 category pages and 14 country pages, and ideally the full 84-entry index. Effort: Low (single static file, ~30-45 min given the larger entry count).

## 3. Citability (Passage-Level) — Severity: Low-Medium (major improvement)
Sampled 6 article pages spanning both entries that existed at the prior audit (Japan business cards, UK queueing, France dining-hands) and newly-added ones (Guam, Saudi Arabia, Thailand, Italy).

**What changed since the last audit:**
- **Passage length grew substantially.** Core answer-block word counts now measured at 77-163 words (median ~140) — most sampled pages now land inside or very near the 134-167 word optimum, versus 71-90 words previously. Example: the Japan business-card entry (same page sampled at baseline) grew from ~71-90 words to **152 words**.
- **A structured "Why it matters" section now exists on every sampled page (6/6).** This is new since the last audit and directly addresses the old "no context/consequence" gap — each entry now has a distinct second passage explaining the cultural/practical reasoning (e.g., the Japan noodle-slurping entry explains the sound aerates the broth "similar to how a sommelier slurps wine," a genuinely citable, self-contained factoid). Combined main-answer + why-it-matters passage runs ~209-216 words on sampled pages — long enough that it naturally splits into two independently-extractable, self-contained chunks (the rule, and the reason), which suits chunk-based RAG/citation systems well.
- **Do/Don't-style lists now present on 4 of 6 sampled pages** (`<ul>` with 2+ `<li>` items, e.g. Japan noodles: "Don't force it if it feels unnatural..." / "It doesn't apply to pasta..."). This is new since baseline, which had **zero** `<ul>`/`<ol>` across all 3 sampled pages.
- Source attribution remains present and linked on every sampled page (e.g., TokyoTreat, Coto Academy), `rel="noopener noreferrer"`, still a genuine trust positive.

**Gaps still open:**
- **Coverage of the Do/Don't list is inconsistent** — 2 of 6 sampled pages (UK queueing, Guam fiesta hospitality) still ship as list-free prose. Recommend applying the list format to the remaining older entries for consistency.
- **No question-based H2/H3 headings.** "Why it matters" is a real improvement over pure boilerplate, but it is not phrased as a natural-language query ("Why do Japanese people slurp noodles loudly?"), which is the single highest-leverage remaining citability change — question-phrased headings let AI systems map a user query directly onto a heading + adjacent short-answer pair.
- **No dedicated FAQ block** (e.g., a closing 2-3 item Q&A list) — still absent.
- **Recommendation:** (1) Roll the Do/Don't list pattern out to the remaining entries that don't yet have one (Low-Medium effort, template already exists and works on 67% of sampled pages). (2) Rename or add a parallel question-phrased H2 (e.g., "Why does this custom exist?" or entry-specific phrasing) instead of/alongside the generic "Why it matters" label. Effort: Low (label/heading change + minor content-model tweak).

## 4. Structural Readability — Severity: Low-Medium (improved from Medium)
- Pages now have real structure: H1 (rule statement) → intro paragraph(s) → optional Do/Don't `<ul>` → H2 "Why it matters" → source citation line → breadcrumb-linked "More from {country}" / "More {category} rules" sections. This is a meaningful step up from baseline's single dense paragraph with no in-content subheadings.
- Breadcrumbs (`BreadcrumbList` schema + visible nav) present and correct on all sampled pages.
- Still no tables, no numbered steps, and still no explicit glossary/definition markup for foreign loanwords — though inline parenthetical glosses now appear more often (e.g., "zuru-zuru," "bella figura" get a same-sentence explanation), which is a soft mitigation of the prior gap even without formal `<dfn>`/bold-term treatment.
- **Recommendation:** Add lightweight bold+gloss formatting for the one key foreign term per entry (e.g., `**zuru-zuru**` in bold followed by the gloss, rather than plain parenthetical text) to strengthen entity disambiguation for AI parsers. Effort: Low-Medium.

## 5. Multi-Modal Content — Severity: High (still the weakest dimension, but a real asset now exists)
- Per-entry OG images now exist (`https://etiquetteness.com/og/{country}/{slug}.png`, 1200×630, referenced in `og:image`, `twitter:image`, and the `Article` JSON-LD `image` field) — this is new since baseline, which had **zero** images of any kind anywhere on the site.
- However, these images are **not surfaced as in-page content**: `<img>`, `<figure>`, `<video>`, and `<table>` element counts are all still **0** on every sampled article page. The OG image is a social-share/JSON-LD asset only — it is never rendered inline in the article body with descriptive alt text, so it does nothing for visual-citation surfaces like Google AI Overview image carousels or Perplexity's inline images.
- The sitemap declares an `xmlns:image` namespace but contains **zero `<image:image>` entries** across all 84 URLs — the OG images exist but are not exposed via the image sitemap either, so they're effectively invisible to image-aware crawlers unless discovered via JSON-LD/OG tags alone.
- **Recommendation:** (1) Add `<image:image>` entries to the sitemap pointing at the existing OG images (Low effort — data already exists, just needs sitemap-generation logic). (2) Consider embedding a small in-content illustration or the OG graphic itself inline in the article body with descriptive `alt` text ("{country} {custom} illustration") for genuine multi-modal citability, not just social-share metadata. Effort: Medium (design/sourcing work, though the OG generation pipeline in `scripts/generate-og-images.ts` could plausibly be adapted).

## 6. Authority & Brand Signals — Severity: Medium (improved from High)
- **About page now exists** (`/about/` → HTTP 200; was 404 at baseline). It states the site's editorial methodology in specific, trust-building terms: "Every rule here starts from a real source, cited and linked at the bottom of the entry," entries get "checked against someone who actually grew up with the custom," an explicit correction process ("If something here is wrong... that's worth fixing"), a public GitHub link, and a contact email. This is a genuinely strong E-E-A-T-adjacent addition and directly answers the single largest gap flagged in the prior audit.
- **Content is now openly and explicitly licensed**: GitHub repo confirmed public (`private: false` via API) with MIT (code, `/LICENSE`) + CC BY-NC 4.0 (content, `src/content/etiquette/LICENSE`) dual licensing, and the About page surfaces this in plain language. Explicit machine-checkable reuse terms are a positive trust/citability signal for AI systems evaluating whether content can be safely quoted with attribution.
- **`datePublished` now exists** on every sampled Article (`"datePublished":"2026-09-02T19:18:19+09:00"`) — an improvement over baseline, which had no `datePublished` field at all. **However, this timestamp is identical to the second across every single sampled page** (Japan, UK, France all return the exact same value), which strongly indicates a single batch/build-time stamp rather than genuine per-entry publish history. This is a smaller version of the same red flag from the prior audit (`dateModified` was "today" on every page) — it no longer reads as live-request-generated, but it still doesn't differentiate the age of any individual entry, so its freshness-signal value to AI ranking systems is limited.
- **`dateModified` and sitemap `<lastmod>` are still uniformly identical** across all 84 URLs (`2026-09-02T00:00:00.000Z`, unchanged pattern from baseline) — this specific gap is **not yet fixed**.
- **Still no `Organization` or `Person` schema anywhere on the site.** Homepage JSON-LD is still `WebSite`-only; Article schema still has no `publisher` field, no `author`, no `sameAs` links to GitHub/social profiles — despite the About page now containing exactly the information (mission, methodology, GitHub, contact) that would populate this schema. This is now the single largest remaining authority gap, and it's a low-effort fix given the content already exists in prose form on `/about/`.
- **Brand mention signals (Wikipedia/Reddit/YouTube/LinkedIn):** Still not independently verifiable — live web search (DuckDuckGo) returned a CAPTCHA wall and no DataForSEO MCP access was available this session. Given the site now has a real About page, public repo, and CC BY-NC licensing (all of which lower the barrier to third parties linking to or citing it), off-site presence is plausibly still near-zero but is more "buildable" now than at baseline, since there's finally a credible page to point third-party mentions at.
- **Recommendation (highest priority, now cheap to execute):**
  1. Add `Organization` schema (name, logo, url, `sameAs`: GitHub repo URL at minimum) site-wide, and reference it as `publisher` from every `Article` — the source content for this already exists on `/about/`. Effort: Low.
  2. Vary `dateModified`/sitemap `<lastmod>` per actual content history (e.g., derived from git commit dates per MDX file, which the repo already has) instead of a single build-time stamp. Effort: Low-Medium.
  3. Continue off-site presence building (a YouTube short or Reddit thread per top category remains the single largest external lever per the correlation data) — still outside on-page control, still the biggest lever available. Effort: High (ongoing).

## Top 5 Highest-Impact Changes (prioritized)

| # | Change | Impact | Effort |
|---|---|---|---|
| 1 | Add sitewide `Organization` schema (name, logo, `sameAs`: GitHub, url) + `publisher` on every `Article` — content already exists on `/about/`, just needs to be structured | High | Low |
| 2 | Add `/llms.txt` indexing the 6 categories, 14 countries, and 84 entries, mirroring the CC BY-NC 4.0 reuse terms already stated on `/about/` | Medium-High | Low |
| 3 | Vary `dateModified`/sitemap `<lastmod>` per real content history instead of one identical build-time stamp across all 84 URLs | Medium | Low-Medium |
| 4 | Roll out the Do/Don't `<ul>` pattern to the remaining ~1/3 of entries that don't yet have one, and rephrase/add a question-based H2 (currently generic "Why it matters") | Medium-High | Low-Medium |
| 5 | Add `<image:image>` entries to the sitemap for the existing per-entry OG images, and/or embed one inline illustrative image with descriptive alt text per entry | Medium | Low (sitemap) / Medium-High (inline images) |

## AI Crawler Access Status
| Crawler | robots.txt | Edge/WAF (live UA test) |
|---|---|---|
| GPTBot | Allowed | Confirmed 200 OK (prior audit; unchanged robots.txt/config this pass) |
| OAI-SearchBot | Allowed | Confirmed 200 OK (prior audit) |
| ClaudeBot | Allowed | Confirmed 200 OK (prior audit) |
| PerplexityBot | Allowed | Confirmed 200 OK (prior audit) |
| Google-Extended | Allowed | Confirmed 200 OK (prior audit) |
| CCBot | Allowed (not blocked) | Confirmed 200 OK (prior audit) |
| anthropic-ai / cohere-ai | Allowed (not blocked) | Not re-tested live this pass |

## llms.txt Status: **Still Missing (404)**, RSL 1.0: Not applicable (no llms.txt to carry it) — though a real MIT/CC BY-NC 4.0 license now exists in the public GitHub repo and is described in prose on `/about/`, it is not yet surfaced via the AI-native llms.txt/RSL convention.

## Technical Accessibility: SSR/Static (Astro v7.2.10, confirmed via `generator` meta tag) — unchanged strength. Content fully present in raw pre-JS HTML for all pages checked (title, meta description, full article body incl. "Why it matters" section, JSON-LD). No `astro-island`/`client:load` hydration markers found — no CSR gating. `cf-cache-status: HIT` confirms edge caching is working; CSP/security headers are present and don't impede crawling. Sitemap is valid XML with all 84 content URLs + 14 country pages + 6 category pages + About + Search discoverable. Score nudged up slightly from 75 to 78 given the About page is equally SSR and the sitemap now indexes more surface area cleanly.
