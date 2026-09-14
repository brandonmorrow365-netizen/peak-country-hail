# Peak Country Repository Audit

**Audited:** 2026-09-14  
**Scope:** Documentation-only baseline; no production website behavior, deployment, DNS, or public content was changed.

## Authority used

This audit follows the repository source-of-truth order:

1. `CURRENT_DECISIONS.md`
2. `APPROVED_COPY.md`
3. `MASTER_ARCHITECTURE.md`
4. Existing implementation

Newer written decisions control where this report identifies a difference.

## Repository and platform baseline

- **Framework/package manager:** Astro 7 server output, pnpm 11 workspace, TypeScript.
- **Deployment:** Cloudflare Workers adapter with `src/worker.ts`, D1 bindings, scheduled weather ingestion, and static client assets. The primary local Wrangler configuration has public Workers and preview URLs disabled. A separate production configuration declares the canonical custom-domain route, but this audit did not deploy or modify it.
- **Canonical identity:** `https://peakcountryhail.com` is configured in Astro, `src/data/site.ts`, metadata, schema, sitemap, robots, and redirect handling.
- **Application shape:** page routes are Astro files plus the `[...slug]` placeholder system; shared layout/navigation, reusable service/page components, data modules, Worker APIs, weather utilities, and global CSS live under `src/`.
- **Analytics:** no active first-party analytics/tag-manager integration was found in application code. Existing planning documents list Cloudflare Web Analytics as a future launch task.

## Current route and navigation inventory

### Routes now implemented or generated

| Area | Routes found | Classification |
| --- | --- | --- |
| Commercial | `/`, `/auto-hail-repair/`, `/paintless-dent-repair/`, `/door-ding-repair/`, `/process/`, `/repair-standards/`, `/gallery/`, `/about/`, `/service-area/`, `/contact/`, `/free-hail-inspection/`, `/faq/` | **KEEP / UPDATE** |
| Hail information | `/hail-tracker/`, city/county/regional tracker views, `/northern-colorado-hail-history/`, `/hail-history/`, `/hail-size-guide/`, `/after-a-hailstorm/`, `/data-sources/` | **KEEP / UPDATE** |
| Generated/placeholder content | `/insurance-claims/`, `/why-pdr/`, `/resources/`, `/hail-damage-guide/`, `/did-it-hail/`, `/privacy/`, `/terms/` through `[...slug]` | **UPDATE / ADD** |
| Data-driven/unpublished systems | `/case-studies/[slug]`, `/locations/[city]` | **KEEP / INVESTIGATE** |

Some paths listed in metadata are served by the slug fallback rather than dedicated files. Future work should preserve valid existing URLs while replacing thin placeholder content with approved architecture; it should not remove URLs without a redirect plan.

### Main navigation

The shared header exposes **Hail repair, PDR, Gallery, Hail tracker, About**, and a **Request an inspection** CTA. The footer adds Contact, Service area, Gallery, Repair standards, Resources, weather sources, feed, Privacy, and Terms.

- **KEEP:** Hail Repair, PDR, Gallery, and Hail Tracker are easy to discover; gallery is also linked on the homepage and footer.
- **UPDATE:** Add Service Area to the primary desktop and mobile navigation, retain About, and rename the principal CTA to the approved **Get Started**. “Request an inspection” remains appropriate only for a later routing/action within the workflow.
- **ADD:** A coherent mobile Get Started flow with the three approved initial damage choices.

## Homepage audit

The homepage currently contains a storm-brand header, hero with a free-hail-inspection CTA, tracker callout, experience/service cards, repair-standards section, featured gallery, weather-information section, local-service content, FAQ, and a second inspection CTA.

- **KEEP:** real repair examples; official-source tracker framing; clear disclaimer that nearby hail does not prove vehicle damage; direct links to core commercial and weather pages; technician-led/mobile positioning.
- **UPDATE:** align CTA labels and lead journey with “Conversation before transaction,” Free Initial Assessment, and Get Started; replace unsupported/less-specific “previous Peak Country work” wording with the approved portfolio disclosure; use approved experience language (25+ collision-industry years and 20+ professional PDR years) where the homepage is revised.
- **ADD:** an intentional “Why Peak Country” information architecture and approved Free Initial Assessment / professional-documentation hierarchy rather than treating free inspection as the sole conversion offer.
- **INVESTIGATE:** large animated storm header/hero implementation and unused Three/Spline/GSAP-related components before a future performance and design-system phase; do not redesign in this baseline task.

## Service, PDR, insurance, warranty, and pricing audit

### Hail Repair and PDR

