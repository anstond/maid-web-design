import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const articleSource = await readFile(new URL("../src/app/blog/[slug]/page.tsx", import.meta.url), "utf8");
const designSource = await readFile(new URL("../DESIGN.md", import.meta.url), "utf8");

test("single blog article route is statically generated and SEO-ready", () => {
  assert.match(articleSource, /export const dynamicParams = false/);
  assert.match(articleSource, /export function generateStaticParams/);
  assert.match(articleSource, /export async function generateMetadata/);
  assert.match(articleSource, /notFound\(\)/);
  assert.match(articleSource, /room-by-room-reset-for-a-calmer-home/);
  assert.doesNotMatch(articleSource, /"use client"/);
});

test("single blog article page follows the documented editorial pattern", () => {
  assert.match(articleSource, /<article/);
  assert.match(articleSource, /Table of contents/);
  assert.match(articleSource, /Book a home refresh/);
  assert.match(articleSource, /rounded-\[16px\]/);
  assert.match(articleSource, /rounded-full/);
});

test("design ledger documents the single blog article pattern", () => {
  assert.match(designSource, /Single blog article pattern/);
  assert.match(designSource, /narrow reading column/);
  assert.match(designSource, /desktop sidebar/);
});
