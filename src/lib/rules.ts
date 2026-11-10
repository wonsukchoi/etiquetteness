import { CATEGORIES, type Category } from './categories';

// Each rule (one MDX file) lives as a section of its country page, anchored by
// its file name: /country/japan/#business-card-two-hands. Until 2026-11 every
// rule also had a page of its own at /etiquette/<country>/<slug>/; those URLs
// now 301 to the anchor (scripts/generate-redirects.ts).
//
// No astro:content import here: the build scripts in scripts/ use this too.

/** The rule's file name without extension, from a collection id like "japan/business-card-two-hands". */
export function ruleSlug(id: string): string {
  return id.split('/').at(-1)!;
}

/** Where a rule lives now: its section on the country page. */
export function rulePath(country: string, slug: string): string {
  return `/country/${country}/#${slug}`;
}

/** The rule's former standalone page, kept only as a redirect source. */
export function legacyRulePath(country: string, slug: string): string {
  return `/etiquette/${country}/${slug}/`;
}

interface RuleLike {
  data: { category: Category; severity: 'strict' | 'casual'; title: string };
}

/** Country-page order: category (CATEGORIES order), strict before casual, then title. */
export function compareRules(a: RuleLike, b: RuleLike): number {
  return (
    CATEGORIES.indexOf(a.data.category) - CATEGORIES.indexOf(b.data.category) ||
    (a.data.severity === b.data.severity ? 0 : a.data.severity === 'strict' ? -1 : 1) ||
    a.data.title.localeCompare(b.data.title)
  );
}
