# Peak Country Full-Site Visual Preview Progress

## Safety status

- Preview-only work. Do not deploy, publish, merge, push, or connect this branch to an automatic deployment.
- Production/default remote branch identified as `origin/main`.
- Protected source checkout: `/Users/rexmorrow/Documents/Codex/2026-09-04/files-pasted-by-the-user-you/outputs/peak-country-hail`
- Isolated preview worktree: `/Users/rexmorrow/Documents/Codex/2026-09-16/files-pasted-by-the-user-peak-2/work/peak-country-site-preview`
- Preview branch: `peak-country-full-site-visual-preview` (local only; no upstream)
- Baseline commit: `5f4dce4f487736053d1a4ab99c52cf95cc5025da` (`peak-country-approved-baseline-2026-09`)
- Baseline source branch: `peak-country-seo-hail-upgrade`
- The protected source checkout remains on its original branch and commit.
- No deployment or live-service configuration command was run.

## TASK 1 — PROTECT THE CURRENT SITE

**Status:** COMPLETED — 2026-09-16

### Task completed

- Inspected repository status, branches, remotes, worktrees, instructions, structure, framework, build system, and public launch restrictions.
- Confirmed the authoritative repository is an Astro 7 application using the Cloudflare adapter, TypeScript, Cloudflare Workers/D1/Cron, MapLibre, pnpm 11.19.0, and Node 24.
- Identified `origin/main` as the recorded remote default branch.
- Recorded the approved local baseline at commit `5f4dce4f487736053d1a4ab99c52cf95cc5025da`.
- Created the isolated local worktree and local preview branch listed above from that exact baseline commit.
- Preserved the original checkout and its existing user work without stashing, discarding, committing, or copying it into the preview baseline.
- Ran the baseline project check, production build, automated tests, and local route/site smoke test.
- Confirmed the protected source checkout still has the same pre-existing working-tree changes after setup.
- Made no visual changes and made no production route, metadata, redirect, sitemap, robots, schema, form, weather, or deployment changes.

### Protected pre-existing user work

The following changes were already present in the protected source checkout before Task 1 and remain there unchanged by this task:

- Modified: `src/pages/warranty/index.astro`
- Modified: `src/styles/global.css`
- Untracked: `src/pages/warranty/full-terms/`

The protected source branch is 16 commits ahead of `origin/peak-country-seo-hail-upgrade`. It is also locally divergent from the recorded remote default branch, so the preview intentionally starts from the approved tagged local baseline rather than switching or rewriting the protected checkout.

### Files added

- `PREVIEW_PROGRESS.md`

### Files modified

- None.

### Tests performed

- Astro project check: PASS — 74 files, 0 errors, 0 warnings, 0 hints.
- Astro production build: PASS.
- Automated Node test suite: PASS — 39 passed, 0 failed.
- Local site smoke test against `http://127.0.0.1:4321`: PASS — 34 pages validated for status, heading/main landmarks, metadata lengths, canonical tags, Open Graph metadata, business identity, structured data, internal links, image attributes, preview `noindex, nofollow`, sitemap behavior, 404 behavior, and disabled forms.
- Production checkout verification: PASS — the original branch, HEAD, and three pre-existing working-tree paths remain unchanged.

### Baseline build notes

- The production build reports one existing warning for a JavaScript chunk larger than 500 kB. Repository status already identifies the deferred MapLibre service-area bundle as a known optimization item.
- The new worktree reused an exact local copy of the already-installed dependency tree because external package-registry access is unavailable in this environment. No package or lockfile was changed.
- The repository's custom `astro dev` helper encountered an optimizer-cache missing-file error in this isolated worktree. The production build and `astro preview` path worked, and the full 34-page local smoke test passed through that production-preview path.
- A local-only baseline preview is available on `http://127.0.0.1:4321`; it is bound to loopback and is not a deployment.

### Easily available current production route snapshot

The live production sitemap returned HTTP 200 on 2026-09-16 and listed 27 public URLs:

