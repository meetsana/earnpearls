ALTER TABLE users
  ADD COLUMN timezone TEXT NOT NULL DEFAULT 'UTC',
  ADD COLUMN display_currency CHAR(3) NOT NULL DEFAULT 'USD',
  ADD COLUMN bio TEXT NOT NULL DEFAULT '',
  ADD COLUMN marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN deleted_at TIMESTAMPTZ NULL,
  ADD CONSTRAINT users_display_currency_format CHECK (display_currency ~ '^[A-Z]{3}$');

ALTER TABLE withdrawals
  ADD COLUMN estimated_completion_at TIMESTAMPTZ NULL;

CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email_reward_updates BOOLEAN NOT NULL DEFAULT TRUE,
  email_withdrawal_updates BOOLEAN NOT NULL DEFAULT TRUE,
  email_security_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  email_support_updates BOOLEAN NOT NULL DEFAULT TRUE,
  email_platform_announcements BOOLEAN NOT NULL DEFAULT TRUE,
  email_marketing BOOLEAN NOT NULL DEFAULT FALSE,
  in_app_reward_updates BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_withdrawal_updates BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_security_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_support_updates BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_platform_announcements BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_activity_events (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  event_type TEXT NOT NULL,
  summary TEXT NOT NULL,
  target_type TEXT NULL,
  target_id TEXT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX user_activity_events_user_idx
  ON user_activity_events (user_id, created_at DESC, id DESC);

INSERT INTO permissions (code, description, module) VALUES
  ('profile.read', 'View own profile and preferences', 'profile'),
  ('security.password.change', 'Change own password', 'security'),
  ('notification.read', 'View own notifications', 'notifications'),
  ('notification.manage', 'Manage own notifications and preferences', 'notifications'),
  ('leaderboard.read', 'View enabled leaderboard rankings', 'leaderboards'),
  ('support.read', 'View own support tickets', 'support'),
  ('support.create', 'Create support tickets', 'support'),
  ('support.reply', 'Reply to own support tickets', 'support'),
  ('admin.roles.read', 'View administrator roles and permissions', 'admin'),
  ('admin.roles.manage', 'Manage administrator role assignments', 'admin'),
  ('admin.content.read', 'View draft and published CMS content', 'admin'),
  ('admin.content.manage', 'Create, edit, publish, and archive CMS content', 'admin'),
  ('admin.support.read', 'View all support tickets and conversations', 'admin'),
  ('admin.support.manage', 'Reply, assign, prioritize, and resolve support tickets', 'admin'),
  ('admin.notifications.manage', 'Create and manage platform notifications', 'admin'),
  ('admin.countries.manage', 'Manage country availability', 'admin'),
  ('admin.leaderboards.manage', 'Manage leaderboards and periods', 'admin'),
  ('admin.jobs.read', 'View background job and synchronization status', 'admin'),
  ('admin.jobs.manage', 'Retry eligible background and synchronization jobs', 'admin'),
  ('admin.security.read', 'View security events and operational alerts', 'admin'),
  ('admin.reports.read', 'View platform analytics and export reports', 'admin'),
  ('admin.withdrawal_methods.manage', 'Configure payout method availability and rules', 'admin')
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions (role_code, permission_code)
SELECT 'user', code FROM permissions WHERE code IN (
  'profile.read', 'security.password.change', 'notification.read',
  'notification.manage', 'leaderboard.read', 'support.read',
  'support.create', 'support.reply'
)
ON CONFLICT DO NOTHING;

INSERT INTO roles (code, name, administrative) VALUES
  ('content_admin', 'Content Admin', TRUE),
  ('marketing_admin', 'Marketing Admin', TRUE),
  ('developer', 'Developer', TRUE)
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions (role_code, permission_code)
SELECT 'super_admin', code FROM permissions
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_code, permission_code)
SELECT 'operations_admin', code FROM permissions WHERE code IN (
  'admin.jobs.read', 'admin.security.read', 'admin.reports.read',
  'admin.leaderboards.manage', 'admin.countries.manage'
)
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_code, permission_code)
SELECT 'finance_admin', code FROM permissions WHERE code IN (
  'admin.reports.read', 'admin.jobs.read', 'admin.withdrawal_methods.manage'
)
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_code, permission_code)
SELECT 'support_admin', code FROM permissions WHERE code IN (
  'admin.support.read', 'admin.support.manage', 'admin.notifications.manage',
  'admin.security.read'
)
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_code, permission_code)
SELECT 'content_admin', code FROM permissions WHERE code IN (
  'admin.dashboard.read', 'admin.content.read', 'admin.content.manage',
  'admin.notifications.manage', 'admin.audit.read'
)
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_code, permission_code)
SELECT 'marketing_admin', code FROM permissions WHERE code IN (
  'admin.dashboard.read', 'admin.content.read', 'admin.content.manage',
  'admin.notifications.manage', 'admin.leaderboards.manage',
  'admin.reports.read', 'admin.audit.read'
)
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_code, permission_code)
SELECT 'developer', code FROM permissions WHERE code IN (
  'admin.dashboard.read', 'admin.providers.read', 'admin.providers.manage',
  'admin.settings.read', 'admin.jobs.read', 'admin.jobs.manage',
  'admin.security.read', 'admin.audit.read'
)
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_code, permission_code)
SELECT 'read_only_auditor', code FROM permissions WHERE code IN (
  'admin.roles.read', 'admin.content.read', 'admin.support.read',
  'admin.jobs.read', 'admin.security.read', 'admin.reports.read'
)
ON CONFLICT DO NOTHING;

