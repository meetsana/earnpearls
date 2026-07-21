CREATE TABLE account_states (
  code TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  blocks_login BOOLEAN NOT NULL DEFAULT FALSE,
  blocks_earning BOOLEAN NOT NULL DEFAULT FALSE,
  terminal BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO account_states (code, label, blocks_login, blocks_earning, terminal) VALUES
  ('active', 'Active', FALSE, FALSE, FALSE),
  ('limited', 'Limited', FALSE, FALSE, FALSE),
  ('suspended', 'Suspended', TRUE, TRUE, FALSE),
  ('disabled', 'Disabled', TRUE, TRUE, FALSE),
  ('archived', 'Archived', TRUE, TRUE, TRUE);

CREATE TABLE limit_templates (
  id UUID PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  country_code CHAR(2) NOT NULL,
  account_status_code TEXT NOT NULL DEFAULT 'active' REFERENCES account_states(code),
  limit_template_id UUID NULL REFERENCES limit_templates(id) ON DELETE SET NULL,
  email_verified_at TIMESTAMPTZ NULL,
  last_login_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (email = LOWER(email)),
  CHECK (country_code ~ '^[A-Z]{2}$')
);

CREATE UNIQUE INDEX users_email_lower_uq ON users (LOWER(email));
CREATE INDEX users_status_idx ON users (account_status_code, created_at DESC);
ALTER TABLE limit_templates
  ADD CONSTRAINT limit_templates_created_by_fk
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE roles (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  administrative BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE permissions (
  code TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  module TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE role_permissions (
  role_code TEXT NOT NULL REFERENCES roles(code) ON DELETE CASCADE,
  permission_code TEXT NOT NULL REFERENCES permissions(code) ON DELETE CASCADE,
  PRIMARY KEY (role_code, permission_code)
);

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_code TEXT NOT NULL REFERENCES roles(code) ON DELETE RESTRICT,
  assigned_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, role_code)
);

CREATE TABLE limit_template_permissions (
  limit_template_id UUID NOT NULL REFERENCES limit_templates(id) ON DELETE CASCADE,
  permission_code TEXT NOT NULL REFERENCES permissions(code) ON DELETE CASCADE,
  allowed BOOLEAN NOT NULL,
  PRIMARY KEY (limit_template_id, permission_code)
);

INSERT INTO roles (code, name, administrative) VALUES
  ('user', 'User', FALSE),
  ('super_admin', 'Super Admin', TRUE),
  ('operations_admin', 'Operations Admin', TRUE),
  ('finance_admin', 'Finance Admin', TRUE),
  ('support_admin', 'Support Admin', TRUE),
  ('read_only_auditor', 'Read Only Auditor', TRUE);

INSERT INTO permissions (code, description, module) VALUES
  ('dashboard.read', 'View the user dashboard', 'dashboard'),
  ('wallet.read', 'View own wallet and transactions', 'wallet'),
  ('survey.read', 'View eligible surveys', 'surveys'),
  ('survey.start', 'Start an eligible survey', 'surveys'),
  ('withdrawal.read', 'View own withdrawal methods and history', 'withdrawals'),
  ('withdrawal.create', 'Request a withdrawal', 'withdrawals'),
  ('profile.edit', 'Edit own profile', 'profile'),
  ('security.sessions.manage', 'Manage own sessions', 'security'),
  ('admin.dashboard.read', 'View administrative dashboard', 'admin'),
  ('admin.users.read', 'Search and view users', 'admin'),
  ('admin.users.moderate', 'Change account state and limit template', 'admin'),
  ('admin.limit_templates.read', 'View account limit templates', 'admin'),
  ('admin.limit_templates.manage', 'Create, edit, and clone account limit templates', 'admin'),
  ('admin.wallet.read', 'View wallet records for support or audit', 'admin'),
  ('admin.wallet.settle', 'Advance validated earnings using settlement evidence', 'admin'),
  ('admin.wallet.adjust', 'Create controlled wallet adjustments', 'admin'),
  ('admin.surveys.reconcile', 'Reconcile survey participation', 'admin'),
  ('admin.withdrawals.read', 'View all withdrawals', 'admin'),
  ('admin.withdrawals.review', 'Approve or reject withdrawals', 'admin'),
  ('admin.providers.read', 'View provider health and logs', 'admin'),
  ('admin.providers.manage', 'Enable or disable provider integrations', 'admin'),
  ('admin.settings.read', 'View platform settings', 'admin'),
  ('admin.settings.manage', 'Change platform settings', 'admin'),
  ('admin.audit.read', 'Read audit and security events', 'admin');

INSERT INTO role_permissions (role_code, permission_code)
SELECT 'user', code FROM permissions WHERE code IN (
  'dashboard.read', 'wallet.read', 'survey.read', 'survey.start',
  'withdrawal.read', 'withdrawal.create', 'profile.edit',
  'security.sessions.manage'
);

INSERT INTO role_permissions (role_code, permission_code)
SELECT 'super_admin', code FROM permissions;

INSERT INTO role_permissions (role_code, permission_code)
SELECT 'operations_admin', code FROM permissions WHERE code IN (
  'admin.dashboard.read', 'admin.users.read', 'admin.users.moderate',
  'admin.limit_templates.read',
  'admin.surveys.reconcile', 'admin.providers.read', 'admin.audit.read'
);

INSERT INTO role_permissions (role_code, permission_code)
SELECT 'finance_admin', code FROM permissions WHERE code IN (
  'admin.dashboard.read', 'admin.users.read', 'admin.wallet.read',
  'admin.wallet.settle', 'admin.withdrawals.read', 'admin.withdrawals.review', 'admin.audit.read'
);

INSERT INTO role_permissions (role_code, permission_code)
SELECT 'support_admin', code FROM permissions WHERE code IN (
  'admin.dashboard.read', 'admin.users.read', 'admin.wallet.read',
  'admin.limit_templates.read', 'admin.withdrawals.read', 'admin.audit.read'
);

INSERT INTO role_permissions (role_code, permission_code)
SELECT 'read_only_auditor', code FROM permissions WHERE code IN (
  'admin.dashboard.read', 'admin.users.read', 'admin.wallet.read',
  'admin.withdrawals.read', 'admin.providers.read', 'admin.settings.read',
  'admin.audit.read'
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash CHAR(64) NOT NULL UNIQUE,
  csrf_token_hash CHAR(64) NOT NULL,
  user_agent TEXT NOT NULL DEFAULT '',
  ip_hash CHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ NULL,
  revoke_reason TEXT NULL
);

CREATE INDEX sessions_user_active_idx
  ON sessions (user_id, expires_at DESC)
  WHERE revoked_at IS NULL;

CREATE TABLE auth_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL CHECK (purpose IN ('verify_email', 'reset_password')),
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX auth_tokens_user_purpose_idx
  ON auth_tokens (user_id, purpose, created_at DESC);

CREATE TABLE email_outbox (
  id UUID PRIMARY KEY,
  user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  recipient TEXT NOT NULL,
  template_code TEXT NOT NULL,
  template_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sending', 'sent', 'failed', 'dead')),
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMPTZ NULL,
  last_error TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX email_outbox_delivery_idx
  ON email_outbox (status, next_attempt_at)
  WHERE status IN ('queued', 'failed');

CREATE TABLE country_availability (
  country_code CHAR(2) PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('enabled', 'blocked', 'future', 'review')),
  reason TEXT NOT NULL,
  updated_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (country_code ~ '^[A-Z]{2}$')
);

INSERT INTO country_availability (country_code, status, reason) VALUES
  ('US', 'enabled', 'Named launch market'),
  ('GB', 'enabled', 'Named launch market'),
  ('CA', 'enabled', 'Named launch market'),
  ('IE', 'enabled', 'Named launch market'),
  ('AU', 'enabled', 'Named launch market'),
  ('DE', 'enabled', 'Named launch market'),
  ('BE', 'enabled', 'Named launch market'),
  ('SA', 'enabled', 'Named launch market'),
  ('AE', 'enabled', 'Named launch market'),
  ('QA', 'enabled', 'Named launch market'),
  ('OM', 'enabled', 'Named launch market'),
  ('BH', 'enabled', 'Named launch market'),
  ('PK', 'blocked', 'Explicitly excluded from initial public launch'),
  ('IN', 'blocked', 'Explicitly excluded from initial public launch'),
  ('BD', 'blocked', 'Explicitly excluded from initial public launch'),
  ('CN', 'blocked', 'Explicitly excluded from initial public launch');

CREATE TABLE system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  public BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO system_settings (key, value, public) VALUES
  ('points_per_usd', '{"value":"1000"}'::JSONB, TRUE),
  ('registration', '{"enabled":true,"requireCountryEnabled":true}'::JSONB, TRUE),
  ('withdrawals', '{"enabled":false,"decision":"ODR-005/ODR-006 pending"}'::JSONB, TRUE),
  ('wallet_adjustments', '{"enabled":false,"decision":"ODR-020 pending"}'::JSONB, FALSE),
  ('provider_visibility', '{"mode":"hidden","decision":"ODR-014 pending"}'::JSONB, TRUE);

CREATE TABLE providers (
  id UUID PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  user_visible BOOLEAN NOT NULL DEFAULT FALSE,
  health_status TEXT NOT NULL DEFAULT 'unknown' CHECK (health_status IN ('unknown', 'healthy', 'degraded', 'down')),
  secret_reference TEXT NULL,
  configuration JSONB NOT NULL DEFAULT '{}'::JSONB,
  last_health_check_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE surveys (
  id UUID PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE RESTRICT,
  external_id TEXT NOT NULL,
  title TEXT NOT NULL,
  reward_points BIGINT NOT NULL CHECK (reward_points > 0),
  reward_usd_micros BIGINT NOT NULL CHECK (reward_usd_micros > 0),
  estimated_minutes INTEGER NULL CHECK (estimated_minutes IS NULL OR estimated_minutes > 0),
  difficulty TEXT NULL,
  category TEXT NULL,
  country_codes TEXT[] NOT NULL DEFAULT '{}',
  device_types TEXT[] NOT NULL DEFAULT '{}',
  launch_url TEXT NOT NULL,
  available_from TIMESTAMPTZ NULL,
  available_until TIMESTAMPTZ NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  provider_payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider_id, external_id)
);

CREATE INDEX surveys_availability_idx ON surveys (active, available_until, created_at DESC);
CREATE INDEX surveys_country_codes_gin ON surveys USING GIN (country_codes);

CREATE TABLE survey_participations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE RESTRICT,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE RESTRICT,
  external_participation_id TEXT NULL,
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'pending', 'validated', 'rejected')),
  reward_points BIGINT NOT NULL CHECK (reward_points > 0),
  reward_usd_micros BIGINT NOT NULL CHECK (reward_usd_micros > 0),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ NULL,
  provider_confirmed_at TIMESTAMPTZ NULL,
  rejected_at TIMESTAMPTZ NULL,
  rejection_reason TEXT NULL,
  estimated_maturity_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX survey_participations_user_idx ON survey_participations (user_id, created_at DESC);
