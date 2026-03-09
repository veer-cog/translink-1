package com.translink.AuthServices.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String status;
    private String token;
    private String email;
    private boolean mustResetPassword; // Added for redirection logic
    private boolean mfaEnabled;        // Added for status tracking
}