INSERT INTO system_settings (key, value, public) VALUES
  ('maintenance', '{"enabled":false,"message":"EarnPearls is temporarily unavailable."}'::JSONB, TRUE),
  ('features', '{"surveys":true,"wallet":true,"withdrawals":true,"leaderboards":true,"support":true,"blog":true,"referrals":false,"offerwalls":false,"cashback":false,"games":false}'::JSONB, TRUE),
  ('leaderboards', '{"enabled":true,"defaultPeriod":"weekly","defaultMetric":"points_earned","privacyMode":"display_name"}'::JSONB, TRUE),
  ('support', '{"enabled":true,"attachmentsEnabled":false,"maxOpenTicketsPerUser":5}'::JSONB, TRUE),
  ('currency_display', '{"base":"USD","localEstimatesEnabled":false}'::JSONB, TRUE),
  ('security_policy', '{"passwordMinimumLength":12,"sessionDays":30,"requireVerifiedEmailToEarn":true}'::JSONB, FALSE),
  ('content', '{"blogEnabled":true,"testimonialsMode":"placeholder"}'::JSONB, TRUE),
  ('data_retention', '{"expiredSessionsDays":30,"deletedNotificationsDays":30,"sentEmailDays":90}'::JSONB, FALSE)
ON CONFLICT (key) DO NOTHING;

CREATE TABLE system_setting_revisions (
  id UUID PRIMARY KEY,
  setting_key TEXT NOT NULL REFERENCES system_settings(key) ON DELETE RESTRICT,
  previous_value JSONB NULL,
  new_value JSONB NOT NULL,
  actor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX system_setting_revisions_key_idx
  ON system_setting_revisions (setting_key, created_at DESC);

CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN (
    'survey', 'reward', 'withdrawal', 'security', 'announcement',
    'support', 'promotion', 'system'
  )),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  action_url TEXT NULL,
  in_app_visible BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived', 'deleted')),
  read_at TIMESTAMPTZ NULL,
  archived_at TIMESTAMPTZ NULL,
  deleted_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX notifications_user_status_idx
  ON notifications (user_id, status, created_at DESC, id DESC);

CREATE TABLE notification_deliveries (
  id UUID PRIMARY KEY,
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('in_app', 'email', 'push')),
  status TEXT NOT NULL CHECK (status IN ('queued', 'delivered', 'failed', 'suppressed')),
  external_reference TEXT NULL,
  attempted_at TIMESTAMPTZ NULL,
  delivered_at TIMESTAMPTZ NULL,
  failure_reason TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (notification_id, channel)
);

