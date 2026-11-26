/**
 * Run: npx tsx --test tests/country-back-to-contents.test.ts
 *
 * Country pages are 12,000-23,000px tall on a phone (Japan: 16 rules, 22,679px) and the header is
 * not sticky, so each rule section ends with a "Back to contents" link to the Contents block at the
 * top (2026-11-20 /mobbin pass). Source-level check: the link target must still exist, and the link
 * must stay inside the per-rule loop and out of the search index.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const page = readFileSync("src/pages/country/[country].astro", "utf8");

describe("country page back-to-contents link", () => {
  it("points at an id that exists on the Contents heading", () => {
    assert.match(page, /href="#contents-heading"/);
    assert.match(page, /<h2 id="contents-heading"/);
  });

  it("sits inside the per-rule section, after the source line", () => {
    const rulesStart = page.indexOf("rules.map(");
    const link = page.indexOf('href="#contents-heading"');
    const sectionEnd = page.indexOf("</section>", link);
    assert.ok(rulesStart > 0 && link > rulesStart, "link is inside rules.map");
    assert.ok(sectionEnd > link, "link is before the rule section closes");
    assert.ok(link > page.indexOf("Source:", rulesStart), "link comes after the Source line");
  });

  it("is a 44px tap target kept out of the search index", () => {
    const tag = page.slice(page.lastIndexOf("<a", page.indexOf('href="#contents-heading"')), page.indexOf("Back to contents"));
    assert.match(tag, /min-h-11/);
    assert.match(tag, /data-pagefind-ignore/);
  });
});
