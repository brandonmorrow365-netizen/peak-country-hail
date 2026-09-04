# Project Context — Peak Country Auto Hail Repair & Paintless Dent Repair

## 1. Business and project goal
Build a high-performance local-service website and useful regional hail/weather resource for:

**Peak Country Auto Hail Repair & Paintless Dent Repair**

The website has two equally important jobs:
1. Generate qualified leads for automotive hail repair and paintless dent repair (PDR).
2. Become a genuinely useful Northern Colorado hail-information resource that earns organic search traffic, repeat visits, citations, links, and AI/search-engine visibility.

The weather product should not feel like SEO bait. It should answer real questions such as:
- Is there a current hail/severe thunderstorm threat near Greeley?
- Where was hail reported today in Northern Colorado?
- How large was the hail?
- When did it occur?
- What does a reported hail size look like?
- What hail events have occurred historically in Greeley/Weld County?
- What should a vehicle owner do after a hailstorm?
- Could recent nearby hail justify inspecting a vehicle for damage?

The commercial funnel should be natural: useful weather information first, then a relevant invitation to request a hail-damage inspection or PDR estimate.

## 2. Geographic focus
Primary business/service focus:
- Greeley, Colorado
- Weld County
- Northern Colorado
- Roughly a 30-mile service radius around Greeley, subject to final owner confirmation.

Priority communities for useful content/service-area coverage include:
- Greeley
- Evans
- Windsor
- Severance
- Eaton
- Milliken
- Johnstown
- LaSalle
- Kersey
- Loveland
- Fort Collins (where within operational service range)
- Platteville / Mead / nearby communities where appropriate

Do not publish a claim that every listed community is served until the owner approves the final service-area list in `src/data/site.ts`.

## 3. Experience and positioning
Known business positioning from planning conversations:
- Approximately 20 years of PDR experience.
- Hail repair is the primary target service.
- Door dings, dents, and repairable creases are secondary PDR services.
- Emphasize preserving original/factory paint when PDR is appropriate.
- Emphasize careful repair quality and straightforward communication.
- Do not advertise “saving deductibles,” cash back, rebate schemes, or returning money to customers.
- The business is intended as a mobile/service-area operation rather than a storefront-dependent model.

## 4. Canonical domain and purchased domains
### Canonical website
**https://PeakCountryHail.com**

Use lowercase canonical URLs in code:
`https://peakcountryhail.com`

### Secondary purchased domains
1. `NorthernColoradoHail.com`
2. `ColoradoHailTracker.com`
3. `GreeleyHail.com`
4. `PeakCountryPDR.com`
5. `WeldCountyHail.com`

These are NOT independent SEO websites. Configure permanent 301 redirects:
- `northerncoloradohail.com` -> `https://peakcountryhail.com/hail-tracker/northern-colorado/`
- `coloradohailtracker.com` -> `https://peakcountryhail.com/hail-tracker/`
- `greeleyhail.com` -> `https://peakcountryhail.com/hail-tracker/greeley/`
- `peakcountrypdr.com` -> `https://peakcountryhail.com/paintless-dent-repair/`
- `weldcountyhail.com` -> `https://peakcountryhail.com/hail-tracker/weld-county/`

Preserve useful path/query behavior where Cloudflare redirect configuration permits it without creating loops.

## 5. Brand direction
The owner selected an existing official master logo from prior design work. It is a navy shield/badge design with:
- mountain imagery
- hail/storm imagery
- sleek car silhouette
- large “PEAK COUNTRY” text
- “AUTO HAIL REPAIR & PAINTLESS DENT REPAIR” supporting text
- crossed PDR tools

Do not replace or reinterpret the official logo when the real asset is supplied. The starter repository contains a temporary placeholder only.

Visual direction:
- trustworthy Northern Colorado / mountain / storm aesthetic
- deep navy and slate base
- bright ice/storm accent
- white/light neutral backgrounds
- clean automotive photography
- avoid cliché “cheap dent repair” visual language
- strong mobile usability
- weather data must remain readable during stressful post-storm use

