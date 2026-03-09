package com.translink.AuthServices.repository;
import com.translink.AuthServices.model.OtpVerification;
import com.translink.AuthServices.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpVerification, Long> {
    
    Optional<OtpVerification> findByCodeAndUserAndPurpose(String code, User user, String purpose);
    Optional<OtpVerification> findByUserEmail( String email);

    Optional<OtpVerification> findByUserAndPurpose(User user, String purpose);

    @Modifying
    @Transactional // Ensures 'remove' call has a transaction
    @Query("DELETE FROM OtpVerification o WHERE o.user = :user AND o.purpose = :purpose")
    void deleteByUserAndPurpose(@Param("user") User user, @Param("purpose") String purpose);
}