package com.aurumpay.core.common;

import com.aurumpay.core.payment.PaymentException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class PaymentExceptionHandler {
    @ExceptionHandler(PaymentException.class)
    ResponseEntity<ApiError> handlePayment(PaymentException exception) {
        HttpStatus status = switch (exception.getCode()) {
            case "PAYMENT_NOT_FOUND", "ORDER_NOT_FOUND" -> HttpStatus.NOT_FOUND;
            case "ORDER_FORBIDDEN" -> HttpStatus.FORBIDDEN;
            case "WEBHOOK_SIGNATURE_INVALID" -> HttpStatus.UNAUTHORIZED;
            case "ORDER_NOT_SETTLEABLE" -> HttpStatus.CONFLICT;
            case "PAYMENT_AMOUNT_MISMATCH" -> HttpStatus.CONFLICT;
            case "WEBHOOK_BODY_INVALID" -> HttpStatus.BAD_REQUEST;
            default -> HttpStatus.BAD_REQUEST;
        };
        return ResponseEntity.status(status).body(new ApiError(exception.getCode(), exception.getMessage(), java.time.Instant.now()));
    }
}
