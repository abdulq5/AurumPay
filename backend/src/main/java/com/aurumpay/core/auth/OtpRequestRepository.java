package com.aurumpay.core.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface OtpRequestRepository extends JpaRepository<OtpRequest, UUID> {
    Optional<OtpRequest> findFirstByMobileNumberAndPurposeOrderByCreatedAtDesc(String mobileNumber, OtpPurpose purpose);
}
