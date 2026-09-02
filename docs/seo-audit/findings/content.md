# Content Quality / E-E-A-T Audit — etiquetteness.com
Date: 2026-09-02
Method: curl fetch of raw HTML (server-rendered Astro site, no SPA shell — no Playwright needed) for homepage, 1 category page, 1 country page, 9 article pages, search page, plus probes for about/contact/legal pages and cross-page meta comparison. Pages sampled:
- https://etiquetteness.com/
- https://etiquetteness.com/category/dining/ (+ business/social/travel/gifts checked for meta only)
- https://etiquetteness.com/country/japan/ (+ france/germany/thailand checked for meta only)
- https://etiquetteness.com/etiquette/china/business-cards-both-hands/
- https://etiquetteness.com/etiquette/china/dining-dont-flip-the-fish/
- https://etiquetteness.com/etiquette/france/dining-bread-on-table/
- https://etiquetteness.com/etiquette/germany/business-punctuality-exact/
- https://etiquetteness.com/etiquette/global/airplane-no-smoking/
- https://etiquetteness.com/etiquette/india/dining-right-hand-only/
- https://etiquetteness.com/etiquette/italy/dining-no-cappuccino-after-11am/
- https://etiquetteness.com/etiquette/japan/social-shoes-off-indoors/
- https://etiquetteness.com/etiquette/korea/dining-rice-left-of-soup/
- https://etiquetteness.com/etiquette/united-kingdom/social-always-queue/
- https://etiquetteness.com/search/

Site structure: 37 total content items across 6 categories × ~11 countries, generated from a small structured dataset (each entry = country + category + one etiquette rule). This is a **programmatically-patterned content type** (fixed template: dek + 2-paragraph body + one source link + tag). Per the skill's cross-delegation note, this should also be reviewed under `seo-programmatic` for indexation/scale-specific checks (thin-page ratio, pagination, canonical strategy at scale) — this report covers the content-quality/E-E-A-T angle only.

---

## Content Quality Score: 34 / 100

Driven down primarily by near-total absence of trust infrastructure (no About/Contact/author/methodology pages) and article bodies averaging 50–70 words against effectively no stated minimum for the format, combined with fabricated-looking freshness signals.

## E-E-A-T Breakdown

| Factor | Weight | Score | Notes |
|---|---|---|---|
| Experience | 20% | 15/100 | Zero first-hand signals. No "I traveled to X," no photos, no personal anecdotes. Every fact is second-hand, attributed to a single external article per page. |
| Expertise | 25% | 20/100 | No author byline anywhere (homepage, articles, footer). No credentials, no editorial team, no bios. Facts are accurate-reading but their expertise is entirely borrowed from the cited source, not demonstrated by the site. |
| Authoritativeness | 25% | 25/100 | Each article cites exactly one external source (Food Republic, Commisceo Global, businessculture.org, japan-guide.com, etc.) — reasonable practice, but single-sourcing per fact with no cross-verification, no site-level recognition, backlinks, or press signals found. |
| Trustworthiness | 30% | 15/100 | **No About page, no Contact page, no Privacy Policy, no Terms (all return 404)**. No author, no editorial policy, no corrections policy, no HTTPS-adjacent trust signals beyond the cert itself. `dateModified` in schema is set to the current date on every single page (see Freshness below), which reads as fabricated/rolling freshness rather than a genuine update signal. |

**Weighted E-E-A-T score: ~19/100**

---

## Findings

### CRITICAL

1. **No About, Contact, Privacy Policy, or Terms pages exist.** Verified via direct requests: `/about/`, `/contact/`, `/privacy/`, `/privacy-policy/`, `/terms/`, `/author/`, `/authors/`, `/team/`, `/methodology/`, `/editorial-policy/` all return HTTP 404. None appear in `sitemap-0.xml` (57 URLs total, all either the homepage, 6 category pages, 11 country pages, 37 article pages, or `/search/`). This is the single largest E-E-A-T/QRG gap on the site — Trustworthiness is the highest-weighted factor (30%) and this site currently has none of its baseline signals (who runs it, how to contact them, what the data-verification process is).