- `/`
- `/about/`
- `/after-a-hailstorm/`
- `/auto-hail-repair/`
- `/contact/`
- `/data-sources/`
- `/door-ding-repair/`
- `/estimating-documentation/`
- `/faq/`
- `/free-hail-inspection/`
- `/get-started/`
- `/gallery/`
- `/hail-damage-guide/`
- `/hail-size-guide/`
- `/hail-tracker/`
- `/hail-tracker/greeley/`
- `/hail-tracker/northern-colorado/`
- `/hail-tracker/weld-county/`
- `/insurance-claims/`
- `/northern-colorado-hail-history/`
- `/paintless-dent-repair/`
- `/process/`
- `/repair-standards/`
- `/resources/`
- `/service-area/`
- `/warranty/`
- `/why-pdr/`

The live homepage also exposes `/privacy/`, `/terms/`, and `/feed.xml`. The live `robots.txt` and `sitemap.xml` both returned HTTP 200. Task 2 must perform the authoritative repository-wide route and architecture inventory; this list is only the easy Task 1 public snapshot.

### Decisions made

- Use the approved tagged local baseline `5f4dce4` because it contains the current committed Peak Country implementation while leaving the protected uncommitted warranty work untouched.
- Keep all preview implementation additive and scoped to the isolated worktree/branch.
- Do not configure an upstream, push the branch, deploy, or change any live service.
- Do not begin visual implementation during Task 1.
- Treat `docs/peak-country/CURRENT_DECISIONS.md`, `docs/peak-country/APPROVED_COPY.md`, `docs/peak-country/MASTER_ARCHITECTURE.md`, and the existing implementation according to the precedence in `AGENTS.md`.

### Known issues

- Existing large-chunk build warning associated with the page-specific MapLibre experience.
- The custom development helper's optimizer-cache issue noted above; production preview remains functional and passed the route audit.
- The protected source checkout contains unfinished warranty work that is intentionally not included in this preview baseline. Any later need to reconcile that work requires an explicit owner decision; it must not be copied or overwritten automatically.

## TASK 2 — COMPLETE SITE / ARCHITECTURE AUDIT

**Status:** COMPLETED — 2026-09-17

### Task completed

- Re-read the full preview-program instruction, the Task 1 checkpoint, repository authority files, and the current implementation before auditing.
- Inventoried all 34 canonical rendered page routes: 27 indexable routes and 7 intentionally noindex routes.
- Inventoried the legacy hail-history redirect, branded review redirect, secondary-domain redirects, canonical/trailing-slash rules, 404 behavior, unpublished case-study/location gates, public portfolio JSON, RSS, sitemap, robots, manifest, `llms.txt`, verification file, and conditional IndexNow endpoint.
- Documented desktop/mobile navigation, the homepage storm header, internal-page header, breadcrumbs, footer groups, contact links, accessibility landmarks, and all primary CTA destinations.
- Documented Contact, Free Initial Assessment, and the four-step Get Started workflow, including privacy timing, field scope, conditional insurance routing, optional photos, validation, Turnstile, D1/email dependencies, safe failure states, and the no-charge/no-checkout customer model.
- Documented Hail Tracker UI and weather integrations, NWS/SPC ingestion, D1 status handling, freshness thresholds, 50-mile tracker geography, verified 2016–2025 NOAA/NCEI archive, local tracker views, schema, cache behavior, and all source/causation/emergency limitations.
- Documented the complete current repair portfolio, pairings and unmatched-context images, responsive derivatives, public feed, privacy/disclosure rules, brand/hero/social/PDR assets, and missing approved repair examples.
- Documented the 25-mile service-area system, neutral public reference, all 12 communities, outside-area handling, professional mobile-work conditions, accessible MapLibre behavior, and the distinction between service-area and weather coordinates.
- Documented current warranty summary content, the four named but absent authoritative PDFs, the internal-only document rule, version-control dependency, and the protected checkout's intentionally isolated uncommitted warranty work.
- Documented titles/descriptions, canonicals, Open Graph/Twitter metadata, entity graph, page-specific schema, sitemap publication metadata, robots behavior, internal linking, social/review status, images, and downloadable-document status.
- Classified 159 inventory rows using only the required labels: `PRESERVE EXACTLY`, `PRESERVE / RESTYLE`, `MAY REORGANIZE VISUALLY`, `POSSIBLE DUPLICATE`, and `NEEDS USER DECISION`.
- Made no production-page, visual, route, content, data, form, weather, SEO, schema, redirect, deployment, or live-service changes.

