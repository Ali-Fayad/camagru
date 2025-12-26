package com.camagru.services;

import com.camagru.models.Session;
import com.camagru.repositories.SessionRepository;

import java.sql.SQLException;

/**
 * Session service for managing user sessions.
 */
public class SessionService {
    private final SessionRepository sessionRepository;
    
    public SessionService() {
        this.sessionRepository = new SessionRepository();
    }
    
    /**
     * Get session by ID and update last accessed.
     * Returns null only if session truly doesn't exist or is invalid.
     */
    public Session getSession(String sessionId) throws SQLException {
        if (sessionId == null || sessionId.trim().isEmpty()) {
            return null;
        }
        
        Session session = sessionRepository.findById(sessionId);
        
        if (session != null) {
            try {
                // Update last accessed timestamp
                sessionRepository.updateLastAccessed(sessionId);
            } catch (SQLException e) {
                // Log but don't fail if update fails - session is still valid
                System.err.println("Warning: Failed to update session last_accessed: " + e.getMessage());
            }
        }
        
        return session;
    }
    
    /**
     * Validate session exists and is valid.
     */
    public boolean isValidSession(String sessionId) throws SQLException {
        return getSession(sessionId) != null;
    }
    
    /**
     * Get user ID from session.
     */
    public Integer getUserIdFromSession(String sessionId) throws SQLException {
        Session session = getSession(sessionId);
        return session != null ? session.getUserId() : null;
    }
    
    /**
     * Clean up old sessions (called periodically).
     */
    public int cleanupOldSessions(int daysOld) throws SQLException {
        return sessionRepository.deleteOldSessions(daysOld);
    }
}
