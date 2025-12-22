package com.camagru.models;

import java.sql.Timestamp;

/**
 * Session entity model.
 * Maps to sessions table in database.
 * Database-backed session storage.
 */
public class Session {
    private String id;
    private Integer userId;
    private String data;
    private Timestamp lastAccessed;
    private Timestamp createdAt;

    // Constructors
    public Session() {}

    public Session(String id, Integer userId) {
        this.id = id;
        this.userId = userId;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public Timestamp getLastAccessed() {
        return lastAccessed;
    }

    public void setLastAccessed(Timestamp lastAccessed) {
        this.lastAccessed = lastAccessed;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
