# Search discovery setup

## IndexNow

`pnpm deploy:production` submits materially affected canonical URLs to IndexNow only after Cloudflare deploys successfully. Direct page changes map to that page; shared rendering, identity, schema, or site-data changes conservatively map to every path registered in `src/data/contentMeta.ts`. Tests, documentation, workflows, and deployment-tooling-only releases legitimately submit zero URLs. Preview, localhost, parameterized, draft, API, noncanonical, and non-indexable URLs remain rejected.

The last successful notification SHA is stored outside source control at the path returned by `git rev-parse --git-path indexnow-successful-baseline`. It advances after an accepted submission or a valid zero-URL deployment, never after a failed submission. Set `INDEXNOW_BASE_REF` to a commit SHA or ref when initializing a fresh clone or deliberately recovering the comparison range.

The IndexNow key is read first from the `INDEXNOW_KEY` environment variable, then from the local file returned by `git rev-parse --git-path indexnow-key`. The local file is untracked and should use restrictive permissions; its value must match the encrypted Cloudflare `INDEXNOW_KEY` secret. The Worker serves the protocol verification token at `https://peakcountryhail.com/{INDEXNOW_KEY}.txt` without storing the key in tracked source or logs.

Manual, validated submissions remain available for recovery:

```sh
pnpm indexnow:submit -- /about/ /hail-size-guide/
```

Use `--dry-run` to validate URLs without a network request. IndexNow notifies participating search engines such as Bing; Google indexing remains separate and does not use IndexNow or Google's restricted Indexing API.

## Cloudflare crawler checks

Repository code now names Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, and PerplexityBot in the production `robots.txt` while preserving the general allow rule and sitemap. Robots directives do not override Cloudflare security products.

In the Cloudflare dashboard, review **Security → Bots**, **Security → WAF → Custom rules**, and **Security → Events** for challenges or blocks affecting those user agents. Do not create a blanket WAF bypass. If a legitimate crawler is challenged, narrow the adjustment to Cloudflare-verified bots or documented crawler IP validation. Account-level settings were not changed by this repository update.

## Public profiles

Owner-approved Google Business Profile, Facebook, Nextdoor, and NoCo Thrive URLs are configured in `socialProfiles` in `src/data/site.ts` and published by the entity graph as `sameAs`. Do not add guessed or unverified profile URLs.


## Preliminary hail archive

Migration `0003_hail_report_archive.sql` adds a private D1 archive of verified SPC feed rows as they are observed. Records retain their preliminary label, source URL, raw data, and first/last-seen timestamps. The archive has no public route and is not in the sitemap; a storm page should be published only after the source data is reviewed and meaningful context is written.
