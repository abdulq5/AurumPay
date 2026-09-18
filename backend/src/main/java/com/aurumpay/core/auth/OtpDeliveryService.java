package com.aurumpay.core.auth;

public interface OtpDeliveryService {
    void deliver(String mobileNumber, String code);
}
