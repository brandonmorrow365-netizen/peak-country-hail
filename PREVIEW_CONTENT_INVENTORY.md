# Peak Country Preview Content and Architecture Inventory

**Audit date:** 2026-09-17  
**Audited baseline:** `5f4dce4f487736053d1a4ab99c52cf95cc5025da`  
**Preview branch:** `peak-country-full-site-visual-preview`  
**Scope:** Read-only repository audit for Task 2. No routes, content, assets, behavior, metadata, or production configuration were changed.

## Authority and use

This inventory records the current implementation before preview design work begins. It does not authorize deletion or copy changes. Later preview tasks must apply the repository's authority order:

1. `docs/peak-country/CURRENT_DECISIONS.md`
2. `docs/peak-country/APPROVED_COPY.md`
3. `docs/peak-country/MASTER_ARCHITECTURE.md`
4. Existing implementation

The master preview brief adds a preservation requirement over that hierarchy: existing public URLs, customer workflows, SEO/entity work, weather functionality, trust architecture, forms, warranty system, and useful content remain intact unless a later numbered task expressly authorizes a change.

## Classification legend

Every inventoried item is assigned one or more of these exact classifications:

- **PRESERVE EXACTLY** — retain the fact, route, behavior, data, asset meaning, legal constraint, or technical relationship without alteration.
- **PRESERVE / RESTYLE** — keep the substance and information while allowing preview-only visual styling.
- **MAY REORGANIZE VISUALLY** — the same information may be regrouped or recomposed in the isolated preview without removing it or changing its meaning.
- **POSSIBLE DUPLICATE** — overlapping sources or content exist; retain both until authority and usage are reconciled.
- **NEEDS USER DECISION** — the repository lacks an authoritative value, file, approval, or conflict resolution. Do not invent or publish an answer.

Where a row has multiple classifications, each applies to a different layer. Routes, canonical meaning, facts, pricing, legal constraints, data, and behavior remain exact; presentation may still be restyled or reorganized.

## System snapshot

| Item | Current implementation | Classification |
| --- | --- | --- |
| Application | Astro 7 server-rendered site with TypeScript, Cloudflare adapter/Worker, D1, scheduled weather ingestion, and MapLibre on the service-area page. | **PRESERVE EXACTLY** |
| Canonical identity | `https://peakcountryhail.com`; Peak Country Auto Hail Repair & Paintless Dent Repair; mobile/by appointment; Greeley, Weld County, and Northern Colorado. | **PRESERVE EXACTLY** |
| Rendered canonical pages | 34 routes validated by `scripts/check-site.mjs`: 27 indexable routes from `src/data/contentMeta.ts` and 7 intentional noindex routes from `src/data/pages.ts`. | **PRESERVE EXACTLY** |
| Shared shell | `src/layouts/Layout.astro` supplies metadata, schema graph, accessibility skip link, preview notice, header selection, breadcrumbs, main landmark, and footer. | **PRESERVE EXACTLY** for behavior and relationships; **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY** for preview presentation. |
| Route sources | Dedicated `.astro` pages coexist with a data-driven catch-all route. Dedicated physical routes win where slugs overlap. | **PRESERVE EXACTLY**; overlapping summaries are **POSSIBLE DUPLICATE**. |
| Production isolation | Non-production hosts receive page-level and response-header `noindex, nofollow`; preview config has no Workers preview URL and no automatic deployment. | **PRESERVE EXACTLY** |
| Existing production source | The protected checkout, its branch/HEAD, and its uncommitted warranty work are outside this preview worktree. | **PRESERVE EXACTLY** |

## Complete rendered page-route inventory

### Indexable canonical routes — 27

