# Context

**Current Task**: Merged PR #3 (Dating category, 13 entries across 12 countries + global) into `main`, resolved a `categories.ts` conflict (main added per-category `description` field), then pushed `main` to `production` and confirmed the Dating pages render live at etiquetteness.com.

**Key Decisions**:
- `categories.ts` conflict resolved by keeping main's `{ label, color, description }` shape and writing a new description for `dating` (no prior draft existed).
- Production deploy is a separate step from merging to `main` — `production` branch lagged behind after the merge, had to be explicitly fast-forwarded (`git push origin main:production`) to go live. Confirmed with user first per standing rule.

**Next Steps**:
- Business etiquette hub and wedding-guest etiquette entries identified from keyword research but not yet drafted (`business etiquette` 1900 vol, `who pays for the wedding traditionally` 1600 vol).
- Brazil and Vietnam researched (older session notes) but Brazil not yet drafted as a country.
- Re-run the SEO audit (`docs/seo-audit/`) — stale, predates recent fixes.