Dedicated service pages are data-driven through `servicePages.ts`, with links to gallery, standards, process, tracker, and inspection. Existing copy already emphasizes case-by-case suitability, intact paint, access, and not forcing PDR where inappropriate.

- **KEEP:** repairability caveats, factory-finish-preservation language when appropriate, mobile conditions, and no-deductible-savings messaging.
- **UPDATE:** replace remaining broad “insurance claims” positioning with the approved repair-focused insurance role and approved FAQ language; use the approved repair-evaluation, documentation, and mobile-service wording during the staged service-page phase.

### Pricing

No public paid-estimating price, PDR matrix, dent-count calculator, generic checkout, or Mitchell integration was found in the application code.

- **KEEP:** absence of public hail matrix, calculator, and checkout.
- **ADD:** when the approved estimating/documentation phase is intentionally implemented, publish the current values only: $0 Free Initial Assessment, $99 Non-Hail PDR Estimate & Documentation, $149 Comprehensive Estimate Review, and $249 Comprehensive Hail Estimate. Present these as an explanation of professional services, not SaaS-style pricing cards.
- **REMOVE/DEPRECATE:** older architecture language that refers to $249–$299, $250, 120 minutes, or “substantially as estimated”; the current decisions supersede it before public implementation.

### Insurance and warranty

Existing copy correctly avoids deductible rebates and generally says coverage decisions remain with the insurer. The current About FAQ says Peak Country “works with insurance hail damage claims,” which is too broad compared with the approved, repair-centered role.

- **KEEP:** no insured badge/claim was found; no deductible waiver or payment promise was found.
- **UPDATE:** use the approved insurance disclaimer and distinguish evaluating/documenting repair from deciding coverage, acting as insurer, agent, or public adjuster.
- **ADD:** an approved Limited Lifetime Workmanship Warranty presentation, including original-customer ownership, non-transferability, inspection opportunity, exclusions, and the 30-calendar-day reporting standard.

## Gallery and repair proof audit

`src/data/gallery.ts` defines a real before/after portfolio. The gallery groups vehicle-level cases, retains additional context angles, uses responsive AVIF/WebP/JPEG images, provides descriptive alt text, and emits ImageObject/ItemList structured data. It is featured on the homepage and linked from service-related pages.

- **KEEP:** unified portfolio structure, multi-angle presentation, privacy-minded photo approach, responsive image formats, and real-work emphasis.
- **UPDATE:** replace “previous Peak Country PDR work” and “real historical” language with the approved subtle career-work disclosure; avoid implying every historical repair was performed under the Peak Country entity.
- **ADD:** owner-confirmed plate/privacy review and the approved gallery disclosure on the public portfolio. Prioritize Silverado, Murano, Porsche, and Tundra when corresponding approved assets are ready; retain the existing gallery framework.
- **INVESTIGATE:** whether the present gallery asset set includes all approved vehicle groups and whether all visual identifiers have been reviewed.

## Hail Tracker and history audit

The live tracker reads D1-backed NWS alerts and preliminary SPC hail reports, labels source/freshness/staleness, prioritizes a 50-mile city-reference radius, distinguishes local/broader alerts, and repeatedly states that reports do not prove vehicle damage. Historical hail is a separate NOAA/NCEI 2016–2025 archive with filterable records, a lightweight canvas plot, a Dataset schema node, methodology, and source links.

- **KEEP:** source attribution, preliminary SPC labeling, stale/error states, official-source links, D1 ingestion, safety limitations, and strict separation of live preliminary vs. historical data.
- **UPDATE:** reconcile the present 50-mile tracker/history geography and “hail history” route naming with the new commercial/service-area architecture only when the planned architecture phase addresses it; do not change weather-data behavior in this task.
- **ADD:** future MapLibre, warning-polygon/report-point experience, and carefully worded address checker only after the dedicated tracker/service-area phases. It must not claim a vehicle or property was hit.
- **INVESTIGATE:** scheduled ingestion reliability and data freshness in a non-public preview environment; this audit did not run remote services.

## Service Area, About, and Get Started audit

### Service Area

The current page lists the approved cities, correctly identifies the business as mobile/by appointment, and avoids a public street address. It describes availability as individually confirmed.

- **KEEP:** no storefront/address claim, city list, mobile context, and direct service request path.
- **UPDATE:** replace general availability language with the current standard: approximately 25-mile geographic radius from a neutral downtown-Greeley reference point, included mobile travel where applicable, and possible pre-discussed small fee outside the circle. Do not use city limits as the measuring rule or automatically reject outside-circle requests.
- **ADD:** interactive map and later address checker using the neutral fixed point; keep Service Area separate from service-request intake.

### About

