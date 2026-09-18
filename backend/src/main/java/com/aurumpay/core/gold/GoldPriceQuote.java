package com.aurumpay.core.gold;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "gold_price_quotes")
public class GoldPriceQuote {
    @Id private UUID id;
    @Column(nullable = false) private String currency;
    @Column(nullable = false) private String purity;
    @Column(name = "buy_price_per_gram", nullable = false, precision = 20, scale = 2) private BigDecimal buyPricePerGram;
    @Column(name = "sell_price_per_gram", nullable = false, precision = 20, scale = 2) private BigDecimal sellPricePerGram;
    @Column(nullable = false) private String source;
    @Column(name = "valid_from", nullable = false) private Instant validFrom;
    @Column(name = "valid_until", nullable = false) private Instant validUntil;
    @Column(name = "created_at", nullable = false) private Instant createdAt;

    protected GoldPriceQuote() {}

    public GoldPriceQuote(BigDecimal buyPricePerGram, BigDecimal sellPricePerGram, Instant validFrom, Instant validUntil) {
        this.id = UUID.randomUUID(); this.currency = "INR"; this.purity = "999";
        this.buyPricePerGram = buyPricePerGram; this.sellPricePerGram = sellPricePerGram;
        this.source = "DEMO"; this.validFrom = validFrom; this.validUntil = validUntil; this.createdAt = validFrom;
    }
    public UUID getId() { return id; }
    public BigDecimal getBuyPricePerGram() { return buyPricePerGram; }
    public BigDecimal getSellPricePerGram() { return sellPricePerGram; }
    public Instant getValidFrom() { return validFrom; }
    public Instant getValidUntil() { return validUntil; }
    public String getCurrency() { return currency; }
    public String getPurity() { return purity; }
    public String getSource() { return source; }
}
