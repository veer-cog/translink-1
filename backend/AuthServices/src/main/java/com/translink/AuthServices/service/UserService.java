package com.translink.AuthServices.service;

import com.translink.AuthServices.dto.UpdateUserRequest;
import com.translink.AuthServices.dto.UserResponse;
import com.translink.AuthServices.model.User;
import com.translink.AuthServices.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getMe(String email) {
        log.debug("[User] Fetching self-profile for email: {}", email);
        return userRepository.findByEmail(email)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("User profile not found"));
    }

    @Transactional
    public UserResponse updateUserStatus(String targetId, String requesterEmail, boolean isActive) {
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new RuntimeException("Requester not found"));

        User target = userRepository.findById(targetId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        boolean isAdmin = "ADMIN".equals(requester.getRole().name());
        boolean isCreator = target.getCreatedBy() != null &&
                target.getCreatedBy().getId().equals(requester.getId());

        if (isAdmin && isCreator) {
            target.setActive(isActive);
            User saved = userRepository.save(target);
            log.info("[User] Status for {} updated to {} by {}", targetId, isActive, requesterEmail);
            return mapToResponse(saved);
        }

        log.warn("[User] Unauthorized status update attempt by {} on {}", requesterEmail, targetId);
        throw new RuntimeException("Access Denied: You do not have permission to modify this user");
    }

    public List<UserResponse> listSubordinates(Long Id, String email) {
        log.info("[User] Fetching subordinates for company ID: {}", Id);
        User current = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Requester not found"));

        List<User> subordinates = userRepository.findByCompany_Id(Id);
        return subordinates.stream().map(this::mapToResponse).toList();
    }

    @Transactional
    public void toggleMfa(String email, boolean enabled) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setMfaEnabled(enabled);
        userRepository.save(user);
        log.info("[User] MFA updated to {} for {}", enabled, email);
    }

    @Transactional
    public UserResponse updateProfile(String email, UpdateUserRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    public UserResponse getUserSecurely(String targetId, String requesterEmail) {
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new RuntimeException("Requester not found"));

        User target = userRepository.findById(targetId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        // Permissions Logic
        boolean isOwner = requester.getId().equals(target.getId());
        boolean isAdmin = "ADMIN".equals(requester.getRole().name());
        boolean isCreator = target.getCreatedBy() != null &&
                target.getCreatedBy().getId().equals(requester.getId());

        if (isOwner || (isAdmin && isCreator)) {
            return mapToResponse(target);
        }

        log.warn("[User] Access Denied: {} tried to access {}", requesterEmail, targetId);
        throw new RuntimeException("Access Denied");
    }

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
                .mfaEnabled(u.isMfaEnabled())
                .companyName(u.getCompany() != null ? u.getCompany().getName() : null)
                .build();
    }
}