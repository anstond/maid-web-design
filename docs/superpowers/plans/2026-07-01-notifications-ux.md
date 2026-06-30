# Notifications UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add transactional account notifications with a bell dropdown and contextual inline cards.

**Architecture:** Keep notification data normalized in `src/lib/mock-account-data.ts`, render the persistent bell through a focused account component, and reuse one inline notification card for account pages that need action-oriented alerts. Do not add notification UI to public marketing pages.

**Tech Stack:** Next.js App Router, React client components, Tailwind CSS v4 tokens, lucide-react icons, Node test runner.

---

### Task 1: Notification Data And Bell

**Files:**
- Modify: `tests/account-notifications.test.mjs`
- Modify: `src/lib/mock-account-data.ts`
- Create: `src/components/account/NotificationBell.tsx`
- Modify: `src/components/account/AccountShell.tsx`

- [ ] Write a failing test that verifies transactional notification data, the bell trigger, dropdown labels, unread badge, and no marketing-page bell.
- [ ] Run `npm test tests/account-notifications.test.mjs` and confirm it fails because the feature is missing.
- [ ] Add `AccountNotification` types and `accountNotifications` mock data.
- [ ] Create `NotificationBell` as a client component with local open/read state.
- [ ] Render `NotificationBell` in `AccountShell` desktop and mobile action areas.
- [ ] Run the focused test and confirm it passes.

### Task 2: Contextual Inline Cards

**Files:**
- Modify: `tests/account-notifications.test.mjs`
- Create: `src/components/account/InlineNotificationCard.tsx`
- Modify: `src/app/account/bookings/page.tsx`
- Modify: `src/app/account/subscriptions/page.tsx`
- Modify: `src/app/account/bookings/[id]/page.tsx`

- [ ] Add a failing test that verifies inline cards are used for account alerts.
- [ ] Run `npm test tests/account-notifications.test.mjs` and confirm it fails because the component is missing.
- [ ] Create `InlineNotificationCard`.
- [ ] Replace the ad hoc bookings attention banner with `InlineNotificationCard`.
- [ ] Replace the subscription payment issue banner with `InlineNotificationCard`.
- [ ] Replace the booking detail action-needed card with `InlineNotificationCard`.
- [ ] Run the focused test and confirm it passes.

### Task 3: Verification

**Files:**
- Verify: `src/components/account/NotificationBell.tsx`
- Verify: `src/components/account/InlineNotificationCard.tsx`
- Verify: `src/components/account/AccountShell.tsx`

- [ ] Run `npm test`.
- [ ] Run `npm run lint`.
- [ ] Confirm `DESIGN.md` has no diff.
