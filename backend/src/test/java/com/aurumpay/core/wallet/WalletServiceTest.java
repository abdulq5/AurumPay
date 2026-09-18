package com.aurumpay.core.wallet;

import com.aurumpay.core.ledger.LedgerAccount;
import com.aurumpay.core.ledger.LedgerAccountRepository;
import com.aurumpay.core.ledger.LedgerEntryRepository;
import com.aurumpay.core.ledger.LedgerTransaction;
import com.aurumpay.core.ledger.LedgerTransactionRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class WalletServiceTest {
    private final GoldWalletRepository walletRepository = mock(GoldWalletRepository.class);
    private final LedgerTransactionRepository transactionRepository = mock(LedgerTransactionRepository.class);
    private final LedgerAccountRepository accountRepository = mock(LedgerAccountRepository.class);
    private final LedgerEntryRepository entryRepository = mock(LedgerEntryRepository.class);
    private final WalletService service = new WalletService(walletRepository, transactionRepository, accountRepository, entryRepository);

    @Test
    void rejectsReservationWhenAvailableGoldIsInsufficient() {
        UUID customerId = UUID.randomUUID();
        GoldWallet wallet = new GoldWallet(customerId);
        when(walletRepository.findByCustomerIdForUpdate(customerId)).thenReturn(Optional.of(wallet));
        when(transactionRepository.findByIdempotencyKey("reserve-1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.reserve(customerId,
            new WalletDtos.ReserveGoldCommand("reserve-1", new BigDecimal("0.10000000"))))
            .isInstanceOf(WalletException.class)
            .hasMessageContaining("insufficient");
        verify(transactionRepository).findByIdempotencyKey("reserve-1");
        verify(transactionRepository, never()).save(any(LedgerTransaction.class));
        verifyNoInteractions(accountRepository, entryRepository);
    }

    @Test
    void reservationMovesGoldIntoReservedBucketAndWritesBalancedEntries() {
        UUID customerId = UUID.randomUUID();
        GoldWallet wallet = new GoldWallet(customerId);
        wallet.credit(new BigDecimal("0.10000000"));
        when(walletRepository.findByCustomerIdForUpdate(customerId)).thenReturn(Optional.of(wallet));
        when(transactionRepository.findByIdempotencyKey("reserve-1")).thenReturn(Optional.empty());
        when(transactionRepository.save(any(LedgerTransaction.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(accountRepository.findByCustomerIdAndAccountTypeAndAssetType(any(), any(), any())).thenReturn(Optional.empty());
        when(accountRepository.save(any(LedgerAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));

        WalletDtos.ReservationResponse response = service.reserve(customerId,
            new WalletDtos.ReserveGoldCommand("reserve-1", new BigDecimal("0.10000000")));

        assertThat(response.status()).isEqualTo("RESERVED");
        assertThat(response.reservedGrams()).isEqualByComparingTo("0.10000000");
        assertThat(response.availableGrams()).isEqualByComparingTo("0.00000000");
        verify(transactionRepository).save(any(LedgerTransaction.class));
        verify(entryRepository, times(2)).save(any());
        verify(walletRepository).save(wallet);
    }
}
