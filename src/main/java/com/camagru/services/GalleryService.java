package com.camagru.services;

import com.camagru.config.AppConfig;
import com.camagru.dtos.responses.ImageResponse;
import com.camagru.models.Image;
import com.camagru.models.User;
import com.camagru.repositories.CommentRepository;
import com.camagru.repositories.ImageRepository;
import com.camagru.repositories.LikeRepository;
import com.camagru.repositories.UserRepository;

import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Gallery service for browsing images.
 * Handles infinite scroll pagination.
 */
public class GalleryService {
    private final ImageRepository imageRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    
    public GalleryService() {
        this.imageRepository = new ImageRepository();
        this.likeRepository = new LikeRepository();
        this.commentRepository = new CommentRepository();
        this.userRepository = new UserRepository();
    }
    
    /**
     * Get gallery images with infinite scroll.
     * 
     * @param cursor Timestamp cursor for pagination (null for first page)
     * @param limit Number of images to fetch
     * @param currentUserId Current user ID (null if not logged in)
     * @return List of image responses with metadata
     */
    public List<ImageResponse> getGalleryImages(Timestamp cursor, Integer limit, Integer currentUserId) 
            throws SQLException {
        
        // Validate and cap limit
        if (limit == null || limit < AppConfig.GALLERY_DEFAULT_LIMIT) {
            limit = AppConfig.GALLERY_DEFAULT_LIMIT;
        }
        if (limit > AppConfig.GALLERY_MAX_LIMIT) {
            limit = AppConfig.GALLERY_MAX_LIMIT;
        }
        
        // Fetch images
        List<Image> images = imageRepository.findForGallery(cursor, limit);
        
        // Build response DTOs
        List<ImageResponse> responses = new ArrayList<>();
        for (Image image : images) {
            ImageResponse response = buildImageResponse(image, currentUserId);
            responses.add(response);
        }
        
        return responses;
    }
    
    /**
     * Get single image with details.
     */
    public ImageResponse getImageDetails(Integer imageId, Integer currentUserId) throws SQLException {
        Image image = imageRepository.findById(imageId);
        if (image == null) {
            return null;
        }
        
        return buildImageResponse(image, currentUserId);
    }
    
    /**
     * Build image response DTO with all metadata.
     */
    private ImageResponse buildImageResponse(Image image, Integer currentUserId) throws SQLException {
        ImageResponse response = new ImageResponse();
        
        response.setId(image.getId());
        response.setUserId(image.getUserId());
        response.setStickerIndex(image.getStickerIndex());
        response.setCreatedAt(image.getCreatedAt().toString());
        
        // Get username
        User user = userRepository.findById(image.getUserId());
        if (user != null) {
            response.setUsername(user.getUsername());
        }
        
        // Build image URL
        response.setImageUrl("/uploads/" + image.getStoredFilename());
        
        // Get like count
        int likeCount = likeRepository.getLikeCount(image.getId());
        response.setLikeCount(likeCount);
        
        // Check if current user liked
        if (currentUserId != null) {
            boolean isLiked = likeRepository.isLiked(currentUserId, image.getId());
            response.setLikedByCurrentUser(isLiked);
        } else {
            response.setLikedByCurrentUser(false);
        }
        
        // Get comment count
        int commentCount = commentRepository.getCommentCount(image.getId());
        response.setCommentCount(commentCount);
        
        return response;
    }
}
