# Foundation handoff — 2026-09-04

## What was actually uploaded
The remote repository contained 16 root specification/configuration files but no src, public or migrations directories. This implementation supplies the missing application; it does not recover an unseen earlier application or logo.

## Verified official references
- Astro adapter custom Worker handler and binding access: https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- Workers deployment guide: https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/
- Turnstile server verification: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- NWS API: https://www.weather.gov/documentation/services-web-api
- SPC report-day and size units: https://www.spc.noaa.gov/climo/reports/
- Live header fetched from https://www.spc.noaa.gov/climo/reports/today_hail.csv and rows checked from yesterday_hail.csv on 2026-09-04. Header: Time,Size,Location,County,State,Lat,Lon,Comments. Coordinates are signed decimal degrees, size is hundredths of an inch, day is noon-to-noon UTC.

## Validation
`npm ci`, `npm run check`, `npm test`, `npm run build`, `npx wrangler deploy --dry-run`.
Apply local schema: `npx wrangler d1 migrations apply peak-country-hail-db --local --config wrangler.local.jsonc`.
With `npm run dev` or `npm run preview` serving on port 4321, run `npm run test:site`.
On environments with restricted native filesystem watchers, use `CHOKIDAR_USEPOLLING=true npm run dev`.

## Account-owned preview deployment
1. Authorize Wrangler with account/user read, Workers scripts write, and D1 write. Browser login alone does not authorize the command-line deployment tool.
2. Create `peak-country-hail-db` and add its real DB binding to wrangler.jsonc. Never deploy the local-only database ID.
3. Apply remote migration; keep FORMS_ENABLED=false. Enable WEATHER_ENABLED only after remote ingestion/query validation. This preview can deploy with weather unavailable before D1 is provisioned.
4. Build and deploy the named preview Worker. No custom domain routes are configured. Preview robots/header directives discourage indexing but do not restrict access.
5. Authenticate GitHub, push the `codex/foundation-preview` branch, review changes, and connect Workers Builds only after the complete application is available remotely. Use `npm run build` and `npx wrangler deploy`.

## Remaining launch gates
Owner-approved logo, business contact/hours/service area, insurance wording, privacy contact and retention; real gallery/reviews; Turnstile keys; notification delivery/lead monitoring; edge rate rule; source ingestion/error reconciliation tests against remote D1; accessibility and performance audit. Only then review production connection and secondary-domain redirects.

No actual lead was transmitted during tests. Database insertion uses an isolated in-memory SQLite database and a mocked Turnstile result. No public weather observations or business claims were fabricated.
