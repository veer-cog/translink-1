package com.translink.AuthServices.controller;

import com.translink.AuthServices.dto.ChangePasswordRequest;
import com.translink.AuthServices.dto.RegisterRequest;
import com.translink.AuthServices.model.User;
import com.translink.AuthServices.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Added
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j // Added annotation
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        log.info("Received registration request for email: {}", request.email());
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        log.info("Login attempt for email: {}", request.get("email"));
        return ResponseEntity.ok(authService.login(request.get("email"), request.get("password")));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verify(@RequestBody Map<String, String> request) {
        log.info("Verifying OTP for email: {} with purpose: {}", request.get("email"), request.get("purpose"));
        String token = authService.verifyOtp(
                request.get("email"),
                request.get("code"),
                request.get("purpose")
        );
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        log.info("Password recovery initiated for email: {}", request.get("email"));
        authService.initiateForgotPassword(request.get("email"));
        return ResponseEntity.ok("OTP sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> reset(
            @AuthenticationPrincipal UserDetails userDetails, // Use Spring's interface
            @RequestBody Map<String, String> request
    ) {
        String email = userDetails.getUsername();
        return ResponseEntity.ok(authService.resetPassword(email, request.get("newPassword")));
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody ChangePasswordRequest request
    ) {
        log.info("User {} is changing their password from account settings", user.getEmail());
        return ResponseEntity.ok(authService.changePassword(request, user.getEmail()));
    }
}