<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<IMPORTANT>
# Agent Guidelines: Frontend Design & Architecture

This document outlines the strict engineering and design principles required for all frontend modifications, components, and architectural decisions.

---

## 1. Design System & Component Guidelines

* **Design Ledger Reference:** Always consult and update the `DESIGN.md` file for any design changes or iterations you introduce.
* **Component Reuse First:** Always prioritize existing components and adhere strictly to the established design system. 
* **Creating New Components:** Never create a new component unless it is absolutely necessary. If a new component is required, it must seamlessly follow the design system guidelines.
* **Legacy Refactoring:** If an existing component requires modification but does not currently utilize the design system, you must first refactor/convert it to use the design system before making your functional changes.
* **Component Deprecation:** If an existing component deviates completely from the design system and refactoring it is unfeasible, you are permitted to create a new, compliant component to replace it.

---

## 2. Core Frontend Skills & Aesthetics

Leverage the following core skill sets for every user interface task:
* `design-taste-frontend`: Inject strong visual intuition, clean spacing, and modern typography choices.
* `ui-ux-pro-max`: Focus on micro-interactions, accessibility (ARIA attributes), user workflows, and intuitive layout patterns.
* `frontend-design`: Ensure production-grade CSS/styling architecture, responsive design, and performance optimizations.

---

## 3. SEO & Rendering Architecture

* **Out-of-the-Box SEO:** Every frontend design, layout, or page modification must be fully SEO-compatible by default (proper semantic HTML, structured data capability, metadata handling).
* **Marketing & Landing Pages:** * **Priority:** Must be compiled as Static Site Generated (**SSG**) pages. This ensures maximum crawlability for Google bots and optimal discovery.
    * **Interactivity:** SSG pages must remain fully interactive post-hydration.
* **No Pure SPAs for Public Pages:** Do not build public-facing marketing pages as Single Page Applications (SPAs). All marketing and discoverable pages must leverage **SSG** or Server-Side Rendering (**SSR**).
* use relevant skills required for the SEO
</IMPORTANT>
<!-- END:nextjs-agent-rules -->
