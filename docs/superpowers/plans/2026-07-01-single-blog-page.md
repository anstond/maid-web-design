# Single Blog Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a statically generated single blog article route for ApartmentMaid using the existing `DESIGN.md` editorial system.

**Architecture:** Create `src/app/blog/[slug]/page.tsx` as a Server Component with local typed article data, `generateStaticParams`, `dynamicParams = false`, and `generateMetadata`. Update `DESIGN.md` with the single-article editorial pattern so future blog detail pages stay consistent.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript, Tailwind CSS v4, `next/image`, `next/link`, `lucide-react`.

---

### Task 1: Add Article Route Contract Test

**Files:**
- Create: `tests/single-blog-page.test.mjs`

- [ ] **Step 1: Write the failing test**

Create a Node test that reads `src/app/blog/[slug]/page.tsx` and `DESIGN.md`, then asserts the new route remains static, SEO-ready, and documented.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/single-blog-page.test.mjs`
Expected: FAIL because `src/app/blog/[slug]/page.tsx` does not exist yet.

### Task 2: Implement Static Article Page

**Files:**
- Create: `src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Add typed article data**

Define one article with slug `room-by-room-reset-for-a-calmer-home`, metadata, hero image, table-of-contents items, article sections, checklist items, and related guide links.

- [ ] **Step 2: Add static route APIs**

Export `dynamicParams = false`, `generateStaticParams`, and `generateMetadata` using the local article dataset.

- [ ] **Step 3: Build semantic article markup**

Render `Navigation`, a breadcrumb, `<article>`, readable article body, desktop sidebar, checklist panel, inline booking CTA, related links, and footer booking CTA. Keep all interactive controls pill-shaped and all cards at 16 px radius.

### Task 3: Update Design Ledger

**Files:**
- Modify: `DESIGN.md`

- [ ] **Step 1: Document single blog article pattern**

Add a short `Single blog article pattern` note beside the existing Blog page pattern. Include canvas base, two-column hero, narrow reading column, desktop sidebar, deep-teal CTA, 16 px cards, and pill controls.

### Task 4: Verify

**Files:**
- Inspect: `src/app/blog/[slug]/page.tsx`
- Inspect: `DESIGN.md`

- [ ] **Step 1: Run focused test**

Run: `node --test tests/single-blog-page.test.mjs`
Expected: PASS.

- [ ] **Step 2: Run project checks**

Run: `npm test`
Expected: PASS.

Run: `npm run lint`
Expected: PASS or report existing lint issues if unrelated.

- [ ] **Step 3: Check diff scope**

Run: `git diff --check`
Expected: no whitespace errors.
