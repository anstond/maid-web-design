# Instant Quote Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage hero direct high-intent residents to the existing instant quote calculator with a clear, consistent conversion path.

**Architecture:** Keep `src/app/page.tsx` as the server-rendered homepage and retain the existing image asset and `QuoteGenerator` client component. Change only the navigation and hero markup/content; use a native Node test that checks the rendered source contract for the quote target and labels, avoiding new dependencies.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind utility classes, inline React styles, Node.js built-in test runner.

---

## File structure

- `src/app/page.tsx` — homepage navigation and hero conversion presentation.
- `tests/homepage-quote-cta.test.mjs` — static contract regression test for the hero and navigation quote paths.
- `package.json` — exposes the native Node test command as `npm test`.

### Task 1: Add the quote-conversion regression test

**Files:**
- Create: `tests/homepage-quote-cta.test.mjs`
- Modify: `package.json:5-10`

- [ ] **Step 1: Write the failing test**

Create `tests/homepage-quote-cta.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");

test("homepage quote CTAs lead to the live quote generator", () => {
  assert.match(pageSource, /href="#quote-generator"[\\s\\S]{0,700}>[\\s\\S]{0,250}Get a quote/);
  assert.match(pageSource, /href="#quote-generator"[\\s\\S]{0,700}>[\\s\\S]{0,250}Get my instant quote/);
  assert.match(pageSource, /<QuoteGenerator \/>/);
});
```

Add this script under `scripts` in `package.json`:

```json
"test": "node --test tests/**/*.test.mjs"
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`

Expected: FAIL because the current navigation label is `Contact Us` and the hero label is `Book a Cleaning`.

### Task 2: Implement the instant-quote navigation and hero

**Files:**
- Modify: `src/app/page.tsx:5-12`
- Modify: `src/app/page.tsx:238-260`
- Modify: `src/app/page.tsx:270-409`

- [ ] **Step 1: Replace the ambiguous navigation action**

Change the navigation’s final link from `href="#"` / `Contact Us` to the existing quote destination and label:

```tsx
<a href="#quote-generator" style={{
  background: T.primary,
  color: T.onPrimary,
  fontSize: 14,
  fontWeight: 600,
  padding: "9px 20px",
  borderRadius: 999,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
}}>
  Get a quote
  <ArrowUpRight size={13} strokeWidth={2.5} />
</a>
```

- [ ] **Step 2: Replace generic hero copy with the quote proposition**

Keep the section, image, and left-to-right canvas blend. Replace the current heading and description with:

```tsx
<h1 style={{
  fontSize: "clamp(40px, 5.2vw, 68px)",
  fontWeight: 700,
  lineHeight: "1.05",
  letterSpacing: "-0.04em",
  color: T.ink,
  margin: "0 0 20px",
}}>
  A spotless home<br />
  starts with a{" "}
  <em style={{ fontStyle: "italic", color: T.primary, fontWeight: 700 }}>
    clear price.
  </em>
</h1>
<p style={{
  fontSize: 17,
  lineHeight: "27px",
  color: T.body,
  margin: "0 0 32px",
  maxWidth: 480,
}}>
  Choose your service and get a tailored quote in under a minute.
</p>
```

- [ ] **Step 3: Replace the feature checklist with conversion-led actions and proof**

Remove the three-item checklist. Add a primary CTA, a secondary `#how-it-works` link, and a concise proof row:

```tsx
<div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
  <a href="#quote-generator" className="shadow-sm hover:opacity-90 active:scale-[0.98] transition-all" style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: T.primary,
    color: T.onPrimary,
    fontSize: 15,
    fontWeight: 600,
    padding: "14px 24px",
    borderRadius: 999,
    textDecoration: "none",
  }}>
    Get my instant quote
    <ArrowRight size={16} strokeWidth={2.5} />
  </a>
  <a href="#how-it-works" className="group" style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 15,
    fontWeight: 600,
    color: T.primary,
    textDecoration: "none",
  }}>
    How it works
    <ArrowRight size={15} strokeWidth={2.5} />
  </a>
</div>
<div style={{ marginTop: 28, fontSize: 13, color: T.body }}>
  <span style={{ color: "#B7791F", fontWeight: 700 }}>4.9★</span> from 4,849 residents
  <span style={{ color: T.border, padding: "0 8px" }}>·</span>
  Background-checked professionals
</div>
```

- [ ] **Step 4: Add the photo overlay and process anchor**

Add a desktop-only, dark-teal overlay panel inside the hero’s image wrapper, below the existing gradient layers:

```tsx
<div className="hidden lg:block" style={{
  position: "absolute",
  right: 48,
  bottom: 48,
  width: 238,
  padding: "18px 20px",
  borderRadius: 16,
  background: "rgba(21, 94, 99, 0.94)",
  color: T.onPrimary,
  boxShadow: "0 16px 40px rgba(21, 94, 99, 0.28)",
}}>
  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Your quote, in under a minute</div>
  <div style={{ fontSize: 12, lineHeight: "18px", color: "rgba(255,255,255,0.78)" }}>
    Clear, tailored pricing. No account required.
  </div>
</div>
```

Add `id="how-it-works"` to the process section currently headed `How It Works`.

- [ ] **Step 5: Run the focused test to verify it passes**

Run: `npm test`

Expected: PASS with one passing test named `homepage quote CTAs lead to the live quote generator`.

### Task 3: Verify rendered-code quality and commit

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `tests/homepage-quote-cta.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Run the full validation suite**

Run: `npm test && npm run lint && npm run build`

Expected: each command exits with status `0`; the production build includes the `/` route without errors.

- [ ] **Step 2: Review conversion and responsive constraints**

Confirm from the hero source that:

```text
- Both primary quote actions point to #quote-generator.
- The second hero action points to #how-it-works.
- The overlay is hidden below the lg breakpoint.
- The hero heading is two lines on desktop and the body is 13 words.
- The navigation action uses the same quote destination and label family.
```

- [ ] **Step 3: Commit the implementation**

Run:

```bash
git add src/app/page.tsx tests/homepage-quote-cta.test.mjs package.json
git commit -m "feat: optimize hero for instant quotes"
```
