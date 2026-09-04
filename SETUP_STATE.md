# Setup State

Last reviewed: 2026-09-04

## Known complete
- [x] Public GitHub repository downloaded; missing application folders implemented locally.
- [x] Milestone 0: compatible pinned packages and npm lockfile; Astro check and build pass.
- [x] 30 routes validated locally, including canonical URLs, JSON-LD, internal links, 404, robots and sitemap exclusions.
- [x] Seven automated tests cover CSV schema/rollover, stale/error handling, lead validation, disabled forms and prepared database inserts with mocked Turnstile.
- [x] Local D1 migration applied; preview deployment dry run passes.
- [x] Custom Worker fetch/scheduled handlers, source logging and truthful weather states implemented.
- [x] Forms fail closed without D1 and Turnstile; live forms and weather ingestion remain disabled.
- [x] Mobile/desktop overflow checks at 390px and 1440px passed. Full accessibility/performance audit remains a launch gate.
- [x] Business name chosen: Peak Country Auto Hail Repair & Paintless Dent Repair
- [x] Six domains purchased
- [x] Canonical domain chosen: peakcountryhail.com
- [x] Overall site/weather strategy chosen

## Owner/account actions still required at some point
- [x] GitHub repository created/imported
- [x] Codex has a local Git checkout; push authentication is not available yet
- [ ] Cloudflare Worker project connected to repository
- [ ] D1 database created
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
- Worker name: `peak-country-hail-preview`; workers.dev enabled, no custom routes.
- Cloudflare browser account is accessible, but Wrangler OAuth authorization is pending.
- No production domain or secondary redirect was connected.
- Local preview served at http://localhost:4321/ during development; not a public deployment.
- Tool runtime on this computer uses bundled Node 24 and Git. Wrangler config/cache is under the task's work/tool-config (outside the repository). Do not archive that directory or include credentials in Git.
- Historical importer, MapLibre/address search, real gallery/reviews, email notifications, business facts, privacy retention/contact, and final launch audits remain pending.
