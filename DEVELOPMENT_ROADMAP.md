# Development Roadmap

## Milestone 0 — Repository bootstrap
- [x] Install dependencies and generate lockfile.
- [x] Confirm `npm run build` succeeds.
- [x] Confirm local `npm run dev` works.
- [x] Replace any package APIs that changed since this starter was generated.
- [x] Do not change canonical domain.

Completed 2026-09-04. Uploaded repository lacked application folders; implemented the missing Astro application from the specification. Current compatible versions are pinned in package.json/package-lock.json. Local development required polling for filesystem watchers in the Codex environment.

## Milestone 1 — Cloudflare development deployment
- [x] Authenticate Wrangler / Cloudflare.
- [x] Create Worker preview deployment on `workers.dev`.
- [ ] Connect GitHub repository to Cloudflare Workers Builds if not already connected.
- [x] Keep `peakcountryhail.com` disconnected from the app until launch-ready.

Worker deployed at https://peak-country-hail-preview.peak-country-hail.workers.dev and all 30 hosted route checks passed. GitHub push completed and Linux CI passed. Draft PR #1 created. Workers Builds connection awaits repository-scoped GitHub app authorization.

## Milestone 2 — D1
- [x] Run `npx wrangler d1 create peak-country-hail-db`.
- [x] Add returned D1 binding as `DB` in `wrangler.jsonc`.
- [x] Apply `migrations/0001_initial.sql` locally and remotely.
- [x] Test lead insert and hail parser/validation locally; remote D1 integration remains pending.
- [ ] Update `SETUP_STATE.md`.

## Milestone 3 — Core content/design
- [ ] Replace temporary logo with owner-approved master logo asset.
- [ ] Confirm color system with logo.
- [ ] Finalize homepage copy.
- [ ] Finalize services copy.
- [ ] Finalize actual service-area list.
- [ ] Add owner-approved phone/email and social links.
- [ ] Add actual gallery images.
- [ ] Add only verified reviews.

## Milestone 4 — Lead capture
- [ ] Enable D1 contact form storage.
- [x] Implement Turnstile widget and server verification, hostname/action checking, and fail-closed forms. Real keys and launch activation remain pending.
- [ ] Configure reliable email notifications.
- [x] Add honeypot, bounded streaming input, origin checks, consent checks, and per-contact rate protection. Edge rate rule remains a launch task.
- [ ] Test mobile forms and validation.

## Milestone 5 — Hail Tracker Phase 1
- [ ] NWS active-alert ingestion every 5 minutes.
- [ ] Verify SPC current hail CSV endpoint/schema and enable ingestion every 10 minutes.
- [ ] Filter/report Northern Colorado data correctly.
- [x] Display source/freshness/preliminary labels.
- [x] Add empty/error states that never mislead users.
- [x] Add `/data-sources/` methodology page.

NWS/SPC scheduled ingestion is implemented and enabled on the bound preview Worker. Manual scheduled-handler invocation against remote D1 succeeded for both sources at 13:37 UTC on 2026-09-04; automatic Cron Trigger delivery still needs observation. SPC live CSV schema and units/report-day semantics verified 2026-09-04. Historical implementation plan: HISTORICAL_IMPORT_PLAN.md.

## Milestone 6 — Historical data
- [ ] Build NCEI bulk importer for Colorado hail records.
- [ ] Store data version/source URL.
- [ ] Populate Greeley/Weld/Northern Colorado history pages.
- [ ] Create useful yearly/event views.
- [ ] Keep thin automatically generated pages `noindex`.

## Milestone 7 — Map + “Did it hail near me?”
- [ ] Add MapLibre.
- [ ] Plot NWS warning polygons and hail report points.
- [ ] Add distance calculation from user-entered/selected location.
- [ ] Do not imply parcel-level verification.
- [ ] Add address geocoder only after privacy/cost/provider review.

## Milestone 8 — SEO / launch
- [x] Validate titles/descriptions/canonicals.
- [x] Validate JSON-LD.
- [x] Sitemap and robots.
- [ ] Accessibility audit.
- [ ] Performance audit.
- [x] Broken-link audit.
- [ ] Preview on major mobile/desktop sizes.
- [ ] Attach `peakcountryhail.com` custom domain.
- [ ] Import/enable secondary-domain redirects from `DOMAIN_REDIRECTS.csv`.
- [ ] Verify redirects return 301 and do not create duplicate sites.
- [ ] Enable Cloudflare Web Analytics.
- [ ] Add Google Search Console domain property.
- [ ] Add Bing Webmaster Tools.
- [ ] Connect/complete Google Business Profile as service-area business.

## Milestone 9 — Authority building
- [ ] Publish high-quality storm summaries after meaningful events.
- [ ] Build data-driven local history pages.
- [ ] Execute `BACKLINK_PLAYBOOK.md`.
- [ ] Use Search Console queries to guide next pages/features.
- [ ] Add statewide coverage only if Northern Colorado product is stable and useful.
