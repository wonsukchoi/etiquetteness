/**
 * Run: npx tsx --test tests/meta-descriptions.test.ts
 *
 * Country and category descriptions are one long narrative sentence, so toMetaDesc() could only cut them
 * at a word and end the meta tag with "..." (12 of the 26 sitemap pages, 2026-11-20). Those pages now carry
 * a written metaDescription; this test pins that every country and category page ends on a full stop or a
 * complete sentence, never an ellipsis.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { CATEGORY_META } from "../src/lib/categories";
import { COUNTRY_META } from "../src/lib/countries";
import { toMetaDesc } from "../src/lib/seo";

const pages = [
  ...Object.entries(COUNTRY_META).map(([slug, m]) => ({ slug: `country/${slug}`, text: m.metaDescription ?? m.description })),
  ...Object.entries(CATEGORY_META).map(([slug, m]) => ({ slug: `category/${slug}`, text: m.metaDescription ?? m.description })),
];

describe("page meta descriptions", () => {
  it("never end with an ellipsis after toMetaDesc()", () => {
    for (const p of pages) assert.doesNotMatch(toMetaDesc(p.text), /…$/, p.slug);
  });

  it("every written metaDescription fits the 155-character budget as is", () => {
    for (const [slug, m] of Object.entries(COUNTRY_META)) {
      if (m.metaDescription) assert.ok(m.metaDescription.length <= 155, `country/${slug} is ${m.metaDescription.length}`);
    }
    for (const [slug, m] of Object.entries(CATEGORY_META)) {
      if (m.metaDescription) assert.ok(m.metaDescription.length <= 155, `category/${slug} is ${m.metaDescription.length}`);
    }
  });
});
