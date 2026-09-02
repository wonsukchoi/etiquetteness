import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: URL }) {
  const entries = await getCollection('etiquette');

  const sorted = entries.sort((a, b) => {
    const aDate = (a.data.updatedAt ?? a.data.publishedAt ?? new Date(0)).valueOf();
    const bDate = (b.data.updatedAt ?? b.data.publishedAt ?? new Date(0)).valueOf();
    return bDate - aDate;
  });

  return rss({
    title: 'Etiquetteness',
    description: 'Country-by-country etiquette rules — dining, business, social, travel, gifts, and home customs.',
    site: context.site,
    items: sorted.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      link: `/etiquette/${entry.id}/`,
      pubDate: entry.data.updatedAt ?? entry.data.publishedAt,
      categories: [entry.data.country, entry.data.category],
    })),
    customData: '<language>en-us</language>',
  });
}
