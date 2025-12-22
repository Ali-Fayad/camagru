package com.camagru.controllers;

import com.camagru.dtos.responses.ApiResponse;
import com.camagru.dtos.responses.UserResponse;
import com.camagru.models.User;
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
import java.util.Map;

/**
 * User profile controller (REST JSON API).
 * Handles: get profile, update username/email, change password, toggle notifications.
 */
@WebServlet(urlPatterns = {
    "/api/user/profile",
    "/api/user/password",
    "/api/user/notifications"
})
public class UserController extends HttpServlet {
    
    private final UserService userService = new UserService();
    private final SessionService sessionService = new SessionService();
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        try {
            if ("/api/user/profile".equals(req.getServletPath())) {
                handleGetProfile(req, resp);
            } else {
                sendJsonResponse(resp, 404, ApiResponse.error("Not found", "NOT_FOUND"));
            }
        } catch (Exception e) {
            sendJsonResponse(resp, 500, ApiResponse.error(e.getMessage(), "SERVER_ERROR"));
        }
    }
    
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        String path = req.getServletPath();
        
        try {
            switch (path) {
                case "/api/user/profile":
                    handleUpdateProfile(req, resp);
                    break;
                case "/api/user/password":
                    handleChangePassword(req, resp);
                    break;
                case "/api/user/notifications":
                    handleToggleNotifications(req, resp);
                    break;
                default:
                    sendJsonResponse(resp, 404, ApiResponse.error("Not found", "NOT_FOUND"));
            }
        } catch (Exception e) {
            sendJsonResponse(resp, 500, ApiResponse.error(e.getMessage(), "SERVER_ERROR"));
        }
    }
    
    private void handleGetProfile(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        Integer userId = getCurrentUserId(req);
        if (userId == null) {
            sendJsonResponse(resp, 401, ApiResponse.error("Unauthorized", "AUTH_REQUIRED"));
            return;
        }
        
        User user = userService.getUserById(userId);
        if (user == null) {
            sendJsonResponse(resp, 404, ApiResponse.error("User not found", "NOT_FOUND"));
            return;
        }
        
        UserResponse userResponse = new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.isVerified(),
            user.isReceiveNotifications()
        );
        
        sendJsonResponse(resp, 200, ApiResponse.success("Profile retrieved", userResponse));
    }
    
    private void handleUpdateProfile(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        Integer userId = getCurrentUserId(req);
        if (userId == null) {
            sendJsonResponse(resp, 401, ApiResponse.error("Unauthorized", "AUTH_REQUIRED"));
            return;
        }
        
        Map<String, Object> body = JsonUtil.parseRequest(req);
        
        String newUsername = (String) body.get("username");
        String newEmail = (String) body.get("email");
        
        if (newUsername != null) {
            userService.updateUsername(userId, newUsername);
        }
        
        if (newEmail != null) {
            userService.updateEmail(userId, newEmail);
        }
        
        sendJsonResponse(resp, 200, ApiResponse.success("Profile updated successfully"));
    }
    
    private void handleChangePassword(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        Integer userId = getCurrentUserId(req);
        if (userId == null) {
            sendJsonResponse(resp, 401, ApiResponse.error("Unauthorized", "AUTH_REQUIRED"));
            return;
        }
        
        Map<String, Object> body = JsonUtil.parseRequest(req);
        
        String oldPassword = (String) body.get("oldPassword");
        String newPassword = (String) body.get("newPassword");
        
        userService.changePassword(userId, oldPassword, newPassword);
        
        sendJsonResponse(resp, 200, ApiResponse.success("Password changed successfully"));
    }
    
    private void handleToggleNotifications(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        Integer userId = getCurrentUserId(req);
        if (userId == null) {
            sendJsonResponse(resp, 401, ApiResponse.error("Unauthorized", "AUTH_REQUIRED"));
            return;
        }
        
        Map<String, Object> body = JsonUtil.parseRequest(req);
        Boolean receiveNotifications = (Boolean) body.get("receiveNotifications");
        
        if (receiveNotifications == null) {
            sendJsonResponse(resp, 400, ApiResponse.error("receiveNotifications is required", "VALIDATION_ERROR"));
            return;
        }
        
        userService.updateNotifications(userId, receiveNotifications);
        
        sendJsonResponse(resp, 200, ApiResponse.success("Notification settings updated"));
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
    
    private void sendJsonResponse(HttpServletResponse resp, int status, ApiResponse response) throws IOException {
        resp.setStatus(status);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(JsonUtil.toJson(response));
    }
}
