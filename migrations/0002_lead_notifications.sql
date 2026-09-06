ALTER TABLE leads ADD COLUMN notification_status TEXT NOT NULL DEFAULT 'pending' CHECK(notification_status IN ('pending','sent','failed'));
ALTER TABLE leads ADD COLUMN notification_message_id TEXT;
ALTER TABLE leads ADD COLUMN notification_error TEXT;
ALTER TABLE leads ADD COLUMN notified_at TEXT;
CREATE INDEX idx_leads_notification_status ON leads(notification_status,created_at);
