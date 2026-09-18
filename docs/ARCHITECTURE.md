# AurumPay Architecture

AurumPay starts as a **modular monolith** rather than prematurely splitting into microservices. The core remains one Spring Boot deployment with strict domain boundaries. This gives transaction integrity and faster development; domains can later be extracted behind APIs/events.

## Stack
- Mobile: React Native + TypeScript, Expo SDK 57 / RN 0.86, Android Studio for native builds and emulator.
- Backend: Java 21 + Spring Boot 4.1.x + Maven.
- Database: PostgreSQL.
- Cache/short-lived state: Redis.
- Async/event backbone: Kafka (introduced when settlement, notifications and integrations need durable async processing).
- Object storage: S3-compatible storage for KYC documents, jewellery media, audit evidence.
- API: REST + OpenAPI.
- Testing: JUnit, Spring Boot Test, Testcontainers, contract/integration tests.
- Observability: Actuator + Micrometer/OpenTelemetry.

## Domains
Identity/KYC, Customer, Gold Pricing, Digital Gold Wallet, Gold Ledger, Ownership Ledger, Availability/Encumbrance, Payments, Redemption, Jewellery Marketplace, Loans, Liens, Vault 1, Vault 2, Settlement, Reconciliation, Audit, Notifications, Reporting, Partner Integrations.

## Three-ledger model
1. Physical Gold Ledger: what physically exists and where.
2. Ownership Ledger: who owns/has economic entitlement.
3. Availability/Encumbrance Ledger: available, reserved, committed, liened.

No transaction that consumes gold may rely only on total balance. It must atomically verify available gold and reserve/consume it.
