# AurumPay Foundation

This is the first professional development foundation for the AurumPay project.

## Backend
Requirements: Java 21, Maven 3.6+, Docker.

```bash
cd infra
docker compose up -d
cd ../backend
mvn spring-boot:run
```

Health: http://localhost:8080/api/v1/health
Gold quote demo: http://localhost:8080/api/v1/gold/quote

## Mobile
Requirements: Node.js 22 LTS recommended, Android Studio + Android SDK + emulator.

```bash
cd mobile
npm install
npx expo start
```

For native Android development:
```bash
npx expo run:android
```

This foundation intentionally contains demo endpoints only. Real financial transaction logic will be implemented behind atomic services, database constraints, idempotency keys, ledger entries and audit events before production use.
