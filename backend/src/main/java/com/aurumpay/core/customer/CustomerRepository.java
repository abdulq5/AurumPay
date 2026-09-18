package com.aurumpay.core.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    Optional<Customer> findByMobileNumber(String mobileNumber);
    boolean existsByMobileNumber(String mobileNumber);
}
