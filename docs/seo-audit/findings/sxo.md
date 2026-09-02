# SXO Analysis: etiquetteness.com

**Scope note:** Live SERP/WebSearch analysis was not performed (data collection was halted mid-task by the audit coordinator). Page-type mismatch and user stories below are inferred from (a) the site's own content structure, observed directly via rendered HTML + parsed metadata, and (b) general domain knowledge of what ranks for etiquette/culture-guide queries. This is **not** a substitute for live PAA/featured-snippet/related-search data — treat the mismatch call as directional, not proven. See Limitations.

## Pages Analyzed
- Homepage: `https://etiquetteness.com/` (rendered via render_page.py, parsed via parse_html.py)
- Category hub: `/category/dining/` ("Dining etiquette")
- Article A: `/etiquette/japan/business-card-two-hands/` — "Exchange business cards with two hands"
- Article B: `/etiquette/united-kingdom/social-always-queue/` — "Always queue, never cut in"
- Article C: `/etiquette/france/dining-hands-on-table/` — "Keep your hands on the table"

## 1. Page-Type Finding (lead insight)

**Target page type: single-fact micro-content card.** Every sampled article is a ~130-140 word snippet built around exactly one rule (H1 = the rule itself, e.g. "Keep your hands on the table"), with no body sections beyond the one paragraph, followed by a "More from [country]" related-links block (the only H2 on the page). The category hub (`/category/dining/`) is even thinner: 95 words total, H1 + a list of links to the same one-fact articles, zero original body copy.

**Likely SERP expectation for this vertical:** Etiquette/culture queries (e.g. "Japan business card etiquette", "French table manners", "is it rude to cut in line UK") are typically won by comprehensive guide/listicle pages (800-1500+ words) that cover the *whole* topic — the specific rule plus the "why," related do's/don'ts, consequences of getting it wrong, and often photos/illustrations — published by culture-guide, expat, or etiquette-consultancy sites. A single 137-word fact card competes poorly against that format for anything but a hyper-narrow, already-decided query.

**Verdict: HIGH-to-CRITICAL mismatch**, most severe at the category/topic level (the "Dining" hub has no aggregating guide content at all — just links) and least severe (but still present) at the single-rule level, where the page lacks the depth, sourcing, and visuals a reader would want before trusting the tip in a real cross-cultural interaction.

## 2. User Story Fit

Derived from on-page structural patterns (not live PAA — see Limitations):

- As someone about to leave for a business trip to Japan, I want the complete picture of business-card etiquette (when to bow, how to store the card, what happens if I mess up), because getting it wrong in front of a client is embarrassing — but I'm blocked by the page only telling me "use two hands," with no context on the ritual around it.
- As a UK newcomer confused about queueing norms, I want quick reassurance that my instinct (wait my turn) is correct, because I don't want to look rude — the page's short, direct format actually **fits** this narrow need well.
- As someone planning a full trip to France, I want one page covering French dining manners end-to-end, because I don't want to open 8 tabs — but the site forces exactly that: each rule (hands on table, bread on cloth, no cappuccino after 11am) is its own separate page with no single "France dining guide" synthesis.
- As a skeptical reader, I want to know this advice is accurate (source, local expert, or at least a rationale), because etiquette mistakes carry social risk — but no page has an author byline, credentials, or cited source.
- As a mobile searcher who lands via a "How to greet in France" snippet, I want a visual (an image or short clip of "la bise") to confirm I'm doing it right, because text alone is ambiguous for a physical gesture — but there are zero images across every sampled page.

## 3. Gap Analysis — SXO Gap Score: 31/100

(Separate from any SEO Health Score. Lower = larger gap vs. likely SERP expectations.)

| Dimension | Score | Evidence |
|---|---|---|
| Page Type | 5/15 | Micro-fact card vs. likely comprehensive-guide/listicle expectation; category hub has no synthesized guide content |
| Content Depth | 3/15 | 127-141 words per article, one H1 + one paragraph, no supporting sections; category page is 95 words |
| UX Signals | 7/15 | Clean breadcrumb + related-links nav is a genuine plus; but no "quick-answer" callout box, no CTA, no save/share affordance |
| Schema Markup | 8/15 | Article + BreadcrumbList present on articles (good); no FAQPage/HowTo/ItemList schema despite content being naturally Q&A/how-to shaped; homepage/category use only bare WebSite schema with no ItemList for the card grid |
| Media Richness | 1/15 | Zero images found on every sampled page (`images: []` in every parse), despite topics being inherently visual/gestural (bowing, cheek-kiss, chopstick placement, hand position) |
| Authority Signals | 3/15 | No author byline, no credentials, no cited source or "how we verified this" note on any sampled page |
| Freshness | 4/10 | `dateModified` is present in schema but not shown to the user on-page, and it reads as the current date on every article sampled (2026-09-02) — worth verifying this isn't an auto-generated build timestamp masquerading as a real content update, which would be a trust risk if noticed |

