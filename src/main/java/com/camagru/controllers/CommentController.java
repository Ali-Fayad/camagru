package com.camagru.controllers;

import com.camagru.dtos.responses.ApiResponse;
import com.camagru.models.Comment;
import com.camagru.models.Image;
import com.camagru.models.User;
import com.camagru.repositories.CommentRepository;
import com.camagru.repositories.ImageRepository;
import com.camagru.repositories.UserRepository;
import com.camagru.services.EmailService;
import com.camagru.services.SessionService;
import com.camagru.utils.JsonUtil;
import com.camagru.utils.ValidationUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

/**
 * Comment controller - handles adding comments to posts
 * POST /api/comments/:id - Add a comment to a post
 */
@WebServlet(urlPatterns = {"/api/comments/*"})
public class CommentController extends HttpServlet {
    
    private final CommentRepository commentRepository = new CommentRepository();
    private final ImageRepository imageRepository = new ImageRepository();
    private final UserRepository userRepository = new UserRepository();
    private final SessionService sessionService = new SessionService();
    private final EmailService emailService = new EmailService();
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        try {
            handleAddComment(req, resp);
        } catch (Exception e) {
            sendJsonResponse(resp, 500, ApiResponse.error(e.getMessage(), "SERVER_ERROR"));
        }
    }
    
    private void handleAddComment(HttpServletRequest req, HttpServletResponse resp) throws Exception {
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
        
        // Parse request body
        Map<String, Object> body = JsonUtil.parseRequest(req);
        String content = (String) body.get("content");
        
        if (content == null || content.trim().isEmpty()) {
            sendJsonResponse(resp, 400, ApiResponse.error("Comment content is required", "VALIDATION_ERROR"));
            return;
        }
        
        // Sanitize and validate content
        content = ValidationUtil.escapeHtml(content.trim());
        if (content.length() > 500) {
            sendJsonResponse(resp, 400, ApiResponse.error("Comment too long (max 500 characters)", "VALIDATION_ERROR"));
            return;
        }
        
        // Create comment
        Comment comment = commentRepository.create(userId, postId, content);
        
        // Send notification if it's not the user's own post
        if (!userId.equals(image.getUserId())) {
            try {
                User postAuthor = userRepository.findById(image.getUserId());
                User commenter = userRepository.findById(userId);
                
                if (postAuthor.isReceiveNotifications()) {
                    emailService.sendCommentNotification(
                        postAuthor.getEmail(),
                        postAuthor.getUsername(),
                        commenter.getUsername(),
                        content
                    );
                }
            } catch (Exception e) {
                // Silently continue if notification fails - don't fail the comment operation
            }
        }
        
        // Return comment with author info
        User author = userRepository.findById(userId);
        Map<String, Object> commentData = new HashMap<>();
        commentData.put("id", comment.getId());
        commentData.put("content", comment.getContent());
        commentData.put("createdAt", comment.getCreatedAt().toString());
        commentData.put("author", Map.of(
            "id", author.getId(),
            "username", author.getUsername()
        ));
        
        sendJsonResponse(resp, 201, ApiResponse.success("Comment added", commentData));
    }
    
    private Integer extractPostId(HttpServletRequest req) {
        String pathInfo = req.getPathInfo(); // /{id}
        if (pathInfo == null || pathInfo.length() <= 1) return null;
        try {
            return Integer.parseInt(pathInfo.substring(1));
        } catch (NumberFormatException e) {
            return null;
        }
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
        // Set headers BEFORE writing any content to prevent chunked encoding issues
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.setStatus(status);
        resp.getWriter().write(JsonUtil.toJson(response));
        resp.getWriter().flush();
    }
}
