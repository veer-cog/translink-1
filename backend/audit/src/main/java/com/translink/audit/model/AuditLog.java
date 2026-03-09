package com.translink.audit.model;

import java.time.LocalDateTime;

public class AuditLog {
    private String companyId;
    private String userId;
    private String userEmail;
    private String serviceName;
    private String endpoint;
    private String method;
    private String payload;
    private Integer statusCode;
    private LocalDateTime timestamp;

    // Standard No-Args Constructor
    public AuditLog() {
    }

    // Full All-Args Constructor
    public AuditLog(String companyId, String userId, String userEmail, String serviceName,
                    String endpoint, String method, String payload, Integer statusCode,
                    LocalDateTime timestamp) {
        this.companyId = companyId;
        this.userId = userId;
        this.userEmail = userEmail;
        this.serviceName = serviceName;
        this.endpoint = endpoint;
        this.method = method;
        this.payload = payload;
        this.statusCode = statusCode;
        this.timestamp = timestamp;
    }

    // Standard Getters and Setters
    public String getCompanyId() { return companyId; }
    public void setCompanyId(String companyId) { this.companyId = companyId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getEndpoint() { return endpoint; }
    public void setEndpoint(String endpoint) { this.endpoint = endpoint; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }

    public Integer getStatusCode() { return statusCode; }
    public void setStatusCode(Integer statusCode) { this.statusCode = statusCode; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}