package com.aurumpay.core.wallet;

import com.aurumpay.core.ledger.LedgerAccount;
import com.aurumpay.core.ledger.LedgerAccountRepository;
import com.aurumpay.core.ledger.LedgerEntry;
import com.aurumpay.core.ledger.LedgerEntryRepository;
import com.aurumpay.core.ledger.LedgerTransaction;
import com.aurumpay.core.ledger.LedgerTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class WalletService {
    private static final String AVAILABLE_ACCOUNT = "CUSTOMER_AVAILABLE_GOLD";
    private static final String RESERVED_ACCOUNT = "CUSTOMER_RESERVED_GOLD";

    private final GoldWalletRepository walletRepository;
    private final LedgerTransactionRepository transactionRepository;
    private final LedgerAccountRepository accountRepository;
    private final LedgerEntryRepository entryRepository;

    public WalletService(GoldWalletRepository walletRepository, LedgerTransactionRepository transactionRepository,
                         LedgerAccountRepository accountRepository, LedgerEntryRepository entryRepository) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.entryRepository = entryRepository;
    }

    @Transactional
    public WalletDtos.WalletResponse getOrCreateWallet(UUID customerId) {
        GoldWallet wallet = walletRepository.findByCustomerId(customerId)
            .orElseGet(() -> walletRepository.save(new GoldWallet(customerId)));
        return response(wallet);
    }

    @Transactional
    public WalletDtos.ReservationResponse reserve(UUID customerId, WalletDtos.ReserveGoldCommand command) {
        LedgerTransaction existing = transactionRepository.findByIdempotencyKey(command.idempotencyKey()).orElse(null);
        if (existing != null) {
            GoldWallet current = walletRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new WalletException("WALLET_NOT_FOUND", "Wallet was not found."));
            return new WalletDtos.ReservationResponse(existing.getId().toString(), "RESERVED", current.getReservedGrams(), current.availableGrams());
        }

        GoldWallet wallet = walletRepository.findByCustomerIdForUpdate(customerId)
            .orElseGet(() -> walletRepository.save(new GoldWallet(customerId)));
        BigDecimal grams = command.goldGrams();
        if (wallet.availableGrams().compareTo(grams) < 0) {
            throw new WalletException("INSUFFICIENT_GOLD", "The available gold balance is insufficient.");
        }

        LedgerTransaction transaction = transactionRepository.save(
            new LedgerTransaction(command.idempotencyKey(), customerId, "GOLD_RESERVATION", "RESERVED", grams));
        LedgerAccount available = account(customerId, AVAILABLE_ACCOUNT);
        LedgerAccount reserved = account(customerId, RESERVED_ACCOUNT);
        entryRepository.save(new LedgerEntry(transaction.getId(), available.getId(), "DEBIT", "GOLD", grams));
        entryRepository.save(new LedgerEntry(transaction.getId(), reserved.getId(), "CREDIT", "GOLD", grams));
        wallet.reserve(grams);
        walletRepository.save(wallet);
        return new WalletDtos.ReservationResponse(transaction.getId().toString(), "RESERVED", wallet.getReservedGrams(), wallet.availableGrams());
    }

    private LedgerAccount account(UUID customerId, String type) {
        return accountRepository.findByCustomerIdAndAccountTypeAndAssetType(customerId, type, "GOLD")
            .orElseGet(() -> accountRepository.save(new LedgerAccount(customerId, type, "GOLD")));
    }

    private WalletDtos.WalletResponse response(GoldWallet wallet) {
        return new WalletDtos.WalletResponse(wallet.getTotalGrams(), wallet.getReservedGrams(), wallet.getEncumberedGrams(), wallet.availableGrams());
    }
}