## 6. Core site architecture
### Commercial pages
- `/` Home
- `/auto-hail-repair/`
- `/paintless-dent-repair/`
- `/door-ding-repair/`
- `/why-pdr/`
- `/insurance-claims/`
- `/process/`
- `/gallery/`
- `/reviews/`
- `/about/`
- `/service-area/`
- `/contact/`
- `/free-hail-inspection/`
- `/faq/`

### Hail/weather product
- `/hail-tracker/`
- `/hail-tracker/northern-colorado/`
- `/hail-tracker/greeley/`
- `/hail-tracker/weld-county/`
- `/hail-history/`
- `/hail-history/greeley/`
- `/hail-history/weld-county/`
- `/storms/`
- `/storms/[year]/[month]/[day]/[slug]/` (future data-driven event pages)
- `/did-it-hail/`
- `/hail-size-guide/`
- `/after-a-hailstorm/`
- `/hail-damage-guide/`
- `/resources/`

### Legal/support
- `/privacy/`
- `/terms/`
- `/data-sources/`

## 7. Hail tracker features
### Phase 1
- Current active Colorado/Northern Colorado NWS severe alerts.
- Recent preliminary SPC hail reports, filtered to Colorado and then Northern Colorado where appropriate.
- Report table: time, location, county, state, hail size, latitude/longitude, source, preliminary status.
- Clear “last updated” timestamp.
- Source attribution and data disclaimers.
- Mobile-first layout.
- Relevant CTA after data, not before it.

### Phase 2
- Interactive MapLibre map.
- Warning polygons from NWS alert geometry.
- Hail-report points.
- Filters for date, city/county, hail size.
- Historical NOAA/NCEI Storm Events ingestion.
- Searchable hail history.
- “Did it hail near me?” location/address workflow.
- Significant storm-event pages.

### Phase 3
- Regional/statewide expansion when justified by traffic.
- Better storm clustering/footprint presentation.
- Potential NCEI Event Footprint Catalog or other authoritative geospatial sources after licensing/data-quality review.
- Embeddable/local-media-friendly data assets if useful for legitimate backlink acquisition.

## 8. Authoritative weather sources
Prefer first-party sources and attribute them.

### National Weather Service API
Documentation: `https://www.weather.gov/documentation/services-web-API`
Base API: `https://api.weather.gov`
Use cases:
- active alerts
- alert geometry
- forecasts/observations later if useful

Initial alert query:
`https://api.weather.gov/alerts/active?area=CO`

### NOAA Storm Prediction Center (SPC)
Main site: `https://www.spc.noaa.gov/`
Current storm reports page family: `https://www.spc.noaa.gov/climo/reports/`
Expected current hail CSV endpoint to verify during integration testing:
`https://www.spc.noaa.gov/climo/reports/today_hail.csv`

SPC reports are preliminary. Label them that way.

### NOAA/NCEI Storm Events Database
Main database:
`https://www.ncei.noaa.gov/stormevents/`
Bulk CSV directory:
`https://www.ncei.noaa.gov/pub/data/swdi/stormevents/csvfiles/`
Use for historical hail records. Hail records are available historically from the mid-1950s onward, subject to database collection-period limitations.

### NOAA/NCEI Severe Weather Data Inventory
`https://www.ncei.noaa.gov/maps/swdi/`
Potential future supplemental source for severe weather / radar-derived hail signatures. Do not treat radar hail signatures as ground-truth measured hail without clear labeling.

### NCEI Event Footprint Catalog
`https://www.ncei.noaa.gov/products/event-footprint-catalog`
Potential future geospatial/event-footprint source. Evaluate before production integration.

## 9. Data quality rules
- Show source name and freshness timestamp.
- Distinguish preliminary SPC reports from finalized historical NOAA/NCEI records.
- Never claim an address was hit solely because a nearby report exists.
- “Did it hail near me?” should use careful language such as “hail was reported within X miles” or “nearby reports indicate possible hail in the area.”
- Avoid using current radar-estimated hail as measured hail unless clearly marked as radar-estimated.
- Store raw source payloads where practical for traceability.
- Deduplicate reports deterministically.
- Log ingestion runs and errors.

## 10. Reviews strategy
Create a strong `/reviews/` page, but do not fabricate content.

