package com.camagru.controllers;

import com.camagru.config.AppConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Servlet to serve uploaded images.
 * Maps /uploads/* to actual upload directory.
 */
@WebServlet("/uploads/*")
public class UploadServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        
        // Get filename from path
        String filename = pathInfo.substring(1);
        
        // Prevent directory traversal
        if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        
        // Build file path. If UPLOAD_DIR is absolute (starts with '/'), use it directly.
        String uploadDir = AppConfig.UPLOAD_DIR;
        if (!uploadDir.startsWith("/")) {
            uploadDir = System.getProperty("catalina.base", ".") + "/webapps/ROOT" + uploadDir;
        }
        Path filePath = Paths.get(uploadDir, filename);
        File file = filePath.toFile();
        
        if (!file.exists() || !file.isFile()) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        
        // Set content type based on file extension
        String contentType = getContentTypeFromFilename(filename);
        resp.setContentType(contentType);
        
        // Set cache headers for images
        resp.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year
        
        // Stream file to response
        Files.copy(filePath, resp.getOutputStream());
    }
    
    /**
     * Get content type from filename extension.
     * Explicitly handles common image formats to avoid null MIME types.
     */
    private String getContentTypeFromFilename(String filename) {
        String lower = filename.toLowerCase();
        
        if (lower.endsWith(".png")) {
            return "image/png";
        } else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (lower.endsWith(".gif")) {
            return "image/gif";
        } else if (lower.endsWith(".webp")) {
            return "image/webp";
        } else if (lower.endsWith(".svg")) {
            return "image/svg+xml";
        }
        
        // Fallback to servlet context MIME type lookup
        String contextType = getServletContext().getMimeType(filename);
        return contextType != null ? contextType : "application/octet-stream";
    }
}
