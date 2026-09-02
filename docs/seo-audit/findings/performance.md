# Performance / Core Web Vitals Audit — etiquetteness.com

**Method note (important, unchanged since prior pass):** No Lighthouse, PageSpeed
Insights API, CrUX API, or Playwright/browser rendering is available in this
environment — confirmed again this pass (`scripts/pagespeed_check.py` and
`scripts/render_page.py` referenced in the skill instructions do not exist
anywhere on this machine). All findings below remain **lab/proxy estimates
derived from `curl` timing, response headers, and static HTML inspection only**.
There is still no real INP data (requires interaction tracing) and no field/CrUX
data. Treat all severities as provisional until validated with real Lighthouse
and CrUX/PageSpeed Insights data.

Pages sampled: `/` (home), `/category/dining/`, `/search/`,
`/etiquette/japan/dining-chopstick-rules/`.

Re-audit date: 2026-09-02 (same day as prior pass; re-run after deploys landed).
Prior pass score: 65/100. **This pass: 72/100.**

---

## What changed since the prior pass (2026-09-02, score 65)

| Item | Status |
|---|---|
| Trailing-slash 307 redirect on internal links (prior HIGH) | **RESOLVED** — `trailingSlash: 'always'` is set in `astro.config.mjs`; every internal `href` on all 4 sampled pages now includes the trailing slash matching the canonical route. No more double round-trip on internal navigation. |
| Security headers via Cloudflare `_headers` (CSP, HSTS, X-Frame-Options, etc.) | **Live, verified negligible overhead.** Served from a static `public/_headers` rule (`/*` block), applied at Cloudflare's edge with no extra round trip. TTFB is statistically unchanged from baseline (~440–480ms this pass vs ~440–540ms prior pass, different Cloudflare PoP — PDX this time vs SJC before). Header bytes add a few hundred bytes to the response, not measurable as a CWV impact. |
| Per-entry OG images (satori + resvg, generated at build time) | **Verified zero runtime cost.** `package.json` build script confirms order: `tsx scripts/generate-og-images.ts && astro build && pagefind --site dist` — images are rendered to static PNG files in `dist/og/<country>/<slug>.png` before the Astro build, not computed per-request. Confirmed live: `GET /og/japan/dining-chopstick-rules.png` returns `cf-cache-status: MISS` then `HIT` on the next request, same as any static asset — no compute-on-request behavior observed. |
| `/_astro/*` long-lived caching (prior MEDIUM quick-win) | **STILL NOT LIVE.** `public/_headers` only contains the `/*` security-header block; there is no `/_astro/*` rule. Confirmed live: `GET /_astro/Layout.Bp36PgcS.css` still returns `cache-control: public, max-age=0, must-revalidate` despite the content-hashed filename. This now also applies to the new hero image files and OG images (same `max-age=0` pattern), so the miss has gotten slightly more consequential than before. |
| Google Fonts render-blocking stylesheet (prior MEDIUM) | **Unchanged / still open.** Same `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?...">` synchronous load on every page; `preconnect` still correctly set for both font origins. |
| `pagefind-ui.js` missing `defer` on `/search` (prior LOW) | **Unchanged / still open.** `<script src="/pagefind/pagefind-ui.js">` still has no `defer`/`async`. |
| Analytics script (`analytics.wonsukchoi.com/script.js`) | **Now confirmed live** (was "not deployed" in the prior pass). Present on homepage with `defer`, correct placement — low risk. |
| **NEW: hero image on homepage** | Not present in the prior pass ("no images anywhere on site" was the baseline finding). A responsive hero image now renders on `/` only (category/article/search pages remain text-only, 0 `<img>` tags each). See findings below — implementation quality is good, but it introduces a new LCP-critical resource that isn't long-cached. |

---

## Summary Table (proxy estimates only)

| Metric | Proxy signal | Estimated status | Confidence |
|---|---|---|---|
| LCP | Homepage: 1 hero `<img>` with `width`/`height`, `srcset`, `fetchpriority="high"`, `loading="eager"`, `decoding="async"` (well-implemented); largest variant 69,412 bytes over an already-warm HTTP/2 connection. Category/article/search pages remain text-only. TTFB ~440-480ms on cache HIT. Render-blocking Google Fonts CSS still present site-wide. | Likely **Good** on text-only pages; likely **Good–Needs Improvement boundary** on homepage specifically (new image dependency + font-blocking CSS + ~450ms TTFB stacked) | Low (no real LCP trace) |
| INP | No custom/heavy application JS on content pages. An orphaned React client bundle (`/_astro/client.B3v6l__6.js`, 191,589 bytes / 59,888 bytes brotli) exists in the build output but is **not referenced by any sampled page's HTML** — not fetched by real visitors, zero current INP cost, but flagged as build hygiene (no `client:load`/`client:idle`/`client:visible` directives found anywhere in `src`). `pagefind-ui.js` (120KB, non-deferred) remains on `/search` only. | Not measured | Not measured |
| CLS | Hero image has explicit `width="1200" height="800"` (prevents shift), `font-display: swap` still in use, no ads/embeds, no other images site-wide. | Likely **Good** | Low-Medium |

