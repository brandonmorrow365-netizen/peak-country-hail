# Search discovery implementation

Completed from the paused 2026-09-08 work on branch `peak-country-seo-hail-upgrade`.

## Implemented

- A reusable JSON-LD entity graph now connects the `AutoRepair` business, `WebSite`, each `WebPage`, breadcrumbs, and appropriate page-level `Service`, `FAQPage`, `Article`, `Dataset`, and `ImageObject` entities through stable canonical IDs.
- Important repair and inspection pages use direct-answer text in server-rendered HTML. The About and informational pages show factual authorship, source standards, and review dates without inventing an owner name or credential.
- `src/data/contentMeta.ts` is the source of stable page modification dates for canonical sitemap entries. Build time does not rewrite every date.
- The live tracker and historical hail pages expose source organizations, links, freshness, geographic scope, preliminary status, and limitations in visible text and supported schema.
- A private D1 archive retains verified preliminary SPC rows with source and first/last-seen metadata. It has no public route.
- Production crawler rules preserve public access while protecting API, admin, internal, and preview paths. Preview deployments remain `noindex, nofollow`.
- `llms.txt`, an RSS 2.0 resource feed, and opt-in IndexNow submission tooling provide supplemental discovery paths. IndexNow accepts only registered canonical production URLs and requires an external deployment secret.
- Reusable repair case-study and location-page models, components, and routes are ready for verified content. Their sample/unready records return 404 and are excluded from sitemap and feed output.

## Intentionally unpublished

- No repair case study is published because no complete verified repair record and approved before/after images are available.
- No new commercial city page is published because the city-specific service, appointment, hail, and case details are not complete.
- No `sameAs`, personal author, review, rating, estimate-price, or estimate-duration claim is published without verified owner data.

Owner-supplied facts needed for those items are listed in `docs/OWNER_CONTENT_TODOS.md`. IndexNow and Cloudflare crawler setup is documented in `docs/SEARCH_DISCOVERY_SETUP.md`.

## Validation

- `astro check`: 76 files, 0 errors, 0 warnings, 0 hints.
- Node test runner: 34 tests passed.
- Production Astro build: passed.
- Local D1 migration: `0003_hail_report_archive.sql` passed.
- Built-Worker site check: 31 pages passed metadata, canonical, structured-data parsing, internal-link, preview-indexing, sitemap, feed, 404, and disabled-form checks.
- Additional HTTP validation parsed sitemap/feed XML and JSON-LD on critical pages.

The Worker file-watcher reports the host environment's open-file limit during local preview, but the built server starts and all HTTP checks complete. No source error is associated with that warning.
