// Generates one Open Graph share image (1200x630) per country page at build
// time: the page heading, its rule count and its biggest categories. Rules have
// no pages of their own, so there are no per-rule images.
// Output goes to public/og/country/<country>.png, which astro build then
// copies as a normal static asset — no runtime image generation, no
// server route, consistent with the rest of this site being fully static.
import { readFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import * as yaml from 'js-yaml';
import { CATEGORIES, CATEGORY_META, type Category } from '../src/lib/categories.ts';
import { countryHeading } from '../src/lib/countries.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const contentDir = path.join(root, 'src/content/etiquette');
const outDir = path.join(root, 'public/og/country');
const fontsDir = path.join(root, 'scripts/og-fonts');

const fonts = {
  interRegular: readFileSync(path.join(fontsDir, 'Inter-Regular.ttf')),
  interSemiBold: readFileSync(path.join(fontsDir, 'Inter-SemiBold.ttf')),
  frauncesSemiBold: readFileSync(path.join(fontsDir, 'Fraunces-SemiBold.ttf')),
  frauncesBold: readFileSync(path.join(fontsDir, 'Fraunces-Bold.ttf')),
};

interface EntryMeta {
  country: string;
  category: Category;
}

interface CountryCard {
  country: string;
  heading: string;
  ruleCount: number;
  topCategories: Category[];
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
      entries.push({ country: String(data.country), category: data.category as Category });
    }
  }
  return entries;
}

function countryCards(entries: EntryMeta[]): CountryCard[] {
  const countries = [...new Set(entries.map((e) => e.country))].sort();
  return countries.map((country) => {
    const rules = entries.filter((e) => e.country === country);
    const count = (c: Category) => rules.filter((e) => e.category === c).length;
    const topCategories = CATEGORIES.filter((c) => count(c) > 0)
      .sort((a, b) => count(b) - count(a) || CATEGORIES.indexOf(a) - CATEGORIES.indexOf(b))
      .slice(0, 3);
    return { country, heading: countryHeading(country), ruleCount: rules.length, topCategories };
  });
}

function titleFontSize(title: string): number {
  if (title.length <= 20) return 88;
  if (title.length <= 28) return 72;
  return 60;
}

function buildTree(card: CountryCard) {
  return {
    type: 'div',
    props: {
      style: {
        width: 1200,
        height: 630,
        // satori 0.63 sizes boxes content-box like CSS does: without this the
        // 72px/64px padding grows the card past 1200x630 and the footer row
        // falls off the image.
        boxSizing: 'border-box',
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
                  children: `${card.ruleCount} unwritten rule${card.ruleCount === 1 ? '' : 's'}`,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    marginTop: 20,
                    fontSize: titleFontSize(card.heading),
                    lineHeight: 1.15,
                    fontFamily: 'Fraunces',
                    fontWeight: 700,
                    color: '#1c1917',
                    maxWidth: 1000,
                  },
                  children: card.heading,
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
                  style: { display: 'flex', alignItems: 'center', gap: 12 },
                  children: card.topCategories.map((category) => ({
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 16px',
                        borderRadius: 999,
                        border: '2px solid #e7e5e4',
                        color: '#57534e',
                      },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: { display: 'flex', width: 10, height: 10, borderRadius: 999, background: CATEGORY_META[category].color },
                          },
                        },
                        { type: 'div', props: { children: CATEGORY_META[category].label } },
                      ],
                    },
                  })),
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
  const cards = countryCards(readEntries());
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  for (const card of cards) {
    const svg = await satori(buildTree(card) as any, {
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

    const outPath = path.join(outDir, `${card.country}.png`);
    await import('node:fs/promises').then((fs) => fs.writeFile(outPath, png));
  }

  console.log(`Generated ${cards.length} country OG images in public/og/country/`);
}

main();
