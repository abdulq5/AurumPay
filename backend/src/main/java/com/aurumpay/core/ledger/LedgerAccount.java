package com.aurumpay.core.ledger;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ledger_accounts")
public class LedgerAccount {
    @Id private UUID id;
    @Column(name = "customer_id") private UUID customerId;
    @Column(name = "account_type", nullable = false) private String accountType;
    @Column(name = "asset_type", nullable = false) private String assetType;
    @Column(name = "created_at", nullable = false) private Instant createdAt;

    protected LedgerAccount() {}
    public LedgerAccount(UUID customerId, String accountType, String assetType) {
        this.id = UUID.randomUUID(); this.customerId = customerId; this.accountType = accountType;
        this.assetType = assetType; this.createdAt = Instant.now();
    }
    public UUID getId() { return id; }
}
