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
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMPTZ,
  CONSTRAINT ck_payment_amount CHECK (amount > 0),
  CONSTRAINT ck_payment_status CHECK (status IN ('CREATED', 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'))
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_payment_order
  ON payments (order_id);

CREATE TABLE IF NOT EXISTS payment_webhook_events (
  id UUID PRIMARY KEY,
  provider VARCHAR(64) NOT NULL,
  event_id VARCHAR(160) NOT NULL UNIQUE,
  payment_id VARCHAR(160) NOT NULL,
  event_type VARCHAR(64) NOT NULL,
  payload_hash VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMPTZ
);