import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const navSource = await readFile(new URL("../src/components/Navigation.tsx", import.meta.url), "utf8");
const designSource = await readFile(new URL("../DESIGN.md", import.meta.url), "utf8");

test("navigation renders signed-in profile controls on desktop and mobile", () => {
  assert.match(navSource, /accountProfile/);
  assert.match(navSource, /profileMenuOpen/);
  assert.match(navSource, /aria-label="Open account menu"/);
  assert.match(navSource, /aria-label="Signed-in account"/);
  assert.match(navSource, /Mobile profile summary/);
});

test("navigation exposes logout as a separated account action", () => {
  assert.match(navSource, /handleLogout/);
  assert.match(navSource, /Log out/);
  assert.match(navSource, /LogOut/);
});

test("design ledger documents the navigation profile menu pattern", () => {
  assert.match(designSource, /navigation-profile-menu/);
  assert.match(designSource, /logout/i);
});