CREATE TABLE support_ticket_categories (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO support_ticket_categories (code, name, description, sort_order) VALUES
  ('account', 'Account', 'Account access, profile, and verification help', 10),
  ('surveys', 'Surveys', 'Survey availability, completion, and validation help', 20),
  ('wallet', 'Wallet & Rewards', 'Balance and reward lifecycle questions', 30),
  ('withdrawals', 'Withdrawals', 'Withdrawal request and processing help', 40),
  ('security', 'Security', 'Suspicious activity and account security', 50),
  ('other', 'Other', 'Questions not covered by another category', 60)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE support_tickets (
  id UUID PRIMARY KEY,
  ticket_number BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  category_code TEXT NOT NULL REFERENCES support_ticket_categories(code) ON DELETE RESTRICT,
  subject TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN (
    'open', 'waiting_for_support', 'waiting_for_user', 'resolved', 'closed'
  )),
  assigned_to UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ NULL,
  closed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX support_tickets_user_idx
  ON support_tickets (user_id, updated_at DESC, id DESC);
CREATE INDEX support_tickets_queue_idx
  ON support_tickets (status, priority, last_message_at);

CREATE TABLE support_messages (
  id UUID PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE RESTRICT,
  author_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  author_type TEXT NOT NULL CHECK (author_type IN ('user', 'admin')),
  body TEXT NOT NULL,
  internal_note BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (NOT internal_note OR author_type = 'admin')
);

CREATE INDEX support_messages_ticket_idx
  ON support_messages (ticket_id, created_at, id);

CREATE TABLE support_attachments (
  id UUID PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES support_messages(id) ON DELETE RESTRICT,
  storage_key TEXT NOT NULL UNIQUE,
  original_filename TEXT NOT NULL,
  media_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL CHECK (size_bytes > 0),
  checksum_sha256 CHAR(64) NOT NULL,
  scan_status TEXT NOT NULL DEFAULT 'pending' CHECK (scan_status IN ('pending', 'clean', 'blocked', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE support_ticket_events (
  id UUID PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE RESTRICT,
  actor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  event_type TEXT NOT NULL,
  from_status TEXT NULL,
  to_status TEXT NULL,
  reason TEXT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX support_ticket_events_ticket_idx
  ON support_ticket_events (ticket_id, created_at, id);

CREATE TABLE cms_pages (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  body_markdown TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  canonical_path TEXT NOT NULL,
  published_at TIMESTAMPTZ NULL,
  scheduled_for TIMESTAMPTZ NULL,
  author_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CHECK (canonical_path LIKE '/%')
);

CREATE TABLE cms_page_revisions (
  id UUID PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES cms_pages(id) ON DELETE RESTRICT,
  version_number INTEGER NOT NULL CHECK (version_number > 0),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  status TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  actor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  change_reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (page_id, version_number)
);

CREATE TABLE blog_categories (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  category_id UUID NULL REFERENCES blog_categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  featured_image_url TEXT NULL,
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  canonical_path TEXT NOT NULL,
  author_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  scheduled_for TIMESTAMPTZ NULL,
  published_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CHECK (canonical_path LIKE '/%')
);

CREATE INDEX blog_posts_public_idx
  ON blog_posts (published_at DESC, id DESC)
  WHERE status = 'published';

CREATE TABLE blog_post_revisions (
  id UUID PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE RESTRICT,
  version_number INTEGER NOT NULL CHECK (version_number > 0),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  status TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  actor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  change_reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, version_number)
);

CREATE TABLE blog_tags (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE TABLE blog_post_tags (
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE faqs (
  id UUID PRIMARY KEY,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer_markdown TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  author_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE faq_revisions (
  id UUID PRIMARY KEY,
  faq_id UUID NOT NULL REFERENCES faqs(id) ON DELETE RESTRICT,
  version_number INTEGER NOT NULL CHECK (version_number > 0),
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer_markdown TEXT NOT NULL,
  status TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  actor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  change_reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (faq_id, version_number)
);

CREATE INDEX faqs_public_idx ON faqs (category, sort_order, created_at)
  WHERE status = 'published';

CREATE TABLE legal_documents (
  id UUID PRIMARY KEY,
  document_type TEXT NOT NULL CHECK (document_type IN ('terms', 'privacy', 'cookies')),
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'retired')),
  effective_at TIMESTAMPTZ NULL,
  published_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (document_type, version)
);

CREATE UNIQUE INDEX legal_documents_one_published_type_uq
  ON legal_documents (document_type) WHERE status = 'published';

CREATE TABLE user_consents (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  legal_document_id UUID NOT NULL REFERENCES legal_documents(id) ON DELETE RESTRICT,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_hash CHAR(64) NULL,
  UNIQUE (user_id, legal_document_id)
);

CREATE TABLE leaderboard_definitions (
  id UUID PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  cadence TEXT NOT NULL CHECK (cadence IN ('weekly', 'monthly', 'seasonal')),
  metric TEXT NOT NULL CHECK (metric IN ('points_earned', 'surveys_completed', 'streak_days')),
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  max_entries INTEGER NOT NULL DEFAULT 100 CHECK (max_entries BETWEEN 1 AND 1000),
  configuration JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO leaderboard_definitions (id, code, name, cadence, metric, enabled, max_entries) VALUES
  ('51000000-0000-4000-8000-000000000001', 'weekly-points', 'Weekly Top Earners', 'weekly', 'points_earned', TRUE, 100),
  ('51000000-0000-4000-8000-000000000002', 'monthly-points', 'Monthly Top Earners', 'monthly', 'points_earned', TRUE, 100),
  ('51000000-0000-4000-8000-000000000003', 'weekly-surveys', 'Weekly Survey Leaders', 'weekly', 'surveys_completed', FALSE, 100)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE leaderboard_periods (
  id UUID PRIMARY KEY,
  leaderboard_id UUID NOT NULL REFERENCES leaderboard_definitions(id) ON DELETE RESTRICT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'calculating', 'finalized', 'cancelled')),
  finalized_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (leaderboard_id, starts_at, ends_at),
  CHECK (ends_at > starts_at)
);

CREATE TABLE leaderboard_exclusions (
  leaderboard_id UUID NOT NULL REFERENCES leaderboard_definitions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  hidden_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (leaderboard_id, user_id)
);

CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY,
  period_id UUID NOT NULL REFERENCES leaderboard_periods(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  rank INTEGER NOT NULL CHECK (rank > 0),
  metric_value BIGINT NOT NULL CHECK (metric_value >= 0),
  points_earned BIGINT NOT NULL DEFAULT 0 CHECK (points_earned >= 0),
  surveys_completed INTEGER NOT NULL DEFAULT 0 CHECK (surveys_completed >= 0),
  hidden BOOLEAN NOT NULL DEFAULT FALSE,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (period_id, user_id),
  UNIQUE (period_id, rank)
);

CREATE INDEX leaderboard_entries_public_idx
  ON leaderboard_entries (period_id, hidden, rank);

CREATE TABLE provider_sync_runs (
  id UUID PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE RESTRICT,
  operation TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  records_received INTEGER NOT NULL DEFAULT 0 CHECK (records_received >= 0),
  records_changed INTEGER NOT NULL DEFAULT 0 CHECK (records_changed >= 0),
  duration_ms INTEGER NULL CHECK (duration_ms IS NULL OR duration_ms >= 0),
  error_code TEXT NULL,
  error_message TEXT NULL,
  started_at TIMESTAMPTZ NULL,
  finished_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX provider_sync_runs_provider_idx
  ON provider_sync_runs (provider_id, created_at DESC);

CREATE TABLE background_job_runs (
  id UUID PRIMARY KEY,
  job_type TEXT NOT NULL,
  deduplication_key TEXT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'dead', 'cancelled')),
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  result JSONB NULL,
  last_error TEXT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ NULL,
  finished_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (job_type, deduplication_key)
);

CREATE INDEX background_job_runs_queue_idx
  ON background_job_runs (status, scheduled_for)
  WHERE status IN ('queued', 'failed');

CREATE TABLE provider_settlements (
  id UUID PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE RESTRICT,
  external_reference TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('received', 'verified', 'rejected')),
  evidence_reference TEXT NOT NULL,
  received_usd_micros BIGINT NOT NULL CHECK (received_usd_micros >= 0),
  verified_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider_id, external_reference),
  CHECK (period_end >= period_start)
);

CREATE TABLE provider_settlement_items (
  settlement_id UUID NOT NULL REFERENCES provider_settlements(id) ON DELETE RESTRICT,
  wallet_transaction_id UUID NOT NULL REFERENCES wallet_transactions(id) ON DELETE RESTRICT,
  allocated_usd_micros BIGINT NOT NULL CHECK (allocated_usd_micros > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (settlement_id, wallet_transaction_id)
);

CREATE TABLE withdrawal_events (
  id UUID PRIMARY KEY,
  withdrawal_id UUID NOT NULL REFERENCES withdrawals(id) ON DELETE RESTRICT,
  from_status TEXT NULL,
  to_status TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('system', 'user', 'admin', 'provider')),
  actor_id UUID NULL,
  reason TEXT NOT NULL,
  payout_reference TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX withdrawal_events_withdrawal_idx
  ON withdrawal_events (withdrawal_id, created_at, id);

CREATE TABLE analytics_daily (
  metric_date DATE NOT NULL,
  metric_code TEXT NOT NULL,
  dimension JSONB NOT NULL DEFAULT '{}'::JSONB,
  value_numeric NUMERIC(30, 6) NOT NULL,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (metric_date, metric_code, dimension)
);

CREATE TABLE email_templates (
  code TEXT PRIMARY KEY CHECK (code ~ '^[a-z][a-z0-9_]{2,63}$'),
  display_name TEXT NOT NULL,
  subject_template TEXT NOT NULL,
  text_template TEXT NOT NULL,
  html_template TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  variables TEXT[] NOT NULL DEFAULT '{}',
  updated_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO email_templates (
  code, display_name, subject_template, text_template, html_template, variables
) VALUES
  ('verify_email', 'Email verification',
   'Verify your EarnPearls email',
   E'Verify your EarnPearls email: {{action_url}}\n\nThis link expires at {{expires_at}}.',
   '<p>Verify your EarnPearls email:</p><p><a href="{{action_url}}">Verify email</a></p><p>This link expires at {{expires_at}}.</p>',
   ARRAY['action_url','expires_at']),
  ('reset_password', 'Password reset',
   'Reset your EarnPearls password',
   E'Reset your EarnPearls password: {{action_url}}\n\nThis link expires at {{expires_at}}.',
   '<p>Reset your EarnPearls password:</p><p><a href="{{action_url}}">Reset password</a></p><p>This link expires at {{expires_at}}.</p>',
   ARRAY['action_url','expires_at']),
  ('notification', 'Member notification',
   '{{title}}',
   E'{{body}}\n\nView in EarnPearls: {{action_url}}',
   '<p>{{body}}</p><p><a href="{{action_url}}">View in EarnPearls</a></p>',
   ARRAY['title','body','action_url']);

CREATE TABLE email_template_revisions (
  id UUID PRIMARY KEY,
  template_code TEXT NOT NULL REFERENCES email_templates(code) ON DELETE RESTRICT,
  previous_subject_template TEXT NOT NULL,
  previous_text_template TEXT NOT NULL,
  previous_html_template TEXT NOT NULL,
  previous_enabled BOOLEAN NOT NULL,
  new_subject_template TEXT NOT NULL,
  new_text_template TEXT NOT NULL,
  new_html_template TEXT NOT NULL,
  new_enabled BOOLEAN NOT NULL,
  actor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX email_template_revisions_code_idx
  ON email_template_revisions (template_code, created_at DESC);

CREATE TRIGGER user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER notifications_updated_at BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER support_ticket_categories_updated_at BEFORE UPDATE ON support_ticket_categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER support_tickets_updated_at BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER cms_pages_updated_at BEFORE UPDATE ON cms_pages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER blog_categories_updated_at BEFORE UPDATE ON blog_categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER faqs_updated_at BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER leaderboard_definitions_updated_at BEFORE UPDATE ON leaderboard_definitions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER email_templates_updated_at BEFORE UPDATE ON email_templates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER user_activity_events_append_only BEFORE UPDATE OR DELETE ON user_activity_events
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
CREATE TRIGGER system_setting_revisions_append_only BEFORE UPDATE OR DELETE ON system_setting_revisions
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
CREATE TRIGGER support_messages_append_only BEFORE UPDATE OR DELETE ON support_messages
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
CREATE TRIGGER support_ticket_events_append_only BEFORE UPDATE OR DELETE ON support_ticket_events
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
CREATE TRIGGER cms_page_revisions_append_only BEFORE UPDATE OR DELETE ON cms_page_revisions
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
CREATE TRIGGER blog_post_revisions_append_only BEFORE UPDATE OR DELETE ON blog_post_revisions
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
CREATE TRIGGER faq_revisions_append_only BEFORE UPDATE OR DELETE ON faq_revisions
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
CREATE TRIGGER user_consents_append_only BEFORE UPDATE OR DELETE ON user_consents
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
CREATE TRIGGER provider_settlement_items_append_only BEFORE UPDATE OR DELETE ON provider_settlement_items
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
CREATE TRIGGER withdrawal_events_append_only BEFORE UPDATE OR DELETE ON withdrawal_events
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
CREATE TRIGGER email_template_revisions_append_only BEFORE UPDATE OR DELETE ON email_template_revisions
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
