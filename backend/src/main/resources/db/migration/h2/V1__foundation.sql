CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY,
  full_name VARCHAR(160),
  email VARCHAR(320),
  mobile_number VARCHAR(32),
  status VARCHAR(32) NOT NULL,
  mobile_verified BOOLEAN NOT NULL DEFAULT FALSE,
  email_lower VARCHAR(320) AS (LOWER(email)),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_customers_mobile_number ON customers(mobile_number);
CREATE UNIQUE INDEX IF NOT EXISTS uq_customers_email ON customers(email_lower);

CREATE TABLE IF NOT EXISTS gold_wallets (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  total_grams NUMERIC(20,8) NOT NULL DEFAULT 0,
  reserved_grams NUMERIC(20,8) NOT NULL DEFAULT 0,
  encumbered_grams NUMERIC(20,8) NOT NULL DEFAULT 0,
  version BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_wallet_customer ON gold_wallets(customer_id);

CREATE TABLE IF NOT EXISTS ledger_transactions (
  id UUID PRIMARY KEY,
  idempotency_key VARCHAR(128) NOT NULL UNIQUE,
  customer_id UUID,
  transaction_type VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL,
  gold_grams NUMERIC(20,8) NOT NULL DEFAULT 0,
  currency_amount NUMERIC(20,2),
  currency VARCHAR(3),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ledger_customer_created ON ledger_transactions(customer_id, created_at);

CREATE TABLE IF NOT EXISTS ownership_entries (
  id UUID PRIMARY KEY,
  asset_type VARCHAR(32) NOT NULL,
  asset_reference VARCHAR(128) NOT NULL,
  owner_type VARCHAR(32) NOT NULL,
  owner_reference VARCHAR(128) NOT NULL,
  gold_grams NUMERIC(20,8) NOT NULL,
  status VARCHAR(32) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ownership_asset ON ownership_entries(asset_type, asset_reference);

CREATE TABLE IF NOT EXISTS otp_requests (
  id UUID PRIMARY KEY,
  mobile_number VARCHAR(32) NOT NULL,
  purpose VARCHAR(32) NOT NULL,
  otp_hash VARCHAR(128) NOT NULL,
  full_name VARCHAR(160),
  email VARCHAR(320),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_otp_mobile_created ON otp_requests(mobile_number, created_at);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  refresh_token_hash VARCHAR(128) NOT NULL UNIQUE,
  device_id VARCHAR(160),
  device_name VARCHAR(160),
  ip_address VARCHAR(64),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_customer ON auth_sessions(customer_id, revoked_at, expires_at);

CREATE TABLE IF NOT EXISTS ledger_accounts (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  account_type VARCHAR(64) NOT NULL,
  asset_type VARCHAR(32) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_ledger_account_owner_type_asset ON ledger_accounts(customer_id, account_type, asset_type);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id UUID PRIMARY KEY,
  ledger_transaction_id UUID NOT NULL REFERENCES ledger_transactions(id),
  ledger_account_id UUID NOT NULL REFERENCES ledger_accounts(id),
  entry_type VARCHAR(16) NOT NULL,
  asset_type VARCHAR(32) NOT NULL,
  gold_grams NUMERIC(20,8) NOT NULL DEFAULT 0,
  currency_amount NUMERIC(20,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ck_ledger_entry_amount CHECK (gold_grams >= 0 AND (currency_amount IS NULL OR currency_amount >= 0)),
  CONSTRAINT ck_ledger_entry_type CHECK (entry_type IN ('DEBIT', 'CREDIT'))
);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_transaction ON ledger_entries(ledger_transaction_id);

CREATE TABLE IF NOT EXISTS wallet_reservations (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  wallet_id UUID NOT NULL REFERENCES gold_wallets(id),
  ledger_transaction_id UUID NOT NULL REFERENCES ledger_transactions(id),
  gold_grams NUMERIC(20,8) NOT NULL,
  status VARCHAR(16) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  released_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT ck_reservation_gold CHECK (gold_grams > 0),
  CONSTRAINT ck_reservation_status CHECK (status IN ('ACTIVE', 'CONSUMED', 'RELEASED', 'EXPIRED'))
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_wallet_reservation_idempotency ON wallet_reservations(ledger_transaction_id);
CREATE INDEX IF NOT EXISTS idx_wallet_reservations_customer_status ON wallet_reservations(customer_id, status, expires_at);

CREATE TABLE IF NOT EXISTS gold_price_quotes (
  id UUID PRIMARY KEY,
  currency VARCHAR(3) NOT NULL,
  purity VARCHAR(16) NOT NULL,
  buy_price_per_gram NUMERIC(20,2) NOT NULL,
  sell_price_per_gram NUMERIC(20,2) NOT NULL,
  source VARCHAR(64) NOT NULL,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ck_gold_quote_prices CHECK (buy_price_per_gram > 0 AND sell_price_per_gram > 0),
  CONSTRAINT ck_gold_quote_window CHECK (valid_until > valid_from)
);
CREATE INDEX IF NOT EXISTS idx_gold_price_quotes_validity ON gold_price_quotes(valid_from, valid_until);

CREATE TABLE IF NOT EXISTS price_locks (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  quote_id UUID NOT NULL REFERENCES gold_price_quotes(id),
  operation_type VARCHAR(32) NOT NULL,
  price_per_gram NUMERIC(20,2) NOT NULL,
  quantity_grams NUMERIC(20,8) NOT NULL,
  amount NUMERIC(20,2) NOT NULL,
  status VARCHAR(16) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ck_price_lock_quantity CHECK (quantity_grams > 0 AND amount > 0),
  CONSTRAINT ck_price_lock_status CHECK (status IN ('ACTIVE', 'USED', 'EXPIRED', 'CANCELLED'))
);
CREATE INDEX IF NOT EXISTS idx_price_locks_customer_status ON price_locks(customer_id, status, expires_at);

CREATE TABLE IF NOT EXISTS gold_orders (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  price_lock_id UUID NOT NULL REFERENCES price_locks(id),
  order_type VARCHAR(16) NOT NULL,
  quantity_grams NUMERIC(20,8) NOT NULL,
  price_per_gram NUMERIC(20,2) NOT NULL,
  total_amount NUMERIC(20,2) NOT NULL,
  status VARCHAR(32) NOT NULL,
  idempotency_key VARCHAR(128) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT ck_gold_order_type CHECK (order_type IN ('BUY', 'SELL')),
  CONSTRAINT ck_gold_order_values CHECK (quantity_grams > 0 AND total_amount > 0)
);
CREATE INDEX IF NOT EXISTS idx_gold_orders_customer_created ON gold_orders(customer_id, created_at);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  order_id UUID NOT NULL REFERENCES gold_orders(id),
  provider VARCHAR(64) NOT NULL,
  provider_payment_id VARCHAR(160) NOT NULL UNIQUE,
  amount NUMERIC(20,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  payment_method VARCHAR(64),
  status VARCHAR(32) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT ck_payment_amount CHECK (amount > 0),
  CONSTRAINT ck_payment_status CHECK (status IN ('CREATED', 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'))
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_payment_order ON payments(order_id);

CREATE TABLE IF NOT EXISTS payment_webhook_events (
  id UUID PRIMARY KEY,
  provider VARCHAR(64) NOT NULL,
  event_id VARCHAR(160) NOT NULL UNIQUE,
  payment_id VARCHAR(160) NOT NULL,
  event_type VARCHAR(64) NOT NULL,
  payload_hash VARCHAR(128) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP WITH TIME ZONE
);
