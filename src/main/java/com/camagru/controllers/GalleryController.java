package com.camagru.controllers;

import com.camagru.dtos.responses.ApiResponse;
import com.camagru.dtos.responses.ImageResponse;
import com.camagru.models.Comment;
import com.camagru.services.CommentService;
import com.camagru.services.GalleryService;
import com.camagru.services.SessionService;
import com.camagru.utils.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

/**
 * Gallery controller (REST JSON API).
 * Handles: get gallery images, get image details, get comments, like image, post comment.
 */
@WebServlet(urlPatterns = {
    "/api/gallery",
    "/api/gallery/*/comments",
    "/api/gallery/*/like"
})
public class GalleryController extends HttpServlet {
    
    private final GalleryService galleryService = new GalleryService();
    private final CommentService commentService = new CommentService();
    private final SessionService sessionService = new SessionService();
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        String path = req.getServletPath();
        
        try {
            if ("/api/gallery".equals(path)) {
                handleGetGallery(req, resp);
            } else if (path.matches("/api/gallery/\\d+/comments")) {
                handleGetComments(req, resp);
            } else {
                sendJsonResponse(resp, 404, ApiResponse.error("Not found", "NOT_FOUND"));
            }
        } catch (Exception e) {
            sendJsonResponse(resp, 500, ApiResponse.error(e.getMessage(), "SERVER_ERROR"));
        }
    }
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        String path = req.getServletPath();
        
        try {
            if (path.matches("/api/gallery/\\d+/like")) {
                handleToggleLike(req, resp);
            } else if (path.matches("/api/gallery/\\d+/comments")) {
                handlePostComment(req, resp);
            } else {
                sendJsonResponse(resp, 404, ApiResponse.error("Not found", "NOT_FOUND"));
            }
        } catch (Exception e) {
            sendJsonResponse(resp, 500, ApiResponse.error(e.getMessage(), "SERVER_ERROR"));
        }
    }
    
    private void handleGetGallery(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        String cursorParam = req.getParameter("cursor");
        String limitParam = req.getParameter("limit");
        
        Timestamp cursor = null;
        if (cursorParam != null && !cursorParam.isEmpty()) {
            cursor = Timestamp.valueOf(cursorParam);
        }
        
        Integer limit = null;
        if (limitParam != null && !limitParam.isEmpty()) {
            limit = Integer.parseInt(limitParam);
        }
        
        Integer userId = getCurrentUserId(req);  // null if not logged in
        
        List<ImageResponse> images = galleryService.getGalleryImages(cursor, limit, userId);
        
        sendJsonResponse(resp, 200, ApiResponse.success("Gallery loaded", images));
    }
    
    private void handleGetComments(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        Integer imageId = extractImageId(req);
        
        List<Comment> comments = commentService.getComments(imageId);
        
        sendJsonResponse(resp, 200, ApiResponse.success("Comments loaded", comments));
    }
    
    private void handleToggleLike(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        Integer userId = getCurrentUserId(req);
        if (userId == null) {
            sendJsonResponse(resp, 401, ApiResponse.error("Unauthorized", "AUTH_REQUIRED"));
            return;
        }
        
        Integer imageId = extractImageId(req);
        
        boolean liked = commentService.toggleLike(userId, imageId);
        int likeCount = commentService.getLikeCount(imageId);
        
        sendJsonResponse(resp, 200, ApiResponse.success(
            liked ? "Image liked" : "Image unliked",
            Map.of("liked", liked, "likeCount", likeCount)
        ));
    }
    
    private void handlePostComment(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        Integer userId = getCurrentUserId(req);
        if (userId == null) {
            sendJsonResponse(resp, 401, ApiResponse.error("Unauthorized", "AUTH_REQUIRED"));
            return;
        }
        
        Integer imageId = extractImageId(req);
        
        Map<String, Object> body = JsonUtil.parseRequest(req);
        String content = (String) body.get("content");
        
        if (content == null || content.trim().isEmpty()) {
            sendJsonResponse(resp, 400, ApiResponse.error("Comment content is required", "VALIDATION_ERROR"));
            return;
        }
        
        Comment comment = commentService.addComment(userId, imageId, content);
        
        sendJsonResponse(resp, 200, ApiResponse.success("Comment posted", comment));
    }
    
    private Integer extractImageId(HttpServletRequest req) {
        String path = req.getServletPath();
        String[] parts = path.split("/");
        for (int i = 0; i < parts.length; i++) {
            if ("gallery".equals(parts[i]) && i + 1 < parts.length) {
                return Integer.parseInt(parts[i + 1]);
            }
        }
        return null;
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
        // Set headers BEFORE writing any content to prevent chunked encoding issues
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.setStatus(status);
        resp.getWriter().write(JsonUtil.toJson(response));
        resp.getWriter().flush();
    }
}