### Files added

- `PREVIEW_CONTENT_INVENTORY.md`

### Files modified

- `PREVIEW_PROGRESS.md`

### Tests performed

- Inventory route/classification validation: PASS — all 34 canonical rendered routes are represented; 159 classified inventory rows; all five required labels recognized.
- Astro project check: PASS — 74 files, 0 errors, 0 warnings, 0 hints.
- Astro production build: PASS.
- Automated Node test suite: PASS — 39 passed, 0 failed.
- Fresh local site smoke test against `http://127.0.0.1:4322`: PASS — 34 pages validated for status, heading/main landmarks, metadata lengths, canonical/Open Graph tags, business identity, structured data, internal links, image attributes, preview `noindex, nofollow`, sitemap behavior, 404 behavior, and disabled forms.
- Markdown/Git whitespace validation: PASS — `git diff --check` reported no errors.
- Production checkout verification: PASS — original branch `peak-country-seo-hail-upgrade`, HEAD `5f4dce4f487736053d1a4ab99c52cf95cc5025da`, and the same two modified plus one untracked warranty-related paths remain unchanged.

### Decisions made

- Treat route URLs, canonicals, indexing states, redirects, metadata/entity relationships, form/weather business logic, verified datasets, legal constraints, exact prices, contact identity, and evidence provenance as `PRESERVE EXACTLY`.
- Allow preview-only visual restyling or reorganization only where the inventory explicitly marks it and only when all underlying information remains discoverable.
- Preserve overlapping catch-all summaries, historical planning inventories, and older architecture documents as `POSSIBLE DUPLICATE`; do not delete them during visual work.
- Use the current approved prices and timing: `$0`, `$99`, `$149` with 60–90 minutes, and `$249` with 90–120 minutes. Older pricing language remains historical, not authoritative.
- Keep the current honest empty/noindex/404 state for reviews, storm summaries, local history placeholders, case studies, and city pages until verified source material is supplied and approved.
- Do not infer owner identity/photo, business hours, social profiles, privacy-retention terms, reviews, ratings, case studies, certifications, or missing media.
- Do not import or reconcile the protected checkout's uncommitted warranty work automatically. The authoritative public PDFs and controlling version require owner input before later warranty implementation.
- Use `PREVIEW_CONTENT_INVENTORY.md` as the preservation map for subsequent preview tasks while continuing to follow the repository authority order.

### Known issues

- The four named authoritative warranty PDFs are absent from the committed preview baseline, so the controlling public warranty terms and download targets remain unresolved.
- The shared Contact/Free Initial Assessment form shows final consent but lacks the separate early privacy notice required by the current decision document; it also requires city/ZIP while Get Started keeps location separate. This is documented for a later authorized workflow decision, not changed in Task 2.
- Owner name/photo, business hours, social profiles, privacy-request contact, retention schedule, current reviews, published case studies/city pages, and additional privacy-approved portfolio assets remain unavailable.
- Several dedicated routes coexist with shorter data-driven summaries, and older planning inventories contain superseded route/indexing assumptions. They remain preserved as possible duplicates.
- The production build continues to report the existing MapLibre-related JavaScript chunk warning above 500 kB.
- The Task 1 process on port 4321 became stale after `dist` was rebuilt and now returns a static-asset error for the manifest. Process isolation prevented replacing that already-running process in this turn. A fresh verified loopback preview is running at `http://127.0.0.1:4322`.

## TASK 3 — PREVIEW DESIGN SYSTEM + SHELL

**Status:** COMPLETED — 2026-09-17

### Task completed

