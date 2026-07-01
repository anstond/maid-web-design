import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const helperSource = await readFile(new URL("../src/lib/intercom-conversion.ts", import.meta.url), "utf8").catch(() => "");
const providerSource = await readFile(new URL("../src/components/IntercomProvider.tsx", import.meta.url), "utf8");
const homeSource = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const quoteSource = await readFile(new URL("../src/components/QuoteGenerator.tsx", import.meta.url), "utf8");
const bookingSource = await readFile(new URL("../src/app/booking/page.tsx", import.meta.url), "utf8");
const checkoutSource = await readFile(new URL("../src/app/booking/checkout/page.tsx", import.meta.url), "utf8");
const layoutSource = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
const designSource = await readFile(new URL("../DESIGN.md", import.meta.url), "utf8");

test("Intercom conversion helper exposes typed context, tracking, and composer functions", () => {
  assert.match(helperSource, /export type IntercomConversionEventName/);
  assert.match(helperSource, /quote_started/);
  assert.match(helperSource, /quote_completed/);
  assert.match(helperSource, /booking_started/);
  assert.match(helperSource, /booking_step_viewed/);
  assert.match(helperSource, /booking_step_idle/);
  assert.match(helperSource, /chat_prompt_shown/);
  assert.match(helperSource, /chat_prompt_clicked/);
  assert.match(helperSource, /checkout_started/);
  assert.match(helperSource, /export function trackIntercomEvent/);
  assert.match(helperSource, /export function openIntercomComposer/);
  assert.match(helperSource, /export function setIntercomContext/);
});

test("Intercom remains isolated in the root client provider", () => {
  assert.match(layoutSource, /<IntercomProvider \/>/);
  assert.match(providerSource, /"use client"/);
  assert.match(providerSource, /trackEvent/);
  assert.match(providerSource, /showNewMessage/);
  assert.match(providerSource, /getRouteFunnelStage/);
  assert.match(providerSource, /if \(pathname === "\/"\) return "homepage_hero"/);
  assert.match(providerSource, /hide_default_launcher: false/);
  assert.match(providerSource, /hide_notifications: true/);
});

test("homepage quote and pricing surfaces track intent and offer user-triggered chat", () => {
  assert.match(homeSource, /trackIntercomEvent\("quote_started"/);
  assert.match(homeSource, /setIntercomContext\(\{[\s\S]*funnelStage: "homepage_hero"/);
  assert.match(homeSource, /openIntercomComposer\("Hi, I need help choosing the right cleaning service\."/);
  assert.match(quoteSource, /trackIntercomEvent\("quote_completed"/);
  assert.match(quoteSource, /setIntercomContext\(\{[\s\S]*funnelStage: "quote"/);
  assert.match(quoteSource, /openIntercomComposer\("Hi, can you help me understand this cleaning quote before I book\?"/);
});

test("homepage contextual prompts are delayed without mobile scroll idle resets", () => {
  assert.match(providerSource, /CONTEXTUAL_NUDGE_DELAY_MS = 30_000/);
  assert.match(providerSource, /function shouldResetNudgeOnActivity\(pathname: string\)/);
  assert.match(providerSource, /return pathname === "\/booking"/);
  assert.match(providerSource, /const isIdleNudge = shouldResetNudgeOnActivity\(pathname\)/);
  assert.match(providerSource, /if \(isIdleNudge\) \{[\s\S]*window\.addEventListener\("scroll", scheduleNudge/);
});

test("booking prompts are step-aware, session-capped, and explicitly dismissed", () => {
  assert.match(providerSource, /INTERCOM_PROMPT_STORAGE_PREFIX/);
  assert.match(providerSource, /booking_step_[\s\S]*quote_[\s\S]*services/);
  assert.match(providerSource, /getBookingPromptCopy/);
  assert.match(providerSource, /Ask about address and availability/);
  assert.match(providerSource, /Ask about timing/);
  assert.match(providerSource, /Ask about supplies or access/);
  assert.match(providerSource, /Ask before review/);
  assert.match(providerSource, /aria-label="Dismiss conversion help prompt"/);
  assert.match(bookingSource, /trackIntercomEvent\("booking_started"/);
  assert.match(bookingSource, /trackIntercomEvent\("booking_step_viewed"/);
  assert.match(bookingSource, /setIntercomContext\(\{[\s\S]*bookingStep:/);
});

test("checkout tracks entry but does not run proactive conversion prompts", () => {
  assert.match(checkoutSource, /trackIntercomEvent\("checkout_started"/);
  assert.match(checkoutSource, /Questions before paying\?/);
  assert.match(checkoutSource, /openIntercomComposer\("Hi, I have a question before paying for my cleaning\."/);
  assert.doesNotMatch(checkoutSource, /chat_prompt_shown/);
  assert.doesNotMatch(checkoutSource, /INTERCOM_PROMPT_STORAGE_PREFIX/);
});

test("design ledger documents contextual assist conversion rules", () => {
  assert.match(designSource, /### Intercom Conversion Orchestration/);
  assert.match(designSource, /Contextual assist/);
  assert.match(designSource, /quote_started/);
  assert.match(designSource, /checkout_started/);
  assert.match(designSource, /Checkout must not show proactive popups/);
});
