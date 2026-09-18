package com.aurumpay.core.gold;

import org.springframework.data.jpa.repository.JpaRepository;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import java.util.UUID;

public interface GoldOrderRepository extends JpaRepository<GoldOrder, UUID> {
    Optional<GoldOrder> findByIdempotencyKey(String idempotencyKey);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select order from GoldOrder order where order.id = :id")
    Optional<GoldOrder> findByIdForUpdate(UUID id);
}
