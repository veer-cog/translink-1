package com.translink.ShipmentService.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class FeignClientInterceptor implements RequestInterceptor {

    @Value("${application.internal.secret}")
    private String internalSecret;

    @Override
    public void apply(RequestTemplate template) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        // 1. Always attach the Internal Secret so the destination service trusts this call
        template.header("X-Internal-Secret", internalSecret);
        template.header("X-Origin-Service", "Route-Service"); // Helpful for logging

        // 2. Forward the User Headers so the destination service knows WHO is acting
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();

            // Forward identity headers from the original request
            forwardHeader("X-User-Id", request, template);
            forwardHeader("X-User-Email", request, template);
            forwardHeader("X-Company-Id", request, template);
            forwardHeader("X-User-Role", request, template);
        }
    }

    private void forwardHeader(String headerName, HttpServletRequest request, RequestTemplate template) {
        String value = request.getHeader(headerName);
        if (value != null) {
            template.header(headerName, value);
        }
    }
}