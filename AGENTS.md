# Peak Country Hail — Agent Instructions

This repository is the source of truth for **Peak Country Auto Hail Repair & Paintless Dent Repair** and the **Northern Colorado Hail Tracker**.

## Read first
Before making architectural, content, SEO, deployment, data-model, or branding decisions, read in this order:
1. `PROJECT_CONTEXT.md`
2. `DEVELOPMENT_ROADMAP.md`
3. `SETUP_STATE.md`
4. `README.md`
5. `CONTENT_INVENTORY.csv`

## Operating rules
- Primary/canonical domain: `https://peakcountryhail.com`.
- Do not create separate content sites on the five secondary domains. They are marketing/defensive domains and must 301 redirect into the canonical site.
- Do not invent reviews, ratings, testimonials, phone numbers, addresses, certifications, warranties, pricing, insurance relationships, storm reports, or awards.
- Do not claim that a hail report proves a specific vehicle/property was hit. Nearby reports are evidence of nearby severe weather, not parcel-level proof.
- Label SPC current-day reports as **preliminary**.
- Government weather sources should be attributed clearly. Prefer NWS/NOAA/SPC/NCEI first-party data.
- Preserve the user's stated positioning: high-quality PDR, factory-finish preservation when appropriate, hail specialization, door dings/creases, mobile/service-area model. Do **not** advertise deductible saving, cash-back, rebates, or returning deductible money.
- The business is a service-area business. Do not expose or invent a public street address.
- SEO must be useful, local, and data-driven. Do not create hundreds of thin location pages or mass-generated near-duplicate AI articles.
- One factual page can target multiple related queries; avoid keyword stuffing.
- Any dynamically generated storm/location page must have enough unique data/content to justify indexing. Otherwise add `noindex`.
- Keep site fast and accessible: semantic HTML, keyboard navigation, WCAG-minded contrast, responsive layouts, minimal client JS.
- Security: validate inputs server-side, use prepared D1 statements, add Cloudflare Turnstile before public launch, never commit secrets.
- Treat `src/data/site.ts` as the single source of truth for editable business facts.
- Unknown facts stay marked `TODO` and should not render publicly unless specifically safe as a placeholder in development.

## Technical direction
- Astro on Cloudflare Workers.
- Cloudflare D1 for hail reports, weather alerts, historical storm records, leads, gallery metadata, review metadata, and ingestion logs.
- Custom Worker entrypoint supports Astro HTTP requests plus scheduled weather ingestion.
- Use Cloudflare Cron Triggers for updates.
- Use MapLibre for maps when interactive map work begins.
- Use Cloudflare Turnstile for public forms before launch.
- Use GitHub for version control and Cloudflare Workers Builds for previews/deployments.

## Agent behavior
- Make reasonable implementation decisions without repeatedly asking the non-technical owner for technical choices.
- When a credential/login/ownership action is genuinely required, stop only at that boundary and give the owner exact click-by-click instructions.
- Prefer working code over long explanations.
- Run build/type checks after meaningful changes.
- Update `SETUP_STATE.md` after infrastructure milestones.
- Keep `DEVELOPMENT_ROADMAP.md` current as milestones are completed.
- Never delete the project context/specification files.
