// Generates /llms.txt at build time from the actual content collection, so
// it can't drift out of sync with the real category/country/entry list the
// way a hand-written static file would. Output goes to public/llms.txt,
// which astro build then copies as a normal static asset.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as yaml from 'js-yaml';
import { CATEGORIES, CATEGORY_META, type Category } from '../src/lib/categories.ts';
import { COUNTRIES, COUNTRY_META, type Country } from '../src/lib/countries.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const contentDir = path.join(root, 'src/content/etiquette');
const outPath = path.join(root, 'public/llms.txt');
const site = 'https://etiquetteness.com';

interface EntryMeta {
  country: string;
  slug: string;
  title: string;
  summary: string;
  category: Category;
}

function readEntries(): EntryMeta[] {
  const entries: EntryMeta[] = [];
  for (const country of readdirSync(contentDir)) {
    const countryDir = path.join(contentDir, country);
    if (!statSync(countryDir).isDirectory()) continue;

    for (const file of readdirSync(countryDir)) {
      if (!file.endsWith('.mdx')) continue;
      const raw = readFileSync(path.join(countryDir, file), 'utf-8');
      const match = raw.match(/^---\n([\s\S]*?)\n---/);
      if (!match) continue;

      const data = yaml.load(match[1]) as Record<string, unknown>;
      entries.push({
        country,
        slug: file.replace(/\.mdx$/, ''),
        title: String(data.title),
        summary: String(data.summary),
        category: data.category as Category,
      });
    }
  }
  return entries.sort((a, b) => a.title.localeCompare(b.title));
}

function main() {
  const entries = readEntries();
  const liveCountries = COUNTRIES.filter((c) => entries.some((e) => e.country === c));

  const lines: string[] = [];
  lines.push('# Etiquetteness');
  lines.push('');
  lines.push(
    '> The etiquette nobody writes down: unwritten cultural and social rules, by country and situation. Each entry is one sourced, specific custom — not general travel advice.'
  );
  lines.push('');
  lines.push(
    `Content (everything under /etiquette/, /country/, /category/) is licensed CC BY-NC 4.0 — reuse and citation with attribution is welcome for non-commercial purposes. Source code is MIT. Full terms and sourcing methodology: ${site}/about/`
  );
  lines.push('');

  lines.push('## Categories');
  for (const category of CATEGORIES) {
    const meta = CATEGORY_META[category];
    lines.push(`- [${meta.label}](${site}/category/${category}/): ${meta.description}`);
  }
  lines.push('');

  lines.push('## Countries');
  for (const country of liveCountries) {
    const meta = COUNTRY_META[country];
    const count = entries.filter((e) => e.country === country).length;
    lines.push(`- [${meta.label}](${site}/country/${country}/): ${count} rule${count === 1 ? '' : 's'}`);
  }
  lines.push('');

  lines.push('## All Entries');
  for (const entry of entries) {
    lines.push(`- [${entry.title}](${site}/etiquette/${entry.country}/${entry.slug}/): ${entry.summary}`);
  }
  lines.push('');

  writeFileSync(outPath, lines.join('\n'), 'utf-8');
  console.log(`Generated llms.txt with ${entries.length} entries in public/llms.txt`);
}

main();