| Route | Implementation and major content sections | Classification |
| --- | --- | --- |
| `/` | Dedicated homepage. Storm/mountain masthead; primary Hail Repair/PDR/Gallery/Hail Tracker/Service Area/About navigation; geographic hero and Get Started CTA; tracker utility; 20+ PDR/25+ collision/mobile credibility band; four Why Peak Country principles; five repair/service cards; vehicle-access/reassembly standards; three featured portfolio groups; hail intelligence/resources; mobile-service section; Free Initial Assessment/warranty close; mobile conversion bar. | URL, claims, CTA intent, weather linkage, and all major content are **PRESERVE EXACTLY** or **PRESERVE / RESTYLE**. Card/section composition is **MAY REORGANIZE VISUALLY**. |
| `/about/` | Dedicated entity/trust page. 20+ years professional PDR and 25+ years collision-industry experience; owner/technician story; repair philosophy; vehicle-wide care; clear expectations; Northern Colorado coverage; experience timeline/context; editorial review standards; FAQ; CTA. Person schema is omitted because owner name is unset. | Approved facts/copy are **PRESERVE EXACTLY** and **PRESERVE / RESTYLE**; section layout is **MAY REORGANIZE VISUALLY**. Owner name/photo and replacement for the generated visual placeholder **NEEDS USER DECISION**. |
| `/after-a-hailstorm/` | Dedicated eight-step safety and decision guide: wait for safety, inspect under useful light, account for subtle damage, read official reports correctly, photograph visible damage, request professional inspection, consider insurance without rushing, understand the plan; also vehicle-safety precautions, documentation guidance, and Free Initial Assessment CTA. | Safety, insurance, weather-limit, and repair guidance are **PRESERVE EXACTLY**; article is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. |
| `/auto-hail-repair/` | Dedicated `ServiceDetail` page. Vehicle-wide hail patterns; controlled-light evaluation; PDR versus conventional repair; access/disassembly/reassembly; documentation, insurance, and repair economics; Peak Country inspection; six FAQs; related links and CTA. Service and FAQ schema. | Technical/insurance content, service relationships, and FAQ meaning are **PRESERVE EXACTLY**; page is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. A shorter unused summary for this slug in `pages.ts` is **POSSIBLE DUPLICATE**. |
| `/contact/` | Dedicated contact page. Phone, text, email, mobile/by-appointment/no-public-storefront facts; useful intake information; next-step and service-area guidance; shared lead form; POST handling and privacy-safe error behavior. | Contact facts, no-storefront statement, form source/behavior, and customer expectations are **PRESERVE EXACTLY**; copy/UI are **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. Shared lead-form privacy timing **NEEDS USER DECISION**; see Forms. |
| `/data-sources/` | Dedicated methodology page. NOAA/NCEI historical archives, NWS active alerts, SPC preliminary reports, geography, timestamps/freshness, failure states, archive processing, source links, and limitations. Article schema. | Sources, definitions, methodology, freshness windows, and disclaimers are **PRESERVE EXACTLY**; presentation is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. A shorter catch-all summary is **POSSIBLE DUPLICATE**. |
| `/door-ding-repair/` | Dedicated `ServiceDetail` page. Variation among dings/dents/creases; location/depth/paint/access; appropriate PDR; conventional alternatives; direct inspection; separation of everyday dents from hail claims; six FAQs; related links and CTA. Service and FAQ schema. | Technical and causation guidance are **PRESERVE EXACTLY**; page is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. A shorter unused summary is **POSSIBLE DUPLICATE**. |
| `/estimating-documentation/` | Dedicated service page. Free guidance versus paid formal work; professional estimating inputs; `$99` non-hail PDR estimate/documentation; `$149` comprehensive estimate review with 60–90 minute typical time; `$249` comprehensive hail estimate with 90–120 minute typical time; fee-credit rules; insurance limits; no automatic charge or checkout. Service schema. | Prices, timing, scope, credit language, approval requirement, and no-checkout rule are **PRESERVE EXACTLY**; presentation is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. Older prices in historical architecture are **POSSIBLE DUPLICATE** and are not authoritative. |
| `/faq/` | Dedicated grouped FAQ page covering repair/PDR, hail/weather interpretation, service/appointments, insurance/estimating/deductibles, and related decision points. FAQ schema and anchored insurance section. | Questions, answers, insurance limitations, anchor destination, and schema semantics are **PRESERVE EXACTLY**; accordion/group layout is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. A shorter catch-all FAQ summary is **POSSIBLE DUPLICATE**. |
| `/free-hail-inspection/` | Dedicated Free Initial Assessment page and shared lead form. `$0`; conversation/photo/brief visual review/options/verbal range where practical; distinction from formal written/insurance/detail estimate; hail-specific controlled evaluation; no obligation, charge, authorization, commitment, or checkout; human next step. Service schema. | Price, boundaries, no-obligation language, and form behavior are **PRESERVE EXACTLY**; page is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. Shared lead-form privacy timing **NEEDS USER DECISION**. |
| `/get-started/` | Dedicated four-step workflow: choose Hail Damage, Door Ding / Dent / Crease, or Not Sure; early privacy notice; contact and vehicle basics; conditional hail/insurance/estimate/photo-availability routing; final privacy/no-authorization/no-charge/no-checkout confirmation and consent; post-submit human-review options. | Choice wording, low-friction scope, optional photos, at-least-one contact method, privacy notices, conditional logic, consent, safe POST behavior, and no-transaction semantics are **PRESERVE EXACTLY**. Step presentation is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. |
| `/gallery/` | Dedicated real-work portfolio. Four privacy-reviewed vehicle groups: 2013 Chevrolet Silverado (3 paired angles), Nissan Murano (2 pairs plus 1 unmatched-before context view), Toyota 4Runner (2 pairs), Lexus RX (1 pair plus 1 unmatched-before context view). Similar-angle grouping, truthful unmatched context, captions/alt text, privacy/disclosure and normal-adjustment language, responsive AVIF/WebP/JPEG, ItemList and ImageObject schema. | Repair evidence, pairings, image truth, vehicles, captions/alt meaning, privacy status, and disclosure are **PRESERVE EXACTLY**. Gallery treatment is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. Additional approved-but-unavailable portfolio examples **NEEDS USER DECISION** only after real assets and public-use approval are supplied. |
| `/hail-damage-guide/` | Data-driven catch-all educational page. Explains why a nearby report is not vehicle proof and how lighting, panel condition, dent depth, paint condition, and direct inspection establish repairability. | Meaning and causation limits are **PRESERVE EXACTLY**; copy is **PRESERVE / RESTYLE** and page composition is **MAY REORGANIZE VISUALLY**. |
| `/hail-size-guide/` | Dedicated guide. Diameter comparisons; SPC hundredths-of-an-inch convention; size as one observation rather than a damage score; wind/angle/exposure/vehicle factors; official links and decision guidance. Article schema. | Units, interpretation, source facts, and disclaimers are **PRESERVE EXACTLY**; guide is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. A shorter catch-all summary is **POSSIBLE DUPLICATE**. |
| `/hail-tracker/` | Dedicated live tracker. Current ingestion status/freshness; local and broader Colorado NWS alerts; preliminary SPC hail reports prioritized around Greeley; tables and source timestamps; historical archive path; explanation and limitations; Dataset schema; short cache policy with stale-if-error. | Data sources, 50-mile tracker scope, status/freshness, failure behavior, preliminary labels, disclaimers, cache behavior, schema, and links are **PRESERVE EXACTLY**. Dashboard presentation is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. |
| `/hail-tracker/greeley/` | Dedicated `LocalHailPage`. Appropriate current weather context plus verified 2016–2025 NOAA/NCEI observations nearest the Greeley anchor; locations, report table, interpretation, methodology, and Dataset schema. | Scope, dataset, calculations, source links, non-damage disclaimer, and schema are **PRESERVE EXACTLY**; presentation is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. A terse `pages.ts` route descriptor is **POSSIBLE DUPLICATE**. |
| `/hail-tracker/northern-colorado/` | Dedicated `LocalHailPage`. Current regional context plus verified 2016–2025 observations within 50 miles of Greeley; locations, table, interpretation, methodology, and Dataset schema. | Scope, dataset, calculations, source links, non-damage disclaimer, and schema are **PRESERVE EXACTLY**; presentation is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. A terse route descriptor is **POSSIBLE DUPLICATE**. |
| `/hail-tracker/weld-county/` | Dedicated `LocalHailPage`. Current context plus verified records explicitly attributed to Weld County; locations, table, interpretation, methodology, and Dataset schema. | Scope, dataset, calculations, source links, non-damage disclaimer, and schema are **PRESERVE EXACTLY**; presentation is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. A terse route descriptor is **POSSIBLE DUPLICATE**. |
| `/insurance-claims/` | Data-driven catch-all page. Insurer requirements, customer policy control, repair-scope clarity, and explicit rejection of deductible rebate/cash-back/deductible-saving offers. | Insurance role and deductible constraints are **PRESERVE EXACTLY**; page is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. |
| `/northern-colorado-hail-history/` | Dedicated verified archive. 2016–2025 NOAA/NCEI data within 50 statute miles of a Greeley geographic anchor; summary metrics, annual view, lazy canvas visualization, accessible filters and full table, verified answers, methodology/source manifest, archive links, Dataset schema. Current 2026 season is excluded from completed-decade totals. | Dataset, period, geographic method, sources, timestamps, calculations, accessibility, schema, and limitations are **PRESERVE EXACTLY**. Visual/data-display composition is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. A short catch-all descriptor is **POSSIBLE DUPLICATE**. |
| `/paintless-dent-repair/` | Dedicated `ServiceDetail` page. What PDR is; push and glue-pull methods; suitable and unsuitable damage; full versus improvement repair; technician judgment; direct inspection; real PDR reflection-light image and caption; six FAQs; related links and CTA. Service, FAQ, and ImageObject schema. | Technical content, repair limits, real image, image meaning, FAQs, and schema are **PRESERVE EXACTLY**; page is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. A shorter unused summary is **POSSIBLE DUPLICATE**. |
| `/process/` | Dedicated seven-step workflow from first conversation through assessment, repairability, plan, access/vehicle protection, controlled repair, reassembly, and final review; insurance/documentation context; CTA. HowTo schema. | Step meaning/order, repair/customer safeguards, insurance boundaries, and schema are **PRESERVE EXACTLY**; visual timeline/section form is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. A shorter three-step summary is **POSSIBLE DUPLICATE**. |
| `/repair-standards/` | Dedicated repair-evaluation page. Inspection; factory-finish preservation; access planning; whole-vehicle protection; measured metal movement; reassembly; final quality review; honest alternatives/full-versus-improvement goals; related routes and CTA. Service schema. | Technical standards, limitations, alternatives, and schema are **PRESERVE EXACTLY**; page is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. A one-section catch-all descriptor is **POSSIBLE DUPLICATE**. |
| `/resources/` | Data-driven catch-all hub linking weather methodology/tracker and repair education/process. | Destinations and educational intent are **PRESERVE EXACTLY**; content is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. |
| `/service-area/` | Dedicated mobile-service page and lazy MapLibre map. Approximately 25-mile straight-line radius from a neutral downtown Greeley reference; included travel where applicable; not a hard boundary; outside requests welcomed with any small fee disclosed before scheduling; all 12 named communities; mobile conditions, weather, 50–60°F consideration, lighting/equipment, clean/dry vehicle, access/keys, and controlled hail environment; Service schema and accessible map fallback. | Radius, neutral reference, no public address, community list, fee logic, work conditions, map semantics/fallback, and schema are **PRESERVE EXACTLY**. Page/map styling is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. A shorter unused summary is **POSSIBLE DUPLICATE**. |
| `/warranty/` | Dedicated plain-language summary. Limited Lifetime Workmanship Warranty for qualifying PDR while the original customer owns the vehicle; non-transferable; specific workmanship/R&I scope; report within 30 days after discovery and allow inspection before alteration; summary exclusions; access/corrosion-protection language; explicitly not the complete warranty document. | Current summary and limits are **PRESERVE EXACTLY** until authoritative PDFs are reconciled. Presentation is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. Missing controlling/public documents and protected uncommitted warranty work **NEEDS USER DECISION**; see Warranty. |
| `/why-pdr/` | Data-driven catch-all page. Existing-finish preservation when appropriate and explicit statement that PDR is an assessment, not a promise; paint, stretch, and access limits. | Meaning and limits are **PRESERVE EXACTLY**; page is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. |

