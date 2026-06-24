# Instant Quote Hero Design

## Goal

Increase homepage conversion by making the first-screen action start the existing tailored quote flow, rather than presenting an ambiguous contact or booking action.

## Audience and conversion event

Apartment residents looking for professional cleaning. The primary event is navigating to the existing live quote generator at `#quote-generator`.

## Chosen direction

Keep the current warm, editorial visual system and lifestyle photography. Replace generic brand messaging with an explicit quote proposition and a single dominant action.

### Hero content

- Headline: `A spotless home starts with a clear price.`
- Body: `Choose your service and get a tailored quote in under a minute.`
- Primary action: `Get my instant quote`, linking to `#quote-generator`.
- Secondary action: `How it works`, linking to the existing booking/process section.
- Supporting assurance: `No account required` and `Clear, tailored pricing` in a compact image-overlay panel.
- Proof line: `4.9★ from 4,849 residents · Background-checked professionals`.

### Navigation

Change the top-right action from `Contact Us` to `Get a quote`, using the same `#quote-generator` destination as the hero CTA. This gives high-intent users one clear path.

### Visual structure

The hero stays a left-aligned copy block over a warm canvas, with the existing professional-cleaner image occupying the right side. A restrained teal overlay panel on the photo signals the quote’s speed and lack of signup friction. The existing palette, rounded-card rules, and image are retained.

On mobile, copy, both actions, and proof remain before the image. The image becomes a shorter lower panel, avoiding compromised text contrast and preserving the CTA in the initial viewport.

## Scope and non-goals

- Reuse the existing quote generator; no pricing or booking behaviour changes.
- Do not add a new form, modal, route, analytics dependency, or external logo claims.
- Update only the navigation CTA and homepage hero presentation.

## Validation

- Add a focused static regression test confirming the primary quote CTA and matching navigation CTA target `#quote-generator`.
- Run lint and a production build after the change.
