package com.camagru.models;

import java.sql.Timestamp;

/**
 * Image entity model.
 * Maps to images table in database.
 */
public class Image {
    private Integer id;
    private Integer userId;
    private String originalFilename;
    private String storedFilename;
    private Integer stickerIndex;
    private Timestamp createdAt;

    // Constructors
    public Image() {}

    public Image(Integer id, Integer userId, String storedFilename, Integer stickerIndex) {
        this.id = id;
        this.userId = userId;
        this.storedFilename = storedFilename;
        this.stickerIndex = stickerIndex;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public String getStoredFilename() {
        return storedFilename;
    }

    public void setStoredFilename(String storedFilename) {
        this.storedFilename = storedFilename;
    }

    public Integer getStickerIndex() {
        return stickerIndex;
    }

    public void setStickerIndex(Integer stickerIndex) {
        this.stickerIndex = stickerIndex;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
