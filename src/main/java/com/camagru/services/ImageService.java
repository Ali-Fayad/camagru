package com.camagru.services;

import com.camagru.config.AppConfig;
import com.camagru.models.Image;
import com.camagru.repositories.ImageRepository;
import com.camagru.utils.FileUtil;
import com.camagru.utils.ImageUtil;
import com.camagru.utils.ValidationUtil;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Base64;

/**
 * Image service for image upload and processing.
 */
public class ImageService {
    private final ImageRepository imageRepository;
    
    public ImageService() {
        this.imageRepository = new ImageRepository();
    }
    
    /**
     * Upload and process image with sticker.
     * 
     * @param userId User ID
     * @param base64Image Base64-encoded image data
     * @param stickerIndex Sticker to apply (0-based)
     * @param useWebcam Whether image is from webcam
     * @return Created image record
     */
        public Image uploadImage(Integer userId, String base64Image, Integer stickerIndex, boolean useWebcam, String caption) 
            throws SQLException, IOException {
        
        // Validate sticker index against available stickers
        if (stickerIndex == null) {
            throw new IllegalArgumentException("Sticker index is required");
        }
        
        // Decode base64 image
        String imageData = base64Image;
        if (base64Image.contains(",")) {
            imageData = base64Image.split(",")[1];
        }
        
        byte[] imageBytes = Base64.getDecoder().decode(imageData);
        
        // Validate image size
        if (!ImageUtil.isValidImageSize(imageBytes, AppConfig.MAX_UPLOAD_SIZE)) {
            throw new IllegalArgumentException("Image size exceeds limit of 5MB");
        }
        
        // Validate image type
        if (!ImageUtil.isValidImageType(imageBytes)) {
            throw new IllegalArgumentException("Invalid image format. Only JPEG and PNG are allowed");
        }
        
        // Get sticker path (dynamic from sticker directory)
        String stickerPath = com.camagru.utils.StickerUtil.getStickerPathByIndex(stickerIndex);
        if (stickerPath == null) {
            throw new IllegalArgumentException("Invalid sticker index or sticker not found");
        }
        
        // Merge image with sticker
        byte[] mergedImageBytes = ImageUtil.mergeImages(imageBytes, stickerPath);
        
        // Sanitize caption
        String safeCaption = null;
        if (caption != null) {
            safeCaption = ValidationUtil.escapeHtml(caption).trim();
            if (safeCaption.length() > 500) {
                throw new IllegalArgumentException("Caption too long (max 500 chars)");
            }
        }

        // Save merged image to filesystem
        String uploadDir = getUploadDirectory();
        String storedFilename = FileUtil.saveBase64Image(
            Base64.getEncoder().encodeToString(mergedImageBytes), 
            uploadDir
        );
        
        // Save image record to database
        String originalFilename = useWebcam ? "webcam_capture.jpg" : "upload.jpg";
        Image image = imageRepository.create(userId, originalFilename, storedFilename, safeCaption, stickerIndex);
        
        return image;
    }
    
    /**
     * Delete image (file and database record).
     */
    public boolean deleteImage(Integer imageId, Integer userId) throws SQLException {
        // Check ownership
        if (!imageRepository.isOwner(imageId, userId)) {
            throw new IllegalArgumentException("Unauthorized");
        }
        
        // Get image record
        Image image = imageRepository.findById(imageId);
        if (image == null) {
            return false;
        }
        
        // Delete file
        String filePath = getUploadDirectory() + "/" + image.getStoredFilename();
        FileUtil.deleteFile(filePath);
        
        // Delete database record
        return imageRepository.delete(imageId);
    }
    
    /**
     * Get image by ID.
     */
    public Image getImageById(Integer imageId) throws SQLException {
        return imageRepository.findById(imageId);
    }
    
    /**
     * Get sticker file path.
     */
    private String getStickerPath(Integer index) {
        // Stickers are stored as: /stickers/0_cat_ears.png, /stickers/1_glasses.png, etc.
        String stickerDir = getStickerDirectory();
        
        // For simplicity, use index as filename pattern
        // In production, you might want to load sticker config from JSON
        String[] stickerNames = {
            "0_cat_ears.png",
            "1_glasses.png", 
            "2_mustache.png",
            "3_crown.png",
            "4_heart.png"
        };
        
        if (index < stickerNames.length) {
            return stickerDir + "/" + stickerNames[index];
        } else {
            // Fallback pattern
            return stickerDir + "/" + index + "_sticker.png";
        }
    }
    
    /**
     * Get upload directory path.
     * PHP equivalent: __DIR__ . '/uploads'
     */
    private String getUploadDirectory() {
        // In servlet context, this should be webapp/uploads
        // For now, use relative path (will be overridden by Docker volume)
        return System.getProperty("catalina.base", ".") + "/webapps/ROOT" + AppConfig.UPLOAD_DIR;
    }
    
    /**
     * Get sticker directory path.
     */
    private String getStickerDirectory() {
        return System.getProperty("catalina.base", ".") + "/webapps/ROOT" + AppConfig.STICKER_DIR;
    }
}