### Intentionally noindex canonical routes — 7

| Route | Implementation and current state | Classification |
| --- | --- | --- |
| `/reviews/` | Data-driven placeholder: no reviews published; future reviews require original wording, date, and verified source. Not in sitemap. | URL, noindex state, honesty rule, and absence of fabricated reviews are **PRESERVE EXACTLY**. Publishing reviews **NEEDS USER DECISION** after genuine source approval. |
| `/storms/` | Data-driven placeholder: no sourced storm summaries published; no inferred/filler events. Not in sitemap. | URL, noindex state, and evidence gate are **PRESERVE EXACTLY**. Publishing any event **NEEDS USER DECISION** after sufficient sourced content. |
| `/did-it-hail/` | Data-driven placeholder: nearby-report search is not available; links users to the regional tracker and promises no property/vehicle-hit claim. Not in sitemap. | URL, noindex state, feature-absence truth, and causation limit are **PRESERVE EXACTLY**. Tool implementation **NEEDS USER DECISION** in a separately scoped task. |
| `/privacy/` | Data-driven notice covering submitted information, Cloudflare/D1/Turnstile providers, no marketing enrollment, and sensitive-data warning. It says the privacy-request contact and retention schedule must be confirmed. Not in sitemap. | Current notice and noindex state are **PRESERVE EXACTLY**; page is **PRESERVE / RESTYLE**. Privacy contact and retention schedule **NEEDS USER DECISION** before any conflicting launch change. |
| `/terms/` | Data-driven website terms: general-information limits; no appointment/repair authorization from a request; weather delays/incompleteness; official-alert and no-vehicle-proof disclaimers. Not in sitemap. | Legal/operational meaning and noindex state are **PRESERVE EXACTLY**; page is **PRESERVE / RESTYLE**. |
| `/hail-history/greeley/` | Data-driven local-data placeholder. Unique local view is not populated; directs users to available regional data. Not in sitemap. | URL, noindex state, and no-unsourced-statistics rule are **PRESERVE EXACTLY**. Indexing/publication **NEEDS USER DECISION** only after unique verified data exists. |
| `/hail-history/weld-county/` | Data-driven local-data placeholder. Unique local view is not populated; directs users to available regional data. Not in sitemap. | URL, noindex state, and no-unsourced-statistics rule are **PRESERVE EXACTLY**. Indexing/publication **NEEDS USER DECISION** only after unique verified data exists. |

