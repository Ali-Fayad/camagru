package com.camagru.filters;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * JSON filter to set Content-Type for API responses.
 */
@WebFilter("/api/*")
public class JsonFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        // Set default content type for API
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        chain.doFilter(request, response);
    }
}
