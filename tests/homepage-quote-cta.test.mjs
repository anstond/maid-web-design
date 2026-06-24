import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const navSource = pageSource.slice(
  pageSource.indexOf("{/* ── Navigation"),
  pageSource.indexOf("{/* ── Hero"),
);
const heroSource = pageSource.slice(
  pageSource.indexOf("{/* ── Hero"),
  pageSource.indexOf("{/* ── Partner"),
);

test("homepage quote CTAs lead to the live quote generator", () => {
  assert.match(navSource, /href="#quote-generator"[\s\S]{0,700}>[\s\S]{0,250}Get a quote/);
  assert.match(heroSource, /href="#quote-generator"[\s\S]{0,700}>[\s\S]{0,250}Get my instant quote/);
  assert.match(pageSource, /<QuoteGenerator \/>/);
});