CREATE INDEX survey_participations_pending_idx ON survey_participations (status, created_at)
  WHERE status IN ('completed', 'pending');

CREATE TABLE provider_events (
  id UUID PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE RESTRICT,
  external_event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  signature_valid BOOLEAN NOT NULL,
  processing_status TEXT NOT NULL DEFAULT 'received' CHECK (processing_status IN ('received', 'processed', 'ignored', 'failed')),
  processing_error TEXT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ NULL,
  UNIQUE (provider_id, external_event_id)
);

CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  kind TEXT NOT NULL CHECK (kind IN ('survey_earning', 'withdrawal', 'adjustment', 'reversal')),
  current_bucket TEXT NOT NULL CHECK (current_bucket IN ('pending', 'validated', 'mature', 'withdrawable', 'reserved', 'paid', 'rejected', 'reversed')),
  amount_points BIGINT NOT NULL CHECK (amount_points <> 0),
  amount_usd_micros BIGINT NOT NULL CHECK (amount_usd_micros <> 0),
  source_currency CHAR(3) NOT NULL DEFAULT 'USD' CHECK (source_currency = 'USD'),
  description TEXT NOT NULL,
  provider_id UUID NULL REFERENCES providers(id) ON DELETE RESTRICT,
  reference_type TEXT NOT NULL,
  reference_id UUID NOT NULL,
  estimated_maturity_at TIMESTAMPTZ NULL,
  idempotency_key TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, kind, idempotency_key)
);

