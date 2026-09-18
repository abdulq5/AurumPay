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

class GoldOrderServiceTest {
    private final PriceLockRepository lockRepository = mock(PriceLockRepository.class);
    private final GoldOrderRepository orderRepository = mock(GoldOrderRepository.class);
    private final GoldOrderService service = new GoldOrderService(lockRepository, orderRepository);

    @Test
    void createsOrderAndConsumesActiveLock() {
        UUID customerId = UUID.randomUUID();
        PriceLock lock = new PriceLock(customerId, quote(), new BigDecimal("0.15822784"), new BigDecimal("1000.00"), Instant.now().plusSeconds(300));
        when(orderRepository.findByIdempotencyKey("order-1")).thenReturn(Optional.empty());
        when(lockRepository.findByIdAndCustomerId(lock.getId(), customerId)).thenReturn(Optional.of(lock));
        when(orderRepository.save(any(GoldOrder.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(lockRepository.save(any(PriceLock.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GoldDtos.BuyOrderResponse response = service.createBuyOrder(customerId, new GoldDtos.BuyOrderCommand(lock.getId().toString(), "order-1"));

        assertThat(response.status()).isEqualTo("PAYMENT_PENDING");
        assertThat(response.totalAmount()).isEqualByComparingTo("1000.00");
        verify(orderRepository).save(any(GoldOrder.class));
        verify(lockRepository).save(lock);
    }

    @Test
    void rejectsExpiredLock() {
        UUID customerId = UUID.randomUUID();
        PriceLock lock = new PriceLock(customerId, quote(), new BigDecimal("1.00000000"), new BigDecimal("6320.00"), Instant.now().minusSeconds(1));
        when(orderRepository.findByIdempotencyKey("order-1")).thenReturn(Optional.empty());
        when(lockRepository.findByIdAndCustomerId(lock.getId(), customerId)).thenReturn(Optional.of(lock));

        assertThatThrownBy(() -> service.createBuyOrder(customerId, new GoldDtos.BuyOrderCommand(lock.getId().toString(), "order-1")))
            .isInstanceOf(GoldException.class)
            .hasMessageContaining("expired");
        verify(orderRepository).findByIdempotencyKey("order-1");
        verify(lockRepository).findByIdAndCustomerId(lock.getId(), customerId);
        verify(orderRepository, never()).save(any(GoldOrder.class));
        verify(lockRepository, never()).save(any(PriceLock.class));
    }

    private GoldPriceQuote quote() {
        Instant now = Instant.now();
        return new GoldPriceQuote(new BigDecimal("6320.00"), new BigDecimal("6180.00"), now.minusSeconds(10), now.plusSeconds(300));
    }
}
