package com.camagru.controllers;

import com.camagru.dtos.responses.ApiResponse;
import com.camagru.models.Comment;
import com.camagru.models.Image;
import com.camagru.models.User;
import com.camagru.repositories.CommentRepository;
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
 * Post controller - handles individual post details
 * GET /api/posts/:id - Get post details with likes, comments
 */
@WebServlet(urlPatterns = {"/api/posts/*"})
public class PostController extends HttpServlet {
    
    private final ImageRepository imageRepository = new ImageRepository();
    private final UserRepository userRepository = new UserRepository();
    private final LikeRepository likeRepository = new LikeRepository();
    private final CommentRepository commentRepository = new CommentRepository();
    private final SessionService sessionService = new SessionService();
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        try {
            handleGetPost(req, resp);
        } catch (Exception e) {
            sendJsonResponse(resp, 500, ApiResponse.error(e.getMessage(), "SERVER_ERROR"));
        }
    }
    
    private void handleGetPost(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // Extract post ID from path: /api/posts/123
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            sendJsonResponse(resp, 400, ApiResponse.error("Post ID is required", "VALIDATION_ERROR"));
            return;
        }
        
        String postIdStr = pathInfo.substring(1); // Remove leading '/'
        Integer postId;
        try {
            postId = Integer.parseInt(postIdStr);
        } catch (NumberFormatException e) {
            sendJsonResponse(resp, 400, ApiResponse.error("Invalid post ID", "VALIDATION_ERROR"));
            return;
        }
        
        // Get post details
        Image image = imageRepository.findById(postId);
        if (image == null) {
            sendJsonResponse(resp, 404, ApiResponse.error("Post not found", "NOT_FOUND"));
            return;
        }
        
        // Get author info
        User author = userRepository.findById(image.getUserId());
        if (author == null) {
            sendJsonResponse(resp, 404, ApiResponse.error("Author not found", "NOT_FOUND"));
            return;
        }
        
        // Get likes count and check if current user liked
        int likesCount = likeRepository.countByImageId(postId);
        boolean isLikedByCurrentUser = false;
        
        Integer currentUserId = getCurrentUserId(req);
        if (currentUserId != null) {
            isLikedByCurrentUser = likeRepository.hasUserLikedImage(currentUserId, postId);
        }
        
        // Get comments with author info
        List<Comment> comments = commentRepository.findByImageId(postId);
        List<Map<String, Object>> commentsWithAuthors = comments.stream().map(comment -> {
            try {
                User commentAuthor = userRepository.findById(comment.getUserId());
                Map<String, Object> commentData = new HashMap<>();
                commentData.put("id", comment.getId());
                commentData.put("content", comment.getContent());
                commentData.put("createdAt", comment.getCreatedAt().toString());
                commentData.put("author", Map.of(
                    "id", commentAuthor.getId(),
                    "username", commentAuthor.getUsername()
                ));
                return commentData;
            } catch (SQLException e) {
                return null;
            }
        }).filter(c -> c != null).collect(Collectors.toList());
        
        // Build response
        Map<String, Object> postData = new HashMap<>();
        postData.put("id", image.getId());
        postData.put("imageUrl", "/uploads/" + image.getStoredFilename());
        postData.put("caption", image.getCaption());
        postData.put("createdAt", image.getCreatedAt().toString());
        postData.put("likesCount", likesCount);
        postData.put("commentsCount", comments.size());
        postData.put("isLikedByCurrentUser", isLikedByCurrentUser);
        postData.put("author", Map.of(
            "id", author.getId(),
            "username", author.getUsername()
        ));
        postData.put("comments", commentsWithAuthors);
        
        sendJsonResponse(resp, 200, ApiResponse.success("Post details retrieved", postData));
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
        // Set headers BEFORE writing any content to prevent chunked encoding issues
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.setStatus(status);
        resp.getWriter().write(JsonUtil.toJson(response));
        resp.getWriter().flush();
    }
}