CREATE INDEX wallet_transactions_user_idx ON wallet_transactions (user_id, created_at DESC, id DESC);
CREATE INDEX wallet_transactions_reference_idx ON wallet_transactions (reference_type, reference_id);

CREATE TABLE wallet_transaction_events (
  id UUID PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES wallet_transactions(id) ON DELETE RESTRICT,
  from_bucket TEXT NULL CHECK (from_bucket IS NULL OR from_bucket IN ('pending', 'validated', 'mature', 'withdrawable', 'reserved', 'paid', 'rejected', 'reversed')),
  to_bucket TEXT NOT NULL CHECK (to_bucket IN ('pending', 'validated', 'mature', 'withdrawable', 'reserved', 'paid', 'rejected', 'reversed')),
  event_type TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('system', 'user', 'admin', 'provider')),
  actor_id UUID NULL,
  reason TEXT NOT NULL,
  evidence_reference TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX wallet_transaction_events_tx_idx
  ON wallet_transaction_events (transaction_id, created_at);

CREATE TABLE wallet_entries (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  transaction_id UUID NOT NULL REFERENCES wallet_transactions(id) ON DELETE RESTRICT,
  event_id UUID NOT NULL REFERENCES wallet_transaction_events(id) ON DELETE RESTRICT,
  bucket TEXT NOT NULL CHECK (bucket IN ('pending', 'validated', 'mature', 'withdrawable', 'reserved', 'paid', 'rejected', 'reversed')),
  points_delta BIGINT NOT NULL CHECK (points_delta <> 0),
  usd_micros_delta BIGINT NOT NULL CHECK (usd_micros_delta <> 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, bucket)
);

