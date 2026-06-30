# Notifications UX Design

## Decision

Build notifications as a transactional-first account feature. The first implementation should support service and account updates only, while keeping the naming and structure ready for a future `Offers` category.

Do not add a personal notification bell to public marketing pages. Public pages may use site-wide announcement banners for broad service messages, but personal notifications belong behind login.

## Goals

- Help customers notice service updates that affect a booking, subscription, payment, or upcoming visit.
- Keep the account shell calm and service-focused.
- Avoid turning the notification bell into a promotional channel.
- Leave room for marketing offers later without mixing them into the primary transactional stream.

## Non-Goals

- No full-screen notification inbox in the initial release.
- No marketing or promotional notifications in the initial release.
- No blocking modal notifications.
- No notification UI on static marketing pages, except for public announcement banners.

## Placement

### Account Shell

Add a notification bell to the signed-in account top bar near the profile menu. The bell is the persistent entry point for recent notifications and unread count.

The bell trigger should use the existing `icon-button-circular` language:

- `canvas-soft` background.
- `ink` icon.
- Circular or pill hit area with at least 44 px touch target.
- Small unread badge only when unread items exist.

### Bell Dropdown

The first notification surface should be a compact dropdown card, not a full page.

Structure:

- Header: `Notifications`.
- Secondary action: `Mark all read`, shown only when unread items exist.
- Recent item list, newest first.
- Empty state: "No notifications yet."
- Footer link: `View all notifications`, reserved for when a full page exists.

The dropdown should cap list height and scroll internally only if needed. It should not cover the whole app.

### Contextual Inline Cards

High-priority transactional items should also appear where the user can act on them:

- Payment failed: subscription page and relevant booking detail.
- Cleaner assigned: booking detail.
- Upcoming visit reminder: bookings page and booking detail.
- Reschedule needed: booking detail and subscriptions page.

Inline cards should use `card-soft-tinted` or `card-content` styling, with the action beside or below the message depending on viewport width.

### Toasts

Use existing toast behavior only for immediate feedback after a user action:

- "Booking updated."
- "Payment method saved."
- "Notification marked as read."

Toasts should not be used for durable notifications that the customer needs to revisit.

## Notification Types

Initial transactional types:

- `booking_confirmed`
- `booking_updated`
- `booking_cancelled`
- `cleaner_assigned`
- `visit_reminder`
- `payment_failed`
- `payment_method_updated`
- `subscription_renewed`
- `subscription_paused`
- `reschedule_required`

Each notification should include:

- Stable id.
- Category: `updates` for transactional notifications.
- Severity: `info`, `success`, `warning`, or `error`.
- Title.
- Short message.
- Created timestamp.
- Read timestamp or null.
- Optional action label.
- Optional action href.
- Optional source entity type and id.

## Future Offers Support

When marketing notifications are added, add them as `offers`, not as regular updates.

Rules:

- Keep `Updates` first.
- Show `Offers` below updates in the dropdown.
- On a future full notification page, use tabs: `Updates` and `Offers`.
- Add notification preferences before enabling offers.
- Offers should be opt-in or clearly preference-controlled.
- Offers should never trigger warning/error visual treatments.

Marketing examples:

- Referral credit available.
- Seasonal discount.
- Add-on promotion.
- New service area.

Marketing page behavior should stay separate:

- Use a slim public announcement banner for broad messages.
- Do not show a personal bell, inbox, or notification dropdown on public pages.

## Visual Design

Follow `DESIGN.md` as the source of truth. This planning pass does not change `DESIGN.md`.

- Dropdown surface: `canvas`, `rounded.xl`, Level 2 card drop.
- Rows: 44 px minimum height, `body-sm` message, `body-sm-strong` title.
- Unread row: subtle `canvas-soft` background and stronger title weight.
- Read row: `canvas` background, secondary body text.
- Icon: use one consistent existing icon family. Do not hand-roll SVGs.
- Severity color: use semantic colors only when meaning is functional.
- Primary actions: pill buttons with `primary` fill.
- Secondary actions: text link or subtle pill.

## Interaction Rules

- Clicking a notification with an action href opens the related account page and marks the notification as read.
- `Mark all read` updates the dropdown in place.
- The unread badge disappears when no unread items remain.
- Keyboard users can tab through the trigger, dropdown actions, each notification row, and close the menu with Escape.
- Screen readers should receive `aria-live="polite"` announcements for newly added notifications when the user is inside the app.

## Empty, Loading, and Error States

Loading:

- Use skeleton rows that match notification row height and shape.

Empty:

- Title: "No notifications yet."
- Message: "Service updates will appear here."

Error:

- Inline dropdown message: "Notifications could not load."
- Action: `Retry`.

## Implementation Shape

Recommended components:

- `NotificationBell`
- `NotificationDropdown`
- `NotificationList`
- `NotificationRow`
- `InlineNotificationCard`

Recommended data boundary:

- Keep notification rendering components dumb.
- Pass normalized notification objects in from account data or API loaders.
- Keep read/unread mutation logic outside display components.

## Approval Status

Approved direction:

- Transactional-first.
- Account dashboard and account pages only.
- Bell dropdown plus contextual inline cards.
- Full notification page later if volume requires it.
- Future marketing support as a separate `Offers` category.
