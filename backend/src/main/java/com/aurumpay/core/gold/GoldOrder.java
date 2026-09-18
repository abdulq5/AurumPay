package com.aurumpay.core.gold;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "gold_orders")
public class GoldOrder {
    @Id private UUID id;
    @Column(name = "customer_id", nullable = false) private UUID customerId;
    @Column(name = "price_lock_id", nullable = false) private UUID priceLockId;
    @Column(name = "order_type", nullable = false) private String orderType;
    @Column(name = "quantity_grams", nullable = false, precision = 20, scale = 8) private BigDecimal quantityGrams;
    @Column(name = "price_per_gram", nullable = false, precision = 20, scale = 2) private BigDecimal pricePerGram;
    @Column(name = "total_amount", nullable = false, precision = 20, scale = 2) private BigDecimal totalAmount;
    @Column(nullable = false) private String status;
    @Column(name = "idempotency_key", nullable = false, unique = true) private String idempotencyKey;
    @Column(name = "created_at", nullable = false) private Instant createdAt;

    protected GoldOrder() {}

    public GoldOrder(UUID customerId, PriceLock lock, String idempotencyKey) {
        this.id = UUID.randomUUID(); this.customerId = customerId; this.priceLockId = lock.getId(); this.orderType = "BUY";
        this.quantityGrams = lock.getQuantityGrams(); this.pricePerGram = lock.getPricePerGram(); this.totalAmount = lock.getAmount();
        this.status = "PAYMENT_PENDING"; this.idempotencyKey = idempotencyKey; this.createdAt = Instant.now();
    }
    public UUID getId() { return id; }
    public UUID getCustomerId() { return customerId; }
    public String getStatus() { return status; }
    public BigDecimal getQuantityGrams() { return quantityGrams; }
    public BigDecimal getPricePerGram() { return pricePerGram; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public boolean isPaymentPending() { return "PAYMENT_PENDING".equals(status); }
    public boolean isCompleted() { return "COMPLETED".equals(status); }
    public void markCompleted() { status = "COMPLETED"; }
}