CREATE INDEX wallet_entries_balance_idx ON wallet_entries (user_id, bucket);

CREATE VIEW wallet_balances AS
SELECT
  user_id,
  bucket,
  COALESCE(SUM(points_delta), 0)::BIGINT AS points,
  COALESCE(SUM(usd_micros_delta), 0)::BIGINT AS usd_micros
FROM wallet_entries
GROUP BY user_id, bucket;

CREATE TABLE withdrawal_methods (
  code TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  minimum_points BIGINT NOT NULL CHECK (minimum_points >= 0),
  fee_points BIGINT NOT NULL DEFAULT 0 CHECK (fee_points >= 0),
  country_codes TEXT[] NOT NULL DEFAULT '{}',
  destination_schema JSONB NOT NULL DEFAULT '{}'::JSONB,
  configuration JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE withdrawals (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  method_code TEXT NOT NULL REFERENCES withdrawal_methods(code) ON DELETE RESTRICT,
  wallet_transaction_id UUID NOT NULL UNIQUE REFERENCES wallet_transactions(id) ON DELETE RESTRICT,
  amount_points BIGINT NOT NULL CHECK (amount_points > 0),
  amount_usd_micros BIGINT NOT NULL CHECK (amount_usd_micros > 0),
  fee_points BIGINT NOT NULL DEFAULT 0 CHECK (fee_points >= 0),
  fee_usd_micros BIGINT NOT NULL DEFAULT 0 CHECK (fee_usd_micros >= 0),
  destination_ciphertext TEXT NOT NULL,
  destination_masked TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'under_review', 'approved', 'processing', 'paid', 'rejected', 'cancelled')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ NULL,
  processed_at TIMESTAMPTZ NULL,
  payout_reference TEXT NULL,
  rejection_reason TEXT NULL,
  idempotency_key TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, idempotency_key)
);

