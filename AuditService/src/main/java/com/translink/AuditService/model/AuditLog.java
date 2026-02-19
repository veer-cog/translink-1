package com.translink.AuditService.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who performed the action
    private String userEmail;
    private String userRole;

    // Categorization
    @Enumerated(EnumType.STRING)
    private ActionCategory category;

    private String action; // e.g., "START_ROUTE", "LOGIN", "ADD_MAINTENANCE"

    // The ID of the affected object (Vehicle ID, User ID, Route ID)
    private String resourceId;

    // Flexible field for extra details (stored as JSON string)
    @Column(columnDefinition = "TEXT")
    private String metadata;

    private String status; // SUCCESS, FAILED
    private String ipAddress;
    private LocalDateTime timestamp;
}