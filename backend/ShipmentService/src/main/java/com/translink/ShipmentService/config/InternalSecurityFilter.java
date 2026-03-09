package com.translink.ShipmentService.config;

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
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class InternalSecurityFilter extends OncePerRequestFilter {

    @Value("${application.internal.secret}")
    private String internalSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String secret = request.getHeader("X-Internal-Secret");
        String userId = request.getHeader("X-User-Id");
        String email = request.getHeader("X-User-Email");
        String companyId = request.getHeader("X-Company-Id");
        String role = request.getHeader("X-User-Role");

        // 1. Validate Secret (Ensures request came from your Gateway or another Microservice)
        if (secret == null || !secret.equals(internalSecret)) {
            log.warn("[Security] Forbidden: Invalid or missing Internal Secret from {}", request.getRemoteAddr());
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        // 2. If User Headers exist, establish Security Context
        if (email != null) {
            List<SimpleGrantedAuthority> authorities = (role != null)
                    ? List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    : Collections.emptyList();

            UserDetails userDetails = new User(email, "", authorities);

            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    userDetails, null, authorities);

            // Store IDs in details map for ShipmentController to use
            Map<String, Object> details = new HashMap<>();
            details.put("userId", userId);
            details.put("companyId", companyId);
            auth.setDetails(details);

            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}