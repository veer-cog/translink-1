package com.translink.vehicle.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Added contextId to resolve the BeanDefinitionOverrideException
 */
@FeignClient(name = "compliance-service", contextId = "vehicleComplianceClient", path = "/compliance")
public interface ComplianceClient {

    @GetMapping("/{id}")
    Object getComplianceByVehicleId(@PathVariable("id") String vehicleId);
    
    default void logAction(String plate) {
        System.out.println(">>> [FEIGN] Calling Compliance Service for Plate: " + plate);
    }
}