# Paste this into Codex first

Use this repository as the project for the task, then paste the prompt below into **Codex Code mode**.

---

You are the lead developer for Peak Country Auto Hail Repair & Paintless Dent Repair. This repository contains a starter implementation and the full product specification.

First, read `AGENTS.md`, `PROJECT_CONTEXT.md`, `DEVELOPMENT_ROADMAP.md`, `SETUP_STATE.md`, `README.md`, and `CONTENT_INVENTORY.csv` completely. Treat those files as authoritative unless the owner explicitly changes a requirement.

Then take ownership of Milestones 0–1 and proceed as far as you can without needing the owner to make a login/credential/ownership decision.

Tasks:
1. Inspect the entire repository for syntax/API issues and assumptions that may have changed in current Astro, @astrojs/cloudflare, Wrangler, and Cloudflare Workers.
2. Install current compatible dependencies, create/update the lockfile, and fix the project until it builds cleanly.
3. Preserve the canonical domain `https://peakcountryhail.com` and the domain redirect strategy.
4. Keep unknown business facts as TODOs in `src/data/site.ts`; do not invent them.
5. Ensure the core pages render, navigation works, metadata/canonical URLs are correct, and the site is responsive and accessible.
6. Ensure the custom Worker entrypoint serves Astro and can support scheduled handlers.
7. Keep SPC ingestion disabled until you have verified the current official endpoint and CSV schema from NOAA/SPC. NWS integration may be enabled using the official NWS API.
8. Run build/type checks and fix all errors.
9. If Cloudflare/GitHub authentication is already available, create a safe preview deployment on `workers.dev`. Do NOT connect the production `peakcountryhail.com` custom domain yet.
10. Update `SETUP_STATE.md` and `DEVELOPMENT_ROADMAP.md` with exactly what you completed.

If a human action is unavoidable, do not ask broad technical questions. Explain exactly one blocking action, with exact click/command instructions, then continue everything else you can do.

Do not rewrite the architecture into WordPress, Wix, Squarespace, or another stack. Do not create separate websites for secondary domains. Do not mass-generate thin SEO pages.

When finished, give the owner a concise summary under: Completed / Preview URL (if available) / Human action required / Next milestone.

---
