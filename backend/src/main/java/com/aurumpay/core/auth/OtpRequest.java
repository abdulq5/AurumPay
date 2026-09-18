package com.aurumpay.core.auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "otp_requests")
public class OtpRequest {
    @Id
    private UUID id;

    @Column(name = "mobile_number", nullable = false)
    private String mobileNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OtpPurpose purpose;

    @Column(name = "otp_hash", nullable = false)
    private String otpHash;

    @Column(name = "full_name")
    private String fullName;

    private String email;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "attempt_count", nullable = false)
    private int attemptCount;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected OtpRequest() {
    }

    public OtpRequest(String mobileNumber, OtpPurpose purpose, String otpHash, String fullName, String email, Instant expiresAt) {
        this.id = UUID.randomUUID();
        this.mobileNumber = mobileNumber;
        this.purpose = purpose;
        this.otpHash = otpHash;
        this.fullName = fullName;
        this.email = email;
        this.expiresAt = expiresAt;
        this.createdAt = Instant.now();
    }

    public boolean isExpired(Instant now) { return !expiresAt.isAfter(now); }
    public UUID getId() { return id; }
    public boolean isVerified() { return verifiedAt != null; }
    public boolean hasExceededAttempts(int maxAttempts) { return attemptCount >= maxAttempts; }
    public void incrementAttempts() { attemptCount++; }
    public void markVerified(Instant now) { verifiedAt = now; }
    public String getOtpHash() { return otpHash; }
    public String getMobileNumber() { return mobileNumber; }
    public OtpPurpose getPurpose() { return purpose; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
}
