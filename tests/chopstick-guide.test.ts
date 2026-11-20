/**
 * Run: npx tsx --test tests/chopstick-guide.test.ts
 *
 * The chopstick guide (2026-11-20) restates four rules that live on the country pages and links to each by its
 * anchor. A renamed or deleted rule file would leave a dead anchor, so this pins that every rule the guide
 * links to still exists, that its metadata fits the SERP budget, and that the pages that should link to it do.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { GUIDES, guidePath, guidesForCategory, guidesForCountry } from "../src/lib/guides";
import { toMetaDesc } from "../src/lib/seo";

const guide = GUIDES.find((g) => g.slug === "chopstick-etiquette")!;
const page = readFileSync("src/pages/guide/chopstick-etiquette.astro", "utf8");

const RULES = [
  ["japan", "dining-chopstick-rules"],
  ["vietnam", "dining-no-chopsticks-upright"],
  ["korea", "dining-rice-left-of-soup"],
  ["thailand", "dining-spoon-and-fork"],
] as const;

describe("chopstick guide", () => {
  it("links to rule files that exist", () => {
    for (const [country, slug] of RULES) {
      assert.ok(existsSync(`src/content/etiquette/${country}/${slug}.mdx`), `${country}/${slug}`);
      assert.ok(page.includes(`rulePath('${country}', '${slug}')`), `page links ${country}/${slug}`);
    }
  });

  it("has a title and description that are not cut off", () => {
    assert.ok(`${guide.seoTitle} · Etiquetteness`.length <= 65, "title");
    assert.ok(guide.description.length <= 155, `description is ${guide.description.length}`);
    assert.equal(toMetaDesc(guide.description), guide.description);
  });

  it("is linked from the countries and the category it covers", () => {
    for (const [country] of RULES) assert.deepEqual(guidesForCountry(country).map((g) => g.slug), ["chopstick-etiquette"]);
    assert.deepEqual(guidesForCategory("dining").map((g) => g.slug), ["chopstick-etiquette"]);
    assert.equal(guidePath(guide.slug), "/guide/chopstick-etiquette/");
  });

  it("keeps the sitemap lastmod in step with the guide date", () => {
    const config = readFileSync("astro.config.mjs", "utf8");
    assert.ok(config.includes(`'${guidePath(guide.slug)}', new Date('${guide.updatedAt}')`));
  });

  it("states no figures or prices (every statement restates a source rule)", () => {
    assert.doesNotMatch(page, /\$\s?\d|\d+\s?%/);
  });
});
