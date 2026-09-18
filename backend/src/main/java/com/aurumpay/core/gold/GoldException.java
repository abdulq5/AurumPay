package com.aurumpay.core.gold;

public class GoldException extends RuntimeException {
    private final String code;
    public GoldException(String code, String message) { super(message); this.code = code; }
    public String getCode() { return code; }
}
