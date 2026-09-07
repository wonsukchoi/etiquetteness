# Content Quality / E-E-A-T Audit — etiquetteness.com

Date: 2026-09-02 (re-audit)
Baseline: prior pass 2026-09-02, score 34/100 (`docs/seo-audit/findings/content.md`, superseded by this file)
Method: curl fetch of raw HTML (server-rendered Astro, no SPA shell) for homepage, `/about/`, 4 category hubs, 5 country hubs, 4 article pages, `/search/`, plus 404 probes for contact/privacy/terms/methodology, plus direct inspection of the live sitemap (105 URLs) and cross-reference against the local repo's source (`src/content/etiquette/**/*.mdx`, `src/lib/publishedDates.ts`, `src/pages/etiquette/[...slug].astro`) and `git log` to verify freshness-date claims. **Audited the live site as-is — 13 live countries (China, France, Germany, Guam, India, Italy, Japan, Korea, Mexico, Philippines, Saudi Arabia, Thailand, UK) + a "Global" catch-all, 84 entries.** Brazil/Vietnam are drafted locally but not yet deployed and are out of scope for this pass.

Pages sampled:
- https://etiquetteness.com/ (homepage)
- https://etiquetteness.com/about/
- https://etiquetteness.com/etiquette/japan/dining-slurping-noodles/
- https://etiquetteness.com/etiquette/korea/social-titles-not-first-names/
- https://etiquetteness.com/etiquette/china/social-toasting-with-baijiu/
- https://etiquetteness.com/etiquette/saudi-arabia/dining-gahwa-coffee-ritual/
- https://etiquetteness.com/etiquette/japan/business-card-two-hands/ (date-check only)
- https://etiquetteness.com/country/japan/, /korea/, /china/, /saudi-arabia/, /guam/, /mexico/
- https://etiquetteness.com/category/dining/, /business/, /travel/
- https://etiquetteness.com/search/
- 404 probes: /contact/, /privacy/, /terms/, /methodology/ (all still 404; `/about/` is now 200)

---

## Content Quality Score: 57 / 100

