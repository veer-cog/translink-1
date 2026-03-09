package com.translink.audit.service;

import com.translink.audit.client.AuditClient;
import com.translink.audit.model.AuditLog;
import org.springframework.scheduling.annotation.Async;


public class AuditAsyncService {
    private final AuditClient auditClient;

    public AuditAsyncService(AuditClient auditClient) {
        this.auditClient = auditClient;
    }

    @Async("auditExecutor")
    public void logAsync(AuditLog log) {
        try {
            auditClient.saveLog(log);
        } catch (Exception e) {
            // Log locally if remote audit service is down
            System.err.println("Audit Failed: " + e.getMessage());
        }
    }
}