CREATE INDEX withdrawals_status_idx ON withdrawals (status, requested_at);
CREATE INDEX withdrawals_user_idx ON withdrawals (user_id, requested_at DESC);

CREATE TABLE announcements (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'success', 'warning', 'danger')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  country_codes TEXT[] NOT NULL DEFAULT '{}',
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ NULL,
  created_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE account_state_events (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  previous_state_code TEXT NOT NULL REFERENCES account_states(code),
  new_state_code TEXT NOT NULL REFERENCES account_states(code),
  previous_limit_template_id UUID NULL REFERENCES limit_templates(id) ON DELETE RESTRICT,
  new_limit_template_id UUID NULL REFERENCES limit_templates(id) ON DELETE RESTRICT,
  actor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  reason TEXT NOT NULL,
  expires_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX account_state_events_user_idx ON account_state_events (user_id, created_at DESC);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('system', 'user', 'admin', 'provider')),
  actor_id UUID NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('success', 'denied', 'failure')),
  request_id TEXT NULL,
  ip_hash CHAR(64) NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX audit_logs_search_idx ON audit_logs (created_at DESC, action, target_type);
CREATE INDEX audit_logs_actor_idx ON audit_logs (actor_id, created_at DESC);

CREATE TABLE security_events (
  id UUID PRIMARY KEY,
  user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'high', 'critical')),
  outcome TEXT NOT NULL,
  request_id TEXT NULL,
  ip_hash CHAR(64) NULL,
  user_agent TEXT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX security_events_review_idx ON security_events (severity, created_at DESC);

CREATE TABLE idempotency_records (
  scope TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  user_id UUID NULL REFERENCES users(id) ON DELETE CASCADE,
  request_hash CHAR(64) NOT NULL,
  response_status INTEGER NULL,
  response_body JSONB NULL,
  locked_until TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (scope, idempotency_key)
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION prevent_append_only_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION '% is append-only', TG_TABLE_NAME USING ERRCODE = '55000';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION protect_wallet_transaction_facts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id <> OLD.user_id
    OR NEW.kind <> OLD.kind
    OR NEW.amount_points <> OLD.amount_points
    OR NEW.amount_usd_micros <> OLD.amount_usd_micros
    OR NEW.source_currency <> OLD.source_currency
    OR NEW.provider_id IS DISTINCT FROM OLD.provider_id
    OR NEW.reference_type <> OLD.reference_type
    OR NEW.reference_id <> OLD.reference_id
    OR NEW.idempotency_key IS DISTINCT FROM OLD.idempotency_key THEN
      RAISE EXCEPTION 'wallet transaction financial facts are immutable' USING ERRCODE = '55000';
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER limit_templates_updated_at BEFORE UPDATE ON limit_templates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER email_outbox_updated_at BEFORE UPDATE ON email_outbox
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER providers_updated_at BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER surveys_updated_at BEFORE UPDATE ON surveys
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER survey_participations_updated_at BEFORE UPDATE ON survey_participations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER withdrawal_methods_updated_at BEFORE UPDATE ON withdrawal_methods
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER withdrawals_updated_at BEFORE UPDATE ON withdrawals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER wallet_transactions_protect_update BEFORE UPDATE ON wallet_transactions
  FOR EACH ROW EXECUTE FUNCTION protect_wallet_transaction_facts();
CREATE TRIGGER wallet_transactions_prevent_delete BEFORE DELETE ON wallet_transactions
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
CREATE TRIGGER wallet_entries_append_only BEFORE UPDATE OR DELETE ON wallet_entries
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
CREATE TRIGGER wallet_events_append_only BEFORE UPDATE OR DELETE ON wallet_transaction_events
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
CREATE TRIGGER audit_logs_append_only BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
CREATE TRIGGER security_events_append_only BEFORE UPDATE OR DELETE ON security_events
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
CREATE TRIGGER account_state_events_append_only BEFORE UPDATE OR DELETE ON account_state_events
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
CREATE TRIGGER provider_events_prevent_delete BEFORE DELETE ON provider_events
  FOR EACH ROW EXECUTE FUNCTION prevent_append_only_mutation();
