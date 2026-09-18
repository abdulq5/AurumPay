package com.aurumpay.core.gold;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;

public final class GoldDtos {
    private GoldDtos() {}

    public record QuoteResponse(String quoteId, String currency, String purity, BigDecimal buyPricePerGram,
                                 BigDecimal sellPricePerGram, String source, Instant validUntil) {}

    public record PriceLockCommand(
        @DecimalMin(value = "0.01", inclusive = false) BigDecimal amount,
        @DecimalMin(value = "0.00000001", inclusive = false) BigDecimal quantityGrams
    ) {}

    public record PriceLockResponse(String lockId, BigDecimal quantityGrams, BigDecimal pricePerGram,
                                    BigDecimal amount, Instant expiresAt, String status) {}

    public record BuyOrderCommand(@NotBlank String priceLockId, @NotBlank String idempotencyKey) {}

    public record BuyOrderResponse(String orderId, String status, BigDecimal quantityGrams,
                                   BigDecimal pricePerGram, BigDecimal totalAmount) {}
}
