package com.aurumpay.core.ledger;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface LedgerAccountRepository extends JpaRepository<LedgerAccount, UUID> {
    Optional<LedgerAccount> findByCustomerIdAndAccountTypeAndAssetType(UUID customerId, String accountType, String assetType);
}
