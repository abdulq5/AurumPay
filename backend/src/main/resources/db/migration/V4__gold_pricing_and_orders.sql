CREATE TABLE IF NOT EXISTS gold_price_quotes (
  id UUID PRIMARY KEY,
  currency VARCHAR(3) NOT NULL,
  purity VARCHAR(16) NOT NULL,
  buy_price_per_gram NUMERIC(20,2) NOT NULL,
  sell_price_per_gram NUMERIC(20,2) NOT NULL,
  source VARCHAR(64) NOT NULL,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ck_gold_quote_prices CHECK (buy_price_per_gram > 0 AND sell_price_per_gram > 0),
  CONSTRAINT ck_gold_quote_window CHECK (valid_until > valid_from)
);

CREATE INDEX IF NOT EXISTS idx_gold_price_quotes_validity
  ON gold_price_quotes (valid_from, valid_until);

CREATE TABLE IF NOT EXISTS price_locks (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  quote_id UUID NOT NULL REFERENCES gold_price_quotes(id),
  operation_type VARCHAR(32) NOT NULL,
  price_per_gram NUMERIC(20,2) NOT NULL,
  quantity_grams NUMERIC(20,8) NOT NULL,
  amount NUMERIC(20,2) NOT NULL,
  status VARCHAR(16) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ck_price_lock_quantity CHECK (quantity_grams > 0 AND amount > 0),
  CONSTRAINT ck_price_lock_status CHECK (status IN ('ACTIVE', 'USED', 'EXPIRED', 'CANCELLED'))
);

CREATE INDEX IF NOT EXISTS idx_price_locks_customer_status
  ON price_locks (customer_id, status, expires_at);

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
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMPTZ,
  CONSTRAINT ck_gold_order_type CHECK (order_type IN ('BUY', 'SELL')),
  CONSTRAINT ck_gold_order_values CHECK (quantity_grams > 0 AND total_amount > 0)
);

CREATE INDEX IF NOT EXISTS idx_gold_orders_customer_created
  ON gold_orders (customer_id, created_at DESC);