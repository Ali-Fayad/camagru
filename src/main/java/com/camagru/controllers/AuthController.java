package com.camagru.controllers;

import com.camagru.dtos.responses.ApiResponse;
import com.camagru.models.Session;
import com.camagru.models.User;
import com.camagru.services.AuthService;
import com.camagru.utils.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

/**
 * Authentication controller (REST JSON API).
 * Handles: register, verify, login, logout, password reset.
 */
@WebServlet(urlPatterns = {
    "/api/register",
    "/api/verify",
    "/api/login",
    "/api/logout",
    "/api/forgot-password",
    "/api/reset-password"
})
public class AuthController extends HttpServlet {
    
    private final AuthService authService = new AuthService();
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        String path = req.getServletPath();
        
        try {
            switch (path) {
                case "/api/register":
                    handleRegister(req, resp);
                    break;
                case "/api/verify":
                    handleVerify(req, resp);
                    break;
                case "/api/login":
                    handleLogin(req, resp);
                    break;
                case "/api/logout":
                    handleLogout(req, resp);
                    break;
                case "/api/forgot-password":
                    handleForgotPassword(req, resp);
                    break;
                case "/api/reset-password":
                    handleResetPassword(req, resp);
                    break;
                default:
                    sendJsonResponse(resp, 404, ApiResponse.error("Not found", "NOT_FOUND"));
            }
        } catch (Exception e) {
            sendJsonResponse(resp, 500, ApiResponse.error(e.getMessage(), "SERVER_ERROR"));
        }
    }
    
    private void handleRegister(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        Map<String, Object> body = JsonUtil.parseRequest(req);
        
        String username = (String) body.get("username");
        String email = (String) body.get("email");
        String password = (String) body.get("password");
        
        User user = authService.register(username, email, password);
        
        sendJsonResponse(resp, 201, ApiResponse.success(
            "Registration successful! Check your email for verification code.",
            Map.of("userId", user.getId())
        ));
    }
    
    private void handleVerify(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        Map<String, Object> body = JsonUtil.parseRequest(req);
        
        String email = (String) body.get("email");
        String code = (String) body.get("code");
        
        Session session = authService.verifyAndLogin(email, code);
        
        if (session != null) {
            // Set session cookie (expires on browser close for security)
            Cookie sessionCookie = new Cookie("CAMAGRU_SESSION", session.getId());
            sessionCookie.setHttpOnly(true);
            sessionCookie.setPath("/");
            sessionCookie.setMaxAge(-1); // Session cookie - expires on browser close
            resp.addCookie(sessionCookie);

            sendJsonResponse(resp, 200, ApiResponse.success("Email verified successfully!", 
                Map.of("sessionId", session.getId(), "csrfToken", session.getCsrfToken())));
        } else {
            sendJsonResponse(resp, 400, ApiResponse.error("Invalid or expired verification code", "INVALID_VERIFICATION"));
        }
    }
    
    private void handleLogin(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        Map<String, Object> body = JsonUtil.parseRequest(req);
        
        // Accept both 'email' and 'username' fields for backwards compatibility
        String identifier = (String) body.get("email");
        if (identifier == null) {
            identifier = (String) body.get("username");
        }
        String password = (String) body.get("password");
        
        try {
            Session session = authService.login(identifier, password);
            
            // Set session cookie (expires on browser close for security)
            Cookie sessionCookie = new Cookie("CAMAGRU_SESSION", session.getId());
            sessionCookie.setHttpOnly(true);
            sessionCookie.setPath("/");
            sessionCookie.setMaxAge(-1); // Session cookie - expires on browser close
            resp.addCookie(sessionCookie);
            
            sendJsonResponse(resp, 200, ApiResponse.success("Login successful", 
                Map.of("sessionId", session.getId(), "csrfToken", session.getCsrfToken())));
        } catch (IllegalArgumentException e) {
            if ("Email not verified".equals(e.getMessage())) {
                sendJsonResponse(resp, 201, ApiResponse.success("Email not verified. Please verify your account.", 
                    Map.of("requiresVerification", true)));
            } else {
                // Invalid credentials or other validation errors
                sendJsonResponse(resp, 401, ApiResponse.error(e.getMessage(), "INVALID_CREDENTIALS"));
            }
        }
    }
    
    private void handleLogout(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        String sessionId = getSessionIdFromRequest(req);
        
        if (sessionId != null) {
            authService.logout(sessionId);
        }
        
        // Clear cookie
        Cookie sessionCookie = new Cookie("CAMAGRU_SESSION", "");
        sessionCookie.setMaxAge(0);
        sessionCookie.setPath("/");
        resp.addCookie(sessionCookie);
        
        sendJsonResponse(resp, 200, ApiResponse.success("Logged out successfully"));
    }
    
    private void handleForgotPassword(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        Map<String, Object> body = JsonUtil.parseRequest(req);
        
        String email = (String) body.get("email");
        
        authService.requestPasswordReset(email);
        
        sendJsonResponse(resp, 200, ApiResponse.success("If email exists, reset link has been sent"));
    }
    
    private void handleResetPassword(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        Map<String, Object> body = JsonUtil.parseRequest(req);
        
        String token = (String) body.get("token");
        String newPassword = (String) body.get("newPassword");
        
        boolean reset = authService.resetPassword(token, newPassword);
        
        if (reset) {
            sendJsonResponse(resp, 200, ApiResponse.success("Password reset successfully"));
        } else {
            sendJsonResponse(resp, 400, ApiResponse.error("Invalid or expired reset token", "INVALID_TOKEN"));
        }
    }
    
    private String getSessionIdFromRequest(HttpServletRequest req) {
        Cookie[] cookies = req.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("CAMAGRU_SESSION".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
    
    private void sendJsonResponse(HttpServletResponse resp, int status, ApiResponse response) throws IOException {
        // Set headers BEFORE writing any content to prevent chunked encoding issues
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.setStatus(status);
        resp.getWriter().write(JsonUtil.toJson(response));
        resp.getWriter().flush();
    }
}
