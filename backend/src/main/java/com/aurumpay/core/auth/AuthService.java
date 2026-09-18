package com.aurumpay.core.auth;

import com.aurumpay.core.customer.Customer;
import com.aurumpay.core.customer.CustomerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {
    private static final int MAX_OTP_ATTEMPTS = 5;
    private static final Duration OTP_LIFETIME = Duration.ofMinutes(5);
    private static final Duration REFRESH_LIFETIME = Duration.ofDays(30);

    private final CustomerRepository customerRepository;
    private final OtpRequestRepository otpRequestRepository;
    private final AuthSessionRepository authSessionRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpDeliveryService otpDeliveryService;
    private final JwtService jwtService;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(CustomerRepository customerRepository, OtpRequestRepository otpRequestRepository,
                       AuthSessionRepository authSessionRepository, PasswordEncoder passwordEncoder,
                       OtpDeliveryService otpDeliveryService, JwtService jwtService) {
        this.customerRepository = customerRepository;
        this.otpRequestRepository = otpRequestRepository;
        this.authSessionRepository = authSessionRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpDeliveryService = otpDeliveryService;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthDtos.OtpResponse requestOtp(AuthDtos.OtpRequestCommand command) {
        OtpPurpose purpose = parsePurpose(command.purpose());
        String mobile = normalizeMobile(command.mobileNumber());
        String code = String.format("%06d", secureRandom.nextInt(1_000_000));
        OtpRequest request = new OtpRequest(mobile, purpose, passwordEncoder.encode(code),
            normalize(command.fullName()), normalize(command.email()), Instant.now().plus(OTP_LIFETIME));
        otpRequestRepository.save(request);
        otpDeliveryService.deliver(mobile, code);
        return new AuthDtos.OtpResponse(requestId(request.getId()), "OTP_SENT");
    }

    @Transactional
    public AuthDtos.TokenResponse verifyOtp(AuthDtos.OtpVerifyCommand command) {
        OtpPurpose purpose = parsePurpose(command.purpose());
        String mobile = normalizeMobile(command.mobileNumber());
        OtpRequest request = otpRequestRepository.findFirstByMobileNumberAndPurposeOrderByCreatedAtDesc(mobile, purpose)
            .orElseThrow(() -> new AuthException("OTP_NOT_FOUND", "No OTP request was found."));
        if (request.isVerified() || request.isExpired(Instant.now())) {
            throw new AuthException("OTP_EXPIRED", "The OTP has expired.");
        }
        if (request.hasExceededAttempts(MAX_OTP_ATTEMPTS)) {
            throw new AuthException("OTP_ATTEMPTS_EXCEEDED", "Too many OTP attempts.");
        }
        request.incrementAttempts();
        if (!passwordEncoder.matches(command.code(), request.getOtpHash())) {
            throw new AuthException("OTP_INVALID", "The OTP is invalid.");
        }
        request.markVerified(Instant.now());
        Customer customer = customerRepository.findByMobileNumber(mobile)
            .orElseGet(() -> customerRepository.save(new Customer(request.getFullName(), request.getEmail(), mobile)));
        String refreshToken = UUID.randomUUID() + "." + UUID.randomUUID();
        authSessionRepository.save(new AuthSession(customer.getId(), digest(refreshToken), Instant.now().plus(REFRESH_LIFETIME)));
        return new AuthDtos.TokenResponse(jwtService.createAccessToken(customer.getId()), refreshToken, jwtService.getAccessTokenSeconds());
    }

    @Transactional
    public AuthDtos.TokenResponse refresh(String refreshToken) {
        AuthSession session = findSession(refreshToken);
        if (!session.isUsable(Instant.now())) {
            throw new AuthException("SESSION_INVALID", "The refresh session is invalid.");
        }
        session.revoke(Instant.now());
        String nextRefreshToken = UUID.randomUUID() + "." + UUID.randomUUID();
        authSessionRepository.save(new AuthSession(session.getCustomerId(), digest(nextRefreshToken), Instant.now().plus(REFRESH_LIFETIME)));
        return new AuthDtos.TokenResponse(jwtService.createAccessToken(session.getCustomerId()), nextRefreshToken, jwtService.getAccessTokenSeconds());
    }

    @Transactional
    public void logout(String refreshToken) {
        AuthSession session = findSession(refreshToken);
        session.revoke(Instant.now());
    }

    public Customer getCustomer(UUID customerId) {
        return customerRepository.findById(customerId)
            .orElseThrow(() -> new AuthException("CUSTOMER_NOT_FOUND", "Customer was not found."));
    }

    private AuthSession findSession(String token) {
        return authSessionRepository.findByRefreshTokenHash(digest(token))
            .orElseThrow(() -> new AuthException("SESSION_INVALID", "The refresh session is invalid."));
    }

    private String digest(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder result = new StringBuilder(digest.length * 2);
            for (byte item : digest) result.append(String.format("%02x", item));
            return result.toString();
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to hash refresh token", exception);
        }
    }

    private OtpPurpose parsePurpose(String value) {
        try { return OtpPurpose.valueOf(value.trim().toUpperCase()); }
        catch (Exception exception) { throw new AuthException("OTP_PURPOSE_INVALID", "OTP purpose must be SIGNUP or LOGIN."); }
    }

    private String normalizeMobile(String value) { return value.trim(); }
    private String normalize(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private String requestId(UUID id) { return id.toString(); }
}
