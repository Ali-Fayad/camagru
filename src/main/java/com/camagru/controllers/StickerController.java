package com.camagru.controllers;

import com.camagru.dtos.responses.ApiResponse;
import com.camagru.services.StickerService;
import com.camagru.utils.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Sticker controller (REST JSON API).
 * Handles: list all available stickers.
 */
@WebServlet(urlPatterns = {
    "/api/stickers"
})
public class StickerController extends HttpServlet {
    
    private final StickerService stickerService = new StickerService();
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        try {
            handleGetStickers(req, resp);
        } catch (Exception e) {
            sendJsonResponse(resp, 500, ApiResponse.error(e.getMessage(), "SERVER_ERROR"));
        }
    }
    
    private void handleGetStickers(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        List<Map<String, Object>> stickers = stickerService.getAllStickers();
        
        sendJsonResponse(resp, 200, ApiResponse.success("Stickers retrieved", stickers));
    }
    
    private void sendJsonResponse(HttpServletResponse resp, int status, ApiResponse response) throws IOException {
        resp.setStatus(status);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(JsonUtil.toJson(response));
    }
}
