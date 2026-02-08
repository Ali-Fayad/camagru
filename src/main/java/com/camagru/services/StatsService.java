package com.camagru.services;

import com.camagru.repositories.ImageRepository;
import com.camagru.repositories.CommentRepository;
import com.camagru.repositories.LikeRepository;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

/**
 * Stats service for user statistics.
 */
public class StatsService {
    private final ImageRepository imageRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    
    public StatsService() {
        this.imageRepository = new ImageRepository();
        this.commentRepository = new CommentRepository();
        this.likeRepository = new LikeRepository();
    }
    
    /**
     * Get user statistics (total posts, likes received, comments received).
     */
    public Map<String, Object> getUserStats(Integer userId) throws SQLException {
        Map<String, Object> stats = new HashMap<>();
        
        // Total images created by user
        int imageCount = imageRepository.countByUserId(userId);
        
        // Total likes received on user's images
        int likesReceived = likeRepository.countLikesForUser(userId);
        
        // Total comments received on user's images
        int commentsReceived = commentRepository.countCommentsForUser(userId);
        
        stats.put("imageCount", imageCount);
        stats.put("totalLikesReceived", likesReceived);
        stats.put("totalCommentsReceived", commentsReceived);
        
        return stats;
    }
}
