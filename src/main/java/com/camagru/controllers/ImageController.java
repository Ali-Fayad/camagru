package com.camagru.controllers;

import com.camagru.dtos.responses.ApiResponse;
import com.camagru.dtos.StickerPlacement;
import com.camagru.models.Image;
import com.camagru.services.ImageService;
import com.camagru.services.SessionService;
import com.camagru.utils.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Image controller (REST JSON API).
 * Handles: upload image, delete image, get image details.
 */
@WebServlet(urlPatterns = {
    "/api/images/upload",
    "/api/images/*"
})
public class ImageController extends HttpServlet {
    
    private final ImageService imageService = new ImageService();
    private final SessionService sessionService = new SessionService();
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        if ("/api/images/upload".equals(req.getServletPath())) {
            handleUpload(req, resp);
        } else {
            sendJsonResponse(resp, 404, ApiResponse.error("Not found", "NOT_FOUND"));
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        handleGetImage(req, resp);
    }
    
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        handleDeleteImage(req, resp);
    }
    
    private void handleUpload(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Integer userId = getCurrentUserId(req);
            if (userId == null) {
                sendJsonResponse(resp, 401, ApiResponse.error("Unauthorized", "AUTH_REQUIRED"));
                return;
            }
            
            Map<String, Object> body = JsonUtil.parseRequest(req);
            
            String imageData = (String) body.get("imageData");
            Object stickersObj = body.get("stickers");
            Boolean useWebcam = (Boolean) body.get("useWebcam");
            String caption = body.get("caption") != null ? body.get("caption").toString() : null;
            
            if (imageData == null || stickersObj == null) {
                sendJsonResponse(resp, 400, ApiResponse.error("imageData and stickers are required", "VALIDATION_ERROR"));
                return;
            }
            
            // Parse stickers array manually
            List<StickerPlacement> stickers = new ArrayList<>();
            if (stickersObj instanceof List) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> stickerMaps = (List<Map<String, Object>>) stickersObj;
                
                for (Map<String, Object> stickerMap : stickerMaps) {
                    StickerPlacement sticker = new StickerPlacement();
                    
                    Object indexObj = stickerMap.get("stickerIndex");
                    if (indexObj instanceof Number) {
                        sticker.setStickerIndex(((Number) indexObj).intValue());
                    }
                    
                    Object xObj = stickerMap.get("x");
                    if (xObj instanceof Number) {
                        sticker.setX(((Number) xObj).doubleValue());
                    }
                    
                    Object yObj = stickerMap.get("y");
                    if (yObj instanceof Number) {
                        sticker.setY(((Number) yObj).doubleValue());
                    }
                    
                    Object widthObj = stickerMap.get("width");
                    if (widthObj instanceof Number) {
                        sticker.setWidth(((Number) widthObj).doubleValue());
                    }
                    
                    Object heightObj = stickerMap.get("height");
                    if (heightObj instanceof Number) {
                        sticker.setHeight(((Number) heightObj).doubleValue());
                    }
                    
                    stickers.add(sticker);
                }
            }
            
            if (stickers.isEmpty()) {
                sendJsonResponse(resp, 400, ApiResponse.error("At least one sticker is required", "VALIDATION_ERROR"));
                return;
            }
            
            Image image = imageService.uploadImage(userId, imageData, stickers, useWebcam != null && useWebcam, caption);
            
            sendJsonResponse(resp, 200, ApiResponse.success("Image uploaded successfully", 
                Map.of("imageId", image.getId())));
                
        } catch (Exception e) {
            sendJsonResponse(resp, 500, ApiResponse.error(e.getMessage(), "IMAGE_PROCESSING_ERROR"));
        }
    }
    
    private void handleGetImage(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            String pathInfo = req.getPathInfo();
            if (pathInfo == null || pathInfo.length() <= 1) {
                sendJsonResponse(resp, 400, ApiResponse.error("Image ID required", "VALIDATION_ERROR"));
                return;
            }
            
            Integer imageId = Integer.parseInt(pathInfo.substring(1));
            Image image = imageService.getImageById(imageId);
            
            if (image == null) {
                sendJsonResponse(resp, 404, ApiResponse.error("Image not found", "NOT_FOUND"));
                return;
            }
            
            sendJsonResponse(resp, 200, ApiResponse.success("Image found", image));
            
        } catch (Exception e) {
            sendJsonResponse(resp, 500, ApiResponse.error(e.getMessage(), "SERVER_ERROR"));
        }
    }
    
    private void handleDeleteImage(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Integer userId = getCurrentUserId(req);
            if (userId == null) {
                sendJsonResponse(resp, 401, ApiResponse.error("Unauthorized", "AUTH_REQUIRED"));
                return;
            }
            
            String pathInfo = req.getPathInfo();
            if (pathInfo == null || pathInfo.length() <= 1) {
                sendJsonResponse(resp, 400, ApiResponse.error("Image ID required", "VALIDATION_ERROR"));
                return;
            }
            
            Integer imageId = Integer.parseInt(pathInfo.substring(1));
            boolean deleted = imageService.deleteImage(imageId, userId);
            
            if (deleted) {
                sendJsonResponse(resp, 200, ApiResponse.success("Image deleted successfully"));
            } else {
                sendJsonResponse(resp, 404, ApiResponse.error("Image not found", "NOT_FOUND"));
            }
            
        } catch (IllegalArgumentException e) {
            sendJsonResponse(resp, 403, ApiResponse.error(e.getMessage(), "FORBIDDEN"));
        } catch (Exception e) {
            sendJsonResponse(resp, 500, ApiResponse.error(e.getMessage(), "SERVER_ERROR"));
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
    
    private void sendJsonResponse(HttpServletResponse resp, int status, ApiResponse response) throws IOException {
        // Set headers BEFORE writing any content to prevent chunked encoding issues
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.setStatus(status);
        resp.getWriter().write(JsonUtil.toJson(response));
        resp.getWriter().flush();
    }
}
