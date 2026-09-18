package com.aurumpay.core.common;

import com.aurumpay.core.wallet.WalletException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class WalletExceptionHandler {
    @ExceptionHandler(WalletException.class)
    ResponseEntity<ApiError> handleWallet(WalletException exception) {
        HttpStatus status = "INSUFFICIENT_GOLD".equals(exception.getCode()) ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(new ApiError(exception.getCode(), exception.getMessage(), java.time.Instant.now()));
    }
}