### Redirect, dynamic, error, and machine routes

| Route/system | Current behavior | Classification |
| --- | --- | --- |
| `/hail-history/` | Permanent `301` to `/northern-colorado-hail-history/`. | Source path, status, and destination are **PRESERVE EXACTLY**. |
| `/review` | Worker-level `302`, no-store, to the current direct Google review URL in `site.reviewUrl`. It intentionally has no trailing slash. | Branded source URL, status, no-store behavior, and target relationship are **PRESERVE EXACTLY**. Any review-target change **NEEDS USER DECISION** and verification. |
| `/case-studies/[slug]/` | Dynamic route renders only `publishedCaseStudies`; array is empty. The non-exported sample is deliberately unreachable, and sample/unknown requests return 404. | Publication gate, fact/image/right requirements, empty current state, and 404 behavior are **PRESERVE EXACTLY**. Publishing a case study **NEEDS USER DECISION** after factual approval. |
| `/locations/[city]/` | Dynamic route renders only verified `published` entries; Greeley, Windsor, Evans, Loveland, and Fort Collins are currently unpublished empty candidates. Requests return 404. | Publication gate, current 404s, and no thin/unsourced local pages are **PRESERVE EXACTLY**. Publishing city pages **NEEDS USER DECISION** after unique facts exist. |
| Unknown paths / `404` | Dedicated noindex page with one H1 and links to Home and Hail Tracker; Worker/Astro returns 404. | Status, noindex, basic recovery links, and semantics are **PRESERVE EXACTLY**; appearance is **PRESERVE / RESTYLE**. |
| `/automation/repair-portfolio-feed.json` | Public JSON portfolio endpoint built from approved gallery data, with stable image URLs and disclosure. Excluded from sitemap. | Payload truth, pairings, disclosure, stable URLs, and endpoint are **PRESERVE EXACTLY**. |
| `/feed.xml` | RSS 2.0 feed for four source-backed resources: After a Hailstorm, Data Sources, Hail Size Guide, and Northern Colorado Hail History. | Endpoint, canonical URLs, publication metadata, and informational disclaimer are **PRESERVE EXACTLY**. |
| `/sitemap.xml` | Custom XML from the 27-entry `contentMeta` list with explicit `lastmod`; excludes noindex, dynamic unpublished, preview, alternate-domain, and sample URLs. | Endpoint, inclusion/exclusion rules, canonical URLs, and reviewed dates are **PRESERVE EXACTLY**. |
| `/robots.txt` | Production allows public content and blocks `/api/`, `/admin/`, `/internal/`, and `/preview/` for named search/AI agents and wildcard; includes canonical sitemap. Non-production disallows all. | Stage behavior, directives, and sitemap relationship are **PRESERVE EXACTLY**. Before a deployable preview namespace exists, adding explicit `/__preview/` production protection **NEEDS USER DECISION** within the authorized preview-shell/SEO task; do not alter it during this audit. |
| `/manifest.webmanifest` | Static web manifest. Current file has identity/theme information and no populated icon files. | Existing endpoint/content are **PRESERVE EXACTLY**. Adding icons **NEEDS USER DECISION** and supplied/approved assets. |
| `/llms.txt` | Static machine-readable identity and canonical resource list. | Entity facts and canonical URLs are **PRESERVE EXACTLY**; future updates must track actual public routes. |
| `/googled120b1844348bc47.html` | Static Google verification file. | Filename and contents are **PRESERVE EXACTLY**. |
| `/{INDEXNOW_KEY}.txt` | Production-only Worker response when a configured key matches; noindex and cached. | Conditional behavior and secrecy are **PRESERVE EXACTLY**; never invent or expose the key. |

## Navigation, shell, and footer

| Element | Inventory | Classification |
| --- | --- | --- |
| Desktop/mobile primary destinations | Hail Repair, PDR, Gallery, Hail Tracker, Service Area, About, and primary CTA **Get Started** in both `SiteHeader` and `StormHeader`. | Labels, destinations, prominence, and mobile discoverability are **PRESERVE EXACTLY**. Visual treatment is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. |
| Internal-page utility bar | “Mobile PDR · By appointment · Northern Colorado” plus call/text number. | Facts and working links are **PRESERVE EXACTLY**; appearance is **PRESERVE / RESTYLE**. |
| Homepage storm masthead | Current mountain/storm responsive art, logo, regional label, animated cloud/rain/hail/lightning canvas, manual lightning and pause controls, responsive navigation, and reduced-motion support. | Assets, weather-animation functionality, controls, reduced-motion behavior, and access semantics are **PRESERVE EXACTLY** for later hero work. Composition is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY** only where the later task explicitly allows it. |
| Internal header | Logo/home link, current-state navigation, desktop nav, native `<details>` mobile menu. | Links, accessible names/current state, and responsive access are **PRESERVE EXACTLY**; presentation is **PRESERVE / RESTYLE**. |
| Breadcrumbs | Visible on every non-home route and connected to BreadcrumbList schema. | Hierarchy, canonical links, accessibility, and schema relationship are **PRESERVE EXACTLY**; styling is **PRESERVE / RESTYLE**. |
| Footer identity | Full public name, Greeley/Weld County/Northern Colorado focus, mobile/by-appointment, call/text, and email. | Identity and working contact links are **PRESERVE EXACTLY**; layout is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. |
| Footer “Repair” | Hail Repair, PDR, Gallery, Repair Standards, Workmanship Warranty. | Labels/destinations are **PRESERVE EXACTLY**; grouping can be **MAY REORGANIZE VISUALLY** without reducing discovery. |
| Footer “Plan” | Get Started, Service Area, Estimating & Documentation, Insurance FAQ anchor, Contact. | Labels/destinations are **PRESERVE EXACTLY**; grouping can be **MAY REORGANIZE VISUALLY** without reducing discovery. |
| Footer “Learn” | Hail Tracker, About, Resources, Weather Data Sources, Resource Feed. | Labels/destinations are **PRESERVE EXACTLY**; grouping can be **MAY REORGANIZE VISUALLY** without reducing discovery. |
| Footer legal and disclaimer | Privacy, Terms, plus nearby-weather-report and emergency-information limitation. | Destinations and disclaimer meaning are **PRESERVE EXACTLY**; presentation is **PRESERVE / RESTYLE**. |
| Skip link and landmarks | Skip to `#main`, exactly one main landmark per page, one page H1 in checked routes. | Behavior and semantics are **PRESERVE EXACTLY**. |

