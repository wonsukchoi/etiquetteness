// Cross-country guides: pages that pull one topic together from the rules on
// several country pages (e.g. chopsticks). They live under /guide/<slug>/, are
// listed in the sitemap and llms.txt, and are linked from the country pages and
// category pages they draw on. Plain data, no astro:content import, so the build
// scripts in scripts/ can use it too.

export interface Guide {
  slug: string;
  /** Page <h1>. The <title> adds " · Etiquetteness". */
  title: string;
  /** <title> text, kept short enough that the full title stays under 65 characters. */
  seoTitle: string;
  /** Meta description, written to fit 155 characters as is. */
  description: string;
  /** Link text used where other pages point at the guide. */
  linkText: string;
  /** Country slugs whose pages should link to the guide. */
  countries: string[];
  /** Category slugs whose pages should link to the guide. */
  categories: string[];
  /** Real date the guide was written or last changed (ISO date). */
  updatedAt: string;
}

export const GUIDES: Guide[] = [
  {
    slug: 'chopstick-etiquette',
    title: 'Chopstick etiquette: the rules in Japan, Korea, Vietnam and Thailand',
    seoTitle: 'Chopstick etiquette by country',
    description:
      'Never stand chopsticks upright in rice. Where the rule comes from in Japan, Korea and Vietnam, and the other chopstick and spoon rules at the table.',
    linkText: 'Chopstick etiquette across countries',
    countries: ['japan', 'korea', 'vietnam', 'thailand'],
    categories: ['dining'],
    updatedAt: '2026-11-20',
  },
];

export const guidePath = (slug: string) => `/guide/${slug}/`;

export const guidesForCountry = (country: string) => GUIDES.filter((g) => g.countries.includes(country));
export const guidesForCategory = (category: string) => GUIDES.filter((g) => g.categories.includes(category));