## 4. Persona Scores (25 pts each: Relevance / Clarity / Trust / Action)

**Persona 1 — "Quick Rule-Checker"** (about to do the thing right now, wants a yes/no)
- Relevance 22, Clarity 22, Trust 10, Action 8 → **62/100**
- This is the one persona the current format genuinely serves well. Improvement: add a one-line "why this matters" and a tiny visual to lift Trust.

**Persona 2 — "Trip-Prep Browser"** (wants the full country/topic picture before traveling)
- Relevance 8, Clarity 12, Trust 10, Action 6 → **36/100**
- Biggest gap. Needs a real synthesized guide page per country/category (the category hub is the natural place) rather than a bare link list.

**Persona 3 — "Business Traveler Needing to Justify Advice"** (wants to cite the source to a colleague/boss)
- Relevance 15, Clarity 15, Trust 5, Action 5 → **40/100**
- No author, no citation, no "verified by" signal anywhere in the sample.

**Persona 4 — "Cross-Culture Comparer"** (e.g., gift-giving China vs. Japan)
- Relevance 6, Clarity 10, Trust 10, Action 5 → **31/100**
- Content is siloed strictly by single country/category; no comparison or cross-linking content type exists in the sample.

**Persona 5 — "Snippet/Voice Searcher"** (lands via a featured-snippet-style question)
- Relevance 15, Clarity 15, Trust 8, Action 5 → **43/100**
- Short factual format is snippet-friendly in theory, but the absence of FAQPage/HowTo schema means the site isn't structurally asking Google to feature it that way.

**Priority order (weakest first):** Cross-Culture Comparer (31) → Trip-Prep Browser (36) → Business Traveler (40) → Snippet Searcher (43) → Quick Rule-Checker (62).

## 5. Priority Actions
1. Fix the CRITICAL page-type gap first: build real guide-depth content at the category/country hub level (e.g., "France Dining Etiquette: The Complete Guide") that synthesizes the existing one-liners into a single authoritative page, before optimizing the micro-cards further.
2. Add author/credential and sourcing signals to every article — cheapest, highest-leverage Trust fix across all 5 personas.
3. Add at least one image or illustration per article for physically-demonstrated rules (greetings, hand placement, gift wrapping).
4. Add FAQPage or HowTo schema to article pages and ItemList schema to category/homepage grids to make the existing short-answer format work *for* the site in SERP features rather than against it.
5. Verify whether `dateModified` is a genuine edit timestamp or an auto-generated build date; if the latter, either wire it to real content changes or remove it from schema to avoid a false-freshness signal.

## 6. Cross-Skill Recommendations
- Thin content / depth gap → `/seo content` and `/seo page` for a deeper E-E-A-T and page-level audit.
- Missing FAQPage/HowTo/ItemList schema → `/seo schema` for generation.
- Zero images on culturally visual topics → `/seo images`.

## 7. Limitations
- **No live SERP data.** WebSearch/SERP pull was not executed (task was halted before this step by the coordinator); the page-type mismatch, "SERP consensus," and user stories are inferred from domain knowledge of the etiquette/culture-guide vertical and from the site's own structure, not from actual PAA questions, featured snippets, related searches, or AI Overview sourcing for real keywords. This should be validated with a live SERP pull before treating the CRITICAL/HIGH rating as final.
- **Small sample.** 3 of an estimated ~37 article pages were analyzed, plus 1 of 6 category hubs and the homepage. Coverage across all 10 countries and 6 categories was not verified — thinness/mismatch is assumed to generalize based on identical template structure (all sampled articles share the exact same word count range, schema shape, and section layout).
- **No screenshot/visual rendering** was captured, so above-the-fold layout, mobile responsiveness, and actual visual hierarchy were not directly assessed — findings on UX are based on parsed HTML/DOM order only.
- **No authority/backlink data** (domain authority, external citations, social proof) was pulled.
- **Freshness signal is schema-only**; whether `dateModified` reflects true edit history could not be verified without access to a CMS/git history for content.

---
Generate a PDF report? Use `/seo google report`.
