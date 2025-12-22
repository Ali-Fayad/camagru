package com.camagru.repositories;

import com.camagru.config.DatabaseConfig;
import com.camagru.models.Like;

import java.sql.*;

/**
 * Like repository for database operations.
 * PHP equivalent: PDO with like queries
 */
public class LikeRepository {
    
    /**
     * Toggle like on image (like if not liked, unlike if already liked).
     * PHP equivalent: INSERT ... ON CONFLICT or DELETE
     */
    public boolean toggleLike(Integer userId, Integer imageId) throws SQLException {
        // Check if already liked
        if (isLiked(userId, imageId)) {
            // Unlike
            String deleteSql = "DELETE FROM likes WHERE user_id = ? AND image_id = ?";
            
            try (Connection conn = DatabaseConfig.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(deleteSql)) {
                
                stmt.setInt(1, userId);
                stmt.setInt(2, imageId);
                
                stmt.executeUpdate();
                return false; // Unliked
            }
        } else {
            // Like
            String insertSql = "INSERT INTO likes (user_id, image_id) VALUES (?, ?)";
            
            try (Connection conn = DatabaseConfig.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(insertSql)) {
                
                stmt.setInt(1, userId);
                stmt.setInt(2, imageId);
                
                stmt.executeUpdate();
                return true; // Liked
            }
        }
    }
    
    /**
     * Check if user has liked image.
     */
    public boolean isLiked(Integer userId, Integer imageId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM likes WHERE user_id = ? AND image_id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, userId);
            stmt.setInt(2, imageId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        }
        
        return false;
    }
    
    /**
     * Get like count for image.
     */
    public int getLikeCount(Integer imageId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM likes WHERE image_id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, imageId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }
        
        return 0;
    }
}
