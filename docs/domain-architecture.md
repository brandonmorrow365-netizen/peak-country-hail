# Peak Country domain architecture

## Primary application

`https://peakcountryhail.com` is the only canonical and indexable website. The Cloudflare Worker `peak-country-hail` serves this hostname through a Worker Custom Domain. Production uses `wrangler.production.jsonc`; review builds continue to use the separate `peak-country-hail-preview` Worker and remain non-indexable.

## Permanent redirects

| Source | Destination | Path behavior |
| --- | --- | --- |
| `www.peakcountryhail.com` | `https://peakcountryhail.com` | Preserve path and query |
| `peakcountrypdr.com` and `www` | `https://peakcountryhail.com/paintless-dent-repair/` | Discard source path; preserve query |
| `coloradohailtracker.com` and `www` | `https://peakcountryhail.com/hail-tracker/` | Discard source path; preserve query |
| `northerncoloradohail.com` and `www` | `https://peakcountryhail.com/hail-tracker/northern-colorado/` | Discard source path; preserve query |
| `greeleyhail.com` and `www` | `https://peakcountryhail.com/hail-tracker/greeley/` | Discard source path; preserve query |
| `weldcountyhail.com` and `www` | `https://peakcountryhail.com/hail-tracker/weld-county/` | Discard source path; preserve query |

The alias hostnames are handled by Cloudflare account-level Bulk Redirects. Redirect-only apex and `www` names use proxied placeholder A records (`192.0.2.1`) solely to bring requests through Cloudflare. Email, registrar, DNSSEC, ownership, and unrelated DNS records are outside this configuration and must be preserved.

## Search behavior

Canonical, Open Graph, structured-data, sitemap, and robots URLs use `https://peakcountryhail.com`. Preview hosts return `noindex, nofollow`; production returns indexable metadata and a robots file that references `https://peakcountryhail.com/sitemap.xml`.

A future verified Google Business Profile URL can be added to `site.socialProfiles`, which feeds `sameAs` without inventing a profile or review schema.

## Business email

- **Temporary inbound provider:** Cloudflare Email Routing
- **Public address:** `info@peakcountryhail.com`
- **Forwarding aliases:** `info@`, `estimates@`, `contact@`, and `hail@` route to one verified private destination address
- **Catch-all:** disabled
- **MX:** Cloudflare-managed `route1.mx.cloudflare.net`, `route2.mx.cloudflare.net`, and `route3.mx.cloudflare.net` records
- **SPF:** one Cloudflare-managed root TXT record: `v=spf1 include:_spf.mx.cloudflare.net ~all`
- **DKIM:** Cloudflare-managed Email Routing DKIM record
- **DMARC:** not configured during this temporary forwarding phase
- **Google Workspace migration:** when Workspace becomes available, verify the domain, replace the Cloudflare Email Routing MX/SPF/DKIM records with Google's documented values, recreate the required mailboxes or aliases, verify delivery, and then disable Cloudflare Email Routing. Do not run both inbound MX configurations at the same time.

Cloudflare Email Routing handles inbound mail only. The website contact form is a separate path: when enabled, it validates Turnstile and stores valid submissions in Cloudflare D1. The current production configuration has `FORMS_ENABLED=false`, and the repository contains no transactional email provider or outbound notification call. Therefore a form submission cannot currently produce an email notification. Enabling the form requires production Turnstile secrets and a deliberate outbound notification implementation; Cloudflare Email Routing must not be treated as that sender.

No private forwarding destination, passwords, API credentials, verification tokens, or private keys belong in this repository.
