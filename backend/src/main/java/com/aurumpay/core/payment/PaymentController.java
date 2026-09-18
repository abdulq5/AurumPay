package com.aurumpay.core.payment;

import jakarta.validation.Valid;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {
    private final PaymentService paymentService;
    private final ObjectMapper objectMapper;

    public PaymentController(PaymentService paymentService, ObjectMapper objectMapper) {
        this.paymentService = paymentService;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public PaymentDtos.PaymentResponse create(Authentication authentication,
                                               @Valid @RequestBody PaymentDtos.CreatePaymentCommand command) {
        return paymentService.createPayment((UUID) authentication.getPrincipal(), command);
    }

    @PostMapping("/webhook")
    @ResponseStatus(HttpStatus.OK)
    public String webhook(@RequestHeader("X-Webhook-Signature") String signature,
                          @RequestBody String rawPayload) {
        PaymentDtos.WebhookCommand command;
        try {
            command = objectMapper.readValue(rawPayload, PaymentDtos.WebhookCommand.class);
        } catch (JsonProcessingException exception) {
            throw new PaymentException("WEBHOOK_BODY_INVALID", "The webhook body is invalid.");
        }
        return paymentService.processWebhook(signature, rawPayload, command);
    }
}
