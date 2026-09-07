// Generates a per-entry Open Graph share image (1200x630) at build time.
// Output goes to public/og/<country>/<slug>.png, which astro build then
// copies as a normal static asset — no runtime image generation, no
// server route, consistent with the rest of this site being fully static.
import { readFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import * as yaml from 'js-yaml';
import { CATEGORY_META, type Category } from '../src/lib/categories.ts';
import { COUNTRY_META, type Country } from '../src/lib/countries.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const contentDir = path.join(root, 'src/content/etiquette');
const outDir = path.join(root, 'public/og');
const fontsDir = path.join(root, 'scripts/og-fonts');

const fonts = {
  interRegular: readFileSync(path.join(fontsDir, 'Inter-Regular.ttf')),
  interSemiBold: readFileSync(path.join(fontsDir, 'Inter-SemiBold.ttf')),
  frauncesSemiBold: readFileSync(path.join(fontsDir, 'Fraunces-SemiBold.ttf')),
  frauncesBold: readFileSync(path.join(fontsDir, 'Fraunces-Bold.ttf')),
};

interface EntryMeta {
  country: string;
  slug: string;
  title: string;
  category: Category;
  severity: string;
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
        category: data.category as Category,
        severity: String(data.severity),
      });
    }
  }
  return entries;
}

function titleFontSize(title: string): number {
  if (title.length <= 28) return 68;
  if (title.length <= 44) return 56;
  if (title.length <= 60) return 48;
  return 40;
}

function buildTree(entry: EntryMeta) {
  const meta = CATEGORY_META[entry.category];
  const countryLabel = COUNTRY_META[entry.country as Country]?.label ?? entry.country.replace(/-/g, ' ');

  return {
    type: 'div',
    props: {
      style: {
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        background: '#fbf9f6',
        fontFamily: 'Inter',
      },
      children: [
        // Brand row
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column' },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 15,
                    fontFamily: 'Inter',
                    fontWeight: 600,
                    letterSpacing: 4,
                    textTransform: 'uppercase',
                    color: '#a8a29e',
                  },
                  children: 'Culture & Custom',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    marginTop: 4,
                    fontSize: 30,
                    fontFamily: 'Fraunces',
                    fontWeight: 700,
                    color: '#1c1917',
                  },
                  children: 'Etiquetteness',
                },
              },
            ],
          },
        },
        // Title block
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column' },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 20,
                    fontFamily: 'Inter',
                    fontWeight: 600,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    color: '#78716c',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          background: meta.color,
                        },
                      },
                    },
                    { type: 'div', props: { children: `${meta.label} · ${countryLabel}` } },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    marginTop: 20,
                    fontSize: titleFontSize(entry.title),
                    lineHeight: 1.15,
                    fontFamily: 'Fraunces',
                    fontWeight: 700,
                    color: '#1c1917',
                    maxWidth: 1000,
                  },
                  children: entry.title,
                },
              },
            ],
          },
        },
        // Footer row
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 18,
              fontFamily: 'Inter',
              fontWeight: 600,
              color: '#a8a29e',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 16px',
                    borderRadius: 999,
                    border: '2px solid #e7e5e4',
                    textTransform: 'capitalize',
                    color: '#57534e',
                  },
                  children: entry.severity,
                },
              },
              { type: 'div', props: { children: 'etiquetteness.com' } },
            ],
          },
        },
      ],
    },
  };
}

async function main() {
  const entries = readEntries();
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  for (const entry of entries) {
    const svg = await satori(buildTree(entry) as any, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: fonts.interRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: fonts.interSemiBold, weight: 600, style: 'normal' },
        { name: 'Fraunces', data: fonts.frauncesSemiBold, weight: 600, style: 'normal' },
        { name: 'Fraunces', data: fonts.frauncesBold, weight: 700, style: 'normal' },
      ],
    });

    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
    const png = resvg.render().asPng();

    const dir = path.join(outDir, entry.country);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const outPath = path.join(dir, `${entry.slug}.png`);
    await import('node:fs/promises').then((fs) => fs.writeFile(outPath, png));
  }

  console.log(`Generated ${entries.length} OG images in public/og/`);
}

main();
