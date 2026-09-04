# Peak Country Hail

Starter repository for **Peak Country Auto Hail Repair & Paintless Dent Repair** and its Northern Colorado hail-information platform.

## Canonical site
`https://peakcountryhail.com`

## Stack
- Astro
- Cloudflare Workers
- Cloudflare D1
- Cloudflare Cron Triggers
- Cloudflare Turnstile before public launch
- MapLibre in Phase 2

## Start locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy preview
```bash
npm run deploy
```

Cloudflare's current Astro/Workers flow supports deploying Astro to Workers and previewing on a `workers.dev` subdomain. Keep the production custom domain disconnected until launch QA is complete.

## D1 setup
When authenticated to Cloudflare:
```bash
npx wrangler d1 create peak-country-hail-db
```
Copy the returned database binding information into `wrangler.jsonc` using binding name `DB`, then apply the migration:

```bash
npx wrangler d1 migrations apply peak-country-hail-db --local
npx wrangler d1 migrations apply peak-country-hail-db --remote
```

## Important
Read `AGENTS.md` and `PROJECT_CONTEXT.md` before changing architecture/content.
