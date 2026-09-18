package com.aurumpay.core.wallet;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import java.util.UUID;

public interface GoldWalletRepository extends JpaRepository<GoldWallet, UUID> {
    Optional<GoldWallet> findByCustomerId(UUID customerId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select wallet from GoldWallet wallet where wallet.customerId = :customerId")
    Optional<GoldWallet> findByCustomerIdForUpdate(UUID customerId);
}