## Forms and customer workflow

| Item | Current implementation | Classification |
| --- | --- | --- |
| Get Started step 1 | Three choices: Hail Damage; Door Ding / Dent / Crease; Not Sure What I Need. An early privacy notice appears immediately after the choice and before personal-detail entry. | Wording, order of notice, and low-friction start are **PRESERVE EXACTLY**; control styling is **PRESERVE / RESTYLE**. |
| Get Started step 2 | Name; at least one reliable contact path through email and/or phone; vehicle year/make/model; optional message. No required service address/location. | Data minimization, required-contact rule, optional message, and separation from Service Area are **PRESERVE EXACTLY**; layout is **MAY REORGANIZE VISUALLY**. |
| Get Started step 3 | Hail choice exposes insurance routing and whether an estimate exists; photo availability is optional; there is no file upload in this form. | Conditional behavior, optional-photo rule, and no-upload truth are **PRESERVE EXACTLY**; layout is **PRESERVE / RESTYLE**. |
| Get Started step 4 | Final privacy notice, consent, Turnstile, and explicit statements that submission creates no repair authorization, charge, commitment, or checkout. | Language, consent, bot protection, and transaction boundaries are **PRESERVE EXACTLY**. |
| Get Started success | Human next steps: talk first, share photos using a later provided method, request an inspection where appropriate, or review estimate options; reiterates no charge/authorization/commitment. | Human-review sequence and promises are **PRESERVE EXACTLY**; presentation is **PRESERVE / RESTYLE**. |
| Shared `LeadForm` | Used by Contact and Free Initial Assessment. Name, preferred contact, email, phone, city/ZIP, vehicle, damage, optional message, consent, honeypot, Turnstile, and source page. | Existing fields, validation, source attribution, and submission safety are **PRESERVE EXACTLY** until an authorized workflow revision. Visual form structure is **PRESERVE / RESTYLE**. |
| Shared-form privacy timing | The shared form shows privacy/consent at final submission but not the separate early notice required by the current decision document and master brief. It also requires city/ZIP, while the Get Started flow deliberately keeps location separate. | Current production behavior is **PRESERVE EXACTLY** during preview design; reconciliation **NEEDS USER DECISION** in the later Get Started/form task. Do not silently change intake scope. |
| Server validation | Bounded body size; allowed fields and exact source pages; duplicate-field rejection; at least one contact method where applicable; honeypot; consent; CSRF/origin check; Turnstile; rate limiting; prepared D1 insert; escaped notification email; non-retention on displayed errors; fail-closed prerequisites. | **PRESERVE EXACTLY** |
| Service dependencies | Forms require explicit enablement plus D1, Turnstile, email binding, and recipient. Preview is disabled; failed prerequisites return a safe unavailable state. | **PRESERVE EXACTLY** |
| Transaction model | No cart, payment capture, purchase button, appointment promise, automatic charge, or checkout in initial lead flows. Paid estimating happens only after human identification/explanation and customer agreement. | **PRESERVE EXACTLY** |

## Hail Tracker, weather integrations, and historical data

| Item | Inventory | Classification |
| --- | --- | --- |
| Current alert source | National Weather Service active-alert API for Colorado. Local relevance uses geometry/distance where available with conservative area-name fallback. | Source, attribution, geographic logic, and limitations are **PRESERVE EXACTLY**. |
| Preliminary report source | Storm Prediction Center `today_hail.csv`; verified columns include Time, Size, Location, County, State, Lat, Lon, Comments; size is hundredths of an inch and the report day follows SPC's noon-UTC convention. | Source, parsing contract, units, timing, preliminary label, and limitations are **PRESERVE EXACTLY**. |
| Scheduled ingestion | Cloudflare Worker scheduled every five minutes; NWS is eligible each cycle and SPC is throttled to its intended ten-minute interval. Successful data is retained when an upstream retrieval fails; attempts/status are recorded in D1. | Scheduling, fail-safe retention, status recording, and database relationships are **PRESERVE EXACTLY**. |
| Freshness | NWS alerts become out of date after 15 minutes; SPC reports after 25 minutes. Missing reports never establish that no hail occurred. | **PRESERVE EXACTLY** |
| Tracker geography | Current tracker prioritizes observations within 50 statute miles of the Greeley city reference point. This weather anchor is not the 25-mile neutral mobile-service-area reference and the concepts must not be conflated. | Both scopes and their separation are **PRESERVE EXACTLY**. |
| Current UI | Source statuses/timestamps; local and broader alerts; preliminary report table; empty/failure/stale states; source panel; history link; clear non-emergency/no-vehicle-proof disclaimers. | Data and state meaning are **PRESERVE EXACTLY**; dashboard presentation is **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY**. |
| Historical archive | `data/hail-history/hail-reports-2016-2025.json`, matching CSV, summary JSON, and source manifest generated from versioned NOAA/NCEI Storm Events archives and validated by repository scripts/tests. | Files, provenance, transformations, calculations, and verified date range are **PRESERVE EXACTLY**. |
| Local tracker views | Greeley, Weld County, and Northern Colorado use source-backed filtered views and Dataset schema. Counts represent observations, not distinct storms. | Scope, filters, source links, definitions, and disclaimer are **PRESERVE EXACTLY**. |
| Current-year handling | 2026 is provisional/current and excluded from completed 2016–2025 decade totals. | **PRESERVE EXACTLY** |
| Weather schema | Dataset nodes identify temporal/spatial coverage, official creators, Peak Country publisher, source relationships, and modified dates. | **PRESERVE EXACTLY** |
| Weather-page caching | Live tracker uses short browser/shared caching and stale-if-error; generated XML/data endpoints use their declared cache rules. | **PRESERVE EXACTLY** |
| Emergency boundary | Site is informational, is not an emergency alert service, is not NOAA/NWS endorsed, and cannot prove exposure or damage to a vehicle/property. | **PRESERVE EXACTLY** |

