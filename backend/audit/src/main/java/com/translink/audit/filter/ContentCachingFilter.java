package com.translink.audit.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.util.ContentCachingRequestWrapper;
import java.io.IOException;

public class ContentCachingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (request instanceof HttpServletRequest httpRequest &&
                response instanceof HttpServletResponse httpResponse) {

            // Fix: Providing the 2nd argument (contentLimit)
            // -1 means no limit, or use a value like 1048576 (1MB)
            ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(httpRequest, 1048576);

            chain.doFilter(wrappedRequest, httpResponse);
        } else {
            chain.doFilter(request, response);
        }
    }
}