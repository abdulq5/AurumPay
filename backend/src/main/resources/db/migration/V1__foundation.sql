CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY,
  status VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS gold_wallets (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  total_grams NUMERIC(20,8) NOT NULL DEFAULT 0,
  reserved_grams NUMERIC(20,8) NOT NULL DEFAULT 0,
  encumbered_grams NUMERIC(20,8) NOT NULL DEFAULT 0,
  version BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS ledger_transactions (
  id UUID PRIMARY KEY,
  idempotency_key VARCHAR(128) NOT NULL UNIQUE,
  customer_id UUID,
  transaction_type VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL,
  gold_grams NUMERIC(20,8) NOT NULL DEFAULT 0,
  currency_amount NUMERIC(20,2),
  currency VARCHAR(3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS ownership_entries (
  id UUID PRIMARY KEY,
  asset_type VARCHAR(32) NOT NULL,
  asset_reference VARCHAR(128) NOT NULL,
  owner_type VARCHAR(32) NOT NULL,
  owner_reference VARCHAR(128) NOT NULL,
  gold_grams NUMERIC(20,8) NOT NULL,
  status VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_wallet_customer ON gold_wallets(customer_id);
CREATE INDEX IF NOT EXISTS idx_ledger_customer_created ON ledger_transactions(customer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ownership_asset ON ownership_entries(asset_type, asset_reference);
