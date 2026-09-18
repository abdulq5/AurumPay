package com.aurumpay.core.payment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "payment_webhook_events")
public class PaymentWebhookEvent {
    @Id private UUID id;
    @Column(nullable = false) private String provider;
    @Column(name = "event_id", nullable = false, unique = true) private String eventId;
    @Column(name = "payment_id", nullable = false) private String paymentId;
    @Column(name = "event_type", nullable = false) private String eventType;
    @Column(name = "payload_hash", nullable = false) private String payloadHash;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "processed_at") private Instant processedAt;

    protected PaymentWebhookEvent() {}
    public PaymentWebhookEvent(String eventId, String paymentId, String eventType, String payloadHash) {
        this.id = UUID.randomUUID(); this.provider = "DEMO"; this.eventId = eventId; this.paymentId = paymentId;
        this.eventType = eventType; this.payloadHash = payloadHash; this.createdAt = Instant.now();
    }
    public void markProcessed() { processedAt = Instant.now(); }
}
