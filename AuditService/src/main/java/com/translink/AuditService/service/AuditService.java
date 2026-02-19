package com.translink.AuditService.service;

import com.translink.AuditService.dto.AuditRequest;
import com.translink.AuditService.model.ActionCategory;
import com.translink.AuditService.model.AuditLog;
import com.translink.AuditService.repository.AuditRepository;
import com.google.gson.Gson; // Import Gson
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditRepository auditRepository;

    // Initialize Gson directly to avoid Bean missing errors
    private final Gson gson = new Gson();

    public void saveLog(AuditRequest request) {
        // Convert Map to JSON String using Gson
        // Gson handles nulls and empty maps gracefully by default
        String metadataJson = (request.getMetadata() != null)
                ? gson.toJson(request.getMetadata())
                : "{}";

        AuditLog log = AuditLog.builder()
                .userEmail(request.getUserEmail())
                .userRole(request.getUserRole())
                .category(request.getCategory())
                .action(request.getAction())
                .resourceId(request.getResourceId())
                .metadata(metadataJson)
                .status(request.getStatus())
                .ipAddress(request.getIpAddress())
                .timestamp(LocalDateTime.now())
                .build();

        auditRepository.save(log);
    }

    public Page<AuditLog> getLogsForTeam(List<String> teamEmails, Pageable pageable) {
        return auditRepository.findByUserEmailIn(teamEmails, pageable);
    }

    public Map<String, Long> getTeamStats(List<String> teamEmails) {
        Map<String, Long> stats = new HashMap<>();
        for (ActionCategory cat : ActionCategory.values()) {
            long count = auditRepository.countByCategoryAndUserEmailIn(cat, teamEmails);
            stats.put(cat.name(), count);
        }
        return stats;
    }
}