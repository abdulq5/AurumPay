package com.aurumpay.core.wallet;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/customer/wallet")
public class WalletController {
    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping
    public WalletDtos.WalletResponse wallet(Authentication authentication) {
        return walletService.getOrCreateWallet(customerId(authentication));
    }

    @PostMapping("/reservations")
    public WalletDtos.ReservationResponse reserve(Authentication authentication,
                                                   @Valid @RequestBody WalletDtos.ReserveGoldCommand command) {
        return walletService.reserve(customerId(authentication), command);
    }

    private UUID customerId(Authentication authentication) {
        return (UUID) authentication.getPrincipal();
    }
}
