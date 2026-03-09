package com.translink.ShipmentService.config;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableFeignClients(basePackages = "com.translink.ShipmentService.client")
public class FeignConfig {
    // This enables the ShipmentService to talk to the VehicleService
}