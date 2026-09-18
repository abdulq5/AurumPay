CREATE UNIQUE INDEX IF NOT EXISTS uq_gold_wallet_customer
  ON gold_wallets (customer_id);

CREATE TABLE IF NOT EXISTS ledger_accounts (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  account_type VARCHAR(64) NOT NULL,
  asset_type VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_ledger_account_owner_type_asset
  ON ledger_accounts (customer_id, account_type, asset_type);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id UUID PRIMARY KEY,
  ledger_transaction_id UUID NOT NULL REFERENCES ledger_transactions(id),
  ledger_account_id UUID NOT NULL REFERENCES ledger_accounts(id),
  entry_type VARCHAR(16) NOT NULL,
  asset_type VARCHAR(32) NOT NULL,
  gold_grams NUMERIC(20,8) NOT NULL DEFAULT 0,
  currency_amount NUMERIC(20,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ck_ledger_entry_amount CHECK (gold_grams >= 0 AND (currency_amount IS NULL OR currency_amount >= 0)),
  CONSTRAINT ck_ledger_entry_type CHECK (entry_type IN ('DEBIT', 'CREDIT'))
);

CREATE INDEX IF NOT EXISTS idx_ledger_entries_transaction
  ON ledger_entries (ledger_transaction_id);

CREATE TABLE IF NOT EXISTS wallet_reservations (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  wallet_id UUID NOT NULL REFERENCES gold_wallets(id),
  ledger_transaction_id UUID NOT NULL REFERENCES ledger_transactions(id),
  gold_grams NUMERIC(20,8) NOT NULL,
  status VARCHAR(16) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  released_at TIMESTAMPTZ,
  CONSTRAINT ck_reservation_gold CHECK (gold_grams > 0),
  CONSTRAINT ck_reservation_status CHECK (status IN ('ACTIVE', 'CONSUMED', 'RELEASED', 'EXPIRED'))
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_wallet_reservation_idempotency
  ON wallet_reservations (ledger_transaction_id);
CREATE INDEX IF NOT EXISTS idx_wallet_reservations_customer_status
  ON wallet_reservations (customer_id, status, expires_at);