package com.camagru.services;

import com.camagru.models.Comment;
import com.camagru.models.Image;
import com.camagru.models.User;
import com.camagru.repositories.CommentRepository;
import com.camagru.repositories.ImageRepository;
import com.camagru.repositories.LikeRepository;
import com.camagru.repositories.UserRepository;
import com.camagru.utils.ValidationUtil;

import java.sql.SQLException;
import java.util.List;

/**
 * Comment and like service.
 */
public class CommentService {
    private final CommentRepository commentRepository;
    private final ImageRepository imageRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final EmailService emailService;
    
    public CommentService() {
        this.commentRepository = new CommentRepository();
        this.imageRepository = new ImageRepository();
        this.userRepository = new UserRepository();
        this.likeRepository = new LikeRepository();
        this.emailService = new EmailService();
    }
    
    /**
     * Add comment to image and send notification if enabled.
     */
    public Comment addComment(Integer userId, Integer imageId, String content) throws SQLException {
        // Validate content
        if (!ValidationUtil.isValidComment(content)) {
            throw new IllegalArgumentException("Comment must be between 1 and 500 characters");
        }
        
        // Sanitize content
        String sanitizedContent = ValidationUtil.escapeHtml(content);
        
        // Check if image exists
        Image image = imageRepository.findById(imageId);
        if (image == null) {
            throw new IllegalArgumentException("Image not found");
        }
        
        // Create comment
        Comment comment = commentRepository.create(userId, imageId, sanitizedContent);
        
        // Send notification to image owner if enabled
        if (!image.getUserId().equals(userId)) {  // Don't notify if commenting on own image
            User imageOwner = userRepository.findById(image.getUserId());
            if (imageOwner != null && imageOwner.isReceiveNotifications()) {
                User commenter = userRepository.findById(userId);
                if (commenter != null) {
                    emailService.sendCommentNotification(
                        imageOwner.getEmail(),
                        imageOwner.getUsername(),
                        commenter.getUsername(),
                        imageId.toString()
                    );
                }
            }
        }
        
        return comment;
    }
    
    /**
     * Get comments for image.
     */
    public List<Comment> getComments(Integer imageId) throws SQLException {
        return commentRepository.findByImageId(imageId);
    }
    
    /**
     * Toggle like on image.
     * 
     * @return true if liked, false if unliked
     */
    public boolean toggleLike(Integer userId, Integer imageId) throws SQLException {
        // Check if image exists
        Image image = imageRepository.findById(imageId);
        if (image == null) {
            throw new IllegalArgumentException("Image not found");
        }
        
        return likeRepository.toggleLike(userId, imageId);
    }
    
    /**
     * Get like count for image.
     */
    public int getLikeCount(Integer imageId) throws SQLException {
        return likeRepository.getLikeCount(imageId);
    }
}
