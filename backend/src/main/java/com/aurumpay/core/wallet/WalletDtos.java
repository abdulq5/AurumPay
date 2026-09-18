package com.aurumpay.core.wallet;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public final class WalletDtos {
    private WalletDtos() {}

    public record WalletResponse(BigDecimal totalGrams, BigDecimal reservedGrams, BigDecimal encumberedGrams, BigDecimal availableGrams) {}

    public record ReserveGoldCommand(
        @NotBlank String idempotencyKey,
        @NotNull @DecimalMin(value = "0.00000001") BigDecimal goldGrams
    ) {}

    public record ReservationResponse(String transactionId, String status, BigDecimal reservedGrams, BigDecimal availableGrams) {}
}
