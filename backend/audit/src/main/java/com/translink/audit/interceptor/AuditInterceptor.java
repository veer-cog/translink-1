package com.translink.audit.interceptor;

import com.translink.audit.model.AuditLog;
import com.translink.audit.service.AuditAsyncService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.time.LocalDateTime;

public class AuditInterceptor implements HandlerInterceptor {

    private final AuditAsyncService auditAsyncService;

    public AuditInterceptor(AuditAsyncService auditAsyncService) {
        this.auditAsyncService = auditAsyncService;
    }

    @Value("${spring.application.name:unknown-service}")
    private String serviceName;

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {

        // 1. Capture payload safely
        String body = "";
        if (request instanceof ContentCachingRequestWrapper wrapper) {
            body = new String(wrapper.getContentAsByteArray());
        }

        // 2. Extract Identity from Headers (Priority 1)
        String userId = request.getHeader("X-User-Id");
        String userEmail = request.getHeader("X-User-Email");
        String companyId = request.getHeader("X-Company-Id");

        // 3. Fallback to SecurityContext if headers are missing (Priority 2)
        if (userEmail == null || userId == null) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof UserDetails userDetails) {
                userEmail = userDetails.getUsername();
                // If userId isn't in headers, we often use email as the identifier
                if (userId == null) userId = userEmail;
            }
        }

        // 4. Map to AuditLog object
        AuditLog log = new AuditLog();
        log.setCompanyId(companyId != null ? companyId : "DEFAULT_ORG");
        log.setUserId(userId != null ? userId : "ANONYMOUS");
        log.setUserEmail(userEmail != null ? userEmail : "ANONYMOUS");
        log.setServiceName(serviceName);
        log.setEndpoint(request.getRequestURI());
        log.setMethod(request.getMethod());
        log.setPayload(body);
        log.setStatusCode(response.getStatus());
        log.setTimestamp(LocalDateTime.now());

        // 5. Send to Async Service
        auditAsyncService.logAsync(log);
    }
}