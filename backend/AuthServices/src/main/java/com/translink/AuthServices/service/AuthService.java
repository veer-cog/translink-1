package com.translink.AuthServices.service;

import com.translink.AuthServices.dto.*;
import com.translink.AuthServices.exception.BadRequestException;
import com.translink.AuthServices.model.Company;
import com.translink.AuthServices.model.OtpVerification;
import com.translink.AuthServices.model.Role;
import com.translink.AuthServices.model.User;
import com.translink.AuthServices.repository.CompanyRepository;
import com.translink.AuthServices.repository.OtpRepository;
import com.translink.AuthServices.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    private static final String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Transactional
    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already registered");
        }

        Company company = companyRepository.save(
                Company.builder().name(request.companyName()).build()
        );

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.ADMIN)
                .company(company)
                .isActive(false)
                .build();

        userRepository.save(user);
        sendOtp(user, "REGISTRATION");
        return "Registration successful. Please verify the code sent to your email.";
    }

    /**
     * Refactored to use your Model: .code(), .expiresAt(), and User relationship
     */
    public void sendOtp(User user, String purpose) {
        String code = String.valueOf(100000 + SECURE_RANDOM.nextInt(900000));

        // Remove existing OTPs for this user before creating a new one
        otpRepository.deleteByUserAndPurpose(user,purpose);

        OtpVerification verification = OtpVerification.builder()
                .user(user)
                .code(code)
                .purpose(purpose)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        otpRepository.save(verification);
        emailService.sendOtpEmail(user.getEmail(), code);
        log.info("[Auth] {} code sent to user: {}", purpose, user.getEmail());
    }

    @Transactional
    public AuthResponse verifyOtp(String email, String code, String purpose) {
        // 1. Fetch User
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        // 2. Fetch OTP (Ensuring the purpose matches the DB exactly, e.g., "LOGIN_MFA")
        OtpVerification verification = otpRepository.findByUserAndPurpose(user, purpose)
                .orElseThrow(() -> new BadRequestException("No active code found for " + purpose));

        // 3. Validation: Expiry
        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            otpRepository.delete(verification);
            throw new BadRequestException("Verification code has expired");
        }

        // 4. Validation: Code Match
        if (!verification.getCode().equals(code)) {
            throw new BadRequestException("Incorrect verification code");
        }

        // --- Actions on Success ---

        if ("REGISTRATION".equalsIgnoreCase(purpose)) {
            user.setActive(true);
            userRepository.save(user);
        }

        // Generate Token only for Login/Reset purposes
        String token = null;
        if ("LOGIN_MFA".equalsIgnoreCase(purpose) || "RESET_PASSWORD".equalsIgnoreCase(purpose)) {
            token = jwtService.generateToken(user);
        }

        // Delete OTP after successful use
        otpRepository.delete(verification);

        // Return the DTO
        return AuthResponse.builder()
                .status("SUCCESS")
                .token(token)
                .email(user.getEmail())
                .mustResetPassword(user.isMustResetPassword())
                .mfaEnabled(user.isMfaEnabled())
                .build();
    }
    public AuthResponse login(LoginRequest request) {
        // 1. Authenticate
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        // 2. Fetch User
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Determine Status
        if (user.isMustResetPassword()) {
            return AuthResponse.builder()
                    .status("MUST_RESET_PASSWORD")
                    .email(user.getEmail())
                    .build();
        }

        if (user.isMfaEnabled()) {
            // Here you would typically trigger an OTP send before returning
            sendOtp(user, "LOGIN_MFA");
            return AuthResponse.builder()
                    .status("MFA_REQUIRED")
                    .email(user.getEmail())
                    .build();
        }

        // 4. Standard Success
        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .status("SUCCESS")
                .token(token)
                .email(user.getEmail())
                .build();
    }
    @Transactional
    public String changePassword(ChangePasswordRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("The current password entered is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustResetPassword(false);
        userRepository.save(user);
        return "Password updated successfully";
    }

    public void initiateForgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Account not found"));
        sendOtp(user, "PASSWORD_RESET");
    }

    @Transactional
    public String resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setMustResetPassword(false);
        userRepository.save(user);
        return "Password has been reset successfully";
    }

    @Transactional
    public String createOperator(CreateOperatorRequest req, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin context not found"));

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Operator email already exists");
        }

        String tempPassword = generateSecurePassword();

        User operator = User.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(tempPassword))
                .role(Role.OPERATOR)
                .company(admin.getCompany())
                .createdBy(admin)
                .isActive(true)
                .mustResetPassword(true)
                .build();

        userRepository.save(operator);
        emailService.sendOperatorWelcomeEmail(operator.getEmail(), operator.getFirstName(), tempPassword);
        return "Operator account created and credentials emailed.";
    }

    private String generateSecurePassword() {
        return SECURE_RANDOM.ints(12, 0, ALPHABET.length())
                .mapToObj(ALPHABET::charAt)
                .map(Object::toString)
                .collect(Collectors.joining());
    }
}