- Created an isolated preview-only visual system with dark navy/charcoal foundations, Peak Country cyan accents, off-white primary type, readable cool-gray secondary type, fluid spacing, three content widths, thin dividers, restrained controls, text links, and accessible focus states.
- Added subtle topographic-line texture and low-contrast mountain silhouettes without glowing borders, glass panels, repetitive iconography, or a uniform SaaS-card grid.
- Added a shared preview layout plus dedicated preview navigation and footer components. Production layout, header, footer, global stylesheet, and public page components were not edited.
- Established desktop, tablet, mobile, and reduced-motion rules. Desktop uses the full primary navigation; tablet and mobile use a native disclosure menu; page sections collapse into a natural reading order before becoming cramped.
- Added the real existing PDR reflection-light photograph as the system's evidence-led photo treatment, with a truthful crop, descriptive alternative text, caption, restrained contrast adjustment, and no generated repair evidence.
- Created the `/__preview/` index with design tokens, typography and control specimens, responsive layout guidance, photo treatment, isolation status, and current-versus-preview links that activate only completed preview work.
- Implemented the exact `/__preview/` URL through a single prerendered static dynamic segment because Astro intentionally excludes page files and directories whose names begin with an underscore.
- Kept the preview route out of the production sitemap, applied `noindex, nofollow`, omitted canonical and structured-data markup, and left all production route metadata and redirects unchanged.
- Performed no individual page rebuild, homepage-hero redesign, deployment, push, merge, or live-service change.

### Files added

- `src/components/preview/PreviewHeader.astro`
- `src/components/preview/PreviewFooter.astro`
- `src/layouts/PreviewLayout.astro`
- `src/pages/[preview]/index.astro`
- `src/styles/preview.css`

### Files modified

- `PREVIEW_PROGRESS.md`

### Tests performed

- Astro project check: PASS — 78 files, 0 errors, 0 warnings, 0 hints.
- Astro production build: PASS — `/__preview/index.html` prerendered successfully; the existing JavaScript chunk-size warning remains.
- Automated Node test suite: PASS — 39 passed, 0 failed.
- Fresh local production-route smoke test against `http://127.0.0.1:4324`: PASS — all 34 existing pages and their metadata, canonicals, schema, internal links, sitemap behavior, 404 behavior, and disabled forms validated.
- Preview isolation test: PASS — `/__preview/` returns 200, contains one H1 and one main landmark, carries `noindex, nofollow`, contains no canonical or JSON-LD, is absent from the sitemap, and all 16 unique local links resolve.
- Responsive visual QA: PASS — inspected the rendered shell at 1440×900, 768×1024, and 390×844, including desktop navigation, mobile menu, photo treatment, comparison rows, and footer stacking.
- Production checkout verification: PASS — original branch `peak-country-seo-hail-upgrade`, HEAD `5f4dce4f487736053d1a4ab99c52cf95cc5025da`, and the same two modified plus one untracked warranty-related paths remain unchanged.
- Remote default reference verification: PASS — `origin/main` remains at `449a854bd0502506d7ccaf88b61de0794e3a982f`.

### Decisions made

- Keep every shared visual primitive under the `pc-` preview namespace and import the stylesheet only through `PreviewLayout.astro`.
- Use editorial rhythm, asymmetric compositions, rules, and whitespace as the primary organization system rather than repeated boxed cards.
- Keep the preview index honest: unfinished page previews are labeled as planned and are not linked to nonexistent routes.
- Link preview-shell navigation to the current working routes until corresponding preview pages are created, preventing broken internal navigation during staged approval.
- Preserve the current homepage storm header and every individual production page until its authorized task.

### Known issues

- The production build continues to report the pre-existing MapLibre-related JavaScript chunk warning above 500 kB.
- Warranty source documents, owner identity/photo, business hours, social profiles, reviews, and additional approved repair media remain unresolved as documented in Task 2; Task 3 did not invent or alter them.
- Earlier loopback preview processes can become stale when `dist` is rebuilt. The fresh Task 3 preview is the verified instance on `http://127.0.0.1:4324`.

## TASK 4 — HOMEPAGE HERO PREVIEW

