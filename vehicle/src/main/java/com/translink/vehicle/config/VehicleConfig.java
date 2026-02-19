package com.translink.vehicle.config;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration to enable Microservice communication.
 */
@Configuration
@EnableFeignClients(basePackages = "com.translink.vehicle.client")
public class VehicleConfig {
    // This class triggers Feign Client scanning for inter-service communication
}