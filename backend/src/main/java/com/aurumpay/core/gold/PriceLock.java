package com.aurumpay.core.gold;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "price_locks")
public class PriceLock {
    @Id private UUID id;
    @Column(name = "customer_id", nullable = false) private UUID customerId;
    @Column(name = "quote_id", nullable = false) private UUID quoteId;
    @Column(name = "operation_type", nullable = false) private String operationType;
    @Column(name = "price_per_gram", nullable = false, precision = 20, scale = 2) private BigDecimal pricePerGram;
    @Column(name = "quantity_grams", nullable = false, precision = 20, scale = 8) private BigDecimal quantityGrams;
    @Column(nullable = false, precision = 20, scale = 2) private BigDecimal amount;
    @Column(nullable = false) private String status;
    @Column(name = "expires_at", nullable = false) private Instant expiresAt;
    @Column(name = "created_at", nullable = false) private Instant createdAt;

    protected PriceLock() {}

    public PriceLock(UUID customerId, GoldPriceQuote quote, BigDecimal quantityGrams, BigDecimal amount, Instant expiresAt) {
        this.id = UUID.randomUUID(); this.customerId = customerId; this.quoteId = quote.getId(); this.operationType = "BUY";
        this.pricePerGram = quote.getBuyPricePerGram(); this.quantityGrams = quantityGrams; this.amount = amount;
        this.status = "ACTIVE"; this.expiresAt = expiresAt; this.createdAt = Instant.now();
    }
    public boolean isActive(Instant now) { return "ACTIVE".equals(status) && expiresAt.isAfter(now); }
    public void markUsed() { status = "USED"; }
    public UUID getId() { return id; }
    public UUID getCustomerId() { return customerId; }
    public BigDecimal getPricePerGram() { return pricePerGram; }
    public BigDecimal getQuantityGrams() { return quantityGrams; }
    public BigDecimal getAmount() { return amount; }
}
