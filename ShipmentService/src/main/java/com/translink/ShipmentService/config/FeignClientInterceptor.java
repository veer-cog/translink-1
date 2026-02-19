package com.translink.ShipmentService.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class FeignClientInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate template) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null) {
                // DEBUGGER LOGS
                System.out.println("DEBUG: Intercepted Token: " + authHeader.substring(0, 15) + "...");

                template.header("Authorization", authHeader);
            } else {
                System.out.println("DEBUG: No Authorization header found in current request!");
            }
        } else {
            System.out.println("DEBUG: RequestContextHolder is null - are you running in an Async thread?");
        }
    }
}