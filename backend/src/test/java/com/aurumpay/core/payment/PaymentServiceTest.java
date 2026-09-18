package com.aurumpay.core.payment;

import com.aurumpay.core.gold.GoldOrder;
import com.aurumpay.core.gold.GoldOrderRepository;
import com.aurumpay.core.gold.GoldPriceQuote;
import com.aurumpay.core.gold.PriceLock;
import com.aurumpay.core.ledger.LedgerAccount;
import com.aurumpay.core.ledger.LedgerAccountRepository;
import com.aurumpay.core.ledger.LedgerEntryRepository;
import com.aurumpay.core.ledger.LedgerTransaction;
import com.aurumpay.core.ledger.LedgerTransactionRepository;
import com.aurumpay.core.wallet.GoldWallet;
import com.aurumpay.core.wallet.GoldWalletRepository;
import org.junit.jupiter.api.Test;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PaymentServiceTest {
    private static final String SECRET = "change-me-payment-webhook-secret";
    private final PaymentRepository paymentRepository = mock(PaymentRepository.class);
    private final PaymentWebhookEventRepository eventRepository = mock(PaymentWebhookEventRepository.class);
    private final GoldOrderRepository orderRepository = mock(GoldOrderRepository.class);
    private final GoldWalletRepository walletRepository = mock(GoldWalletRepository.class);
    private final LedgerTransactionRepository ledgerTransactionRepository = mock(LedgerTransactionRepository.class);
    private final LedgerAccountRepository accountRepository = mock(LedgerAccountRepository.class);
    private final LedgerEntryRepository entryRepository = mock(LedgerEntryRepository.class);
    private final PaymentService service = new PaymentService(paymentRepository, eventRepository, orderRepository, walletRepository,
        ledgerTransactionRepository, accountRepository, entryRepository, SECRET);

    @Test
    void successfulWebhookCreditsWalletAndIsIdempotent() throws Exception {
        UUID customerId = UUID.randomUUID();
        GoldOrder order = order(customerId);
        Payment payment = new Payment(customerId, order.getId(), new BigDecimal("1000.00"), "UPI", "demo-payment-1");
        GoldWallet wallet = new GoldWallet(customerId);
        String payload = "event-1|demo-payment-1|payment.success";
        PaymentDtos.WebhookCommand command = new PaymentDtos.WebhookCommand("event-1", "demo-payment-1", "payment.success", true, new BigDecimal("1000.00"), "INR");

        when(eventRepository.existsByEventId("event-1")).thenReturn(false);
        when(paymentRepository.findByProviderPaymentId("demo-payment-1")).thenReturn(Optional.of(payment));
        when(orderRepository.findByIdForUpdate(order.getId())).thenReturn(Optional.of(order));
        when(walletRepository.findByCustomerIdForUpdate(customerId)).thenReturn(Optional.of(wallet));
        when(ledgerTransactionRepository.save(any(LedgerTransaction.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(accountRepository.findByCustomerIdAndAccountTypeAndAssetType(any(), any(), any())).thenReturn(Optional.empty());
        when(accountRepository.save(any(LedgerAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));

        assertThat(service.processWebhook(sign(payload), payload, command)).isEqualTo("PROCESSED");
        assertThat(wallet.getTotalGrams()).isEqualByComparingTo("0.15822784");
        verify(entryRepository, times(2)).save(any());

        when(eventRepository.existsByEventId("event-1")).thenReturn(true);
        assertThat(service.processWebhook(sign(payload), payload, command)).isEqualTo("DUPLICATE");
        verify(walletRepository, times(1)).save(wallet);
        verify(entryRepository, times(2)).save(any());
    }

    private GoldOrder order(UUID customerId) {
        Instant now = Instant.now();
        GoldPriceQuote quote = new GoldPriceQuote(new BigDecimal("6320.00"), new BigDecimal("6180.00"), now.minusSeconds(10), now.plusSeconds(300));
        PriceLock lock = new PriceLock(customerId, quote, new BigDecimal("0.15822784"), new BigDecimal("1000.00"), now.plusSeconds(300));
        return new GoldOrder(customerId, lock, "order-1");
    }

    private String sign(String payload) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return HexFormat.of().formatHex(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
    }
}
