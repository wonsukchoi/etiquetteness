// Shared JSON-LD nodes reused across pages. Each page embeds these directly
// in its own @graph (not just an @id reference) since Google evaluates each
// page's structured data independently — there's no cross-page resolution.
export const ORGANIZATION_ID = 'https://etiquetteness.com/#organization';
export const WEBSITE_ID = 'https://etiquetteness.com/#website';

export function organizationNode(site: string | URL) {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Etiquetteness',
    url: String(site),
    // Square mark (public/logo.png, the favicon "E" on white): Google wants a
    // square-ish logo, not the 1200x630 social card used for og:image.
    logo: {
      '@type': 'ImageObject',
      url: new URL('/logo.png', site).toString(),
      width: 512,
      height: 512,
    },
    sameAs: ['https://github.com/wonsukchoi/etiquetteness'],
  };
}

export const SITE_DESCRIPTION =
  'The etiquette nobody writes down: unwritten cultural and social rules, by country and situation.';

export function websiteNode(site: string | URL, description: string = SITE_DESCRIPTION) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Etiquetteness',
    description,
    url: String(site),
    publisher: { '@id': ORGANIZATION_ID },
  };
}
