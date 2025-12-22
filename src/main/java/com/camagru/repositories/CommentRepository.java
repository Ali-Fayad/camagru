package com.camagru.repositories;

import com.camagru.config.DatabaseConfig;
import com.camagru.models.Comment;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Comment repository for database operations.
 * PHP equivalent: PDO with comment queries
 */
public class CommentRepository {
    
    /**
     * Create new comment.
     */
    public Comment create(Integer userId, Integer imageId, String content) throws SQLException {
        String sql = "INSERT INTO comments (user_id, image_id, content) " +
                     "VALUES (?, ?, ?) RETURNING id, created_at";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, userId);
            stmt.setInt(2, imageId);
            stmt.setString(3, content);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Comment comment = new Comment();
                    comment.setId(rs.getInt("id"));
                    comment.setUserId(userId);
                    comment.setImageId(imageId);
                    comment.setContent(content);
                    comment.setCreatedAt(rs.getTimestamp("created_at"));
                    return comment;
                }
            }
        }
        
        return null;
    }
    
    /**
     * Get comments for image (with username via JOIN).
     */
    public List<Comment> findByImageId(Integer imageId) throws SQLException {
        String sql = "SELECT c.*, u.username FROM comments c " +
                     "JOIN users u ON c.user_id = u.id " +
                     "WHERE c.image_id = ? " +
                     "ORDER BY c.created_at DESC";
        
        List<Comment> comments = new ArrayList<>();
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, imageId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Comment comment = new Comment();
                    comment.setId(rs.getInt("id"));
                    comment.setUserId(rs.getInt("user_id"));
                    comment.setImageId(rs.getInt("image_id"));
                    comment.setContent(rs.getString("content"));
                    comment.setCreatedAt(rs.getTimestamp("created_at"));
                    comment.setUsername(rs.getString("username"));
                    comments.add(comment);
                }
            }
        }
        
        return comments;
    }
    
    /**
     * Get comment count for image.
     */
    public int getCommentCount(Integer imageId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM comments WHERE image_id = ?";
        
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
    
    /**
     * Delete comment (for moderation or user deletion).
     */
    public boolean delete(Integer id) throws SQLException {
        String sql = "DELETE FROM comments WHERE id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            
            return stmt.executeUpdate() > 0;
        }
    }
}
