import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const providerSource = await readFile(
  new URL("../src/components/IntercomProvider.tsx", import.meta.url),
  "utf8",
);
const designSource = await readFile(new URL("../DESIGN.md", import.meta.url), "utf8");

test("booking Intercom nudge is delayed, scoped, and opens a question composer", () => {
  assert.match(providerSource, /INTERCOM_PROMPT_STORAGE_PREFIX/);
  assert.match(providerSource, /BOOKING_NUDGE_IDLE_DELAY_MS = 45_000/);
  assert.match(providerSource, /pathname === "\/booking"/);
  assert.match(providerSource, /markPrompt\(prompt\.id, "shown"\)/);
  assert.match(providerSource, /showNewMessage\(activePrompt\.prefill\)/);
  assert.match(providerSource, /Need help choosing the right clean\?/);
  assert.match(providerSource, /aria-label="Dismiss conversion help prompt"/);
});

test("design ledger documents the booking help nudge behavior", () => {
  assert.match(designSource, /### Booking Help Nudge/);
  assert.match(designSource, /45 seconds/);
  assert.match(designSource, /session-capped/);
  assert.match(designSource, /Ask a question/);
});
