# SXO Analysis: etiquetteness.com

**Rerun of 2026-09-02 baseline.** This pass, unlike the prior one, completed live WebSearch/SERP analysis for real target queries, live-fetched the production site (source review + `curl`-fetched rendered HTML), and reviewed the Astro source for the four changes since baseline: mobile nav, scrollable filter pills, content expansion (58 → 84+ entries, every country 5+), and per-entry OG images.

## 0. Critical Context (read before the score)

**Google has not indexed the site yet.** `site:etiquetteness.com` returns zero results, and a search for the bare domain name (`etiquetteness.com`) surfaces no trace of the site — only unrelated dictionary/etiquette-adjacent domains. This means the page-type/format findings below describe how the site *would* compete once indexed, not its current live ranking (there isn't one to observe). This is the single biggest reason "the page fails to rank" today, and it sits outside the format/UX analysis this skill produces — flag it for `/seo technical` (indexing, sitemap submission, Search Console coverage) before or alongside acting on the SXO findings here.

## Pages Analyzed
- Homepage: `https://etiquetteness.com/` (source: `src/pages/index.astro`)
- Country hub: `/country/japan/` (source: `src/pages/country/[country].astro`) — now 12 entries, was likely 3-4 at baseline
- Category hub: `/category/dining/` (source: `src/pages/category/[category].astro`)
- Article A: `/etiquette/japan/dining-slurping-noodles/` — live-fetched via `curl` + WebFetch, "Slurping noodles is polite, not rude"
- Article B: `/etiquette/japan/business-card-two-hands/` (source MDX)
- Article template: `src/pages/etiquette/[...slug].astro`
- Nav/shell: `src/layouts/Layout.astro`, `src/components/CountryPills.astro`, `CategoryPills.astro`, `EntryCard.astro`

## 1. Page-Type Finding (lead insight) — mismatch narrowed but not closed

**Target page type at the article level has genuinely moved up-format.** Live-fetched `/etiquette/japan/dining-slurping-noodles/`: H1 (the rule, stated as a fact) → summary line → intro paragraph → scope-clarification paragraph → 2 bulleted do/don't tips → a dedicated **"Why it matters"** H2 section (new/expanded since baseline — pulled from the MDX `context:` field) → a **sourced citation** with outbound link (e.g., TokyoTreat, Coto Academy) → "More from Japan" (3 related links) → "More Dining rules" (3 related links). Total ≈280-320 words including all sections, vs. ~137 at baseline. This is still a single-fact page, but it now has the shape of a mini-guide (context + do/don't + source) rather than a bare fact card.

**SERP-backwards check, two query tiers:**

- **Narrow "is it rude to X in Y" queries** (e.g., "is it rude to slurp noodles in japan") — SERP is won by blog posts, Q&A (Quora), and short feature articles (Japan Today, Food Republic, Kokoro Cares, Time Out, even an NPR audio piece), most of which are comparably short and single-topic. **The upgraded article format is now a reasonably close match** for this query tier — the "Why it matters" + source-citation additions actually mirror what these competing blog posts do (explain the cultural reason, not just state the rule).
- **Broader "[country] [category] etiquette" queries** (e.g., "japan dining etiquette", "france table manners etiquette") — SERP is dominated by comprehensive, single-page guides that synthesize 6-10+ rules in one scroll: Wikipedia, Japan National Tourism Organization, JAL, byfood's "101" guide, Maikoya, and equivalent French-etiquette blog guides covering hands-on-table, utensil handling, bread, finishing your plate, phone-at-table, etc. all on one URL. **This is where the mismatch still lives.** Etiquetteness's closest equivalent is the country/category hub (e.g. `/country/japan/`), which now has a real synthesized 2-3 sentence intro (`COUNTRY_META[country].description` — genuinely improved from a bare title+list at baseline) but then reverts to a directory: a scrollable list of links to the single-fact pages, not an inline aggregated answer. A searcher for "japan dining etiquette" would need to click into 3-4 separate fact pages to reconstruct what a single competing guide delivers in one scroll.
- **Medium-tier "[specific ritual] etiquette in [country]" queries** (e.g., "korea business card etiquette") — SERP guides (Medium, TEUIDA, linguasia) are structured almost identically to the *upgraded* etiquetteness article template: Presenting → Receiving → Don'ts → one extra dimension (card design/language). This is a strong structural match already.

**Verdict: HIGH mismatch at the hub/broad-query level (was HIGH-to-CRITICAL at baseline), ALIGNED-to-MEDIUM at the narrow single-fact query level (improved from HIGH).** The fix that would close the remaining gap is not a new page type, it's turning the hub pages from link directories into on-page synthesized guides (see Priority Actions).

