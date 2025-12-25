package com.camagru.controllers;

import com.camagru.dtos.responses.ApiResponse;
import com.camagru.models.Image;
import com.camagru.models.User;
import com.camagru.repositories.ImageRepository;
import com.camagru.repositories.LikeRepository;
import com.camagru.repositories.UserRepository;
import com.camagru.services.NotificationService;
import com.camagru.services.SessionService;
import com.camagru.utils.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;

/**
 * Like controller - handles liking/unliking posts
 * POST /api/posts/:id/like - Like a post
 * DELETE /api/posts/:id/like - Unlike a post
 */
@WebServlet(urlPatterns = {"/api/posts/*/like"})
public class LikeController extends HttpServlet {
    
    private final LikeRepository likeRepository = new LikeRepository();
    private final ImageRepository imageRepository = new ImageRepository();
    private final UserRepository userRepository = new UserRepository();
    private final SessionService sessionService = new SessionService();
    private final NotificationService notificationService = new NotificationService();
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        try {
            handleLike(req, resp);
        } catch (Exception e) {
            e.printStackTrace();
            sendJsonResponse(resp, 500, ApiResponse.error(e.getMessage(), "SERVER_ERROR"));
        }
    }
    
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        try {
            handleUnlike(req, resp);
        } catch (Exception e) {
            e.printStackTrace();
            sendJsonResponse(resp, 500, ApiResponse.error(e.getMessage(), "SERVER_ERROR"));
        }
    }
    
    private void handleLike(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // Check authentication
        Integer userId = getCurrentUserId(req);
        if (userId == null) {
            sendJsonResponse(resp, 401, ApiResponse.error("Authentication required", "AUTH_REQUIRED"));
            return;
        }
        
        // Extract post ID from path
        Integer postId = extractPostId(req);
        if (postId == null) {
            sendJsonResponse(resp, 400, ApiResponse.error("Invalid post ID", "VALIDATION_ERROR"));
            return;
        }
        
        // Check if post exists
        Image image = imageRepository.findById(postId);
        if (image == null) {
            sendJsonResponse(resp, 404, ApiResponse.error("Post not found", "NOT_FOUND"));
            return;
        }
        
        // Check if already liked
        if (likeRepository.hasUserLikedImage(userId, postId)) {
            sendJsonResponse(resp, 400, ApiResponse.error("Already liked this post", "VALIDATION_ERROR"));
            return;
        }
        
        // Add like
        likeRepository.create(userId, postId);
        
        // Send notification if it's not the user's own post
        if (!userId.equals(image.getUserId())) {
            try {
                User postAuthor = userRepository.findById(image.getUserId());
                User liker = userRepository.findById(userId);
                
                if (postAuthor.isReceiveNotifications()) {
                    String subject = "New Like on Your Post";
                    String message = liker.getUsername() + " liked your post!";
                    notificationService.sendEmail(postAuthor.getEmail(), subject, message);
                }
            } catch (Exception e) {
                // Log but don't fail the like operation
                System.err.println("Failed to send notification: " + e.getMessage());
            }
        }
        
        // Return updated count
        int likesCount = likeRepository.countByImageId(postId);
        sendJsonResponse(resp, 200, ApiResponse.success("Post liked", likesCount));
    }
    
    private void handleUnlike(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // Check authentication
        Integer userId = getCurrentUserId(req);
        if (userId == null) {
            sendJsonResponse(resp, 401, ApiResponse.error("Authentication required", "AUTH_REQUIRED"));
            return;
        }
        
        // Extract post ID from path
        Integer postId = extractPostId(req);
        if (postId == null) {
            sendJsonResponse(resp, 400, ApiResponse.error("Invalid post ID", "VALIDATION_ERROR"));
            return;
        }
        
        // Check if post exists
        Image image = imageRepository.findById(postId);
        if (image == null) {
            sendJsonResponse(resp, 404, ApiResponse.error("Post not found", "NOT_FOUND"));
            return;
        }
        
        // Check if not liked
        if (!likeRepository.hasUserLikedImage(userId, postId)) {
            sendJsonResponse(resp, 400, ApiResponse.error("Haven't liked this post", "VALIDATION_ERROR"));
            return;
        }
        
        // Remove like
        likeRepository.delete(userId, postId);
        
        // Return updated count
        int likesCount = likeRepository.countByImageId(postId);
        sendJsonResponse(resp, 200, ApiResponse.success("Post unliked", likesCount));
    }
    
    private Integer extractPostId(HttpServletRequest req) {
        String pathInfo = req.getServletPath(); // /api/posts/123/like
        String[] parts = pathInfo.split("/");
        if (parts.length >= 4) {
            try {
                return Integer.parseInt(parts[3]);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }
    
    private Integer getCurrentUserId(HttpServletRequest req) throws SQLException {
        String sessionId = getSessionIdFromRequest(req);
        if (sessionId != null) {
            return sessionService.getUserIdFromSession(sessionId);
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
