package com.aurumpay.core.payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public final class PaymentDtos {
    private PaymentDtos() {}
    public record CreatePaymentCommand(@NotBlank String orderId, @NotBlank String idempotencyKey, @NotBlank String paymentMethod) {}
    public record PaymentResponse(String paymentId, String providerPaymentId, String status, BigDecimal amount, String currency) {}
    public record WebhookCommand(@NotBlank String eventId, @NotBlank String providerPaymentId, @NotBlank String eventType,
                                 @NotNull Boolean successful, @NotNull BigDecimal amount, @NotBlank String currency) {}
}
