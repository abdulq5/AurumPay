package com.aurumpay.core.gold;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface GoldPriceQuoteRepository extends JpaRepository<GoldPriceQuote, UUID> {
    Optional<GoldPriceQuote> findFirstByValidFromLessThanEqualAndValidUntilGreaterThanOrderByCreatedAtDesc(Instant now, Instant sameNow);
}
