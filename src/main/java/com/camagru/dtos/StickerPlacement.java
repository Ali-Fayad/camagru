package com.camagru.dtos;

/**
 * DTO representing a sticker placed on an image.
 * Coordinates and dimensions are relative values (0.0 to 1.0) representing
 * position and size as percentage of the image dimensions.
 */
public class StickerPlacement {
    private int stickerIndex;
    private double x;      // X position as fraction of image width (0.0-1.0)
    private double y;      // Y position as fraction of image height (0.0-1.0)
    private double width;  // Width as fraction of image width (0.0-1.0)
    private double height; // Height as fraction of image height (0.0-1.0)
    
    public StickerPlacement() {}
    
    public StickerPlacement(int stickerIndex, double x, double y, double width, double height) {
        this.stickerIndex = stickerIndex;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    public int getStickerIndex() {
        return stickerIndex;
    }
    
    public void setStickerIndex(int stickerIndex) {
        this.stickerIndex = stickerIndex;
    }
    
    public double getX() {
        return x;
    }
    
    public void setX(double x) {
        this.x = x;
    }
    
    public double getY() {
        return y;
    }
    
    public void setY(double y) {
        this.y = y;
    }
    
    public double getWidth() {
        return width;
    }
    
    public void setWidth(double width) {
        this.width = width;
    }
    
    public double getHeight() {
        return height;
    }
    
    public void setHeight(double height) {
        this.height = height;
    }
}
