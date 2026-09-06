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
