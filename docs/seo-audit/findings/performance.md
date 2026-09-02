# Performance / Core Web Vitals Audit — etiquetteness.com

**Method note (important):** No Lighthouse, PageSpeed Insights API, CrUX API, or
Playwright/browser rendering was available in this environment. All findings below
are **lab/proxy estimates derived from `curl` timing, response headers, and static
HTML inspection only**. There is no real INP data (requires actual user interaction
tracing) and no field/CrUX data (requires Google API access or sufficient traffic
history). Treat all severities as provisional until validated with real Lighthouse
and CrUX/PageSpeed Insights data.

Pages sampled: `/` (home), `/category/dining/`, `/search/`,
`/etiquette/japan/dining-chopstick-rules/`.

---

## Summary Table (proxy estimates only)

| Metric | Proxy signal | Estimated status | Confidence |
|---|---|---|---|
| LCP | No hero images anywhere on site; text-only content; TTFB ~440-570ms from test vantage point; render-blocking Google Fonts CSS | Likely **Good–Needs Improvement** boundary | Low (no real LCP trace) |
| INP | No custom/heavy JS on content pages; only `pagefind-ui.js` (120KB, non-deferred) on `/search` | Not measured (no interaction tracing available) | Not measured |
| CLS | `font-display: swap` in use (avoids FOIT); no images (no missing width/height risk); no ads/embeds | Likely **Good** | Low-Medium |

---

## Findings

### [HIGH] Every internal link triggers a 307 redirect (missing trailing slash)
All internal `href` values in the rendered HTML (60+ on homepage alone) omit the
trailing slash (e.g. `href="/category/dining"`, `href="/etiquette/japan/dining-chopstick-rules"`),
but the site canonically serves those routes only at the trailing-slash URL. Requesting
the no-slash path returns `HTTP/2 307` with `location: /category/dining/`, forcing a
second full round trip before the destination page loads.
- Verified on `/category/dining` → 307 → `/category/dining/`
- Verified on `/search` → 307 → `/search/`
- Verified on `/etiquette/japan/dining-chopstick-rules` → 307 → trailing-slash version
- Every canonical URL in the page `<head>` also uses the trailing slash, confirming
  the site's intended canonical form doesn't match the links it emits.

**Impact:** Doubles latency (~450-600ms extra) for effectively every internal
navigation on the site — this affects LCP/TTFB for the *next* page on almost
every click a real user makes, and is a widespread, easily reproducible issue
(not a corner case).

