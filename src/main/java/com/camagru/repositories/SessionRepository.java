package com.camagru.repositories;

import com.camagru.config.DatabaseConfig;
import com.camagru.models.Session;

import java.sql.*;

/**
 * Session repository for database-backed sessions.
 * PHP equivalent: Custom session handler with database
 */
public class SessionRepository {
    
    /**
     * Create new session with CSRF token.
     */
    public Session create(String sessionId, Integer userId, String csrfToken) throws SQLException {
        String sql = "INSERT INTO sessions (id, user_id, csrf_token) VALUES (?, ?, ?) RETURNING created_at, last_accessed";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, sessionId);
            stmt.setInt(2, userId);
            stmt.setString(3, csrfToken);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Session session = new Session();
                    session.setId(sessionId);
                    session.setUserId(userId);
                    session.setCsrfToken(csrfToken);
                    session.setCreatedAt(rs.getTimestamp("created_at"));
                    session.setLastAccessed(rs.getTimestamp("last_accessed"));
                    return session;
                }
            }
        }
        
        return null;
    }
    
    /**
     * Find session by ID.
     */
    public Session findById(String sessionId) throws SQLException {
        String sql = "SELECT * FROM sessions WHERE id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, sessionId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Session session = new Session();
                    session.setId(rs.getString("id"));
                    session.setUserId(rs.getInt("user_id"));
                    session.setData(rs.getString("data"));
                    session.setCsrfToken(rs.getString("csrf_token"));
                    session.setLastAccessed(rs.getTimestamp("last_accessed"));
                    session.setCreatedAt(rs.getTimestamp("created_at"));
                    return session;
                }
            }
        }
        
        return null;
    }
    
    /**
     * Update session last accessed timestamp.
     */
    public boolean updateLastAccessed(String sessionId) throws SQLException {
        String sql = "UPDATE sessions SET last_accessed = CURRENT_TIMESTAMP WHERE id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, sessionId);
            
            return stmt.executeUpdate() > 0;
        }
    }
    
    /**
     * Delete session (logout).
     */
    public boolean delete(String sessionId) throws SQLException {
        String sql = "DELETE FROM sessions WHERE id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, sessionId);
            
            return stmt.executeUpdate() > 0;
        }
    }
    
    /**
     * Delete old sessions (cleanup).
     * PHP equivalent: Session garbage collection
     */
    public int deleteOldSessions(int daysOld) throws SQLException {
        String sql = "DELETE FROM sessions WHERE last_accessed < NOW() - INTERVAL '" + daysOld + " days'";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            return stmt.executeUpdate();
        }
    }
}