The page presents technician-led service, 20+ years of PDR experience, no public owner name, and mobile Northern Colorado service.

- **KEEP:** technician-led positioning; no home address; no unsupported certification or insurance claim.
- **UPDATE:** adopt the approved detailed experience narrative and current 25+/20+ factual claims; remove generic quality claims where proof/approved copy should carry the message; narrow insurance FAQ wording.

### Get Started and forms

Contact and free-hail-inspection pages share `LeadForm`. It collects name, preferred contact, email, phone, city/ZIP, vehicle, damage type, optional message, and consent. The form is fail-closed unless Worker/D1/Turnstile/email configuration is ready; online submissions are currently disabled by the non-production configuration.

- **KEEP:** no automatic charge, no checkout, no repair authorization, consent control, fail-closed behavior, and direct phone/text alternatives.
- **UPDATE:** current form requires both city/ZIP and vehicle and does not implement the approved initial three-choice Get Started route, optional photos, “at least one reliable contact method,” or privacy notice near both beginning and final submission.
- **ADD:** a staged Get Started shell with Hail Damage / Door Ding, Dent, or Crease / Not Sure What I Need, low-friction intake, approved privacy notices, and a post-submission conversation-first next step. Use “Request an Inspection” only once requirements are known.
- **INVESTIGATE:** approved operational forms and private delivery configuration before enabling production submissions. Do not put private destinations or credentials in documentation or code.

## SEO, structured data, metadata, and linking audit

All layout-rendered pages receive title, description, canonical URL, robots meta, Open Graph/Twitter metadata, and an entity/WebSite/WebPage/Breadcrumb JSON-LD graph. Dedicated pages add FAQ, Service, Dataset, or gallery image schema where relevant. `sitemap.xml.ts` is driven by manually maintained indexable content metadata. `robots.txt.ts` blocks non-production and provides production sitemap directives; noncanonical hosts are redirected by the Worker. Secondary domains map into canonical topical destinations.

- **KEEP:** canonical hostname discipline, `noindex` behavior for preview and selected placeholders, sitemap-driven indexable set, secondary-domain redirects, entity graph, image/dataset schema, source metadata, and pervasive contextual internal links.
- **UPDATE:** add future approved page hierarchy and linking only after the corresponding implementation phase; ensure schema service offerings and public copy remain synchronized with the current decisions.
- **ADD:** a dedicated About/Why Peak Country architecture, Get Started journey, warranty and insurance FAQ pages/sections, and service-area map content before representing them in metadata as complete.
- **INVESTIGATE:** the mismatch between footer/internal links and route/index metadata for resource/placeholder pages; validate after staged replacement. Analytics remains unimplemented.

## Obsolete, duplicated, and preservation inventory

| Classification | Finding | Required handling |
| --- | --- | --- |
| **KEEP** | Astro/Cloudflare Worker/D1 foundation, canonical redirects, weather system, gallery data model, existing URLs, responsive image assets, SEO utilities | Preserve while future phases replace only scoped content or behavior. |
| **UPDATE** | `site.proposedRadiusMiles` is 30 while current decision is approximately 25 miles; CTA text is free inspection/request inspection instead of Get Started | Change only in the relevant future service-area/workflow phase. |
| **UPDATE** | About/gallery wording treats owner career work as “previous Peak Country” work | Use approved historical-work disclosure. |
| **UPDATE** | Header omits Service Area; CTA wording does not follow approved navigation | Address in global navigation phase. |
| **ADD** | Current paid-estimate hierarchy, warranty, formal insurance FAQ, map/address checker, workflow shell, privacy notices | Implement in the documented staged phases, not this audit. |
| **REMOVE/DEPRECATE** | Placeholder `[...slug]` page content once a dedicated approved replacement exists; legacy 30-mile/default service-area data; superseded price language in older architecture | Retain routes/redirects until a replacement is verified; do not delete in baseline. |
| **INVESTIGATE** | Multiple legacy visual/animation components and dependencies (Three, Spline, GSAP) alongside a canvas storm header | Audit actual imports, bundle cost, and design-system fit during consolidation; no removal now. |

## Audit conclusion

The existing site has a valuable technical and content base that should be preserved: canonical/SEO controls, truthful weather-data handling, lead-form safeguards, gallery foundation, service-page routes, and explicit mobile/service-area behavior. The primary gap is not a wholesale rebuild; it is alignment with the new business architecture—especially navigation, Get Started, Free Initial Assessment and paid documentation rules, 25-mile service-area standard, approved historical-proof language, insurance role, warranty, and a unified staged page hierarchy.

No deployment, DNS change, analytics activation, form activation, or production website modification occurred as part of this audit.
