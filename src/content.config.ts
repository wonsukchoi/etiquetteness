import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const etiquette = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/etiquette' }),
  schema: z.object({
    title: z.string(),
    country: z.string(), // "korea", "japan", "global", ...
    category: z.enum(['dining', 'business', 'social', 'travel', 'gifts', 'home']),
    severity: z.enum(['strict', 'casual']),
    summary: z.string(), // one-sentence rule, shown in listings
    context: z.string().optional(), // why the rule exists
    source: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    publishedAt: z.coerce.date().optional(), // real first-added date, backfilled from git history
    updatedAt: z.coerce.date().optional(), // only bump when THIS entry's content actually changes — not on unrelated commits, or dateModified/sitemap lastmod stop meaning anything
  }),
});

export const collections = { etiquette };
