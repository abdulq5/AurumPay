package com.aurumpay.core.ledger;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ledger_transactions")
public class LedgerTransaction {
    @Id private UUID id;
    @Column(name = "idempotency_key", nullable = false, unique = true) private String idempotencyKey;
    @Column(name = "customer_id") private UUID customerId;
    @Column(name = "transaction_type", nullable = false) private String transactionType;
    @Column(nullable = false) private String status;
    @Column(name = "gold_grams", nullable = false, precision = 20, scale = 8) private BigDecimal goldGrams;
    @Column(name = "created_at", nullable = false) private Instant createdAt;

    protected LedgerTransaction() {}

    public LedgerTransaction(String idempotencyKey, UUID customerId, String transactionType, String status, BigDecimal goldGrams) {
        this.id = UUID.randomUUID(); this.idempotencyKey = idempotencyKey; this.customerId = customerId;
        this.transactionType = transactionType; this.status = status; this.goldGrams = goldGrams; this.createdAt = Instant.now();
    }
    public UUID getId() { return id; }
    public UUID getCustomerId() { return customerId; }
}
