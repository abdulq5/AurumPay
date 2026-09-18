package com.aurumpay.core.payment;

import com.aurumpay.core.gold.GoldOrder;
import com.aurumpay.core.gold.GoldOrderRepository;
import com.aurumpay.core.ledger.LedgerAccount;
import com.aurumpay.core.ledger.LedgerAccountRepository;
import com.aurumpay.core.ledger.LedgerEntry;
import com.aurumpay.core.ledger.LedgerEntryRepository;
import com.aurumpay.core.ledger.LedgerTransaction;
import com.aurumpay.core.ledger.LedgerTransactionRepository;
import com.aurumpay.core.wallet.GoldWallet;
import com.aurumpay.core.wallet.GoldWalletRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentWebhookEventRepository eventRepository;
    private final GoldOrderRepository orderRepository;
    private final GoldWalletRepository walletRepository;
    private final LedgerTransactionRepository ledgerTransactionRepository;
    private final LedgerAccountRepository accountRepository;
    private final LedgerEntryRepository entryRepository;
    private final String webhookSecret;

    public PaymentService(PaymentRepository paymentRepository, PaymentWebhookEventRepository eventRepository,
                          GoldOrderRepository orderRepository, GoldWalletRepository walletRepository,
                          LedgerTransactionRepository ledgerTransactionRepository, LedgerAccountRepository accountRepository,
                          LedgerEntryRepository entryRepository,
                          @Value("${payment.webhook-secret:change-me-payment-webhook-secret}") String webhookSecret) {
        this.paymentRepository = paymentRepository; this.eventRepository = eventRepository; this.orderRepository = orderRepository;
        this.walletRepository = walletRepository; this.ledgerTransactionRepository = ledgerTransactionRepository;
        this.accountRepository = accountRepository; this.entryRepository = entryRepository; this.webhookSecret = webhookSecret;
    }

    @Transactional
    public PaymentDtos.PaymentResponse createPayment(UUID customerId, PaymentDtos.CreatePaymentCommand command) {
        UUID orderId = parseId(command.orderId(), "ORDER_ID_INVALID");
        GoldOrder order = orderRepository.findById(orderId)
            .orElseThrow(() -> new PaymentException("ORDER_NOT_FOUND", "The gold order was not found."));
        if (!order.getCustomerId().equals(customerId)) throw new PaymentException("ORDER_FORBIDDEN", "The order belongs to another customer.");
        Payment existing = paymentRepository.findByOrderId(orderId).orElse(null);
        if (existing != null) return response(existing);
        Payment payment = paymentRepository.save(new Payment(customerId, orderId, order.getTotalAmount(), command.paymentMethod(), "demo_pay_" + UUID.randomUUID()));
        return response(payment);
    }

    @Transactional
    public String processWebhook(String signature, String rawPayload, PaymentDtos.WebhookCommand command) {
        if (!constantTimeEquals(signature, sign(rawPayload))) throw new PaymentException("WEBHOOK_SIGNATURE_INVALID", "The webhook signature is invalid.");
        if (eventRepository.existsByEventId(command.eventId())) return "DUPLICATE";
        Payment payment = paymentRepository.findByProviderPaymentId(command.providerPaymentId())
            .orElseThrow(() -> new PaymentException("PAYMENT_NOT_FOUND", "The payment was not found."));
        if (payment.getAmount().compareTo(command.amount()) != 0 || !"INR".equalsIgnoreCase(command.currency())) {
            throw new PaymentException("PAYMENT_AMOUNT_MISMATCH", "The webhook payment details do not match the stored payment.");
        }
        PaymentWebhookEvent event = new PaymentWebhookEvent(command.eventId(), command.providerPaymentId(), command.eventType(), sha256(rawPayload));
        eventRepository.save(event);
        if (command.successful() && !payment.isSuccessful()) settle(payment);
        event.markProcessed();
        return "PROCESSED";
    }

    private void settle(Payment payment) {
        GoldOrder order = orderRepository.findByIdForUpdate(payment.getOrderId())
            .orElseThrow(() -> new PaymentException("ORDER_NOT_FOUND", "The gold order was not found."));
        if (!order.isPaymentPending() && !order.isCompleted()) {
            throw new PaymentException("ORDER_NOT_SETTLEABLE", "The order cannot be settled.");
        }
        if (payment.isSuccessful()) {
            return;
        }

        GoldWallet wallet = walletRepository.findByCustomerIdForUpdate(payment.getCustomerId())
            .orElseGet(() -> walletRepository.save(new GoldWallet(payment.getCustomerId())));
        wallet.credit(order.getQuantityGrams());
        walletRepository.save(wallet);

        LedgerTransaction transaction = ledgerTransactionRepository.save(new LedgerTransaction(
            "buy-settlement:" + payment.getId(), payment.getCustomerId(), "BUY_SETTLEMENT", "COMPLETED", order.getQuantityGrams()));
        LedgerAccount inventory = account(null, "PLATFORM_GOLD_INVENTORY");
        LedgerAccount customer = account(payment.getCustomerId(), "CUSTOMER_AVAILABLE_GOLD");
        entryRepository.save(new LedgerEntry(transaction.getId(), inventory.getId(), "DEBIT", "GOLD", order.getQuantityGrams()));
        entryRepository.save(new LedgerEntry(transaction.getId(), customer.getId(), "CREDIT", "GOLD", order.getQuantityGrams()));

        order.markCompleted();
        payment.markSuccess();
    }

    private LedgerAccount account(UUID customerId, String type) {
        return accountRepository.findByCustomerIdAndAccountTypeAndAssetType(customerId, type, "GOLD")
            .orElseGet(() -> accountRepository.save(new LedgerAccount(customerId, type, "GOLD")));
    }

    private PaymentDtos.PaymentResponse response(Payment payment) {
        return new PaymentDtos.PaymentResponse(payment.getId().toString(), payment.getProviderPaymentId(), payment.getStatus(), payment.getAmount(), "INR");
    }

    private UUID parseId(String value, String code) { try { return UUID.fromString(value); } catch (IllegalArgumentException exception) { throw new PaymentException(code, "The identifier is invalid."); } }
    private boolean constantTimeEquals(String actual, String expected) { return actual != null && MessageDigest.isEqual(actual.getBytes(StandardCharsets.UTF_8), expected.getBytes(StandardCharsets.UTF_8)); }
    private String sign(String payload) { try { Mac mac = Mac.getInstance("HmacSHA256"); mac.init(new SecretKeySpec(webhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256")); return HexFormat.of().formatHex(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8))); } catch (Exception exception) { throw new IllegalStateException("Unable to sign webhook", exception); } }
    private String sha256(String value) { try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8))); } catch (Exception exception) { throw new IllegalStateException(exception); } }
}
