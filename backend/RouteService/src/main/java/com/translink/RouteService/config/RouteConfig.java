package com.translink.RouteService.config;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration to enable Microservice communication.
 */
@Configuration
@EnableFeignClients(basePackages = "com.translink.route.client")
public class RouteConfig {
    // This class triggers Feign Client scanning for inter-service communication
}