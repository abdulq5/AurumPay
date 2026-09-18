package com.aurumpay.core.gold;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GoldQuoteController {
    private final GoldPricingService pricingService;

    public GoldQuoteController(GoldPricingService pricingService) {
        this.pricingService = pricingService;
    }

    @GetMapping("/api/v1/gold/quote")
    public GoldDtos.QuoteResponse quote() {
        return pricingService.currentQuote();
    }
}