## Gallery, repair evidence, and image assets

| Item | Inventory | Classification |
| --- | --- | --- |
| Portfolio source | `src/data/gallery.ts` is the structured public source for four real, privacy-reviewed repair groups and their precise before/after relationships. | **PRESERVE EXACTLY** |
| Pairing rule | Like-for-like angles remain together. Unmatched before images are shown honestly as context and never presented as completed pairs. | **PRESERVE EXACTLY** |
| Public disclosure | Portfolio may combine current Peak Country work with selected work personally completed by the owner during his professional PDR career; historical/current work is not split into a misleading theme. | **PRESERVE EXACTLY** |
| Image integrity | Public images may be normally cropped/straightened/adjusted but must not remove residual damage, reshape panels, fabricate results, reveal plates/private information, or use generative edits as repair evidence. | **PRESERVE EXACTLY** |
| Portfolio derivatives | Every recorded image has source-size JPEG plus WebP/AVIF and 720-pixel responsive WebP/AVIF derivatives under stable repair folders. | Files and source-to-derivative relationships are **PRESERVE EXACTLY**; responsive presentation is **PRESERVE / RESTYLE**. |
| PDR educational image | Full and 640-pixel JPEG of real reflection lighting at `/images/pdr-light-reflection-paintless-dent-repair-greeley-co*.jpg`, with factual alt/caption and ImageObject schema. | Image, meaning, alt/caption facts, and schema relationship are **PRESERVE EXACTLY**; treatment is **PRESERVE / RESTYLE**. |
| Brand logo | Full 1448×1086 PNG and 604-pixel derivative. Used in headers and schema. | Logo files, aspect ratio, identity, and schema relationship are **PRESERVE EXACTLY**; placement may be **MAY REORGANIZE VISUALLY**. |
| Storm/mountain art | Source PNG plus 960/1942 WebP derivatives; used by responsive homepage storm masthead and cloud layer. | Current assets and animation relationship are **PRESERVE EXACTLY** for the authorized hero direction; crop/treatment is **PRESERVE / RESTYLE**. |
| Social image | `/brand/facebook-cover.png`, 1942×809, used for Open Graph and Twitter cards with defined alt/type/dimensions. | File, metadata, and social-card role are **PRESERVE EXACTLY**. |
| Empty asset placeholders | `public/icons`, `public/images`, `public/models`, and `public/spline` contain `.gitkeep` placeholders (images also contains the PDR photos). | Existing repository structure is **PRESERVE EXACTLY**; populating icons/models/Spline **NEEDS USER DECISION** and approved assets. |
| `site.gallery` | `src/data/site.ts` retains an empty legacy `gallery` field while the real portfolio lives in `gallery.ts`. | **POSSIBLE DUPLICATE**; do not delete or populate without tracing consumers. |
| Further repair proof | Current decisions name Porsche, Toyota Tundra, Bedside, Honda, and Hyundai examples that are not present as approved public assets in this baseline. | **NEEDS USER DECISION** and actual privacy-reviewed source assets before use. |

## Service-area system

| Item | Inventory | Classification |
| --- | --- | --- |
| Standard zone | Approximately 25-mile geographic radius from a fixed neutral point in downtown Greeley; straight-line geography, not city limits or driving distance. | **PRESERVE EXACTLY** |
| Privacy boundary | Neutral coordinates are public map geometry only; no home/public walk-in address or meeting point is published in content or schema. | **PRESERVE EXACTLY** |
| Inside/outside behavior | Inside means standard mobile travel is included where applicable. Outside may still be served; a small fee may apply based on distance/scope and must be discussed before scheduling. Location never auto-rejects a lead. | **PRESERVE EXACTLY** |
| Communities | Greeley, Evans, Windsor, Severance, Eaton, Milliken, Johnstown, LaSalle, Kersey, Loveland, Fort Collins, Platteville. | Names and entity/schema use are **PRESERVE EXACTLY**. |
| Work conditions | Suitable access and weather; no normal rain/snow work; excessive wind may relocate/reschedule; temperatures below roughly 50–60°F may require another time/location; controlled/covered conditions preferred; hail generally benefits from/requires a controlled environment. | **PRESERVE EXACTLY** |
| Mobile expectations | Peak Country brings professional lighting/equipment; customer power normally is not required; vehicle should be reasonably clean/dry; keys/authorization may be needed; customer need not remain when access/authorization are arranged. | **PRESERVE EXACTLY** |
| Map | Lazy MapLibre import with OpenFreeMap tiles/style, circle and approved-community context, accessible written description, no-script/failure fallback. Existing large JavaScript chunk warning is tied to this feature. | Function, geography, lazy behavior, accessibility, and fallback are **PRESERVE EXACTLY**; cartography/container treatment is **PRESERVE / RESTYLE**. |

## Warranty system and documents

