# Blog index design

## Goal

Add a discoverable, statically rendered `/blog` page for ApartmentMaid. It should help prospective customers find practical home-cleaning guidance and provide a clear path to service availability.

## Design direction

Reading this as an editorial resource page for local-services customers, using the existing warm, calm brand system. The page uses the site’s deep teal primary action, warm canvas surfaces, 16px card radii, pill-shaped links, and the existing Outfit typeface. Design dials: variance 6, motion 1, density 3.

## Page structure

1. Shared navigation, with Blog linked to `/blog` and marked active on the new route.
2. A left-aligned page introduction that establishes the blog as a practical home-care resource.
3. One featured article: a visual story card with a home-cleaning image, category and reading time, short summary, and a “Read the guide” action.
4. Topic chips for Cleaning routines, Apartment living, Deep cleaning, and Moving. They are presentational in this first pass; article pages and filtering are outside scope.
5. A responsive three-column article grid (one column on narrow screens) containing six article cards with image, metadata, title, summary, and arrow action.
6. A teal conversion band with a concise prompt and a “Check availability” link to the existing booking entry point.

## Architecture

`src/app/blog/page.tsx` will be a Server Component that exports static metadata and contains local, typed article data. It will use `next/image` and `next/link`, with no client-side state or third-party dependencies. The existing navigation in the home and Services pages will be changed only to route Blog to `/blog`.

## Content and SEO

The page will use semantic `header`, `main`, `section`, `article`, `nav`, and heading elements. The page metadata will include a distinct title and description. Article imagery will have descriptive alternative text. The static route remains crawlable without JavaScript.

## Responsive and accessibility requirements

- Container width matches the existing marketing pages and has 16px mobile gutters.
- The featured story switches from two columns to a stacked layout below `md`.
- Article cards use an image-first layout with consistently visible text and action targets.
- Links have visible keyboard focus states and maintain colour contrast against their surfaces.
- No animated, loading, or client-managed states are introduced because the page uses static content.

## Deliberate exclusions

This pass does not add article detail routes, CMS integration, search, or functional category filtering. These require content and data-source decisions that are not part of the request.
