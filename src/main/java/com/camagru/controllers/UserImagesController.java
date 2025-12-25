package com.camagru.controllers;

import com.camagru.dtos.responses.ApiResponse;
import com.camagru.models.Image;
import com.camagru.models.User;
import com.camagru.repositories.ImageRepository;
import com.camagru.repositories.LikeRepository;
import com.camagru.repositories.UserRepository;
import com.camagru.services.SessionService;
import com.camagru.utils.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * User controller for user-specific operations.
 * Handles: get user's images, etc.
 */
@WebServlet("/api/user/images")
public class UserImagesController extends HttpServlet {
    
    private final ImageRepository imageRepository = new ImageRepository();
    private final UserRepository userRepository = new UserRepository();
    private final LikeRepository likeRepository = new LikeRepository();
    private final SessionService sessionService = new SessionService();
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        handleGetUserImages(req, resp);
    }
    
    private void handleGetUserImages(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Integer currentUserId = getCurrentUserId(req);
            if (currentUserId == null) {
                sendJsonResponse(resp, 401, ApiResponse.error("Unauthorized", "AUTH_REQUIRED"));
                return;
            }
            
            // Get images for current user
            List<Image> images = imageRepository.findByUserId(currentUserId);
            
            // Build response with like counts
            List<Map<String, Object>> imageData = images.stream().map(image -> {
                try {
                    int likesCount = likeRepository.countByImageId(image.getId());
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", image.getId());
                    data.put("imageUrl", "/uploads/" + image.getStoredFilename());
                    data.put("caption", image.getCaption());
                    data.put("createdAt", image.getCreatedAt().toString());
                    data.put("likesCount", likesCount);
                    data.put("isLikedByCurrentUser", likeRepository.hasUserLikedImage(currentUserId, image.getId()));
                    return data;
                } catch (SQLException e) {
                    return null;
                }
            }).filter(d -> d != null).collect(Collectors.toList());
            
            sendJsonResponse(resp, 200, ApiResponse.success("User images retrieved", 
                Map.of("images", imageData)));
                
        } catch (Exception e) {
            sendJsonResponse(resp, 500, ApiResponse.error(e.getMessage(), "SERVER_ERROR"));
        }
    }
    
    private Integer getCurrentUserId(HttpServletRequest req) {
        try {
            String sessionId = getSessionIdFromRequest(req);
            if (sessionId != null) {
                return sessionService.getUserIdFromSession(sessionId);
            }
        } catch (Exception e) {
            // Ignore - user not authenticated
        }
        return null;
    }
    
    private String getSessionIdFromRequest(HttpServletRequest req) {
        jakarta.servlet.http.Cookie[] cookies = req.getCookies();
        if (cookies != null) {
            for (jakarta.servlet.http.Cookie cookie : cookies) {
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
