# Development Roadmap

## Milestone 0 — Repository bootstrap
- [ ] Install dependencies and generate lockfile.
- [ ] Confirm `npm run build` succeeds.
- [ ] Confirm local `npm run dev` works.
- [ ] Replace any package APIs that changed since this starter was generated.
- [ ] Do not change canonical domain.

## Milestone 1 — Cloudflare development deployment
- [ ] Authenticate Wrangler / Cloudflare.
- [ ] Create Worker preview deployment on `workers.dev`.
- [ ] Connect GitHub repository to Cloudflare Workers Builds if not already connected.
- [ ] Keep `peakcountryhail.com` disconnected from the app until launch-ready.

## Milestone 2 — D1
- [ ] Run `npx wrangler d1 create peak-country-hail-db`.
- [ ] Add returned D1 binding as `DB` in `wrangler.jsonc`.
- [ ] Apply `migrations/0001_initial.sql` locally and remotely.
- [ ] Test lead insert and hail report query.
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
- [ ] Add Cloudflare Turnstile to all public forms.
- [ ] Configure reliable email notifications.
- [ ] Add spam/rate protections.
- [ ] Test mobile forms and validation.

## Milestone 5 — Hail Tracker Phase 1
- [ ] NWS active-alert ingestion every 5 minutes.
- [ ] Verify SPC current hail CSV endpoint/schema and enable ingestion every 10 minutes.
- [ ] Filter/report Northern Colorado data correctly.
- [ ] Display source/freshness/preliminary labels.
- [ ] Add empty/error states that never mislead users.
- [ ] Add `/data-sources/` methodology page.

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
- [ ] Validate titles/descriptions/canonicals.
- [ ] Validate JSON-LD.
- [ ] Sitemap and robots.
- [ ] Accessibility audit.
- [ ] Performance audit.
- [ ] Broken-link audit.
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
