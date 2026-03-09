package com.translink.AnalyticsService.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@Slf4j
public class InternalSecurityFilter extends OncePerRequestFilter {

    @Value("${application.internal.secret}")
    private String internalSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        String secret = request.getHeader("X-Internal-Secret");
        String origin = request.getHeader("X-Origin-Service");

        // 1. Skip check for public endpoints (aligned with teammates' Auth pattern)
        if (path.startsWith("/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Validate Internal Shared Secret
        if (secret == null || !secret.equals(internalSecret)) {
            log.warn("[Security] Unauthorized attempt to {}. Secret mismatch. Origin: {}", path, origin);
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        // 3. Extract Identity from Gateway/Teammate Headers
        String userId = request.getHeader("X-User-Id");
        String role = request.getHeader("X-User-Role");
        String email = request.getHeader("X-User-Email");

        // 4. Authenticate the request if identity headers exist
        if (email != null && role != null) {
            // Reconstruct UserDetails: Spring expects authorities to have "ROLE_" prefix for hasRole()
            UserDetails userDetails = new User(email, "", List.of(new SimpleGrantedAuthority("ROLE_" + role)));

            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(auth);
            log.debug("[Security] Verified request from {} for User ID: {}", origin, userId);
        }

        filterChain.doFilter(request, response);
    }
}