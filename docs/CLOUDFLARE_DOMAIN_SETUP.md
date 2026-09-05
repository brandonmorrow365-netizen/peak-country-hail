# Cloudflare domain setup for Peak Country

Repository code is prepared, but no production domain, DNS record, Worker route, or Redirect Rule is created by this document. Complete these steps only after the owner approves production launch.

## Final hostname behavior

| Domain | Behavior | Destination |
| --- | --- | --- |
| `peakcountryhail.com` | Serve the canonical production Worker over HTTPS | `https://peakcountryhail.com/` |
| `www.peakcountryhail.com` | 301; preserve path and query | `https://peakcountryhail.com/<same-path>` |
| `northerncoloradohail.com` and `www` | 301; discard path, preserve query | `https://peakcountryhail.com/hail-tracker/northern-colorado/` |
| `coloradohailtracker.com` and `www` | 301; discard path, preserve query | `https://peakcountryhail.com/hail-tracker/` |
| `greeleyhail.com` and `www` | 301; discard path, preserve query | `https://peakcountryhail.com/hail-tracker/greeley/` |
| `peakcountrypdr.com` and `www` | 301; discard path, preserve query | `https://peakcountryhail.com/paintless-dent-repair/` |
| `weldcountyhail.com` and `www` | 301; discard path, preserve query | `https://peakcountryhail.com/hail-tracker/weld-county/` |

The Worker repeats these rules in `src/lib/domain-routing.ts` as a fallback. Cloudflare Redirect Rules remain preferred for the five secondary zones because they redirect before website content is served.

## 1. Confirm all six zones

In **Cloudflare Dashboard → Account Home → Domains**, confirm that all six apex domains are active Cloudflare zones using Cloudflare nameservers. Do not continue with a domain that is not active.

## 2. Prepare the canonical production domain at launch

1. Deploy the reviewed production Worker with `SITE_STAGE=production`. Do not reuse the preview environment as production.
2. Go to **Workers & Pages → select the production Worker → Settings → Domains & Routes**.
3. Select **Add → Custom Domain**.
4. Enter `peakcountryhail.com` and select **Add Custom Domain**.
5. Confirm Cloudflare created the DNS record and issued an active certificate.
6. Leave the Worker `workers.dev` production URL and version preview URLs disabled unless a temporary review is explicitly required.

## 3. Normalize canonical HTTP and www requests

In the `peakcountryhail.com` zone:

1. Go to **DNS → Records**. Create a proxied `AAAA` record named `www` with IPv6 address `100::` if no proxied `www` record exists. Do not overwrite an existing live record without reviewing it.
2. Go to **Rules → Overview → Create rule → Redirect Rule**.
3. Create `Canonical HTTP to HTTPS` using wildcard pattern `http://peakcountryhail.com/*`.
4. Set target URL to `https://peakcountryhail.com/${1}`, status `301`, and **Preserve query string** to On.
5. Create `Canonical www to apex` using wildcard pattern `http*://www.peakcountryhail.com/*`.
6. Set target URL to `https://peakcountryhail.com/${1}`, status `301`, and **Preserve query string** to On.
7. Deploy both rules and confirm that each request reaches the canonical URL in one redirect.

## 4. Configure each secondary zone

Repeat the following steps in each secondary domain's Cloudflare zone:

1. Go to **DNS → Records**.
2. Ensure the apex (`@`) and `www` each have a proxied record. For an originless redirect zone, create proxied `AAAA` records pointing to `100::`. Do not overwrite existing live records without reviewing them.
3. Go to **Rules → Overview → Create rule → Redirect Rule**.
4. Choose **All incoming requests**.
5. Choose a static URL redirect, set status to `301`, and turn **Preserve query string** On.
6. Enter the exact destination from this table and deploy:

| Zone | Rule name | Static destination |
| --- | --- | --- |
| `northerncoloradohail.com` | `Northern Colorado Hail canonical redirect` | `https://peakcountryhail.com/hail-tracker/northern-colorado/` |
| `coloradohailtracker.com` | `Colorado Hail Tracker canonical redirect` | `https://peakcountryhail.com/hail-tracker/` |
| `greeleyhail.com` | `Greeley Hail canonical redirect` | `https://peakcountryhail.com/hail-tracker/greeley/` |
| `peakcountrypdr.com` | `Peak Country PDR canonical redirect` | `https://peakcountryhail.com/paintless-dent-repair/` |
| `weldcountyhail.com` | `Weld County Hail canonical redirect` | `https://peakcountryhail.com/hail-tracker/weld-county/` |

Because each static destination already uses HTTPS and the canonical apex hostname, these rules avoid redirect chains and loops. Both HTTP and HTTPS requests, including `www`, go directly to the final destination.

## 5. Validate after launch

Test every apex and `www` hostname over HTTP and HTTPS with and without a query string. Each secondary request must return one `301` whose `Location` is the specified `https://peakcountryhail.com` URL. Verify that:

- `peakcountryhail.com` pages return `200`, production canonicals, and `index, follow` where allowed.
- Preview and staging hosts return `X-Robots-Tag: noindex, nofollow`, preview meta robots, and a blocking `robots.txt`.
- The production sitemap contains only `https://peakcountryhail.com/` URLs.
- No secondary domain serves HTML content.
- No redirect points back to its source hostname.

Cloudflare documents [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) under **Workers & Pages → Worker → Settings → Domains & Routes**, and [Redirect Rules](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/) under **Rules → Overview → Create rule → Redirect Rule**. A [proxied DNS record](https://developers.cloudflare.com/workers/configuration/routing/routes/) is required before a hostname can receive Cloudflare redirect processing.