Future supported review sources may include:
- Google Business Profile
- Facebook recommendations/reviews where available
- verified customer-provided testimonials

Rules:
- Store source URL and date.
- Never silently rewrite customer reviews.
- Avoid prohibited review-gating practices.
- Add review schema only when it complies with current search-engine structured-data rules and accurately represents eligible reviews.

Until real verified reviews are supplied/connected, render an honest development placeholder or omit rating aggregates.

## 11. Gallery strategy
Gallery should support:
- hail before/after
- door ding before/after
- crease repair before/after when repair quality is visible
- location/service type tags
- descriptive alt text
- captions explaining repair context without exaggerated claims
- WebP/AVIF optimized versions where possible

The owner has historical PDR repair photos from prior work/business activity. Do not import or publish any image until the owner supplies/approves the file and confirms rights/appropriate representation.

## 12. Contact and lead capture
Create forms for:
- general contact
- free hail inspection
- PDR estimate request

Suggested fields:
- name
- phone
- email
- city/ZIP
- vehicle year/make/model
- type of damage
- approximate storm/date (optional)
- message
- photo upload (Phase 2; use R2 once implemented)
- preferred contact method
- source page/storm event
- consent acknowledgment

Use Cloudflare Turnstile before public launch.
Store leads in D1. Add email notification after an outbound email provider/path is configured.

## 13. SEO strategy
Core principles:
- One canonical domain.
- Strong internal linking between weather pages and relevant service pages.
- Useful local data beats generic location keyword pages.
- Build topic authority around Northern Colorado hail, PDR, vehicle hail damage, hail history, and post-storm guidance.
- Location pages must contain unique local data and meaningful service information.
- Do not mass publish AI pages.
- Programmatic storm pages should be indexable only when they contain substantial unique event data and context.
- Use canonical tags, breadcrumbs, XML sitemap, robots.txt, structured data, descriptive titles/meta descriptions, Open Graph data, and image alt text.
- Optimize Core Web Vitals and mobile usability.

### AEO/GEO / AI discoverability
- Write factual, direct answers beneath clear headings.
- Use tables and definitions where useful.
- Attribute official sources.
- Maintain a clear `About`, `Data Sources`, `Service Area`, and `Contact` identity.
- Include concise machine-readable JSON-LD.
- `public/llms.txt` is included as a supplementary non-standard discovery aid; do not depend on it for rankings.

## 14. Backlink strategy
Do not buy spam links or create private-blog-network style backlinks.
Build linkable assets:
- Northern Colorado Hail Tracker
- Greeley/Weld County hail history pages
- post-storm event summaries
- hail-size reference guide
- historical hail statistics
- useful maps/data visualizations

Legitimate outreach targets later:
- local news/weather reporters
- community/neighborhood sites
- chambers/business directories
- local auto organizations
- insurance/agent resource pages where editorially appropriate
- Colorado/Northern Colorado community blogs
- storm/weather enthusiast communities
- local government/emergency-preparedness resource lists when genuinely relevant

See `BACKLINK_PLAYBOOK.md`.

## 15. Analytics and search platforms
Before launch or immediately after:
- Google Search Console (domain property via DNS)
- Bing Webmaster Tools
- Cloudflare Web Analytics
- Google Business Profile for a service-area business with public address hidden if appropriate under current Google rules

Do not publish fake location/address data to manipulate local rankings.

## 16. Technical stack
- Astro
- Cloudflare Workers
- Cloudflare D1
- Cloudflare Cron Triggers
- Cloudflare Turnstile
- Cloudflare Web Analytics
- MapLibre (map UI, Phase 2)
- GitHub
- Codex as primary coding agent; Claude Code can be used as a second code-review agent.

## 17. Launch philosophy
The site should launch as a polished business website with a useful initial hail tracker, not wait until every advanced weather feature is finished.

Recommended sequence:
1. Foundation + design system
2. Core commercial pages
3. Contact/lead database
4. Phase-1 hail tracker
5. Technical SEO and accessibility
6. Preview QA
7. Connect primary domain
8. Configure five 301 redirects
9. Search Console / analytics / GBP
10. Expand historical/map features based on real demand and search data
