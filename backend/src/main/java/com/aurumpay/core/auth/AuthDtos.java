package com.aurumpay.core.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public final class AuthDtos {
    private AuthDtos() {}

    public record OtpRequestCommand(
        @NotBlank @Pattern(regexp = "[0-9]{10}") String mobileNumber,
        @NotBlank String purpose,
        String fullName,
        @Email String email
    ) {}

    public record OtpVerifyCommand(
        @NotBlank @Pattern(regexp = "[0-9]{10}") String mobileNumber,
        @NotBlank @Pattern(regexp = "[0-9]{6}") String code,
        @NotBlank String purpose
    ) {}

    public record RefreshCommand(@NotBlank String refreshToken) {}

    public record LogoutCommand(@NotBlank String refreshToken) {}

    public record TokenResponse(String accessToken, String refreshToken, long expiresInSeconds) {}

    public record CustomerResponse(String id, String fullName, String email, String mobileNumber, String status) {}

    public record OtpResponse(String requestId, String status) {}
}