2. **No author attribution anywhere.** No byline, no "written by," no editorial team page, on the homepage, category pages, country pages, or any of the 9 sampled articles. Combined with #1, a reader (and a quality rater) has no way to assess who is asserting these cultural/etiquette claims or what qualifies them to do so — this is a textbook YMYL-adjacent trust gap (etiquette missteps can carry real social/business consequences for readers acting on this advice).

3. **Article body copy is extremely thin: 50–72 words per page**, measured across 9 sampled articles (range: 50, 51, 52, 56, 56, 60, 66, 70, 72 words in the `<article>` content, excluding nav/header/footer/related-links chrome). This is a dek (1 sentence) + 2 short paragraphs + 1 source citation line. There is no topical coverage beyond the single fact stated — no context on regional variation, no discussion of exceptions, no related customs, no "why this custom exists," no historical/cultural background. Category and country pages have **effectively zero unique body copy** (e.g., `/category/dining/` = "Dining. 10 rules." plus a list of links; `/country/japan/` = "japan. 3 rules." plus a list of links) — these read as pure listing/doorway pages with no original written content of their own.

### HIGH

4. **`dateModified` in the Article JSON-LD is identical to the crawl date on every sampled article** (`"dateModified":"2026-09-02T00:00:00.000Z"` on all 9 articles checked, matching today's date at fetch time). This strongly suggests `dateModified` is set to the build timestamp rather than a genuine last-substantive-edit date. There is no `datePublished` field at all in the schema. Per Sept 2025 QRG guidance on freshness manipulation, an ever-rolling "last updated" date with no real edit behind it is a signal quality raters and algorithmic freshness systems are specifically designed to discount or penalize — it currently looks indistinguishable from date-stamp gaming even if unintentional (likely just a side effect of the static-site build process).

5. **Meta descriptions are identical across all category and country pages**: every one of `/category/business/`, `/category/social/`, `/category/travel/`, `/category/gifts/`, `/category/dining/`, `/country/france/`, `/country/germany/`, `/country/thailand/`, `/country/japan/` (9/9 checked) returns the exact same `<meta name="description">`: *"Unwritten etiquette rules from around the world."* Titles are differentiated (e.g. "Dining etiquette · Etiquetteness"), but descriptions are not. This is a duplicate-metadata pattern search engines flag at the template level and wastes a ranking/CTR opportunity across 17+ index-type pages.

6. **Single-source citation per fact, no cross-verification shown.** Every article links to exactly one third-party source (a mix of decent authorities like japan-guide.com and lower-authority sites like generic "businessculture.org" or blog-style sources). There's no indication of independent verification, multiple sources, or original research — this is consistent with a content model of "summarize one article per fact" rather than genuine subject-matter expertise, which is the core AI-content-quality risk flagged in the Sept 2025 QRG (no original insight beyond the cited source).

### MEDIUM

7. **Homogeneous template structure across all 37 article pages** — dek, two short paragraphs, tag pills (country/category/severity), one source line, "More from [country]" block. This is efficient for a small reference site but offers no differentiation signal to raters distinguishing genuine editorial content from mechanically assembled fact-cards. Combined with the missing trust/author signals, this reads more like a structured database with an editorial skin than an edited publication.

8. **No internal contextual linking within body copy** — the only links in an article body are the outbound source citation and the templated "More from [country]" footer block (2 related links, same country only). There's no linking to related categories (e.g., a China dining article never links to China business or China social articles), which limits topical depth signals and keeps each page an isolated fact rather than part of a demonstrable topical cluster.

9. **"Severity" tag (`strict` / `casual`) has no defined criteria shown anywhere on the site.** It appears as a pill on each article (e.g., "strict" on the China fish article, "casual" on the France bread article) but there's no legend, glossary, or methodology page explaining what determines strict vs. casual, or who made that judgment call. This is a clear candidate for a `/methodology/` page that would also help close the Trustworthiness/Expertise gap.

10. **No comments, no user feedback mechanism, no "was this helpful" or correction-reporting path** — reduces both trust signals and a potential source of first-hand experience content (e.g., traveler comments confirming/adding nuance to a rule).

### LOW

11. **`og:type` is `article`**, correctly set on article pages, and canonical tags, Open Graph, Twitter Card, and `BreadcrumbList`/`Article` JSON-LD are present and well-formed on article pages — this is good baseline technical SEO hygiene and AI-citation readiness (see below), so worth preserving as-is.

12. Titles use a consistent `Page Title · Etiquetteness` pattern with unique, descriptive H1s that closely match the primary claim of each page (e.g., "Don't flip the whole fish over") — good for both search snippets and LLM citation extraction, no over-optimization or stuffing observed.

## Word count vs. QRG minimums

| Page type | Sampled avg | QRG floor | Status |
|---|---|---|---|
| Article/fact page (closest analog: blog post) | ~60 words body | 1,500 (blog post) / N/A defined for "fact card" format | Far below any comparable content-type floor. Even treated as a lightweight reference format rather than a blog post, ~60 words leaves no room for the topical depth (exceptions, regional variation, "why," related customs) that would justify separate indexation of each URL. |
| Category page | ~0 unique words (list only) | N/A (index page) | No unique editorial copy; pure doorway/index pattern. |
| Country page | ~0 unique words (list only) | 500–600 (location-page analog) | If treated as a location-style page, falls drastically short; currently zero original prose. |
| Homepage | ~400 words (incl. nav/entry list text) | 500 | Slightly under floor, but not the primary concern — the deeper issue is that visible homepage copy is a hero tagline + a full listing of all 37 entries, not descriptive editorial content. |

Per the skill's guidance, word count is not itself a ranking factor — the finding here is topical coverage, not word count in isolation: each fact page states one rule and stops, with no supporting context that would make the page defensible as a standalone, comprehensively useful unit.

## AI Citation Readiness Score: 58 / 100

**What works well:**
- Clean heading hierarchy: single H1 per article matching a clear, quotable, self-contained claim ("Don't flip the whole fish over," "Rice goes on your left and soup on your right").
- `Article` + `BreadcrumbList` JSON-LD structured data present on article pages, machine-readable and well-formed.
- Definitive, unhedged statements ("never," "always," "don't") — easy for an LLM to lift as a discrete fact.
- One-sentence dek under the H1 functions as a ready-made answer/snippet.
- Consistent, predictable URL and template pattern makes the corpus easy to crawl/parse at scale.

**What holds the score back:**
- No named author/source-of-authority for the site itself to cite alongside the fact (an LLM citing this page has "Etiquetteness says X" with no indication of who Etiquetteness is or why they're credible — items 1–2 above).
- No `datePublished`, and a `dateModified` that appears to always equal "today" (item 4) — undermines confidence in citing this as a "current" or "verified as of [date]" source.
- No supporting nuance/exceptions in body text that an LLM could use to give a fuller, hedged answer beyond the bare claim — everything is single-fact, single-sentence-justification depth.
- Single external citation per page, itself often a secondary/tertiary source rather than a primary authority — reduces the site's value as an aggregation/verification layer.

---

## Recommendations (priority order)

1. **Add an About page and a Contact page** (even minimal) stating who publishes the site, why, and how to reach them/report a correction. This is the highest-leverage, lowest-effort fix given Trustworthiness is the highest-weighted E-E-A-T factor and is currently at zero.
2. **Add a visible author/editorial-team byline** to articles, or at minimum a site-wide "About the research" / methodology page describing how facts are sourced and verified (also resolves the undefined "strict/casual" tag issue).
3. **Fix the freshness signal**: populate `datePublished` distinct from `dateModified`, and only update `dateModified` when content actually changes (not on every build). Consider surfacing a visible "Last verified: [date]" on the page itself, not just in JSON-LD.
4. **Deepen each article** with 150–300 additional words of genuine context per fact: regional variation, common exceptions, why the custom exists, what happens if you get it wrong, and a link to 1–2 related facts from the same country across other categories (not just the same-country same-page block). This directly improves both topical-coverage floor and AI-citation depth without needing to hit an arbitrary word count.
5. **Differentiate meta descriptions** for every category and country page — even a templated-but-parameterized description ("10 dining etiquette rules from around the world, one country at a time.") would resolve the duplicate-metadata issue across 17+ pages.
6. **Add a second corroborating source per fact where feasible**, or at least favor higher-authority primary sources over generic aggregator/blog sources, to strengthen Authoritativeness.
7. **Route this site through the `seo-programmatic` sub-skill** for a scale-specific pass — the country×category matrix structure, thin per-page word count, and doorway-style category/country pages are exactly the pattern that skill is built to evaluate (thin-page ratio, indexation strategy, internal linking at scale).