| Item | Inventory | Classification |
| --- | --- | --- |
| Current public page | Plain-language HTML summary at `/warranty/`; it expressly says it is not the complete warranty document. | **PRESERVE EXACTLY** until controlling documents are identified; appearance is **PRESERVE / RESTYLE**. |
| Required authoritative files | The master brief names `Peak_Country_Full_Customer_Limited_Lifetime_Workmanship_Warranty.pdf`, `Peak_Country_Limited_Lifetime_PDR_Workmanship_Warranty_Full_Terms.pdf`, `Peak_Country_Customer_Warranty_Summary.pdf`, and `Peak_Country_Internal_Warranty_Administration_and_Documentation_Standard.pdf`. None is present in this committed preview baseline. | File availability, version control, and controlling-term selection **NEEDS USER DECISION**. Do not recreate them from prose. |
| Controlling version rule | The Internal Warranty Administration and Documentation Standard is supposed to identify the controlling customer terms, but it is unavailable in this baseline. Conflicting versions must not be combined. | **PRESERVE EXACTLY** as a rule; resolution **NEEDS USER DECISION** and authoritative files. |
| Public links | The future public page may link only the current Customer Warranty Summary and controlling Full Warranty Terms. | Link targets **NEEDS USER DECISION** after documents/version are confirmed. Public architecture rule is **PRESERVE EXACTLY**. |
| Internal-only document | Internal Warranty Administration and Documentation Standard must never be exposed publicly. | **PRESERVE EXACTLY** |
| Protected source-checkout work | Outside this branch, the protected original checkout has modified warranty/global CSS files and an untracked `warranty/full-terms/` directory. It was deliberately not copied, stashed, committed, or overwritten. | Isolation is **PRESERVE EXACTLY**. Whether/how to reconcile that owner work **NEEDS USER DECISION**. |
| Current warranty facts | Original-customer ownership term; non-transferable; qualifying PDR and applicable R&I workmanship; prompt reporting/inspection-before-alteration; controlling exclusions/limitations; careful access/corrosion language. | **PRESERVE EXACTLY**; legal wording must not be rewritten from memory. |

## SEO, metadata, schema, and entity architecture

| Item | Inventory | Classification |
| --- | --- | --- |
| Per-page metadata | Unique title and description on the 27 indexable routes; canonical URL on all checked routes; exact canonical host; author and theme metadata. | Content, uniqueness, and canonical relationships are **PRESERVE EXACTLY**. Later cosmetic layout does not alter them. |
| Robots meta/header | Production pages use index/follow unless route is intentionally noindex. All non-production hosts use meta and `X-Robots-Tag: noindex, nofollow`. | **PRESERVE EXACTLY** |
| Open Graph/Twitter | Title, description, canonical `og:url`, site name, locale, shared real brand image with type/dimensions/alt, and `summary_large_image` Twitter card. | **PRESERVE EXACTLY** |
| Core graph | AutoRepair + LocalBusiness entity, WebSite, per-route WebPage/AboutPage/ContactPage/CollectionPage, visible/schema breadcrumbs, stable IDs, and publisher/about/isPartOf relationships. | Entity identity, IDs, relationships, and types are **PRESERVE EXACTLY**. |
| Business privacy | Business schema includes phone/email/service areas/offer catalog but no street address, private coordinates, ratings, review counts, tax ID, or VAT ID. | **PRESERVE EXACTLY** |
| Offer catalog | Auto Hail Repair, PDR, Door Ding/Dent/Crease Repair, Free Initial Assessment, and Vehicle Repair Planning/Documentation point to canonical service routes. | **PRESERVE EXACTLY** |
| Page-specific schema | Service, FAQPage, ImageObject, ItemList, Dataset, HowTo/HowToStep, Article, BreadcrumbList, ContactPoint, Offer/OfferCatalog, Place/City/AdministrativeArea, and conditional Person nodes where supported. | Types, facts, IDs, and page relationships are **PRESERVE EXACTLY**. |
| Owner Person entity | Person schema is conditionally supported but omitted because `ownerName` and `ownerPhoto` are null. | Current omission is **PRESERVE EXACTLY**. Public name/photo and Person schema **NEEDS USER DECISION** and verified data. |
| Social profiles / `sameAs` | `socialProfiles` is empty, so no `sameAs` or social-network footer links are emitted. | Current absence is **PRESERVE EXACTLY**. Adding verified profiles **NEEDS USER DECISION**. |
| Business hours | `hours` is null and no hours are asserted. | Current absence is **PRESERVE EXACTLY**. Publishing hours **NEEDS USER DECISION**. |
| Sitemap publication metadata | Explicit `lastmod` values are editorial dates independent of build time. | **PRESERVE EXACTLY**; update only after material reviewed changes. |
| Internal linking | Header/footer/breadcrumbs, service related-links, article resource links, tracker/history/methodology cross-links, CTA routes, and canonical URL shapes are tested for validity. | Destinations and discovery relationships are **PRESERVE EXACTLY**; link placement may be **MAY REORGANIZE VISUALLY** if visibility is retained. |
| Trailing slashes | Canonical documents use trailing slashes except `/review` and file-like endpoints. Canonical-host normalization is HTTPS, lowercase bare host. | **PRESERVE EXACTLY** |
| Legacy planning inventories | `CONTENT_INVENTORY.csv`, `DOMAIN_REDIRECTS.csv`, historical architecture/audit docs, and the implementation coexist. Some planning rows predate current index/noindex and redirect decisions. | Files are **PRESERVE EXACTLY**; overlapping/stale planning assertions are **POSSIBLE DUPLICATE**. Resolve via authority order, not deletion. |

## Redirect architecture

| Incoming host/path | Current destination/behavior | Classification |
| --- | --- | --- |
| `northerncoloradohail.com` and `www` | `301` to `https://peakcountryhail.com/hail-tracker/northern-colorado/`; incoming query retained and path intentionally ignored. | **PRESERVE EXACTLY** |
| `coloradohailtracker.com` and `www` | `301` to `https://peakcountryhail.com/hail-tracker/`; incoming query retained and path intentionally ignored. | **PRESERVE EXACTLY** |
| `greeleyhail.com` and `www` | `301` to `https://peakcountryhail.com/hail-tracker/greeley/`; incoming query retained and path intentionally ignored. | **PRESERVE EXACTLY** |
| `peakcountrypdr.com` and `www` | `301` to `https://peakcountryhail.com/paintless-dent-repair/`; incoming query retained and path intentionally ignored. | **PRESERVE EXACTLY** |
| `weldcountyhail.com` and `www` | `301` to `https://peakcountryhail.com/hail-tracker/weld-county/`; incoming query retained and path intentionally ignored. | **PRESERVE EXACTLY** |
| Canonical `http` or `www` | One direct `301` to HTTPS bare canonical host with normalized document slash and preserved query. | **PRESERVE EXACTLY** |
| Non-production missing slash | `308` to the equivalent slash-normalized local/preview URL. | **PRESERVE EXACTLY** |