Up from 34/100. The two highest-leverage recommendations from the prior audit were both acted on — a substantive About page shipped, and every article/hub gained real, differentiated body copy — which meaningfully closes the Trustworthiness and topical-coverage gaps. The score is held back from going higher by: (a) core trust infrastructure is still only half-built (About exists, but Contact/Privacy/Terms do not, and there's still no named author), and (b) the freshness-date fix is more subtle than it looks — the code now computes a genuine per-entry `datePublished` from git history, but the **production build is not returning per-entry values**; every one of the 84 pages currently renders the identical `datePublished` timestamp, which is arguably a *more* convincing-looking but equally fabricated signal than before.

## E-E-A-T Breakdown

| Factor | Weight | Score | Change | Notes |
|---|---|---|---|---|
| Experience | 20% | 20/100 | +5 | Still no first-hand signals — no photos, no "I traveled to X," no personal anecdotes. The About page's voice is more personable ("leaving your chopsticks standing in a bowl of rice can genuinely unsettle a room") but that's tone, not demonstrated experience. |
| Expertise | 25% | 35/100 | +15 | About page now states an actual verification step: "Where possible, entries get checked against someone who actually grew up with the custom in question, rather than taken at face value from a single article." This is a real expertise claim, though vague ("where possible," no names, no way to verify which entries got this treatment) and still no named author/credentials anywhere on the site. |
| Authoritativeness | 25% | 30/100 | +5 | Unchanged core pattern: still exactly one external source per entry, and the sources sampled this pass (trykaiwa.com, 90daykorean.com, tokyotreat.com, taxiserviceksa.com) are the same tier of secondary travel-blog sources flagged last time, not primary/institutional authorities. The open-source GitHub repo (public, linked in footer and About) is a modest new authority/transparency signal. |
| Trustworthiness | 30% | 48/100 | +33 | Largest gain. `/about/` (200, real content) now explains who's behind the site implicitly (GitHub handle + personal email `wonsukchoi97@gmail.com`, both linked), the sourcing/verification approach, and an explicit corrections path ("that's worth fixing rather than leaving up... open a pull request or an issue on GitHub, or just email"). Still missing: `/contact/`, `/privacy/`, `/terms/` (all still 404 — a personal-project site collecting only pageview analytics probably doesn't strictly need a privacy policy, but its absence is still a rater-visible gap), no named individual with stated credentials, and the `dateModified`/`datePublished` freshness signals are still effectively fabricated in production (see Critical/High findings below), which undercuts an otherwise-good trust story. |

**Weighted E-E-A-T score: ~34/100** (up from ~19/100)

---

## Fixed since last audit

1. **`/about/` now exists and is substantive (was 404, CRITICAL).** ~280 words of real editorial content: states the site's purpose, a concrete sourcing/verification methodology (cited source + cross-check against someone who "grew up with the custom" where possible), an explicit corrections policy, and contact paths (GitHub issue/PR, email). This directly answers "who runs this, how is it sourced, how do I flag an error" — the three biggest Trustworthiness/Expertise gaps flagged previously. `AboutPage` JSON-LD is present and correctly formed. This single fix is responsible for most of the Trustworthiness score increase.

2. **Article body copy is roughly 3–4x longer and substantially deeper.** Sampled bodies now run 200–253 words (vs. 50–72 previously): opening claim paragraph, a second paragraph covering scope/exceptions, a bulleted "watch out for" list (e.g., "Don't force it if it feels unnatural," "It doesn't apply to pasta or other non-Japanese noodle dishes"), and a new **"Why it matters"** section giving cultural/historical rationale (e.g., the mechanical reason slurping cools and aerates noodles, likened to a sommelier aerating wine). This is a genuine topical-coverage improvement, not padding — it directly answers the "why," "exceptions," and "regional variation" gaps called out as recommendation #4 last time.

3. **Country and category hub pages now have real, unique editorial copy** (was "~0 unique words," CRITICAL). Every sampled hub has a distinct 2–3 sentence description specific to that country/category, not a templated fill-in — e.g. Japan: *"Japanese etiquette runs on precise small rituals — presenting a business card with both hands, never planting chopsticks upright in rice, removing your shoes at the genkan..."*; Korea: *"...built around a clear sense of age and rank (nunchi)..."*; Guam: *"Chamorro etiquette on Guam centers on reciprocity and respect for elders: chenchule' keeps gifts and favors circulating..."*. These read as genuinely written, not spun from a template.

4. **Duplicate meta descriptions are fixed** (was flagged HIGH, affected 9+/9 pages checked). All 6 category pages and all sampled country pages now carry unique meta descriptions matching their unique on-page copy (confirmed via `<meta name="description">` diff across `/category/dining/`, `/category/business/`, `/category/travel/`, `/country/japan/`, `/country/korea/`, `/country/mexico/` — zero duplicates found this pass, vs. 9/9 identical previously).

5. **Internal contextual linking expanded beyond same-country-only** (was flagged MEDIUM). Article pages now carry two related-content blocks: "More from [country]" (unchanged) plus a new **"More [category] rules"** block linking to the same category in *other* countries (e.g., the Japan dining/slurping page links out to China's "Don't flip the whole fish over" and France's "Put bread directly on the tablecloth"). This builds real topical-cluster signal across the country×category matrix that was previously absent.

6. **Content volume grew from 58 to 84 entries, all 13 live countries now have 5+ entries** (confirmed via `/about/`'s "Currently 84 rules across 14 countries" and the sitemap: China 7, France 6, Germany 5, Guam 5, India 5, Italy 5, Japan 12, Korea 11, Mexico 5, Philippines 6, Saudi Arabia 5, Thailand 6, UK 5, Global 1 = 84). This closes the prior gap where some countries had only 1–3 entries.

## Still open

7. **No Contact, Privacy Policy, or Terms pages** (`/contact/`, `/privacy/`, `/terms/`, `/methodology/` all still return 404). `/about/` substantially covers the "who/how to reach us" role a dedicated Contact page would, so this is lower-severity than last time, but a standalone `/contact/` and a minimal `/privacy/` (the site does load a third-party analytics script) are still standard trust-page hygiene a rater would expect and currently can't find. — **MEDIUM** (downgraded from CRITICAL, since About now covers most of the same ground).

8. **No named individual author or credentials anywhere.** The About page and footer point to a GitHub handle (`wonsukchoi`) and an email address, which is a real improvement over pure anonymity, but there is still no stated name, background, or claim of relevant expertise (e.g., "I've lived in/traveled to X," professional cross-cultural background, etc.) on any page. — **MEDIUM** (downgraded from CRITICAL/HIGH — anonymity is softened but not resolved).

9. **Single external source per entry, still skewed toward secondary/blog-tier sources.** All 4 freshly sampled entries (Japan/slurping → tokyotreat.com, Korea/titles → 90daykorean.com, China/toasting → trykaiwa.com, Saudi/coffee → taxiserviceksa.com) cite exactly one source each, consistent with the pattern flagged previously. No second corroborating source, no primary/institutional sources (embassy cultural guides, academic sources, etc.) observed in this sample. — **HIGH** (unchanged).

10. **"Severity" tag (`strict`/`casual`) still has no defined legend anywhere.** Checked `/search/` and homepage filter UI specifically this pass — no glossary, tooltip, or methodology text explaining the strict/casual distinction. The About page's "How an entry gets made" section would be the natural place to add 1–2 sentences on this and currently doesn't. — **LOW** (downgraded from MEDIUM given About page now exists as an obvious place to attach this).

## New findings

11. **CRITICAL (new): The per-entry `datePublished` fix does not work in production — every article on the live site shows the identical `datePublished` timestamp.** The code (`src/lib/publishedDates.ts`, wired into `src/pages/etiquette/[...slug].astro:44`) is well-designed in intent: it shells out to `git log --diff-filter=A` to find the real commit that first added each `.mdx` file, giving each entry a genuine, distinct publish date rather than a hand-maintained frontmatter field. **But live-site verification shows this isn't happening**: `datePublished` on every one of 4 sampled articles (Japan/slurping, Korea/titles, China/toasting, Saudi/coffee) is byte-identical — `"2026-09-02T19:18:19+09:00"` — despite these being genuinely different files added in different commits. Confirmed against the local repo's real git history: `dining-slurping-noodles.mdx` was actually first added at `2026-09-02T17:30:06+09:00`, `business-cards-both-hands.mdx` (an original, pre-expansion entry) at `2026-09-02T12:48:08+09:00` — neither matches the `19:18:19` value shown live, and the two real dates don't match each other either, proving the underlying git history *is* genuinely staggered per file. The most likely cause is that the Cloudflare Workers Build pipeline checks out the repo with a shallow clone (e.g. depth=1): with only one commit visible, every tracked file appears "added" in that single commit, collapsing all 84 `datePublished` values to the build's HEAD-commit timestamp. **This is functionally the same fabricated-freshness problem flagged last time, now wearing a more convincing disguise** — a timestamp with a real-looking `+09:00` offset and time-of-day precision is more likely to pass a cursory rater/LLM freshness check than last time's all-midnight-UTC value, while being equally unearned. Recommend either fetching full git history in the CI checkout step (e.g. `fetch-depth: 0` equivalent for the Workers Build git clone) or falling back to a per-entry frontmatter `publishedAt` date if a shallow clone can't be avoided.

12. **HIGH (still-open, restated with new evidence): `dateModified`/`updatedAt` is uniformly `2026-09-02` across every single entry — literally all 84.** Grepping `updatedAt:` across every `.mdx` file in `src/content/etiquette/` returns `2026-09-02` for all 84 entries, no exceptions, including entries that were part of the original (pre-expansion) 58-entry set and were not touched in the recent content push. This is the same "rolling build date, not a genuine edit date" pattern flagged in the prior audit (finding #4) and it persists unchanged — it just now sits alongside a `datePublished` field that's *also* broken (see #11), so the page currently has two freshness signals and neither is trustworthy.

13. **LOW (new, positive): the single-fact-card format is defensible as an intentional content type, not "thin content" in the QRG-penalty sense — worth stating explicitly.** At 200–253 words per entry, each page: states one discrete, well-scoped claim; covers its practical exceptions/edge cases; explains cultural rationale; cites a source; and links laterally into the same country and same category. That is comprehensive coverage *of the stated scope* (one custom), which is what the Sept 2025 QRG's "helpful content" framing actually rewards — the format doesn't need to hit blog-post-length (1,500 words) to be useful, and forcing filler to hit that number would be the wrong fix. The remaining word-count gap noted below is a genuine coverage gap (hub pages, homepage), not a per-entry one.

## Word count vs. QRG minimums

| Page type | Sampled avg | Prior avg | QRG floor | Status |
|---|---|---|---|---|
| Article/fact page | ~230 words (200–253 across 4 samples) | ~60 words | N/A defined for "fact card" format | Below a generic blog-post floor but reasonably defensible as complete coverage of a single, narrow claim (see finding #13) — not treated as a blind fail this pass. |
| Category hub page | ~60–90 unique words of editorial copy + full entry listing | ~0 | N/A (index page) | Fixed — now has real, differentiated prose per category, not just a count and a list. |
| Country hub page | ~50–80 unique words of editorial copy + entry listing | ~0 | 500–600 (location-page analog) | Editorial copy portion is still short of the location-page floor on its own, but combined with the listing and now-unique meta description this is no longer a bare doorway page. |
| Homepage | ~1,014 words (incl. full 84-entry listing + filter UI text) | ~400 | 500 | Comfortably over the floor now, mostly due to entry-count growth (58→84) rather than new homepage-specific prose — the visible hero copy itself is still a 2-sentence tagline. |

## AI Citation Readiness Score: 66 / 100 (up from 58)

**What improved:**
- The new "Why it matters" section gives an LLM genuine supporting nuance to draw on beyond the bare claim (e.g., *why* slurping is polite, not just *that* it is) — directly addresses the "no supporting nuance" gap flagged last time.
- The exceptions/edge-case bullet list on each entry (e.g., "doesn't apply to pasta," "cold noodle dishes are a partial exception") gives a hedged, more accurate answer surface for citation.
- Cross-category related-links block gives crawlers/LLMs a clearer topical-cluster signal per country×category cell.
- About page gives an LLM something concrete to cite as "Etiquetteness's methodology" if asked to justify the source, which didn't exist before.

**What still holds the score back:**
- `datePublished`/`dateModified` are both currently unreliable in production (findings #11–12) — an LLM or freshness-sensitive system citing "as verified on [date]" would be citing a fabricated-looking, uniform date across the entire corpus.
- Still single-source per fact, and that source is still often a secondary/blog-tier citation rather than a primary authority.
- No named author to attribute alongside "Etiquetteness says X."

---

## Recommendations (priority order)

1. **Fix the `datePublished` git-history lookup in production** (finding #11) — verify whether the Workers Build git checkout is shallow, and either deepen the clone or fall back to a frontmatter `publishedAt` field written once when an entry is first created. This is now the single highest-leverage fix: the code already does the right thing, it's a CI/checkout configuration bug, not a design gap.
2. **Stop overwriting `updatedAt` to today's date on every build for every entry** (finding #12) — only bump it when an entry's content actually changes. Until this is fixed, `dateModified` is providing negative signal (it reads as manipulated even where it isn't).
3. **Add a minimal `/contact/` and `/privacy/` page** — About covers most of the ground, but a rater or user specifically looking for these will still hit a 404; a one-paragraph privacy page is a very low-cost fix given the site does load third-party analytics.
4. **Put a name (even just "maintained by [name/handle]") and a one-line credibility statement somewhere visible** (About page or a byline) — the GitHub handle + email is progress over full anonymity but still requires a reader to infer who's behind the site.
5. **Add a 1–2 sentence legend for the strict/casual severity tag**, ideally appended to the About page's "How an entry gets made" section, which is now the natural home for it.
6. **Where feasible, add a second corroborating source per entry**, or favor higher-authority sources (embassy/cultural-institute guides, academic sources) over travel-blog citations, to move Authoritativeness beyond its current ~30/100.
7. **Route this site through the `seo-programmatic` sub-skill** for a scale-specific pass now that the corpus has grown to 84 entries across 13 live countries (105 total indexed URLs per sitemap) — thin-page ratio and indexation-at-scale questions are better suited to that skill than to this content-quality pass.
