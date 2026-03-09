package com.translink.AuditService.dto;


import com.translink.AuditService.model.ActionCategory;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AuditResponse {
    private Long id;
    private String userEmail;
    private ActionCategory category;
    private String action;
    private String resourceId;
    private String status;
    private LocalDateTime timestamp;
    private String details; // Formatted metadata for the UI
}