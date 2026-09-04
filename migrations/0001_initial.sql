PRAGMA foreign_keys = ON;
CREATE TABLE leads (
 id TEXT PRIMARY KEY, created_at TEXT NOT NULL, name TEXT NOT NULL,
 email TEXT NOT NULL, phone TEXT NOT NULL, location TEXT NOT NULL,
 vehicle TEXT NOT NULL, damage_type TEXT NOT NULL, message TEXT NOT NULL,
 preferred_contact TEXT NOT NULL CHECK(preferred_contact IN ('email','phone')),
 source_page TEXT NOT NULL, consent_version TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','closed'))
);
CREATE INDEX idx_leads_status_created ON leads(status,created_at);
CREATE TABLE weather_alerts (
 id TEXT PRIMARY KEY, event TEXT NOT NULL, headline TEXT NOT NULL,
 area TEXT NOT NULL, expires_at TEXT NOT NULL, source_url TEXT NOT NULL,
 fetched_at TEXT NOT NULL, raw_json TEXT NOT NULL
);
CREATE INDEX idx_alerts_expiry ON weather_alerts(expires_at);
CREATE TABLE hail_reports (
 id TEXT PRIMARY KEY, occurred_at TEXT NOT NULL, report_day TEXT NOT NULL,
 location TEXT NOT NULL, county TEXT NOT NULL, state TEXT NOT NULL,
 size_inches REAL NOT NULL CHECK(size_inches>0), latitude REAL NOT NULL CHECK(latitude BETWEEN -90 AND 90),
 longitude REAL NOT NULL CHECK(longitude BETWEEN -180 AND 180), comments TEXT NOT NULL,
 source_url TEXT NOT NULL, preliminary INTEGER NOT NULL DEFAULT 1 CHECK(preliminary=1), fetched_at TEXT NOT NULL, raw_json TEXT NOT NULL
);
CREATE INDEX idx_reports_day_county ON hail_reports(report_day,county);
CREATE INDEX idx_reports_time ON hail_reports(occurred_at);
CREATE TABLE ingestion_logs (
 id TEXT PRIMARY KEY, source TEXT NOT NULL, started_at TEXT NOT NULL,
 completed_at TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('success','error')),
 row_count INTEGER NOT NULL DEFAULT 0, error_code TEXT, source_url TEXT NOT NULL
);
CREATE INDEX idx_ingestion_source_time ON ingestion_logs(source,completed_at DESC);
CREATE TABLE historical_events (
 event_id TEXT PRIMARY KEY, episode_id TEXT, occurred_at TEXT NOT NULL,
 county TEXT NOT NULL, state TEXT NOT NULL, magnitude REAL, latitude REAL, longitude REAL,
 source_url TEXT NOT NULL, source_version TEXT NOT NULL, imported_at TEXT NOT NULL, raw_json TEXT NOT NULL
);
CREATE INDEX idx_history_county_time ON historical_events(county,occurred_at);
CREATE TABLE reviews (
 id TEXT PRIMARY KEY, author TEXT NOT NULL, body TEXT NOT NULL, source_url TEXT NOT NULL,
 reviewed_at TEXT NOT NULL, approved_at TEXT, rating INTEGER CHECK(rating BETWEEN 1 AND 5)
);
CREATE TABLE gallery_items (
 id TEXT PRIMARY KEY, image_path TEXT NOT NULL, alt TEXT NOT NULL, caption TEXT NOT NULL,
 service_type TEXT NOT NULL, location TEXT, rights_confirmed_at TEXT, approved_at TEXT
);
CREATE TABLE storm_pages (
 id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL,
 start_at TEXT NOT NULL, end_at TEXT NOT NULL, content TEXT NOT NULL,
 reviewed_at TEXT, indexable INTEGER NOT NULL DEFAULT 0 CHECK(indexable IN(0,1))
);
