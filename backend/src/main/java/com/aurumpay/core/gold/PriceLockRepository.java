package com.aurumpay.core.gold;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface PriceLockRepository extends JpaRepository<PriceLock, UUID> {
    Optional<PriceLock> findByIdAndCustomerId(UUID id, UUID customerId);
}
