# Etiquetteness

The etiquette nobody writes down: unwritten cultural and social rules, by country and situation. Built with [Astro](https://astro.build), Tailwind CSS, and MDX content collections.

## Structure

```
src/content/etiquette/<country>/<slug>.mdx   # one file per rule
src/content.config.ts                        # content schema
src/pages/                                   # home, /etiquette/[slug], /country/[x], /category/[x]
```

## Commands

| Command           | Action                                      |
| :----------------- | :------------------------------------------ |
| `npm run dev`       | Start local dev server at `localhost:4321`  |
| `npm run build`     | Build production site to `./dist/`          |
| `npm run preview`   | Preview the production build locally        |

## Adding content

Drop a new `.mdx` file under `src/content/etiquette/<country>/` following the frontmatter schema in `src/content.config.ts`. Pages for the entry, its country, and its category are generated automatically.
