package com.camagru.repositories;

import com.camagru.config.DatabaseConfig;
import com.camagru.models.User;

import java.sql.*;

/**
 * User repository for database operations.
 * DAO pattern with JDBC.
 * PHP equivalent: PDO with user queries
 */
public class UserRepository {
    
    /**
     * Find user by email.
     * PHP equivalent: $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?")
     */
    public User findByEmail(String email) throws SQLException {
        String sql = "SELECT * FROM users WHERE email = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, email);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToUser(rs);
                }
            }
        }
        
        return null;
    }
    
    /**
     * Find user by username.
     */
    public User findByUsername(String username) throws SQLException {
        String sql = "SELECT * FROM users WHERE username = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, username);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToUser(rs);
                }
            }
        }
        
        return null;
    }
    
    /**
     * Find user by ID.
     */
    public User findById(Integer id) throws SQLException {
        String sql = "SELECT * FROM users WHERE id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToUser(rs);
                }
            }
        }
        
        return null;
    }
    
    /**
     * Create new user.
     * PHP equivalent: $stmt->execute([$username, $email, $hash])
     */
    public User create(String username, String email, String passwordHash, String verificationCode, Timestamp verificationExpiry) throws SQLException {
        String sql = "INSERT INTO users (username, email, password_hash, verification_code, verification_expiry) " +
                     "VALUES (?, ?, ?, ?, ?) RETURNING id, created_at, updated_at";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, username);
            stmt.setString(2, email);
            stmt.setString(3, passwordHash);
            stmt.setString(4, verificationCode);
            stmt.setTimestamp(5, verificationExpiry);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    User user = new User();
                    user.setId(rs.getInt("id"));
                    user.setUsername(username);
                    user.setEmail(email);
                    user.setPasswordHash(passwordHash);
                    user.setVerificationCode(verificationCode);
                    user.setVerificationExpiry(verificationExpiry);
                    user.setVerified(false);
                    user.setReceiveNotifications(true);
                    user.setCreatedAt(rs.getTimestamp("created_at"));
                    user.setUpdatedAt(rs.getTimestamp("updated_at"));
                    return user;
                }
            }
        }
        
        return null;
    }
    
    /**
     * Verify user by email and verification code.
     */
    public boolean verifyUser(String email, String verificationCode) throws SQLException {
        String sql = "UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_expiry = NULL " +
                     "WHERE email = ? AND verification_code = ? AND verification_expiry > NOW()";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, email);
            stmt.setString(2, verificationCode);
            
            return stmt.executeUpdate() > 0;
        }
    }
    
    /**
     * Set password reset token.
     */
    public boolean setResetToken(String email, String token, Timestamp expiry) throws SQLException {
        String sql = "UPDATE users SET reset_token = ?, reset_expiry = ? WHERE email = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, token);
            stmt.setTimestamp(2, expiry);
            stmt.setString(3, email);
            
            return stmt.executeUpdate() > 0;
        }
    }
    
    /**
     * Reset password with token.
     */
    public boolean resetPassword(String token, String newPasswordHash) throws SQLException {
        String sql = "UPDATE users SET password_hash = ?, reset_token = NULL, reset_expiry = NULL " +
                     "WHERE reset_token = ? AND reset_expiry > NOW()";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, newPasswordHash);
            stmt.setString(2, token);
            
            return stmt.executeUpdate() > 0;
        }
    }
    
    /**
     * Update username.
     */
    public boolean updateUsername(Integer userId, String newUsername) throws SQLException {
        String sql = "UPDATE users SET username = ? WHERE id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, newUsername);
            stmt.setInt(2, userId);
            
            return stmt.executeUpdate() > 0;
        }
    }
    
    /**
     * Update email.
     */
    public boolean updateEmail(Integer userId, String newEmail) throws SQLException {
        String sql = "UPDATE users SET email = ? WHERE id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, newEmail);
            stmt.setInt(2, userId);
            
            return stmt.executeUpdate() > 0;
        }
    }
    
    /**
     * Update password.
     */
    public boolean updatePassword(Integer userId, String newPasswordHash) throws SQLException {
        String sql = "UPDATE users SET password_hash = ? WHERE id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, newPasswordHash);
            stmt.setInt(2, userId);
            
            return stmt.executeUpdate() > 0;
        }
    }
    
    /**
     * Toggle notifications.
     */
    public boolean updateNotifications(Integer userId, boolean receiveNotifications) throws SQLException {
        String sql = "UPDATE users SET receive_notifications = ? WHERE id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setBoolean(1, receiveNotifications);
            stmt.setInt(2, userId);
            
            return stmt.executeUpdate() > 0;
        }
    }
    
    /**
     * Delete user account.
     * Cascade deletes will handle related data (images, comments, likes, sessions).
     */
    public boolean deleteUser(Integer userId) throws SQLException {
        String sql = "DELETE FROM users WHERE id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, userId);
            
            return stmt.executeUpdate() > 0;
        }
    }
    
    /**
     * Map ResultSet to User object.
     */
    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setUsername(rs.getString("username"));
        user.setEmail(rs.getString("email"));
        user.setPasswordHash(rs.getString("password_hash"));
        user.setVerified(rs.getBoolean("is_verified"));
        user.setVerificationCode(rs.getString("verification_code"));
        user.setVerificationExpiry(rs.getTimestamp("verification_expiry"));
        user.setResetToken(rs.getString("reset_token"));
        user.setResetExpiry(rs.getTimestamp("reset_expiry"));
        user.setReceiveNotifications(rs.getBoolean("receive_notifications"));
        user.setCreatedAt(rs.getTimestamp("created_at"));
        user.setUpdatedAt(rs.getTimestamp("updated_at"));
        return user;
    }
}
