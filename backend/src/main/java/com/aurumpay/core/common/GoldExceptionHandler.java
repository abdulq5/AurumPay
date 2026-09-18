package com.aurumpay.core.common;

import com.aurumpay.core.gold.GoldException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GoldExceptionHandler {
    @ExceptionHandler(GoldException.class)
    ResponseEntity<ApiError> handleGold(GoldException exception) {
        HttpStatus status = switch (exception.getCode()) {
            case "PRICE_LOCK_NOT_FOUND" -> HttpStatus.NOT_FOUND;
            case "PRICE_LOCK_EXPIRED" -> HttpStatus.CONFLICT;
            case "IDEMPOTENCY_KEY_CONFLICT" -> HttpStatus.CONFLICT;
            default -> HttpStatus.BAD_REQUEST;
        };
        return ResponseEntity.status(status).body(new ApiError(exception.getCode(), exception.getMessage(), java.time.Instant.now()));
    }
}
