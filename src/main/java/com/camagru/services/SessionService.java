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
     */
    public Session getSession(String sessionId) throws SQLException {
        Session session = sessionRepository.findById(sessionId);
        
        if (session != null) {
            // Update last accessed timestamp
            sessionRepository.updateLastAccessed(sessionId);
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
