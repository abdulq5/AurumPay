ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS full_name VARCHAR(160),
  ADD COLUMN IF NOT EXISTS email VARCHAR(320),
  ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(32),
  ADD COLUMN IF NOT EXISTS mobile_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS uq_customers_mobile_number
  ON customers (mobile_number)
  WHERE mobile_number IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_customers_email
  ON customers (LOWER(email))
  WHERE email IS NOT NULL;

CREATE TABLE IF NOT EXISTS otp_requests (
  id UUID PRIMARY KEY,
  mobile_number VARCHAR(32) NOT NULL,
  purpose VARCHAR(32) NOT NULL,
  otp_hash VARCHAR(128) NOT NULL,
  full_name VARCHAR(160),
  email VARCHAR(320),
  expires_at TIMESTAMPTZ NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_otp_mobile_created
  ON otp_requests (mobile_number, created_at DESC);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  refresh_token_hash VARCHAR(128) NOT NULL UNIQUE,
  device_id VARCHAR(160),
  device_name VARCHAR(160),
  ip_address VARCHAR(64),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_customer
  ON auth_sessions (customer_id, revoked_at, expires_at);