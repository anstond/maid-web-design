import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const navSource = await readFile(new URL("../src/components/Navigation.tsx", import.meta.url), "utf8");

test("homepage quote CTAs lead to the live quote generator", () => {
  // Navigation CTA leads to /booking
  assert.match(navSource, /href="\/booking"/);
  
  // Page has a CTA leading to #quote-generator or booking
  assert.match(pageSource, /href="#quote-generator"/);
  assert.match(pageSource, /<QuoteGenerator \/>/);
});
