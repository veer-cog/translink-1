package com.translink.audit.client;

import com.translink.audit.model.AuditLog;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "AUDIT-SERVICE")
public interface AuditClient {
    @PostMapping("/api/v1/audit/logs")
    void saveLog(@RequestBody AuditLog log);
}