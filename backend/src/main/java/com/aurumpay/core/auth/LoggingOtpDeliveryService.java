package com.aurumpay.core.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("!prod")
public class LoggingOtpDeliveryService implements OtpDeliveryService {
    private static final Logger log = LoggerFactory.getLogger(LoggingOtpDeliveryService.class);

    @Override
    public void deliver(String mobileNumber, String code) {
        log.info("Development OTP issued for mobile ending {}: {}", mobileNumber.substring(6), code);
    }
}
