package com.translink.GatewayService.config;

import com.translink.GatewayService.filters.JwtAuthenticationFilter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class GatewayConfig {

    private final JwtAuthenticationFilter authFilter;

    public GatewayConfig(JwtAuthenticationFilter authFilter) {
        this.authFilter = authFilter;
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        log.info("[Config] Initializing Route Definitions...");

        return builder.routes()
                // 1. Auth Service Public (Login/Register)
                .route("auth_public", r -> r.path("/auth/**")
                        .uri("lb://AUTHSERVICES")) 

                // 2. Auth Service Secured (User Management)
                .route("user_secure", r -> r.path("/users/**")
                        .filters(f -> f.filter(authFilter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://AUTHSERVICES"))

                // 3. Vehicle Service
                .route("vehicle_secure", r -> r.path("/vehicles/**")
                        .filters(f -> f.filter(authFilter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://VEHICLE-SERVICE"))

                // 4. Maintenance Service
                .route("maintenance_service", r -> r.path("/maintenance/**")
                        .filters(f -> f.filter(authFilter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://VEHICLE-SERVICE"))

                // 5. Hub Service 
                .route("hub_service", r -> r.path("/hubs/**")
                        .filters(f -> f.filter(authFilter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://VEHICLE-SERVICE")) 
                .build();
    }
}