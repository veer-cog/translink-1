package com.translink.AuthServices.client;

import com.translink.AuthServices.dto.AuditRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "audit-service")
public interface AuditClient {

    @PostMapping("/api/audit/logs")
    void logAction(@RequestBody AuditRequest request);
}