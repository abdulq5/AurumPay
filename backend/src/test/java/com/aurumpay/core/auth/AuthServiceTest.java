package com.aurumpay.core.auth;

import com.aurumpay.core.customer.Customer;
import com.aurumpay.core.customer.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {
    private final CustomerRepository customerRepository = mock(CustomerRepository.class);
    private final OtpRequestRepository otpRequestRepository = mock(OtpRequestRepository.class);
    private final AuthSessionRepository authSessionRepository = mock(AuthSessionRepository.class);
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final CapturingOtpDelivery delivery = new CapturingOtpDelivery();
    private final JwtService jwtService = new JwtService(
        "test-secret-that-is-at-least-32-characters-long",
        900
    );
    private final AuthService service = new AuthService(
        customerRepository,
        otpRequestRepository,
        authSessionRepository,
        passwordEncoder,
        delivery,
        jwtService
    );

    @Test
    void verifiesOtpWithoutPersistingPlaintextCode() {
        var request = new AuthDtos.OtpRequestCommand("9876543210", "SIGNUP", "Test Customer", "test@example.com");
        when(otpRequestRepository.save(any(OtpRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AuthDtos.OtpResponse response = service.requestOtp(request);

        ArgumentCaptor<OtpRequest> captor = ArgumentCaptor.forClass(OtpRequest.class);
        verify(otpRequestRepository).save(captor.capture());
        OtpRequest persisted = captor.getValue();
        assertThat(response.requestId()).isEqualTo(persisted.getId().toString());
        assertThat(persisted.getOtpHash()).doesNotContain(delivery.code);
        assertThat(passwordEncoder.matches(delivery.code, persisted.getOtpHash())).isTrue();
    }

    @Test
    void successfulVerificationCreatesCustomerAndSession() {
        var otp = new OtpRequest("9876543210", OtpPurpose.SIGNUP,
            passwordEncoder.encode("123456"), "Test Customer", "test@example.com",
            java.time.Instant.now().plusSeconds(300));
        when(otpRequestRepository.findFirstByMobileNumberAndPurposeOrderByCreatedAtDesc("9876543210", OtpPurpose.SIGNUP))
            .thenReturn(Optional.of(otp));
        Customer customer = new Customer("Test Customer", "test@example.com", "9876543210");
        when(customerRepository.findByMobileNumber("9876543210")).thenReturn(Optional.empty());
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);
        when(authSessionRepository.save(any(AuthSession.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AuthDtos.TokenResponse response = service.verifyOtp(
            new AuthDtos.OtpVerifyCommand("9876543210", "123456", "SIGNUP")
        );

        assertThat(response.accessToken()).isNotBlank();
        assertThat(response.refreshToken()).isNotBlank();
        verify(customerRepository).save(any(Customer.class));
        verify(authSessionRepository).save(any(AuthSession.class));
    }

    private static final class CapturingOtpDelivery implements OtpDeliveryService {
        private String code;

        @Override
        public void deliver(String mobileNumber, String code) {
            this.code = code;
        }
    }
}
