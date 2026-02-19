package com.translink.AuthServices.repository;

import com.translink.AuthServices.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // Used for login and checking if a user already exists during signup
    Optional<User> findByEmail(String email);
    List<User> findByCreatedBy(User creator);
    // Useful for the Admin specific controls to check user existence [cite: 487]
    boolean existsByEmail(String email);
}