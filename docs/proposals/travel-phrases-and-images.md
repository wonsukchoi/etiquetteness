# Proposal: Travel Phrases + Image Feature

**From:** Kidon Jr. Lee
**To:** Won Seok (review & feedback)
**Status:** Open for discussion — no code changes yet
**Date:** 2026-09-09

---

## 1. Travel Phrases — new content section

### The idea

Alongside the etiquette rules for each country, add a **"Travel Phrases"** section with the core phrases travelers actually need in the local language. Etiquette tells you *how to behave*; phrases tell you *what to say*. They're two halves of the same "don't embarrass yourself abroad" package.

### Example phrases (per country)

- Thank you
- Hello / Good morning / Good evening
- Excuse me
- How much is this?
- Just looking, thank you
- Please
- Yes / No
- Where is the bathroom?
- Do you speak English?
- The bill, please

### Why a separate section (not a new category)

The site's `category` field is a **type of etiquette rule** (`dining | business | social | travel | gifts | home | dating`), and every entry has a `severity` (`strict | casual`). A phrase like "Thank you" isn't a rule — it has no severity. Shoehorning phrases into the existing collection would:

- Pollute the etiquette feed with non-rule content
- Force schema hacks (fake severity values)
- Confuse the "X rules" counts on category/country pages

Instead, a **new content collection** (e.g. `src/content/phrases/`) keyed by the same countries keeps things clean:

- Own schema: `country` + list of `{ phrase, translation, pronunciation }`
- Renders as phrase cards per country, complementing the etiquette rules
- Reuses the existing country structure (16 countries already in `src/lib/countries.ts`)

### Open questions for Won Seok

1. **Scope:** Start with all 16 countries, or a pilot (e.g. Japan, Korea, Thailand, France)?
2. **Phrase count:** ~10 core phrases per country, or a longer list?
3. **Pronunciation:** Simple romanized guide, or audio clips (TTS)?
4. **Placement:** A top-level "Phrases" tab, or a per-country sub-section on each country page?

---

## 2. Image Feature — add photos to the etiquette rules

This is the **pending decision** we discussed earlier. The site currently has **no image support** — the content schema has no `image` field, and `ImagePlaceholder` only appears on the 404 page.

### The open decision: image sourcing

| Option | Pros | Cons |
|---|---|---|
| **Generated / illustrated** | Consistent style, no licensing issues | Cost (image gen credits), less authentic |
| **Free-license stock** (Wikimedia etc.) | Free, real photos | Inconsistent style, sourcing/attribution work |
| **Kidon's own photos** | Authentic, personal | Limited coverage, effort |
| **Hybrid** | Best of all | Most coordination |

### Recommendation

I'd lean **hybrid** — use free-license stock as the baseline for broad coverage, and Kidon's own photos where he has them (especially Guam). But this is a real decision with trade-offs, so we'd like Won Seok's input before building.

---

## 3. How to proceed

Both ideas are **proposals only** — no code has been written. We'd like Won Seok to:

1. Review both ideas and share thoughts
2. Weigh in on the open questions above
3. Give the green light (or suggest changes) before we build anything

Once approved, we'll implement on a feature branch and open a proper PR for review before anything touches `main`.
