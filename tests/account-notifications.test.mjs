import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const accountShellSource = await readFile(new URL("../src/components/account/AccountShell.tsx", import.meta.url), "utf8");
const mockDataSource = await readFile(new URL("../src/lib/mock-account-data.ts", import.meta.url), "utf8");
const homePageSource = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const bookingsPageSource = await readFile(new URL("../src/app/account/bookings/page.tsx", import.meta.url), "utf8");
const subscriptionsPageSource = await readFile(new URL("../src/app/account/subscriptions/page.tsx", import.meta.url), "utf8");
const bookingDetailSource = await readFile(new URL("../src/app/account/bookings/[id]/page.tsx", import.meta.url), "utf8");

test("account shell exposes a transactional notification bell with unread state", async () => {
  const bellSource = await readFile(new URL("../src/components/account/NotificationBell.tsx", import.meta.url), "utf8");

  assert.match(accountShellSource, /NotificationBell/);
  assert.match(bellSource, /aria-label="Open notifications"/);
  assert.match(bellSource, /Notifications/);
  assert.match(bellSource, /Mark all read/);
  assert.match(bellSource, /No notifications yet/);
  assert.match(bellSource, /aria-live="polite"/);
  assert.match(bellSource, /accountNotifications/);
});

test("notification data is transactional first and offers-ready", () => {
  assert.match(mockDataSource, /AccountNotification/);
  assert.match(mockDataSource, /category: "updates"/);
  assert.match(mockDataSource, /booking_confirmed|cleaner_assigned|visit_reminder|payment_failed|reschedule_required/);
  assert.doesNotMatch(mockDataSource, /category: "offers"/);
});

test("public marketing page does not render personal notifications", () => {
  assert.doesNotMatch(homePageSource, /NotificationBell/);
  assert.doesNotMatch(homePageSource, /accountNotifications/);
});

test("account alerts use the shared inline notification card", async () => {
  const inlineCardSource = await readFile(new URL("../src/components/account/InlineNotificationCard.tsx", import.meta.url), "utf8");

  assert.match(inlineCardSource, /InlineNotificationCard/);
  assert.match(inlineCardSource, /role="status"/);
  assert.match(inlineCardSource, /min-h-11/);
  assert.match(bookingsPageSource, /InlineNotificationCard/);
  assert.match(subscriptionsPageSource, /InlineNotificationCard/);
  assert.match(bookingDetailSource, /InlineNotificationCard/);
});
