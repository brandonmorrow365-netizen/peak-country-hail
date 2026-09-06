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

Cloudflare Email Routing handles inbound mail. The website contact form uses a separate Cloudflare-native notification path. Production submissions pass server-side validation and Turnstile verification, are stored in D1, and are then sent through the Worker's `CONTACT_EMAIL` binding to a verified private destination. The recipient is held in the encrypted `CONTACT_EMAIL_RECIPIENT` Worker secret. The notification uses `website@peakcountryhail.com` as its internal sender and the validated customer email as `Reply-To` when one is supplied. D1 records the notification status and Cloudflare message ID; a send failure does not discard the saved lead.

General Email Sending domain onboarding is not enabled. Cloudflare permits the Worker binding to send to a verified Email Routing destination on the current plan. The live production test completed through that restricted use case without adding another mail provider or changing the public business identity.

No private forwarding destination, passwords, API credentials, verification tokens, or private keys belong in this repository.
