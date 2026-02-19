package com.translink.AuthServices.service;

import com.translink.AuthServices.dto.UpdateUserRequest;
import com.translink.AuthServices.dto.UserResponse;
import com.translink.AuthServices.model.User;
import com.translink.AuthServices.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getMe(String email) {
        log.debug("Fetching self-profile for email: {}", email);
        return userRepository.findByEmail(email)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("User profile not found"));
    }

    public List<UserResponse> listSubordinates(String email) {
        log.info("Fetching subordinates for user: {}", email);
        User current = userRepository.findByEmail(email).orElseThrow();
        List<User> subordinates = userRepository.findByCreatedBy(current);
        log.info("Found {} subordinates for user: {}", subordinates.size(), email);
        return subordinates.stream().map(this::mapToResponse).toList();
    }

    @Transactional
    public void toggleMfa(String email, boolean enabled) {
        log.info("Toggling MFA for user {} to {}", email, enabled);
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setMfaEnabled(enabled);
        userRepository.save(user);
    }

    @Transactional
    public UserResponse updateProfile(String currentEmail, UpdateUserRequest request) {
        log.info("Updating profile fields for user: {}", currentEmail);
        User user = userRepository.findByEmail(currentEmail).orElseThrow();

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            log.info("User {} attempting to change email to: {}", currentEmail, request.getEmail());
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                log.warn("Email update failed: {} is already in use", request.getEmail());
                throw new RuntimeException("Email already in use");
            }
            user.setEmail(request.getEmail());
        }

        return mapToResponse(userRepository.save(user));
    }

    public UserResponse getUserSecurely(String targetId, UserDetails currentUserDetails) {
        log.info("User {} is requesting secure access to target ID: {}", currentUserDetails.getUsername(), targetId);
        User target = userRepository.findById(targetId).orElseThrow();
        User requester = userRepository.findByEmail(currentUserDetails.getUsername()).orElseThrow();

        boolean isAdmin = currentUserDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        boolean isOwner = target.getEmail().equals(requester.getEmail());
        boolean isCreator = target.getCreatedBy() != null && target.getCreatedBy().getId().equals(requester.getId());

        // Logical check: Are they in the same company? (Multi-tenancy safeguard)
        boolean sameCompany = target.getCompany() != null && requester.getCompany() != null
                && target.getCompany().getId().equals(requester.getCompany().getId());

        if (isOwner || (isAdmin && (isCreator || sameCompany))) {
            log.info("Access granted to user {} for profile ID {}", requester.getEmail(), targetId);
            return mapToResponse(target);
        }

        log.warn("ACCESS DENIED: User {} attempted unauthorized access to profile ID {}", requester.getEmail(), targetId);
        throw new RuntimeException("Access Denied");
    }

    /**
     * Maps the User entity to UserResponse DTO,
     * including the new Company Name field.
     */
    public UserResponse mapToResponse(User u) {
        if (u == null) return null;

        return UserResponse.builder()
                .id(u.getId())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .email(u.getEmail())
                .role(u.getRole())
                .isActive(u.isActive())
                .createdAt(u.getCreatedAt())
                // Extracting company name from the Company entity
                .companyName(u.getCompany() != null ? u.getCompany().getName() : null)
                .build();
    }
}