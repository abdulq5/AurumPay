package com.aurumpay.core.gold;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class GoldPricingServiceTest {
    private final GoldPriceQuoteRepository quoteRepository = mock(GoldPriceQuoteRepository.class);
    private final PriceLockRepository lockRepository = mock(PriceLockRepository.class);
    private final GoldPricingService service = new GoldPricingService(quoteRepository, lockRepository);

    @Test
    void createsQuantityFromInrAmountUsingServerPrice() {
        Instant now = Instant.now();
        GoldPriceQuote quote = new GoldPriceQuote(new BigDecimal("6320.00"), new BigDecimal("6180.00"), now.minusSeconds(10), now.plusSeconds(50));
        when(quoteRepository.findFirstByValidFromLessThanEqualAndValidUntilGreaterThanOrderByCreatedAtDesc(any(), any())).thenReturn(Optional.of(quote));
        when(lockRepository.save(any(PriceLock.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GoldDtos.PriceLockResponse response = service.createBuyLock(UUID.randomUUID(), new GoldDtos.PriceLockCommand(new BigDecimal("1000.00"), null));

        assertThat(response.pricePerGram()).isEqualByComparingTo("6320.00");
        assertThat(response.amount()).isEqualByComparingTo("1000.00");
        assertThat(response.quantityGrams()).isEqualByComparingTo("0.15822784");
    }

    @Test
    void rejectsAmountAndQuantityTogether() {
        assertThatThrownBy(() -> service.createBuyLock(UUID.randomUUID(), new GoldDtos.PriceLockCommand(new BigDecimal("1000"), new BigDecimal("1"))))
            .isInstanceOf(GoldException.class)
            .hasMessageContaining("exactly one");
        verifyNoInteractions(quoteRepository, lockRepository);
    }
}