**Recommendation:** Set `trailingSlash: 'always'` in `astro.config.mjs` (this makes
Astro emit trailing-slash links matching the server's canonical routes), or emit
links with trailing slashes directly in templates. This is a clear win with no
tradeoffs given the current server behavior.

### [MEDIUM] Render-blocking Google Fonts stylesheet on every page
Every page (`home`, `category`, `article`, `search`) loads
`https://fonts.googleapis.com/css2?...&display=swap` as a synchronous
`<link rel="stylesheet">` in `<head>`. `rel="preconnect"` is correctly set for both
`fonts.googleapis.com` and `fonts.gstatic.com` (good), and the returned CSS does
include `font-display: swap` for all `@font-face` rules (confirmed by fetching the
CSS directly), which mitigates invisible-text (FOIT) risk and reduces CLS risk from
font swapping. However, this is still an extra render-blocking origin + one or two
subsequent font file downloads before final-fonts render.

Font payload actually downloaded (for latin subset) is efficient: Google serves the
weight range 500/600/700/900 for "Fraunces" and 400/500/600 for "Inter" each as a
**single variable-font `.woff2` file** rather than 7 separate static files:
- Fraunces variable woff2: 67,388 bytes
- Inter variable woff2: 48,432 bytes

**Impact:** Blocks CSSOM construction slightly and delays webfont-styled text
paint; moderate given `display=swap` already prevents invisible text.

**Recommendation:** Consider self-hosting the two variable woff2 files (bundle with
the Astro build, serve from same origin as `_astro/*` assets) with
`<link rel="preload" as="font" type="font/woff2" crossorigin>` for the primary
weight used above the fold. This removes the `fonts.googleapis.com` round trip
entirely and lets Cloudflare edge-cache the font files with long-lived
`Cache-Control`, which is the more consistently recommended approach for CWV in
2025-2026 guidance.

### [MEDIUM] Static-hashed assets are not sent with long-lived/immutable caching
`/_astro/Layout.Cne0tRfE.css` (content-hashed filename, 30,226 bytes) is served with:
```
cache-control: public, max-age=0, must-revalidate
```
Despite `cf-cache-status: HIT` (Cloudflare edge cache serves it fast), the
`max-age=0` instructs browsers to revalidate on every visit rather than reuse from
local disk cache. Since the filename already contains a content hash
(`Cne0tRfE`), it is safe to cache this indefinitely.

**Recommendation:** Add a `public/_headers` rule (Cloudflare Pages) or Worker
route to set `Cache-Control: public, max-age=31536000, immutable` for anything
under `/_astro/*` (and other hashed build assets like `/pagefind/*` if hashed).
This removes a revalidation round trip on repeat visits and improves perceived
LCP/TTFB for returning visitors.

### [LOW] `pagefind-ui.js` (120KB) loads without `defer`/`async` on `/search`
On `/search` only: `<script src="/pagefind/pagefind-ui.js"></script>` (119,987 bytes,
`cf-cache-status: MISS` at time of test) has no `defer` or `async` attribute. It is
placed near the end of `<body>`, so practical parser-blocking impact is limited, but
it is still a synchronous script load that could delay interactivity
(potentially INP-relevant) on the search page specifically. This does not affect
home/category/article pages.

**Recommendation:** Add `defer` to the pagefind script tag; confirm pagefind's
runtime tolerates deferred execution (it typically does, since it self-initializes
on an ID it queries after load).

### [INFO / Positive] Lean resource weight, no images
No `<img>`, `<picture>`, or CSS `background-image` were found on any sampled page
(home, category, article, search). Total homepage payload is very light:
- HTML: 46,296 bytes
- Layout CSS: 30,226 bytes
- Two variable webfonts (shared across pages, cacheable): ~115,820 bytes combined
- No custom application JS on content pages

This is a strong baseline for LCP and CLS: there is no unoptimized hero image to
compress/convert to WebP/AVIF, and no layout-shift risk from image dimensions.
DOM size is modest (~380 tags on the richest page, the homepage index; ~90-165 on
category/article pages) — well under the 1,500-element INP risk threshold.

### [INFO] TTFB / connection timing (proxy only — vantage-point caveat)
5 repeated `curl -w` runs against `/` (all `cf-cache-status: HIT`) from this
environment's network location (resolving to a Cloudflare `SJC` PoP per `cf-ray`):

| Run | connect | tls (appconnect) | TTFB (starttransfer) | total |
|---|---|---|---|---|
| 1 | 0.142s | 0.289s | 0.453s | 0.476s |
| 2 | 0.151s | 0.304s | 0.475s | 0.502s |
| 3 | 0.140s | 0.285s | 0.444s | 0.469s |
| 4 | 0.134s | 0.274s | 0.436s | 0.462s |
| 5 | 0.164s | 0.333s | 0.540s | 0.569s |

TTFB (~440-540ms) even on cache HIT is higher than the ~200ms rule-of-thumb often
cited for a healthy TTFB contribution to LCP. **This is very likely an artifact of
this test environment's network path to the specific Cloudflare PoP it happened to
hit, not representative of real end users**, who will generally resolve to a
geographically closer PoP with a warm cache and much lower RTT. This must be
validated against real CrUX field data (`time_to_first_byte` LCP subpart, available
in CrUX since Feb 2025) or PageSpeed Insights before treating as an actual issue.
`cache-control: public, max-age=0, must-revalidate` on the HTML document itself is
expected/fine for HTML (edge revalidates fast; do not make HTML immutable).

### Not measured
- **INP**: requires real user interaction tracing (RUM/CrUX) or a browser
  automation tool; not available in this environment. No CrUX or PageSpeed
  Insights API access was available/used for this pass.
- **Real LCP element and timing**: requires an actual paint-timing capture
  (Lighthouse/CDP); only inferred here from absence of images and presence of
  render-blocking CSS/fonts.
- **CLS numeric score**: requires layout-shift observation during load; only
  qualitative risk factors assessed (no images, `font-display: swap` present).
- **Third-party script impact**: `analytics.wonsukchoi.com/script.js` was found in
  the `src/layouts/Layout.astro` source (added in commit `d3a50ae`, uses `defer`)
  but was **not present** in the currently deployed/live HTML for any sampled page
  — indicates this change has not yet been deployed to production, or is
  deployed on a different branch. Confirm deploy status before assuming it's live;
  once live, `defer` placement is correct and low-risk for LCP/INP.

---

## Priority Recommendations (impact-ordered)

1. **[HIGH]** Fix trailing-slash mismatch (`trailingSlash: 'always'` in
   `astro.config.mjs`) — eliminates a 307 redirect on effectively every internal
   link/navigation site-wide. Highest-confidence, no-tradeoff fix found in this audit.
2. **[MEDIUM]** Add long-lived immutable caching (`Cache-Control: public,
   max-age=31536000, immutable`) for hashed `/_astro/*` build assets via
   Cloudflare `_headers` or Worker.
3. **[MEDIUM]** Self-host the two Google Fonts variable woff2 files and preload
   the primary above-the-fold weight; removes a third-party render-blocking
   origin.
4. **[LOW]** Add `defer` to `/pagefind/pagefind-ui.js` on the search page.
5. **[Validate]** Re-run this audit with real Lighthouse and PageSpeed
   Insights/CrUX data once available — current TTFB numbers and all LCP/CLS/INP
   assessments here are lab/proxy estimates from a single, possibly
   non-representative network vantage point, not field data.
