import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const etiquette = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/etiquette' }),
  schema: z.object({
    title: z.string(),
    country: z.string(), // "korea", "japan", "global", ...
    category: z.enum(['dining', 'business', 'social', 'travel', 'gifts', 'home', 'dating']),
    severity: z.enum(['strict', 'casual']),
    summary: z.string(), // one-sentence rule, shown in listings
    context: z.string().optional(), // why the rule exists
    source: z.string().optional(),
    sourceUrl: z.url().optional(),
    publishedAt: z.coerce.date().optional(), // real first-added date, backfilled from git history
    updatedAt: z.coerce.date().optional(), // only bump when THIS entry's content actually changes — not on unrelated commits, or dateModified/sitemap lastmod stop meaning anything
  }),
});

const phrases = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/phrases' }),
  schema: z.object({
    country: z.string(), // "korea", "japan", ... — must match an etiquette entry's `country` value
    phrases: z.array(
      z.object({
        phrase: z.string(), // English
        translation: z.string(), // local-language script
        pronunciation: z.string(), // simplified romanized guide
        note: z.string().optional(), // usage caveat, e.g. gendered particles, register
      })
    ),
  }),
});

export const collections = { etiquette, phrases };
