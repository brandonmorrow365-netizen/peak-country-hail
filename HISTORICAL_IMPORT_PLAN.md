# NOAA/NCEI importer plan

Primary source: https://www.ncei.noaa.gov/pub/data/swdi/stormevents/csvfiles/

1. Discover the current `StormEvents_details-ftp_v1.0_dYYYY_cYYYYMMDD.csv.gz` inventory from the official directory. Do not guess release filenames. Select explicit years and the latest publication per year; store the full URL, release date, checksum and ingestion run ID.
2. Stream and decompress each file outside the request-serving Worker (bounded-memory CLI or workflow). Validate required CSV headers against a downloaded official sample before enabling imports. Preserve quoted narratives and source timezone information; do not assume local dates are UTC.
3. Filter `STATE=COLORADO` and `EVENT_TYPE=Hail`. Preserve NOAA event/episode IDs, county/zone type, magnitude/scale, coordinates (including missing coordinates), source narratives, and raw rows. Never substitute zero for missing coordinates.
4. Stage records, validate counts, IDs, ranges and dates, then upsert using NOAA event ID in bounded prepared-statement batches. Resume from a saved checkpoint. Reconcile removed/corrected records only after a complete successful year import; keep the old version available until validation succeeds.
5. Log malformed rows and incomplete downloads; fail the import rather than silently showing incomplete totals as complete. Record coverage by year and dataset version. Use finalized/historical wording appropriate to the source, not a blanket claim that all NOAA records are final forever.
6. Add county/date indexes and test nearby-distance queries against known coordinates before enabling location searches. Missing coordinates remain available in county summaries but not proximity calculations.
7. Publish history pages only after source coverage and meaningful local counts/context are reviewed. Explain historical reporting changes. Storm pages require editorial review and enough unique real observations to justify indexing.

Current status: schema prepared; historical download/normalization and publication remain unimplemented. No fabricated history is present.
