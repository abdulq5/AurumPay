package com.aurumpay.core.wallet;

public class WalletException extends RuntimeException {
    private final String code;

    public WalletException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() { return code; }
}
