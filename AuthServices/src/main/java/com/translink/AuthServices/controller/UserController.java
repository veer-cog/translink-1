package com.translink.AuthServices.controller;

import com.translink.AuthServices.dto.*;
import com.translink.AuthServices.service.AuthService;
import com.translink.AuthServices.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Added
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j // Added annotation
public class UserController {

    private final AuthService authService;
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal UserDetails details) {
        log.info("Fetching profile for user: {}", details.getUsername());
        return ResponseEntity.ok(userService.getMe(details.getUsername()));
    }

    @PostMapping("/create-operator")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createOp(
            @AuthenticationPrincipal UserDetails adminDetails,
            @RequestBody CreateOperatorRequest req
    ) {
        log.info("Admin {} is creating a new operator with email: {}", adminDetails.getUsername(), req.getEmail());
        return ResponseEntity.ok(authService.createOperator(req, adminDetails.getUsername()));
    }

    @GetMapping("/list")
    public ResponseEntity<List<UserResponse>> list(@AuthenticationPrincipal UserDetails details) {
        log.info("User {} is requesting their subordinate list", details.getUsername());
        return ResponseEntity.ok(userService.listSubordinates(details.getUsername()));
    }

    @PutMapping("/mfa")
    public ResponseEntity<String> toggleMfa(@AuthenticationPrincipal UserDetails details, @RequestParam boolean enabled) {
        log.info("User {} is updating MFA status to: {}", details.getUsername(), enabled);
        userService.toggleMfa(details.getUsername(), enabled);
        return ResponseEntity.ok("MFA status updated.");
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal UserDetails details,
            @RequestBody UpdateUserRequest request
    ) {
        log.info("User {} is updating their profile information", details.getUsername());
        return ResponseEntity.ok(userService.updateProfile(details.getUsername(), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @AuthenticationPrincipal UserDetails details,
            @PathVariable String id
    ) {
        log.info("User {} is attempting to access user ID: {}", details.getUsername(), id);
        return ResponseEntity.ok(userService.getUserSecurely(id, details));
    }
}