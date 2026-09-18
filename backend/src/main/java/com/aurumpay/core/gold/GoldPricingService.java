package com.aurumpay.core.gold;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
public class GoldPricingService {
    private static final BigDecimal DEMO_BUY_PRICE = new BigDecimal("6320.00");
    private static final BigDecimal DEMO_SELL_PRICE = new BigDecimal("6180.00");
    private static final Duration QUOTE_LIFETIME = Duration.ofMinutes(1);
    private static final Duration LOCK_LIFETIME = Duration.ofMinutes(5);

    private final GoldPriceQuoteRepository quoteRepository;
    private final PriceLockRepository lockRepository;

    public GoldPricingService(GoldPriceQuoteRepository quoteRepository, PriceLockRepository lockRepository) {
        this.quoteRepository = quoteRepository;
        this.lockRepository = lockRepository;
    }

    @Transactional
    public GoldDtos.QuoteResponse currentQuote() {
        Instant now = Instant.now();
        GoldPriceQuote quote = quoteRepository
            .findFirstByValidFromLessThanEqualAndValidUntilGreaterThanOrderByCreatedAtDesc(now, now)
            .orElseGet(() -> quoteRepository.save(new GoldPriceQuote(DEMO_BUY_PRICE, DEMO_SELL_PRICE, now, now.plus(QUOTE_LIFETIME))));
        return new GoldDtos.QuoteResponse(quote.getId().toString(), quote.getCurrency(), quote.getPurity(),
            quote.getBuyPricePerGram(), quote.getSellPricePerGram(), quote.getSource(), quote.getValidUntil());
    }

    @Transactional
    public GoldDtos.PriceLockResponse createBuyLock(UUID customerId, GoldDtos.PriceLockCommand command) {
        boolean hasAmount = command.amount() != null;
        boolean hasQuantity = command.quantityGrams() != null;
        if (hasAmount == hasQuantity) {
            throw new GoldException("LOCK_INPUT_INVALID", "Provide exactly one of amount or quantityGrams.");
        }

        Instant now = Instant.now();
        GoldPriceQuote quote = quoteRepository
            .findFirstByValidFromLessThanEqualAndValidUntilGreaterThanOrderByCreatedAtDesc(now, now)
            .orElseGet(() -> quoteRepository.save(new GoldPriceQuote(DEMO_BUY_PRICE, DEMO_SELL_PRICE, now, now.plus(QUOTE_LIFETIME))));
        BigDecimal price = quote.getBuyPricePerGram();
        BigDecimal quantity = hasAmount
            ? command.amount().divide(price, 8, RoundingMode.DOWN)
            : command.quantityGrams().setScale(8, RoundingMode.DOWN);
        BigDecimal amount = hasAmount
            ? command.amount().setScale(2, RoundingMode.HALF_UP)
            : quantity.multiply(price).setScale(2, RoundingMode.HALF_UP);
        if (quantity.signum() <= 0 || amount.signum() <= 0) {
            throw new GoldException("LOCK_VALUE_INVALID", "The requested purchase value must be positive.");
        }

        PriceLock lock = lockRepository.save(new PriceLock(customerId, quote, quantity, amount, now.plus(LOCK_LIFETIME)));
        return new GoldDtos.PriceLockResponse(lock.getId().toString(), lock.getQuantityGrams(), lock.getPricePerGram(), lock.getAmount(), now.plus(LOCK_LIFETIME), "ACTIVE");
    }
}
