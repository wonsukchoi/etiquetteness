// Generates public/_redirects at build time. Every rule used to have its own
// page at /etiquette/<country>/<slug>/; since 2026-11 each rule is a section
// of its country page, so each old URL (with and without the trailing slash,
// both of which earned impressions) 301s to /country/<country>/#<slug>.
//
// Workers static assets limits: 2,000 static rules, 1,000 characters a rule.
// Generated from the content folder so a new rule can't be left without one.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as yaml from 'js-yaml';
import { legacyRulePath, rulePath } from '../src/lib/rules.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const contentDir = path.join(root, 'src/content/etiquette');
const outPath = path.join(root, 'public/_redirects');

const MAX_STATIC_RULES = 2000;
const MAX_RULE_CHARS = 1000;

function main() {
  const lines = ['/sitemap.xml /sitemap-index.xml 200'];
  let entries = 0;

  for (const dir of readdirSync(contentDir).sort()) {
    const countryDir = path.join(contentDir, dir);
    if (!statSync(countryDir).isDirectory()) continue;

    for (const file of readdirSync(countryDir).sort()) {
      if (!file.endsWith('.mdx')) continue;
      if (!/^[a-z0-9-]+\.mdx$/.test(file)) throw new Error(`Unexpected rule file name: ${dir}/${file}`);
      const raw = readFileSync(path.join(countryDir, file), 'utf-8');
      const frontmatter = raw.match(/^---\n([\s\S]*?)\n---/)?.[1];
      if (!frontmatter) throw new Error(`No frontmatter in ${dir}/${file}`);
      const data = yaml.load(frontmatter) as Record<string, unknown>;

      // The old URL came from the file's path; the section lives on the page of
      // its `country` field (the country pages group by it).
      const slug = file.replace(/\.mdx$/, '');
      const from = legacyRulePath(dir, slug);
      const to = rulePath(String(data.country), slug);
      lines.push(`${from} ${to} 301`, `${from.replace(/\/$/, '')} ${to} 301`);
      entries += 1;
    }
  }

  const sources = lines.map((line) => line.split(' ')[0]);
  if (new Set(sources).size !== sources.length) throw new Error('Duplicate redirect source in _redirects');
  if (lines.length > MAX_STATIC_RULES) throw new Error(`${lines.length} redirect rules, over the ${MAX_STATIC_RULES} limit`);
  const tooLong = lines.find((line) => line.length > MAX_RULE_CHARS);
  if (tooLong) throw new Error(`Redirect rule over ${MAX_RULE_CHARS} chars: ${tooLong}`);

  writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf-8');
  console.log(`Generated public/_redirects: ${lines.length} lines (${entries} entries x 2 old URL forms + the sitemap alias)`);
}

main();
