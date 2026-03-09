package com.translink.RouteService.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final InternalSecurityFilter internalSecurityFilter; // Add this
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	    http
	        // 1. Disable CSRF (Must stay disabled for Postman POST/PUT)
	        .csrf(AbstractHttpConfigurer::disable)
	        
	        .cors(AbstractHttpConfigurer::disable)
	        
	        // 2. Updated Request Authorizations
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/routes/**").authenticated() // Ensure this matches your controller path
                        .requestMatchers("/shipments/**").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(internalSecurityFilter, UsernamePasswordAuthenticationFilter.class);
	    
	    	

	    return http.build();
	}
}