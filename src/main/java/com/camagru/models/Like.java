package com.camagru.models;

import java.sql.Timestamp;

/**
 * Like entity model.
 * Maps to likes table in database.
 */
public class Like {
    private Integer id;
    private Integer userId;
    private Integer imageId;
    private Timestamp createdAt;

    // Constructors
    public Like() {}

    public Like(Integer userId, Integer imageId) {
        this.userId = userId;
        this.imageId = imageId;
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

    public Integer getImageId() {
        return imageId;
    }

    public void setImageId(Integer imageId) {
        this.imageId = imageId;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
