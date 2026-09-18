package com.aurumpay.core.payment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "payments")
public class Payment {
    @Id private UUID id;
    @Column(name = "customer_id", nullable = false) private UUID customerId;
    @Column(name = "order_id", nullable = false) private UUID orderId;
    @Column(nullable = false) private String provider;
    @Column(name = "provider_payment_id", nullable = false, unique = true) private String providerPaymentId;
    @Column(nullable = false, precision = 20, scale = 2) private BigDecimal amount;
    @Column(nullable = false) private String currency;
    @Column(name = "payment_method") private String paymentMethod;
    @Column(nullable = false) private String status;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "completed_at") private Instant completedAt;

    protected Payment() {}
    public Payment(UUID customerId, UUID orderId, BigDecimal amount, String paymentMethod, String providerPaymentId) {
        this.id = UUID.randomUUID(); this.customerId = customerId; this.orderId = orderId; this.provider = "DEMO";
        this.providerPaymentId = providerPaymentId; this.amount = amount; this.currency = "INR"; this.paymentMethod = paymentMethod;
        this.status = "PENDING"; this.createdAt = Instant.now();
    }
    public boolean isSuccessful() { return "SUCCESS".equals(status); }
    public void markSuccess() { status = "SUCCESS"; completedAt = Instant.now(); }
    public UUID getId() { return id; }
    public UUID getCustomerId() { return customerId; }
    public UUID getOrderId() { return orderId; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public String getProviderPaymentId() { return providerPaymentId; }
    public String getStatus() { return status; }
}
