# AurumPay Business Rules Baseline

## Bullion / Vault 1
- Bullion seller deposits physical bullion into Vault 1 before selling digital gold.
- Digital gold supply is constrained by the applicable physical backing/accounting model.
- Bullion seller buys digital gold back from customers at the current buy price.
- Track sales, buybacks, redemptions, merchant payments, liens, ownership and physical stock.
- Around 75% stock consumption/commitment triggers replenishment planning; recommended quantity is trend/forecast based.
- Daily/monthly/yearly/custom reporting is required.

## Customer wallet
Track total, reserved, encumbered and available gold. Any gold-consuming operation must check available gold and atomically reserve/consume it.

## Redemption
Customer selects jewellery/coin from jeweller marketplace. Required gold is calculated from current selling price and product value. After successful conversion, the corresponding gold entitlement transfers to the jeweller. Jeweller may claim physical gold from Vault 1 after verification/audit or cash from the Liquidity Provider. If LP pays cash, corresponding physical gold entitlement ultimately moves to LP.

## Merchant payments
Liquidity Provider pays the merchant in fiat. AurumPay checks available gold, reserves/consumes it and records the transaction. Final post-payment gold ownership treatment remains a business decision and must not be invented in code until finalized.

## Loans / Vault 2
Digital gold is not directly collateralized. Customer converts digital gold into jewellery using the current selling price. Jewellery may be shipped to the customer or sent to Vault 2. Vault 2 stores identified jewellery, not fungible bullion. Customer remains owner while lender holds a lien/security interest. Jewellery cannot be released or reused until the loan is fully settled and the lien is released.

## Audit / reconciliation
External auditors can perform daily Vault 1 reconciliation between physical count, vault records, AurumPay ledgers and ownership. Vault 2 also requires auditability.

## Security
MFA, RBAC, organization isolation, encryption, immutable audit trail, idempotency, transaction locking, fraud/risk controls, rate limiting, secure secrets, backups and disaster recovery are mandatory production requirements.