---

## Findings

### [RESOLVED] Trailing-slash redirect on internal links
`astro.config.mjs` now sets `trailingSlash: 'always'`. Verified on all 4 sampled
pages: every internal `href` (category links, country links, article links,
about, search) is emitted with a trailing slash matching the server's canonical
route. Directly requesting a no-slash path (e.g. `/category/dining`) still
307-redirects to `/category/dining/` — that's expected and correct; the point is
that real rendered links no longer trigger it. This eliminates the ~450-600ms
extra round trip that previously affected effectively every internal navigation
site-wide.

### [MEDIUM, escalating] Static-hashed assets and images still not sent with long-lived caching
`/_astro/Layout.Bp36PgcS.css` (30,226 bytes uncompressed / 7,060 bytes brotli)
and the new hero image files under `/_astro/hero-brunch-table.*.webp` are all
served with:
```
cache-control: public, max-age=0, must-revalidate
```
This was flagged as a MEDIUM quick-win in the prior pass and remains
unimplemented — `public/_headers` still only has a `/*` block for security
headers, no `/_astro/*` rule. The gap now covers a slightly larger surface
(hero image variants + a growing library of per-entry OG PNGs under `/og/*`),
though the OG images specifically matter less here since they're mostly
fetched once by social-share crawlers/scrapers rather than repeat browser
visits.

**Recommendation (unchanged):** Add a `public/_headers` rule —
```
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```
This is safe because filenames are content-hashed (`Bp36PgcS`, `CrWXH6XT_*`
etc. change when content changes). Consider a separate long-but-revalidatable
rule for `/og/*` (e.g. `max-age=86400`) since those aren't content-hashed
filenames and could theoretically be regenerated with the same URL.

### [MEDIUM] Render-blocking Google Fonts stylesheet on every page (unchanged)
Same as prior pass: `https://fonts.googleapis.com/css2?...&display=swap` loads
synchronously in `<head>` on all 4 sampled pages, `preconnect` correctly set for
both `fonts.googleapis.com`/`fonts.gstatic.com`, `font-display: swap` confirmed
present in the served CSS. No change in implementation since the last audit.

**Recommendation (unchanged):** Self-host the two variable woff2 files
(Fraunces ~67KB, Inter ~48KB) under `/_astro/*` or `/fonts/*` with
`<link rel="preload" as="font" ... crossorigin>`, paired with the
long-lived-caching fix above so the self-hosted fonts are also immutable-cached.

### [NEW] Homepage hero image is well-implemented but not yet long-cached
`GET /` now includes:
```html
<img src="/_astro/hero-brunch-table.CrWXH6XT_29Cu3h.webp"
     srcset="...400w, ...600w, ...900w, ...1200w"
     sizes="(min-width: 640px) 480px, 100vw"
     loading="eager" fetchpriority="high" decoding="async"
     width="1200" height="800" ...>
```
This is genuinely good LCP/CLS practice: responsive `srcset` (14.5KB–69.4KB
across breakpoints), explicit dimensions (no layout-shift risk),
`fetchpriority="high"` + `loading="eager"` correctly signal this as the LCP
candidate rather than lazy-loading it, and `decoding="async"` avoids blocking
the main thread on decode. The only gap is the caching header issue above (this
image is re-validated on every repeat visit instead of read from disk cache).
No `<link rel="preload" as="image">` is used, but `fetchpriority="high"` is
generally sufficient for Chrome's LCP image discovery — preload would be a
minor additional gain, not a requirement, given the image isn't background-CSS
or otherwise hidden from the preload scanner.

Content-encoding is correctly negotiated: `br` (Brotli) is served when a client
requests it (confirmed via `curl -H "Accept-Encoding: br"`), gzip as fallback —
CSS/JS payloads are well-compressed (Layout CSS: 30,226B raw / 7,060B brotli;
client bundle: 191,589B raw / 59,888B brotli).

### [LOW] `pagefind-ui.js` (120KB) still loads without `defer` on `/search` (unchanged)
No change from prior pass — same recommendation stands: add `defer`.

