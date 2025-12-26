package com.camagru.controllers;

import com.camagru.dtos.responses.ApiResponse;
import com.camagru.services.SessionService;
import com.camagru.services.UserService;
import com.camagru.utils.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Delete Account Controller - MVC pattern.
 * Handles DELETE /api/user endpoint for account deletion.
 */
@WebServlet("/api/user")
public class DeleteAccountController extends HttpServlet {
    
    private final SessionService sessionService = new SessionService();
    private final UserService userService = new UserService();
    
    /**
     * DELETE /api/user - Delete user account and all associated data.
     */
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        try {
            Integer userId = getCurrentUserId(req);
            
            if (userId == null) {
                sendJsonResponse(resp, 401, 
                    ApiResponse.error("Authentication required", "AUTH_REQUIRED"));
                return;
            }
            
            // Delete account (cascade deletes images, comments, likes, sessions)
            userService.deleteAccount(userId);
            
            // Clear session cookie
            Cookie sessionCookie = new Cookie("CAMAGRU_SESSION", "");
            sessionCookie.setMaxAge(0);
            sessionCookie.setPath("/");
            sessionCookie.setHttpOnly(true);
            resp.addCookie(sessionCookie);
            
            sendJsonResponse(resp, 200, 
                ApiResponse.success("Account deleted successfully", null));
            
        } catch (Exception e) {
            e.printStackTrace();
            sendJsonResponse(resp, 500, 
                ApiResponse.error("Failed to delete account: " + e.getMessage(), "SERVER_ERROR"));
        }
    }
    
    private Integer getCurrentUserId(HttpServletRequest req) throws Exception {
        String sessionId = getSessionIdFromRequest(req);
        if (sessionId == null) {
            return null;
        }
        return sessionService.getUserIdFromSession(sessionId);
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
    
    /**
     * Helper to send JSON response.
     */
    private void sendJsonResponse(HttpServletResponse resp, int status, ApiResponse response) 
            throws IOException {
        // Set headers BEFORE writing any content to prevent chunked encoding issues
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.setStatus(status);
        resp.getWriter().write(JsonUtil.toJson(response));
        resp.getWriter().flush();
    }
}
