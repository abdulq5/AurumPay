package com.aurumpay.core.wallet;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "gold_wallets")
public class GoldWallet {
    @Id private UUID id;
    @Column(name = "customer_id", nullable = false) private UUID customerId;
    @Column(name = "total_grams", nullable = false, precision = 20, scale = 8) private BigDecimal totalGrams;
    @Column(name = "reserved_grams", nullable = false, precision = 20, scale = 8) private BigDecimal reservedGrams;
    @Column(name = "encumbered_grams", nullable = false, precision = 20, scale = 8) private BigDecimal encumberedGrams;
    @Version private long version;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;

    protected GoldWallet() {}

    public GoldWallet(UUID customerId) {
        this.id = UUID.randomUUID();
        this.customerId = customerId;
        this.totalGrams = BigDecimal.ZERO;
        this.reservedGrams = BigDecimal.ZERO;
        this.encumberedGrams = BigDecimal.ZERO;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    public BigDecimal availableGrams() { return totalGrams.subtract(reservedGrams).subtract(encumberedGrams); }
    public void credit(BigDecimal grams) { totalGrams = totalGrams.add(grams); updatedAt = Instant.now(); }
    public void reserve(BigDecimal grams) { reservedGrams = reservedGrams.add(grams); updatedAt = Instant.now(); }
    public void release(BigDecimal grams) { reservedGrams = reservedGrams.subtract(grams); updatedAt = Instant.now(); }
    public UUID getId() { return id; }
    public UUID getCustomerId() { return customerId; }
    public BigDecimal getTotalGrams() { return totalGrams; }
    public BigDecimal getReservedGrams() { return reservedGrams; }
    public BigDecimal getEncumberedGrams() { return encumberedGrams; }
}
