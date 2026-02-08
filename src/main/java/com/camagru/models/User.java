package com.camagru.models;

import java.sql.Timestamp;

/**
 * User entity model.
 * Maps to users table in database.
 */
public class User {
    private Integer id;
    private String username;
    private String email;
    private String passwordHash;
    private boolean isVerified;
    private String verificationCode;
    private Timestamp verificationExpiry;
    private String resetToken;
    private Timestamp resetExpiry;
    private boolean receiveNotifications;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Constructors
    public User() {}

    public User(Integer id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public Timestamp getVerificationExpiry() {
        return verificationExpiry;
    }

    public void setVerificationExpiry(Timestamp verificationExpiry) {
        this.verificationExpiry = verificationExpiry;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public Timestamp getResetExpiry() {
        return resetExpiry;
    }

    public void setResetExpiry(Timestamp resetExpiry) {
        this.resetExpiry = resetExpiry;
    }

    public boolean isReceiveNotifications() {
        return receiveNotifications;
    }

    public void setReceiveNotifications(boolean receiveNotifications) {
        this.receiveNotifications = receiveNotifications;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}
