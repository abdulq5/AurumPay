package com.aurumpay.core.auth;

import com.aurumpay.core.customer.Customer;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/otp/request")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public AuthDtos.OtpResponse requestOtp(@Valid @RequestBody AuthDtos.OtpRequestCommand command) {
        return authService.requestOtp(command);
    }

    @PostMapping("/otp/verify")
    public AuthDtos.TokenResponse verifyOtp(@Valid @RequestBody AuthDtos.OtpVerifyCommand command) {
        return authService.verifyOtp(command);
    }

    @PostMapping("/refresh")
    public AuthDtos.TokenResponse refresh(@Valid @RequestBody AuthDtos.RefreshCommand command) {
        return authService.refresh(command.refreshToken());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@Valid @RequestBody AuthDtos.LogoutCommand command) {
        authService.logout(command.refreshToken());
    }

    @GetMapping("/me")
    public AuthDtos.CustomerResponse me(Authentication authentication) {
        Customer customer = authService.getCustomer((UUID) authentication.getPrincipal());
        return new AuthDtos.CustomerResponse(customer.getId().toString(), customer.getFullName(), customer.getEmail(), customer.getMobileNumber(), customer.getStatus());
    }
}