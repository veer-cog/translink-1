package com.translink.AuthServices.service;

import com.translink.AuthServices.dto.*;
import com.translink.AuthServices.model.*;
import com.translink.AuthServices.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final CompanyRepository companyRepository;

    @Transactional
    public String register(RegisterRequest request) {
        Company company = companyRepository.findByName(request.companyName())
                .orElseGet(() -> companyRepository.save(
                        Company.builder().name(request.companyName()).build()
                ));

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .company(company)
                .role(Role.ADMIN)
                .isActive(true)
                .build();

        userRepository.save(user);
        return "User registered successfully";
    }

    public Map<String, Object> login(String email, String password) {
        log.info("Attempting authentication for user: {}", email);
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));

        var user = userRepository.findByEmail(email).orElseThrow(NoSuchElementException::new);

        // Prepare claims for the token
        Map<String, Object> claims = getClaims(user);

        if (user.isMustResetPassword()) {
            return Map.of("status", "MUST_RESET_PASSWORD", "token", jwtService.generateToken(claims, user));
        }

        if (user.isMfaEnabled()) {
            sendFormattedOtp(user, "MFA");
            return Map.of("status", "MFA_REQUIRED");
        }

        log.info("User {} logged in successfully with Company ID: {}", email, claims.get("companyId"));
        return Map.of("status", "SUCCESS", "token", jwtService.generateToken(claims, user));
    }

    @Transactional
    public String verifyOtp(String email, String code, String purpose) {
        var user = userRepository.findByEmail(email).orElseThrow();
        var otp = otpRepository.findByCodeAndUserAndPurpose(code, user, purpose)
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Expired");
        }

        if ("REGISTRATION".equals(purpose)) { user.setActive(true); }

        otpRepository.delete(otp);

        // Generate token with claims after OTP success
        return jwtService.generateToken(getClaims(user), user);
    }

    // Helper to extract claims from User entity
    private Map<String, Object> getClaims(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        if (user.getCompany() != null) {
            claims.put("companyId", user.getCompany().getId());
        }
        return claims;
    }

    // ... (rest of your methods: resetPassword, changePassword, createOperator, etc.)

    @Transactional
    public UserResponse createOperator(CreateOperatorRequest req, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        User operator = User.builder()
                .email(req.getEmail())
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .company(admin.getCompany())
                .role(Role.OPERATOR)
                .isActive(true)
                .build();

        return mapToResponse(userRepository.save(operator));
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .isActive(user.isActive())
                .companyName(user.getCompany() != null ? user.getCompany().getName() : null)
                .build();
    }


    @Transactional
    public String resetPassword(String email, String newPassword) {
        log.info("Resetting password for user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setMustResetPassword(false);

        userRepository.save(user);

        log.info("Password successfully reset for user: {}", email);
        return "Password reset successful. Use your new password to login.";
    }

    @Transactional
    public String changePassword(ChangePasswordRequest request, String email) {
        log.info("Processing password change for user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustResetPassword(false);
        userRepository.save(user);

        log.info("Password changed successfully for user: {}", email);
        return "Password changed successfully.";
    }

    private void sendFormattedOtp(User user, String purpose) {
        String code = "TL" + (1000 + new Random().nextInt(9000));
        OtpVerification otpEntry = OtpVerification.builder()
                .code(code)
                .purpose(purpose)
                .user(user)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        otpRepository.save(otpEntry);
        emailService.sendOtpEmail(user.getEmail(), code);

        // FIX: Never log the 'user' object here, only the email string
        log.info("OTP code generated for user: {} with purpose: {}", user.getEmail(), purpose);
    }

    public void initiateForgotPassword(String email) {
        log.info("Initiating forgot password process for email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        sendFormattedOtp(user, "FORGOT_PASSWORD");
        log.info("Forgot password OTP sent to user: {}", email);
    }
}