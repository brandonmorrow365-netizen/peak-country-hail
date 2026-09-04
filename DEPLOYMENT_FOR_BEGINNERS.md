# Beginner Deployment Guide

You should not need to understand the code to start.

## Simplest workflow
### A. Put this starter into GitHub
1. Sign in to GitHub.
2. Create a **private** repository named `peak-country-hail`.
3. Upload the **contents** of this starter folder (not the outer ZIP itself) to the repository, or let Codex import/create the repository from the local folder if your Codex interface offers that flow.
4. Commit the files.

### B. Give Codex the project
1. Open Codex.
2. Connect GitHub if prompted.
3. Select the `peak-country-hail` repository/environment.
4. Open `CODEX_START_HERE.md` and paste its prompt into Codex Code mode.
5. Let Codex fix/install/build the starter and create the first preview.

### C. Cloudflare
When Codex reaches the Cloudflare boundary, the preferred beginner path is:
1. Sign in to Cloudflare.
2. Open **Compute > Workers & Pages**.
3. Choose **Create application** / import repository.
4. Select the GitHub `peak-country-hail` repository.
5. Use build command: `npx astro build`.
6. Use deploy command: `npx wrangler deploy`.
7. Deploy to the generated `workers.dev` preview first.
8. Do **not** attach `peakcountryhail.com` until the preview is approved.

### D. Database
Codex should do the code work. The only likely human step is authenticating Cloudflare. Once authenticated, Codex/Wrangler can create D1 and apply migrations.

### E. Production domains
At launch:
- Attach `peakcountryhail.com` to the Worker.
- Import `DOMAIN_REDIRECTS.csv` into Cloudflare Bulk Redirects and enable the rule.
- Test all six domains on both HTTP and HTTPS.

## What NOT to do
- Do not buy another web-hosting plan.
- Do not start a WordPress/Wix/Squarespace site.
- Do not point all six domains at separate copies of the site.
- Do not publish the preview merely because it builds.
- Do not paste API secrets into source files or GitHub.
