CREATE TABLE hail_report_archive (
 id TEXT PRIMARY KEY,
 occurred_at TEXT NOT NULL,
 report_day TEXT NOT NULL,
 location TEXT NOT NULL,
 county TEXT NOT NULL,
 state TEXT NOT NULL,
 size_inches REAL NOT NULL CHECK(size_inches > 0),
 latitude REAL NOT NULL CHECK(latitude BETWEEN -90 AND 90),
 longitude REAL NOT NULL CHECK(longitude BETWEEN -180 AND 180),
 comments TEXT NOT NULL,
 source_url TEXT NOT NULL,
 preliminary INTEGER NOT NULL DEFAULT 1 CHECK(preliminary = 1),
 first_seen_at TEXT NOT NULL,
 last_seen_at TEXT NOT NULL,
 raw_json TEXT NOT NULL
);
CREATE INDEX idx_hail_archive_day_time ON hail_report_archive(report_day, occurred_at);