### [INFO] Orphaned React client bundle in build output
`/_astro/client.B3v6l__6.js` (191,589 bytes uncompressed, 59,888 bytes brotli)
exists in the deployed `dist/_astro/` output but is **not referenced by any of
the sampled pages' HTML**, and `grep -r "astro-island"` / `client:load|idle|
visible|only` across `src/**/*.astro` returns no matches. This means
`@astrojs/react` is installed and its runtime is bundled, but nothing on the
live site currently hydrates a React island. Real visitors never fetch this
file (browsers only request what's referenced in the HTML they receive), so
**this has zero measured or theoretical INP/LCP impact today**. Flagging only
as build hygiene — if no React island is planned soon, removing unused
`client:*` scaffolding (or the dependency) trims the build output; if one is
planned, this is expected overhead to budget for once it ships (60KB brotli is
a meaningful INP-risk chunk once actually loaded and hydrated).

### [INFO / Positive] OG image generation confirmed zero-runtime-cost
Verified as intended: per-entry OG images are pre-rendered PNGs (satori→resvg)
written to `dist/og/<country>/<slug>.png` during the build step (before
`astro build` in the `build` npm script), not computed at request time.
Confirmed live behavior matches a normal static asset (`cf-cache-status: MISS`
→ `HIT` across two consecutive requests, `image/png`, no unusual latency: ~0.46s
total on the miss request, consistent with baseline TTFB, not an outlier compute
delay). No performance concern here.

### [INFO] TTFB / connection timing (proxy only — vantage-point caveat, unchanged)
5 repeated `curl -w` runs against `/` (all `cf-cache-status: HIT`), this time
resolving to Cloudflare `PDX` (was `SJC` in the prior pass — different PoP):

| Run | connect | tls | TTFB | total |
|---|---|---|---|---|
| 1 | 0.136s | 0.278s | 0.444s | 0.601s |
| 2 | 0.148s | 0.302s | 0.472s | 0.647s |
| 3 | 0.149s | 0.308s | 0.484s | 0.658s |
| 4 | 0.138s | 0.280s | 0.451s | 0.668s |
| 5 | 0.143s | 0.285s | 0.449s | 0.609s |

TTFB (~440-480ms) is essentially unchanged from the prior pass (~440-540ms),
despite this pass hitting a different PoP and the site now shipping security
headers + a larger homepage payload — reinforces that the new `_headers` block
is not adding measurable server-side overhead. `total` time is somewhat higher
than the prior pass's `total` (0.60-0.67s vs 0.46-0.57s before), consistent
with the homepage now being ~2.6x heavier (120,965 bytes vs 46,296 bytes HTML
previously) due to the added hero-image markup/srcset and general content
growth — expected, not concerning on its own given the image is compressed and
appropriately sized per breakpoint. As before: **this must be validated against
real CrUX field data or PageSpeed Insights**, not treated as ground truth from
this single environment's network path.

### Not measured (unchanged from prior pass)
- **INP**: requires real user interaction tracing (RUM/CrUX) or a browser
  automation tool; not available in this environment.
- **Real LCP element and timing**: requires actual paint-timing capture
  (Lighthouse/CDP); only inferred here from image/font/TTFB proxy signals.
- **CLS numeric score**: requires layout-shift observation during load; only
  qualitative risk factors assessed.

---

## Priority Recommendations (impact-ordered)

1. **[MEDIUM, top remaining item]** Add long-lived immutable caching
   (`Cache-Control: public, max-age=31536000, immutable`) for `/_astro/*` via
   `public/_headers`. This is the same quick-win recommended last pass and is
   now slightly higher-value since it also covers the new hero image variants,
   not just CSS/JS.
2. **[MEDIUM]** Self-host the two Google Fonts variable woff2 files with
   `preload`, paired with the caching fix above.
3. **[LOW]** Add `defer` to `/pagefind/pagefind-ui.js` on `/search`.
4. **[LOW / optional]** Consider `<link rel="preload" as="image">` for the
   homepage hero's largest srcset candidate for a marginal LCP gain (current
   `fetchpriority="high"` already covers most of this benefit).
5. **[Build hygiene, no user-facing impact]** Confirm whether `@astrojs/react`
   / the orphaned `client.B3v6l__6.js` bundle is intentional scaffolding for
   upcoming work or dead weight to prune.
6. **[Validate]** Re-run with real Lighthouse and PageSpeed Insights/CrUX data
   once available — this remains the single biggest gap in confidence across
   both audit passes; all LCP/CLS/INP assessments here are proxy estimates.

---

## Score rationale

**72/100** (up from 65/100). The prior pass's single HIGH-severity, no-tradeoff
issue (trailing-slash redirects doubling latency on effectively every internal
navigation) is confirmed resolved — this is the largest driver of the increase.
Offsetting that gain: a new homepage hero image (well-implemented, but not yet
covered by the still-outstanding `/_astro/*` caching fix) adds a small amount
of new LCP surface area, and two previously-identified MEDIUM/LOW items (font
loading, pagefind script `defer`) remain unaddressed after a second audit
pass. Security headers and build-time OG image generation were both verified
to add no measurable performance cost. Score remains a lab/proxy estimate in
the absence of Lighthouse/CrUX/PageSpeed Insights access in this environment.
