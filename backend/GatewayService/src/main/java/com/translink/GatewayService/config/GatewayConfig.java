package com.translink.GatewayService.config;

import com.translink.GatewayService.filters.JwtAuthenticationFilter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Slf4j
@Configuration
public class GatewayConfig {

    private final JwtAuthenticationFilter authFilter;

    public GatewayConfig(JwtAuthenticationFilter authFilter) {
        this.authFilter = authFilter;
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        log.info("[Config] Initializing Secured Routes...");

        return builder.routes()
                // 1. Auth Service Public (Login, Register, OTP, Forgot/Reset)
                .route("auth_public", r -> r.path(
                                "/auth/login", "/auth/register", "/auth/verify-otp",
                                "/auth/forgot-password", "/auth/reset-password", "/auth/resend-otp")
                        .uri("lb://AUTHSERVICES"))

                // 2. Auth Service Secured (Change Password & User management)
                .route("auth_secure", r -> r.path("/auth/change-password", "/users/**")
                        .filters(f -> f.filter(authFilter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://AUTHSERVICES"))

                // 3. Vehicle & Maintenance Services
                .route("vehicle_services", r -> r.path("/vehicles/**", "/maintenance/**", "/hubs/**")
                        .filters(f -> f.filter(authFilter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://VEHICLE-SERVICE"))

                .route("shipment_services", r -> r.path("/shipments/**")
                        .filters(f -> f.filter(authFilter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://SHIPMENTSERVICE"))

                .route("route_services", r -> r.path("/routes/**")
                .filters(f -> f.filter(authFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri("lb://ROUTESERVICE"))

                .route("analytics_services", r -> r.path("/analytics/**")
                        .filters(f -> f.filter(authFilter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://ANALYTICS-SERVICE"))

                .route("audit_services", r -> r.path("/api/v1/audit/**")
                        .filters(f -> f.filter(authFilter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://AUDIT-SERVICE"))

                .build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.addAllowedOrigin("http://localhost:4200");
        corsConfig.addAllowedMethod("*");
        corsConfig.addAllowedHeader("*");
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        return new CorsWebFilter(source);
    }
}