## Social, reviews, and external destinations

| Item | Inventory | Classification |
| --- | --- | --- |
| Social-network links | None configured in content, shell, or schema. | Current absence is **PRESERVE EXACTLY**; verified additions **NEEDS USER DECISION**. |
| Google review destination | Official branded public path is `/review`; Worker target is the configured Google review URL. | Branded path, neutral solicitation constraints, and target relationship are **PRESERVE EXACTLY**. Changing the external target **NEEDS USER DECISION** and verification. |
| Reviews/testimonials | No current reviews are published and no rating/count schema exists. Historical testimonials may only be used sparingly with approved disclosure. | Absence of fabricated proof and no aggregate-rating claims are **PRESERVE EXACTLY**. Any supplied review/testimonial use **NEEDS USER DECISION** and source verification. |
| Official weather links | NWS, SPC, and NOAA/NCEI links appear where contextually relevant. | Sources, attribution, and official-destination meaning are **PRESERVE EXACTLY**. |

## Downloadable and machine-readable documents

| Item | Current state | Classification |
| --- | --- | --- |
| Public PDFs/DOC/DOCX | None found in the committed repository or `public/`. There are no current public warranty-document downloads. | Current absence is **PRESERVE EXACTLY**. Adding the named warranty PDFs **NEEDS USER DECISION**, authoritative files, and an approved controlling version. |
| Hail-history JSON/CSV | Repository data files support the historical experience but are not currently linked as generic customer download routes from `public/`. | Data/provenance are **PRESERVE EXACTLY**; exposing new download routes **NEEDS USER DECISION**. |
| Portfolio JSON | Public automation feed exists and is documented above. | **PRESERVE EXACTLY** |
| RSS/XML/text machine files | RSS, sitemap, robots, manifest, `llms.txt`, and verification file exist as documented above. | **PRESERVE EXACTLY** |

## Duplicate, conflict, and decision register

Nothing in this register may be deleted during the visual refresh merely because it overlaps another source.

| Finding | Required handling | Classification |
| --- | --- | --- |
| Dedicated routes and `src/data/pages.ts` both describe Auto Hail Repair, PDR, Door Ding Repair, About, Service Area, Process, Repair Standards, Data Sources, Hail Size, FAQ, and local tracker/history concepts. Physical routes currently win. | Keep both sources; use dedicated current implementation for preview content; reconcile only in a separately authorized architecture task. | **POSSIBLE DUPLICATE** |
| `CONTENT_INVENTORY.csv` contains earlier route/indexing plans, including `/hail-history/` as a hub and several “index when populated” notes that no longer describe the current implementation. | Preserve as historical planning context; current code/content metadata governs actual behavior under the authority order. | **POSSIBLE DUPLICATE** |
| `MASTER_ARCHITECTURE.md` includes older pricing/timing language while `CURRENT_DECISIONS.md` and `APPROVED_COPY.md` contain `$99`, `$149`/60–90, and `$249`/90–120. | Use current-decision values; do not rewrite or delete historical architecture during the preview. | **POSSIBLE DUPLICATE** and resolved by **PRESERVE EXACTLY** current prices. |
| Owner name/photo, business hours, and social profiles are intentionally unset. | Do not infer values or create Person/sameAs/opening-hours claims. | **NEEDS USER DECISION** |
| About currently substitutes a generated decorative PDR graphic because no owner photo is available. | Do not present decoration as repair proof or a real portrait; later visual treatment needs an approved photo or an explicitly approved non-evidentiary alternative. | **NEEDS USER DECISION** |
| Warranty PDFs and internal controlling-version document are absent; protected source checkout contains unfinished warranty work not present here. | Do not rewrite legal terms, expose internal files, or import uncommitted work automatically. | **NEEDS USER DECISION** |
| Shared Contact/Free Assessment form lacks a separate early privacy notice and requires location, unlike the explicit Get Started policy. | Preserve current route behavior for this visual audit; decide scope/timing in the later workflow task before implementation. | **NEEDS USER DECISION** |
| Privacy contact and retention schedule remain unconfirmed in the current privacy page. | Do not invent. | **NEEDS USER DECISION** |
| No verified current reviews, rating/count, case studies, published city pages, social links, or additional portfolio assets exist in this baseline. | Keep current honest empty/noindex/404 states until evidence and approval exist. | **NEEDS USER DECISION** |
| `site.gallery` is empty while `gallery.ts` is authoritative for the current portfolio. | Trace before future cleanup; do not delete. | **POSSIBLE DUPLICATE** |

## Guardrails for later preview tasks

| Guardrail | Classification |
| --- | --- |
| Keep every current public slug, redirect source/destination, canonical, breadcrumb, internal link target, sitemap inclusion/exclusion, robots state, and schema identity intact. | **PRESERVE EXACTLY** |
| Keep business identity, phone/email, service model, 20+ PDR/25+ collision distinction, no-public-address rule, insurance role, pricing, warranty limits, service-area meaning, and no-checkout workflow exact. | **PRESERVE EXACTLY** |
| Keep all weather sources, data, freshness/failure behavior, units, scopes, timestamps, archive provenance, and disclaimers exact. | **PRESERVE EXACTLY** |
| Keep all real repair images, pairings, captions/alt meaning, disclosures, privacy status, and non-manipulation rules exact. | **PRESERVE EXACTLY** |
| Preserve the full information set even when later preview pages use different hierarchy, spacing, grouping, or visual density. | **PRESERVE / RESTYLE** and **MAY REORGANIZE VISUALLY** |
| Never turn a placeholder, empty dataset, missing profile, unverified city page, missing review, missing owner asset, or missing warranty file into invented content. | **NEEDS USER DECISION** |
| Do not delete overlap during visual work; log it and preserve it until a separately authorized reconciliation. | **POSSIBLE DUPLICATE** |
