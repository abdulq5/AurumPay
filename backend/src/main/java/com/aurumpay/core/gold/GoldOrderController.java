package com.aurumpay.core.gold;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/gold")
public class GoldOrderController {
    private final GoldPricingService pricingService;
    private final GoldOrderService orderService;

    public GoldOrderController(GoldPricingService pricingService, GoldOrderService orderService) {
        this.pricingService = pricingService;
        this.orderService = orderService;
    }

    @PostMapping("/price-locks")
    public GoldDtos.PriceLockResponse createPriceLock(Authentication authentication,
                                                        @Valid @RequestBody GoldDtos.PriceLockCommand command) {
        return pricingService.createBuyLock(customerId(authentication), command);
    }

    @PostMapping("/orders")
    public GoldDtos.BuyOrderResponse createBuyOrder(Authentication authentication,
                                                     @Valid @RequestBody GoldDtos.BuyOrderCommand command) {
        return orderService.createBuyOrder(customerId(authentication), command);
    }

    private UUID customerId(Authentication authentication) {
        return (UUID) authentication.getPrincipal();
    }
}