## 2. Findability / Navigation Check (new since baseline — mobile nav, filter pills)

- **Mobile nav confirmed live**: `mobile-menu-toggle` button present in rendered HTML, toggles a `#mobile-menu` panel with the same category links as desktop, `aria-expanded`/`aria-controls` wired correctly, 44px+ touch targets (`min-h-12` rows). This closes a real prior gap — mobile users (majority of etiquette-lookup searches, per query intent) can now reach every category from the header without a horizontal desktop nav.
- **Scrollable filter pills confirmed live**: `country-pill` classes present in rendered HTML on the country hub; `CountryPills.astro`/`CategoryPills.astro` render a horizontally-scrollable, `snap-x` pill row with per-country/category entry counts, and on the homepage they're wired to a client-side combined category+country filter (`data-filter`) that updates the URL query string and result count without a page reload. This is a genuine cross-linking improvement: a user reading Japan's noodle-slurping rule can filter to "Japan" or "Dining" and see the full adjacent set in one interaction, addressing part of the "Cross-Culture Comparer" and "Trip-Prep Browser" gap from baseline — but only *within* the site's own filter UI, not inline on the article page itself (see below).
- **Gap that remains**: the filter pills live on the homepage and hub pages, not on the individual article page. A user who lands directly on `/etiquette/japan/dining-slurping-noodles/` from Google (the far more common entry point than the homepage) sees only "More from Japan" (3 links) and "More Dining rules" (3 links) — a fixed sample, not the filterable/browsable set. For a country with 12 entries (Japan) or 11 (Korea), 3 related links under-represents what's actually available.

## 3. Single-Fact-Per-Page Format: Does It Serve or Fragment Intent?

This is the core structural question and the answer is now **it depends on query intent, and the site does not yet differentiate**:

- **Serves intent well** for the "Quick Rule-Checker" persona (a specific yes/no question about one action) and for narrow long-tail queries — confirmed by the SERP for "is it rude to slurp noodles in japan," where similarly narrow, similarly short content ranks.
- **Fragments intent** for "Trip-Prep Browser" / "Cross-Culture Comparer" personas and for broad head-term queries ("japan dining etiquette," "france table manners") — confirmed by those SERPs being dominated by single-page, multi-rule syntheses. A visitor arriving at one etiquetteness fact page for a trip-prep query has no on-page path to "give me all of Japan's dining rules in one read" — they'd need to notice and click the "More from Japan" links three separate times, and even then get country-wide (not category-filtered) results mixed in only via a second click to the hub.
- **Recommended middle ground** (see Priority Actions): keep the single-fact URLs (they're genuinely the right format for the narrow tier and are cheap to produce/maintain), but add a real synthesized "complete guide" layer at the country×category intersection (e.g., a `/country/japan/dining/` page that both lists AND narratively synthesizes the 4-5 dining rules into one scroll) to compete for the broad tier without abandoning the fact-card model.

## 4. User Story Fit

Derived from the live SERP signal clusters above (not assumption):

- As someone about to eat ramen in Japan for the first time, I want a quick confirmation that slurping is fine, because I don't want to look awkward doing it wrong in either direction (too quiet vs. too loud) — the page's direct H1 answer + "Why it matters" cultural explanation genuinely satisfies this now. *(Source: narrow-query SERP is blog/Q&A-dominated and short, matching the upgraded article format.)*
- As a business traveler prepping for a Korea trip, I want the complete business-card ritual (presenting, receiving, the don'ts, and how card design/language plays in), because I have one shot to make a good first impression — the upgraded article (context + bullets + source) covers most of this, but the "card design/language" dimension that competing guides include (transliterating your name into Hangeul) isn't present on etiquetteness's Korea business-card entry. *(Source: Korea business-card-etiquette SERP structure — Medium/TEUIDA/linguasia all include a "card design" section etiquetteness's equivalent Japan entry doesn't have an analog for.)*
- As someone planning a full Japan trip, I want one page covering Japanese dining etiquette end-to-end (greetings, slurping, chopsticks, seating hierarchy, payment), because I don't want to open 6 tabs — the `/country/japan/` hub gets partway there with a real synthesized intro paragraph (new since baseline) but still hands off to a bare list of 12 individual links rather than synthesizing them, unlike the Wikipedia/JNTO/JAL guides that rank for this exact query. *(Source: "japan dining etiquette" SERP — every result is one page covering 5+ sub-rules.)*
- As a mobile searcher who lands via a slurping-noodles snippet, I want a visual (a short clip or photo of someone eating ramen) to confirm the sound/behavior I'm aiming for, because "slurp" is ambiguous in text alone — the page still has zero in-body images (the new OG images exist only as social-share meta tags, not embedded content — confirmed via `curl`: 0 `<img>` tags in the rendered article body). *(Source: same gap as baseline; unchanged.)*
- As a skeptical reader deciding whether to trust the advice before repeating it to a colleague, I want a citation or expert source, because etiquette mistakes carry social risk — this is now **addressed**: every sampled article has a named, linked source (TokyoTreat, Coto Academy) in a dedicated footer block. This closes a baseline Trust gap. *(Source: baseline flagged zero sourcing; both sampled live articles now cite one.)*

## 5. Gap Analysis — SXO Gap Score: 46/100 (was 31/100 at baseline)

(Separate from any SEO Health Score. Lower = larger gap vs. likely SERP expectations.)

| Dimension | Score | Change | Evidence |
|---|---|---|---|
| Page Type | 8/15 | +3 | Article format now closer to narrow-query winners (context + source + bullets); hub pages still directories, not synthesized guides, for broad-query competition |
| Content Depth | 7/15 | +4 | ~280-320 words/article incl. context+source (up from ~137), but still short of the 800+ word multi-facet guides winning broad head terms; hub intro copy is now real (2-3 sentences) but not aggregated content |
| UX Signals | 11/15 | +4 | Mobile nav and scrollable filter pills confirmed live and functional; homepage has working client-side combined filter; gap: filters/browse-all not surfaced on the article page itself |
| Schema Markup | 8/15 | 0 | Unchanged — Article + BreadcrumbList still present on articles; country/category hub pages still ship **zero** JSON-LD (confirmed via source: no `@type` in either `[country].astro` or `[category].astro`); no FAQPage/HowTo/ItemList anywhere |
| Media Richness | 2/15 | +1 | Still zero in-body `<img>` tags on every sampled article (confirmed via curl on live HTML). New per-entry OG images exist but only power social-share preview cards (`og:image` meta), not on-page content — does not move this score much since organic searchers landing from Google don't see them |
| Authority Signals | 10/15 | +7 | Real, named, linked sources now present on every sampled article (was 0 at baseline) — biggest single-dimension jump; still no author byline/credential entity |
| Freshness | 6/10 | +2 | `updatedAt: 2026-09-02` shown on-page ("Updated September 2, 2026") and in schema `dateModified` — visible to users now (baseline noted it was schema-only); still worth confirming this reflects genuine content edits vs. a bulk-set field across the recent expansion commits |

## 6. Persona Scores (25 pts each: Relevance / Clarity / Trust / Action)

**Persona 1 — "Quick Rule-Checker"** (about to do the thing right now, wants a yes/no)
- Relevance 23, Clarity 23, Trust 18, Action 8 → **72/100** (was 62)
- Trust jumped because of the new source citation. Remaining gap: Action — no explicit "see the full [country] guide" CTA near the answer, just the passive related-links block at the bottom.

**Persona 2 — "Trip-Prep Browser"** (wants the full country/topic picture before traveling)
- Relevance 14, Clarity 16, Trust 15, Action 10 → **55/100** (was 36)
- Biggest jump, driven by the real hub intro copy + filter pills + more entries per country (12 for Japan vs. an estimated 3-4 at baseline). Still capped by the hub being a directory rather than a synthesized read.

**Persona 3 — "Business Traveler Needing to Justify Advice"** (wants to cite the source to a colleague/boss)
- Relevance 17, Clarity 16, Trust 18, Action 8 → **59/100** (was 40)
- Second-biggest jump — the named/linked source per article is exactly what this persona needed. Still no author/credential entity at the site level (e.g., an "About our sourcing" page beyond the generic About page).

**Persona 4 — "Cross-Culture Comparer"** (e.g., gift-giving China vs. Japan)
- Relevance 10, Clarity 14, Trust 15, Action 8 → **47/100** (was 31)
- Filter pills make cross-country/category comparison meaningfully easier than a hard site silo, but there's still no dedicated comparison content type (no "China vs. Japan gift-giving" page), and pills aren't present on the article page where this persona is most likely to realize they want to compare.

**Persona 5 — "Snippet/Voice Searcher"** (lands via a featured-snippet-style question)
- Relevance 16, Clarity 17, Trust 12, Action 6 → **51/100** (was 43)
- H1-as-direct-answer format is genuinely snippet-friendly, and the site is indexable/well-marked-up at the article level. Still capped by the absent FAQPage/HowTo schema (same gap as baseline) and — more fundamentally — by the site not being indexed yet at all (Section 0), so this persona cannot currently reach the site via Google regardless of on-page fit.

**Priority order (weakest first):** Cross-Culture Comparer (47) → Snippet Searcher (51) → Trip-Prep Browser (55) → Business Traveler (59) → Quick Rule-Checker (72).

## 7. Priority Actions
1. **Resolve indexing first** (Section 0) — `site:etiquetteness.com` returns nothing. Confirm sitemap submission and Search Console coverage before further SXO iteration; no format fix here matters if Google hasn't crawled the site. Route to `/seo technical`.
2. Close the remaining broad-query mismatch: add inline synthesized content to the hub layer — either narrative paragraphs woven between the entry list on `/country/[country].astro`/`/category/[category].astro`, or a new `/country/[country]/[category]/` intersection page that reads as one guide (e.g., "Japan Dining Etiquette: All 4 Rules in One Read") rather than a link list. This directly targets the weakest personas (Cross-Culture Comparer, Trip-Prep Browser).
3. Surface `CategoryPills`/`CountryPills` (or a lighter "browse [Country]" / "browse [Category]" link pair) directly on the article page, not just on hub pages — currently a user who lands on one fact page only sees 3+3 related links, undercounting a country with 12 entries.
4. Add ItemList schema to the country/category hub pages (currently zero JSON-LD there) and FAQPage/HowTo schema to article pages — still the same schema gap flagged at baseline, unaddressed by the four recent changes. Route to `/seo schema`.
5. Add at least one real image or illustration per article for physically-demonstrated rules (bowing, the wai, cheek-kiss, chopstick placement) — the new OG images prove image-generation infrastructure already exists (`scripts/generate-og-images.ts`) but isn't being reused for in-body media. This is now the single largest remaining score gap (Media Richness, 2/15).

## 8. Cross-Skill Recommendations
- Site not indexed (`site:` returns zero results) → `/seo technical` for crawlability/sitemap/Search Console check — this is the actual blocker for "why the page fails to rank" right now.
- Hub-page synthesis gap / thin aggregation → `/seo content` and `/seo page` for guidance on writing the country×category guide layer.
- Missing ItemList/FAQPage/HowTo schema on hub and article pages → `/seo schema` for generation.
- Zero in-body images on culturally visual topics → `/seo images`; existing OG-image pipeline (`scripts/generate-og-images.ts`) could plausibly be adapted/reused rather than built from scratch.

## 9. Limitations
- **SERP sample size.** 4 live WebSearch queries were run (2 narrow "is it rude to X" style, 2 broad "[country] [category] etiquette" style, plus 2 indexing checks) — not the full 10-query SERP sweep the skill workflow calls for. Findings on format expectations are directionally solid (clear, consistent pattern across both query tiers) but a larger query sample would sharpen the exact word-count/schema targets.
- **No `render_page.py`/`parse_html.py` scripts found** in the `seo-sxo` skill directory (`/Users/wonsukchoi/.claude/skills/seo-sxo/` contains only `SKILL.md` and `references/`, no `scripts/`). Live page verification was done instead via direct `curl` (raw HTML, checked for `mobile-menu-toggle`, `country-pill`, `<img>` count, OG image path, JSON-LD count) and WebFetch (rendered structure/word-count estimate), plus direct review of the Astro source templates for ground truth on what's actually shipped. This is a reasonable substitute for a static site but wasn't confirmed against a full Playwright-rendered DOM.
- **Site is not indexed by Google.** `site:etiquetteness.com` and a bare-domain search both return zero relevant results — meaning there is no current live ranking position, PAA box, or featured-snippet behavior to observe *for etiquetteness.com itself*. All SERP-consensus findings are about what competitors currently rank for and what etiquetteness would need to match, not a before/after of etiquetteness's own SERP presence.
- **No screenshot/visual rendering** was captured; above-the-fold layout and mobile responsiveness were assessed from the Tailwind class names and structural HTML/DOM order (e.g., `min-h-11`/`min-h-12` touch targets, `flex`/`grid` breakpoints), not from an actual rendered screenshot.
- **No authority/backlink data** (domain authority, external citations, social proof, Search Console impressions) was pulled — the site being unindexed makes most of this moot for now anyway.
- **Small article sample.** 2 of 84+ article pages were directly analyzed (both Japan). Word-count and structure improvements were verified on these two and cross-checked against the shared Astro template (`[...slug].astro`), which all articles share, so the *structural* findings (context section, source citation, related-links pattern) generalize reliably; per-country content quality/depth was not spot-checked beyond Japan.

---
Generate a PDF report? Use `/seo google report`.
