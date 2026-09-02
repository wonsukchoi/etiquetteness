# Etiquetteness

The etiquette nobody writes down: unwritten cultural and social rules, by country and situation. Built with [Astro](https://astro.build), Tailwind CSS, and MDX content collections.

58 entries across 13 countries (China, France, Germany, Guam, India, Italy, Japan, Korea, Mexico, Philippines, Saudi Arabia, Thailand, UK) plus a global category, spanning 6 rule categories (dining, business, social, travel, gifts, home).

## Structure

```
src/content/etiquette/<country>/<slug>.mdx   # one file per rule
src/content.config.ts                        # content schema
src/pages/                                   # home, /etiquette/[slug], /country/[x], /category/[x], /search
```

## Commands

| Command           | Action                                                    |
| :----------------- | :--------------------------------------------------------- |
| `npm run dev`       | Start local dev server at `localhost:4321`                 |
| `npm run build`     | Build production site to `./dist/`, then index it with Pagefind for `/search` |
| `npm run preview`   | Preview the production build locally                       |

## Adding content

Drop a new `.mdx` file under `src/content/etiquette/<country>/` following the frontmatter schema in `src/content.config.ts`. Pages for the entry, its country, and its category are generated automatically.

Before adding a new entry, check whether an existing entry in another country already covers the same underlying custom (e.g. chopstick taboos) — if the reasoning is genuinely different per country, add it as its own entry; if it's a near-duplicate, fold it into the existing entry as a bullet instead.

## Deploy

`main` and `production` are both live branches. `production` auto-deploys to etiquetteness.com via Cloudflare Workers Builds on push — treat pushing to it as a real deploy, not a routine git operation.
