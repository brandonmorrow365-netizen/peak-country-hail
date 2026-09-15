# Peak Country Website Design System

**Status:** Active implementation standard  
**Established:** 2026-09-14 (Phase 11)

This document defines the visual and interaction system used by the Peak Country website. It supports, but does not override, `CURRENT_DECISIONS.md` or `APPROVED_COPY.md`.

## Brand impression

The interface should feel experienced, precise, premium, trustworthy, modern, automotive, technically competent, and grounded in Northern Colorado. Real repair photography carries the proof. Decorative effects should remain restrained.

## Foundations

- **Body type:** Inter/system sans-serif stack, with a comfortable 1.65 line height.
- **Display type:** Avenir Next Condensed/Arial Narrow/system fallback for headings only.
- **Type scale:** fluid `clamp()` sizes, one H1 per page, H2 for sections, H3 for components within sections.
- **Text measure:** 760px for long-form content; 1200px maximum for primary page content.
- **Spacing:** an eight-pixel-based scale from 0.5rem through 4.5rem. Section spacing is fluid from 3.5rem to 6.25rem.
- **Breakpoints:** desktop above 1024px, tablet from 721px through 1024px, and mobile at 720px and below.

## Color and surfaces

- Deep navy is reserved for the shell, authority sections, weather/data contexts, and major closing calls to action.
- Blue is the single primary accent for actions, focus, section rules, and technical highlights.
- White and cool gray surfaces carry most content. Cards use one border, one restrained shadow, and a small radius.
- Green identifies completed repair states or success. Orange identifies warnings and focus. Red is reserved for errors.
- Gradients are limited to image-legibility overlays; glassmorphism is not part of the system.

The canonical CSS tokens are declared in `src/styles/global.css`. New page work should use those tokens rather than introducing new one-off colors, radii, or shadows.

## Components

- **Primary CTA:** `.button`; use for the single most important next action, normally **Get Started**.
- **Dark CTA:** `.button.dark`; use only on light surfaces where a navy action needs greater weight.
- **Text link:** `.text-link`; use for supporting navigation and secondary actions.
- **Cards:** white surface, one-pixel cool-gray border, three-pixel blue top rule, four-pixel radius, restrained shadow.
- **Page header:** compact storm-image field with a dark overlay, eyebrow, one H1, short introduction, and optional primary/secondary actions.
- **Sections:** use `.section`, optionally `.narrow`, with the shared content width and vertical rhythm.
- **Forms:** labels remain visible, inputs use the shared radius and focus ring, privacy notices appear at the required workflow stages, and one primary submit action is used.
- **Before/after proof:** show matched pairs at equal visual weight, label states in captions, preserve intrinsic image dimensions, and avoid filters or crops that misrepresent repair results.
- **Tables and data:** use a dark header, visible row rules, and contained horizontal scrolling on small screens.

## Header and footer

The homepage uses the approved Peak Country motion header: the sharp responsive production artwork introduced in `909db73`, combined with the masked drifting-cloud, canvas rain/hail and lightning, and pointer-depth behaviors recovered from `c8271df`. The sharp mountain base must remain untransformed; atmospheric movement is isolated to the sky layer. The header retains visible motion controls and the approved core navigation with a single **Get Started** CTA. Internal pages use the compact content-first site header. Its mobile navigation uses a native `details` disclosure so it works with keyboard input and without JavaScript; the homepage storm navigation uses an accessible button disclosure while enhanced and remains visible without JavaScript.

The footer groups repair, planning, and educational links instead of presenting one unstructured link cloud. Business identity, mobile/by-appointment positioning, public phone, and public email remain visible.

## Motion and media

- Ambient motion is limited to the approved homepage storm header. Its cloud, rain/hail, lightning, and pointer-depth layers are progressive enhancement over crawlable HTML and the original static image.
- No Three.js, Spline, or scroll-triggered animation is required by the core experience.
- The storm header provides pause/play control, stops when offscreen or hidden, caps its frame rate, and supports up to 2× canvas backing density for Retina/high-DPI displays. `prefers-reduced-motion` pauses canvas motion, cloud drift, parallax, and animated transitions while preserving the original static mountain/storm artwork.
- Real repair photographs are never replaced by generic automotive stock imagery.
- Responsive images keep explicit dimensions to reduce layout shift.

## Responsive behavior

- Desktop navigation stays horizontal and page layouts may use two or three columns.
- Tablet layouts collapse complex grids while preserving reading order and CTA hierarchy.
- Mobile layouts use one column, full-width primary actions, contained data tables, and a native menu disclosure.
- No page should create horizontal document overflow at 390px, 768px, or 1440px viewports.

## Change rule

Follow this design system for new work. Introduce a new visual pattern only when the content or interaction cannot be served by an existing primitive, and then update this document and the shared CSS together.
