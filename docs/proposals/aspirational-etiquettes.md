# Aspirational Etiquettes — a user-suggested ideas category (proposal)

- **From:** Kidon Jr. Lee
- **To:** Won Seok (review & feedback)
- **Status:** Open for discussion — *no code changes yet*. Just an idea to weigh pros and cons together before committing to anything.
- **Date:** 2026-09-12

---

## The idea

Add a new section to the site where **users can share opinions about etiquettes
that don't exist yet, but should** — specifically, rules people think *people
from their own country* ought to start following.

The key framing: **not what people from other countries should do.** This isn't
a place for one nation to lecture another on what they're doing wrong. It's
self-directed and introspective — each person speaks about their own culture
and what they wish their own countrymen would adopt.

Some examples to make the idea concrete:

- 🇰🇷 *Koreans should learn to say "excuse me" more readily instead of nudging
  past people on crowded subways.*
- 🇺🇸 *Americans should wait to see if a guest actually wants a drink before
  pouring one, instead of asking three times.*
- 🇯🇵 *Japanese workplaces should switch to "yes, and…" in team meetings instead
  of deferring to the senior person every time.*
- 🇧🇷 *Brazilians should start showing up on time to social gatherings — a
  little punctuality as a kindness to the host.*

This would sit **alongside** the existing curated etiquette rules, not replace
them — a community-driven counterpart to the site's current, fact-checked,
"what *is* done" entries.

## Why this is different from what the site already does

The site today is **descriptive** — it documents unwritten rules that *actually
exist* in each culture, written by an editor and fact-checked. Each entry is
presented as "this is how it is."

This idea is **aspirational** — rules that *don't* exist yet but that people
wish existed. And it's **self-directed** — the speaker is talking about their
own culture, not telling outsiders what to do. That's a meaningful shift in
voice, and it's one of the reasons I think it's interesting: it turns the site
from a reference into a **conversation about culture**, and it makes people the
subject of their own observations rather than the object of someone else's.

It also has a natural growth angle: every user-submitted idea is fresh,
original content that costs us nothing to source, and it gives visitors a reason
to participate instead of just read.

## Design considerations I want to weigh together

These are the open questions, not decisions. I'd rather discuss than assume:

1. **Moderation / quality** — user-submitted ideas can be thoughtless, offensive,
   or trolling. What's the review flow? (curated after submission / upvoted by
   community / both?) How do we keep it from becoming a place for national
   stereotypes or insulting one country from the outside?

2. **The "someone else's country" boundary** — we'd need to decide *how* to keep
   this self-directed. Do we require people to tag only their own
   national/cultural identity? How does a user *prove* they belong to that
   identity, or do we just trust the self-declared country?

3. **Verification standard** — existing rules are fact-checked because they
   describe reality. Aspirational ideas describe *wishes*, so there's nothing
   to fact-check. But should we still filter for ideas that are broadly
   reasonable vs. fringe? And should there be a "this already exists" flag when a
   suggested rule is actually already common practice?

4. **Format & placement** — is this a new top-level **category** (a third
   dimension beyond the 7 current rule-types and the 16 countries), or a
   separate content collection / section like the Travel Phrases proposal? Each
   has different implications for the information architecture.

5. **Anonymity / identity** — do users post under a username, or anonymously?
   Anonymity might invite bolder, more honest ideas; identity might keep things
   more civil. Tradeoffs to discuss.

6. **Engagement mechanics** — upvotes, comments, "I'd add this in my country
   too"? Or keep it read-only display of submissions for a gentler first cut?

## My initial take (open to pushback)

I think this is genuinely a good fit for the site's spirit — polite, curious,
cross-cultural — and the aspirational + self-directed framing is what keeps it
from becoming toxic. But the moderation and identity questions are the ones
that most determine whether it works or becomes a liability, so I'd want to
settle those before any build. If it does go ahead, my instinct is to **start
small — a pilot as a read-only, curated category** — prove the community
submits good ideas, and only then add voting/commenting.

## Open questions for you

1. Does the **aspirational, self-directed** framing resonate, or does it blur
   the line of what the site is for?
2. Which of the design considerations above matter most to you (moderation,
   identity, format, engagement)?
3. **Pilot vs. full build?** Should we test with a curated first set of ideas,
   or go straight to community submissions?
4. Should this live under the existing categories, or as a **separate section**
   alongside the Travel Phrases idea we're already discussing?

No changes to `main` — this is a feature branch awaiting your review. Happy to
walk through it on a call or in messages.
