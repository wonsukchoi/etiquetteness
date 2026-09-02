// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// Reads each entry's `updatedAt` frontmatter directly from disk (rather than via
// astro:content, which isn't available yet at config-eval time) so the sitemap can
// carry a real per-page <lastmod> instead of omitting it.
function readEtiquetteLastmods() {
  const contentDir = fileURLToPath(new URL('./src/content/etiquette', import.meta.url));
  const entries = [];

  for (const country of readdirSync(contentDir, { withFileTypes: true })) {
    if (!country.isDirectory()) continue;
    const countryDir = path.join(contentDir, country.name);

    for (const file of readdirSync(countryDir)) {
      if (!file.endsWith('.mdx')) continue;
      const raw = readFileSync(path.join(countryDir, file), 'utf-8');
      const frontmatter = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
      const category = frontmatter.match(/^category:\s*(\S+)/m)?.[1];
      const updatedAtRaw = frontmatter.match(/^updatedAt:\s*(\S+)/m)?.[1];
      const updatedAt = updatedAtRaw ? new Date(updatedAtRaw).toISOString() : undefined;

      entries.push({ country: country.name, category, slug: file.replace(/\.mdx$/, ''), updatedAt });
    }
  }

  const dated = entries.map((e) => e.updatedAt).filter(Boolean).sort();
  const siteLastmod = dated.at(-1) ?? new Date().toISOString();
  const latestOf = (matches) => matches.map((e) => e.updatedAt).filter(Boolean).sort().at(-1) ?? siteLastmod;

  const lastmodByPath = new Map();
  lastmodByPath.set('/', siteLastmod);
  lastmodByPath.set('/search/', siteLastmod);

  for (const e of entries) {
    lastmodByPath.set(`/etiquette/${e.country}/${e.slug}/`, e.updatedAt ?? siteLastmod);
  }
  for (const category of new Set(entries.map((e) => e.category))) {
    lastmodByPath.set(`/category/${category}/`, latestOf(entries.filter((e) => e.category === category)));
  }
  for (const country of new Set(entries.map((e) => e.country))) {
    lastmodByPath.set(`/country/${country}/`, latestOf(entries.filter((e) => e.country === country)));
  }

  return { lastmodByPath, siteLastmod };
}

const { lastmodByPath, siteLastmod } = readEtiquetteLastmods();

// https://astro.build/config
export default defineConfig({
  site: 'https://etiquetteness.com',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({
      serialize(item) {
        const lastmod = lastmodByPath.get(new URL(item.url).pathname) ?? siteLastmod;
        return { ...item, lastmod };
      }
    }),
    mdx(),
    react()
  ]
});