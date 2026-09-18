package com.aurumpay.core.gold;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class GoldOrderService {
    private final PriceLockRepository lockRepository;
    private final GoldOrderRepository orderRepository;

    public GoldOrderService(PriceLockRepository lockRepository, GoldOrderRepository orderRepository) {
        this.lockRepository = lockRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public GoldDtos.BuyOrderResponse createBuyOrder(UUID customerId, GoldDtos.BuyOrderCommand command) {
        GoldOrder existing = orderRepository.findByIdempotencyKey(command.idempotencyKey()).orElse(null);
        if (existing != null) {
            if (!existing.getCustomerId().equals(customerId)) {
                throw new GoldException("IDEMPOTENCY_KEY_CONFLICT", "The idempotency key belongs to another customer.");
            }
            return response(existing);
        }
        UUID lockId;
        try {
            lockId = UUID.fromString(command.priceLockId());
        } catch (IllegalArgumentException exception) {
            throw new GoldException("PRICE_LOCK_INVALID", "The price lock identifier is invalid.");
        }
        PriceLock lock = lockRepository.findByIdAndCustomerId(lockId, customerId)
            .orElseThrow(() -> new GoldException("PRICE_LOCK_NOT_FOUND", "The price lock was not found."));
        if (!lock.isActive(Instant.now())) {
            throw new GoldException("PRICE_LOCK_EXPIRED", "The price lock is expired or already used.");
        }
        GoldOrder order = orderRepository.save(new GoldOrder(customerId, lock, command.idempotencyKey()));
        lock.markUsed();
        lockRepository.save(lock);
        return response(order);
    }

    private GoldDtos.BuyOrderResponse response(GoldOrder order) {
        return new GoldDtos.BuyOrderResponse(order.getId().toString(), order.getStatus(), order.getQuantityGrams(), order.getPricePerGram(), order.getTotalAmount());
    }
}
