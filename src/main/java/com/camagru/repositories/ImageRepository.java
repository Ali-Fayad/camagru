package com.camagru.repositories;

import com.camagru.config.DatabaseConfig;
import com.camagru.models.Image;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Image repository for database operations.
 * PHP equivalent: PDO with image queries
 */
public class ImageRepository {
    
    /**
     * Create new image record.
     */
    public Image create(Integer userId, String originalFilename, String storedFilename, String caption, Integer stickerIndex) throws SQLException {
        String sql = "INSERT INTO images (user_id, original_filename, stored_filename, caption, sticker_index) " +
                     "VALUES (?, ?, ?, ?, ?) RETURNING id, created_at";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, userId);
            stmt.setString(2, originalFilename);
            stmt.setString(3, storedFilename);
            stmt.setString(4, caption);
            stmt.setInt(5, stickerIndex);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Image image = new Image();
                    image.setId(rs.getInt("id"));
                    image.setUserId(userId);
                    image.setOriginalFilename(originalFilename);
                    image.setStoredFilename(storedFilename);
                    image.setCaption(caption);
                    image.setStickerIndex(stickerIndex);
                    image.setCreatedAt(rs.getTimestamp("created_at"));
                    return image;
                }
            }
        }
        
        return null;
    }
    
    /**
     * Find image by ID.
     */
    public Image findById(Integer id) throws SQLException {
        String sql = "SELECT * FROM images WHERE id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToImage(rs);
                }
            }
        }
        
        return null;
    }
    
    /**
     * Get images for gallery (with pagination).
     * PHP equivalent: SELECT with LIMIT and timestamp cursor
     */
    public List<Image> findForGallery(Timestamp cursor, int limit) throws SQLException {
        String sql;
        
        if (cursor == null) {
            sql = "SELECT * FROM images ORDER BY created_at DESC LIMIT ?";
        } else {
            sql = "SELECT * FROM images WHERE created_at < ? ORDER BY created_at DESC LIMIT ?";
        }
        
        List<Image> images = new ArrayList<>();
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            if (cursor == null) {
                stmt.setInt(1, limit);
            } else {
                stmt.setTimestamp(1, cursor);
                stmt.setInt(2, limit);
            }
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    images.add(mapResultSetToImage(rs));
                }
            }
        }
        
        return images;
    }
    
    /**
     * Get user's images.
     */
    public List<Image> findByUserId(Integer userId) throws SQLException {
        String sql = "SELECT * FROM images WHERE user_id = ? ORDER BY created_at DESC";
        
        List<Image> images = new ArrayList<>();
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, userId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    images.add(mapResultSetToImage(rs));
                }
            }
        }
        
        return images;
    }
    
    /**
     * Delete image.
     */
    public boolean delete(Integer id) throws SQLException {
        String sql = "DELETE FROM images WHERE id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            
            return stmt.executeUpdate() > 0;
        }
    }
    
    /**
     * Check if user owns image.
     */
    public boolean isOwner(Integer imageId, Integer userId) throws SQLException {        String sql = "SELECT COUNT(*) FROM images WHERE id = ? AND user_id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, imageId);
            stmt.setInt(2, userId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        }
        
        return false;
    }
    
    /**
     * Count images by user ID.
     */
    public int countByUserId(Integer userId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM images WHERE user_id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, userId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }
        
        return 0;
    }
    
    /**
     * Map ResultSet to Image object.
     */
    private Image mapResultSetToImage(ResultSet rs) throws SQLException {
        Image image = new Image();
        image.setId(rs.getInt("id"));
        image.setUserId(rs.getInt("user_id"));
        image.setOriginalFilename(rs.getString("original_filename"));
        image.setStoredFilename(rs.getString("stored_filename"));
        image.setCaption(rs.getString("caption"));
        image.setStickerIndex(rs.getInt("sticker_index"));
        image.setCreatedAt(rs.getTimestamp("created_at"));
        return image;
    }
}
