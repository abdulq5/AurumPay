package com.aurumpay.core.ledger;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ledger_entries")
public class LedgerEntry {
    @Id private UUID id;
    @Column(name = "ledger_transaction_id", nullable = false) private UUID ledgerTransactionId;
    @Column(name = "ledger_account_id", nullable = false) private UUID ledgerAccountId;
    @Column(name = "entry_type", nullable = false) private String entryType;
    @Column(name = "asset_type", nullable = false) private String assetType;
    @Column(name = "gold_grams", nullable = false, precision = 20, scale = 8) private BigDecimal goldGrams;
    @Column(name = "created_at", nullable = false) private Instant createdAt;

    protected LedgerEntry() {}
    public LedgerEntry(UUID transactionId, UUID accountId, String entryType, String assetType, BigDecimal goldGrams) {
        this.id = UUID.randomUUID(); this.ledgerTransactionId = transactionId; this.ledgerAccountId = accountId;
        this.entryType = entryType; this.assetType = assetType; this.goldGrams = goldGrams; this.createdAt = Instant.now();
    }
}
