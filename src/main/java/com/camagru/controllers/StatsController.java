package com.camagru.controllers;

import com.camagru.dtos.responses.ApiResponse;
import com.camagru.services.SessionService;
import com.camagru.services.StatsService;
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
 * Stats controller (REST JSON API).
 * Handles: get user statistics.
 */
@WebServlet(urlPatterns = {
    "/api/user/stats"
})
public class StatsController extends HttpServlet {
    
    private final StatsService statsService = new StatsService();
    private final SessionService sessionService = new SessionService();
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        try {
            handleGetStats(req, resp);
        } catch (Exception e) {
            sendJsonResponse(resp, 500, ApiResponse.error(e.getMessage(), "SERVER_ERROR"));
        }
    }
    
    private void handleGetStats(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        Integer userId = getCurrentUserId(req);
        if (userId == null) {
            sendJsonResponse(resp, 401, ApiResponse.error("Unauthorized", "AUTH_REQUIRED"));
            return;
        }
        
        Map<String, Object> stats = statsService.getUserStats(userId);
        
        sendJsonResponse(resp, 200, ApiResponse.success("Stats retrieved", stats));
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
