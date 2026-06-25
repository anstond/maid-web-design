import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const profileSource = await readFile(new URL("../src/app/account/profile/page.tsx", import.meta.url), "utf8");

test("profile page uses mobile sheet actions instead of inline fixed modal overlays", () => {
  assert.match(profileSource, /AccountActionSheet/);
  assert.doesNotMatch(profileSource, /position:\s*['"]fixed['"]/);
  assert.doesNotMatch(profileSource, /show[A-Za-z]+Modal/);
});

test("payment method action row stacks cleanly on mobile", () => {
  assert.match(profileSource, /flex-col[\s\S]{0,120}sm:flex-row/);
  assert.match(profileSource, /w-full[\s\S]{0,120}sm:w-auto/);
});
