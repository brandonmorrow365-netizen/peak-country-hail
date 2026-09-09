# Search discovery setup

## IndexNow

The repository includes `pnpm indexnow:submit` for manually submitting only materially changed canonical URLs. It validates every requested URL against `src/data/contentMeta.ts`; preview, localhost, parameterized, draft, API, and non-indexable URLs are rejected.

1. Generate a random 32–64 character alphanumeric key.
2. In Cloudflare Workers & Pages, open **peak-country-hail** → **Settings** → **Variables and Secrets**.
3. Add an encrypted secret named `INDEXNOW_KEY` with that value and deploy the binding change.
4. Set the same variable only in the terminal session used for submission. Do not commit it.
5. Verify `https://peakcountryhail.com/{INDEXNOW_KEY}.txt` returns the key, replacing `{INDEXNOW_KEY}` with the configured value. This key-named root file follows the preferred IndexNow ownership pattern. The public response is the protocol's ownership-verification token; it is served from the encrypted binding and is not an account credential.
6. Submit only pages that received meaningful public changes, for example:

   ```sh
   INDEXNOW_KEY='the-configured-value' pnpm indexnow:submit -- /about/ /hail-size-guide/
   ```

Use `--dry-run` to validate URLs without a network request. The script is intentionally separate from every-build deployment so unchanged pages are not resubmitted.

## Cloudflare crawler checks

Repository code now names Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, and PerplexityBot in the production `robots.txt` while preserving the general allow rule and sitemap. Robots directives do not override Cloudflare security products.

In the Cloudflare dashboard, review **Security → Bots**, **Security → WAF → Custom rules**, and **Security → Events** for challenges or blocks affecting those user agents. Do not create a blanket WAF bypass. If a legitimate crawler is challenged, narrow the adjustment to Cloudflare-verified bots or documented crawler IP validation. Account-level settings were not changed by this repository update.

## Public profiles

No verified public social or business-profile URLs are currently configured. Add owner-approved profile URLs to `socialProfiles` in `src/data/site.ts`; the entity graph will then publish them as `sameAs`. Do not add guessed profile URLs.


## Preliminary hail archive

Migration `0003_hail_report_archive.sql` adds a private D1 archive of verified SPC feed rows as they are observed. Records retain their preliminary label, source URL, raw data, and first/last-seen timestamps. The archive has no public route and is not in the sitemap; a storm page should be published only after the source data is reviewed and meaningful context is written.
