import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const bookingSource = await readFile(new URL("../src/app/booking/page.tsx", import.meta.url), "utf8");

test("booking scope step surfaces add-ons before continue and nudges zero-addon users", () => {
  assert.match(bookingSource, /POPULAR_ADDON_IDS/);
  assert.match(bookingSource, /Popular add-ons/);
  assert.match(bookingSource, /View all extras/);
  assert.match(bookingSource, /Want to add common extras\?/);
  assert.match(bookingSource, /Skip extras/);
});
