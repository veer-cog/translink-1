package com.translink.AuthServices.repository;

import com.translink.AuthServices.model.OtpVerification;
import com.translink.AuthServices.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpVerification, Long> {

    // Finds the latest OTP for a user with a specific purpose (e.g., "SIGNUP")
    Optional<OtpVerification> findByCodeAndUserAndPurpose(String code, User user, String purpose);

    // Used to delete all OTPs for a user after a successful verification
    void deleteByUser(User user);

    // Recommended: A method to help with the cleanup of expired codes
    void deleteByExpiresAtBefore(java.time.LocalDateTime now);
}