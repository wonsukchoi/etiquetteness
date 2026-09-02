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
    logo: {
      '@type': 'ImageObject',
      url: new URL('/og-image.jpg', site).toString(),
      width: 1200,
      height: 630,
    },
    sameAs: ['https://github.com/wonsukchoi/etiquetteness'],
  };
}

export function websiteNode(site: string | URL, description: string) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Etiquetteness',
    description,
    url: String(site),
    publisher: { '@id': ORGANIZATION_ID },
  };
}
