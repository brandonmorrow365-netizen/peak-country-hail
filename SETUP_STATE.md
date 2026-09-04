# Setup State

Last reviewed: 2026-09-04

## Known complete
- [x] Public GitHub repository downloaded; missing application folders implemented locally.
- [x] Milestone 0: compatible pinned packages and npm lockfile; Astro check and build pass.
- [x] 30 routes validated locally, including canonical URLs, JSON-LD, internal links, 404, robots and sitemap exclusions.
- [x] Seven automated tests cover CSV schema/rollover, stale/error handling, lead validation, disabled forms and prepared database inserts with mocked Turnstile.
- [x] Local D1 migration applied; preview deployment dry run passes.
- [x] Custom Worker fetch/scheduled handlers, source logging and truthful weather states implemented.
- [x] Forms fail closed without D1 and Turnstile; live forms remain disabled. Weather ingestion enabled on the preview Worker.
- [x] Mobile/desktop overflow checks at 390px and 1440px passed. Full accessibility/performance audit remains a launch gate.
- [x] Business name chosen: Peak Country Auto Hail Repair & Paintless Dent Repair
- [x] Six domains purchased
- [x] Canonical domain chosen: peakcountryhail.com
- [x] Overall site/weather strategy chosen

## Owner/account actions still required at some point
- [x] GitHub repository created/imported
- [x] Codex authenticated to GitHub and pushed codex/foundation-preview; draft PR #1 created
- [x] Cloudflare Worker connected to GitHub repository; owner approved Connect and build token creation
- [x] D1 database created, bound as DB, and migration applied remotely
- [ ] Primary domain connected to Worker (do only at launch milestone)
- [ ] Secondary redirects enabled
- [ ] Turnstile keys created
- [ ] Google Business Profile URL supplied
- [ ] Google Search Console verified
- [ ] Bing Webmaster Tools verified

## Business facts still needed
- [ ] Public business phone
- [ ] Business email confirmed/activated
- [ ] Final exact service-area list
- [ ] Business hours / appointment policy
- [ ] Final owner/business bio wording
- [ ] Social profile URLs
- [ ] Google Business Profile URL
- [ ] Verified reviews
- [ ] Gallery photos + rights/approval
- [ ] Official master logo asset added to repo
- [ ] Any warranties/guarantees stated in writing (if offered)
- [ ] Insurance-process wording approved

## Preview and credentials
- Workers Builds connected to `codex/foundation-preview`, with `npm run build` and `npx wrangler deploy`. First automatic deployment and GitHub validation passed (commit `1f57a23`).
- Worker name: `peak-country-hail-preview`; public workers.dev and version preview URLs disabled at owner request; no custom routes.
- Cloudflare Wrangler OAuth authorized successfully using device login. Scope limited to account/user read, Workers scripts write and D1 write (plus OAuth background access).
- Former public preview withdrawn at owner request. Use localhost for ongoing review.
- Version: b5a28834-0911-4230-aecc-aee04de71bd3. Remote D1 migration/query checks and 30-page hosted smoke validation passed.
- Database ID: 8ad357b0-1dae-468d-bb3a-fe39b939428a. No customer leads stored.
- NWS/SPC scheduled ingestion enabled. A manual invocation of the built scheduled handler with remote D1 succeeded for both sources at 2026-09-04 13:37 UTC (zero records). Automatic cron delivery still needs observation after propagation.
- GitHub Actions Linux clean install, checks, build, migration and site smoke tests passed: https://github.com/brandonmorrow365-netizen/peak-country-hail/actions/runs/33878930342
- Draft review: https://github.com/brandonmorrow365-netizen/peak-country-hail/pull/1
- No production domain or secondary redirect was connected.
- Local preview served at http://localhost:4321/ during development; use local preview for owner review.
- Tool runtime on this computer uses bundled Node 24 and Git. Wrangler config/cache is under the task's work/tool-config (outside the repository). Do not archive that directory or include credentials in Git.
- Historical importer, MapLibre/address search, real gallery/reviews, email notifications, business facts, privacy retention/contact, and final launch audits remain pending.

## Public launch hold — 2026-09-04
Owner explicitly requested removal of public access while basic coding, graphics, and revisions continue. Both Workers public URL settings are disabled in source control so future builds preserve this restriction. Do not publish until the owner approves launch.
