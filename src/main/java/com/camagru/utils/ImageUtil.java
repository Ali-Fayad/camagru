package com.camagru.utils;

import com.camagru.dtos.StickerPlacement;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.List;

/**
 * Image processing utility using Java2D.
 * PHP equivalent: GD library (imagecreatefromjpeg, imagecopy, etc.)
 */
public class ImageUtil {
    
    /**
     * Merge user image with sticker using alpha compositing.
     * PHP equivalent: imagecopy() with alpha channel
     * 
     * @param userImageBytes User's uploaded or webcam image
     * @param stickerPath Path to sticker PNG file
     * @return Merged image as JPEG bytes
     */
    public static byte[] mergeImages(byte[] userImageBytes, String stickerPath) throws IOException {
        // Load user image
        BufferedImage userImage = ImageIO.read(new ByteArrayInputStream(userImageBytes));
        if (userImage == null) {
            throw new IOException("Failed to read user image");
        }
        
        // Load sticker
        File stickerFile = new File(stickerPath);
        BufferedImage sticker = ImageIO.read(stickerFile);
        if (sticker == null) {
            throw new IOException("Failed to read sticker image");
        }
        
        // Calculate sticker dimensions (30% of user image width)
        int userWidth = userImage.getWidth();
        int userHeight = userImage.getHeight();
        int stickerWidth = (int) (userWidth * 0.3);
        int stickerHeight = (int) (sticker.getHeight() * ((double) stickerWidth / sticker.getWidth()));
        
        // Resize sticker
        BufferedImage resizedSticker = resizeImage(sticker, stickerWidth, stickerHeight);
        
        // Position: center of image
        int x = (userWidth - stickerWidth) / 2;
        int y = (userHeight - stickerHeight) / 2;
        
        // Create result image (RGB for JPEG output)
        BufferedImage result = new BufferedImage(userWidth, userHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = result.createGraphics();
        
        // Draw user image
        g2d.drawImage(userImage, 0, 0, null);
        
        // Enable alpha compositing for transparency
        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER));
        
        // Draw sticker on top
        g2d.drawImage(resizedSticker, x, y, null);
        
        g2d.dispose();
        
        // Convert to JPEG bytes
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(result, "jpg", baos);
        return baos.toByteArray();
    }
    
    /**
     * Merge user image with multiple stickers at custom positions.
     * 
     * @param userImageBytes User's uploaded or webcam image
     * @param stickerPlacements List of sticker placements with positions
     * @return Merged image as JPEG bytes
     */
    public static byte[] mergeImagesWithStickers(byte[] userImageBytes, List<StickerPlacement> stickerPlacements) throws IOException {
        // Load user image
        BufferedImage userImage = ImageIO.read(new ByteArrayInputStream(userImageBytes));
        if (userImage == null) {
            throw new IOException("Failed to read user image");
        }
        
        int userWidth = userImage.getWidth();
        int userHeight = userImage.getHeight();
        
        // Create result image (RGB for JPEG output)
        BufferedImage result = new BufferedImage(userWidth, userHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = result.createGraphics();
        
        // Draw user image as base
        g2d.drawImage(userImage, 0, 0, null);
        
        // Enable alpha compositing for transparency
        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER));
        
        // Set high quality rendering
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        // Draw each sticker
        for (StickerPlacement placement : stickerPlacements) {
            String stickerPath = StickerUtil.getStickerPathByIndex(placement.getStickerIndex());
            if (stickerPath == null) {
                continue; // Skip invalid stickers
            }
            
            // Load sticker
            File stickerFile = new File(stickerPath);
            BufferedImage sticker = ImageIO.read(stickerFile);
            if (sticker == null) {
                continue; // Skip if failed to load
            }
            
            // Calculate absolute positions and sizes from relative values
            int x = (int) (placement.getX() * userWidth);
            int y = (int) (placement.getY() * userHeight);
            int width = (int) (placement.getWidth() * userWidth);
            int height = (int) (placement.getHeight() * userHeight);
            
            // Resize sticker
            BufferedImage resizedSticker = resizeImage(sticker, width, height);
            
            // Draw sticker at specified position
            g2d.drawImage(resizedSticker, x, y, null);
        }
        
        g2d.dispose();
        
        // Convert to JPEG bytes
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(result, "jpg", baos);
        return baos.toByteArray();
    }
    
    /**
     * Resize image maintaining aspect ratio.
     * PHP equivalent: imagescale()
     */
    private static BufferedImage resizeImage(BufferedImage original, int targetWidth, int targetHeight) {
        BufferedImage resized = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d = resized.createGraphics();
        
        // High quality rendering
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        g2d.drawImage(original, 0, 0, targetWidth, targetHeight, null);
        g2d.dispose();
        
        return resized;
    }
    
    /**
     * Validate image MIME type from bytes.
     * PHP equivalent: mime_content_type() or getimagesize()
     */
    public static boolean isValidImageType(byte[] imageBytes) {
        try {
            BufferedImage img = ImageIO.read(new ByteArrayInputStream(imageBytes));
            return img != null;
        } catch (IOException e) {
            return false;
        }
    }
    
    /**
     * Check if image size is within limits.
     */
    public static boolean isValidImageSize(byte[] imageBytes, long maxSizeBytes) {
        return imageBytes.length <= maxSizeBytes;
    }
}
