# Peak Country historical hail data

## Source and coverage

The dataset in `data/hail-history/` uses the official NOAA National Centers for Environmental Information Storm Events bulk archive as its canonical source. The updater reads the `StormEvents_details-ftp_v1.0_dYYYY_*.csv.gz` archive family and discovers the newest corrected archive currently listed for each requested year. Correction-date suffixes are recorded in `source-manifest.json`; they are discovered at update time rather than permanently hard-coded into the script.

The completed historical period is 2016 through 2025: ten completed seasons. Records from 2026 are excluded from the completed-decade dataset and totals because 2026 is the current, provisional year. A later update can treat 2026 as completed only when the project intentionally advances the historical period.

## Geographic method

The geographic anchor is the Greeley, Colorado city reference coordinate at latitude `40.4156600` and longitude `-104.7721515`. It is used only for geographic calculation and does not represent a business, owner, shop, or street address.

Every candidate NOAA Hail record must contain a valid numeric `BEGIN_LAT` and `BEGIN_LON`. The updater calculates the great-circle distance from the Greeley anchor with the Haversine formula and an Earth radius of 3,958.7613 statute miles. A record is retained only when the calculated distance is less than or equal to 50.0 statute miles. County membership, nearby municipalities, and bounding boxes are not substitutes for this radius test.

## Filtering and retained data

A retained record must meet all of these rules:

- `EVENT_TYPE` is exactly `Hail`.
- `YEAR` is between 2016 and 2025, inclusive, and agrees with the source archive year.
- `BEGIN_LAT` and `BEGIN_LON` are present and within valid latitude and longitude ranges.
- Haversine distance from the Greeley anchor is no more than 50.0 statute miles.

The output preserves available NOAA event fields, numerical magnitude, source identifiers, narratives, coordinates, and source-archive provenance. Blank NOAA magnitude stays null in JSON and blank in CSV. The updater does not infer numerical size from descriptive terms. Records with different NOAA EVENT_ID values remain separate even when they came from the same weather episode, date, or location. Only repeated ingestion of the exact same EVENT_ID is removed.

## Reports, hail days, and storms

A **hail report** is one qualifying NOAA Storm Events record. Multiple reports can describe observations at different places or times during the same weather event.

A **hail day** is a calendar date with at least one qualifying report in the filtered dataset. Several reports on one date count as one hail day.

A **storm** or **episode** is not inferred from report count. Episode terminology is used only when supported by NOAA identifiers. For example, 20 reports do not mean 20 hailstorms.

Annual and overall summaries include report count, hail-day count, largest supplied magnitude, counts at or above one and two inches, closest report distance, the most active month, reports by month, and reports grouped by NOAA `BEGIN_LOCATION` when present.

## Refreshing the dataset

Use the repository’s Node.js 24 runtime and run:

```sh
pnpm hail-history:update
```

The command discovers current NOAA corrections, downloads missing raw archives into the ignored `work/hail-history-cache/` directory, decompresses and parses them as a stream, regenerates JSON and CSV outputs, calculates summaries, writes the provenance manifest, and validates the result. It fails if a required year is absent or an official download, schema, parse, or consistency check fails. Use `node scripts/update-hail-history.mjs --discover-only` to inspect the current archive selection without generating data.

Raw NOAA archives are intentionally not committed because the manifest and updater reproduce the processed dataset. When NOAA publishes a corrected archive, rerunning the updater may legitimately change records and metrics; review the manifest and generated diff before committing.

## Limitations

Storm Events records depend on reports gathered and reviewed by NOAA/NCEI. Coverage, coordinate precision, narratives, sources, and magnitude availability vary. Corrections can add, remove, or revise records after an archive is first published. Grouping by `BEGIN_LOCATION` reflects NOAA source text and may include abbreviations, directional descriptions, or multiple labels for a nearby community.

The dataset establishes that qualifying official hail observations were recorded within the defined radius. It does not show that every location in the area received hail, does not establish the number of distinct storms without supported episode analysis, and does not prove that any particular vehicle or property was struck or damaged. A vehicle inspection is required to determine actual damage.
