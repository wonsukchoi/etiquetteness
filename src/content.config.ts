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
    updatedAt: z.coerce.date().optional(),
  }),
});

export const collections = { etiquette };
