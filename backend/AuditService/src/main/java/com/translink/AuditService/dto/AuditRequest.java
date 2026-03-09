package com.translink.AuditService.dto;

import com.translink.AuditService.model.ActionCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditRequest {
    private String userEmail;
    private String userRole;
    private ActionCategory category;
    private String action;
    private String resourceId;
    private Map<String, Object> metadata; // We use a Map so it's easy to pass data
    private String status;
    private String ipAddress;
}