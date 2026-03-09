package com.translink.AuditService.controller;

import com.translink.AuditService.model.AuditLogEntity;
import com.translink.audit.model.AuditLog;
import com.translink.AuditService.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel; // New Import
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @PostMapping("/logs")
    public ResponseEntity<Void> receiveLog(@RequestBody AuditLog log) {
        auditService.saveLog(log);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/company")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AuditLogEntity>> getCompanyLogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String serviceName,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        String adminCompanyId = getContextDetails("companyId");
        return ResponseEntity.ok(auditService.getLogsWithFilters(adminCompanyId, search, serviceName, pageable));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedModel<AuditLogEntity>> getUserLogs(
            @PathVariable String userId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        String adminCompanyId = getContextDetails("companyId");
        var page = auditService.getLogsByUser(userId, adminCompanyId, pageable);
        return ResponseEntity.ok(new PagedModel<>(page)); // Wrap in PagedModel
    }

    private String getContextDetails(String key) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof Map<?, ?> details) {
            return (String) details.get(key);
        }
        return null;
    }
}