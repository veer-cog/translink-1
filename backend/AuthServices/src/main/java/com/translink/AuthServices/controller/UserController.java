package com.translink.AuthServices.controller;

import com.translink.AuthServices.dto.CreateOperatorRequest;
import com.translink.AuthServices.dto.UpdateUserRequest;
import com.translink.AuthServices.dto.UserResponse;
import com.translink.AuthServices.service.AuthService;
import com.translink.AuthServices.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final AuthService authService;
    private final UserService userService;

    /**
     * Get the profile of the currently logged-in user.
     * Replaces @AuthenticationPrincipal with X-User-Email header from Gateway.
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@RequestHeader("X-User-Email") String email) {
        log.info("[User] Fetching profile for: {}", email);
        return ResponseEntity.ok(userService.getMe(email));
    }

    /**
     * Admin endpoint to create a new Operator.
     * Uses X-User-Email to identify the Admin performing the action.
     */
    @PostMapping("/create-operator")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> createOp(
            @RequestHeader("X-User-Email") String adminEmail,
            @RequestBody CreateOperatorRequest req
    ) {
        log.info("[User] Admin {} is creating operator: {}", adminEmail, req.getEmail());
        String message = authService.createOperator(req, adminEmail);
        // Wrap the string in a Map so it is sent as {"message": "..."}
        return ResponseEntity.ok(Map.of("message", message));
    }

    /**
     * Admin endpoint to toggle a user's active/inactive status.
     * Restricted to ADMIN role.
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> toggleUserStatus(
            @RequestHeader("X-User-Email") String adminEmail,
            @PathVariable String id,
            @RequestParam boolean active
    ) {
        log.info("[User] Admin {} is setting user ID {} status to: {}", adminEmail, id, active);
        return ResponseEntity.ok(userService.updateUserStatus(id, adminEmail, active));
    }

    /**
     * Lists users created by the current requester.
     */
    @GetMapping("/list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> list(@RequestHeader("X-User-Email") String email, @RequestHeader("X-Company-Id") Long id) {
        log.info("[User] {} is requesting subordinate list for [Company] {}", email, id);
        return ResponseEntity.ok(userService.listSubordinates(id,email));
    }

    /**
     * Toggle MFA status for the current user.
     */
    @PutMapping("/mfa")
    public ResponseEntity<String> toggleMfa(
            @RequestHeader("X-User-Email") String email,
            @RequestParam boolean enabled
    ) {
        log.info("[User] {} is updating MFA status to: {}", email, enabled);
        userService.toggleMfa(email, enabled);
        return ResponseEntity.ok("MFA status updated successfully.");
    }

    /**
     * Update user profile information.
     */
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @RequestHeader("X-User-Email") String email,
            @RequestBody UpdateUserRequest request
    ) {
        log.info("[User] {} is updating their profile", email);
        return ResponseEntity.ok(userService.updateProfile(email, request));
    }

    /**
     * Securely fetches a specific user profile by ID.
     * Permissions are checked within the service based on the requesterEmail.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(
            @RequestHeader("X-User-Email") String requesterEmail,
            @PathVariable String id
    ) {
        log.info("[User] {} is attempting to access user ID: {}", requesterEmail, id);
        return ResponseEntity.ok(userService.getUserSecurely(id, requesterEmail));
    }
}