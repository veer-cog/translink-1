package com.translink.audit.config;

import com.translink.audit.interceptor.AuditInterceptor;
import com.translink.audit.service.AuditAsyncService;
import com.translink.audit.client.AuditClient;
import feign.RequestInterceptor;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.io.IOException;
import java.util.concurrent.Executor;

@Configuration
@EnableAsync // CRITICAL: This enables the @Async functionality
@EnableFeignClients(basePackages = "com.translink.audit.client") // Add this line
public class AuditAutoConfiguration implements WebMvcConfigurer {

    private final AuditClient auditClient; // Injected from Feign or RestClient
    public AuditAutoConfiguration(@org.springframework.context.annotation.Lazy AuditClient auditClient) {
        this.auditClient = auditClient;
    }
    // 1. Define the Async Service Bean
    @Bean
    @ConditionalOnMissingBean
    public AuditAsyncService auditAsyncService() {
        return new AuditAsyncService(auditClient);
    }

    // 2. Define the Interceptor Bean
    @Bean
    @ConditionalOnMissingBean
    public AuditInterceptor auditInterceptor() {
        return new AuditInterceptor(auditAsyncService());
    }

    // 3. Register Interceptor with the MVC Registry
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(auditInterceptor())
                .addPathPatterns("/**")
                // CRITICAL: Exclude the audit-service's own endpoint to prevent infinite loops
                .excludePathPatterns(
                        "/api/v1/audit/logs"
                );
    }

    @Bean
    feign.Logger.Level feignLoggerLevel() {
        // FULL logs headers, body, and metadata for both request and response
        return feign.Logger.Level.FULL;
    }

    @Bean
    public RequestInterceptor requestInterceptor(@Value("${application.internal.secret}") String secret) {
        return template -> {
            template.header("X-Internal-Secret", secret);

            // Add this to forward the identity so the Audit Service filter can "Login" the service call
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                template.header("X-User-Email", request.getHeader("X-User-Email"));
                template.header("X-User-Id", request.getHeader("X-User-Id"));
                template.header("X-User-Role", request.getHeader("X-User-Role"));
                template.header("X-Company-Id", request.getHeader("X-Company-Id"));
            }
        };
    }
    // 4. Task Executor for Audit (Matches the "auditExecutor" name in your Service)
    @Bean(name = "auditExecutor")
    public Executor auditExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(50);
        executor.setQueueCapacity(1000);
        executor.setThreadNamePrefix("Audit-");

        // THIS PREVENTS THE CRASH:
        executor.setRejectedExecutionHandler(new java.util.concurrent.ThreadPoolExecutor.CallerRunsPolicy());

        executor.initialize();
        return executor;
    }

    /**
     * 5. Filter to wrap request so payload can be read in afterCompletion
     */
    /**
     * 5. Filter to wrap request so payload can be read in afterCompletion
     */
    @Bean
    public FilterRegistrationBean<OncePerRequestFilter> contentCachingFilter() {
        FilterRegistrationBean<OncePerRequestFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain filterChain) throws ServletException, IOException {

                int contentLimit = 1024 * 1024;

                ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request, contentLimit);

                filterChain.doFilter(wrappedRequest, response);
            }
        });
        registrationBean.addUrlPatterns("/*");
        registrationBean.setOrder(org.springframework.core.Ordered.HIGHEST_PRECEDENCE);
        return registrationBean;
    }
}