**Status:** COMPLETED — 2026-09-17

### Task completed

- Added the isolated `/__preview/home/` homepage-hero preview and activated its comparison link from `/__preview/`.
- Reused the current production storm/mountain PNG and responsive WebP assets without replacement, regeneration, or modification.
- Reused the existing `initHeaderStorm` implementation so cloud drift, rain, hail, lightning, pointer response, visibility throttling, pause/play control, manual lightning control, and reduced-motion behavior remain intact.
- Implemented all approved hero text as live HTML: the regional identifier, blue service line, three-part headline, concise local service support, primary Get Started CTA, and secondary Hail Repair link.
- Restyled the Hail Tracker into a visually secondary dark utility with a restrained blue rule, current NWS/SPC explanation, existing delay/incompleteness and vehicle-damage disclaimer, and working tracker link.
- Avoided stock weather imagery, glowing outlines, large bordered boxes, SaaS-dashboard styling, and generated scenery.
- Extended the preview header to show the current task label while keeping the Task 3 index label unchanged.
- Made no production homepage, production header, storm assets, animation source, weather integration, route, metadata, schema, sitemap, redirect, or live-service change.

### Files added

- `src/components/preview/PreviewHomeHero.astro`
- `src/pages/[preview]/home/index.astro`

### Files modified

- `src/components/preview/PreviewHeader.astro`
- `src/layouts/PreviewLayout.astro`
- `src/pages/[preview]/index.astro`
- `src/styles/preview.css`
- `PREVIEW_PROGRESS.md`

### Tests performed

- Astro project check: PASS — 80 files, 0 errors, 0 warnings, 0 hints.
- Astro production build: PASS — both `/__preview/` and `/__preview/home/` prerendered successfully; the existing JavaScript chunk-size warning remains.
- Automated Node test suite: PASS — 39 passed, 0 failed.
- Fresh local production-route smoke test against `http://127.0.0.1:4328`: PASS — all 34 existing pages and their metadata, canonicals, schema, internal links, sitemap behavior, 404 behavior, and disabled forms validated.
- Preview hero validation: PASS — exact approved copy, CTA destinations, current storm assets and behavior hooks, tracker utility copy/disclaimer/link, one-H1/one-main semantics, noindex state, absent canonical/JSON-LD, and sitemap exclusion confirmed.
- Storm-control interaction test: PASS — pause changes the control to Play Motion, disables manual lightning, and sets the paused state; play restores motion.
- Responsive visual QA: PASS — inspected at 1440×900, 768×1024, and 390×844. Desktop preserves the approved three-line hierarchy; tablet stacks the utility; mobile has no horizontal overflow and retains complete live text and controls.
- Production checkout verification: PASS — original branch `peak-country-seo-hail-upgrade`, HEAD `5f4dce4f487736053d1a4ab99c52cf95cc5025da`, and the same two modified plus one untracked warranty-related paths remain unchanged.
- Remote default reference verification: PASS — `origin/main` remains at `449a854bd0502506d7ccaf88b61de0794e3a982f`.

### Decisions made

- Reuse the production storm initializer directly rather than copying its behavior, while keeping all Task 4 markup and styling inside preview-only files.
- Preserve the approved three-line headline on desktop with semantic live-text spans and allow natural wrapping below the tablet breakpoint.
- Keep the homepage tracker as a gateway to the full existing Hail Tracker, matching current homepage functionality without inventing a reduced live-data dashboard.
- Keep the tracker visually subordinate through scale, placement, translucent dark fill, and one thin blue rule rather than a glowing or fully outlined panel.

### Known issues

- The production build continues to report the pre-existing MapLibre-related JavaScript chunk warning above 500 kB.
- Earlier loopback preview processes can become stale when `dist` is rebuilt. The fresh Task 4 preview is the verified instance on `http://127.0.0.1:4328`.
- All unresolved source-content and warranty decisions recorded in Task 2 remain unchanged.

## NEXT TASK

**TASK 5 — WHY PEAK COUNTRY**

Do not begin Task 5 until the owner says `continue`.
