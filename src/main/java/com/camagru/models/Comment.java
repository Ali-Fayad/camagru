package com.camagru.models;

import java.sql.Timestamp;

/**
 * Comment entity model.
 * Maps to comments table in database.
 */
public class Comment {
    private Integer id;
    private Integer userId;
    private Integer imageId;
    private String content;
    private Timestamp createdAt;
    
    // Optional: username for display (not from table, loaded via JOIN)
    private String username;

    // Constructors
    public Comment() {}

    public Comment(Integer userId, Integer imageId, String content) {
        this.userId = userId;
        this.imageId = imageId;
        this.content = content;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
