# Blog Index Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, search-friendly Blog index page and make the Blog link reachable from the existing primary navigation.

**Architecture:** Create one Server Component route at `src/app/blog/page.tsx`. It will own small local article datasets, static route metadata, and all page markup, keeping the page prerenderable and avoiding client JavaScript. Update only the explicit Blog navigation targets in the Home and Services page arrays.

**Tech Stack:** Next.js 16 App Router, React Server Components, TypeScript, Tailwind CSS v4 utilities, `next/image`, `next/link`, existing `lucide-react` icons.

---

### Task 1: Add the static Blog route

**Files:**
- Create: `src/app/blog/page.tsx`

- [ ] **Step 1: Create a Server Component with static metadata and locally typed content.**

  Export `metadata` with the title `Cleaning tips and home care guides | ApartmentMaid` and a description that identifies the page as practical cleaning guidance. Define `Article` with `title`, `excerpt`, `category`, `readTime`, `image`, and `alt`; add one featured article plus six grid articles. Keep all content deterministic and do not use `use client`, `useState`, request APIs, or time-dependent values so Next.js can prerender the route.

- [ ] **Step 2: Render the shared marketing-page structure.**

  Implement a semantic `header`, `main`, and `footer` with the same ApartmentMaid wordmark, primary navigation, and availability CTA used by current pages. Make Blog active and point it to `/blog`. Use the project’s existing CSS variables (`--background`, `--primary`, `--text-primary`, `--text-secondary`, `--border`) rather than adding raw palette tokens.

- [ ] **Step 3: Render the editorial content hierarchy.**

  Add a left-aligned intro, a featured `article` in a responsive two-column grid, presentational category chips, and six article cards in `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`. Use `Image` with explicit `width` and `height`, descriptive `alt` text, `sizes`, and `object-cover` so image boxes reserve their space. Use `Link` for every destination and arrow icon only as supporting affordance.

- [ ] **Step 4: Add the conversion section and responsive finishing.**

  Add a single teal `section` that sends the user to the availability CTA at `/#booking`. Ensure all primary interactive elements use pill radii and visible `focus-visible` outlines, desktop labels do not wrap, and cards preserve the 16px radius. The feature card stacks below the medium breakpoint and all sections use 16px minimum mobile gutters.

### Task 2: Make the Blog route reachable from existing navigation

**Files:**
- Modify: `src/app/page.tsx:247-252`
- Modify: `src/app/services/page.tsx:444-450`

- [ ] **Step 1: Update the Home navigation route.**

  Change the existing `Blog` navigation object’s `href` from `#` to `/blog`; retain its inactive visual state on Home.

- [ ] **Step 2: Update the Services navigation route.**

  Change the existing `Blog` navigation object’s `href` from `#` to `/blog`; retain its inactive visual state on Services. Do not alter unrelated uncommitted changes in this file.

### Task 3: Check page integrity

**Files:**
- Inspect: `src/app/blog/page.tsx`
- Inspect: `src/app/page.tsx`
- Inspect: `src/app/services/page.tsx`

- [ ] **Step 1: Inspect the resulting diff.**

  Run `git diff --check` and `git diff -- src/app/blog/page.tsx src/app/page.tsx src/app/services/page.tsx` to confirm the changes are scoped, whitespace-clean, and do not overwrite the existing Services worktree changes.

- [ ] **Step 2: Do not run automated tests.**

  The user explicitly requested no testing. Do not add tests or run the test suite. Report that automated verification was intentionally omitted.
