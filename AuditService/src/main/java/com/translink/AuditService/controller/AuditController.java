package com.translink.AuditService.controller;

import com.translink.AuditService.dto.AuditRequest;
import com.translink.AuditService.model.AuditLog;
import com.translink.AuditService.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    // 1. Internal Endpoint: Other services call this to save a log
    @PostMapping("/logs")
    public ResponseEntity<String> saveLog(@RequestBody AuditRequest request) {
        auditService.saveLog(request);
        return ResponseEntity.ok("Log saved successfully");
    }

    // 2. Admin Endpoint: Get logs for the Admin and their created users
    // The 'teamEmails' list is provided by the Auth-Service
    @PostMapping("/team-logs")
    public ResponseEntity<Page<AuditLog>> getTeamLogs(
            @RequestBody List<String> teamEmails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(auditService.getLogsForTeam(teamEmails, PageRequest.of(page, size)));
    }

    // 3. Analytics Perspective: Get action counts for the whole team
    @PostMapping("/analytics/team-summary")
    public ResponseEntity<Map<String, Long>> getTeamAnalytics(@RequestBody List<String> teamEmails) {
        return ResponseEntity.ok(auditService.getTeamStats(teamEmails));
    }
}