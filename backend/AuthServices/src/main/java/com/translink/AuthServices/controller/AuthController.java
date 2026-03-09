package com.translink.AuthServices.controller;

import com.translink.AuthServices.dto.*;
import com.translink.AuthServices.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            log.info("Received registration request for email: {}", request.email());
            return ResponseEntity.ok(authService.register(request));
        } catch (Exception ex) {
            log.error("Registration failed: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        log.info("Login attempt for email: {}", request.email());
        // Returns AuthResponse containing only the token
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        String purpose = request.get("purpose");

        log.info("Verifying OTP for email: {} with purpose: {}", email, purpose);

        AuthResponse response = authService.verifyOtp(email, code, purpose);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        try {
            log.info("Initiating forgot password for email: {}", email);
            authService.initiateForgotPassword(email);
            return ResponseEntity.ok("Verification code sent to your email.");
        } catch (Exception ex) {
            log.error("Forgot password initiation failed: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found or email error: " + ex.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> reset(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        log.info("Resetting password for email: {}", email);
        return ResponseEntity.ok(authService.resetPassword(email, newPassword));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        log.info("Resending OTP for email: {}", email);
        // Uses existing forgot-password initiation logic to resend code
        authService.initiateForgotPassword(email);
        return ResponseEntity.ok("New OTP sent.");
    }

    /**
     * Replaces @AuthenticationPrincipal with X-User-Email header.
     * Trust is delegated to the API Gateway.
     */
    @PostMapping("/change-password")
    public ResponseEntity<@Nullable Object> changePassword(
            @RequestHeader("X-User-Email") String email,
            @RequestBody ChangePasswordRequest request
    ) {
        log.info("Processing password change request for user: {}", email);
        if (email == null || email.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User identity missing from header");
        }
        return ResponseEntity.ok(authService.changePassword(request, email));
    }
}