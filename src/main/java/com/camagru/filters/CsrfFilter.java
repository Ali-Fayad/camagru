package com.camagru.filters;

import com.camagru.models.Session;
import com.camagru.services.SessionService;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;

/**
 * CSRF Protection Filter.
 * Validates CSRF tokens for all state-changing API requests (POST, PUT, DELETE).
 * Subject requirement: "must be protected against Cross-Site Request Forgery (CSRF)"
 */
@WebFilter(urlPatterns = "/api/*")
public class CsrfFilter implements Filter {
    
    private final SessionService sessionService = new SessionService();
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String method = httpRequest.getMethod();
        String path = httpRequest.getServletPath();
        
        // Allow safe methods (GET, HEAD, OPTIONS) without CSRF check
        if ("GET".equals(method) || "HEAD".equals(method) || "OPTIONS".equals(method)) {
            chain.doFilter(request, response);
            return;
        }
        
        // Allow login/register/verify without CSRF (they create the token)
        if (path.equals("/api/login") || path.equals("/api/register") || 
            path.equals("/api/verify") || path.equals("/api/forgot-password") ||
            path.equals("/api/reset-password")) {
            chain.doFilter(request, response);
            return;
        }
        
        // For all other state-changing requests, validate CSRF token
        String csrfToken = httpRequest.getHeader("X-CSRF-Token");
        
        if (csrfToken == null || csrfToken.isEmpty()) {
            sendJsonError(httpResponse, 403, "CSRF token missing");
            return;
        }
        
        // Get session from cookie
        String sessionId = getSessionIdFromCookie(httpRequest);
        
        if (sessionId == null) {
            sendJsonError(httpResponse, 401, "Not authenticated");
            return;
        }
        
        try {
            Session session = sessionService.getSession(sessionId);
            
            if (session == null) {
                sendJsonError(httpResponse, 401, "Invalid session");
                return;
            }
            
            // Validate CSRF token matches session token
            if (!csrfToken.equals(session.getCsrfToken())) {
                sendJsonError(httpResponse, 403, "Invalid CSRF token");
                return;
            }
            
            // CSRF validation passed, continue
            chain.doFilter(request, response);
            
        } catch (SQLException e) {
            sendJsonError(httpResponse, 500, "Server error");
        }
    }
    
    private String getSessionIdFromCookie(HttpServletRequest request) {
        jakarta.servlet.http.Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (jakarta.servlet.http.Cookie cookie : cookies) {
                if ("CAMAGRU_SESSION".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
    
    private void sendJsonError(HttpServletResponse response, int status, String message) 
            throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(String.format(
            "{\"success\":false,\"error\":\"%s\",\"code\":\"CSRF_ERROR\"}",
            message
        ));
    }
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // No initialization needed
    }
    
    @Override
    public void destroy() {
        // No cleanup needed
    }
}
